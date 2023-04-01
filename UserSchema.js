const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {type: String, required: true},
		email: {type: String, validate: value => validator.isEmail(value)},
		password: {type: String, required: true},
		role: {type: String, required: true},
		userCreatedAT: {
			type: String,
			default: new Date().toLocaleString("en-IN", {
				timeZone: "Asia/Kolkata",
				month: "long",
				day: "2-digit",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			}),
		},
	},
	{versionKey: false, collection: "user"}
);

const UserModel = mongoose.model("user", userSchema);
module.exports = {UserModel};
