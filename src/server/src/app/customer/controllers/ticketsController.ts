import { Request, Response } from "express";
import Ticket from "../../../db/models/Ticket";

export const addTicket = async (req: Request, res: Response) => {
  try {
    const { bookingId, ticketType, seatId } = req.body;

    if (!bookingId || !ticketType || !seatId) {
      return res
        .status(400)
        .json({ message: "Booking ID, ticket type, and seat ID are required" });
    }

    const newTicket = await Ticket.create({
      bookingId: parseInt(bookingId),
      ticketType,
      seatId: parseInt(seatId),
    });

    res.status(201).json(newTicket);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const allTickets = await Ticket.findAll({
      include: [
        {
          association: "booking",
          include: [
            {
              association: "screening",
              include: [
                {
                  association: "movie",
                  attributes: ["id", "title"],
                },
              ],
            },
          ],
        },
        {
          association: "seat",
          attributes: ["rowNumber", "seatNumber", "seatType"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(allTickets);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id);

    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await ticket.destroy();

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id);
    const { bookingId, ticketType, seatId } = req.body;

    if (!bookingId || !ticketType || !seatId) {
      return res
        .status(400)
        .json({ message: "Booking ID, ticket type, and seat ID are required" });
    }

    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await ticket.update({
      bookingId: parseInt(bookingId),
      ticketType,
      seatId: parseInt(seatId),
    });

    res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getTicketBasedOnId = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.bookingId);

    const ticketsForBooking = await Ticket.findByBooking(bookingId);

    if (ticketsForBooking.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this booking" });
    }

    res.status(200).json(ticketsForBooking);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
