/**server steps */
const express = require("express");
const port = 8000;
const app = express();
app.use(express.json());

/**mongoose */
const mongoose = require("mongoose");
const {dbUrl, mongodb} = require("./dbconfig");
const {UserModel} = require("./UserSchema");
mongoose.connect(dbUrl);

/**Authentication */
const {hashPassword, hashCompare, createToken, validate, roleAdmin} = require("./auth");

/**Routes */
app.post("/add-users", validate, roleAdmin, async (req, res) => {
	let verifyUser = await UserModel.findOne({email: req.body.email});

	if (!verifyUser) {
		try {
			req.body.password = await hashPassword(req.body.password);
			let users = new UserModel(req.body);
			await users.save();
			res.status(200).send({
				message: "users created successfully",
				users,
			});
		} catch (error) {
			res.send(error);
		}
	} else {
		res.send({
			message: "User already exist",
		});
	}
});

app.post("/login", async (req, res) => {
	try {
		let user = await UserModel.findOne({email: req.body.email});
		const {firstName, lastName, email, role} = user;
		if (user) {
			let passwordCompare = await hashCompare(req.body.password, user.password);
			if (passwordCompare) {
				try {
					let token = createToken({firstName: firstName, lastName: lastName, email: email, role: role});
					res.status(200).send({
						message: "users Login successfully",
						user,
						token,
					});
				} catch (error) {
					res.send(error);
				}
			} else {
				res.send({
					message: "Invalid password",
				});
			}
		} else res.send({message: "Unable to find the user please re-enter your details"});
	} catch (error) {}
});

app.get("/getall", validate, roleAdmin, async (req, res) => {
	try {
		let users = await UserModel.find({}, {_id: 0});
		res.status(200).send({
			users,
		});
	} catch (error) {
		res.send(error);
	}
});

app.put("/edit-user", validate, roleAdmin, async (req, res) => {
	let verifyUser = await UserModel.findOne({_id: req.body._id});
	console.log(verifyUser, req.params._id);
	if (verifyUser) {
		let users = await UserModel.updateOne({_id: new mongodb.ObjectId(req.body._id)}, {$set: req.body}, {runValidators: true});

		res.status(201).send({
			message: "user edited successfully",
			users,
		});
	} else {
		res.send({
			message: "Invalid user ID",
		});
	}
});

app.delete("/delete", validate, roleAdmin, async (req, res) => {
	let verifyUser = await UserModel.findOne({_id: req.body.id});
	if (verifyUser) {
		try {
			let users = await UserModel.deleteOne({_id: req.body.id});

			res.status(200).send({
				message: "User deleted successfully",
				users,
			});
		} catch (error) {
			res.send(error);
		}
	} else {
		res.send({
			message: "Invalid user ID",
		});
	}
});

app.listen(port, () => {
	console.log("Running on " + port);
});
