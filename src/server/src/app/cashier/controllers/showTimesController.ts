import { Request, Response } from "express";
import Screening from "../../../db/models/Screening";
import { Op } from "sequelize";

export const getTodayShowTimes = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const next5Days = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      next5Days.push(date.toISOString().split("T")[0]);
    }

    const showTimeForToday = await Screening.findAll({
      where: {
        screeningDate: {
          [Op.in]: next5Days,
        },
      },
      include: [
        {
          association: "movie",
          attributes: ["id", "title", "duration", "genre"],
        },
        {
          association: "theater",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["screeningDate", "ASC"],
        ["screeningTime", "ASC"],
      ],
    });

    res.status(200).json(showTimeForToday);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllShowTimes = async (req: Request, res: Response) => {
  try {
    const allShowTimes = await Screening.findAll({
      include: [
        {
          association: "movie",
          attributes: ["id", "title", "duration"],
        },
        {
          association: "theater",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["screeningDate", "ASC"],
        ["screeningTime", "ASC"],
      ],
    });
    res.status(200).json(allShowTimes);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getShowTimesBasedOnMovieId = async (
  req: Request,
  res: Response
) => {
  try {
    const movieId = parseInt(req.params.id);
    const screeningDate = req.query.screeningDate as string;
    const showTimesForMovie = await Screening.findAll({
      where: { movieId, screeningDate },
      include: [
        {
          association: "theater",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["screeningDate", "ASC"],
        ["screeningTime", "ASC"],
      ],
    });
    res.status(200).json(showTimesForMovie);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const addShowTime = async (req: Request, res: Response) => {
  try {
    const { movieId, theaterId, screeningDate, screeningTime, price } =
      req.body;

    if (!movieId || !theaterId || !screeningDate || !screeningTime || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newShowTime = await Screening.create({
      movieId,
      theaterId,
      screeningDate,
      screeningTime,
      price,
    });

    res.status(201).json(newShowTime);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateShowTime = async (req: Request, res: Response) => {
  try {
    const showTimeId = parseInt(req.params.id);
    const { movieId, theaterId, screeningDate, screeningTime, price } =
      req.body;

    if (!movieId || !theaterId || !screeningDate || !screeningTime || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const showTime = await Screening.findByPk(showTimeId);

    if (!showTime) {
      return res.status(404).json({ message: "Show time not found" });
    }

    await showTime.update({
      movieId,
      theaterId,
      screeningDate,
      screeningTime,
      price,
    });

    res.status(200).json(showTime);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteShowTime = async (req: Request, res: Response) => {
  try {
    const showTimeId = parseInt(req.params.id);

    const showTime = await Screening.findByPk(showTimeId);

    if (!showTime) {
      return res.status(404).json({ message: "Show time not found" });
    }

    await showTime.destroy();

    res.status(200).json({ message: "Show time deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getShowTimesBasedOnId = async (req: Request, res: Response) => {
  try {
    const showTimeId = parseInt(req.params.id);
    const showTime = await Screening.findByPk(showTimeId, {
      include: [
        {
          association: "movie",
          attributes: ["id", "title", "duration", "genre"],
        },
        {
          association: "theater",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!showTime) {
      return res.status(404).json({ message: "Show time not found" });
    }

    res.status(200).json(showTime);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
