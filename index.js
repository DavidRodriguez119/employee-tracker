// Dependencies
const mysql = require(`mysql2`);
const inquirer = require(`inquirer`);

// create a connection to the data base 
const connection = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: `DavidSRRGZMCM#119`,
    database: `buisness_db`
});

// options to prompt the user
const menu = [
    `View all departments`, 
    `View all roles`,
    `View all employees`,
    `Add a department`,
    `Add a role`,
    `Add an employee`,
    `Update an employee role`
];

// Function that runs when the app is initiated
const displayOptions = () => {
    // display the options menu
    inquirer.prompt({
        name: `options`,
        message: `What would you like to do?`,
        type: `list`,
        choices: menu,
    }).then((ans) => {
        // use the user's answer to run the respective function
        if(ans.options === `View all departments`){
            allDepartments();
        } else if(ans.options === `View all roles`){
            allRoles();
        } else if (ans.options === `View all employees`){
            allEmployees();
        } else if (ans.options === `Add a department`){
            addDepartment();
        } else if (ans.options === `Add a role`){
            addRole();
        } else if (ans.options === `Add an employee`){
            addEmployee();
        } else if (ans.options === `Update an employee role`){
            updateRole();
        }
    })
}

// View all Departments
const allDepartments = () => {
    connection.query(
        `SELECT * FROM departments`, (err, results) => {
            console.log(err);
            console.table(results, [`id`, `name`]);
            // go back to the main menu
            displayOptions();
        }
    )
};

// View all roles
const allRoles = () => {
    connection.query(
        `SELECT role.id, role.title, role.salary, departments.name AS department FROM role LEFT JOIN departments ON role.department_id = departments.id`, (err, results) => {
            console.log(err);
            console.table(results);
            // go back to the main menu
            displayOptions();
        }
    )
};

// View all Employees
const allEmployees = () => {
    connection.query(
        `SELECT e.id, e.first_name, e.last_name, 
            departments.name AS department, 
            role.title, role.salary, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name
            FROM employee e LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN departments ON role.department_id = departments.id
            LEFT JOIN employee m ON e.manager_id = m.id`, (err, results) => {
            console.log(err);
            console.table(results);
            // go back to the main menu
            displayOptions();
        }
    )
};

// Add a department
const addDepartment = () => {
    
    // go back to the main menu
    displayOptions();
};

// Add a role
const addRole = () => {
    
    // go back to the main menu
    displayOptions();
};

// Add an employee
const addEmployee = () => {
    
    // go back to the main menu
    displayOptions();
};

// Add an employee's role
const updateRole = () => {
    
    // go back to the main menu
    displayOptions();
};

displayOptions();
