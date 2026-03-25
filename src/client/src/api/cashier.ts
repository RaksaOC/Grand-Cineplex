import axios from "axios";
import { ScreeningSeatData } from "../../../shared/types/type";

const getAuthHeaders = () => {
	const token = localStorage.getItem("token");
	return token ? { Authorization: `Bearer ${token}` } : {};
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
type BookingSummary = {
	seats: number[];
	screeningId: number;
	amount: number;
	method: string;
	status: string;
};

// FUNCTIONS TO GET DATA FROM THE API ============================================

export const getMoviesFor7Days = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/cashier/movies`, {
			headers: getAuthHeaders(),
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching movies for 7 days:", error);
		throw error;
	}
};

export const getMovieAndScreeningBasedOnId = async (id: number, screeningDate: string) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/cashier/movies/${id}?screeningDate=${screeningDate}`, { headers: getAuthHeaders() });
		return response.data;
	} catch (error) {
		console.error("Error fetching movie and screening based on ID:", error);
		throw error;
	}
};

export const getSeatsBasedOnScreeningId = async (screeningId: number): Promise<ScreeningSeatData> => {
	try {
		const response = await axios.get(`${API_BASE_URL}/cashier/seats/available-seats/${screeningId}`, {
			headers: getAuthHeaders(),
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching seats based on screening ID:", error);
		throw error;
	}
};

export const getMoviesAndItsScreenings = async (screeningId: number) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/cashier/showtimes/${screeningId}`, {
			headers: getAuthHeaders(),
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching movies and their screenings:", error);
		throw error;
	}
};

export const submitBooking = async (bookingData: BookingSummary) => {
	try {
		const response = await axios.post(`${API_BASE_URL}/cashier/bookings/booking`, bookingData, {
			headers: getAuthHeaders(),
		});
		return response.data;
	} catch (error) {
		console.error("Error submitting booking:", error);
		throw error;
	}
};

export const getQrCode = async (amount: number) => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/cashier/payment/qr-code`,
			{ amount },
			{ headers: getAuthHeaders() }
		);
		return response.data;
	} catch (error) {
		console.error("Error getting QR code:", error);
		throw error;
	}
};

export const checkPaymentStatus = async (tranId: string) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/cashier/payment/status/${tranId}`, {
			headers: getAuthHeaders(),
		});
		return response.data;
	} catch (error) {
		console.error("Error checking payment status:", error);
		throw error;
	}
};
