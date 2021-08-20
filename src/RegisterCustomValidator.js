const Validator = require("validatorjs");
const mongoose = require("mongoose");


export default function() {
    Validator.registerAsync(
		"unique",
		async function (value, attribute, req, passes) {
			try {
				const attributes = attribute.split(",");
				const collection = attributes[0];
				const field = attributes[1] || req;

				const query = {};
				query[field] = { $eq: value };

				if (attributes.length == 4) {
					attributes[2] =
						attributes[2] == "id" ? "_id" : attributes[2];

					attributes[3] =
						attributes[2] == "_id"
							? mongoose.Types.ObjectId(attributes[3])
							: attributes[3];

					query[attributes[2]] = { $ne: attributes[3] };
				}

				if (attributes.length == 3) {
					query[field]["$ne"] = attributes[2];
				}

				const user = await mongoose.connection
					.collection(collection)
					.findOne(query);

				if (user) {
					passes(false, `${req} has already been taken.`);
				} else {
					passes();
				}
			} catch (error) {
				passes(false, `${req} has already been taken.`);
			}
		}
	);

	Validator.registerAsync(
		"exists",
		async function (value, attribute, req, passes) {
			try {
				const attributes = attribute.split(",");
				const collection = attributes[0];
				const field = attributes[1] || req;

				value = field == "_id" ? mongoose.Types.ObjectId(value) : value;

				const query = {};
				query[field] = { $eq: value };

				const document = await mongoose.connection
					.collection(collection)
					.findOne(query);

				if (!document) {
					passes(false, `${req} doesn't exists.`);
				} else {
					passes();
				}
			} catch (error) {
				passes(false, `${req} doesn't exists.`);
			}
		}
	);

	Validator.register(
		"time",
		function (value, requirement, attribute) {
			try {
				const isMatch = value.match(/^\d{2,2}:\d{2,2}$/);

				if (!isMatch) return false;

				const [hour, minute] = value.split(":");

				if (!(parseInt(hour) < 24 && parseInt(minute) < 60)) return false;

				return true;
			} catch (error) {
				return false;
			}
		},
		"The :attribute is not in the format XX:XX or an invalid time."
	);
}