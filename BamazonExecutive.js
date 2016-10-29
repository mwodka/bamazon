var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
});


function selection() {
    console.log('\n');
    inquirer.prompt([{
        type: "list",
        message: "choose from the following ",
        choices: ["view product sales by department", "create new department", "exit"],
        name: "action"
    }, ]).then(function(user) {
        switch (user.action) {
            case "view product sales by department":
                viewByDepartment();
                break;
            case "create new department":
                newDepartment();
                break;
            case "Exit":
                exit();
                break;
        }
    });
}

function viewByDepartment() {
    connection.query('SELECT * FROM Departments', function(err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"],
            colWidths: [20, 20, 20, 20, 20],
        });

        for (var i = 0; i < res.length; i++) {
            var profit = parseFloat(res[i].TotalSales - res[i].OverHeadCosts).toFixed(2);

            table.push(
                [res[i].DepartmentID, res[i].DepartmentName, parseFloat(res[i].OverHeadCosts).toFixed(2), parseFloat(res[i].TotalSales).toFixed(2), profit]
            );
        }


        console.log(table.toString());

        selection();
    });
}

function newDepartment() {
    inquirer.prompt([{
        type: "input",
        message: "What is the department name?",
        name: "name"
    }, {
        type: "number",
        message: "What is this department's overhead cost?",
        name: "overhead"
    }, {
        type: "number",
        message: "What is the current total sales for this department?",
        name: "sales"
    }, ]).then(function(user) {
        connection.query("INSERT INTO departments SET ?", {
            DepartmentName: user.name,
            OverHeadCosts: user.overhead,
            TotalSales: user.sales
        }, function(err, res) {
            if (err) throw err;

            console.log("\nYour department has been added\n");
            selection();
        });
    });
}

function exit() {
    connection.end();
    console.log("exiting application");
}

selection();
