import User from "../models/User";
import HttpException from "../exceptions/HttpException";
import { NHttpStatuses } from "http-response-status";
import passport from "passport";
import jwt from "jsonwebtoken";

class AuthController {
	async login(req, res, next) {
		try {
			passport.authenticate("login", async (err, user, info) => {
				try {
					if (err || !user) {
						const error = new Error(err.message);
						return next(error);
					}
					const loggedInUser = user;
					req.login(user, { session: false }, async (error) => {
						if (error) return next(error);
	
						const body = { _id: loggedInUser._id, email: loggedInUser.email };
						const token = jwt.sign(
							{ user: body },
							Config("app.key")
						);
						let {pass, ...response} = loggedInUser;
						const { password, ...USER} = response._doc;
						return res.json({ token, user: User.responseFormatter(USER) });
					});
				} catch (error) {
					return next(error);
				}
			})(req, res, next);
		} catch (error) {
			next(error);
		}
	}

	async me(req, res, next) {
		try {
			res.json(req.user)
		} catch (error) {
			next(error);
		}
	}

	async setUpAdmin(req, res, next) {
		try {
			// validate request
			let validation = validator(req.body, {
				username: "required|string|max:50",
				email: "required|string|email|max:50",
				password: "required|string|min:8|max:50|confirmed",
			});

			async function passes() {
				try {
					let administrator = await User.findOne({
						email: req.body.email,
					});

					administrator = _.isNull(administrator)
						? new User()
						: administrator;

					administrator.username = req.body.username;
					administrator.email = req.body.email;
					administrator.password = req.body.password;
					administrator.role = User.ROLE.ADMINISTRATOR;

					if (!(await administrator.save())) {
						throw new HttpException("Oops! Something went wrong.", 500);
					}

					return res.status(NHttpStatuses.ESuccess.OK).json({
						data: User.responseFormatter(administrator),
					});
				} catch (error) {
					next(error);
				}
			}

			function fails() {
				return res
					.status(NHttpStatuses.EClientError.UNPROCESSABLE_ENTITY)
					.json({
						message: "The given data is invalid",
						errors: validation.errors.all(),
					});
			}

			validation.checkAsync(passes, fails);
		} catch (error) {
			next(error);
		}
	}
}

export default new AuthController();
