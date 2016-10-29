var inquirer = require('inquirer');
var mysql = require('mysql');
require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
});

function displayMenu() {
  console.log('\n');
    inquirer.prompt([{
        type: 'list',
        name: 'menu',
        message: 'choose from one of the following: ',
        choices: [
            'view products for sale',
            'view low inventory',
            'add to inventory',
            'add new product'
        ]
    }]).then(function(answers) {
        if (answers.menu === 'view products for sale') {
            viewProducts();
        } else if (answers.menu === 'view low inventory') {
            viewLowInventory();
        } else if (answers.menu === 'add to inventory') {
            addToInventory();
        } else {
            addNewProduct();
        }
    });
}

// list all products in the db, displaying item ID, name, price, and quantity
function viewProducts() {
    connection.query('SELECT * FROM Products', function(err, res) {
        console.log('\n');
        console.table(res)
    });
}

// list all item in the db with an inventory count <= 5
function viewLowInventory() {
    connection.query('SELECT * FROM Products', function(err, res) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].StockQuantity <= 5) {
                console.table(res[i]);
            }
        }
    });
}

// prompt for item ID and quantity, then update the db
function addToInventory() {

    var questions = [{
        type: 'input',
        name: 'id',
        message: 'Enter the ID of the product whose inventory you wish to update '
    }, {
        type: 'input',
        name: 'quantity',
        message: 'How many units do you want to add? ',
        default: function() {
            return '1';
        }
    }];

    inquirer.prompt(questions).then(function(answers) {
            connection.query('UPDATE Products SET StockQuantity=? WHERE ItemID=?', [res[0].StockQuantity + answers.quantity, id], function(err, res) {});
        });
}

// prompt for name, price, and quantity, then add new product to the db
function addNewProduct() {
    var questions = [{
        type: 'input',
        name: 'name',
        message: 'Enter the name for the product you wish to add '
    }, {
        type: 'input',
        name: 'deptname',
        message: 'Enter the name of the department for the product you wish to add '
    }, {
        type: 'input',
        name: 'quantity',
        message: 'How many units do you want to add? ',
        default: function() {
            return '1';
        }
    }, {
        type: 'input',
        name: 'price',
        message: 'Enter the price for the product '
    }];

    inquirer.prompt(questions).then(function(answers) {
        // NOTE TO SELF: change db to make primary id auto-increment, then update the following code
        connection.query('INSERT INTO Products SET ?', { ProductName: answers.name, DepartmentName: answers.deptname, Price: answers.price, StockQuantity: answers.quantity }, function(err, result) {
            if (err) throw err;
        });
    });
}

displayMenu();
