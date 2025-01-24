import React, { useEffect, useState } from "react";
import { generatePath, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import HomePage from "../Components/HomePage";
import {
  PiCalendarDotsBold,
  PiHeartStraightBold,
  PiHeartStraightFill,
  PiStarFill,
} from "react-icons/pi";

const apiKey = import.meta.env.VITE_API_KEY;

const MovieDetails = () => {
  const [genres, setGenres] = React.useState([]);

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [recMovies, setRecMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const toggleFavourites = (movieId) => {
    setFavourites((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  const handleGoBack = () => {
    navigate("/homepage");
  };

  useEffect(() => {
    const getMovieDetails = async () => {
      setIsLoading(true);
      try {
        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        const creditRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
        );
        setMovie(movieRes.data);
        setCast(creditRes.data.cast);
        // console.log(movieRes.data);
        // console.log(creditRes.data.cast);

        // const genreIds = movieRes.data.genres.map((genre) => genre.id);
        // const recommendedMovies = await axios.get(
        //   `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreIds}`
        // );
        const similarMoviesResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`
        );
        setRecMovies(similarMoviesResponse.data.results);
        console.log(similarMoviesResponse.data.results);
      } catch (error) {
        setError("Failed to get movie details");
      } finally {
        setIsLoading(false);
      }
    };
    getMovieDetails();
  }, [id]);

  useEffect(() => {
    const getGenres = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
        );
        setGenres(res.data.genres);
      } catch (error) {
        setError("Failed to fetch genres");
      } finally {
        setIsLoading(false);
      }
    };
    getGenres();
  }, []);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div className=" container ">
      <div className="  md:mt-32 mt-24 mb-10 ">
        {isLoading && <p>Loading...</p>}
        <div className="flex max-md:flex-wrap justify-center placeholder: mb-24 gap-10">
          <div className="w-96 md:w-80 shrink-0 relative">
            <img
              className="w-full rounded-lg"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />

            <div className="pl-2 flex justify-start items-center gap-2 text-3xl absolute top-2 left-2 bg-gradient-to-r from-slate-400  to-transparent w-2/3 rounded-l-md">
              {movie.production_countries.map((country) => (
                <div
                  key={country.iso_3166_1}
                  // style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>
                    {String.fromCodePoint(
                      ...[...country.iso_3166_1.toUpperCase()].map(
                        (char) => 127397 + char.charCodeAt()
                      )
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="max-md:mt-0 mt-5 max-md:text-base text-lg ">
            <h1 className="font-black max-md:text-lg  text-2xl mb-4">
              {movie.title}
            </h1>
            <p className="">
              <span className="text-orange-600 font-bold">Genre:</span>{" "}
              {movie.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p className=" max-md:w-full">
              <span className="text-orange-600 font-bold ">Synopsis:</span>{" "}
              {movie.overview}
            </p>
            <p className="">
              <span className="text-orange-600 font-bold">Release date:</span>{" "}
              {movie.release_date}
            </p>
            <p className="">
              <span className="text-orange-600 font-bold">Ratings:</span>{" "}
              {movie.vote_average.toFixed(1)}
            </p>
            <Link
              to={movie.homepage}
              target="blank"
              className="text-orange-600 underline text-base font-medium hover:text-white transition-all hover:no-underline duration-300 mt-12"
            >
              Click to visit the official website
            </Link>
          </div>
        </div>
        {cast.length > 0 ? (
          <div className="flex flex-col">
            <h2 className="mb-5 text-lg font-bold">Cast</h2>
            <div className="flex flex-nowrap overflow-x-auto gap-14 pb-4">
              {cast.slice(0, 10).map((castMember) => (
                <div className="w-24 shrink-0 " key={castMember.id}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${castMember.profile_path}`}
                    alt={castMember.name}
                    className="w-full  rounded-full contain"
                  />
                  <h4 className="text-sm font-bold mb-1">{castMember.name}</h4>
                  <p className="text-xs font-semibold">
                    {castMember.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No cast details found!</p>
        )}

        <div className=" flex justify-center items-center flex-col  mt-20">
          <div className="text-start">
            <h1 className="mb-5 text-lg font-bold z-10">Recommended Movies</h1>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : recMovies.length > 0 ? (
            <>
              <div className="grid lg:grid-cols-5  md:grid-cols-4 xl:grid-cols-7 grid-cols-3 md:gap-x-40 md:gap-y-20 gap-12 mb-20">
                {/* Map through the movies array and render each movie */}
                {recMovies.map((movie) => (
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
                        target="blank"
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
            </>
          ) : (
            <p>No movies to recommend</p>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center ">
        <Link to={"/homepage"}>
          <button
            onClick={handleGoBack}
            className="bg-orange-600 font-bold px-5 rounded-lg py-2 mb-20"
          >
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MovieDetails;
