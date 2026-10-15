import React from 'react';
import { X, User, Mail, Briefcase, Tag, Building, Phone, MapPin, Calendar, Database } from 'lucide-react';

export default function ListingModal({ listing, onClose }) {
  if (!listing) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="avatar-circle" style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}>
            {listing.name ? listing.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>{listing.name}</h2>
            <p style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{listing.role}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <span className="card-badge">{listing.category || 'General'}</span>
              <span className="card-badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-subtle)', borderColor: 'var(--border-color)' }}>
                <Database size={10} style={{ marginRight: '4px' }} /> ID #{listing.id}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div className="info-item">
            <Mail size={16} className="info-icon" />
            <span><strong>Email:</strong> {listing.email}</span>
          </div>

          {listing.organization && (
            <div className="info-item">
              <Building size={16} className="info-icon" />
              <span><strong>Department / Company:</strong> {listing.organization}</span>
            </div>
          )}

          {listing.phone && (
            <div className="info-item">
              <Phone size={16} className="info-icon" />
              <span><strong>Phone:</strong> {listing.phone}</span>
            </div>
          )}

          {listing.location && (
            <div className="info-item">
              <MapPin size={16} className="info-icon" />
              <span><strong>Location:</strong> {listing.location}</span>
            </div>
          )}

          <div className="info-item">
            <Calendar size={16} className="info-icon" />
            <span><strong>Stored In MySQL:</strong> {formatDate(listing.created_at)}</span>
          </div>
        </div>

        {listing.description && (
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Description / Bio</h4>
            <p style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {listing.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
