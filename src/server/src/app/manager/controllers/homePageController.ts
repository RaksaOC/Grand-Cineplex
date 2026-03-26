import Ticket from "../../../db/models/Ticket";
import Booking from "../../../db/models/Booking";
import { Op } from "sequelize";
import Screening from "../../../db/models/Screening";
import Movie from "../../../db/models/Movie";
import Theater from "../../../db/models/Theater";
import Payment from "../../../db/models/Payment";
import Staff from "../../../db/models/Staff";

const getAllBookingSinceLastWeek = async () => {
	try {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const bookings = await Booking.findAll({
			where: {
				createdAt: {
					[Op.gte]: sevenDaysAgo,
				},
			},
			include: [
				{
					association: "customer",
					attributes: ["name"],
				},
				{
					association: "createdByStaff",
					attributes: ["name"],
				},
				{
					association: "screening",
					attributes: ["id"],
					include: [
						{
							association: "movie",
							attributes: ["title"],
						},
					],
				},
			],
		});

		// If you want to flatten the movie title into the booking object:
		const bookingsWithMovie = bookings.map((booking) => {
			const plain = booking.toJSON();
			return {
				...plain,
				movieTitle: plain.screening?.movie?.title ?? null,
			};
		});

		// If you want to include payment amount as well:
		const bookingIds = bookings.map((booking) => booking.id);
		const payments = await Payment.findAll({
			where: {
				bookingId: {
					[Op.in]: bookingIds,
				},
			},
			attributes: ["bookingId", "amount"],
		});
		// Map payment amounts to booking
		const paymentMap = Object.fromEntries(payments.map((p) => [p.bookingId, p.amount]));
		bookingsWithMovie.forEach((b) => {
			b.amount = paymentMap[b.id] ?? null;
		});

		return bookingsWithMovie;
	} catch (error) {
		console.error("Error fetching bookings:", error);
	}
};

const getMoneyFromThisMonthAndLastMonth = async () => {
	try {
		const now = new Date();

		// Start of this month
		const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
		// Start of next month
		const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
		// Start of last month
		const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);

		const [thisMonthRaw, lastMonthRaw] = await Promise.all([
			Payment.sum("amount", {
				where: {
					createdAt: {
						[Op.gte]: startThisMonth,
						[Op.lt]: startNextMonth,
					},
				},
			}),
			Payment.sum("amount", {
				where: {
					createdAt: {
						[Op.gte]: startLastMonth,
						[Op.lt]: startThisMonth,
					},
				},
			}),
		]);

		const thisMonth = Number(thisMonthRaw) || 0;
		const lastMonth = Number(lastMonthRaw) || 0;

		const percentageFromLastMonth = lastMonth === 0 ? null : ((thisMonth - lastMonth) / lastMonth) * 100;

		return {
			revenue: thisMonth,
			percentageFromLastMonth, // e.g. 25 means +25%
		};
	} catch (error) {
		console.error("Error fetching money from this month and last month:", error);
		throw error;
	}
};

const getPendingBookingsCounts = async () => {
	try {
		const pendingBookingsCount = await Booking.count({});
		return pendingBookingsCount;
	} catch (error) {
		console.error("Error fetching pending bookings count:", error);
		return 0;
	}
};

const getUpcomingScreeningCountNextWeek = async () => {
	try {
		const today = new Date();
		const lastWeek = new Date();
		lastWeek.setDate(today.getDate() + 7);
		const upcomingScreeningsCount = await Screening.count({
			where: {
				screeningDate: {
					[Op.gte]: today,
				},
			},
		});
		const lastWeekScreeningsCount = await Screening.count({
			where: {
				screeningDate: {
					[Op.gte]: lastWeek,
					[Op.lt]: today,
				},
			},
		});
		return {
			thisWeekScreeningsCount: upcomingScreeningsCount,
			percentageFromLastWeek: upcomingScreeningsCount / lastWeekScreeningsCount,
		};
	} catch (error) {
		console.error("Error fetching upcoming movies count:", error);
		return 0;
	}
};

const getMovieCounts = async () => {
	try {
		const movieCount = await Movie.count();
		return movieCount;
	} catch (error) {
		console.error("Error fetching movie count:", error);
		return 0;
	}
};

const getActiveTheatersCount = async () => {
	try {
		const activeTheatersCount = await Theater.count();
		return activeTheatersCount;
	} catch (error) {
		console.error("Error fetching active theaters count:", error);
		return 0;
	}
};

const getTotalStaffCount = async () => {
	try {
		const totalStaffCount = await Staff.count();
		return totalStaffCount;
	} catch (error) {
		console.error("Error fetching total staff count:", error);
		return 0;
	}
};

const recentlyAddedMovies = async () => {
	try {
		const today = new Date();
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(today.getDate() - 7);

		const movies = await Movie.findAll({
			where: {
				createdAt: {
					[Op.gte]: sevenDaysAgo,
				},
			},
			order: [["createdAt", "DESC"]],
			limit: 5,
		});

		return movies;
	} catch (error) {
		console.error("Error fetching recently added movies:", error);
		return [];
	}
};

export const getInfoForHomePage = async (req: any, res: any) => {
	try {
		res.json({
			totalRevenue: await getMoneyFromThisMonthAndLastMonth(),
			totalBookings: await getAllBookingSinceLastWeek(),
			pendingBookingsCount: await getPendingBookingsCounts(),
			upcomingScreeningCount: await getUpcomingScreeningCountNextWeek(),
			movieCount: await getMovieCounts(),
			activeTheatersCount: await getActiveTheatersCount(),
			totalStaffCount: await getTotalStaffCount(),
			recentlyAddedMovies: await recentlyAddedMovies(),
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal server error", error });
	}
};
