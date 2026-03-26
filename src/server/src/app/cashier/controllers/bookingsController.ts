import { Request, Response } from "express";
import Booking from "../../../db/models/Booking";
import { BookingStatus } from "../../../db/models/Booking";
import Ticket from "../../../db/models/Ticket";
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

// export const addBookingByStaff = async (req: Request, res: Response) => {
//   try {
//     const staffId = req.user?.id;
//     const { customerId, screeningId, status } = req.body;

//     if (!customerId || !screeningId || !status) {
//       return res.status(400).json({
//         message: "Customer ID, screening ID, and status are required",
//       });
//     }

//     // Validate status
//     if (!Object.values(BookingStatus).includes(status)) {
//       return res.status(400).json({ message: "Invalid booking status" });
//     }

//     const newBooking = await Booking.create({
//       customerId,
//       screeningId,
//       status,
//       createdByStaffId: staffId,
//     });

//     res.status(201).json(newBooking);
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// };

export const addBookingByStaff = async (req: Request, res: Response) => {
  try {
    const createdByStaffId = req.user?.id;
    const { screeningId, seats, method, amount, status } = req.body;
    if (
      !screeningId ||
      !Array.isArray(seats) ||
      seats.length === 0 ||
      !method ||
      !amount ||
      !status
    ) {
      return res.status(400).json({
        message:
          "Screening ID, seats (array), method, amount, and status are required",
      });
    }
    const booking = await Booking.create({
      screeningId,
      status: "confirmed",
      createdByStaffId,
    });
    const tickets = [];
    for (const seatId of seats) {
      const ticket = await Ticket.create({
        seatId,
        bookingId: booking?.id,
      });
      tickets.push(ticket);
    }
    const payment = await Payment.create({
      bookingId: booking?.id,
      method,
      amount,
      status: "completed", // Payment status should be completed, not the booking status
    });

    res.status(201).json({ booking, tickets, payment });
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
