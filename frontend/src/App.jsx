import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ListingForm from './components/ListingForm';
import ListingGrid from './components/ListingGrid';
import ListingModal from './components/ListingModal';
import DbNotice from './components/DbNotice';

export default function App() {
  const [listings, setListings] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedListing, setSelectedListing] = useState(null);

  // Check health and DB status
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data && data.db) {
        setDbStatus(data.db);
      }
    } catch (err) {
      setDbStatus({
        connected: false,
        error: 'Backend API server unreachable',
      });
    }
  }, []);

  // Fetch listings from Express backend / MySQL
  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (activeCategory !== 'All') params.append('category', activeCategory);

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setListings(data.data);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error('Error fetching user listings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, activeCategory]);

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchListings();
  }, [checkHealth, fetchListings]);

  // Handle Form Submission
  const handleCreateListing = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        await fetchListings(); // Refresh listings list
        await checkHealth();
        return { success: true };
      } else {
        return { success: false, error: data.message || data.error || 'Failed to save record' };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Server network error' };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Deleting Listing
  const handleDeleteListing = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from MySQL database?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setListings((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || 'Failed to delete listing');
      }
    } catch (err) {
      alert('Error deleting record: ' + err.message);
    }
  };

  return (
    <div className="app-container">
      <Header
        dbStatus={dbStatus}
        totalCount={listings.length}
        onRefresh={() => {
          checkHealth();
          fetchListings();
        }}
        isLoading={isLoading}
      />

      <DbNotice
        dbStatus={dbStatus}
        onRetry={() => {
          checkHealth();
          fetchListings();
        }}
      />

      <main className="main-content">
        <ListingForm
          onSubmit={handleCreateListing}
          isSubmitting={isSubmitting}
          dbConnected={dbStatus?.connected ?? false}
        />

        <ListingGrid
          listings={listings}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onDelete={handleDeleteListing}
          onViewDetails={(item) => setSelectedListing(item)}
          isLoading={isLoading}
        />
      </main>

      <ListingModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </div>
  );
}
