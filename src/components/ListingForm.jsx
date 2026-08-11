import React, { useState } from 'react';
import { UserPlus, User, Mail, Briefcase, Tag, Building, Phone, MapPin, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Management', 'Placement', 'Other'];

export default function ListingForm({ onSubmit, isSubmitting, dbConnected }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    category: 'Engineering',
    organization: '',
    phone: '',
    location: '',
    description: '',
  });

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      setFormError('Please fill in all required fields (Name, Email, and Role).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    try {
      const res = await onSubmit(formData);
      if (res && res.success) {
        setSuccessMessage('User listing stored in MySQL database!');
        setFormData({
          name: '',
          email: '',
          role: '',
          category: 'Engineering',
          organization: '',
          phone: '',
          location: '',
          description: '',
        });
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setFormError(res?.error || res?.message || 'Failed to submit user data.');
      }
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <UserPlus style={{ color: 'var(--accent-primary)' }} size={22} />
        <h2>Add User Data</h2>
      </div>

      {formError && (
        <div className="notice-box" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="notice-box" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#6ee7b7', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label><User size={14} /> Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Jane Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label><Mail size={14} /> Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input
            type="email"
            name="email"
            placeholder="jane.doe@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><Briefcase size={14} /> Role / Title <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text"
              name="role"
              placeholder="e.g. Software Engineer"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><Tag size={14} /> Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label><Building size={14} /> Department / Company</label>
          <input
            type="text"
            name="organization"
            placeholder="e.g. TechCorp / Computer Science"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><Phone size={14} /> Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><MapPin size={14} /> Location</label>
            <input
              type="text"
              name="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label><FileText size={14} /> Description / Notes</label>
          <textarea
            name="description"
            placeholder="Brief bio or details about skills, interests, or background..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting || !dbConnected}
        >
          <UserPlus size={18} />
          {isSubmitting ? 'Saving to Database...' : 'Save & Store Record'}
        </button>
      </form>
    </div>
  );
}
