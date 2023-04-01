const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "!#$%ASDJ*GSB$%&GNTK#";
const saltRound = 15;
const hashPassword = async password => {
	let salt = await bcrypt.genSalt(saltRound);
	let hash = await bcrypt.hash(password, salt);
	return hash;
};

const hashCompare = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

const createToken = ({firstName, lastName, email, role}) => {
	let token = jwt.sign({firstName, lastName, email, role}, secretKey, {expiresIn: "1m"});
	return token;
};

const decodeToken = token => {
	let data = jwt.decode(token);
	return data;
};

const validate = (req, res, next) => {
	if (req.headers.authorization) {
		let token = req.headers.authorization.split(" ")[1];
		let data = decodeToken(token);
		let verifyToken = Math.floor(Date.now() / 1000) <= data.exp;
		console.log(verifyToken);
		if (verifyToken) {
			next();
		} else
			res.status(401).send({
				message: "Token expired",
			});
	} else
		res.status(401).send({
			message: "Token not found",
		});
};

const roleAdmin = (req, res, next) => {
	if (req.headers.authorization) {
		let token = req.headers.authorization.split(" ")[1];
		let data = decodeToken(token);
		let verifyToken = data.role === "Admin";
		console.log(verifyToken);
		if (verifyToken) {
			next();
		} else
			res.status(401).send({
				message: "Only Admin can access",
			});
	} else
		res.status(401).send({
			message: "Token not found",
		});
};

module.exports = {hashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin};
