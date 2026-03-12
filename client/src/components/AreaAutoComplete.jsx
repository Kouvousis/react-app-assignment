import { useState, useRef, useEffect } from "react";
import { useDebounce } from "use-debounce";

const cache = {};

function AreaAutocomplete({ onSelect, error, value = "" }) {
  const [searchValue, setSearchValue] = useState(value);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const justSelectedRef = useRef(false);
  const [searchDebounced] = useDebounce(searchValue, 300);

  // Reset Area field when submitting form successfully
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    if (searchDebounced.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (cache[searchDebounced]) {
      console.log(`Exists in cache: "${searchDebounced}"`);
      setResults(cache[searchDebounced]);
      setIsOpen(true);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch(
          `http://localhost:3000/api/autocomplete?input=${encodeURIComponent(searchDebounced)}`
        );

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        cache[searchDebounced] = data;
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        setApiError("No areas with this name found.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [searchDebounced]);

  const handleSelect = (place) => {
    justSelectedRef.current = true;
    setSearchValue(place.mainText);
    setIsOpen(false);
    setResults([]);
    onSelect(place);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1">
      <label htmlFor="area" className="text-sm font-medium text-gray-600">
        Area
      </label>

      <input
        id="area"
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Type in the property's area"
        autoComplete="off"
        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />

      {error && <span className="text-red-500 text-xs">{error}</span>}
      {apiError && <span className="text-red-500 text-xs">{apiError}</span>}
      {isLoading && <span className="text-gray-400 text-xs">Searching...</span>}

      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {results.map((place) => (
            <li
              key={place.placeId}
              onClick={() => handleSelect(place)}
              className="px-4 py-2 cursor-pointer hover:bg-yellow-50 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm font-medium text-gray-700">
                {place.mainText}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {place.secondaryText}
              </span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && !isLoading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 px-4 py-2">
          <span className="text-sm text-gray-400">No results found</span>
        </div>
      )}
    </div>
  );
}

export default AreaAutocomplete;