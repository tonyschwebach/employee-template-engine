const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
// const { cpuUsage } = require("process");  //not sure where this came from

// array to hold team members
const team = [];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// function to ask user if they want to add a team member
const buildTeam = () => {
  console.log("--------------------------------");
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "addMember",
        message: "Add a member to your team? ",
      },
    ])
    .then((confirm) => {
      if (confirm.addMember) {
        employeePrompt();
      } else {
        writeToFolder();
      }
    });
};
// function to write file /create output folder if needed
const writeToFolder = () => {
  fs.writeFile(
    outputPath,
    render(team),
    (err) => {
      if (err) {
        fs.mkdir(OUTPUT_DIR, (err) =>
          err ? console.error(err) : writeToFolder()
        );
      } else {
        console.log("successfully written");
      }
    }
    // err ? console.error(err) : console.log("successfully written")
  );
};

// function to ask questions for the employee class properties
const employeePrompt = () =>
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Employee Name: ",
        // The user's input must be letters
        validate: (val) => {
          if (/^[a-zA-Z|\s]+$/gi.test(val)) {
            return true;
          } else {
            return "Must be letters. Please change your input.";
          }
        },
      },
      {
        type: "input",
        name: "id",
        message: "Employee ID number: ",
        // The user's input must be numbers
        validate: (val) => {
          if (/^\d*$/gi.test(val)) {
            return true;
          } else {
            return "Must be numeric. Please change your input.";
          }
        },
      },
      {
        type: "input",
        name: "email",
        message: "Employee email address: ",
        // The user's input must be an email address
        validate: (val) => {
          if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/gi.test(val)) {
            return true;
          } else {
            return "Invalid email address. Please change your input.";
          }
        },
      },
      {
        type: "list",
        name: "role",
        message: "Employee role: ",
        choices: ["Manager", "Engineer", "Intern"],
      },
    ])
    .then((employeeData) => {
      // ask specific questions based on employee role
      switch (employeeData.role) {
        case "Manager":
          managerPrompt(employeeData);
          break;
        case "Engineer":
          engineerPrompt(employeeData);
          break;
        case "Intern":
          internPrompt(employeeData);
          break;
      }
    });

// function to ask manager only questions
const managerPrompt = (employeeData) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "officeNumber",
        message: "Manager Office Number: ",
        // The users input must be numbers
        validate: (val) => {
          if (/^\d*$/gi.test(val)) {
            return true;
          } else {
            return "Must be numeric. Please change your input.";
          }
        },
      },
    ])
    .then((managerData) => {
      const manager = new Manager(
        employeeData.name,
        employeeData.id,
        employeeData.email,
        managerData.officeNumber
      );
      team.push(manager);
      buildTeam();
    });
};

// function to ask engineer only questions
const engineerPrompt = (employeeData) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "github",
        message: "Engineer Github username: ",
      },
    ])
    .then((engineerData) => {
      const engineer = new Engineer(
        employeeData.name,
        employeeData.id,
        employeeData.email,
        engineerData.github
      );
      team.push(engineer);
      buildTeam();
    });
};

// function to ask intern only questions
const internPrompt = (employeeData) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "school",
        message: "Intern School: ",
        // The user's input must be letters
        validate: (val) => {
          if (/^[a-zA-Z|\s]+$/gi.test(val)) {
            return true;
          } else {
            return "Must be letters. Please change your input.";
          }
        },
      },
    ])
    .then((internData) => {
      const intern = new Intern(
        employeeData.name,
        employeeData.id,
        employeeData.email,
        internData.school
      );
      team.push(intern);
      buildTeam();
    });
};

//call build team function when file is opened
console.log("--------------------------------");
console.log("Welcome! Let's build your team.");

buildTeam();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
