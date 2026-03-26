import { Request, Response } from "express";
import Theater from "../../../db/models/Theater";

export const getAllTheaters = async (req: Request, res: Response) => {
  try {
    const allTheaters = await Theater.findAll({
      order: [["name", "ASC"]],
    });
    res.status(200).json(allTheaters);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getTheaterById = async (req: Request, res: Response) => {
  try {
    const theaterId = parseInt(req.params.id);
    if (isNaN(theaterId)) {
      return res.status(400).json({ message: "Invalid theater ID" });
    }

    const theater = await Theater.findByPk(theaterId);

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.status(200).json(theater);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
