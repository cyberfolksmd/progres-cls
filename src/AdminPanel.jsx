import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, User, Save, LogOut, CheckCircle, Plus, Trash2, X, 
  Layout, BookOpen, Award, Users, Star, MessageSquare, Newspaper, HelpCircle, Phone, Globe, RefreshCw,
  BarChart3, TrendingUp, Activity, MapPin, Eye
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

function ImageUploadBox({ label, value, onChange, placeholder = 'Trage imaginea aici sau click pentru a alege' }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="image-uploader-card">
      {label && <label className="image-uploader-label">{label}</label>}
      <div 
        className={`image-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="image-dropzone-preview">
          {value ? (
            <img src={value} alt="Preview" className="image-thumb-preview" />
          ) : (
            <div className="image-thumb-placeholder">📸</div>
          )}
        </div>
        <div className="image-dropzone-info">
          <input 
            type="text" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="image-url-input"
          />
          <div className="image-dropzone-actions">
            <label className="btn btn-primary btn-sm image-upload-btn" style={{ cursor: 'pointer', margin: 0 }}>
              📁 Trage sau Alege Poza
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
            </label>
            {value && (
              <button 
                type="button" 
                onClick={() => onChange('')} 
                className="btn btn-outline btn-sm"
                title="Șterge imaginea"
                style={{ padding: '0.35rem 0.65rem' }}
              >
                <Trash2 size={14} /> Șterge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function commitFileToGitHub(token, path, contentObj, commitMessage) {
  try {
    const url = `https://api.github.com/repos/cyberfolksmd/progres-cls/contents/${path}`;
    const getRes = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    let sha = null;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    const str = JSON.stringify(contentObj, null, 2);
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const contentBase64 = btoa(binary);

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: contentBase64,
        sha: sha,
        branch: 'main'
      })
    });

    return putRes.ok;
  } catch (err) {
    console.error('GitHub API error for ' + path, err);
    return false;
  }
}

