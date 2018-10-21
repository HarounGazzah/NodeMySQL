const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host :'localhost',
    user :'root',
    password : 'root',
    database: 'nodeDB',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : '+ JSON.stringify(err, undefined, 2));
});

app.listen(3000,()=>console.log('Express server is running at port no : 3000'));

//Get All
app.get('/employees', (req,res)=>{
    mysqlConnection.query('SELECT * FROM users',(err, rows, fields)=>{
        if(!err)
            res.send(rows);
        else
            console.log(err);
    })    
});

//Get by Id

app.get('/employees/:id', (req,res)=>{
    mysqlConnection.query('SELECT * FROM users WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        if(!err)
            res.send(rows);
        else
            console.log(err);
    })    
});

//Delete
app.delete('/employees/:id', (req,res)=>{
    mysqlConnection.query('DELETE FROM users WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        if(!err)
            res.send('Deletet successfully.');
        else
            console.log(err);
    })    
});

//Insert
app.post('/employees', (req,res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";

    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields) => {
        if(!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id: '+ element[0].EmpID);
            });
        else
            console.log(err);
    })    
});