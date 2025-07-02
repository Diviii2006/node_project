import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FaFilter } from 'react-icons/fa';

const ProgramAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [loading, setLoading] = useState(false);

  const programData = [
    {
      program: 'B.Tech',
      departments: [
        { name: 'CSE', avgRating: 4.2, students: 120, subjects: 8 },
        { name: 'IT', avgRating: 4.0, students: 80, subjects: 7 },
        { name: 'ECE', avgRating: 4.1, students: 60, subjects: 6 }
      ]
    },
    {
      program: 'MCA',
      departments: [
        { name: 'Section A', avgRating: 4.3, students: 30, subjects: 6 },
        { name: 'Section B', avgRating: 4.1, students: 30, subjects: 6 }
      ]
    },
    {
      program: 'MBA',
      departments: [
        { name: 'Section A', avgRating: 4.0, students: 25, subjects: 5 },
        { name: 'Section B', avgRating: 3.9, students: 15, subjects: 5 }
      ]
    }
  ];

  const radarData = [
    { subject: 'Teaching Quality', BTech: 4.1, MCA: 4.3, MBA: 4.0 },
    { subject: 'Course Content', BTech: 4.0, MCA: 4.2, MBA: 3.9 },
    { subject: 'Communication', BTech: 4.2, MCA: 4.4, MBA: 4.1 },
    { subject: 'Punctuality', BTech: 4.3, MCA: 4.1, MBA: 4.0 },
    { subject: 'Overall Satisfaction', BTech: 4.1, MCA: 4.3, MBA: 4.0 }
  ];

  return (
    <div className="program-analytics">
      <div className="page-header">
        <h1>Program Analytics</h1>
      </div>

      <div className="filters-section">
        <div className="filter-controls">
          <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
            <option value="">All Programs</option>
            <option value="B.Tech">B.Tech</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
          </select>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Program Comparison - Rating Categories</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 5]} />
              <Radar name="B.Tech" dataKey="BTech" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
              <Radar name="MCA" dataKey="MCA" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
              <Radar name="MBA" dataKey="MBA" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Department-wise Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={programData.flatMap(p => p.departments.map(d => ({...d, program: p.program})))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="avgRating" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="programs-overview">
        <h3>Detailed Program Overview</h3>
        {programData.map((program, index) => (
          <div key={index} className="program-section">
            <h4>{program.program} Program</h4>
            <div className="departments-grid">
              {program.departments.map((dept, deptIndex) => (
                <div key={deptIndex} className="department-card">
                  <h5>{dept.name}</h5>
                  <div className="dept-stats">
                    <p><strong>Average Rating:</strong> {dept.avgRating}/5</p>
                    <p><strong>Students:</strong> {dept.students}</p>
                    <p><strong>Subjects:</strong> {dept.subjects}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramAnalytics;