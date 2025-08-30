"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { searchProducts, getSearchSuggestions, type SearchResult } from "@/lib/search";
import { useRouter } from "next/navigation";

export default function SearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        const searchResults = searchProducts(query, 5);
        const searchSuggestions = getSearchSuggestions(query);
        setResults(searchResults);
        setSuggestions(searchSuggestions);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } else {
        setResults([]);
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const maxIndex = results.length + suggestions.length - 1;
      setSelectedIndex(prev => prev < maxIndex ? prev + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const maxIndex = results.length + suggestions.length - 1;
      setSelectedIndex(prev => prev > 0 ? prev - 1 : maxIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        if (selectedIndex < results.length) {
          router.push(`/products/${results[selectedIndex].id}`);
        } else {
          const suggestionIndex = selectedIndex - results.length;
          setQuery(suggestions[suggestionIndex]);
          router.push(`/products?search=${encodeURIComponent(suggestions[suggestionIndex])}`);
        }
        setShowDropdown(false);
      } else if (query.trim()) {
        router.push(`/products?search=${encodeURIComponent(query)}`);
        setShowDropdown(false);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }, [results, suggestions, selectedIndex, query, router]);

  const handleResultClick = useCallback((result: SearchResult) => {
    router.push(`/products/${result.id}`);
    setShowDropdown(false);
    setQuery("");
  }, [router]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    router.push(`/products?search=${encodeURIComponent(suggestion)}`);
    setShowDropdown(false);
  }, [router]);

  // Extract dropdown rendering
  const Dropdown = useCallback(() => {
    if (!showDropdown || (results.length === 0 && suggestions.length === 0)) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-black border border-black/10 dark:border-white/20 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
        {results.length > 0 && (
          <div className="p-2">
            <div className="text-xs font-medium text-foreground/70 mb-2">Products</div>
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`w-full text-left p-2 rounded hover:bg-black/5 dark:hover:bg-white/10 ${
                  selectedIndex === index ? "bg-black/5 dark:bg-white/10" : ""
                }`}
              >
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-foreground/70">{result.category}</div>
              </button>
            ))}
          </div>
        )}
        {suggestions.length > 0 && (
          <div className="p-2 border-t border-black/10 dark:border-white/20">
            <div className="text-xs font-medium text-foreground/70 mb-2">Suggestions</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left p-2 rounded hover:bg-black/5 dark:hover:bg-white/10 ${
                  selectedIndex === results.length + index ? "bg-black/5 dark:bg-white/10" : ""
                }`}
              >
                <div className="text-sm">{suggestion}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }, [showDropdown, results, suggestions, selectedIndex, handleResultClick, handleSuggestionClick]);

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent"
      />
      <Dropdown />
    </div>
  );
}
