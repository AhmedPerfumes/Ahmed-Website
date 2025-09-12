import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function FAQList({ faqs, loading, onEdit, onDelete }) {
  const brandPrimary = '#c0a062';
  const brandPrimaryDark = '#a18650';
  const brandTextDark = '#44403c';
  const brandTextLight = '#78716c';

  const skeletonCardStyle = {
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    border: '0',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
  };

  const skeletonLineStyle = {
    backgroundColor: '#e5e7eb', // bg-gray-200
    borderRadius: '9999px',
    height: '1.5rem', // h-6
    marginBottom: '0.75rem', // mb-3
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  if (loading) {
    return (
      <div className="d-flex flex-column" style={{ gap: '1rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={skeletonCardStyle}>
            <div>
              <div style={{ ...skeletonLineStyle, width: '75%' }}></div>
              <div style={{ ...skeletonLineStyle, height: '1rem', width: '100%', marginBottom: '0.5rem' }}></div>
              <div style={{ ...skeletonLineStyle, height: '1rem', width: '66.6%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cardStyle = {
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    border: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.3s ease',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  };

  const cardHoverStyle = {
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', // hover:shadow-xl
  };

  const badgeStyle = {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    display: 'inline-block',
  };

  const primaryBadgeStyle = {
    backgroundColor: 'rgba(192, 160, 98, 0.2)',
    color: '#a18650',
    border: '1px solid rgba(192, 160, 98, 0.3)',
  };

  const outlineBadgeStyle = {
    backgroundColor: 'transparent',
    color: '#44403c',
    border: '1px solid rgba(192, 160, 98, 0.2)',
  };

  const inactiveBadgeStyle = {
    backgroundColor: '#e2e8f0',
    color: '#44403c',
    border: '1px solid #cbd5e1',
  };

  const buttonStyle = {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    border: '1px solid',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };
  
  const editButtonStyle = {
    borderColor: 'rgba(192, 160, 98, 0.3)',
    color: '#a18650',
  };
  
  const editButtonHoverStyle = {
    backgroundColor: 'rgba(192, 160, 98, 0.1)',
  };
  
  const deleteButtonStyle = {
    borderColor: '#fca5a5', // border-red-200
    color: '#b91c1c', // text-red-700
  };
  
  const deleteButtonHoverStyle = {
    backgroundColor: '#fef2f2', // hover:bg-red-50
  };

  return (
    <div className="d-flex flex-column" style={{ gap: '1rem' }}>
      {faqs.map((faq) => (
        <div 
          key={faq.id} 
          style={cardStyle}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = cardStyle.boxShadow}
        >
          <div style={{ padding: '1.5rem' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ ...badgeStyle, ...primaryBadgeStyle }}>
                    {faq.category}
                  </span>
                  <span style={{ ...badgeStyle, ...outlineBadgeStyle, fontSize: '0.75rem' }}>
                    Priority: {faq.priority}
                  </span>
                  {!faq.is_active && (
                    <span style={{ ...badgeStyle, ...inactiveBadgeStyle }}>Inactive</span>
                  )}
                </div>
                
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: brandTextDark, marginBottom: '0.5rem' }}>
                  {faq.question_en}
                </h3>
                
                {faq.question_ar && (
                  <h4 style={{ fontSize: '1rem', color: brandTextLight, marginBottom: '0.75rem', textAlign: 'right' }} dir="rtl">
                    {faq.question_ar}
                  </h4>
                )}
                
                <p style={{ color: brandTextLight, marginBottom: '0.5rem' }}>{faq.answer_en}</p>
                
                {faq.answer_ar && (
                  <p style={{ color: brandTextLight, marginBottom: '0.75rem', textAlign: 'right' }} dir="rtl">
                    {faq.answer_ar}
                  </p>
                )}
                
                {faq.keywords && faq.keywords.length > 0 && (
                  <div className="d-flex flex-wrap" style={{ gap: '0.25rem', marginTop: '0.75rem' }}>
                    {faq.keywords.map((keyword) => (
                      <span 
                        key={keyword} 
                        style={{ ...badgeStyle, ...outlineBadgeStyle, fontSize: '0.75rem', backgroundColor: '#f8fafc' }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="d-flex ms-auto" style={{ gap: '0.5rem', marginLeft: '1rem' }}>
                <button
                  onClick={() => onEdit(faq)}
                  style={{ ...buttonStyle, ...editButtonStyle }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = editButtonHoverStyle.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Edit style={{ width: '1rem', height: '1rem' }} />
                </button>
                <button
                  onClick={() => onDelete(faq.id)}
                  style={{ ...buttonStyle, ...deleteButtonStyle }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = deleteButtonHoverStyle.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Trash2 style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {faqs.length === 0 && !loading && (
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ padding: '3rem' }}>
            <p style={{ color: '#64748b', fontSize: '1.125rem' }}>No FAQs found. Add your first FAQ to get started!</p>
          </div>
        </div>
      )}
    </div>
  );
}