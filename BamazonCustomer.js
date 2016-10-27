var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
})

function display() {
    connection.query('SELECT * FROM Products', function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].ItemID + " | " + res[i].ProductName + " | " + res[i].DepartmentName + " | " + res[i].Price + " | " + res[i].StockQuantity);
        }
        console.log("---------------------------------------------------");
    });
}

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

function checkOrder(id, quantity) {
    connection.query('SELECT * FROM Products WHERE ItemID=' + id, function(err, res) {
        if (res[0].StockQuantity >= quantity) {
            placeOrder(id, quantity);
        } else {
            console.log('insufficient stock');
        }
    });
}

function placeOrder(id, quantity) {
    connection.query('SELECT * FROM Products WHERE ItemID=?', [id], function(err, res) {
        connection.query('UPDATE Products SET StockQuantity=? WHERE ItemID=?', [res[0].StockQuantity - quantity, id], function(err, res) {});
    });


showTotalCost(id, quantity);

}

function showTotalCost(id, quantity) {
    connection.query('SELECT * FROM Products WHERE ItemID=' + id, function(err, res) {
        console.log('total cost is $' + res[0].Price * quantity);
    });
}

display();
takeOrder();
