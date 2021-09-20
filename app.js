//jshint esversion:6

const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/employeeDB", {useNewUrlParser: true});

const employeeSchema = {
	email: String,
	password: String,
	empCode : String,
	empName :String,
	isActive: Number
};

const Employee = new mongoose.model("Employee", employeeSchema);

//GET ALL EMPLOYEES
app.get("/employees", function(req,res){
	Employee.find(function(err, foundEmployees){
		if (err){
			console.log(err)
		} else{
			res.send(foundEmployees);
		}
	});
});

//ADD A NEW EMPLOYEE
app.post("/employees", function(req,res){
	const newEmployee = new Employee({
		email: req.body.email,
		password:req.body.password,
		empCode: req.body.empCode,
		empName: req.body.empName,
		isActive: 0
	});
	newEmployee.save(function(err){
		if (err){
			res.send(err)
		} else{
			res.send("Successfully addded a new Emp");
		}
	});
});

//DELETE ALL EMPLOYEES
app.delete("/employees",function(req,res){
	Employee.deleteMany(function(err){
		if (err){
			res.send(err);
		} else{
			res.send("Successfully deleted all data");
		}
	});
});

//GET A PARTICULAR EMPLOYEE
app.route("/employees/:empcode")

.get(function(req,res){
	Employee.findOne({empCode: req.params.empcode}, function(err, foundEmployee){
		if (foundEmployee){
			res.send(foundEmployee)
		} else{
			res.send("No employee found");
		}
	});
})

.put(function(req, res){
	Employee.replaceOne(
		{empCode: req.params.empcode},
		{
		email: req.body.email,
		password:req.body.password,
		empCode: req.body.empCode,
		empName: req.body.empName,
		isActive: 0
		},
		function(err){
			if (err){
				res.send(err);
			} else{
				res.send("Sucessfully updated");
			}
		}
	)
})

.patch( function( req, res){
	Employee.updateOne(
		{empCode: req.params.empcode},
		{$set: req.body},
		function(err){
			if (err){
				res.send(err)
			} else{
				res.send("Successfully updated");
			}
		}
	)
})

.delete( function( req, res){
	Employee.deleteOne(
		{empCode: req.params.empcode},
		function(err){
			if(err){
				res.send(err);
			} else{
				res.send("Successfully deleted article");
			}
		}
	)
});


app.listen(3000, function(req,res){
	console.log("Server started on port 3000");
})