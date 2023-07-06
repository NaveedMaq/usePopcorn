import { useRef } from 'react';
import { useKey } from '../hooks/useKey';

export function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey('Enter', function () {
    if (document.activeElement !== inputEl.current) {
      setQuery('');
    }
    inputEl.current.focus();
  });

  return (
    <input
      ref={inputEl}
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
