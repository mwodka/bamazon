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
    connection.query('SELECT * FROM Products JOIN Departments ON products.DepartmentName = Departments.DepartmentName', function(err, res) {
        if (err) throw err;

        if (res[id].StockQuantity > quantity) {
            var newQuantity = parseInt(res[id].StockQuantity) - parseInt(quantity);
            var total = parseFloat(quantity) * parseFloat(res[id].Price);
            total = total.toFixed(2);

            var departmentTotal = parseFloat(total) + parseFloat(res[id - 1].TotalSales);
            departmentTotal = departmentTotal.toFixed(2);

            connection.query("UPDATE departments SET ? WHERE ?", [{
                TotalSales: departmentTotal
            }, {
                DepartmentName: res[id].DepartmentName
            }], function(error, results) {});

            connection.query("UPDATE products SET ? WHERE ?", [{
                StockQuantity: newQuantity
            }, {
                itemID: id
            }], function(error, results) {
                if (error) throw error;

                console.log("Your order for " + quantity + " " + res[id - 1].ProductName +
                    "(s) has been placed.");
                console.log("Your total is $" + total);
            });
        } else {
            console.log('\n insufficient stock');
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
