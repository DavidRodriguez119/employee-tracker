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
            if (err) {
                console.log(err);
            } else {
                console.table(results);
            }           
            // go back to the main menu
            displayOptions();
        }
    )
};

// View all roles
const allRoles = () => {
    connection.query(
        `SELECT role.id, role.title, role.salary, departments.name AS department FROM role LEFT JOIN departments ON role.department_id = departments.id`, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.table(results);
            }           
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
            if (err) {
                console.log(err);
            } else {
                console.table(results);
            }           
            // go back to the main menu
            displayOptions();
        }
    )
};

// Add a department
const addDepartment = () => {
    // ask the user for the name of the new department
    inquirer.prompt({
        name: `newDepartment`,
        message: `What is the name of the new department?`,
        type: `input`,
    }).then((ans) => {
        // add the new departments 
        connection.query(
            `INSERT INTO departments (name) VALUES (?)`,
            [ans.newDepartment],
            (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Added ${ans.newDepartment} to the database :)`);
                } 
                // go back to the main menu
                displayOptions();               
            }
        )
    })
};

// Add a role
const addRole = () => {
    let currentDepartments;
    let selectedId;
    // save the current departments into a variable
    connection.query(
        `SELECT * FROM departments`, (err, result) => {
            if (err) {
                console.log(err);
            }
            currentDepartments = result;

            const departmentNames = currentDepartments.map(item => item.name)

            // ask the user for the information of the new role
            inquirer.prompt([
                {
                    name: `newRole`,
                    message: `What is the name of the new role?`,
                    type: `input`,
                },
                {
                    name: `salary`,
                    message: `What is the salary of the new role?`,
                    type: `input`,
                },
                {
                    name: `departments`,
                    message: `Which department does the role belong to?`,
                    type: `list`,
                    choices: departmentNames,
                }
            ]).then((ans) => {
                // get the id of the department that the user selected
                for (let i = 0; i < departmentNames.length; i++) {
                    if (ans.departments === currentDepartments[i].name){
                        selectedId = currentDepartments[i].id
                    };
                };
                // add the new departments 
                connection.query(
                    `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                    [ans.newRole, ans.salary, selectedId],
                    (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`Added ${ans.newRole} to the database :)`);
                        }; 
                        // go back to the main menu
                        displayOptions();               
                    }
                )
            })
        }        
    );    
    
};

// Add an employee
const addEmployee = () => {
    let currentRoles;
    let currentManagers;
    let roleId;
    let managerId;
    // save the current roles into a variable
    connection.query(
        `SELECT role.id, role.title FROM role`, (err, result) => {
            if (err) {
                console.log(err);
            }
            currentRoles = result;

            const roleNames = currentRoles.map(item => item.title)
            
            connection.query(
                `SELECT employee.id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employee WHERE manager_id IS NULL`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    currentManagers = result;

                    const managerNames = currentManagers.map(item => item.manager_name) 
                    
                    managerNames.push(`None`);

                    // ask the user for the information of the new employee
                    inquirer.prompt([
                        {
                            name: `firstName`,
                            message: `What is the employee's first name?`,
                            type: `input`,
                        },
                        {
                            name: `lastName`,
                            message: `What is the employee's last name?`,
                            type: `input`,
                        },
                        {
                            name: `role`,
                            message: `What is the employee's role?`,
                            type: `list`,
                            choices: roleNames,
                        },
                        {
                            name: `manager`,
                            message: `Who is the employee's manager?`,
                            type: `list`,
                            choices: managerNames,
                        }
                    ]).then((ans) => {
                        // get the id of the role that the user selected
                        for (let i = 0; i < currentRoles.length; i++) {
                            if (ans.role === currentRoles[i].title){
                                roleId = currentRoles[i].id
                            };
                        };

                        // get the id of the manager that the user selected
                        for (let i = 0; i < currentManagers.length; i++) {
                            if (ans.manager == currentManagers[i].manager_name){
                                managerId = currentManagers[i].id
                            } else {
                                managerId = null
                            }
                        };
                        
                        // add the new departments 
                        connection.query(
                            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                            [ans.firstName, ans.lastName, roleId, managerId],
                            (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(`Added ${ans.firstName} ${ans.lastName} to the database :)`);
                                }; 
                                // go back to the main menu
                                displayOptions();               
                            }
                        )
                    })
                }
            )            
        }        
    );    
};

// Add an employee's role
const updateRole = () => {
    let currentRoles;
    let currentEmployees;
    let roleId;
    let employeeId;
    connection.query(
        `SELECT employee.id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employee`, (err, result) => {
            if (err) {
                console.log(err);
            };
            currentEmployees = result;
            const employeeNames = currentEmployees.map(item => item.employee_name) 

            connection.query(
                `SELECT role.id, role.title FROM role`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    currentRoles = result;
                    const roleNames = currentRoles.map(item => item.title)

                    inquirer.prompt([
                        {
                            name: `employee`,
                            message: `Which employee's role do you want to update?`,
                            type: `list`,
                            choices: employeeNames,
                        },
                        {
                            name: `newRole`,
                            message: `Which role do you want to assign to the selected employee?`,
                            type: `list`,
                            choices: roleNames,
                        },
                    ]).then((ans) => {
                        // get the id of the employee that the user selected
                        for (let i = 0; i < currentEmployees.length; i++) {
                            if (ans.employee == currentEmployees[i].employee_name){
                                employeeId = currentEmployees[i].id
                            };
                        };
                        // get the id of the new role that the user selected
                        for (let i = 0; i < currentRoles.length; i++) {
                            if (ans.newRole === currentRoles[i].title){
                                roleId = currentRoles[i].id
                            };
                        };
                        // update the role
                        connection.query(
                            `UPDATE employee 
                             SET role_id = ?
                             WHERE id = ?`,
                            [roleId, employeeId],
                            (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(`Updated employee's role :)`);
                                }; 
                                // go back to the main menu
                                displayOptions();               
                            }
                        )
                    })
                }
            )
        }
    );
};

displayOptions();
