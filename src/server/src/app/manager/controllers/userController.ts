import { Response, Request } from "express";
import Customer from "../../../db/models/Customer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Staff from "../../../db/models/Staff";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "GrandCineplix_CADT";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userInfo = await Customer.findByPk(userId);

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userInfo);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email, phone, password, dateOfBirth } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await Customer.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let hashedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    await user.update({
      name,
      email,
      phone,
      password: hashedPassword,
      dateOfBirth,
    });

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, dateOfBirth } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await Customer.findByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Customer.create({
      name,
      email,
      phone,
      password: hashedPassword,
      dateOfBirth,
    });

    res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await Customer.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const logInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await Staff.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.role !== "manager") {
      return res.status(401).json({ message: "Incorrect role." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "6h",
      }
    );

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return  res.status(500).json({ message: "Internal server error" });
  }
};
