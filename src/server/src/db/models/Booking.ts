import { Model, DataTypes, Sequelize } from "sequelize";
import Customer from "./Customer";
import Staff from "./Staff";
import Screening from "./Screening";
// Define booking status enum
export enum BookingStatus {
  PENDING = "pending",
  RESERVED = "reserved",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

class Booking extends Model {
  declare id: number;
  declare customerId: number | null;
  declare screeningId: number;
  declare status: BookingStatus;
  declare createdByStaffId: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Custom instance methods
  isConfirmed(): boolean {
    return this.status === BookingStatus.CONFIRMED;
  }

  isCancelled(): boolean {
    return (
      this.status === BookingStatus.CANCELLED ||
      this.status === BookingStatus.REFUNDED
    );
  }

  canBeCancelled(): boolean {
    return (
      this.status === BookingStatus.PENDING ||
      this.status === BookingStatus.RESERVED ||
      this.status === BookingStatus.CONFIRMED
    );
  }

  // Static methods
  static async findWithDetails(bookingId: number) {
    return this.findByPk(bookingId, {
      include: [
        {
          association: "customer",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          association: "screening",
          include: [
            {
              association: "movie",
              attributes: ["id", "title", "duration", "genre"],
            },
            {
              association: "theater",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          association: "createdByStaff",
          attributes: ["id", "name", "role"],
        },
        {
          association: "tickets",
          include: [
            {
              association: "seat",
              attributes: ["rowNumber", "seatNumber", "seatType"],
            },
          ],
        },
        {
          association: "payments",
          attributes: ["id", "amount", "method", "status", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  static async findByCustomer(customerId: number) {
    return this.findAll({
      where: { customerId },
      include: [
        {
          association: "screening",
          include: [
            {
              association: "movie",
              attributes: ["id", "title", "duration"],
            },
            {
              association: "theater",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          association: "tickets",
          include: [
            {
              association: "seat",
              attributes: ["rowNumber", "seatNumber"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  static async findByScreening(screeningId: number) {
    return this.findAll({
      where: { screeningId },
      include: [
        {
          association: "customer",
          attributes: ["id", "name", "email"],
        },
        {
          association: "tickets",
          include: [
            {
              association: "seat",
              attributes: ["rowNumber", "seatNumber"],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  }

  static async findPending() {
    return this.findAll({
      where: { status: BookingStatus.PENDING },
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
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  }
}

export const initBooking = (sequelize: Sequelize) => {
  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "customer_id",
        references: {
          model: "customers",
          key: "id",
        },
      },
      screeningId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "screening_id",
        references: {
          model: "screenings",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(BookingStatus)),
        allowNull: false,
        defaultValue: BookingStatus.PENDING,
      },
      createdByStaffId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "created_by_staff_id",
        references: {
          model: "staff",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "bookings",
      timestamps: true,
      underscored: true,
    }
  );
  // In Booking.ts
  // Booking.belongsTo(Customer, { as: "customer", foreignKey: "customerId" });
  // Booking.belongsTo(Staff, {
  // 	as: "createdByStaff",
  // 	foreignKey: "createdByStaffId",
  // });
  // Booking.belongsTo(Screening, {
  // 	as: "screening",
  // 	foreignKey: "screeningId",
  // });
};

export default Booking;
