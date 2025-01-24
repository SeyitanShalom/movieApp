import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  PiCalendarDotsBold,
  PiStarFill,
  PiHeartStraightBold,
  PiHeartStraightFill,
} from "react-icons/pi";
import useLocalStorage from "../Hooks/useLocalStorage";

const apiKey = import.meta.env.VITE_API_KEY;

const TrendingMovies = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [favourites, setFavourites] = useState({});

  const toggleFavourites = (movieId) => {
    setFavourites((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  // const [favourites, setFavourites] = useLocalStorage("Favourtes", "");

  useEffect(() => {
    const getTrendingMovies = async () => {
      try {
        const res = await axios.get(
          //   `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );
        const sortedMovies = res.data.results.sort(
          (a, b) => b.vote_average - a.vote_average
        );
        const movies = sortedMovies;
        setTrendingMovies(movies);
        console.log(res.data.results);
      } catch (error) {
        setError("Failed to fetch movies data");
      } finally {
        setIsLoading(false);
      }
    };
    getTrendingMovies();
  }, []);
  return (
    <div className=" flex justify-center items-center flex-col  mb-20 ">
      <div className=" flex flex-col justify-center items-center">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : trendingMovies.length > 0 ? (
          <div className="my-20 flex flex-col items-center justify-center">
            <h1 className="text-orange-600 text-2xl font-bold mb-5 z-10">
              Trending Movies
            </h1>
            <div className="grid lg:grid-cols-5  md:grid-cols-4 xl:grid-cols-7 grid-cols-3 md:gap-x-40 md:gap-y-20 gap-12 mb-20">
              {/* Map through the movies array and render each movie */}
              {trendingMovies.map((movie) => (
                <div className="place-self-center">
                  <div
                    className="w-40 h-[300px] max-sm:w-32 max-sm:h-[250px]  rounded-3xl cursor-pointer  p-2 transition-all duration-500 hover:scale-110 hover:shadow-2xl  relative flex items-start justify-center"
                    key={movie.id}
                  >
                    <span
                      onClick={() => toggleFavourites(movie.id)}
                      className="absolute left-4 top-4 z-10 text-3xl text-orange-500 "
                    >
                      {favourites[movie.id] ? (
                        <PiHeartStraightFill />
                      ) : (
                        <PiHeartStraightBold />
                      )}
                    </span>
                    <Link
                      to={`/movie/${movie.id}`}
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      {" "}
                      <div className="relative">
                        <img
                          className="overflow-hidden rounded-md mb-2 "
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                        />
                      </div>
                      <p className="text-sm mb-2 font-bold max-sm:text-xs">
                        {movie.title}
                      </p>
                      <div className="text-xs text-slate-300 mb-1 flex items-center gap-1">
                        <p>
                          <PiCalendarDotsBold />
                        </p>
                        <p>{movie.release_date}</p>
                      </div>
                      <div className="text-xs font-bold text-orange-600 flex items-center gap-1">
                        <p>
                          <PiStarFill />
                        </p>
                        <p>{movie.vote_average.toFixed(1)}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No trending movies found</p>
        )}
      </div>
    </div>
  );
};

export default TrendingMovies;
