let express = require("express");
let app = express();
const cors = require("cors");
app.use(cors());
const {Client} = require("pg");
const client = new Client({
    user: "postgres",
    password: "Emppass@29Emp",
    database: "postgres",
    port : 5432,
    host: "db.gauvaomgpidnqgpgurqt.supabase.co",
    ssl:{rejectUnauthorized:false},
});
client.connect(function(res,error){
    console.log(`Connected!!!`);
});
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Orgin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
let {employees} = require("./employeeData.js");
let fs = require("fs");

app.get("/svr/employees",function(req,res,next){
    let department = req.query.department;
    let designation = req.query.designation;
    let arr = employees;


        let query = "Select * FROM employees";
        client.query(query,function(err,result){
            if(err) console.log(err);
            else {
                
                if (department&&!designation)
                {
                    result.rows = result.rows.filter(ele=>ele.department===department);
            }
            else if(designation&&!department){
                result.rows = result.rows.filter(ele=>ele.designation===designation);
            }
            else if(designation&&department){
                result.rows = result.rows.filter(ele=>ele.designation===designation&&ele.department===department);
            }
            
            res.send(result.rows);
        }
    })
})


app.get("/svr/employees/:empcode",function(req,res,next){
    let empcode = +req.params.empcode;
    console.log(empcode);

    // let connection = mysql.createConnection(connData);
    const query  = `Select * FROM employees`;
    client.query(query,function(err,result){
        if(err) res.status(404).send("No Employee found");
        else {
            let arr = result.rows.find(ele=>ele.empcode===empcode);
            res.send(arr);
        }
    // client.end();
    })
    
    
});

app.post("/svr/employees",function(req,res,next){
    var values = Object.values(req.body);
    // let connection = mysql.createConnection(connData);
    let query  = `INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES($1,$2,$3,$4,$5,$6)`;
    client.query(query,values,function(err,result){
        if(err) console.log(err);
        else {
        let query2  = "Select * FROM employees";
    client.query(query2,function(err,result){
        if(err) console.log(err);
        else res.send(result.rows);
    })
    }
    })
   
});

app.put("/svr/employees/:empcode",function(req,res,next){
    let empcode = +req.params.empcode;
    let values =[req.body.name,req.body.department,req.body.designation,req.body.salary,req.body.gender,empcode]
    // let connection = mysql.createConnection(connData);
    let query  = `UPDATE employees SET name=$1,department=$2,designation=$3,salary=$4,gender=$5 WHERE empcode=$6`;
    client.query(query,values,function(err,result){
        if(err) {res.status(400).send(err);}
        
        res.send('${result.rowCount} updation successful');
    
    })
});


app.delete("/svr/employees/:empcode",function(req,res,next){
    let empcode = +req.params.empcode;
    let query  = `Delete from employees where empcode=${empcode}`;
    client.query(query,function(err,result){
        if(err) res.send(err);
        else {
        
        res.send('Successfully Deleted');
        }
            
    });

});