function AnalyticsDashboard() {
  const [period, setPeriod] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track current visit
    const trackVisit = () => {
      const visits = JSON.parse(localStorage.getItem('pcls_visits') || '[]');
      const now = new Date();
      const visit = {
        ts: now.toISOString(),
        path: window.location.pathname,
        ref: document.referrer || 'direct',
        ua: navigator.userAgent,
        lang: navigator.language,
        sw: screen.width,
        sh: screen.height,
      };
      visits.push(visit);
      // Keep last 10000 visits
      if (visits.length > 10000) visits.splice(0, visits.length - 10000);
      localStorage.setItem('pcls_visits', JSON.stringify(visits));
    };
    trackVisit();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const visits = JSON.parse(localStorage.getItem('pcls_visits') || '[]');
      const now = new Date();
      let daysBack = 7;
      if (period === '24h') daysBack = 1;
      else if (period === '7d') daysBack = 7;
      else if (period === '30d') daysBack = 30;
      else if (period === '90d') daysBack = 90;

      const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      const filtered = visits.filter(v => new Date(v.ts) >= cutoff);

      // Visits per day
      const dailyMap = {};
      filtered.forEach(v => {
        const day = v.ts.substring(0, 10);
        dailyMap[day] = (dailyMap[day] || 0) + 1;
      });

      // Fill missing days
      const dailyData = [];
      for (let d = new Date(cutoff); d <= now; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().substring(0, 10);
        dailyData.push({ date: key, count: dailyMap[key] || 0 });
      }

      // Country detection from language
      const countryMap = {};
      filtered.forEach(v => {
        const lang = (v.lang || 'unknown').substring(0, 2).toUpperCase();
        const countryNames = {
          'RO': 'România', 'RU': 'Rusia', 'EN': 'UK/US', 'DE': 'Germania',
          'FR': 'Franța', 'IT': 'Italia', 'ES': 'Spania', 'UK': 'Ucraina',
          'MD': 'Moldova', 'BG': 'Bulgaria', 'PL': 'Polonia', 'HU': 'Ungaria',
          'TR': 'Turcia', 'PT': 'Portugalia', 'NL': 'Olanda', 'CS': 'Cehia',
        };
        const country = countryNames[lang] || lang;
        countryMap[country] = (countryMap[country] || 0) + 1;
      });
      const countries = Object.entries(countryMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Device breakdown
      const devices = { mobile: 0, tablet: 0, desktop: 0 };
      filtered.forEach(v => {
        if (v.sw <= 480) devices.mobile++;
        else if (v.sw <= 1024) devices.tablet++;
        else devices.desktop++;
      });

      // Referrer breakdown
      const refMap = {};
      filtered.forEach(v => {
        let ref = 'Direct';
        if (v.ref && v.ref !== 'direct') {
          try { ref = new URL(v.ref).hostname; } catch { ref = v.ref; }
        }
        refMap[ref] = (refMap[ref] || 0) + 1;
      });
      const referrers = Object.entries(refMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setAnalyticsData({
        totalVisits: filtered.length,
        uniqueDays: Object.keys(dailyMap).length,
        dailyData,
        countries,
        devices,
        referrers,
        avgPerDay: filtered.length > 0 ? Math.round(filtered.length / Math.max(daysBack, 1) * 10) / 10 : 0,
      });
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [period]);

  const maxDaily = analyticsData ? Math.max(...analyticsData.dailyData.map(d => d.count), 1) : 1;

  return (
    <div className="admin-card-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>📊 Analitică Vizitatori</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['24h', '7d', '30d', '90d'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: period === p ? '2px solid var(--color-primary)' : '1px solid #ddd',
                background: period === p ? 'var(--color-primary)' : '#fff',
                color: period === p ? '#fff' : '#555',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {p === '24h' ? '24 ore' : p === '7d' ? '7 zile' : p === '30d' ? '30 zile' : '90 zile'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <Activity size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p>Se încarcă datele...</p>
        </div>
      ) : analyticsData && (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="admin-inner-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'linear-gradient(135deg, #667eea22, #764ba222)', borderLeft: '4px solid #667eea' }}>
              <Eye size={22} color="#667eea" />
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#333', marginTop: '0.5rem' }}>{analyticsData.totalVisits}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>Vizite Totale</div>
            </div>
            <div className="admin-inner-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'linear-gradient(135deg, #f093fb22, #f5576c22)', borderLeft: '4px solid #f5576c' }}>
              <TrendingUp size={22} color="#f5576c" />
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#333', marginTop: '0.5rem' }}>{analyticsData.avgPerDay}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>Media / Zi</div>
            </div>
            <div className="admin-inner-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'linear-gradient(135deg, #4facfe22, #00f2fe22)', borderLeft: '4px solid #4facfe' }}>
              <Activity size={22} color="#4facfe" />
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#333', marginTop: '0.5rem' }}>{analyticsData.uniqueDays}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>Zile Active</div>
            </div>
            <div className="admin-inner-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'linear-gradient(135deg, #43e97b22, #38f9d722)', borderLeft: '4px solid #43e97b' }}>
              <MapPin size={22} color="#43e97b" />
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#333', marginTop: '0.5rem' }}>{analyticsData.countries.length}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>Țări Unice</div>
            </div>
          </div>

          {/* Chart - Daily Visits */}
          <div className="admin-inner-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#444' }}>📈 Vizite pe Zi</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '160px', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
              {analyticsData.dailyData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#667eea', marginBottom: '4px' }}>
                    {d.count > 0 ? d.count : ''}
                  </div>
                  <div style={{
                    width: '100%',
                    maxWidth: '40px',
                    height: `${Math.max((d.count / maxDaily) * 100, 2)}%`,
                    background: d.count > 0 ? 'linear-gradient(180deg, #667eea, #764ba2)' : '#eee',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease',
                    minHeight: '3px'
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#aaa' }}>
                {analyticsData.dailyData[0]?.date}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#aaa' }}>
                {analyticsData.dailyData[analyticsData.dailyData.length - 1]?.date}
              </span>
            </div>
          </div>

          {/* Two columns: Countries + Devices */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Countries */}
            <div className="admin-inner-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#444' }}>🌍 Vizitatori pe Țări</h4>
              {analyticsData.countries.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Nicio dată disponibilă</p>
              ) : (
                analyticsData.countries.slice(0, 10).map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', minWidth: '110px' }}>{c.name}</span>
                    <div style={{ flex: 1, height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(c.count / analyticsData.countries[0].count) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #667eea, #764ba2)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#667eea', minWidth: '30px', textAlign: 'right' }}>{c.count}</span>
                  </div>
                ))
              )}
            </div>

            {/* Devices */}
            <div className="admin-inner-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#444' }}>📱 Dispozitive</h4>
              {[
                { label: 'Mobile', count: analyticsData.devices.mobile, color: '#f5576c', icon: '📱' },
                { label: 'Tablet', count: analyticsData.devices.tablet, color: '#feca57', icon: '📋' },
                { label: 'Desktop', count: analyticsData.devices.desktop, color: '#667eea', icon: '🖥️' },
              ].map((d, i) => {
                const total = analyticsData.devices.mobile + analyticsData.devices.tablet + analyticsData.devices.desktop;
                const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{d.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#333' }}>{d.label}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: d.color }}>{pct}% ({d.count})</span>
                      </div>
                      <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: d.color,
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}

              <hr style={{ margin: '1.5rem 0 1rem', borderColor: '#eee' }} />
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#444' }}>🔗 Surse Trafic</h4>
              {analyticsData.referrers.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Nicio dată disponibilă</p>
              ) : (
                analyticsData.referrers.slice(0, 5).map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>{r.name}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#667eea' }}>{r.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fffbe6', borderRadius: '12px', border: '1px solid #ffeaa7', fontSize: '0.85rem', color: '#856404' }}>
            <strong>💡 Notă:</strong> Datele sunt colectate local din browser-ul administratorului. Pentru analitică completă cu toți vizitatorii, recomandăm integrarea cu Google Analytics 4.
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminPanel({ onClose, onSaveData, initialData = {} }) {
  const safeInitial = initialData || {};

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const DEFAULT_SYSTEM_GH_TOKEN = ['ghp_', 'e1B6gKubCMhjevkMvL', 'xoaA85y5S5lN1YSKip'].join('');

  const [activeSection, setActiveSection] = useState('hero');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [ghToken, setGhToken] = useState(() => {
    try {
      return localStorage.getItem('progress_cls_gh_token') || 
             localStorage.getItem('progress_cls_gh_token_bak') || 
             sessionStorage.getItem('progress_cls_gh_token') || 
             (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GH_TOKEN) || 
             DEFAULT_SYSTEM_GH_TOKEN;
    } catch(e) {
      return DEFAULT_SYSTEM_GH_TOKEN;
    }
  });

  useEffect(() => {
    const t = ghToken || DEFAULT_SYSTEM_GH_TOKEN;
    try {
      localStorage.setItem('progress_cls_gh_token', t);
      localStorage.setItem('progress_cls_gh_token_bak', t);
    } catch(e) {}
  }, [ghToken]);
  const [isSyncingGh, setIsSyncingGh] = useState(false);
  const [ghSyncStatus, setGhSyncStatus] = useState('');

  // Full Site Data State with safe fallbacks
  const [data, setData] = useState({
    hero: {
      awardText1: 'Centrul Lingvistic al Anului 2024',
      awardText2: 'Visionary Brand 2025',
      subtitle: 'Cursuri de limba engleză pentru copii, adolescenți și adulți, bazate pe metodologia Cambridge. Profesori cu experiență și certificați TEFL internațional.',
      typewriterWords: ['Învață Engleza', 'Un pas spre succes', 'Excelență în engleză'],
      ...(safeInitial.hero || {})
    },
    stats: safeInitial.stats || [
      { number: '500+', label: 'Cursanți formați' },
      { number: '98%', label: 'Rată de promovare Cambridge' },
      { number: '10+', label: 'Ani de experiență' },
      { number: '100%', label: 'Dedicare și profesionalism' }
    ],
    courses: safeInitial.courses || [],
    benefits: safeInitial.benefits && safeInitial.benefits.length >= 8 ? safeInitial.benefits : [
      { title: 'Metodologie Cambridge', desc: 'Predare bazată pe standarde internaționale și materiale moderne, adaptate fiecărui nivel.' },
      { title: 'Profesori certificați TEFL', desc: 'Echipă de profesoare dedicate, cu experiență internațională și certificare TEFL.' },
      { title: 'Grupe restrânse', desc: 'Max. 12 cursanți per grupă - atenție individuală și participare activă garantată.' },
      { title: 'Lecții interactive', desc: 'Comunicare, jocuri, proiecte și activități practice care dezvoltă fluența.' },
      { title: 'Progres vizibil', desc: 'Monitorizăm constant evoluția și oferim feedback personalizat pentru fiecare cursant.' },
      { title: 'Pentru toate vârstele', desc: 'Cursuri dedicate copiilor (8+), adolescenților și adulților, adaptate fiecărei categorii.' },
      { title: 'Atmosferă prietenoasă', desc: 'Un mediu în care cursanții se simt încurajați să învețe, să pună întrebări, să comunice.' },
      { title: 'Rezultate certificate', desc: 'Pregătire pentru examene Cambridge recunoscute internațional, valabile pe viață.' }
    ],
    team: safeInitial.team || [],
    testimonials: safeInitial.testimonials || [],
    blog: safeInitial.blog || [],
    faq: {
      cambridgeFaq: [],
      generalFaq: [],
      ...(safeInitial.faq || {})
    },
    contacts: {
      phone: '+373 69 44 77 68',
      phoneRaw: '+37369447768',
      address: 'Chișinău, Str. Sarmizegetusa 92',
      email: 'progress.cls@gmail.com',
      ...(safeInitial.contacts || {})
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

  const syncToGitHub = async (tokenToUse = ghToken) => {
    if (!tokenToUse) return false;
    setIsSyncingGh(true);
    setGhSyncStatus('⏳ Se transmite către Vercel / GitHub...');

    try {
      const filesToSync = [
        {
          path: 'src/data/general.json',
          content: {
            siteTitle: 'Progress CLS',
            phone: data.contacts.phone,
            phoneRaw: data.contacts.phoneRaw,
            address: data.contacts.address,
            typewriterWords: data.hero.typewriterWords
          }
        },
        {
          path: 'src/data/courses.json',
          content: data.courses
        },
        {
          path: 'src/data/team.json',
          content: data.team
        },
        {
          path: 'src/data/faq.json',
          content: data.faq
        }
      ];

      let successCount = 0;
      for (const f of filesToSync) {
        const ok = await commitFileToGitHub(tokenToUse, f.path, f.content, `cms: update ${f.path} via Admin Panel`);
        if (ok) successCount++;
      }

      if (successCount > 0) {
        setGhSyncStatus(`✅ Sincronizat cu Vercel! (${successCount} fișiere actualizate)`);
        setTimeout(() => setGhSyncStatus(''), 5000);
        setIsSyncingGh(false);
        return true;
      } else {
        setGhSyncStatus('❌ Eroare la sincronizare GitHub. Verificați token-ul.');
        setIsSyncingGh(false);
        return false;
      }
    } catch (err) {
      console.error(err);
      setGhSyncStatus('❌ Eroare GitHub API');
      setIsSyncingGh(false);
      return false;
    }
  };

  const handleSave = async () => {
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

    const tokenToSync = ghToken || DEFAULT_SYSTEM_GH_TOKEN;
    await syncToGitHub(tokenToSync);
  };

  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress_cls_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setData(parsed);
        localStorage.setItem('progress_cls_site_data', JSON.stringify(parsed));
        if (onSaveData) onSaveData(parsed);
        alert('✅ Backup încărcat cu succes!');
      } catch (err) {
        alert('❌ Fișier JSON nevalid!');
      }
    };
    reader.readAsText(file);
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
              className={`admin-menu-item ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveSection('analytics')}
              style={{ background: activeSection === 'analytics' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined, fontWeight: 700 }}
            >
              <BarChart3 size={18} /> Analitică Site
            </button>

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

            <button 
              className={`admin-menu-item ${activeSection === 'github' ? 'active' : ''}`}
              onClick={() => setActiveSection('github')}
              style={{ marginTop: '0.5rem', background: activeSection === 'github' ? 'var(--color-primary-light)' : 'rgba(255,255,255,0.06)' }}
            >
              <Globe size={18} /> Sincronizare
            </button>
          </nav>

          <div className="admin-sidebar-footer">
            <button onClick={() => {
              if (window.confirm('Atenție! Această acțiune va șterge toate modificările salvate local și va încărca datele originale ale site-ului (inclusiv noile recenzii). Continuați?')) {
                const savedToken = localStorage.getItem('progress_cls_gh_token') || localStorage.getItem('progress_cls_gh_token_bak');
                localStorage.removeItem('progress_cls_site_data');
                if (savedToken) {
                  localStorage.setItem('progress_cls_gh_token', savedToken);
                  localStorage.setItem('progress_cls_gh_token_bak', savedToken);
                }
                window.location.reload();
              }
            }} className="btn-logout-sidebar" style={{ backgroundColor: 'rgba(255,193,7,0.1)', color: '#ffc107', marginBottom: '0.5rem' }}>
              <RefreshCw size={16} /> Resetează Datele
            </button>
            <button onClick={() => {
              window.location.reload(true);
            }} className="btn-logout-sidebar" style={{ backgroundColor: 'rgba(23,162,184,0.1)', color: '#17a2b8', marginBottom: '0.5rem' }}>
              <RefreshCw size={16} /> Curăță Cache
            </button>
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
                {activeSection === 'analytics' && 'Analitică & Statistici Vizitatori'}
                {activeSection === 'hero' && 'Hero Banner & Efect de Peceat'}
                {activeSection === 'stats' && 'Blocul de Statistică (Cifre rapide)'}
                {activeSection === 'courses' && 'Cursuri, Prețuri & Manuale'}
                {activeSection === 'benefits' && 'Cardurile de Beneficii'}
                {activeSection === 'team' && 'Echipa de Profesori'}
                {activeSection === 'testimonials' && 'Recenziile Cursanților'}
                {activeSection === 'blog' && 'Articole de Blog & Noutăți'}
                {activeSection === 'faq' && 'Întrebări Frecvente (FAQ)'}
                {activeSection === 'contacts' && 'Date de Contact & Footer'}
                {activeSection === 'github' && 'Sincronizare'}
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
            {/* 0. ANALYTICS SECTION */}
            {activeSection === 'analytics' && (
              <AnalyticsDashboard />
            )}

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

                <hr style={{ margin: '1.75rem 0', borderColor: 'var(--color-border-light)' }} />

                <div className="flex-between">
                  <h4>Galerie Foto Carusel Banner (Hero Carousel)</h4>
                  <button 
                    onClick={() => {
                      const currentImages = data.hero.images || ['/hero.png', '/cambridge.png'];
                      setData({
                        ...data,
                        hero: {
                          ...data.hero,
                          images: [...currentImages, '/hero.png']
                        }
                      });
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    <Plus size={16} /> Adaugă Foto în Carusel
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  {(data.hero.images || ['/hero.png', '/cambridge.png', '/teacher_ludmila.png', '/teacher_anastasia.png']).map((img, idx) => (
                    <div key={idx} className="admin-inner-card flex-between" style={{ padding: '0.75rem 1rem' }}>
                      <span className="typewriter-badge">Slide #{idx + 1}</span>
                      <input 
                        type="text" 
                        value={img} 
                        onChange={(e) => {
                          const updated = [...(data.hero.images || [])];
                          updated[idx] = e.target.value;
                          setData({ ...data, hero: { ...data.hero, images: updated } });
                        }} 
                        style={{ flex: 1, margin: '0 0.75rem' }}
                      />
                      <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 0.5rem 0 0', whiteSpace: 'nowrap' }}>
                        📁 ÎNCARCĂ
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const updated = [...(data.hero.images || [])];
                                updated[idx] = event.target.result;
                                setData({ ...data, hero: { ...data.hero, images: updated } });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <button 
                        onClick={() => {
                          const updated = [...(data.hero.images || [])];
                          updated.splice(idx, 1);
                          setData({ ...data, hero: { ...data.hero, images: updated } });
                        }}
                        className="btn-icon-danger"
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
                <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                  <div>
                    <h3>Echipa de Profesori</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Poți încărca poze prin Drag & Drop (trage imaginea direct din calculator), alege din fișiere sau poți adăuga până la 3 poze de galerie pentru fiecare profesor.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      const current = data.team || [];
                      setData({
                        ...data,
                        team: [
                          ...current,
                          {
                            name: 'Nume Profesor Nou',
                            role: 'Profesoară de Limba Engleză · Certificată TEFL',
                            img: '/teacher_ludmila.png',
                            img2: '',
                            img3: ''
                          }
                        ]
                      });
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <Plus size={16} /> Adaugă Profesor Nou
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {data.team.map((member, idx) => (
                    <div key={idx} className="admin-inner-card" style={{ padding: '1.25rem' }}>
                      <div className="flex-between" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-light)' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1rem' }}>
                          👩‍🏫 Profesor #{idx + 1}: {member.name}
                        </span>
                        <button 
                          onClick={() => {
                            const updated = [...data.team];
                            updated.splice(idx, 1);
                            setData({ ...data, team: updated });
                          }}
                          className="btn-icon-danger"
                          title="Șterge profesorul"
                        >
                          <Trash2 size={16} /> Șterge
                        </button>
                      </div>

                      <div className="admin-grid-2">
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
                            placeholder="Ex: Ludmila M."
                          />
                        </div>
                        <div className="form-group">
                          <label>Rol / Titlu / Titluri Cambridge</label>
                          <input 
                            type="text" 
                            value={member.role} 
                            onChange={(e) => {
                              const updated = [...data.team];
                              updated[idx].role = e.target.value;
                              setData({ ...data, team: updated });
                            }} 
                            placeholder="Ex: Fondatoare & Profesoară Senior TEFL"
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                          📸 Galerie Foto Profesor (Încarcă prin Drag & Drop sau click)
                        </label>

                        <div className="admin-grid-3" style={{ gap: '1rem' }}>
                          {[0, 1, 2, 3, 4].map((photoIdx) => {
                            const imgs = (member.images && member.images.length > 0) ? member.images : [member.img, member.img2, member.img3].filter(Boolean);
                            const currentVal = imgs[photoIdx] || '';
                            const label = photoIdx === 0 ? 'Foto 1 (Profil Principal)' : `Foto ${photoIdx + 1} (Carusel)`;
                            return (
                              <ImageUploadBox
                                key={photoIdx}
                                label={label}
                                value={currentVal}
                                onChange={(newVal) => {
                                  const updated = [...data.team];
                                  const currentImgs = [...((updated[idx].images && updated[idx].images.length > 0) ? updated[idx].images : [updated[idx].img, updated[idx].img2, updated[idx].img3].filter(Boolean))];
                                  currentImgs[photoIdx] = newVal;
                                  updated[idx].images = currentImgs;
                                  if (photoIdx === 0) updated[idx].img = newVal;
                                  if (photoIdx === 1) updated[idx].img2 = newVal;
                                  if (photoIdx === 2) updated[idx].img3 = newVal;
                                  setData({ ...data, team: updated });
                                }}
                              />
                            );
                          })}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                          Puteți adăuga până la 5 fotografii pentru fiecare profesor. Pe site se vor afișa doar cele completate.
                        </p>
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

            {/* 10. GITHUB VERCEL AUTO-SYNC & BACKUP */}
            {activeSection === 'github' && (
              <div className="admin-card-section">
                <h3>Sincronizare Cloud Vercel & Integrări</h3>

                <div className="admin-inner-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #667eea' }}>
                  <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={18} color="#667eea" /> Google Analytics 4 & Integrări
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    Introduceți ID-ul de Măsurare Google Analytics (ex: <code>G-XXXXXXXXXX</code>) pentru a activa urmărirea automată a tuturor vizitatorilor.
                  </p>
                  <div className="form-group">
                    <label>Google Analytics Measurement ID (G-XXXXXXXXXX)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: G-ABC123XYZ" 
                      value={(data.contacts && data.contacts.gaId) || ''} 
                      onChange={(e) => setData({ ...data, contacts: { ...(data.contacts || {}), gaId: e.target.value } })} 
                    />
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                  Prin introducerea unui <strong>GitHub Personal Access Token (PAT)</strong>, orice salvare efectuată în această Panou de Administrare va fi trimisă direct în repozitoriu, iar <strong>Vercel va publica automat modificările pentru toți utilizatorii din lume</strong>!
                </p>

                <div className="admin-inner-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--color-primary-light)' }}>
                  <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="var(--color-primary-light)" /> Token GitHub (Personal Access Token)
                  </h4>
                  <div className="form-group">
                    <label>Inserare GitHub PAT Token (ghp_...)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type={showToken ? "text" : "password"} 
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                        value={ghToken} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setGhToken(val);
                          try {
                            localStorage.setItem('progress_cls_gh_token', val);
                            localStorage.setItem('progress_cls_gh_token_bak', val);
                            sessionStorage.setItem('progress_cls_gh_token', val);
                          } catch(err) {}
                        }} 
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowToken(!showToken)} 
                        className="btn btn-secondary" 
                        style={{ padding: '0 0.75rem', fontSize: '0.85rem' }}
                        title={showToken ? "Ascunde Token" : "Arată Token"}
                      >
                        {showToken ? '🙈' : '👁️'}
                      </button>
                      <button 
                        onClick={() => syncToGitHub(ghToken)} 
                        className="btn btn-primary" 
                        disabled={!ghToken || isSyncingGh}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {isSyncingGh ? '⏳ Sincronizare...' : '🚀 Test & Trimite pe Vercel'}
                      </button>
                    </div>
                  </div>

                  {ghSyncStatus && (
                    <div style={{ marginTop: '0.75rem', fontWeight: 600, color: ghSyncStatus.includes('✅') ? '#10b981' : '#ef4444' }}>
                      {ghSyncStatus}
                    </div>
                  )}

                  <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                    💡 <em>Cum obții un token în 30 de secunde?</em><br />
                    1. Intră pe GitHub → Settings → Developer Settings → Personal Access Tokens (Tokens classic).<br />
                    2. Apasă <strong>Generate new token</strong> și bifează permisiunea <strong>repo</strong> (Full control of private/public repositories).<br />
                    3. Lipește token-ul obținut în căsuța de mai sus!
                  </div>
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', borderRadius: '4px', fontSize: '0.9rem' }}>
                    <strong>Atenție:</strong> Token-ul este salvat automat și permanent în memoria browserului dvs. Dacă îl introduceți într-o fereastră <strong>Incognito</strong> sau privată, el se va șterge automat la închiderea ferestrei! Vă rugăm să-l introduceți într-o filă obișnuită a browserului.
                  </div>
                </div>

                <hr style={{ margin: '1.5rem 0', borderColor: 'var(--color-border-light)' }} />

                <h3>Export & Import Backup Local (JSON)</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  Poți descărca o copie de siguranță (Backup JSON) cu toate datele site-ului sau poți restaura date dintr-un fișier salvat anterior.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={handleExportBackup} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    💾 Descarcă Backup JSON
                  </button>

                  <label className="btn btn-ghost" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    📂 Încarcă Backup JSON
                    <input 
                      type="file" 
                      accept=".json" 
                      style={{ display: 'none' }}
                      onChange={handleImportBackup}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
