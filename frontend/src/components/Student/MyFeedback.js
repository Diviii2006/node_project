import { useState, useEffect } from 'react';
import { FaStar, FaCalendarAlt, FaBook } from 'react-icons/fa';
import axios from 'axios';

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const fetchMyFeedback = async () => {
    try {
      const response = await axios.get('/api/feedback/my-feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        color={index < rating ? '#F59E0B' : '#E5E7EB'}
        size={16}
      />
    ));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your feedback...</p>
      </div>
    );
  }

  return (
    <div className="my-feedback">
      <div className="page-header">
        <h1>My Feedback History</h1>
        <p>View all your submitted feedback</p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="empty-state">
          <FaBook size={48} color="#64748b" />
          <h3>No Feedback Submitted Yet</h3>
          <p>You haven't submitted any feedback yet. Go to your dashboard to submit feedback for your subjects.</p>
        </div>
      ) : (
        <div className="feedback-grid">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="feedback-card">
              <div className="feedback-header">
                <h3>{feedback.subject.name}</h3>
                <div className="feedback-date">
                  <FaCalendarAlt />
                  <span>{new Date(feedback.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="subject-details">
                <p><strong>Code:</strong> {feedback.subject.code}</p>
                <p><strong>Faculty:</strong> {feedback.subject.faculty}</p>
                <p><strong>Term:</strong> {feedback.term} - {feedback.academicYear}</p>
              </div>

              <div className="ratings-summary">
                <h4>Your Ratings</h4>
                
                <div className="rating-item">
                  <span>Teaching Quality:</span>
                  <div className="rating-display">
                    {renderStars(feedback.ratings.teachingQuality)}
                    <span className="rating-value">{feedback.ratings.teachingQuality}/5</span>
                  </div>
                </div>

                <div className="rating-item">
                  <span>Course Content:</span>
                  <div className="rating-display">
                    {renderStars(feedback.ratings.courseContent)}
                    <span className="rating-value">{feedback.ratings.courseContent}/5</span>
                  </div>
                </div>

                <div className="rating-item">
                  <span>Communication:</span>
                  <div className="rating-display">
                    {renderStars(feedback.ratings.communication)}
                    <span className="rating-value">{feedback.ratings.communication}/5</span>
                  </div>
                </div>

                <div className="rating-item">
                  <span>Punctuality:</span>
                  <div className="rating-display">
                    {renderStars(feedback.ratings.punctuality)}
                    <span className="rating-value">{feedback.ratings.punctuality}/5</span>
                  </div>
                </div>

                <div className="rating-item overall">
                  <span>Overall Satisfaction:</span>
                  <div className="rating-display">
                    {renderStars(feedback.ratings.overallSatisfaction)}
                    <span className="rating-value">{feedback.ratings.overallSatisfaction}/5</span>
                  </div>
                </div>
              </div>

              {feedback.comments && (
                <div className="comments-section">
                  <h4>Your Comments</h4>
                  <p className="comment-text">{feedback.comments}</p>
                </div>
              )}

              <div className="feedback-footer">
                <span className={`anonymity-badge ${feedback.isAnonymous ? 'anonymous' : 'identified'}`}>
                  {feedback.isAnonymous ? 'Anonymous' : 'Identified'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFeedback;