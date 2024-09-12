import MovieModel from "../models/movie.model.js";
import { connectToDatabase } from "../db/connection.js";

export const getMovies = async (req, res) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const sortCriteria = {};
    const movies = await MovieModel.find()
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort(sortCriteria)
      .select('_id title poster status tmdb_id imdb_id synopsisID synopsisEN');

    const totalMovies = await MovieModel.countDocuments();
    const totalPages = Math.ceil(totalMovies / Number(limit));

    if (movies.length === 0) {
      res.status(404).json({
        success: false,
        data: [],
        message: 'No movies found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      results: {
        movies,
        totalPages,
        currentPage: Number(page),
      },
      message: 'Movies fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: error.message,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await MovieModel.findById(id).select('-__v');

    if (!movie) {
      res.status(404).json({
        success: false,
        results: null,
        message: 'Movie not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      results: movie,
      message: 'Movie fetched successfully',
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie',
      error: error.message,
    });
  }
};

export const getMovieByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const movie = await MovieModel.findOne({ title }).select('-__v');

    if (!movie) {
      res.status(404).json({
        success: false,
        results: null,
        message: 'Movie not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      results: movie,
      message: 'Movie fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie',
      error: error.message,
    });
  }
};

export const getMovieByGenres = async (req, res) => {
  try {
    const { genres } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const genreArray = genres.split(',');
    const movies = await MovieModel.find({ 'genres.slug': { $in: genreArray } })
      .select('_id title poster status tmdb_id imdb_id synopsisID synopsisEN')
      .skip((page - 1) * limit)
      .limit(limit);
    const totalMovies = await MovieModel.countDocuments({ 'genres.slug': { $in: genreArray } });
    const totalPages = Math.ceil(totalMovies / limit);
    
    if (movies.length === 0) {
      res.status(404).json({
        success: false,
        results: [],
        message: 'No movies found for the specified genres',
      });
      return;
    }

    res.status(200).json({
      success: true,
      results: {
        movies,
        totalPages,
        currentPage: page,
      },
      message: 'Movies fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: error.message,
    });
  }
};

export const getMovieByPopularity = async (req, res) => {
  try {
    const { page = '1', limit = '10' } = req.query;

    // Ensure page and limit are valid numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate the numbers
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      res.status(400).json({
        success: false,
        message: 'Invalid page or limit parameter.',
      });
      return;
    }

    const movies = await MovieModel.find({})
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ popularity: -1 }) // Sort by popularity descending
      .select('_id title poster status tmdb_id imdb_id synopsisID synopsisEN');

    const totalMovies = await MovieModel.countDocuments({});
    const totalPages = Math.ceil(totalMovies / limitNumber);

    if (movies.length === 0) {
      res.status(404).json({
        success: false,
        results: [],
        message: 'No movies found for the specified popularity',
      });
      return;
    }

    res.status(200).json({
      success: true,
      results: {
        movies,
        totalPages,
        currentPage: pageNumber,
      },
      message: 'Movies fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: error.message,
    });
  }
};

export const getMovieByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      res.status(400).json({
        success: false,
        message: 'Invalid page or limit parameter.',
      });
      return;
    }

    const movies = await MovieModel.find({ release_date: { $regex: `^${year}` } })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .select('_id title poster status tmdb_id imdb_id synopsisID synopsisEN');

    const totalMovies = await MovieModel.countDocuments({ release_date: { $regex: `^${year}` } });
    const totalPages = Math.ceil(totalMovies / limitNumber);

    if (movies.length === 0) {
      res.status(404).json({
        success: false,
        results: [],
        message: 'No movies found for the specified year',
      });
      return;
    }

    res.status(200).json({
      success: true,
      results: {
        movies,
        totalPages,
        currentPage: pageNumber,
      },
      message: 'Movies fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: error.message,
    });
  }
};
