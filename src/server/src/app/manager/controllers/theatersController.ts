import Theater from "../../../db/models/Theater";
import Seat, { SeatType } from "../../../db/models/Seat";
import { Request, Response } from "express";
import { fn, col } from "sequelize";

export const getTheaters = async (req: Request, res: Response) => {
  try {
    const theaters = await Theater.findAll({
      attributes: [
        "id",
        "name",
        [fn("COUNT", col("seats.id")), "capacity"],
        [fn("COUNT", fn("DISTINCT", col("seats.row_number"))), "rows"],
        [fn("MAX", col("seats.seat_number")), "seatsPerRow"],
      ],
      include: [
        {
          model: Seat,
          as: "seats",
          attributes: [],
        },
      ],
      group: ["Theater.id", "Theater.name"],
    });

    const formatted = theaters.map((theater: any) => {
      const plain = theater.get ? theater.get({ plain: true }) : theater;
      return {
        id: plain.id,
        name: plain.name,
        capacity: Number(plain.capacity),
        rows: Number(plain.rows), // Count of distinct row letters (A, B, C, etc.)
        seatsPerRow: Number(plain.seatsPerRow), // Maximum seat number per row (columns)
        status: plain.status,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const addTheater = async (req: Request, res: Response) => {
  try {
    const {
      name,
      status,
      cinemaId,
      seatsPerRow,
      rows,
    }: {
      name: string;
      status: string;
      cinemaId: string | number;
      seatsPerRow: number;
      rows: number;
    } = req.body;

    if (!name || !status || !cinemaId || !seatsPerRow || !rows) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create the theater
    const newTheater = await Theater.create({
      name,
      status,
      cinemaId: Number(cinemaId),
    });

    // Generate seats dynamically
    const seatsToCreate = [];

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const rowLetter = String.fromCharCode(65 + rowIndex); // A, B, C, etc.

      // Determine seat type based on row position
      let seatType: SeatType;
      if (rowIndex >= rows - 2) {
        // Last 2 rows are VIP
        seatType = SeatType.VIP;
      } else if (rowIndex >= rows - 4 && rowIndex < rows - 2) {
        // 2 rows before the last 2 are Premium
        seatType = SeatType.PREMIUM;
      } else {
        // All other rows are Regular
        seatType = SeatType.REGULAR;
      }

      // Create seats for this row
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        seatsToCreate.push({
          theaterId: newTheater.id,
          rowNumber: rowLetter,
          seatNumber: seatNumber,
          seatType: seatType,
        });
      }
    }

    // Bulk create all seats
    await Seat.bulkCreate(seatsToCreate);

    // Return the created theater with seat count
    const theaterWithSeats = await Theater.findByPk(newTheater.id, {
      include: [
        {
          model: Seat,
          as: "seats",
          attributes: ["id", "rowNumber", "seatNumber", "seatType"],
        },
      ],
    });

    return res.status(201).json({
      ...theaterWithSeats?.toJSON(),
      totalSeats: seatsToCreate.length,
    });
  } catch (error) {
    console.error("Error creating theater with seats:", error);
    return return res.status(500).json({ message: "Internal server error", error });
  }
};
