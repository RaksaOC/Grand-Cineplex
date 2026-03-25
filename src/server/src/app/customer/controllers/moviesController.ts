import { Request, Response } from "express";
import Movie from "../../../db/models/Movie";
import Screening from "../../../db/models/Screening";
import { Op } from "sequelize";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await Movie.findAll({
      order: [["title", "ASC"]],
    });
    res.status(200).json(allMovies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getMovieBasedOnId = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id);
    const movie = await Movie.findByPk(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getNowShowingMovies = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(today.getDate() - 20);

    const movies = await Movie.findAll({
      order: [["releaseDate", "DESC"]],
    });

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getMoviesFor7Days = async (req: Request, res: Response) => {
  try {
    const dateParam = req.query.date as string;
    if (!dateParam) {
      return res.status(400).json({ message: "Missing date parameter" });
    }

    // Parse date and normalize time to midnight
    const selectedDate = new Date(dateParam);
    selectedDate.setHours(0, 0, 0, 0);

    // Next day for less-than comparison
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find movies that have screenings on the selected date
    const movies = await Movie.findAll({
      include: [
        {
          model: Screening,
          as: "screenings",
          required: true,
        },
      ],
      order: [["releaseDate", "ASC"]],
    });

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getComingSoonMovies = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const selectedMonth = parseInt(month as string);
    const selectedYear = parseInt(year as string);

    // Get the first day of the selected month
    const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1); // month is 0-based
    // Get the first day of the next month
    const startOfNextMonth = new Date(selectedYear, selectedMonth, 1);

    const movies = await Movie.findAll({
      include: [
        {
          model: Screening,
          as: "screenings",
          required: true,
        },
      ],
      order: [["releaseDate", "ASC"]],
    });

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getMoviesAndItsScreenings = async (
  req: Request,
  res: Response
) => {
  try {
    const movieIdParam = req.query.id as string | undefined;
    const dayParam = req.query.day as string | undefined;

    if (!movieIdParam) {
      return res.status(400).json({ message: "Missing movie id parameter." });
    }

    const movieId = parseInt(movieIdParam, 10);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie id parameter." });
    }

    // Default dayOffset = 0 (today)
    let dayOffset = 0;
    if (dayParam !== undefined) {
      if (!/^\d+$/.test(dayParam)) {
        return res
          .status(400)
          .json({
            message:
              "Invalid day parameter. It must be an integer between 0 and 6.",
          });
      }
      dayOffset = parseInt(dayParam, 10);
      if (isNaN(dayOffset) || dayOffset < 0 || dayOffset > 6) {
        return res
          .status(400)
          .json({
            message:
              "Invalid day parameter. It must be an integer between 0 and 6.",
          });
      }
    }

    // Date range for filtering screenings
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() + dayOffset);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Get the movie and include any screenings (even if 0 screenings)
    const movieWithScreenings = await Movie.findOne({
      where: { id: movieId },
      include: [
        {
          model: Screening,
          as: "screenings",
          where: {
            screeningDate: {
              [Op.gte]: startDate,
              [Op.lt]: endDate,
            },
          },
          required: false, // ✅ allow returning movies even if they have no screenings
        },
      ],
      order: [["releaseDate", "ASC"]],
    });

    if (!movieWithScreenings) {
      return res.status(404).json({ message: "Movie not found." });
    }

    return res.status(200).json(movieWithScreenings);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
