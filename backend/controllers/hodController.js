import Subject from '../models/Subject.js';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

export const getFeedbackSummaryForHOD = async (req, res) => {
  try {
    const hod = req.user;
    const { term, section, group } = req.query;

    if (hod.role !== 'hod') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!term) {
      return res.status(400).json({ message: 'Term is required' });
    }

    const subjectFilter = {
      program: hod.program,
      year: hod.year,
      term: parseInt(term),
    };

    if (hod.program === 'B.Tech') {
      if (!group) return res.status(400).json({ message: 'Group is required for B.Tech' });
      subjectFilter.group = group;
    } else if (hod.program === 'MCA') {
      if (!section) return res.status(400).json({ message: 'Section is required for MCA' });
      subjectFilter.section = section;
    }

    const subjects = await Subject.find(subjectFilter);
    if (!subjects.length) {
      return res.json({ summary: [], message: 'No subjects found' });
    }

    const summary = [];

    for (const subject of subjects) {
      const feedbacks = await Feedback.find({ subjectId: subject._id }).populate('studentId');
      if (!feedbacks.length) continue;

      // Filter feedbacks for section/group
      const filteredFeedbacks = feedbacks.filter(fb => {
        const student = fb.studentId;
        if (!student) return false;
        return hod.program === 'B.Tech'
          ? student.group === group
          : student.section === section;
      });

      if (filteredFeedbacks.length === 0) continue;

      const totalRatings = {};
      const questionCount = {};

      for (const fb of filteredFeedbacks) {
        for (const response of fb.responses) {
          if (!totalRatings[response.question]) {
            totalRatings[response.question] = 0;
            questionCount[response.question] = 0;
          }
          totalRatings[response.question] += response.rating;
          questionCount[response.question] += 1;
        }
      }

      const avgRatings = Object.keys(totalRatings).map(q => ({
        question: q,
        average: (totalRatings[q] / questionCount[q]).toFixed(2),
      }));

      const overallAvg = avgRatings.reduce((acc, q) => acc + parseFloat(q.average), 0) / avgRatings.length;

      summary.push({
        subjectName: subject.name,
        facultyName: subject.facultyName,
        year: subject.year,
        term: subject.term,
        averageRating: overallAvg.toFixed(2),
        questions: avgRatings,
      });
    }

    res.json({ summary });
  } catch (err) {
    console.error('Error in HOD feedback summary:', err);
    res.status(500).json({ message: 'Server error while generating summary' });
  }
};
