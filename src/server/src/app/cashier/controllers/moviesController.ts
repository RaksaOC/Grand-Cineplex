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
    return res.status(500).json({ message: "Internal server error", error });
    return;
  }
};

export const getMoviesFor7Days = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    const moviesForNext7Days = await Movie.findAll({
      include: [
        {
          model: Screening,
          as: "screenings",
          where: {
            screeningDate: {
              [Op.gte]: today,
              [Op.lt]: sevenDaysLater,
            },
          },
          required: true,
        },
      ],
      order: [["releaseDate", "ASC"]],
    });

    res.status(200).json(moviesForNext7Days);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
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
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getMovieAndScreeningBasedOnId = async (
  req: Request,
  res: Response
) => {
  try {
    const movieId = parseInt(req.params.id);
    const screeningDate = req.query.screeningDate as string;
    const movie = await Movie.findByPk(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Import Theater model
    // import Theater from "../../../db/models/Theater"; // Make sure this import exists at the top

    const screenings = await Screening.findAll({
      where: {
        movieId,
        ...(screeningDate && { screeningDate }),
      },
      include: [
        {
          model: require("../../../db/models/Theater").default,
          as: "theater",
          attributes: ["name"],
        },
      ],
      order: [["screeningDate", "ASC"]],
    });

    res.status(200).json({ movie, screenings });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getMoviesAndItsScreenings = async (
  req: Request,
  res: Response
) => {
  try {
    // Accept id and day from query parameters
    const movieIdParam = req.query.id as string | undefined;
    const dayParam = req.query.day as string | undefined;
    if (!movieIdParam) {
      return res.status(400).json({ message: "Missing movie id parameter." });
    }

    const movieId = parseInt(movieIdParam, 10);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie id parameter." });
    }

    // Strictly validate day parameter to be between 0 and 6
    let dayOffset = 0;
    if (dayParam !== undefined) {
      if (!/^\d+$/.test(dayParam)) {
        return res.status(400).json({
          message:
            "Invalid day parameter. It must be an integer between 0 and 6.",
        });
      }
      dayOffset = parseInt(dayParam, 10);
      if (isNaN(dayOffset) || dayOffset < 0 || dayOffset > 6) {
        return res.status(400).json({
          message:
            "Invalid day parameter. It must be an integer between 0 and 6.",
        });
      }
    }

    // Calculate the start and end of the requested day
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() + dayOffset);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Use findOne to return a single movie with its screenings
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
          required: true,
        },
      ],
      order: [["releaseDate", "ASC"]],
    });

    if (!movieWithScreenings) {
      return res.status(404).json({
        message: "Movie or screenings not found for the specified day.",
      });
    }

    res.status(200).json(movieWithScreenings);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getComingSoonMovies = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const sixMonthsLater = new Date(
      today.getFullYear(),
      today.getMonth() + 6,
      1
    );

    const moviesComingInNext6Months = await Movie.findAll({
      include: [
        {
          model: Screening,
          as: "screenings",
          where: {
            screeningDate: {
              [Op.gte]: startOfMonth,
              [Op.lt]: sixMonthsLater,
            },
          },
          required: true,
        },
      ],
      order: [["releaseDate", "ASC"]],
    });

    res.status(200).json(moviesComingInNext6Months);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const addMovie = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      releaseDate,
      duration,
      genre,
      rating,
      posterUrl,
    } = req.body;

    if (!title || !duration) {
      return res
        .status(400)
        .json({ message: "Title and duration are required" });
    }

    const newMovie = await Movie.create({
      title,
      description,
      releaseDate,
      duration,
      genre,
      rating,
      posterUrl,
    });

    res.status(201).json(newMovie);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id);
    const {
      title,
      description,
      releaseDate,
      duration,
      genre,
      rating,
      posterUrl,
    } = req.body;

    const movie = await Movie.findByPk(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.update({
      title,
      description,
      releaseDate,
      duration,
      genre,
      rating,
      posterUrl,
    });

    res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id);

    const movie = await Movie.findByPk(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.destroy();

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
