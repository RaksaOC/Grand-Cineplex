import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  },
});

// Import models for associations
import Movie, { initMovie } from "./models/Movie";
import Theater, { initTheater } from "./models/Theater";
import Seat, { initSeat } from "./models/Seat";
import Screening, { initScreening } from "./models/Screening";
import Customer, { initCustomer } from "./models/Customer";
import Staff, { initStaff } from "./models/Staff";
import Booking, { initBooking } from "./models/Booking";
import Ticket, { initTicket } from "./models/Ticket";
import Payment, { initPayment } from "./models/Payment";

// Define associations
const setupAssociations = () => {
  Theater.hasMany(Seat, { foreignKey: "theater_id", as: "seats" });
  Theater.hasMany(Screening, { foreignKey: "theater_id", as: "screenings" });

  Movie.hasMany(Screening, { foreignKey: "movie_id", as: "screenings" });

  Seat.belongsTo(Theater, { foreignKey: "theater_id", as: "theater" });
  Seat.hasMany(Ticket, { foreignKey: "seat_id", as: "tickets" });

  Screening.belongsTo(Movie, { foreignKey: "movie_id", as: "movie" });
  Screening.belongsTo(Theater, { foreignKey: "theater_id", as: "theater" });
  Screening.hasMany(Booking, { foreignKey: "screening_id", as: "bookings" });

  Customer.hasMany(Booking, { foreignKey: "customer_id", as: "bookings" });

  Staff.hasMany(Booking, {
    foreignKey: "created_by_staff_id",
    as: "createdBookings",
  });

  Booking.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
  Booking.belongsTo(Screening, { foreignKey: "screening_id", as: "screening" });
  Booking.belongsTo(Staff, {
    foreignKey: "created_by_staff_id",
    as: "createdByStaff",
  });
  Booking.hasMany(Ticket, { foreignKey: "booking_id", as: "tickets" });
  Booking.hasMany(Payment, { foreignKey: "booking_id", as: "payments" });

  Ticket.belongsTo(Booking, { foreignKey: "booking_id", as: "booking" });
  Ticket.belongsTo(Seat, { foreignKey: "seat_id", as: "seat" });

  Payment.belongsTo(Booking, { foreignKey: "booking_id", as: "booking" });
};

// Initialize models and associations
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database:", sequelize.getDatabaseName());

    initMovie(sequelize);
    initTheater(sequelize);
    initSeat(sequelize);
    initScreening(sequelize);
    initCustomer(sequelize);
    initStaff(sequelize);
    initBooking(sequelize);
    initTicket(sequelize);
    initPayment(sequelize);

    setupAssociations();

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Database synchronized.");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, initializeDatabase };
export default sequelize;
