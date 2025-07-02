import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    program: '',
    year: '',
    term: '',
    group: '',
    section: '',
    faculty: '',
    credits: ''
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    filterSubjects();
  }, [subjects, searchTerm, filterProgram, filterYear]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const filterSubjects = () => {
    let filtered = subjects;

    if (searchTerm) {
      filtered = filtered.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.faculty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterProgram) {
      filtered = filtered.filter(subject => subject.program === filterProgram);
    }

    if (filterYear) {
      filtered = filtered.filter(subject => subject.year.toString() === filterYear);
    }

    setFilteredSubjects(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await axios.put(`/api/subjects/${editingSubject._id}`, formData);
        toast.success('Subject updated successfully');
      } else {
        await axios.post('/api/subjects', formData);
        toast.success('Subject created successfully');
      }
      fetchSubjects();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      program: subject.program,
      year: subject.year.toString(),
      term: subject.term,
      group: subject.group || '',
      section: subject.section || '',
      faculty: subject.faculty,
      credits: subject.credits.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await axios.delete(`/api/subjects/${subjectId}`);
        toast.success('Subject deleted successfully');
        fetchSubjects();
      } catch (error) {
        toast.error('Failed to delete subject');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      program: '',
      year: '',
      term: '',
      group: '',
      section: '',
      faculty: '',
      credits: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="subject-management">
      <div className="page-header">
        <h1>Subject Management</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Subject
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)}>
            <option value="">All Programs</option>
            <option value="B.Tech">B.Tech</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
          </select>

          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </div>

      <div className="subjects-table">
        <table>
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Code</th>
              <th>Program</th>
              <th>Year</th>
              <th>Term</th>
              <th>Group/Section</th>
              <th>Faculty</th>
              <th>Credits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject._id}>
                <td>{subject.name}</td>
                <td>{subject.code}</td>
                <td>{subject.program}</td>
                <td>{subject.year}</td>
                <td>{subject.term}</td>
                <td>{subject.group || subject.section || '-'}</td>
                <td>{subject.faculty}</td>
                <td>{subject.credits}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(subject)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(subject._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Subject Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Program</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Program</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    {formData.program === 'B.Tech' && (
                      <>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Term</label>
                  <select
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Term</option>
                    <option value="I">Term I</option>
                    <option value="II">Term II</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Credits</label>
                  <select
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Credits</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>

              {formData.program === 'B.Tech' && (
                <div className="form-group">
                  <label>Group</label>
                  <input
                    type="text"
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    placeholder="e.g., CSE, IT, ECE"
                    required
                  />
                </div>
              )}

              {(formData.program === 'MCA' || formData.program === 'MBA') && (
                <div className="form-group">
                  <label>Section</label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g., A, B, C"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Faculty Name</label>
                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingSubject ? 'Update' : 'Create'} Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;