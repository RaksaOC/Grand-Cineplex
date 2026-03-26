import { Request, Response } from "express";
import Screening from "../../../db/models/Screening";
import Booking from "../../../db/models/Booking";
import Ticket from "../../../db/models/Ticket";
import Seat from "../../../db/models/Seat";
import Movie from "../../../db/models/Movie";
import Theater from "../../../db/models/Theater";
import { Op, Sequelize } from "sequelize";

export const get7DaysShowTimes = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const next5Days = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      next5Days.push(date.toISOString().split("T")[0]);
    }

    const screenings = await Screening.findAll({
      attributes: [
        "id",
        "screeningDate",
        "screeningTime",
        "regularSeatPrice",
        "premiumSeatPrice",
        "vipSeatPrice",
        "movieId",
        "theaterId",
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM seats s
            WHERE s.theater_id = "Screening"."theater_id"
          )`),
          "totalSeats",
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM tickets t
            JOIN bookings b ON t.booking_id = b.id
            WHERE b.screening_id = "Screening"."id" AND b.status = 'confirmed'
          )`),
          "bookedSeats",
        ],
      ],
      where: {
        screeningDate: {
          [Op.in]: next5Days,
        },
      },
      include: [
        {
          model: Movie,
          as: "movie",
          attributes: ["id", "title", "duration", "genre", "posterUrl"],
        },
        {
          model: Theater,
          as: "theater",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["screeningDate", "ASC"],
        ["screeningTime", "ASC"],
      ],
      raw: true,
      nest: true,
    });

    const result = screenings.map((s: any) => {
      const screeningDate = s.screeningDate;
      const screeningTime = s.screeningTime;
      const screeningDateTime = new Date(`${screeningDate}T${screeningTime}`);
      const durationMinutes = s.movie?.duration || 0;
      const endDateTime = new Date(
        screeningDateTime.getTime() + durationMinutes * 60_000
      );

      const now = new Date();
      let status: "upcoming" | "ongoing" | "completed";
      if (now < screeningDateTime) status = "upcoming";
      else if (now <= endDateTime) status = "ongoing";
      else status = "completed";

      const totalSeats = Number(s.totalSeats) || 0;
      const bookedSeats = Number(s.bookedSeats) || 0;

      return {
        id: s.id,
        movieId: s.movieId,
        theaterId: s.theaterId,
        movieTitle: s.movie?.title,
        movieImage: s.movie?.posterUrl,
        theater: s.theater?.name,
        date: screeningDate,
        time: screeningTime.slice(0, 5),
        duration: `${durationMinutes} min`,
        availableSeats: totalSeats - bookedSeats,
        totalSeats,
        regularSeatPrice: Number(s.regularSeatPrice),
        premiumSeatPrice: Number(s.premiumSeatPrice),
        vipSeatPrice: Number(s.vipSeatPrice),
        status,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getTodayShowTimes = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    // Format today's date in local timezone (YYYY-MM-DD)
    const todayString =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    const screenings = await Screening.findAll({
      attributes: [
        "id",
        "screeningDate",
        "screeningTime",
        "regularSeatPrice",
        "premiumSeatPrice",
        "vipSeatPrice",
        "movieId",
        "theaterId",
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM seats s
            WHERE s.theater_id = "Screening"."theater_id"
          )`),
          "totalSeats",
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM tickets t
            JOIN bookings b ON t.booking_id = b.id
            WHERE b.screening_id = "Screening"."id" AND b.status = 'confirmed'
          )`),
          "bookedSeats",
        ],
      ],
      where: {
        screeningDate: {
          [Op.eq]: todayString,
        },
      },
      include: [
        {
          model: Movie,
          as: "movie",
          attributes: ["id", "title", "duration", "genre", "posterUrl"],
        },
        {
          model: Theater,
          as: "theater",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["screeningDate", "ASC"],
        ["screeningTime", "ASC"],
      ],
      raw: true,
      nest: true,
    });

    const result = screenings.map((s: any) => {
      const screeningDate = s.screeningDate;
      const screeningTime = s.screeningTime;
      const screeningDateTime = new Date(`${screeningDate}T${screeningTime}`);
      const durationMinutes = s.movie?.duration || 0;
      const endDateTime = new Date(
        screeningDateTime.getTime() + durationMinutes * 60_000
      );

      const now = new Date();
      let status: "upcoming" | "ongoing" | "completed";
      if (now < screeningDateTime) status = "upcoming";
      else if (now <= endDateTime) status = "ongoing";
      else status = "completed";

      const totalSeats = Number(s.totalSeats) || 0;
      const bookedSeats = Number(s.bookedSeats) || 0;

      return {
        id: s.id,
        movieId: s.movieId,
        theaterId: s.theaterId,
        movieTitle: s.movie?.title,
        movieImage: s.movie?.posterUrl,
        theater: s.theater?.name,
        date: screeningDate,
        time: screeningTime.slice(0, 5),
        duration: `${durationMinutes} min`,
        availableSeats: totalSeats - bookedSeats,
        totalSeats,
        regularSeatPrice: Number(s.regularSeatPrice),
        premiumSeatPrice: Number(s.premiumSeatPrice),
        vipSeatPrice: Number(s.vipSeatPrice),
        status,
      };
    });

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllShowTimes = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const screenings = await Screening.findAll({
      attributes: [
        "id",
        "screeningDate",
        "screeningTime",
        "regularSeatPrice",
        "premiumSeatPrice",
        "vipSeatPrice",
        "movieId",
        "theaterId",
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM seats s
            WHERE s.theater_id = "Screening"."theater_id"
          )`),
          "totalSeats",
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM tickets t
            JOIN bookings b ON t.booking_id = b.id
            WHERE b.screening_id = "Screening"."id" AND b.status = 'confirmed'
          )`),
          "bookedSeats",
        ],
      ],
      include: [
        {
          model: Movie,
          as: "movie",
          attributes: ["id", "title", "duration", "genre", "posterUrl"],
        },
        {
          model: Theater,
          as: "theater",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["screeningDate", "ASC"],
        ["screeningTime", "ASC"],
      ],
      raw: true,
      nest: true,
    });

    const result = screenings.map((s: any) => {
      const screeningDate = s.screeningDate;
      const screeningTime = s.screeningTime;
      const screeningDateTime = new Date(`${screeningDate}T${screeningTime}`);
      const durationMinutes = s.movie?.duration || 0;
      const endDateTime = new Date(
        screeningDateTime.getTime() + durationMinutes * 60_000
      );

      let status: "upcoming" | "ongoing" | "completed";
      if (now < screeningDateTime) status = "upcoming";
      else if (now <= endDateTime) status = "ongoing";
      else status = "completed";

      const totalSeats = Number(s.totalSeats) || 0;
      const bookedSeats = Number(s.bookedSeats) || 0;

      return {
        id: s.id,
        movieId: s.movieId,
        theaterId: s.theaterId,
        movieTitle: s.movie?.title,
        movieImage: s.movie?.posterUrl,
        theater: s.theater?.name,
        date: screeningDate,
        time: screeningTime.slice(0, 5),
        duration: `${durationMinutes} min`,
        availableSeats: totalSeats - bookedSeats,
        totalSeats,
        regularSeatPrice: Number(s.regularSeatPrice),
        premiumSeatPrice: Number(s.premiumSeatPrice),
        vipSeatPrice: Number(s.vipSeatPrice),
        status,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getShowTimesBasedOnMovieId = async (
  req: Request,
  res: Response
) => {
  try {
    const movieId = parseInt(req.params.movieId);
    const showTimes = await Screening.findByMovie(movieId);

    res.status(200).json(showTimes);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const addShowTime = async (req: Request, res: Response) => {
  try {
    const {
      movieId,
      theaterId,
      screeningDate,
      screeningTime,
      regularSeatPrice,
      premiumSeatPrice,
      vipSeatPrice,
    } = req.body;

    if (
      !movieId ||
      !theaterId ||
      !screeningDate ||
      !screeningTime ||
      !regularSeatPrice ||
      !premiumSeatPrice ||
      !vipSeatPrice
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newShowTime = await Screening.create({
      movieId,
      theaterId,
      screeningDate,
      screeningTime,
      regularSeatPrice,
      premiumSeatPrice,
      vipSeatPrice,
    });

    res.status(201).json(newShowTime);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateShowTime = async (req: Request, res: Response) => {
  try {
    const screeningId = parseInt(req.params.id);
    const {
      movieId,
      theaterId,
      screeningDate,
      screeningTime,
      regularSeatPrice,
      premiumSeatPrice,
      vipSeatPrice,
    } = req.body;

    if (
      !movieId ||
      !theaterId ||
      !screeningDate ||
      !screeningTime ||
      !regularSeatPrice ||
      !premiumSeatPrice ||
      !vipSeatPrice
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const screening = await Screening.findByPk(screeningId);

    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    await screening.update({
      movieId,
      theaterId,
      screeningDate,
      screeningTime,
      regularSeatPrice,
      premiumSeatPrice,
      vipSeatPrice,
    });

    res.status(200).json(screening);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteShowTime = async (req: Request, res: Response) => {
  try {
    const screeningId = parseInt(req.params.id);

    const screening = await Screening.findByPk(screeningId);

    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    await screening.destroy();

    res.status(200).json({ message: "Screening deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
