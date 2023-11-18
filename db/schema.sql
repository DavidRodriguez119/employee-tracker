-- create the buisness db
DROP DATABASE IF EXISTS buisness_db;
CREATE DATABASE buisness_db;

USE buisness_db;

-- Create tables:

CREATE TABLE departments(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
     REFERENCES departments(id)
     ON DELETE CASCADE
);

CREATE TABLE employee(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id)
     REFERENCES role(id)
     ON DELETE CASCADE,
    FOREIGN KEY (manager_id)
     REFERENCES employee(id)
     ON DELETE CASCADE
);