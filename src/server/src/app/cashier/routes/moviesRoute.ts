import express from "express";
import {
  addMovie,
  deleteMovie,
  getAllMovies,
  getMovieAndScreeningBasedOnId,
  getMoviesAndItsScreenings,
  getMoviesFor7Days,
  updateMovie,
} from "../controllers/moviesController";
import authMiddlewareCashier from "../../../middleware/authMiddlewareCashier";

const route = express.Router();
route.use(authMiddlewareCashier);

route.get("/", getMoviesFor7Days);
route.get("/:id", getMovieAndScreeningBasedOnId);
route.get("/details", getMoviesAndItsScreenings);

export default route;
