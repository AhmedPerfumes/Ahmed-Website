import React, { useState, useEffect } from "react";
import "./FeedbackForm.css"; // CSS for styling

const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });

  useEffect(() => {
    // Automatically open the popup when the component mounts
    setIsOpen(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", formData);
    // Show the alert thanking the user for their feedback
    alert("Thanks for your valuable feedback!");
    // Optionally, send data to a backend here
    setFormData({ name: "", email: "", feedback: "" }); // Reset form
    setIsOpen(false); // Close the popup
  };

  return (
    <div className="feedback-form-container">
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content popup-animate">
            <h2>Feedback Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="feedback">Feedback:</label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
            <button className="close-popup-btn" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
