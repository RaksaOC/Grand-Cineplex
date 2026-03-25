import express from "express";
import {
  addMovie,
  deleteMovie,
  getAllMovies,
  getMovieBasedOnId,
  getRecentlyAddedMovies,
  getMoviePosterPresignedUrl,
  updateMovie,
} from "../controllers/moviesController";
import verifyToken from "../../../middleware/authMiddlewareManager";
import authMiddlewareManager from "../../../middleware/authMiddlewareManager";

const route = express.Router();
route.use(authMiddlewareManager);

route.get("/", getAllMovies);
// route.get("/:id", getMovieBasedOnId);
route.post("/", addMovie);
route.patch("/", updateMovie);
route.post("/posters/presigned-url", getMoviePosterPresignedUrl);
route.delete("/movies/:id", verifyToken, deleteMovie);
route.get("/recently-added", getRecentlyAddedMovies);

export default route;
