import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, User, Save, LogOut, CheckCircle, Plus, Trash2, X, 
  Layout, BookOpen, Award, Users, Star, MessageSquare, Newspaper, HelpCircle, Phone, Globe
} from 'lucide-react';

function RichTextEditor({ label, value, onChange, placeholder, minHeight = 120 }) {
  const [editorId] = useState(() => `wysiwyg-${Math.random().toString(36).substring(2, 9)}`);

  const insertTag = (tagStart, tagEnd = '') => {
    const textarea = document.getElementById(editorId);
    if (!textarea) return;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selectedText = value.substring(start, end);
    const replacement = `${tagStart}${selectedText || 'text'}${tagEnd}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
  };

  return (
    <div className="wysiwyg-wrapper">
      <div className="wysiwyg-header">
        <label className="wysiwyg-label">{label}</label>
      </div>

      {/* WYSIWYG Toolbar */}
      <div className="wysiwyg-toolbar">
        <button type="button" onClick={() => insertTag('<b>', '</b>')} title="Bold"><b>B</b></button>
        <button type="button" onClick={() => insertTag('<i>', '</i>')} title="Italic"><i>I</i></button>
        <button type="button" onClick={() => insertTag('<u>', '</u>')} title="Subliniere"><u>U</u></button>
        <button type="button" onClick={() => insertTag('<span style="color: var(--color-primary-light); font-weight: 700;">', '</span>')} title="Accent Color">🎨 Accent</button>
        <button type="button" onClick={() => insertTag('<br />')} title="Rand Nou">↵ Rând Nou</button>
      </div>

      <textarea
        id={editorId}
        className="wysiwyg-textarea"
        style={{ minHeight: `${minHeight}px` }}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <div className="wysiwyg-preview">
          <span className="wysiwyg-preview-label">Afișare în timp real pe site:</span>
          <div dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      )}
    </div>
  );
}

export default function AdminPanel({ onClose, onSaveData, initialData }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeSection, setActiveSection] = useState('hero');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Full Site Data State
  const [data, setData] = useState({
    hero: initialData.hero || {
      awardText1: 'Centrul Lingvistic al Anului 2024',
      awardText2: 'Visionary Brand 2025',
      subtitle: 'Cursuri de limba engleză pentru copii, adolescenți și adulți, bazate pe metodologia Cambridge. Profesori cu experiență și certificați TEFL internațional.',
      typewriterWords: ['Învață Engleza', 'Un pas spre succes', 'Excelență în engleză']
    },
    stats: initialData.stats || [
      { number: '500+', label: 'Cursanți formați' },
      { number: '98%', label: 'Rată de promovare Cambridge' },
      { number: '10+', label: 'Ani de experiență' },
      { number: '100%', label: 'Dedicare și profesionalism' }
    ],
    courses: initialData.courses || [],
    benefits: initialData.benefits || [
      { title: 'Metodologie Cambridge', desc: 'Predare bazată pe standarde internaționale și materiale moderne.' },
      { title: 'Profesori certificați TEFL', desc: 'Echipă de profesoare dedicate cu experiență.' },
      { title: 'Grupe restrânse', desc: 'Max. 12 cursanți per grupă - atenție individuală.' },
      { title: 'Lecții interactive', desc: 'Comunicare, jocuri și proiecte practice.' }
    ],
    team: initialData.team || [],
    testimonials: initialData.testimonials || [
      { author: 'Maria D.', course: 'Engleza pentru Copii', text: 'Fiica mea a avansat de la A1 la B1 în 18 luni!', rating: 5 },
      { author: 'Andrei C.', course: 'Pregătire Cambridge B2', text: 'Am promovat examenul FCE cu nota B!', rating: 5 }
    ],
    blog: initialData.blog || [
      { title: 'Start Înscrierilor pentru noul an de studii 2026-2027', date: 'Iulie 2026', tag: 'Noutăți' },
      { title: 'Progress CLS - decernare Centrul Lingvistic al Anului 2024', date: 'Decembrie 2024', tag: 'Premii' }
    ],
    faq: initialData.faq || {
      cambridgeFaq: [],
      generalFaq: []
    },
    contacts: initialData.contacts || {
      phone: '+373 69 44 77 68',
      phoneRaw: '+37369447768',
      address: 'Chișinău, Str. Sarmizegetusa 92',
      email: 'progress.cls@gmail.com'
    }
  });

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
    try {
      localStorage.setItem('progress_cls_site_data', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    if (onSaveData) {
      onSaveData(data);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-fullscreen-page">
        <div className="admin-login-fullscreen-card">
          <button className="admin-close-btn" onClick={onClose}><X size={22} /></button>
          <div className="admin-login-header">
            <div className="admin-logo-badge">
              <ShieldCheck size={32} color="var(--color-primary-light)" />
            </div>
            <h2>Panou de Administrare Progress CLS</h2>
            <p>Conectează-te pentru a edita toate blocurile site-ului</p>
          </div>

          {error && <div className="admin-error-alert">{error}</div>}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label><User size={16} /> Nume Utilizator</label>
              <input 
                type="text" 
                placeholder="admin" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Parolă</label>
              <input 
                type="password" 
                placeholder="Parolă" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem', padding: '0.85rem' }}>
              Intră în Panoul de Administrare
            </button>
          </form>

          <div className="admin-hint">
            💡 <em>Utilizator: <strong>admin</strong> | Parolă: <strong>progress2025</strong></em>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-fullscreen-page">
      <div className="admin-app-container">
        {/* Sidebar Left */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <ShieldCheck size={26} color="#60a5fa" />
            <div>
              <h3>Progress CLS Admin</h3>
              <span>Versiunea 2.0 (Full Editor)</span>
            </div>
          </div>

          <nav className="admin-sidebar-menu">
            <button 
              className={`admin-menu-item ${activeSection === 'hero' ? 'active' : ''}`}
              onClick={() => setActiveSection('hero')}
            >
              <Layout size={18} /> Hero & Header
            </button>

            <button 
              className={`admin-menu-item ${activeSection === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveSection('stats')}
            >
              <Award size={18} /> Statistică (Stats)
            </button>

            <button 
              className={`admin-menu-item ${activeSection === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveSection('courses')}
            >
              <BookOpen size={18} /> Cursuri & Prețuri
            </button>

            <button 
              className={`admin-menu-item ${activeSection === 'benefits' ? 'active' : ''}`}
              onClick={() => setActiveSection('benefits')}
            >
              <Globe size={18} /> Beneficii
            </button>

            <button 
              className={`admin-menu-item ${activeSection === 'team' ? 'active' : ''}`}
              onClick={() => setActiveSection('team')}
            >
              <Users size={18} /> Echipa de Profesori
            </button>

            <button 
              className={`admin-menu-item ${activeSection === 'testimonials' ? 'active' : ''}`}
              onClick={() => setActiveSection('testimonials')}
            >
              <Star size={18} /> Recenzii (Testimonials)
            </button>

            <button 
              className={`admin-menu-item ${activeSection === 'blog' ? 'active' : ''}`}
              onClick={() => setActiveSection('blog')}
            >
              <Newspaper size={18} /> Noutăți & Blog
            </button>

            <button 
              className={`admin-menu-item ${activeSection === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveSection('faq')}
            >
              <HelpCircle size={18} /> Întrebări Frecvente (FAQ)
            </button>

            <button 
              className={`admin-menu-item ${activeSection === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveSection('contacts')}
            >
              <Phone size={18} /> Contacte & Footer
            </button>
          </nav>

          <div className="admin-sidebar-footer">
            <button onClick={() => setIsAuthenticated(false)} className="btn-logout-sidebar">
              <LogOut size={16} /> Deconectare
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main-area">
          {/* Top Bar inside Admin */}
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <h2>
                {activeSection === 'hero' && '🏆 Hero Banner & Efect de Peceat'}
                {activeSection === 'stats' && '📊 Blocul de Statisică (Cifre rapide)'}
                {activeSection === 'courses' && '📚 Cursuri, Prețuri & Manuale'}
                {activeSection === 'benefits' && '⭐ Cardurile de Beneficii'}
                {activeSection === 'team' && '👩‍🏫 Echipa de Profesori'}
                {activeSection === 'testimonials' && '💬 Recenziile Cursanților'}
                {activeSection === 'blog' && '📰 Articole de Blog & Noutăți'}
                {activeSection === 'faq' && '❓ Întrebări Frecvente (FAQ)'}
                {activeSection === 'contacts' && '📞 Date de Contact & Footer'}
              </h2>
            </div>
            <div className="admin-topbar-right">
              {savedSuccess && (
                <span className="save-badge-success">
                  <CheckCircle size={16} /> Salvat cu succes!
                </span>
              )}
              <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                <Save size={18} /> Salvează Tot Site-ul
              </button>
              <button onClick={onClose} className="btn btn-ghost" style={{ color: 'var(--color-text-secondary)' }}>
                Înapoi la Site <X size={18} />
              </button>
            </div>
          </header>

          <div className="admin-workspace">
            {/* 1. HERO SECTION */}
            {activeSection === 'hero' && (
              <div className="admin-card-section">
                <h3>Editează Bannerul Principal</h3>
                
                <div className="admin-grid-2">
                  <div className="form-group">
                    <label>Insignă Premiu #1</label>
                    <input 
                      type="text" 
                      value={data.hero.awardText1} 
                      onChange={(e) => setData({ ...data, hero: { ...data.hero, awardText1: e.target.value } })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Insignă Premiu #2</label>
                    <input 
                      type="text" 
                      value={data.hero.awardText2} 
                      onChange={(e) => setData({ ...data, hero: { ...data.hero, awardText2: e.target.value } })} 
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <RichTextEditor
                    label="Subtitlu Banner (Text complet)"
                    value={data.hero.subtitle}
                    onChange={(val) => setData({ ...data, hero: { ...data.hero, subtitle: val } })}
                    minHeight={140}
                  />
                </div>

                <hr style={{ margin: '1.5rem 0', borderColor: 'var(--color-border-light)' }} />

                <div className="flex-between" style={{ marginTop: '1.5rem' }}>
                  <h4>Frază Animată (Typewriter) — Învață Engleza & Succes</h4>
                  <button 
                    onClick={() => setData({ ...data, hero: { ...data.hero, typewriterWords: [...data.hero.typewriterWords, 'Frază nouă'] } })}
                    className="btn btn-ghost btn-sm"
                  >
                    <Plus size={16} /> Adaugă Frază Nouă
                  </button>
                </div>

                <div className="typewriter-pills-grid">
                  {data.hero.typewriterWords.map((word, idx) => (
                    <div key={idx} className="typewriter-pill-card">
                      <span className="typewriter-badge">#{idx + 1}</span>
                      <input 
                        type="text" 
                        value={word} 
                        onChange={(e) => {
                          const updated = [...data.hero.typewriterWords];
                          updated[idx] = e.target.value;
                          setData({ ...data, hero: { ...data.hero, typewriterWords: updated } });
                        }} 
                        className="typewriter-input"
                        placeholder="Ex: Învață Engleza"
                      />
                      <button 
                        onClick={() => {
                          const updated = [...data.hero.typewriterWords];
                          updated.splice(idx, 1);
                          setData({ ...data, hero: { ...data.hero, typewriterWords: updated } });
                        }}
                        className="btn-icon-danger"
                        title="Șterge fraza"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. STATS SECTION */}
            {activeSection === 'stats' && (
              <div className="admin-card-section">
                <h3>Cifre și Indicatori Rapizi</h3>
                <div className="admin-grid-2">
                  {data.stats.map((st, idx) => (
                    <div key={idx} className="admin-inner-card">
                      <div className="form-group">
                        <label>Valoare (ex: 500+)</label>
                        <input 
                          type="text" 
                          value={st.number} 
                          onChange={(e) => {
                            const updated = [...data.stats];
                            updated[idx].number = e.target.value;
                            setData({ ...data, stats: updated });
                          }} 
                        />
                      </div>
                      <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <label>Descriere Indicator</label>
                        <input 
                          type="text" 
                          value={st.label} 
                          onChange={(e) => {
                            const updated = [...data.stats];
                            updated[idx].label = e.target.value;
                            setData({ ...data, stats: updated });
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. COURSES SECTION */}
            {activeSection === 'courses' && (
              <div className="admin-card-section">
                <h3>Editează Toate Cursurile și Prețurile</h3>
                {data.courses.map((course, idx) => (
                  <div key={course.id || idx} className="admin-course-editor">
                    <h4>{course.title} ({course.label})</h4>
                    <div className="admin-grid-2">
                      <div className="form-group">
                        <label>Titlu Curs</label>
                        <input 
                          type="text" 
                          value={course.title} 
                          onChange={(e) => {
                            const updated = [...data.courses];
                            updated[idx].title = e.target.value;
                            setData({ ...data, courses: updated });
                          }} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Vârstă / Grupa</label>
                        <input 
                          type="text" 
                          value={course.age} 
                          onChange={(e) => {
                            const updated = [...data.courses];
                            updated[idx].age = e.target.value;
                            setData({ ...data, courses: updated });
                          }} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Preț Lunar (Lei)</label>
                        <input 
                          type="text" 
                          value={course.priceMonthly} 
                          onChange={(e) => {
                            const updated = [...data.courses];
                            updated[idx].priceMonthly = e.target.value;
                            setData({ ...data, courses: updated });
                          }} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Preț Total (Lei)</label>
                        <input 
                          type="text" 
                          value={course.priceTotal} 
                          onChange={(e) => {
                            const updated = [...data.courses];
                            updated[idx].priceTotal = e.target.value;
                            setData({ ...data, courses: updated });
                          }} 
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <RichTextEditor
                        label="Descriere Curs (Rich Text / Formatat)"
                        value={course.desc}
                        onChange={(val) => {
                          const updated = [...data.courses];
                          updated[idx].desc = val;
                          setData({ ...data, courses: updated });
                        }}
                        minHeight={130}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. BENEFITS SECTION */}
            {activeSection === 'benefits' && (
              <div className="admin-card-section">
                <h3>Editează Cardurile de Beneficii</h3>
                <div className="admin-grid-2">
                  {data.benefits.map((b, idx) => (
                    <div key={idx} className="admin-inner-card">
                      <div className="form-group">
                        <label>Titlu Beneficiu</label>
                        <input 
                          type="text" 
                          value={b.title} 
                          onChange={(e) => {
                            const updated = [...data.benefits];
                            updated[idx].title = e.target.value;
                            setData({ ...data, benefits: updated });
                          }} 
                        />
                      </div>
                      <div style={{ marginTop: '0.75rem' }}>
                        <RichTextEditor
                          label="Descriere Beneficiu (Formatat)"
                          value={b.desc}
                          onChange={(val) => {
                            const updated = [...data.benefits];
                            updated[idx].desc = val;
                            setData({ ...data, benefits: updated });
                          }}
                          minHeight={100}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TEAM SECTION */}
            {activeSection === 'team' && (
              <div className="admin-card-section">
                <h3>Echipa de Profesori</h3>
                <div className="admin-grid-2">
                  {data.team.map((member, idx) => (
                    <div key={idx} className="admin-member-editor-card">
                      <img src={member.img} alt={member.name} className="admin-member-thumb" />
                      <div style={{ flex: 1 }}>
                        <div className="form-group">
                          <label>Nume & Prenume</label>
                          <input 
                            type="text" 
                            value={member.name} 
                            onChange={(e) => {
                              const updated = [...data.team];
                              updated[idx].name = e.target.value;
                              setData({ ...data, team: updated });
                            }} 
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '0.5rem' }}>
                          <label>Rol / Funcție</label>
                          <input 
                            type="text" 
                            value={member.role} 
                            onChange={(e) => {
                              const updated = [...data.team];
                              updated[idx].role = e.target.value;
                              setData({ ...data, team: updated });
                            }} 
                          />
                        </div>
                        <div className="form-group" style={{ marginTop: '0.5rem' }}>
                          <label>Foto Profesor</label>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                            <input 
                              type="text" 
                              value={member.img} 
                              onChange={(e) => {
                                const updated = [...data.team];
                                updated[idx].img = e.target.value;
                                setData({ ...data, team: updated });
                              }} 
                              style={{ flex: 1 }}
                            />
                            <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', margin: 0 }}>
                              📁 Încarcă
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files && e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const updated = [...data.team];
                                      updated[idx].img = event.target.result;
                                      setData({ ...data, team: updated });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. TESTIMONIALS SECTION */}
            {activeSection === 'testimonials' && (
              <div className="admin-card-section">
                <div className="flex-between">
                  <h3>Recenzii de la Cursanți</h3>
                  <button 
                    onClick={() => {
                      const current = data.testimonials || [];
                      setData({
                        ...data,
                        testimonials: [
                          ...current, 
                          { author: 'Nume Cursant', course: 'Engleza pentru Copii', text: 'O experiență excelentă!', rating: 5 }
                        ]
                      });
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    <Plus size={16} /> Adaugă Recenzie Nouă
                  </button>
                </div>

                {data.testimonials.map((t, idx) => (
                  <div key={idx} className="admin-inner-card" style={{ marginBottom: '1.25rem' }}>
                    <div className="flex-between">
                      <label style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>Recenzia #{idx + 1}</label>
                      <button 
                        onClick={() => {
                          const updated = [...data.testimonials];
                          updated.splice(idx, 1);
                          setData({ ...data, testimonials: updated });
                        }}
                        className="btn-icon-danger"
                        title="Șterge recenzia"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="admin-grid-2" style={{ marginTop: '0.5rem' }}>
                      <div className="form-group">
                        <label>Nume Autor</label>
                        <input 
                          type="text" 
                          value={t.author} 
                          onChange={(e) => {
                            const updated = [...data.testimonials];
                            updated[idx].author = e.target.value;
                            setData({ ...data, testimonials: updated });
                          }} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Curs Absolvit</label>
                        <input 
                          type="text" 
                          value={t.course} 
                          onChange={(e) => {
                            const updated = [...data.testimonials];
                            updated[idx].course = e.target.value;
                            setData({ ...data, testimonials: updated });
                          }} 
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      <RichTextEditor
                        label="Text Recenzie (Rich Text)"
                        value={t.text}
                        onChange={(val) => {
                          const updated = [...data.testimonials];
                          updated[idx].text = val;
                          setData({ ...data, testimonials: updated });
                        }}
                        minHeight={110}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. BLOG SECTION */}
            {activeSection === 'blog' && (
              <div className="admin-card-section">
                <div className="flex-between">
                  <h3>Noutăți și Articole de Blog</h3>
                  <button 
                    onClick={() => {
                      const current = data.blog || [];
                      setData({
                        ...data,
                        blog: [
                          ...current,
                          {
                            id: `b-${Date.now()}`,
                            title: 'Titlu Nou Articol de Blog',
                            date: 'Iulie 2026',
                            tag: 'Noutăți',
                            img: '/hero.png',
                            desc: 'Conținut detaliat articol...'
                          }
                        ]
                      });
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    <Plus size={16} /> Adaugă Articol Nou
                  </button>
                </div>

                {data.blog.map((post, idx) => (
                  <div key={post.id || idx} className="admin-inner-card" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex-between">
                      <label style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>Articolul #{idx + 1}</label>
                      <button 
                        onClick={() => {
                          const updated = [...data.blog];
                          updated.splice(idx, 1);
                          setData({ ...data, blog: updated });
                        }}
                        className="btn-icon-danger"
                        title="Șterge articolul"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="admin-grid-2" style={{ marginTop: '0.5rem' }}>
                      <div className="form-group">
                        <label>Titlu Articol</label>
                        <input 
                          type="text" 
                          value={post.title} 
                          onChange={(e) => {
                            const updated = [...data.blog];
                            updated[idx].title = e.target.value;
                            setData({ ...data, blog: updated });
                          }} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Data / Luna (ex: Iulie 2026)</label>
                        <input 
                          type="text" 
                          value={post.date} 
                          onChange={(e) => {
                            const updated = [...data.blog];
                            updated[idx].date = e.target.value;
                            setData({ ...data, blog: updated });
                          }} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Etichetă / Categorie (ex: Noutăți, Premii, Sfaturi)</label>
                        <input 
                          type="text" 
                          value={post.tag || 'Noutăți'} 
                          onChange={(e) => {
                            const updated = [...data.blog];
                            updated[idx].tag = e.target.value;
                            setData({ ...data, blog: updated });
                          }} 
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontWeight: 700 }}>
                          Fotografie Articol — 📐 Recomandat format PĂTRAT (1:1, ex: 500x500px)
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.35rem' }}>
                          <input 
                            type="text" 
                            placeholder="/hero.png sau URL..." 
                            value={post.img || ''} 
                            onChange={(e) => {
                              const updated = [...data.blog];
                              updated[idx].img = e.target.value;
                              setData({ ...data, blog: updated });
                            }} 
                            style={{ flex: 1 }}
                          />
                          <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', margin: 0 }}>
                            📁 ÎNCARCĂ FOTO (1:1)
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const updated = [...data.blog];
                                    updated[idx].img = event.target.result;
                                    setData({ ...data, blog: updated });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <RichTextEditor
                        label="Descriere & Conținut Articol (Rich Text / WYSIWYG)"
                        value={post.desc || post.text || ''}
                        onChange={(val) => {
                          const updated = [...data.blog];
                          updated[idx].desc = val;
                          setData({ ...data, blog: updated });
                        }}
                        minHeight={160}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 8. FAQ SECTION */}
            {activeSection === 'faq' && (
              <div className="admin-card-section">
                <div className="flex-between">
                  <h3>Întrebări Frecvente — Cambridge</h3>
                  <button 
                    onClick={() => {
                      const current = data.faq.cambridgeFaq || [];
                      setData({
                        ...data,
                        faq: {
                          ...data.faq,
                          cambridgeFaq: [...current, { q: 'Întrebare nouă Cambridge?', a: 'Răspuns detaliat...' }]
                        }
                      });
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    <Plus size={16} /> Adaugă Întrebare Cambridge
                  </button>
                </div>

                {(data.faq.cambridgeFaq || []).map((faqItem, idx) => (
                  <div key={idx} className="admin-inner-card" style={{ marginBottom: '1.25rem' }}>
                    <div className="flex-between">
                      <label style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>Întrebarea #{idx + 1}</label>
                      <button 
                        onClick={() => {
                          const updated = [...data.faq.cambridgeFaq];
                          updated.splice(idx, 1);
                          setData({ ...data, faq: { ...data.faq, cambridgeFaq: updated } });
                        }}
                        className="btn-icon-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={faqItem.q} 
                        onChange={(e) => {
                          const updated = [...data.faq.cambridgeFaq];
                          updated[idx].q = e.target.value;
                          setData({ ...data, faq: { ...data.faq, cambridgeFaq: updated } });
                        }} 
                      />
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      <RichTextEditor
                        label="Răspuns Explicație (Rich Text)"
                        value={faqItem.a}
                        onChange={(val) => {
                          const updated = [...data.faq.cambridgeFaq];
                          updated[idx].a = val;
                          setData({ ...data, faq: { ...data.faq, cambridgeFaq: updated } });
                        }}
                        minHeight={120}
                      />
                    </div>
                  </div>
                ))}

                <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border-light)' }} />

                <div className="flex-between">
                  <h3>Întrebări Frecvente — Generale & Înscriere</h3>
                  <button 
                    onClick={() => {
                      const current = data.faq.generalFaq || [];
                      setData({
                        ...data,
                        faq: {
                          ...data.faq,
                          generalFaq: [...current, { q: 'Întrebare nouă generală?', a: 'Răspuns detaliat...' }]
                        }
                      });
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    <Plus size={16} /> Adaugă Întrebare Generală
                  </button>
                </div>

                {(data.faq.generalFaq || []).map((faqItem, idx) => (
                  <div key={idx} className="admin-inner-card" style={{ marginBottom: '1.25rem' }}>
                    <div className="flex-between">
                      <label style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>Întrebarea Generală #{idx + 1}</label>
                      <button 
                        onClick={() => {
                          const updated = [...data.faq.generalFaq];
                          updated.splice(idx, 1);
                          setData({ ...data, faq: { ...data.faq, generalFaq: updated } });
                        }}
                        className="btn-icon-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={faqItem.q} 
                        onChange={(e) => {
                          const updated = [...data.faq.generalFaq];
                          updated[idx].q = e.target.value;
                          setData({ ...data, faq: { ...data.faq, generalFaq: updated } });
                        }} 
                      />
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      <RichTextEditor
                        label="Răspuns Explicație (Rich Text)"
                        value={faqItem.a}
                        onChange={(val) => {
                          const updated = [...data.faq.generalFaq];
                          updated[idx].a = val;
                          setData({ ...data, faq: { ...data.faq, generalFaq: updated } });
                        }}
                        minHeight={120}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 9. CONTACTS SECTION */}
            {activeSection === 'contacts' && (
              <div className="admin-card-section">
                <h3>Date de Contact & Footer</h3>
                <div className="admin-grid-2">
                  <div className="form-group">
                    <label>Telefon Studio (Afișat)</label>
                    <input 
                      type="text" 
                      value={data.contacts.phone} 
                      onChange={(e) => setData({ ...data, contacts: { ...data.contacts, phone: e.target.value } })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Studio</label>
                    <input 
                      type="text" 
                      value={data.contacts.email} 
                      onChange={(e) => setData({ ...data, contacts: { ...data.contacts, email: e.target.value } })} 
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Adresă Fizică</label>
                  <input 
                    type="text" 
                    value={data.contacts.address} 
                    onChange={(e) => setData({ ...data, contacts: { ...data.contacts, address: e.target.value } })} 
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
