import { Model, DataTypes, Op, Sequelize } from "sequelize";
import Movie from "./Movie";

class Screening extends Model {
  declare id: number;
  declare movieId: number;
  declare theaterId: number;
  declare screeningDate: Date;
  declare screeningTime: string;
  declare regularSeatPrice: number;
  declare premiumSeatPrice: number;
  declare vipSeatPrice: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Custom instance methods
  getFormattedDateTime(): string {
    const date = new Date(this.screeningDate);
    const time = this.screeningTime;
    return `${date.toLocaleDateString()} at ${time}`;
  }

  getFullDateTime(): Date {
    const date = new Date(this.screeningDate);
    const [hours, minutes] = this.screeningTime.split(":");
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  }

  // Static methods
  static async findUpcoming() {
    return this.findAll({
      where: {
        screeningDate: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        {
          association: "movie",
          attributes: ["id", "title", "duration", "genre", "rating"],
        },
        {
          association: "theater",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["screeningDate", "ASC"],
        ["screeningTime", "ASC"],
      ],
    });
  }

  static async findByMovie(movieId: number) {
    return this.findAll({
      where: { movieId },
      include: [
        {
          association: "theater",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["screeningDate", "ASC"],
        ["screeningTime", "ASC"],
      ],
    });
  }

  static async findByTheater(theaterId: number) {
    return this.findAll({
      where: { theaterId },
      include: [
        {
          association: "movie",
          attributes: ["id", "title", "duration", "genre", "rating"],
        },
      ],
      order: [
        ["screeningDate", "ASC"],
        ["screeningTime", "ASC"],
      ],
    });
  }
}

export const initScreening = (sequelize: Sequelize) => {
  Screening.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "movie_id",
        references: {
          model: "movies",
          key: "id",
        },
      },
      theaterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "theater_id",
        references: {
          model: "theaters",
          key: "id",
        },
      },
      screeningDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "screening_date",
      },
      screeningTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "screening_time",
      },
      regularSeatPrice: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        field: "regular_seat_price",
      },
      premiumSeatPrice: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        field: "premium_seat_price",
      },
      vipSeatPrice: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        field: "vip_seat_price",
      },
    },
    {
      sequelize,
      tableName: "screenings",
      timestamps: true,
      underscored: true,
    }
  );
  // Screening.belongsTo(Movie, { as: "movie", foreignKey: "movieId" });
};

export default Screening;
