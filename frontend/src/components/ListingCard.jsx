import React from 'react';
import { Mail, Building, MapPin, Phone, Trash2, Calendar, Eye } from 'lucide-react';

export default function ListingCard({ listing, onDelete, onViewDetails }) {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="listing-card">
      <div>
        <div className="card-header">
          <div className="avatar-circle">
            {getInitials(listing.name)}
          </div>
          <div className="user-meta">
            <h3 className="user-name" title={listing.name}>{listing.name}</h3>
            <p className="user-role" title={listing.role}>{listing.role}</p>
            <span className="card-badge">{listing.category || 'General'}</span>
          </div>
        </div>

        <div className="card-body" style={{ marginTop: '14px' }}>
          <div className="info-item">
            <Mail size={14} className="info-icon" />
            <span style={{ color: 'var(--text-muted)' }}>{listing.email}</span>
          </div>

          {listing.organization && (
            <div className="info-item">
              <Building size={14} className="info-icon" />
              <span>{listing.organization}</span>
            </div>
          )}

          {listing.location && (
            <div className="info-item">
              <MapPin size={14} className="info-icon" />
              <span>{listing.location}</span>
            </div>
          )}

          {listing.description && (
            <p className="card-desc" title={listing.description}>
              {listing.description}
            </p>
          )}
        </div>
      </div>

      <div className="card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={12} />
          <span>{formatDate(listing.created_at)}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onViewDetails(listing)}
            className="btn-delete"
            title="View Details"
            style={{ color: 'var(--accent-primary)' }}
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onDelete(listing.id, listing.name)}
            className="btn-delete"
            title="Delete from MySQL"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
