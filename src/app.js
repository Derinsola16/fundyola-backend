import express from "express";
import cors from "cors";
import path from "path";
import logger from "morgan";
import fs from "fs";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import _ from 'lodash';
import Validator from "validatorjs";
import appConfig from "./Config";
import DbConnection from "./DbConnection";
import RegisterCustomValidator from "./RegisterCustomValidator";
import TrimString from "./TrimString";

//Import route files
import apiRouter from "./routes/api";
import authRouter from "./routes/auth";
import HttpException from "./app/exceptions/HttpException";
// Route import ends

//LOAD ENVIRONMENTAL FILE
if (fs.existsSync(path.join(__dirname, "..", ".env"))) {
	const result = dotenv.config(path.join(__dirname, "..", ".env"));
	if (result.error) {
		throw result.error;
	}
}else {
		console.log("cannot find .env")
    //throw Error("Cannot locate .env file in the project root");
}

//SET GLOBAL env() FUNCTION TO FETCH ENVIRONMENTAL VARIABLE
global.env = (name, defaultValue = null) => process.env[name] || defaultValue;
//SET LODASH GLOBALLY
global._ = _;
global.lodash = _;
//SETUP CONFIG VALUES TO GLOBAL STATE
global.configValues = appConfig() || {};
//SET GLOBAL config() FUNCTION TO FETCH CONFIG VALUES
global.Config = (name, defaultValue = null) => _.get(global.configValues, name, defaultValue);
//SET GLOBAL VALIDATOR FUNCTION
global.validator = (data, rules, customMessages = {}) => new Validator(data, rules, customMessages);

global.abort_if = function (
	boolean,
	code = 500,
	message = "Oops! Something went wrong."
) {
	if (boolean) {
		throw new HttpException(message, code);
	}
};

require("./Passport");
RegisterCustomValidator();

//Initialize Express
var app = express();

//Initialize Database Connection
DbConnection();

// Add Global Middleware
app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(cookieParser());
//CONVERT EMPTY SPACE TO NULL
app.use(
	TrimString(function (key, value) {
		const except = ["password", "password_confirmation"];

		if (_.indexOf(except, key) >= 0) return value;

		return _.isString(value)
			? _.trim(value) == ""
				? null
				: _.trim(value)
			: value;
	})
);

// Routes
app.use("/", apiRouter);
app.use("/auth", authRouter);

// Routes Ends

//404 Handling Route
app.use(function (req, res, next) {
	throw new HttpException("The current page you are looking for is not implemented or has been moved", 404);
});

//Error Handling
app.use(function (err, req, res, next) {
	if (err instanceof HttpException) {
		return res.status(err.getCode()).json({
			status: err.getCode(),
			message: err.getMessage(),
		});
	}

	return res.status(500).json({
		status : "500",
		title: "Internal server error",
		message: err.message,
	});
});

export default app;