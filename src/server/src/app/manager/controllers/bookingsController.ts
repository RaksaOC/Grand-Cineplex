import { Request, Response } from "express";
import Booking from "../../../db/models/Booking";
import { BookingStatus } from "../../../db/models/Booking";
import Ticket from "../../../db/models/Ticket";
import Seat from "../../../db/models/Seat";
import Payment from "../../../db/models/Payment";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const getAllBookingsForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookingsInfo = await Booking.findByCustomer(userId);
    res.status(200).json(bookingsInfo);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getBookingBasedOnId = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookingId = parseInt(req.params.id);
    const bookingInfo = await Booking.findWithDetails(bookingId);

    if (!bookingInfo) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking belongs to the user
    if (bookingInfo.customerId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(bookingInfo);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const addBookingByStaff = async (req: Request, res: Response) => {
  try {
    const staffId = req.user?.id;
    const { customerId, screeningId, status } = req.body;

    if (!customerId || !screeningId || !status) {
      return res.status(400).json({
        message: "Customer ID, screening ID, and status are required",
      });
    }

    // Validate status
    if (!Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const newBooking = await Booking.create({
      customerId,
      screeningId,
      status,
      createdByStaffId: staffId,
    });

    res.status(201).json(newBooking);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateBookingByStaff = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);
    const { customerId, screeningId, status } = req.body;

    if (!customerId || !screeningId || !status) {
      return res.status(400).json({
        message: "Customer ID, screening ID, and status are required",
      });
    }

    // Validate status
    if (!Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.update({
      customerId,
      screeningId,
      status,
    });

    res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteBookingByStaff = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.destroy();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          association: "customer",
          attributes: ["id", "name", "email"],
        },
        {
          association: "screening",
          include: [
            {
              association: "movie",
              attributes: ["id", "title"],
            },
            {
              association: "theater",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          association: "createdByStaff",
          attributes: ["id", "name"],
        },
        {
          model: Ticket,
          as: "tickets",
          attributes: ["id"],
          include: [
            {
              model: Seat,
              as: "seat",
              attributes: ["id", "rowNumber", "seatNumber"],
            },
          ],
        },
        {
          model: Payment,
          as: "payments",
          attributes: ["id", "amount", "method"],
        },
      ],
    });
    const formattedBookings = bookings.map((booking: any) => {
      // Get all seat labels as "A1", "B5", etc.
      const seats = (booking.tickets || [])
        .map((ticket: any) =>
          ticket.seat
            ? `${ticket.seat.rowNumber}${ticket.seat.seatNumber}`
            : undefined
        )
        .filter(Boolean);

      // Sum all payment amounts (convert string to number)
      const totalAmount = (booking.payments || []).reduce(
        (sum: number, payment: any) => sum + parseFloat(payment.amount),
        0
      );

      // Get payment method (first payment if exists, else undefined)
      const paymentMethod =
        booking.payments && booking.payments.length > 0
          ? booking.payments[0].method
          : undefined;

      return {
        id: booking.id,
        customerName: booking.customer?.name,
        customerEmail: booking.customer?.email,
        movieTitle: booking.screening?.movie?.title,
        theater: booking.screening?.theater?.name,
        date: booking.updatedAt,
        time: booking.screening?.screeningTime,
        seats,
        totalAmount,
        bookingMethod: "online", // or "walk-in" if you have that info
        status: booking.status,
        bookingDate: new Date(booking.createdAt).toISOString(),
        cashierName: booking.createdByStaff?.name,
        paymentMethod,
      };
    });
    res.status(200).json(formattedBookings);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
