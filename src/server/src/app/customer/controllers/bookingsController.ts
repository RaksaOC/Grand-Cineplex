import { Request, Response } from "express";
import Booking from "../../../db/models/Booking";
import Customer from "../../../db/models/Customer";
import Seat from "../../../db/models/Seat";
import Ticket from "../../../db/models/Ticket";
import Screening from "../../../db/models/Screening";
import Movie from "../../../db/models/Movie";
import Theater from "../../../db/models/Theater";
import Payment from "../../../db/models/Payment";

export const getBookingBasedOnId = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);
    if (isNaN(bookingId))
      return res.status(400).json({ message: "Invalid booking ID" });

    const booking = await Booking.findOne({
      where: { id: bookingId },
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["name", "phone"],
        },
        {
          model: Screening,
          as: "screening",
          include: [
            {
              model: Movie,
              as: "movie",
              attributes: ["title"],
            },
            {
              model: Theater,
              as: "theater",
              attributes: ["name"],
            },
          ],
        },
        {
          model: Ticket,
          as: "tickets",
          include: [
            {
              model: Seat,
              as: "seat",
              attributes: ["seatNumber", "price"],
            },
          ],
        },
      ],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const b: any = booking;

    const seats =
      b.tickets?.map((ticket: any) => ({
        seatNumber: ticket.seat?.seatNumber,
        price: ticket.seat?.price || 0,
      })) || [];

    const totalAmount = seats.reduce((sum: number, s: any) => sum + s.price, 0);

    const summary = {
      movieTitle: b.screening?.movie?.title || "",
      theater: b.screening?.theater?.name || "",
      date: b.screening?.screeningDate || "",
      time: b.screening?.screeningTime || "",
      seats,
      totalAmount,
      customerName: b.customer?.name || "",
      customerPhone: b.customer?.phone || "",
      screeningId: b.screening?.id || null,
    };

    return res.status(200).json(summary);
  } catch (error) {
    console.error("getBookingBasedOnId error:", error);
    return  res.status(500).json({ message: "Internal server error" });
  }
};

// Create booking for authenticated user
export const createBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in to book." });
    }

    const {
      screening_id,
      seat_ids,
      method,
      amount,
      status = "confirmed",
    } = req.body;

    if (
      !screening_id ||
      !Array.isArray(seat_ids) ||
      seat_ids.length === 0 ||
      !method ||
      !amount
    ) {
      return res
        .status(400)
        .json({
          message: "screening_id, seat_ids, method, and amount are required",
        });
    }

    // Use user.id directly as customer_id
    const booking = await Booking.create({
      screeningId: screening_id,
      customerId: user.id,
      status,
    });

    await Promise.all(
      seat_ids.map((seat_id: number) =>
        Ticket.create({
          bookingId: booking.id,
          seatId: seat_id,
        })
      )
    );

    // Create payment record
    const payment = await Payment.create({
      bookingId: booking.id,
      method,
      amount,
      status: "completed",
    });

    return res.status(201).json({ id: booking.id, payment });
  } catch (error) {
    console.error("createBooking error:", error);
    return  res.status(500).json({ message: "Booking failed" });
  }
};

export const viewBookingHistory = async (req: Request, res: Response) => {
  try {
    const userEmail = (req as any).user?.email;

    if (!userEmail) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no email in token" });
    }

    const user = await Customer.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Booking.findAll({
      where: { customerId: user.id },
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["name", "phone"],
        },
        {
          model: Screening,
          as: "screening",
          include: [
            {
              model: Movie,
              as: "movie",
              attributes: ["title"],
            },
            {
              model: Theater,
              as: "theater",
              attributes: ["name"],
            },
          ],
        },
        {
          model: Ticket,
          as: "tickets",
          include: [
            {
              model: Seat,
              as: "seat",
              attributes: ["seatNumber", "rowNumber", "seatType"],
            },
          ],
        },
      ],
    });

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user." });
    }

    const bookingSummary = bookings.map((booking: any) => {
      const seats =
        booking.tickets?.map((ticket: any) => {
          const seat = ticket.seat;
          let price = 0;

          // Calculate price based on seat type and screening pricing
          switch (seat.seatType) {
            case "regular":
              price = booking.screening.regularSeatPrice;
              break;
            case "premium":
              price = booking.screening.premiumSeatPrice;
              break;
            case "vip":
              price = booking.screening.vipSeatPrice;
              break;
            default:
              price = booking.screening.regularSeatPrice;
          }

          return {
            seatNumber: seat.rowNumber + seat.seatNumber,
            price: price,
          };
        }) || [];

      const totalAmount = seats.reduce(
        (sum: number, seat: any) => sum + parseFloat(seat.price),
        0
      );

      return {
        movieTitle: booking.screening?.movie?.title || "",
        theaterName: booking.screening?.theater?.name || "",
        date:
          booking.screening?.screeningDate && booking.screening?.screeningTime
            ? new Date(
              `${booking.screening.screeningDate} ${booking.screening.screeningTime}`
            ).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            : "",
        time: booking.createdAt
          ? new Date(booking.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          : "",
        seats,
        totalAmount,
        status: booking.status || "",
        customerName: booking.customer?.name || "",
        customerPhone: booking.customer?.phone || "",
        screeningId: booking.screening?.id || null,
      };
    });

    return res.status(200).json({ bookings: bookingSummary });
  } catch (error) {
    console.error("ViewBookingHistory error:", error);
    return  res.status(500).json({ message: "Internal server error" });
  }
};
