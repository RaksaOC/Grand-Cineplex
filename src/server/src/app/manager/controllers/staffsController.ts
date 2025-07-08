import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Staff from "../../../db/models/Staff";
import { getAllBookingsForUser } from "./bookingsController";

export const addStaff = async (req: Request, res: Response) => {
	const { name, email, phone, password, role, department } = req.body;
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const createdAt = new Date();
		const newStaff = await Staff.create({
			name,
			email,
			password: hashedPassword,
			role,
			phone,
			hiredDate: new Date(),
			isActive: true,
			createdAt,
      department
		});
    
		res.status(201).json(newStaff);
	} catch (error) {
		console.error("Error adding staff:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getStaffInfo = async (req: Request, res: Response) => {
	const staffId = Number(req.params.id);
	try {
		const staffInfo = await Staff.findByPk(staffId);

		if (!staffInfo) {
			return res.status(404).json({ message: "Staff not found" });
		}

		res.status(200).json(staffInfo);
	} catch (error) {
		console.error("Error fetching staff info:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateStaffInfo = async (req: Request, res: Response) => {
	const staffId = Number(req.params.id);
	const { name, email, phone, password, role, hiredDate } = req.body;
	try {
		let hashedPassword = password;
		if (password) {
			const salt = await bcrypt.genSalt(10);
			hashedPassword = await bcrypt.hash(password, salt);
		}

		const updatedAt = new Date();
		const [updatedRows, [updatedStaff]] = await Staff.update(
			{
				name,
				email,
				phone,
				password: hashedPassword,
				role,
				hiredDate,
				updatedAt,
			},
			{
				where: { id: staffId },
				returning: true,
			}
		);

		if (updatedRows === 0) {
			return res.status(404).json({ message: "Staff not found" });
		}

		res.status(200).json(updatedStaff);
	} catch (error) {
		console.error("Error updating staff info:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteStaff = async (req: Request, res: Response) => {
	const staffId = Number(req.params.id);
	try {
		const deletedRows = await Staff.destroy({
			where: { id: staffId },
		});

		if (deletedRows === 0) {
			return res.status(404).json({ message: "Staff not found" });
		}

		res.status(200).json({ message: "Staff deleted successfully" });
	} catch (error) {
		console.error("Error deleting staff:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllStaff = async (req: Request, res: Response) => {
	try {
		const staffList = await Staff.findAll({
			order: [["name", "ASC"]],
		});
		const dataToSend = staffList.map((staff) => {
			return {
				id: staff.id,
				name: staff.name,
				email: staff.email,
				phone: staff.phone,
				role: staff.role,
				department: staff.department,
				hiredDate: staff.hiredDate,
				status: staff.isActive ? "active" : "inactive",
			};
		});
		res.status(200).json(dataToSend);
	} catch (error) {
		console.error("Error fetching staff list:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
