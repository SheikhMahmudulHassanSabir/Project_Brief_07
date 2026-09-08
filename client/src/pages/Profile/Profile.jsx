import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, MapPin, Briefcase, Mail, Phone, ExternalLink, GraduationCap, Code } from 'lucide-react';
import PageTitle from '../../components/common/PageTitle';
import { useAuth } from '../../context/AuthContext';

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
    <div className="page-wrapper">
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <PageTitle title="My Profile" description="Manage your personal information, experience, and preferences." />
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Sticky Sidebar-ish) */}
          <div className="card" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content', border: '1.5px solid var(--border-default)' }}>
            <div 
              style={{
                width: '120px', height: '120px', borderRadius: '50%', 
                background: 'var(--palette-accent)', color: 'white', 
                fontSize: '3rem', fontWeight: 'bold', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                border: '4px solid var(--bg-surface)'
              }}
            >
              {formData.name?.charAt(0) || user.name?.charAt(0) || 'U'}
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{formData.name || user.name}</h2>
            <p className="text-muted" style={{ fontWeight: '600', marginBottom: '1.5rem', color: 'var(--palette-accent)' }}>{formData.title || user.title || 'Add a professional title'}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <Mail size={16} />
                <span style={{ fontSize: '0.9rem' }}>{formData.email || 'No email provided'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <Phone size={16} />
                <span style={{ fontSize: '0.9rem' }}>{formData.phone || 'No phone provided'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <MapPin size={16} />
                <span style={{ fontSize: '0.9rem' }}>{formData.location || 'No location provided'}</span>
              </div>
            </div>
          </div>

          {/* Right Column (Details) */}
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {!isEditing ? (
              // ----------------------------------------------------
              // VIEW MODE
              // ----------------------------------------------------
              <>
                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={20} color="var(--palette-accent)" /> About Me
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    {formData.bio || 'You haven\'t added a bio yet.'}
                  </p>
                </div>

                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code size={20} color="var(--palette-accent)" /> Skills
                  </h3>
                  {formData.skills && formData.skills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No skills added.</p>
                  )}
                </div>

                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={20} color="var(--palette-accent)" /> Experience
                  </h3>
                  {formData.experience && formData.experience.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {formData.experience.map((exp, index) => (
                        <div key={index} style={{ borderLeft: '2px solid var(--border-default)', paddingLeft: '1.5rem', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--palette-accent)' }}></div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{exp.position}</h4>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: '500' }}>{exp.company} • {exp.duration}</div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No experience added.</p>
                  )}
                </div>

                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GraduationCap size={20} color="var(--palette-accent)" /> Education
                  </h3>
                  {formData.education && formData.education.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {formData.education.map((edu, index) => (
                        <div key={index} style={{ borderLeft: '2px solid var(--border-default)', paddingLeft: '1.5rem', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--palette-accent)' }}></div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{edu.degree}</h4>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500' }}>{edu.institution} • {edu.year}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No education added.</p>
                  )}
                </div>
              </>
            ) : (
              // ----------------------------------------------------
              // EDIT MODE
              // ----------------------------------------------------
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Basic Info */}
                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Full Name</label>
                      <input type="text" name="name" className="form-input" value={formData.name || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Professional Title</label>
                      <input type="text" name="title" className="form-input" placeholder="e.g. Senior Frontend Developer" value={formData.title || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Email Address</label>
                      <input type="email" name="email" className="form-input" value={formData.email || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Phone Number</label>
                      <input type="tel" name="phone" className="form-input" value={formData.phone || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                      <label className="form-label">Location</label>
                      <input type="text" name="location" className="form-input" placeholder="e.g. New York, NY" value={formData.location || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                      <label className="form-label">Professional Summary (Bio)</label>
                      <textarea name="bio" className="form-textarea" rows="4" value={formData.bio || ''} onChange={handleChange}></textarea>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Skills</h3>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Comma Separated Skills</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="React, Node.js, Python..." 
                      value={formData.skills ? formData.skills.join(', ') : ''} 
                      onChange={handleSkillsChange} 
                    />
                  </div>
                </div>

                {/* Experience */}
                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Experience</h3>
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('experience', { company: '', position: '', duration: '', description: '' })}>
                      <Plus size={14} /> Add Experience
                    </button>
                  </div>
                  
                  {formData.experience?.map((exp, index) => (
                    <div key={index} style={{ padding: '1.5rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('experience', index)}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--danger-text)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Company</label>
                          <input type="text" className="form-input" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Position</label>
                          <input type="text" className="form-input" value={exp.position} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} />
                        </div>
                        <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                          <label className="form-label">Duration</label>
                          <input type="text" className="form-input" placeholder="e.g. Jan 2020 - Present" value={exp.duration} onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)} />
                        </div>
                        <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                          <label className="form-label">Description</label>
                          <textarea className="form-textarea" rows="2" value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Education</h3>
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => addArrayItem('education', { institution: '', degree: '', year: '' })}>
                      <Plus size={14} /> Add Education
                    </button>
                  </div>
                  
                  {formData.education?.map((edu, index) => (
                    <div key={index} style={{ padding: '1.5rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('education', index)}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--danger-text)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Institution</label>
                          <input type="text" className="form-input" value={edu.institution} onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label">Degree</label>
                          <input type="text" className="form-input" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                        </div>
                        <div className="form-group md:col-span-2" style={{ margin: 0 }}>
                          <label className="form-label">Year</label>
                          <input type="text" className="form-input" placeholder="e.g. 2016 - 2020" value={edu.year} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Social Links</h3>
                  <div className="grid md:grid-cols-1 gap-4">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">LinkedIn URL</label>
                      <input type="url" name="socialLinks.linkedin" className="form-input" value={formData.socialLinks?.linkedin || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">GitHub URL</label>
                      <input type="url" name="socialLinks.github" className="form-input" value={formData.socialLinks?.github || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Portfolio URL</label>
                      <input type="url" name="socialLinks.portfolio" className="form-input" value={formData.socialLinks?.portfolio || ''} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--border-default)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Preferences</h3>
                  <div className="grid md:grid-cols-1 gap-4">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Expected Salary</label>
                      <input type="text" name="preferences.expectedSalary" className="form-input" placeholder="e.g. $100k - $120k" value={formData.preferences?.expectedSalary || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" id="relocate" name="preferences.willingToRelocate" checked={formData.preferences?.willingToRelocate || false} onChange={handleChange} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--palette-accent)' }} />
                      <label htmlFor="relocate" style={{ cursor: 'pointer', fontWeight: '500', color: 'var(--text-primary)' }}>Willing to relocate</label>
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
