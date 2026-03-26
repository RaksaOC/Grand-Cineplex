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
      price: number;
    }>;
  };
  movie: {
    title: string;
  };
  screeningDate: string;
  screeningTime: string;
  price: number;
};

export const getAllSeatsBasedOnShowTime = async (
  req: Request,
  res: Response
) => {
  try {
    const show_time_id = parseInt(req.params.id);

    const screening = (await Screening.findByPk(show_time_id, {
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
          where: { screening_id: show_time_id },
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

export const selectSeat = async (req: Request, res: Response) => {
  try {
    const { seat_ids, screening_id } = req.body;

    if (!Array.isArray(seat_ids) || seat_ids.length === 0 || !screening_id) {
      return res.status(400).json({ message: "Invalid seat selection" });
    }

    const seats = await Seat.findAll({ where: { id: seat_ids } });
    if (seats.length !== seat_ids.length) {
      return res.status(404).json({ message: "One or more seats not found" });
    }

    const booked = await Ticket.findAll({
      where: { seatId: seat_ids },
      include: [
        {
          association: "booking",
          where: { screeningId: screening_id },
        },
      ],
    });

    if (booked.length > 0) {
      return res.status(409).json({
        message: "Some seats are already booked",
        bookedSeatIds: booked.map((b) => b.seatId),
      });
    }

    res.status(200).json({ message: "Seats available", selected: seat_ids });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : error;
    return res.status(500).json({ error: err });
  }
};

export const bookSeats = async (req: Request, res: Response) => {
  const t = await Seat.sequelize?.transaction();
  try {
    const { userId, screeningId, seatIds } = req.body;

    if (
      !userId ||
      !screeningId ||
      !Array.isArray(seatIds) ||
      seatIds.length === 0
    ) {
      return res.status(400).json({ message: "Invalid booking request" });
    }

    const alreadyBooked = await Ticket.findAll({
      where: { seatId: seatIds },
      include: [
        {
          association: "booking",
          where: { screeningId },
        },
      ],
    });

    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        message: "Some seats already booked",
        bookedSeatIds: alreadyBooked.map((b) => b.seatId),
      });
    }

    const booking = await Booking.create(
      {
        userId,
        screeningId,
        bookingDate: new Date(),
      },
      { transaction: t }
    );

    const ticketPromises = seatIds.map((seat_id: number) =>
      Ticket.create(
        {
          bookingId: booking.id,
          seatId: seat_id,
        },
        { transaction: t }
      )
    );

    await Promise.all(ticketPromises);
    await t?.commit();

    res
      .status(201)
      .json({ message: "Booking successful", bookingId: booking.id });
  } catch (error: unknown) {
    await t?.rollback();
    const err = error instanceof Error ? error.message : error;
    return res.status(500).json({ error: err });
  }
};
