import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const FeedbackForm = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subject: subjectId,
    term: 'I',
    year: new Date().getFullYear(),
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    ratings: {
      teachingQuality: 0,
      courseContent: 0,
      communication: 0,
      punctuality: 0,
      overallSatisfaction: 0
    },
    comments: '',
    isAnonymous: true
  });

  useEffect(() => {
    fetchSubject();
  }, [subjectId]);

  const fetchSubject = async () => {
    try {
      const response = await axios.get(`/api/subjects`);
      const subjectData = response.data.find(s => s._id === subjectId);
      setSubject(subjectData);
    } catch (error) {
      toast.error('Failed to fetch subject details');
      navigate('/student');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (category, rating) => {
    setFormData({
      ...formData,
      ratings: {
        ...formData.ratings,
        [category]: rating
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all ratings are provided
    const ratings = Object.values(formData.ratings);
    if (ratings.some(rating => rating === 0)) {
      toast.error('Please provide ratings for all categories');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/feedback', formData);
      toast.success('Feedback submitted successfully!');
      navigate('/student');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = (category, currentRating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${star <= currentRating ? 'active' : ''}`}
            onClick={() => handleRatingChange(category, star)}
          />
        ))}
        <span className="rating-text">
          {currentRating > 0 ? `${currentRating}/5` : 'Not rated'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading subject details...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="error-container">
        <p>Subject not found</p>
        <button onClick={() => navigate('/student')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-form-container">
      <div className="form-header">
        <button onClick={() => navigate('/student')} className="back-btn">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Submit Feedback</h1>
      </div>

      <div className="subject-info-card">
        <h2>{subject.name}</h2>
        <div className="subject-details">
          <p><strong>Code:</strong> {subject.code}</p>
          <p><strong>Faculty:</strong> {subject.faculty}</p>
          <p><strong>Program:</strong> {subject.program}</p>
          <p><strong>Year:</strong> {subject.year}</p>
          <p><strong>Term:</strong> {subject.term}</p>
          <p><strong>Credits:</strong> {subject.credits}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="rating-sections">
          <div className="rating-section">
            <h3>Teaching Quality</h3>
            <p>Rate the faculty's teaching methodology and clarity</p>
            {renderStarRating('teachingQuality', formData.ratings.teachingQuality)}
          </div>

          <div className="rating-section">
            <h3>Course Content</h3>
            <p>Rate the relevance and quality of course material</p>
            {renderStarRating('courseContent', formData.ratings.courseContent)}
          </div>

          <div className="rating-section">
            <h3>Communication</h3>
            <p>Rate the faculty's communication skills and interaction</p>
            {renderStarRating('communication', formData.ratings.communication)}
          </div>

          <div className="rating-section">
            <h3>Punctuality</h3>
            <p>Rate the faculty's punctuality and time management</p>
            {renderStarRating('punctuality', formData.ratings.punctuality)}
          </div>

          <div className="rating-section">
            <h3>Overall Satisfaction</h3>
            <p>Rate your overall satisfaction with this subject</p>
            {renderStarRating('overallSatisfaction', formData.ratings.overallSatisfaction)}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comments">Additional Comments (Optional)</label>
          <textarea
            id="comments"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            placeholder="Share your thoughts, suggestions, or any specific feedback..."
            maxLength={500}
            rows={4}
          />
          <small>{formData.comments.length}/500 characters</small>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
            />
            Submit feedback anonymously
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/student')} 
            className="btn-cancel"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;