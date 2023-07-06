import { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating';
import { useKey } from '../hooks/useKey';
import { KEY } from './App';
import { Loader, ErrorMessage } from './SmallComponents';

export function MovieDetails({
  selectedId,
  watched,
  onCloseMovie,
  onAddWatched,
}) {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const isWatched = watched.some((movie) => movie.imdbID === selectedId);
  const watchedUserRating = watched.find(
    (m) => m.imdbID === selectedId
  )?.userRating;

  const countRatingDecisions = useRef(0);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: Number(runtime.split(' ').at(0)),
      imdbRating: Number(imdbRating),
      userRating,
      countRatingDecisions: countRatingDecisions.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      if (userRating) countRatingDecisions.current++;
    },
    [userRating]
  );

  useKey('Escape', onCloseMovie);

  useEffect(
    function () {
      async function fetchMovieDetails() {
        try {
          setError('');
          setIsLoading(true);

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );

          const data = await res.json();
          setIsLoading(false);
          setMovie(data);
        } catch (err) {
          setError(err.message);
          console.error(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return () => (document.title = 'usePopcorn');
    },
    [title]
  );

  return (
    <div className='details'>
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <>
          <div className='details'>
            <header>
              <button className='btn-back' onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ` + { title }} />
              <div className='details-overview'>
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>

            <section>
              <div className='rating'>
                {!isWatched ? (
                  <>
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />

                    {userRating > 0 && (
                      <button className='btn-add' onClick={handleAdd}>
                        Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p style={{ display: 'flex', justifyContent: 'center' }}>
                    You have rated this movie {watchedUserRating} out of 10
                  </p>
                )}
              </div>

              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
