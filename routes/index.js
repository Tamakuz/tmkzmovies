import { Router } from 'express';

import Paths from '../Paths.js';
import { getMovieByGenres, getMovieById, getMovieByTitle, getMovies, getMovieByPopularity, getMovieByYear } from '../services/movie.js';

// **** Variables **** //

const apiRouter = Router();


apiRouter.get(Paths.getMovies, getMovies);
apiRouter.get(Paths.getMovieById, getMovieById);
apiRouter.get(Paths.getMovieByTitle, getMovieByTitle);
apiRouter.get(Paths.getMovieByGenres, getMovieByGenres);
apiRouter.get(Paths.getMovieByPopularity, getMovieByPopularity);
apiRouter.get(Paths.getMovieByYear, getMovieByYear);


// **** Export default **** //

export default apiRouter;
