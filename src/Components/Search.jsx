import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  PiCalendarDotsBold,
  PiStarFill,
  PiHeartStraightBold,
  PiHeartStraightFill,
} from "react-icons/pi";

const apiKey = import.meta.env.VITE_API_KEY;

// Debouncing hook to delay API call after user stops typing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const [movies, setMovies] = useState([]);
  //   const [genres, setGenres] = useState([])
  const [favourites, setFavourites] = useState({});
  useEffect(() => {
    const getMovies = async () => {
      setIsLoading(true);
      try {
        const res =
          await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}?&append_to_response=videos&api_key=${apiKey}
`);
        // const sortedMovies = res.data.results.sort(
        //   (a, b) => b.release_date - a.release_date
        // );
        setMovies(res.data.results);
      } catch (error) {
        setError("Failed to get movies");
      } finally {
        setIsLoading(false);
      }
    };
    getMovies();
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      const searchMovies = async () => {
        setIsLoading(true);
        setHasSearched(true);
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${debouncedQuery}`
          );
          setSearchResults(response.data.results);
          console.log(response.data.results);
        } catch (error) {
          setError("failed to fetch the movie");
        } finally {
          setIsLoading(false);
        }
      };
      searchMovies();
    } else {
      // If query is empty, clear the results
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  // Find genre names based on genre IDs
  //   const getGenreNames = (genreIds) => {
  //     return genreIds.map((id) => {
  //       const genre = genres.find((g) => g.id === id);
  //       return genre ? genre.name : "Unknown Genre";
  //     });
  //   };

  function handleChange(e) {
    setQuery(e.target.value);
  }

  const toggleFavourites = (movieId) => {
    setFavourites((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };
  //   console.log(Data); // testing the value in the console.log()

  return (
    <div className=" flex flex-col justify-center items-center">
      <div className="flex items-center justify-center mt-40 mb-10 w-full">
        <input
          autoComplete="on"
          autoFocus={true}
          className="w-2/4 max-md:w-3/4 bg-transparent text-white border-2 rounded-3xl outline-none px-7 py-2 "
          type="search"
          name="query"
          value={query}
          onChange={handleChange}
          id="search"
          placeholder="Search..."
        />
      </div>
      {!hasSearched ? (
        ""
      ) : (
        <div className="flex justify-center items-center flex-col">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : hasSearched &&
            searchResults.length === 0 &&
            query.trim().length > 0 ? (
            <h3>No results found.</h3>
          ) : (
            searchResults.length > 0 && (
              <div className="mt-20 flex flex-col items-center justify-center">
                <h3 className="font-bold text-lg mb-4">
                  Here's your search result for{" "}
                  <span className="text-orange-600">{query}</span>
                </h3>
                <div className="grid lg:grid-cols-5  md:grid-cols-4 xl:grid-cols-7 grid-cols-3 md:gap-x-40 md:gap-y-20 gap-12">
                  {/* Map through the movies array and render each movie */}
                  {searchResults.map((movie) => (
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
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
