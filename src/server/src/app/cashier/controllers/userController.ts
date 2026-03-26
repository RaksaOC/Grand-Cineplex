import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import bcrypt from "bcryptjs";
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

    const userInfo = await Staff.findByPk(userId);

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userInfo);
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

    if (user.role !== "cashier") {
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
    return res.status(500).json({ message: "Internal server error" });
  }
};
