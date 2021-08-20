import passport from "passport";
import localStrategy from "passport-local";
import {
	Strategy as JwtStrategy,
	ExtractJwt as JwtExtract,
} from "passport-jwt";
import User from "./app/models/User";


passport.use(
	"login",
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email });

				if (!user) {
					return done(null, false, { message: "User not found" });
				}

				const validate = await user.isValidPassword(password);

				if (!validate) {
					return done(null, false, { message: "Wrong Password" });
				}

				return done(null, user, { message: "Logged in Successfully" });
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.use(
	"jwt",
	new JwtStrategy(
		{
			secretOrKey: Config("app.key"),
			jwtFromRequest: JwtExtract.fromAuthHeaderAsBearerToken(),
		},
		async (token, done) => {
			try {
				const user = await User.findOne({ email: token.user.email });

				if (user) {
					return done(null, User.responseFormatter(user));
				}
				throw Error("Token is invalid");
			} catch (error) {
				done(error);
			}
		}
	)
);
