const express = require("express");
const port = 8000;
const app = express();
app.use(express.json());
let users = [
	{
		name: "Raj",
		email: "raj@gamil.com",
	},
	{
		name: "john",
		email: "jhon@gamil.com",
	},
	{
		name: "mark",
		email: "mark@gamil.com",
	},
];

app.get("/", (req, res) => {
	// res.send(`<h1> Hi Iam running</h1>`);

	res.send({
		statusCode: 200,
		userCounts: users.length,
		message: "All users",
		users: users,
	});
});

app.post("/users/:id", (req, res) => {
	users.push(req.body);
	if (req.params.id < users.length) {
		res.send({
			statusCode: 200,
			userCounts: users.length,
			message: "User added successfully",
		});
	} else {
		res.send({
			statusCode: 400,
			message: "Bad request",
		});
	}
});

app.put("/users/:id", (req, res) => {
	if (req.params.id < users.length) {
		users.splice(req.params.id, 1, req.body);
		res.send({
			statusCode: 200,
			userCounts: users.length,
			message: "User updated successfully",
		});
	} else {
		res.send({
			statusCode: 400,
			message: "Bad request",
		});
	}
});

app.delete("/users/:id", (req, res) => {
	if (req.params.id < users.length) {
		users.splice(req.params.id, 1);
		res.send({
			statusCode: 200,
			userCounts: users.length,
			message: "User Deleted successfully",
		});
	} else {
		res.send({
			statusCode: 400,
			message: "Bad request",
		});
	}
});

app.listen(port, () => console.log("server listening to " + port));

/* Commands used in this class */
/*
npm init // Initizilaing the node package manager
npm i express // Installing express
npm i nodemon // It automatically restart the server once we save 
*/
