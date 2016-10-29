// include required node packages
var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
})

// console log the table using console.table
function display() {
    connection.query('SELECT * FROM Products', function(err, res) {
        console.log('\n');
        console.table(res);
    });
}

// prompt for id and quantity, then process order
function takeOrder() {
    var questions = [{
        type: 'input',
        name: 'product',
        message: 'Enter the ID of the product you want '
    }, {
        type: 'input',
        name: 'quantity',
        message: 'How many units do you want? ',
        default: function() {
            return '1';
        }
    }];

    inquirer.prompt(questions).then(function(answers) {
        checkOrder(answers.product, answers.quantity);
    });
}

// check first to ensure there is sufficient stock for the order, then call placeOrder() to update the db
function checkOrder(id, quantity) {
    connection.query('SELECT * FROM Products WHERE ItemID=' + id, function(err, res) {
        if (res[0].StockQuantity >= quantity) {
            placeOrder(id, quantity);
        } else {
            console.log('insufficient stock');
        }
    });
}

// update the db so the inventory remains accurate
function placeOrder(id, quantity) {
    connection.query('SELECT * FROM Products WHERE ItemID=?', [id], function(err, res) {
        connection.query('UPDATE Products SET StockQuantity=? WHERE ItemID=?', [res[0].StockQuantity - quantity, id], function(err, res) {
            showTotalCost(id, quantity);
        });
    });
}

// compute and console log the total cost of an order
function showTotalCost(id, quantity) {
    connection.query('SELECT * FROM Products WHERE ItemID=' + id, function(err, res) {
        console.log('total cost is $' + res[0].Price * quantity);
    });
}

display();
takeOrder();