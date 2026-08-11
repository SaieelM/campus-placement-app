import React from 'react';
import { Search, Inbox, Layers } from 'lucide-react';
import ListingCard from './ListingCard';

const CATEGORIES = ['All', 'Engineering', 'Design', 'Marketing', 'Management', 'Placement', 'Other'];

export default function ListingGrid({
  listings,
  searchTerm,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onDelete,
  onViewDetails,
  isLoading
}) {
  return (
    <div className="listings-section">
      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, role, or company..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="category-pills">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
            <Layers size={14} /> Filter:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="empty-state">
          <div className="status-dot connecting" style={{ width: '16px', height: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Fetching listings from MySQL database...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Inbox size={32} />
          </div>
          <h3>No User Listings Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.9rem' }}>
            {searchTerm || activeCategory !== 'All'
              ? 'No user records match your search filter criteria. Try clearing search filters.'
              : 'The database currently has no records. Use the form on the left to add user data.'}
          </p>
        </div>
      ) : (
        <div className="grid-container">
          {listings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
