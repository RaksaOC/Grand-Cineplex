import {
  Movie,
  MovieWithScreenings,
  BookingSummary,
  ScreeningSeatData,
  Theater,
} from "../../../shared/types/type";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const movieBaseUrl = `${API_BASE_URL}/customer/movies`;
const seatBaseUrl = `${API_BASE_URL}/customer/seats`;
const bookingUrl = `${API_BASE_URL}/customer/bookings`;
const theaterBaseUrl = `${API_BASE_URL}/customer/theaters`;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function fetchMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(movieBaseUrl);
    return handleResponse<Movie[]>(response);
  } catch (error) {
    console.error("fetchMovies error:", error);
    throw error;
  }
}

export async function fetchNowShowingMovies(date?: string): Promise<Movie[]> {
  try {
    let url = `${movieBaseUrl}/now-showing`;
    if (date) url += `?date=${date}`;
    const response = await fetch(url);
    return handleResponse<Movie[]>(response);
  } catch (error) {
    console.error("fetchNowShowingMovies error:", error);
    throw error;
  }
}

export async function fetchUpcomingMovies(
  month?: number,
  year?: number
): Promise<Movie[]> {
  try {
    let url = `${movieBaseUrl}/upcoming`;
    if (month && year) url += `?month=${month}&year=${year}`;
    const response = await fetch(url);
    return handleResponse<Movie[]>(response);
  } catch (error) {
    console.error("fetchUpcomingMovies error:", error);
    throw error;
  }
}

export async function fetchMovieById(
  id: number,
  day = 0
): Promise<MovieWithScreenings> {
  try {
    const url = `${movieBaseUrl}/screenings?id=${id}&day=${day}`;
    const response = await fetch(url);
    return handleResponse<MovieWithScreenings>(response);
  } catch (error) {
    console.error("fetchMovieById error:", error);
    throw error;
  }
}

export async function fetchSeatsByScreening(
  screeningId: number
): Promise<ScreeningSeatData> {
  try {
    const response = await fetch(`${seatBaseUrl}/screening/${screeningId}`);
    return handleResponse<ScreeningSeatData>(response);
  } catch (error) {
    console.error("fetchSeatsByScreening error:", error);
    throw error;
  }
}

export async function selectSeats(
  seatIds: number[],
  screeningId: number
): Promise<{ message: string; selected: number[] }> {
  try {
    const response = await fetch(`${seatBaseUrl}/selected`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seat_ids: seatIds, screening_id: screeningId }),
    });
    return handleResponse<{ message: string; selected: number[] }>(response);
  } catch (error) {
    console.error("selectSeats error:", error);
    throw error;
  }
}

export async function bookSeats(
  screeningId: number,
  seatIds: number[],
  method: string,
  amount: number,
  status: string = "confirmed"
): Promise<{ id: number }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("You must be logged in to book it.");

    const response = await fetch(bookingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        screening_id: screeningId,
        seat_ids: seatIds,
        method,
        amount,
        status,
      }),
    });

    return handleResponse<{ id: number }>(response);
  } catch (error) {
    console.error("bookSeats error:", error);
    throw error;
  }
}

export async function fetchBookingDetails(
  bookingId: number
): Promise<BookingSummary> {
  try {
    const token = localStorage.getItem("token");
    if (!token)
      throw new Error("You must be logged in to view booking details.");

    const response = await fetch(`${bookingUrl}/${bookingId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse<BookingSummary>(response);
  } catch (error) {
    console.error("fetchBookingDetails error:", error);
    throw error;
  }
}

export async function fetchTheaters(): Promise<Theater[]> {
  try {
    const response = await fetch(theaterBaseUrl);
    return handleResponse<Theater[]>(response);
  } catch (error) {
    console.error("fetchTheaters error:", error);
    throw error;
  }
}

export async function fetchUserInfo(): Promise<{
  id: number;
  name: string;
  phone?: string;
}> {
  const token = localStorage.getItem("token");
  console.log("[Frontend] Token from localStorage:", token);

  if (!token) throw new Error("User not logged in");

  const response = await fetch("http://localhost:6900/customer/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("[Frontend] Response status:", response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("[Frontend] Error response:", errorData);
    throw new Error(errorData.message || "Failed to fetch user info");
  }

  const data = await response.json();
  console.log("[Frontend] Fetched user data:", data);
  return data;
}

// Payment functions
export async function getQrCode(amount: number) {
  try {
    const response = await fetch(
      "http://localhost:6900/customer/payment/qr-code",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error getting QR code:", error);
    throw error;
  }
}

export async function checkPaymentStatus(tranId: string) {
  try {
    const response = await fetch(
      `http://localhost:6900/customer/payment/status/${tranId}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
}

export async function fetchBookingHistory() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not logged in");

    const response = await fetch(
      "http://localhost:6900/customer/bookings/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await handleResponse<{ bookings: BookingSummary[] }>(response);
    return data.bookings;
  } catch (error) {
    console.error("Error fetching booking history:", error);
    throw error;
  }
}
