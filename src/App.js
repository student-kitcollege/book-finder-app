import React, { useState } from 'react';
import { Search, BookOpen, Filter, Loader2 } from 'lucide-react';
import './style.css';

export default function BookFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setBooks([]);
    try {
      const searchParam = searchType === 'title' ? 'title' : searchType === 'author' ? 'author' : 'q';
      const url = `https://openlibrary.org/search.json?${searchParam}=${encodeURIComponent(searchQuery)}&limit=30`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs);
      } else {
        setError('No books found. Try a different search term.');
      }
    } catch {
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCover = (book) => {
    return book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : 'https://via.placeholder.com/150x220?text=No+Cover';
  };

  return (
    <div className="container">
      <h1 className="title">
        <BookOpen size={38} color="#2563eb" /> Book Finder
      </h1>
      <p className="subtitle">Discover your next great read!</p>

      <div className="search-box">
        <input
          type="text"
          placeholder={`Search by ${searchType}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchBooks()}
        />

        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="general">General</option>
        </select>

        <button onClick={searchBooks} className="btn-search">
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Searching...
            </>
          ) : (
            <>
              <Search size={18} /> Search
            </>
          )}
        </button>

        <button className="btn-filter">
          <Filter size={18} /> Filters
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && books.length === 0 && !error && (
        <div className="start-section">
          <BookOpen size={90} color="#d1d5db" />
          <h3>Start Your Search</h3>
          <p>
            Search by title, author, or use general search to find your next favorite book!
          </p>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {books.length > 0 && (
        <div className="results">
          {books.map((book, index) => (
            <div key={index} className="book-card">
              <img src={getCover(book)} alt={book.title} />
              <div className="book-info">
                <div className="book-title">{book.title}</div>
                <div className="book-author">
                  {book.author_name ? book.author_name[0] : 'Unknown Author'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
