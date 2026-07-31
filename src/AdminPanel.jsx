import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Save, LogOut, CheckCircle, Plus, Trash2, X, RefreshCw } from 'lucide-react';

export default function AdminPanel({ onClose, onSaveData, initialData }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable state loaded from initial JSON or defaults
  const [general, setGeneral] = useState(initialData.general || {
    phone: '+373 69 44 77 68',
    address: 'Chișinău, Str. Sarmizegetusa 92',
    typewriterWords: ['Învață Engleza', 'Un pas spre succes', 'Excelență în engleză']
  });

  const [courses, setCourses] = useState(initialData.courses || []);
  const [team, setTeam] = useState(initialData.team || []);

  const handleLogin = (e) => {
    e.preventDefault();
    if ((username === 'admin' || username === 'vlad') && (password === 'progress2025' || password === 'admin123')) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Nume de utilizator sau parolă incorectă!');
    }
  };

  const handleSave = () => {
    if (onSaveData) {
      onSaveData({ general, courses, team });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Add new typewriter phrase
  const addTypewriterWord = () => {
    setGeneral({
      ...general,
      typewriterWords: [...general.typewriterWords, 'Noua frază']
    });
  };

  const removeTypewriterWord = (index) => {
    const updated = [...general.typewriterWords];
    updated.splice(index, 1);
    setGeneral({ ...general, typewriterWords: updated });
  };

  const updateTypewriterWord = (index, val) => {
    const updated = [...general.typewriterWords];
    updated[index] = val;
    setGeneral({ ...general, typewriterWords: updated });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-modal-overlay">
        <div className="admin-login-card">
          <button className="admin-close-btn" onClick={onClose}><X size={20} /></button>
          <div className="admin-login-header">
            <div className="admin-logo-badge">
              <ShieldCheck size={28} color="var(--color-primary-light)" />
            </div>
            <h2>Panou de Administrare</h2>
            <p>Progress CLS — Autentificare Securizată</p>
          </div>

          {error && <div className="admin-error-alert">{error}</div>}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label><User size={16} /> Nume Utilizator</label>
              <input 
                type="text" 
                placeholder="Introdu utilizatorul (admin)" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Parolă</label>
              <input 
                type="password" 
                placeholder="Introdu parola" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
              Autentificare
            </button>
          </form>

          <div className="admin-hint">
            💡 <em>Utilizator implicit: <strong>admin</strong> | Parolă: <strong>progress2025</strong></em>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-dashboard-card">
        {/* Header */}
        <div className="admin-dash-header">
          <div className="admin-dash-title">
            <ShieldCheck size={24} color="#60a5fa" />
            <div>
              <h3>Panou de Administrare Progress CLS</h3>
              <span>Conectat ca <strong>{username}</strong></span>
            </div>
          </div>
          <div className="admin-dash-actions">
            {savedSuccess && (
              <span className="save-badge-success">
                <CheckCircle size={16} /> Salvat cu succes!
              </span>
            )}
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              <Save size={16} /> Salvează Modificările
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
              <LogOut size={16} /> Deconectare
            </button>
            <button onClick={onClose} className="admin-close-btn-dash"><X size={20} /></button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-dash-tabs">
          <button 
            className={`admin-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            ⚙️ Setări Generale & Typewriter
          </button>
          <button 
            className={`admin-tab ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            📚 Cursuri & Prețuri
          </button>
          <button 
            className={`admin-tab ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            👩‍🏫 Echipa de Profesori
          </button>
        </div>

        {/* Tab Content */}
        <div className="admin-dash-body">
          {activeTab === 'general' && (
            <div className="admin-tab-content">
              <h4>Informații Contact Studio</h4>
              <div className="admin-grid-2">
                <div className="form-group">
                  <label>Telefon Studio (Afișat)</label>
                  <input 
                    type="text" 
                    value={general.phone} 
                    onChange={(e) => setGeneral({ ...general, phone: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Adresă Studio</label>
                  <input 
                    type="text" 
                    value={general.address} 
                    onChange={(e) => setGeneral({ ...general, address: e.target.value })} 
                  />
                </div>
              </div>

              <hr style={{ margin: '1.5rem 0', borderColor: 'var(--color-border-light)' }} />

              <div className="flex-between">
                <h4>Frază Animată (Efect de Peceat / Typewriter)</h4>
                <button onClick={addTypewriterWord} className="btn btn-ghost btn-sm">
                  <Plus size={16} /> Adaugă Frază
                </button>
              </div>

              <div className="admin-list">
                {general.typewriterWords.map((word, idx) => (
                  <div key={idx} className="admin-list-item">
                    <input 
                      type="text" 
                      value={word} 
                      onChange={(e) => updateTypewriterWord(idx, e.target.value)} 
                    />
                    <button onClick={() => removeTypewriterWord(idx)} className="btn-icon-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="admin-tab-content">
              <h4>Editează Cursurile și Prețurile</h4>
              {courses.map((course, idx) => (
                <div key={course.id || idx} className="admin-course-box">
                  <h5>{course.title} ({course.label})</h5>
                  <div className="admin-grid-2">
                    <div className="form-group">
                      <label>Preț Lunar (Lei)</label>
                      <input 
                        type="text" 
                        value={course.priceMonthly} 
                        onChange={(e) => {
                          const updated = [...courses];
                          updated[idx].priceMonthly = e.target.value;
                          setCourses(updated);
                        }} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Preț Total (Lei)</label>
                      <input 
                        type="text" 
                        value={course.priceTotal} 
                        onChange={(e) => {
                          const updated = [...courses];
                          updated[idx].priceTotal = e.target.value;
                          setCourses(updated);
                        }} 
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '0.75rem' }}>
                    <label>Descriere Curs</label>
                    <textarea 
                      rows={2} 
                      value={course.desc} 
                      onChange={(e) => {
                        const updated = [...courses];
                        updated[idx].desc = e.target.value;
                        setCourses(updated);
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="admin-tab-content">
              <h4>Editează Membrii Echipei</h4>
              <div className="admin-grid-2">
                {team.map((member, idx) => (
                  <div key={idx} className="admin-member-box">
                    <img src={member.img} alt={member.name} className="admin-member-thumb" />
                    <div style={{ flex: 1 }}>
                      <div className="form-group">
                        <label>Nume & Prenume</label>
                        <input 
                          type="text" 
                          value={member.name} 
                          onChange={(e) => {
                            const updated = [...team];
                            updated[idx].name = e.target.value;
                            setTeam(updated);
                          }} 
                        />
                      </div>
                      <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <label>Rol / Funcție</label>
                        <input 
                          type="text" 
                          value={member.role} 
                          onChange={(e) => {
                            const updated = [...team];
                            updated[idx].role = e.target.value;
                            setTeam(updated);
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
