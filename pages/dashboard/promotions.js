// pages/dashboard/promotions.js
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/authContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Icons = {
  upload: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  scan: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  image: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const PromotionsPage = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPromotions();
    }
  }, [isAuthenticated]);

  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/dashboard/promotions');
      if (res.ok) {
        const data = await res.json();
        setPromotions(data.promotions || []);
      }
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Data = reader.result;

        const res = await fetch('/api/dashboard/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            imageData: base64Data,
            mimeType: file.type,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setPromotions((prev) => [data.promotion, ...prev]);
        } else {
          const error = await res.json();
          alert(error.message || 'Failed to save promotion');
        }
      };
    } catch (error) {
      console.error('Failed to upload promotion:', error);
      alert('Failed to upload promotion');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const res = await fetch(`/api/dashboard/promotions?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPromotions((prev) => prev.filter((p) => p.id !== id));
        if (selectedPromotion?.id === id) {
          setSelectedPromotion(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete promotion:', error);
    }
  };

  const handleScanPromotion = (promotion) => {
    // Navigate to main page with the promotion loaded for scanning
    router.push({
      pathname: '/',
      query: { scanPromotion: promotion.id },
    });
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout title="Saved Promotions">
      {/* Upload Section */}
      <div className="promotions-upload-section">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button
          className="upload-promotion-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Icons.upload />
          <span>{uploading ? 'Uploading...' : 'Upload Promotion'}</span>
        </button>
        <p className="upload-hint">Save promotions to your library for future reference and scanning</p>
      </div>

      {/* Promotions Grid */}
      {loading ? (
        <div className="dashboard-loading-inline">
          <div className="dashboard-loading-spinner"></div>
        </div>
      ) : promotions.length > 0 ? (
        <div className="promotions-grid">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className={`promotion-card ${selectedPromotion?.id === promotion.id ? 'selected' : ''}`}
              onClick={() => setSelectedPromotion(promotion)}
            >
              <div className="promotion-image-container">
                {promotion.imageData ? (
                  <img
                    src={promotion.imageData}
                    alt={promotion.name || 'Promotion'}
                    className="promotion-image"
                  />
                ) : (
                  <div className="promotion-placeholder">
                    <Icons.image />
                  </div>
                )}
              </div>
              <div className="promotion-info">
                <span className="promotion-name">{promotion.name || 'Untitled'}</span>
                <span className="promotion-date">{formatDate(promotion.createdAt)}</span>
              </div>
              <div className="promotion-actions">
                <button
                  className="promotion-action-btn scan"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScanPromotion(promotion);
                  }}
                  title="Scan for Compliance"
                >
                  <Icons.scan />
                </button>
                <button
                  className="promotion-action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(promotion.id);
                  }}
                  title="Delete"
                >
                  <Icons.trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dashboard-empty">
          <div className="empty-icon">
            <Icons.image />
          </div>
          <p>No saved promotions yet.</p>
          <p className="empty-hint">Upload your financial promotions to keep them organized and ready for compliance scanning.</p>
          <button
            className="dashboard-cta-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Your First Promotion
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {selectedPromotion && (
        <div className="promotion-modal-overlay" onClick={() => setSelectedPromotion(null)}>
          <div className="promotion-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPromotion(null)}>
              &times;
            </button>
            <div className="modal-image-container">
              <img
                src={selectedPromotion.imageData}
                alt={selectedPromotion.name || 'Promotion'}
              />
            </div>
            <div className="modal-info">
              <h3>{selectedPromotion.name || 'Untitled Promotion'}</h3>
              <p>Saved on {formatDate(selectedPromotion.createdAt)}</p>
              {selectedPromotion.notes && (
                <p className="modal-notes">{selectedPromotion.notes}</p>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn primary"
                onClick={() => handleScanPromotion(selectedPromotion)}
              >
                <Icons.scan /> Scan for Compliance
              </button>
              <button
                className="modal-btn danger"
                onClick={() => handleDelete(selectedPromotion.id)}
              >
                <Icons.trash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PromotionsPage;
