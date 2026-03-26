import { Request, Response } from "express";
import Seat from "../../../db/models/Seat";
import Theater from "../../../db/models/Theater";
import Screening from "../../../db/models/Screening";
import Ticket from "../../../db/models/Ticket";
import Booking from "../../../db/models/Booking";

type ScreeningWithRelations = Screening & {
  theater: {
    name: string;
    seats: Array<{
      id: number;
      rowNumber: string;
      seatNumber: number;
      seatType: string;
    }>;
  };
  movie: {
    title: string;
  };
  screeningDate: string;
  screeningTime: string;
  regularSeatPrice: number;
  premiumSeatPrice: number;
  vipSeatPrice: number;
};

export const getAllSeatsBasedOnShowTime = async (
  req: Request,
  res: Response
) => {
  try {
    const showTimeId = parseInt(req.params.id);

    const screening = (await Screening.findByPk(showTimeId, {
      include: [
        {
          association: "movie",
          attributes: ["title"],
        },
        {
          association: "theater",
          attributes: ["name"],
          include: [
            {
              association: "seats",
              attributes: ["id", "rowNumber", "seatNumber", "seatType"],
            },
          ],
        },
      ],
    })) as ScreeningWithRelations | null;

    if (!screening || !screening.theater || !screening.movie) {
      return res.status(404).json({ message: "Screening not found" });
    }

    const bookedTickets = await Ticket.findAll({
      include: [
        {
          association: "booking",
          attributes: [],
          where: { screeningId: showTimeId },
        },
      ],
      attributes: ["seatId"],
    });

    const bookedSeatIds = bookedTickets.map((ticket) => ticket.seatId);
    const theaterSeats = screening.theater.seats || [];

    const seatsWithStatus = theaterSeats.map((seat) => ({
      id: seat.id,
      rowNumber: seat.rowNumber,
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      isBooked: bookedSeatIds.includes(seat.id),
    }));

    res.status(200).json({
      movieTitle: screening.movie.title,
      theaterName: screening.theater.name,
      screeningDate: screening.screeningDate,
      screeningTime: screening.screeningTime,
      regularSeatPrice: screening.regularSeatPrice,
      premiumSeatPrice: screening.premiumSeatPrice,
      vipSeatPrice: screening.vipSeatPrice,
      seats: seatsWithStatus,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : error;
    return res.status(500).json({ error: err });
  }
};

export const addSeat = async (req: Request, res: Response) => {
  try {
    const { seatNumber, theaterId, rowNumber, seatType } = req.body;

    if (!seatNumber || !theaterId || !rowNumber) {
      return res.status(400).json({
        message: "Seat number, theater ID, and row number are required",
      });
    }

    const newSeat = await Seat.create({
      seatNumber,
      theaterId,
      rowNumber,
      seatType: seatType || "regular",
    });

    res.status(201).json(newSeat);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateSeat = async (req: Request, res: Response) => {
  try {
    const seatId = parseInt(req.params.id);
    const { seatNumber, rowNumber, seatType } = req.body;

    if (!seatNumber || !rowNumber) {
      return res
        .status(400)
        .json({ message: "Seat number and row number are required" });
    }

    const seat = await Seat.findByPk(seatId);

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    await seat.update({
      seatNumber,
      rowNumber,
      seatType,
    });

    res.status(200).json(seat);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteSeat = async (req: Request, res: Response) => {
  try {
    const seatId = parseInt(req.params.id);

    const seat = await Seat.findByPk(seatId);

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    await seat.destroy();

    res.status(200).json({ message: "Seat deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
