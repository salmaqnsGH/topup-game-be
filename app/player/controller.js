const path = require("path");
const fs = require("fs");
const config = require("../../config");

const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Bank = require("../bank/model");
const Payment = require("../payment/model");
const Nominal = require("../nominal/model");
const Transaction = require("../transaction/model");
const Player = require("../player/model");

module.exports = {
	landingPage: async (req, res) => {
		try {
			const voucher = await Voucher.find().select("_id name status category thumbnail").populate("category");

			res.status(200).json({ data: voucher });
		} catch (err) {
			res.status(500).json({ message: err.message || "terjadi kesalahan pada server" });
		}
	},
	detailPage: async (req, res) => {
		try {
			const { id } = req.params;
			const detail = await Voucher.findOne({ _id: id })
				.populate("category")
				.populate("nominals")
				.populate("user", "_id name phoneNumber");

			const payment = await Payment.find().populate("banks");

			if (!detail) {
				return res.status(404).json({ message: "detail game tidak ditemukan" });
			}
			res.status(200).json({ data: { detail, payment } });
		} catch (err) {
			res.status(500).json({ message: err.message || "terjadi kesalahan pada server" });
		}
	},
	category: async (req, res) => {
		try {
			const category = await Category.find();

			res.status(200).json({ data: category });
		} catch {
			res.status(500).json({ message: err.message || "terjadi kesalahan pada server" });
		}
	},
	checkout: async (req, res) => {
		try {
			const { accountUser, name, nominal, voucher, payment, bank } = req.body;
			const res_voucher = await Voucher.findOne({ _id: voucher })
				.select("name category thumbnail _id user")
				.populate("category")
				.populate("user");

			if (!res_voucher) return res.status(404).json({ message: "Voucher game tidak ditemukan" });

			const res_nominal = await Nominal.findOne({ _id: nominal });
			if (!res_nominal) return res.status(404).json({ message: "Nominal tidak ditemukan" });

			const res_payment = await Payment.findOne({ _id: payment });
			if (!res_payment) return res.status(404).json({ message: "Payment tidak ditemukan" });

			const res_bank = await Bank.findOne({ _id: bank });
			if (!res_bank) return res.status(404).json({ message: "Bank tidak ditemukan" });

			//menghitung pajak 10%
			const tax = (10 / 100) * res_nominal._doc.price;
			//menghitung value
			const value = res_nominal._doc.price - tax;

			//input history payment
			const payload = {
				historyVoucherTopup: {
					gameName: res_voucher._doc.name,
					category: res_voucher._doc.category ? res_voucher._doc.category.name : "",
					thumbnail: res_voucher._doc.thumbnail,
					coinName: res_nominal._doc.coinName,
					coinQuantity: res_nominal._doc.coinQuantity,
					price: res_nominal._doc.price,
				},
				historyPayment: {
					name: res_bank._doc.name,
					type: res_payment._doc.type,
					bankName: res_bank._doc.bankName,
					noRekening: res_bank._doc.noRekening,
				},
				name: name,
				accountUser: accountUser,
				tax: tax,
				value: value,
				player: req.player._id,
				category: res_voucher._doc.category?._id,
				user: res_voucher._doc.user?._id,
				historyUser: {
					name: res_voucher._doc.user?.name,
					phoneNumber: res_voucher._doc.user?.phoneNumber,
				},
			};
			const transaction = new Transaction(payload);

			await transaction.save();

			res.status(201).json({ data: transaction });
		} catch (err) {
			res.status(500).json({ message: err.message || `Internal server error` });
		}
	},
	history: async (req, res) => {
		try {
			const { status = "" } = req.query;
			let criteria = {};

			if (status.length) {
				criteria = {
					...criteria,
					status: { $regex: `${status}`, $options: "i" },
				};
			}

			if (req.player._id) {
				criteria = {
					...criteria,
					player: req.player._id,
				};
			}

			const history = await Transaction.find(criteria);

			let total = await Transaction.aggregate([
				{ $match: criteria },
				{
					$group: {
						_id: null,
						value: { $sum: "$value" },
					},
				},
			]);

			res.status(200).json({
				data: history,
				total: total.length ? total[0].value : 0,
			});
		} catch (err) {
			res.status(500).json({ message: err.message || `internal server error` });
		}
	},
	historyDetail: async (req, res) => {
		try {
			const { id } = req.params;
			const history = await Transaction.findOne({ _id: id });

			if (!history) return res.status(404).json({ message: "History tidak ditemukan" });

			res.status(200).json({
				data: history,
			});
		} catch (err) {
			res.status(500).json({ message: err.message || `internal server error` });
		}
	},
	dashboard: async (req, res) => {
		try {
			const count = await Transaction.aggregate([
				{ $match: { player: req.player._id } },
				{
					$group: {
						_id: "$category",
						value: { $sum: "$value" },
					},
				},
			]);

			const category = await Category.find({});

			category.forEach((element) => {
				count.forEach((data) => {
					if (data._id.toString() === element._id.toString()) {
						data.name = element.name;
					}
				});
			});

			const history = await Transaction.find({ player: req.player._id }).populate("category").sort({ updatedAt: -1 });

			res.status(200).json({ data: history, count: count });
		} catch (err) {
			res.status(500).json({ message: err.message || `internal server error` });
		}
	},
	profile: async (req, res) => {
		try {
			const player = {
				id: req.player._id,
				username: req.player.username,
				email: req.player.email,
				name: req.player.name,
				avatar: req.player.avatar,
				phoneNumber: req.player.phoneNumber,
			};
			res.status(200).json({ data: player });
		} catch (err) {
			res.status(500).json({ message: err.message || `internal server error` });
		}
	},
	editProfile: async (req, res, next) => {
		try {
			const { name = "", phoneNumber = "" } = req.body;
			const payload = {};

			if (name.length) payload.name = name;
			if (phoneNumber.length) payload.phoneNumber = phoneNumber;

			if (req.file) {
				let tmp_path = req.file.path;
				let originExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
				let filename = req.file.filename + "." + originExt;
				let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

				const src = fs.createReadStream(tmp_path);
				const dest = fs.createWriteStream(target_path);

				src.pipe(dest);

				src.on("end", async () => {
					let player = await Player.findOne({ _id: req.player._id });
					let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;
					if (fs.existsSync(currentImage)) {
						fs.unlinkSync(currentImage);
					}

					player = await Player.findOneAndUpdate(
						{
							_id: req.player._id,
						},
						{
							...payload,
							avatar: filename,
						},
						{ new: true, runValidators: true }
					);

					res.status(201).json({
						data: {
							_id: player._id,
							name: player.name,
							phoneNumber: player.phoneNumber,
							avatar: player.avatar,
						},
					});
				});

				src.on("err", async () => {
					next(err);
				});
			} else {
				const player = await Player.findOneAndUpdate(
					{
						_id: req.player._id,
					},
					payload,
					{ new: true, runValidators: true }
				);

				res.status(201).json({
					data: {
						_id: player._id,
						name: player.name,
						phoneNumber: player.phoneNumber,
						avatar: player.avatar,
					},
				});
			}
		} catch (err) {
			if (err && err.name === "ValidationError") {
				res.status(422).json({
					error: 1,
					message: err.message,
					fields: err.errors,
				});
			}
		}
	},
};
