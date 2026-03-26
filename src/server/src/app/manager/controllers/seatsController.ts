import { Request, Response } from "express";
import Seat from "../../../db/models/Seat";
import Theater from "../../../db/models/Theater";
import Screening from "../../../db/models/Screening";
import Ticket from "../../../db/models/Ticket";
import Booking from "../../../db/models/Booking";

export const getAllSeatsBasedOnShowTime = async (
  req: Request,
  res: Response
) => {
  try {
    const showTimeId = parseInt(req.params.id);

    // Get all seats for the theater of this screening
    const screening = await Screening.findByPk(showTimeId, {
      include: [
        {
          association: "theater",
          include: [
            {
              association: "seats",
              attributes: ["id", "rowNumber", "seatNumber", "seatType"],
            },
          ],
        },
      ],
    });

    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    // Get booked seats for this screening
    const bookedSeats = await Ticket.findAll({
      include: [
        {
          association: "booking",
          where: { screeningId: showTimeId },
          attributes: ["id"],
        },
      ],
      attributes: ["seatId"],
    });

    const bookedSeatIds = bookedSeats.map((ticket) => ticket.seatId);

    // Filter out booked seats - using type assertion for the association
    const theaterSeats = (screening as any).theater?.seats || [];
    const availableSeats = theaterSeats.filter(
      (seat: any) => !bookedSeatIds.includes(seat.id)
    );

    res.status(200).json(availableSeats);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
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
