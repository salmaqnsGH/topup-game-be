const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const HASH_ROUND = 10;

let userSchema = mongoose.Schema(
	{
		email: {
			type: String,
			require: [true, "Email harus diisi"],
		},
		name: {
			type: String,
			require: [true, "Nama harus diisi"],
		},
		password: {
			type: String,
			require: [true, "Password harus diisi"],
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "admin",
		},
		status: {
			type: String,
			enum: ["Y", "N"],
			default: "Y",
		},
		phoneNumber: {
			type: String,
			require: [true, "Nomor telepon harus diisi"],
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", function (next) {
	this.password = bcrypt.hashSync(this.password, HASH_ROUND);
	next();
});

module.exports = mongoose.model("User", userSchema);
