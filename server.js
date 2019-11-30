//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
const sql = require('mssql/msnodesqlv8') //mssql with MS driver for SQL Server
//var sql = require("mssql");
var app = express();

// Setting Base directory
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});
 
//Setting up server
 var server = app.listen(process.env.PORT || 4001, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initiallising connection string
var dbConfig = {
	   driver: 'msnodesqlv8',
	   connectionString: 'Driver=SQL Server Native Client 11.0;Server=.;Database=master;Trusted_Connection=yes'
};
//Function to connect to database and execute query
var  executeQuery = function(res, query){	
	sql.connect(dbConfig, function (err) {
		if (err) {   
			console.log("Error while connecting database :- " + err);
			res.send(err);
		}
		else {
			console.log("inside query "+query)
			// create Request object
			var request = new sql.Request();
			// query to the database
			request.query(query, function (err, result) {
				if (err) {
					console.log("Error while querying database :- " + err);
					res.send(err);
				}
				else {
					res.send(result);
				}
			});
		}
	});	
}

app.get("/api/user", function(req , res){
	var query = "select * from tbl_studentdetails";
	console.log(query);
	executeQuery (res, query);
});
 
//POST API
 app.post("/api/user", function(req , res){
	 console.log(req);
	var query = "INSERT INTO tbl_studentdetails (Name) VALUES ('"+req.body.Name+"')";
	executeQuery (res, query);
});

//PUT API
 app.put("/api/user/:id", function(req , res){
	 console.log(req.params);
	var query = "UPDATE tbl_studentdetails SET Name= '" + req.body.Name  +  "' WHERE Id= " + req.params.id;
	executeQuery (res, query);
});

// DELETE API
 app.delete("/api/user/:id", function(req , res){
	var query = "DELETE FROM tbl_studentdetails WHERE Id=" + req.params.id;
	executeQuery (res, query);
});
