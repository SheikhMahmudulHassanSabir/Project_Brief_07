import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, MapPin, Briefcase, Mail, Phone, ExternalLink, GraduationCap, Code } from 'lucide-react';
import PageTitle from '../../components/common/PageTitle';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        title: user.title || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || '',
          github: user.socialLinks?.github || '',
          portfolio: user.socialLinks?.portfolio || '',
        },
        preferences: {
          expectedSalary: user.preferences?.expectedSalary || '',
          willingToRelocate: user.preferences?.willingToRelocate || false,
        }
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [field]: value }
      }));
    } else if (name.startsWith('preferences.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [field]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName, emptyItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], emptyItem]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    const skillsArray = value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!user) return <div className="container" style={{ padding: '3rem' }}>Loading profile...</div>;

  return (
    <div className="profile-page-container">
      <div className="container py-12 px-6" style={{ maxWidth: '1000px' }}>
        <div className="flex justify-between items-center mb-8">
          <PageTitle title="My Profile" description="Manage your personal information, experience, and preferences." />
          {!isEditing ? (
            <button className="btn btn-primary profile-pill-button" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} />
              <span style={{ marginLeft: '6px' }}>Edit Profile</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary profile-pill-button" onClick={handleCancel} style={{ background: '#fff' }}>
                <X size={16} />
                <span style={{ marginLeft: '6px' }}>Cancel</span>
              </button>
              <button className="btn btn-primary profile-pill-button" onClick={handleSave}>
                <Save size={16} />
                <span style={{ marginLeft: '6px' }}>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Sticky Sidebar-ish) */}
          <div className="profile-card p-8 text-center h-fit">
            <div className="profile-avatar-container">
              {formData.name?.charAt(0) || user.name?.charAt(0) || 'U'}
            </div>
            <h2 className="profile-name">{formData.name || user.name}</h2>
            <p className="profile-title">{formData.title || user.title || 'Add a professional title'}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginTop: '2.5rem' }}>
              <div className="profile-info-item">
                <Mail size={18} />
                <span>{formData.email || 'No email provided'}</span>
              </div>
              <div className="profile-info-item">
                <Phone size={18} />
                <span>{formData.phone || 'No phone provided'}</span>
              </div>
              <div className="profile-info-item">
                <MapPin size={18} />
                <span>{formData.location || 'No location provided'}</span>
              </div>
            </div>
          </div>

          {/* Right Column (Details) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {!isEditing ? (
              // ----------------------------------------------------
              // VIEW MODE
              // ----------------------------------------------------
              <div className="profile-card">
                <div className="profile-section">
                  <h3 className="profile-section-title">
                    <Briefcase size={22} /> About Me
                  </h3>
                  <p style={{ color: '#64748B', lineHeight: '1.7' }}>
                    {formData.bio || 'You haven\'t added a bio yet.'}
                  </p>
                </div>

                <div className="profile-section">
                  <h3 className="profile-section-title">
                    <Code size={22} /> Skills
                  </h3>
                  {formData.skills && formData.skills.length > 0 && formData.skills[0] !== "" ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="badge badge-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem', borderRadius: '999px' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#94A3B8' }}>No skills added.</p>
                  )}
                </div>

                <div className="profile-section">
                  <h3 className="profile-section-title">
                    <Briefcase size={22} /> Experience
                  </h3>
                  {formData.experience && formData.experience.length > 0 && formData.experience[0].company !== "" ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {formData.experience.map((exp, index) => (
                        <div key={index} className="profile-timeline-item">
                          <div className="profile-timeline-dot"></div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0B1F4B', marginBottom: '0.2rem' }}>{exp.position}</h4>
                          <div style={{ color: '#0B4FE8', fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: '600' }}>{exp.company} • {exp.duration}</div>
                          <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6' }}>{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#94A3B8' }}>No experience added.</p>
                  )}
                </div>

                <div className="profile-section">
                  <h3 className="profile-section-title">
                    <GraduationCap size={22} /> Education
                  </h3>
                  {formData.education && formData.education.length > 0 && formData.education[0].institution !== "" ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {formData.education.map((edu, index) => (
                        <div key={index} className="profile-timeline-item">
                          <div className="profile-timeline-dot"></div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0B1F4B', marginBottom: '0.2rem' }}>{edu.degree}</h4>
                          <div style={{ color: '#0B4FE8', fontSize: '0.95rem', fontWeight: '600' }}>{edu.institution} • {edu.year}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#94A3B8' }}>No education added.</p>
                  )}
                </div>
              </div>
            ) : (
              // ----------------------------------------------------
              // EDIT MODE
              // ----------------------------------------------------
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Basic Info */}
                <div className="profile-card">
                  <div className="profile-section">
                    <h3 className="profile-section-title">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: '600' }}>Full Name</label>
                        <div className="profile-input-wrapper">
                          <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: '600' }}>Professional Title</label>
                        <div className="profile-input-wrapper">
                          <input type="text" name="title" placeholder="e.g. Senior Frontend Developer" value={formData.title || ''} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: '600' }}>Email Address</label>
                        <div className="profile-input-wrapper">
                          <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: '600' }}>Phone Number</label>
                        <div className="profile-input-wrapper">
                          <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: '600' }}>Location</label>
                        <div className="profile-input-wrapper">
                          <input type="text" name="location" placeholder="e.g. New York, NY" value={formData.location || ''} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontWeight: '600' }}>Professional Summary (Bio)</label>
                        <div className="profile-textarea-wrapper">
                          <textarea name="bio" rows="4" value={formData.bio || ''} onChange={handleChange}></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="profile-card">
                  <div className="profile-section">
                    <h3 className="profile-section-title">Skills</h3>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontWeight: '600' }}>Comma Separated Skills</label>
                      <div className="profile-input-wrapper">
                        <input 
                          type="text" 
                          placeholder="React, Node.js, Python..." 
                          value={formData.skills ? formData.skills.join(', ') : ''} 
                          onChange={handleSkillsChange} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="profile-card">
                  <div className="profile-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 className="profile-section-title" style={{ margin: 0 }}>Experience</h3>
                      <button type="button" className="btn btn-sm btn-secondary profile-pill-button" onClick={() => addArrayItem('experience', { company: '', position: '', duration: '', description: '' })} style={{ background: '#F8FAFC' }}>
                        <Plus size={14} /> Add Experience
                      </button>
                    </div>
                    
                    {formData.experience?.map((exp, index) => (
                      <div key={index} className="profile-edit-item-box">
                        <button 
                          type="button" 
                          onClick={() => removeArrayItem('experience', index)}
                          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', display: 'flex' }}
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Company</label>
                            <div className="profile-input-wrapper" style={{ background: '#ffffff' }}>
                              <input type="text" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} />
                            </div>
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Position</label>
                            <div className="profile-input-wrapper" style={{ background: '#ffffff' }}>
                              <input type="text" value={exp.position} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} />
                            </div>
                          </div>
                          <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                            <label className="form-label">Duration</label>
                            <div className="profile-input-wrapper" style={{ background: '#ffffff' }}>
                              <input type="text" placeholder="e.g. Jan 2020 - Present" value={exp.duration} onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)} />
                            </div>
                          </div>
                          <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                            <label className="form-label">Description</label>
                            <div className="profile-textarea-wrapper" style={{ background: '#ffffff' }}>
                              <textarea rows="2" value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="profile-card">
                  <div className="profile-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 className="profile-section-title" style={{ margin: 0 }}>Education</h3>
                      <button type="button" className="btn btn-sm btn-secondary profile-pill-button" onClick={() => addArrayItem('education', { institution: '', degree: '', year: '' })} style={{ background: '#F8FAFC' }}>
                        <Plus size={14} /> Add Education
                      </button>
                    </div>
                    
                    {formData.education?.map((edu, index) => (
                      <div key={index} className="profile-edit-item-box">
                        <button 
                          type="button" 
                          onClick={() => removeArrayItem('education', index)}
                          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', display: 'flex' }}
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Institution</label>
                            <div className="profile-input-wrapper" style={{ background: '#ffffff' }}>
                              <input type="text" value={edu.institution} onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)} />
                            </div>
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Degree</label>
                            <div className="profile-input-wrapper" style={{ background: '#ffffff' }}>
                              <input type="text" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                            </div>
                          </div>
                          <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                            <label className="form-label">Year</label>
                            <div className="profile-input-wrapper" style={{ background: '#ffffff' }}>
                              <input type="text" placeholder="e.g. 2016 - 2020" value={edu.year} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div className="profile-card">
                  <div className="profile-section">
                    <h3 className="profile-section-title">Preferences</h3>
                    <div className="grid md:grid-cols-1 gap-4">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Expected Salary</label>
                        <div className="profile-input-wrapper">
                          <input type="text" name="preferences.expectedSalary" placeholder="e.g. $100k - $120k" value={formData.preferences?.expectedSalary || ''} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                        <input type="checkbox" id="relocate" name="preferences.willingToRelocate" checked={formData.preferences?.willingToRelocate || false} onChange={handleChange} style={{ width: '1.4rem', height: '1.4rem', accentColor: '#0B4FE8' }} />
                        <label htmlFor="relocate" style={{ cursor: 'pointer', fontWeight: '600', color: '#0F172A', fontSize: '1.05rem' }}>I am willing to relocate</label>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
