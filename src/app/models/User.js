import Model from '../../database/UserSchema';
const bcrypt = require("bcryptjs");

class User extends Model {

	async isValidPassword(password) {
		return await bcrypt.compare(password, this.password);
	}
}

User.responseFormatter = (user) => {
	const attribute = {
		id: user._id.toString(),
		username: user.name,
		email: user.email,
		role: user.role,
	};

	// if(user.role === User.ROLE.STUDENT) {
	// 	attribute.phone = user.phone;
	// 	attribute.studentNumber = user.studentNumber;
	// 	attribute.departmentId = user.departmentId;
	// 	attribute.semester = user.semester;
	// 	attribute.section = user.section;

	// 	if(user.department) {
	// 		attribute.department = Department.responseFormatter(
	// 			user.department
	// 		);
	// 	}
	// }

	return attribute;
};

User['ROLE'] = {
    ADMINISTRATOR : "administrator",
} 

export default User;