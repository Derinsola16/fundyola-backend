import mongoose from "mongoose";
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const schema = new Schema({
	//general information
	username: { type: String },
	email: { type: String },
	password: { type: String },
	role: { type: String },


});

schema.pre("save", async function (next) {
	try {
		const user = this;
		if (!user.isModified("password")) return next();

		let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

		user.password = await bcrypt.hash(user.password, salt);
		
		return next();
	} catch (err) {
		return next(err);
	}
});


export default mongoose.model("User", schema);