import { useEffect, useState } from 'react';

const KEY = '20564e00';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setError('');
        setIsLoading(true);

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error('Could not fetch movies');

        const data = await res.json();
        if (data.Response === 'False') throw new Error('No movie found');
        setMovies(data.Search);

        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          console.log(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    fetchMovies();

    return () => controller.abort();
  }, [query]);

  return { movies, isLoading, error };
}
