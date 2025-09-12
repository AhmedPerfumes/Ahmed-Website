import React, { useState } from "react";
import { X } from "lucide-react";

export default function FAQForm({ faq, onSave, onCancel }) {
  const [formData, setFormData] = useState(faq || {
    question_en: "",
    question_ar: "",
    answer_en: "",
    answer_ar: "",
    category: "",
    keywords: [],
    priority: 1,
    is_active: true
  });

  const [newKeyword, setNewKeyword] = useState("");

  const categories = ["shipping", "returns", "products", "orders", "account", "payments"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleCategoryChange = (e) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  const handlePriorityChange = (e) => {
    setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }));
  };

  return (
    <div 
      className="mb-3" 
      style={{
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        border: '0',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '0.5rem'
      }}
    >
      <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
        <h2 
          style={{ 
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#44403c'
          }}
        >
          {faq ? "Edit FAQ" : "Add New FAQ"}
        </h2>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="d-flex flex-column" style={{ gap: '0.5rem' }}>
                <label htmlFor="question_en" style={{ fontWeight: '500' }}>Question (English)</label>
                <textarea
                  id="question_en"
                  value={formData.question_en}
                  onChange={handleInputChange}
                  placeholder="Enter question in English"
                  required
                  rows={2}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    resize: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column" style={{ gap: '0.5rem' }}>
                <label htmlFor="question_ar" style={{ fontWeight: '500' }}>Question (Arabic)</label>
                <textarea
                  id="question_ar"
                  value={formData.question_ar || ""}
                  onChange={handleInputChange}
                  placeholder="Enter question in Arabic"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    textAlign: 'right',
                    direction: 'rtl',
                    resize: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="d-flex flex-column" style={{ gap: '0.5rem' }}>
                <label htmlFor="answer_en" style={{ fontWeight: '500' }}>Answer (English)</label>
                <textarea
                  id="answer_en"
                  value={formData.answer_en}
                  onChange={handleInputChange}
                  placeholder="Enter answer in English"
                  rows={4}
                  required
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    resize: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column" style={{ gap: '0.5rem' }}>
                <label htmlFor="answer_ar" style={{ fontWeight: '500' }}>Answer (Arabic)</label>
                <textarea
                  id="answer_ar"
                  value={formData.answer_ar || ""}
                  onChange={handleInputChange}
                  placeholder="Enter answer in Arabic"
                  rows={4}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    textAlign: 'right',
                    direction: 'rtl',
                    resize: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="d-flex flex-column" style={{ gap: '0.5rem' }}>
                <label htmlFor="category" style={{ fontWeight: '500' }}>Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="form-select"
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-flex flex-column" style={{ gap: '0.5rem' }}>
                <label htmlFor="priority" style={{ fontWeight: '500' }}>Priority</label>
                <input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={handlePriorityChange}
                  className="form-control"
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex flex-column" style={{ gap: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>Keywords</label>
              <div className="d-flex" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="form-control"
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                />
                <button 
                  type="button" 
                  onClick={addKeyword} 
                  className="btn btn-outline-secondary"
                >
                  Add
                </button>
              </div>
              <div className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
                {formData.keywords.map((keyword) => (
                  <div
                    key={keyword}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor: 'rgba(192, 160, 98, 0.2)',
                      color: '#a18650',
                      border: '1px solid rgba(192, 160, 98, 0.3)',
                      fontSize: '0.75rem'
                    }}
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      style={{
                        marginLeft: '0.25rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'inherit',
                      }}
                    >
                      <X style={{ width: '0.75rem', height: '0.75rem' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end" style={{ gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                backgroundColor: '#c0a062',
                borderColor: '#c0a062',
              }}
            >
              Save FAQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}