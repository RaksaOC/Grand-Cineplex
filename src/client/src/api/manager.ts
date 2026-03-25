import axios from "axios";

type MovieData = {
  id?: number; // Optional for new movies
  title: string;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  duration: string;
  genre?: string;
  rating?: number;
  releaseDate?: string;
  director?: string;
  cast?: string;
  language?: string;
};

type MoviePosterPresignedUrlRequest = {
  movieId: number;
  fileName: string;
  contentType?: string;
};

type MoviePosterPresignedUrlResponse = {
  uploadUrl: string;
  posterUrl: string;
  key: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getHomePageInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manager/home`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching home page info:", error);
    throw error;
  }
};

export const getRecentlyAddedMovies = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/manager/movies/recently-added`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming screening count:", error);
    throw error;
  }
};

export const getAllMovies = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/manager/movies`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching all movies:", error);
    throw error;
  }
};

export const addMovie = async (movieData: MovieData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/manager/movies`,
      movieData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

export const updateMovie = async (movieData: MovieData) => {
  try {
    console.log("Updating movie with data:", movieData);
    const response = await axios.patch(
      `${API_BASE_URL}/manager/movies`,
      movieData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};

export const getMoviePosterPresignedUrl = async (
  data: MoviePosterPresignedUrlRequest
): Promise<MoviePosterPresignedUrlResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/manager/movies/posters/presigned-url`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching presigned upload URL:", error);
    throw error;
  }
};

export const getTodayShowTimes = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/manager/showtimes/today`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching today's showtimes:", error);
    throw error;
  }
};

export const getAllShowTimes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manager/showtimes`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all showtimes:", error);
    throw error;
  }
};

export const getAllStaff = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manager/staff`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching staff data:", error);
    throw error;
  }
};

export const addStaff = async (staffData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/manager/staff`,
      staffData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding staff:", error);
    throw error;
  }
};

export const getTheaters = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manager/theaters`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching theaters:", error);
    throw error;
  }
};

export const addTheater = async (theaterData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/manager/theaters`,
      theaterData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding theater:", error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manager/bookings`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const addScreening = async (screeningData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/manager/showtimes`,
      screeningData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding screening:", error);
    throw error;
  }
};

export const deleteMovie = async (id: number) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/manager/movies/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};

export const deleteScreening = async (id: number) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/manager/showtimes/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting screening:", error);
    throw error;
  }
};

export const updateScreening = async (screeningData: any) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/manager/showtimes/${screeningData.id}`,
      screeningData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating screening:", error);
    throw error;
  }
};

export const deleteStaff = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/manager/staff/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};

export const updateStaff = async (staffData: any) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/manager/staff/${staffData.id}`,
      staffData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};
