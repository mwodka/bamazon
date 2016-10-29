var inquirer = require('inquirer');
var mysql = require('mysql');
require('console.table');

function displayMenu() {
    console.log('\n');
    inquirer.prompt([{
        type: 'list',
        name: 'menu',
        message: 'choose from one of the following: ',
        choices: [
            'view product sales by department',
            'create new department',
        ]
    }]).then(function(answers) {
        if (answers.menu === 'view product sales by department') {
            viewByDepartment();
        } else(answers.menu === 'create new department') {
            createNewDepartment();
        }
    });
}

function viewByDepartment() {

}

function createNewDepartment() {
	
}