import React, { useState, useEffect } from 'react';
import {
  BookOpen, Users, Award, Star, CheckCircle, CheckCircle2, GraduationCap,
  MapPin, Phone, Mail, ChevronDown, ChevronLeft, ChevronRight, Clock, Calendar, Zap,
  Globe, TrendingUp, Heart, ShieldCheck, Menu, X,
  ArrowRight, BadgeCheck, Trophy, CreditCard, Tag
} from 'lucide-react';
import { useFadeIn } from './useFadeIn';
import './index.css';
import AdminPanel from './AdminPanel';

import generalData from './data/general.json';
import coursesData from './data/courses.json';
import teamData from './data/team.json';
import faqData from './data/faq.json';

// ── Data (Powered by Decap CMS / JSON) ───────────────────
const COURSES = coursesData.map(c => ({
  ...c,
  desc: c.desc || c.text || '',
  details: c.details || [
    { icon: <Calendar size={18} />, label: 'Durată', value: '9 luni (septembrie-mai), 2 ori/săptămână' },
    { icon: <Clock size={18} />, label: 'Lecții', value: '72 lecții · 75 minute fiecare' },
    { icon: <Users size={18} />, label: 'Grup', value: 'Max. 12 copii per grupă' }
  ]
}));

const BENEFITS = [
  { icon: <BookOpen size={28} />, title: 'Metodologie Cambridge', desc: 'Predare bazată pe standarde internaționale și materiale moderne, adaptate fiecărui nivel.' },
  { icon: <Award size={28} />, title: 'Profesori certificați TEFL', desc: 'Echipă de profesoare dedicate, cu experiență internațională și certificare TEFL.' },
  { icon: <Users size={28} />, title: 'Grupe restrânse', desc: 'Max. 12 cursanți per grupă - atenție individuală și participare activă garantată.' },
  { icon: <Zap size={28} />, title: 'Lecții interactive', desc: 'Comunicare, jocuri, proiecte și activități practice care dezvoltă fluența.' },
  { icon: <TrendingUp size={28} />, title: 'Progres vizibil', desc: 'Monitorizăm constant evoluția și oferim feedback personalizat pentru fiecare cursant.' },
  { icon: <Globe size={28} />, title: 'Pentru toate vârstele', desc: 'Cursuri dedicate copiilor (8+), adolescenților și adulților, adaptate fiecărei categorii.' },
  { icon: <Heart size={28} />, title: 'Atmosferă prietenoasă', desc: 'Un mediu în care cursanții se simt încurajați să învețe, să pună întrebări, să comunice.' },
  { icon: <ShieldCheck size={28} />, title: 'Rezultate certificate', desc: 'Pregătire pentru examene Cambridge recunoscute internațional, valabile pe viață.' },
];

const TEAM = teamData;

const TESTIMONIALS = [
  { text: 'Fiica mea a avansat de la A1 la B1 în 18 luni! Profesoarele sunt extrem de dedicate și răbdătoare.', author: 'Maria D.', course: 'Engleza pentru Copii', rating: 5 },
  { text: 'Am promovat examenul FCE cu nota B! Mulțumesc echipei Progress CLS pentru pregătirea excelentă.', author: 'Andrei C.', course: 'Pregătire Cambridge B2', rating: 5 },
  { text: 'Atmosfera prietenoasă și lecțiile interactive m-au ajutat să depășesc teama de a vorbi engleză.', author: 'Elena M.', course: 'Engleza pentru Adulți', rating: 5 },
];

const CAMBRIDGE_FAQ = faqData.cambridgeFaq;
const GENERAL_FAQ = faqData.generalFaq;
const TYPEWRITER_WORDS = generalData.typewriterWords || ['Învață Engleza', 'Un pas spre succes', 'Excelență în engleză'];

// ── Components ────────────────────────────────────────────

function Typewriter({ words, speed = 100, delay = 2200 }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0);
      return;
    }

    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => {
        setReverse(true);
      }, delay);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, speed, delay]);

  return (
    <span className="typewriter-box">
      <span>{words[index].substring(0, subIndex)}</span>
      <span className="typewriter-cursor">|</span>
    </span>
  );
}

function HeroCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideList = images && images.length > 0 ? images : ['/hero.webp', '/cambridge.webp'];

  useEffect(() => {
    if (isPaused || slideList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, slideList.length]);

  return (
    <div 
      className="hero-carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-carousel-card">
        {slideList.map((imgUrl, idx) => (
          <img 
            key={idx} 
            src={imgUrl} 
            alt={`Progress CLS Slide ${idx + 1}`} 
            className={`hero-image hero-carousel-img ${idx === currentIndex ? 'active' : ''}`} 
          />
        ))}
      </div>

      {slideList.length > 1 && (
        <div className="hero-carousel-dots-bottom">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              className={`hero-carousel-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Vezi slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Navbar({ scrolled, onOpenModal, onOpenMapModal }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header-wrapper">
      {/* ── TOP BAR (Dark navy blue) ─────────────── */}
      <div className="top-bar">
        <div className="container top-bar-container">
          {/* Left: Social networks */}
          <div className="top-bar-socials">
            <a href="https://www.facebook.com/p/PROGRESS-CLS-100064022590521/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/progress_cls/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://t.me/+37369447768" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="social-icon-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .54-1.43.53-.47-.01-1.37-.26-2.04-.48-.82-.27-1.47-.42-1.42-.88.03-.24.36-.49.99-.75 3.88-1.69 6.47-2.8 7.78-3.34 3.7-1.54 4.47-1.81 4.97-1.82.11 0 .36.03.52.16.14.11.18.26.2.37.02.11.04.37.02.62z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@progress_cls" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-icon-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.84V7.63a6.34 6.34 0 0 0-5.06 2.05A6.34 6.34 0 0 0 3 14.15a6.34 6.34 0 0 0 6.35 6.35 6.34 6.34 0 0 0 6.35-6.35V9.4a8.28 8.28 0 0 0 4.89 1.58V7.53a4.83 4.83 0 0 1-1-.84z"/>
              </svg>
            </a>
          </div>

          {/* Right: Phone, Pin & Contact Button */}
          <div className="top-bar-contacts">
            <a href="tel:+37369447768" className="top-bar-link">
              <Phone size={14} />
              <span>Sună acum</span>
            </a>
            <button onClick={onOpenMapModal} className="top-bar-link top-bar-pin-btn">
              <MapPin size={14} />
              <span>Adresă</span>
            </button>
            <button onClick={onOpenModal} className="top-bar-cta-btn">
              Contactează-ne!
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR (White bar below top bar) ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <a href="#acasa" className="logo">
            <img src="/logo2.png" alt="Progress CLS" className="logo-img" style={{ height: '42px' }} />
          </a>

          {/* Desktop Navigation Links */}
          <div className="nav-links-desktop">
            <a href="#acasa">Acasă</a>
            <a href="#cursuri">Cursuri</a>
            <a href="#beneficii">Beneficii</a>
            <a href="#echipa">Echipa</a>
            <a href="#recenzii">Recenzii</a>
            <a href="#blog">Blog</a>
            <a href="#faq">FAQ</a>
            <a href="#contacte">Contacte</a>
          </div>

          <div className="nav-right-desktop">
            <button onClick={onOpenModal} className="btn btn-primary btn-sm">
              Înscrie-te acum
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button className="burger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Meniu">
            {menuOpen ? <X size={26} color="var(--color-primary-dark)" /> : <Menu size={26} color="var(--color-primary-dark)" />}
          </button>
        </div>

        {/* Dropdown Menu Panel (Mobile Only) */}
        {menuOpen && (
          <div className="navbar-dropdown">
            <div className="container dropdown-container">
              <a href="#acasa" onClick={() => setMenuOpen(false)}>Acasă</a>
              <a href="#cursuri" onClick={() => setMenuOpen(false)}>Cursuri</a>
              <a href="#beneficii" onClick={() => setMenuOpen(false)}>Beneficii</a>
              <a href="#echipa" onClick={() => setMenuOpen(false)}>Echipa</a>
              <a href="#recenzii" onClick={() => setMenuOpen(false)}>Recenzii</a>
              <a href="#blog" onClick={() => setMenuOpen(false)}>Blog</a>
              <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
              <a href="#contacte" onClick={() => setMenuOpen(false)}>Contacte</a>
              <button onClick={() => { setMenuOpen(false); onOpenModal(); }} className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                Înscrie-te acum
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function TeacherCard({ member, index }) {
  const rawList = (member.images && member.images.length > 0)
    ? member.images
    : [member.img, member.img2, member.img3].filter(Boolean);

  const images = rawList.length > 0 ? rawList : (member.img ? [member.img] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    let intervalId = null;
    // Round-robin sequence: 1 teacher photo changes every 3 seconds
    const stepDuration = 3000;
    const initialDelay = (index % 6) * stepDuration;
    const loopPeriod = 6 * stepDuration; // 18000ms

    const startTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

      intervalId = setInterval(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, loopPeriod);
    }, initialDelay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [images.length, index, isHovered]);

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={`team-member spatial-reveal delay-${(index % 6) + 1}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="member-photo-wrap">
        <img
          src={images[currentIndex] || member.img}
          alt={member.name}
          className="member-photo"
          loading="lazy"
        />
        <div className="member-badge">
          <BadgeCheck size={13} color="white" />
          <span>TEFL</span>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="teacher-carousel-nav teacher-carousel-prev"
              onClick={prevSlide}
              aria-label="Previous photo"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              className="teacher-carousel-nav teacher-carousel-next"
              onClick={nextSlide}
              aria-label="Next photo"
            >
              <ChevronRight size={16} />
            </button>

            <div className="teacher-carousel-dots">
              {images.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  className={`teacher-dot ${currentIndex === dotIdx ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(dotIdx);
                  }}
                  aria-label={`Go to photo ${dotIdx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <h3 className="member-name">{member.name}</h3>
      <p className="member-role">{member.role}</p>
    </div>
  );
}

function CourseBlock({ course, onOpenModal, onOpenDetailsModal }) {
  const subLevels = course.subLevels || [];
  const [selectedSubLevelIndex, setSelectedSubLevelIndex] = useState(0);
  const currentSub = subLevels[selectedSubLevelIndex] || subLevels[0] || {};
  const isIntensive = (currentSub.id || '').includes('intensive') || (currentSub.label || '').toLowerCase().includes('intensiv');

  const rawName = currentSub.name || currentSub.label || '';
  const cleanSubName = rawName.replace(/\s*\([A-Z0-9+]+\)\s*$/i, '');
  const levelPhotos = {
    'a1.1': '/bg_kids.webp',
    'a1.2': '/bg_letters.webp',
    'a2.1': '/bg_flag.webp',
    'a1_teen': '/bg_teens.webp',
    'a2_teen': '/bg_desk.webp',
    'b1_teen': '/bg_books.webp',
    'b1plus_teen': '/bg_flag.webp',
    'b2_teen': '/bg_cambridge.webp',
    'c1_teen': '/hero.webp',
    'a1_adult': '/bg_adults.webp',
    'a2_adult': '/bg_desk.webp',
    'b1_adult': '/bg_letters.webp',
    'b1plus_adult': '/bg_books.webp',
    'b2_adult': '/bg_cambridge.webp',
    'adults_a1': '/bg_adults.webp',
    'adults_a2': '/bg_desk.webp',
    'adults_b1': '/bg_letters.webp',
    'adults_b1plus': '/bg_books.webp',
    'adults_b2': '/bg_cambridge.webp',
    'fce_intensive': '/bg_cambridge.webp',
    'fce_extensive': '/bg_books.webp',
    'cae_intensive': '/cambridge.webp',
    'cae_extensive': '/hero.webp',
  };

  const levelBgPhoto = currentSub.img || levelPhotos[currentSub.id] || course.img || '/bg_kids.webp';
  const thumbImg = levelBgPhoto;

  return (
    <div id={course.id} className="course-block-card spatial-reveal">
      {/* Course Cover Banner Image (like Fantastic English) */}
      {course.img && (
        <div className="course-cover-wrap">
          <img src={course.img} alt={course.title} className="course-cover-img" />
        </div>
      )}

      <div className="course-block-header">
        <div className="course-header-top">
          <span className="course-block-badge">{course.label}</span>
          {course.age && <span className="course-age-badge">Vârstă: {course.age}</span>}
        </div>
        <h3 className="course-block-title">{course.title}</h3>
        <p className="course-block-desc">{course.desc}</p>
        {course.series && (
          <div className="course-series-tag">
            📚 Manuale: <strong>{course.series}</strong>
          </div>
        )}
      </div>

      {/* Sub-level Switcher Buttons & Level Detail Summary in ONE card */}
      {subLevels.length > 0 && (
        <div className="sublevel-switcher-bar" style={{ '--card-bg-img': `url('${levelBgPhoto}')` }}>
          <span className="sublevel-switcher-title">Alege Nivelul:</span>
          <div className="sublevel-buttons-wrap">
            {subLevels.map((lvl, idx) => (
              <button
                key={lvl.id || idx}
                type="button"
                className={`sublevel-btn ${selectedSubLevelIndex === idx ? 'active' : ''}`}
                onClick={() => setSelectedSubLevelIndex(idx)}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {currentSub && (
            <div className="mobile-active-level-summary">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span className="level-badge-pill">{currentSub.label}</span>
                <span className="mobile-level-name">{cleanSubName}</span>
              </div>
              {currentSub.duration && <div className="mobile-level-duration">· {currentSub.duration}</div>}
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Left Details & Right Pricing */}
      <div className="course-detail-grid">
        {/* Left: Active Level Info */}
        <div className="course-info-card slide-in-left">
          <div className="selected-level-header">
            <span className="level-badge-pill">{currentSub.label}</span>
            <h4 className="selected-level-name">{cleanSubName}</h4>
          </div>

          {/* Level Info Thumbnail Photo to fill empty space on Desktop */}
          <div className="level-info-thumbnail-wrap">
            <img 
              src={thumbImg} 
              alt={`${cleanSubName} - Progress CLS`} 
              className="level-info-thumbnail-img" 
            />
            <span className="level-info-thumbnail-badge">
              <CheckCircle size={14} color="#ffffff" /> Lecții Interactive
            </span>
          </div>

          <div className="course-detail-list">
            <div className="course-detail-item">
              <div className="detail-icon"><Calendar size={18} /></div>
              <div>
                <span className="detail-label">Durată</span>
                <span className="detail-value">{currentSub.duration}</span>
              </div>
            </div>

            {currentSub.schedule && (
              <div className="course-detail-item">
                <div className="detail-icon"><Clock size={18} /></div>
                <div>
                  <span className="detail-label">Orar / Ritm</span>
                  <span className="detail-value">{currentSub.schedule}</span>
                </div>
              </div>
            )}

            <div className="course-detail-item">
              <div className="detail-icon"><Zap size={18} /></div>
              <div>
                <span className="detail-label">Număr lecții</span>
                <span className="detail-value">{currentSub.lessons}</span>
              </div>
            </div>

            <div className="course-detail-item">
              <div className="detail-icon"><Users size={18} /></div>
              <div>
                <span className="detail-label">Locuri disponibile</span>
                <span className="detail-value">{currentSub.group}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pricing Card */}
        <div className="price-card slide-in-right delay-2">
          <span className="price-tag">Preț Curs</span>
          <div className="price-amount">
            {currentSub.priceTotal} <span style={{ fontSize: '1rem', fontWeight: 500 }}>lei</span>
          </div>
          <div className="price-period">
            {currentSub.priceMonthly} lei / lunar ({currentSub.priceMonthlyCount || '8 lecții'})
          </div>

          <div className="price-divider" />

          <div className="price-features">
            <div className="price-feature"><CheckCircle size={16} color="#4ade80" /> {currentSub.group}</div>
            <div className="price-feature"><CheckCircle size={16} color="#4ade80" /> Set manuale: +{currentSub.manuals} lei</div>
            <div className="price-feature"><CheckCircle size={16} color="#4ade80" /> Profesori certificați TEFL</div>
            <div className="price-feature"><CheckCircle size={16} color="#4ade80" /> Feedback individual constant</div>
          </div>

          {currentSub.discounts && currentSub.discounts.length > 0 && (
            <div className="discounts">
              <h4>Reduceri disponibile</h4>
              {currentSub.discounts.map((disc, idx) => (
                <div key={idx} className="discount-item">
                  <BadgeCheck size={16} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                  {disc}
                </div>
              ))}
            </div>
          )}

          <div className="price-card-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button 
              onClick={() => onOpenDetailsModal(course, currentSub)} 
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.5rem', color: 'var(--color-primary-dark)', borderColor: 'var(--color-primary)', background: 'white' }}
            >
              Vezi Detalii
            </button>
            <button 
              onClick={() => onOpenModal(course.id)} 
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.5rem' }}
            >
              Înscrie-te acum <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-only Action Buttons directly under Alege Nivelul (Horizontal side-by-side) */}
      <div className="course-mobile-actions">
        <button 
          type="button"
          onClick={() => onOpenDetailsModal(course, currentSub)} 
          className="btn btn-outline mobile-act-btn"
          style={{ color: 'var(--color-primary-dark)', borderColor: 'var(--color-primary)', background: 'white' }}
        >
          Vezi Detalii
        </button>
        <button 
          type="button"
          onClick={() => onOpenModal(course.id)} 
          className="btn btn-primary mobile-act-btn"
        >
          Înscrie-te acum <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function CourseDetailsModal({ course, subLevel, onClose, onRegister }) {
  if (!course) return null;
  const subLevels = course.subLevels || [];
  const [activeSub, setActiveSub] = useState(subLevel || subLevels[0] || {});

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card blog-modal-card" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Închide">
          <X size={20} />
        </button>

        <div className="blog-modal-body" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className="blog-tag" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{course.label}</span>
            {course.age && <span className="course-age-badge" style={{ fontSize: '0.8rem' }}>Vârstă: {course.age}</span>}
          </div>

          <h2 className="blog-modal-title" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
            {course.title}
          </h2>

          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            {course.desc}
          </p>

          {/* Level selection switcher inside popup */}
          {subLevels.length > 0 && (
            <div style={{ background: '#f1f5f9', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '0.75rem 1.1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Selectează Nivelul:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {subLevels.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => setActiveSub(s)}
                    style={{
                      background: (activeSub.id === s.id || activeSub.label === s.label) ? 'var(--color-primary)' : 'white',
                      color: (activeSub.id === s.id || activeSub.label === s.label) ? 'white' : 'var(--color-primary-dark)',
                      border: '1px solid var(--color-border)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      padding: '0.45rem 1.1rem',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      boxShadow: (activeSub.id === s.id || activeSub.label === s.label) ? '0 4px 12px rgba(30, 58, 138, 0.2)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clean 2-column detail specification grid */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--color-primary-dark)', margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--color-primary)" />
              Specificații Nivel ({activeSub.name || activeSub.label})
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
              <div className="course-detail-item" style={{ background: '#f8fafc', border: '1px solid var(--color-border-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="detail-icon" style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="detail-label">Format instruire</span>
                  <span className="detail-value">Lecții Offline (cu prezență fizică)</span>
                </div>
              </div>

              <div className="course-detail-item" style={{ background: '#f8fafc', border: '1px solid var(--color-border-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="detail-icon" style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="detail-label">Durată curs</span>
                  <span className="detail-value">{activeSub.duration || '9 luni'}</span>
                </div>
              </div>

              {activeSub.schedule && (
                <div className="course-detail-item" style={{ background: '#f8fafc', border: '1px solid var(--color-border-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                  <div className="detail-icon" style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="detail-label">Orar / Ritm</span>
                    <span className="detail-value">{activeSub.schedule}</span>
                  </div>
                </div>
              )}

              <div className="course-detail-item" style={{ background: '#f8fafc', border: '1px solid var(--color-border-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="detail-icon" style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}>
                  <Zap size={18} />
                </div>
                <div>
                  <span className="detail-label">Număr lecții</span>
                  <span className="detail-value">{activeSub.lessons || '72 lecții'}</span>
                </div>
              </div>

              <div className="course-detail-item" style={{ background: '#f8fafc', border: '1px solid var(--color-border-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="detail-icon" style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}>
                  <Users size={18} />
                </div>
                <div>
                  <span className="detail-label">Locuri per grupă</span>
                  <span className="detail-value">{activeSub.group || 'Max. 12 cursanți'}</span>
                </div>
              </div>

              <div className="course-detail-item" style={{ background: '#f8fafc', border: '1px solid var(--color-border-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="detail-icon" style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <span className="detail-label">Seria manuale</span>
                  <span className="detail-value">{course.series || 'Materiale Cambridge'} (+{activeSub.manuals || 500} lei)</span>
                </div>
              </div>

              <div className="course-detail-item" style={{ background: '#f8fafc', border: '1px solid var(--color-border-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="detail-icon" style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}>
                  <Tag size={18} />
                </div>
                <div>
                  <span className="detail-label">Cost lunar / total</span>
                  <span className="detail-value">{activeSub.priceMonthly} lei/lună ({activeSub.priceTotal} lei total)</span>
                </div>
              </div>
            </div>
          </div>

          {activeSub.discounts && activeSub.discounts.length > 0 && (
            <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--color-primary-dark)', margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BadgeCheck size={18} color="var(--color-secondary)" />
                Reduceri și facilități financiare aplicabile:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {activeSub.discounts.map((disc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#16a34a" />
                    {disc}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button 
              onClick={() => { onClose(); onRegister(course.id); }} 
              className="btn btn-primary btn-full"
              style={{ justifyContent: 'center', padding: '0.9rem 1.5rem', fontSize: '1rem' }}
            >
              Înscrie-te la nivelul {activeSub.label} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a, light = false }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'active' : ''} ${light ? 'light' : ''}`}>
      <div className="faq-q" onClick={() => setOpen(!open)}>
        {q}
        <ChevronDown size={20} className="faq-chevron" />
      </div>
      <div className="faq-a">{a}</div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDetailsCourse, setSelectedDetailsCourse] = useState(null);
  const [selectedDetailsSubLevel, setSelectedDetailsSubLevel] = useState(null);
  const [selectedBlogArticle, setSelectedBlogArticle] = useState(null);
  const [blogPosts, setBlogPosts] = useState([
    { 
      id: 'b1', 
      title: 'Start Înscrierilor pentru noul an de studii 2026-2027', 
      date: 'Iulie 2026', 
      tag: 'Noutăți',
      img: '/hero.png',
      desc: 'Centrul Lingvistic Progress CLS anunță deschiderea înscrierilor pentru noul an academic 2026-2027!\n\nOferim cursuri moderne de engleză pentru copii (8-11 ani), adolescenți (12-18 ani) și adulți, precum și grupe speciale de pregătire intensivă pentru examenele Cambridge (FCE / CAE).\n\nÎnscrie-te înainte de 1 septembrie și beneficiezi de o reducere de 5% la achitarea integrală a cursului!'
    },
    { 
      id: 'b2', 
      title: 'Progress CLS - decernare Centrul Lingvistic al Anului 2024', 
      date: 'Decembrie 2024', 
      tag: 'Premii',
      img: '/cambridge.png',
      desc: 'Suntem mândri să vă anunțăm că Progress CLS a fost desemnat Centrul Lingvistic al Anului 2024!\n\nMulțumim echipei noastre fantastice de profesori dedicați și tuturor cursanților care au ales să învețe engleza alături de noi.'
    },
    { 
      id: 'b3', 
      title: 'Progress CLS - decernare ORPH Awards Visionary Brand 2025', 
      date: 'Iunie 2025', 
      tag: 'Premii',
      img: '/hero.png',
      desc: 'O nouă recunoaștere a muncii noastre! În cadrul galei ORPH Awards 2025, Progress CLS a obținut trofeul Visionary Brand pentru inovație în metodele de predare a limbii engleze.'
    },
    { 
      id: 'b4', 
      title: 'Cum poți învăța engleza ușor și eficient?', 
      date: 'Martie 2025', 
      tag: 'Sfaturi',
      img: '/teacher_ludmila.png',
      desc: 'Învățarea unei limbi străine nu trebuie să fie plictisitoare. Secretul constă în practică zilnică, vizionarea filmelor în engleză cu subtitrări și participarea la lecții interactive unde vorbești din prima zi.'
    },
    { 
      id: 'b5', 
      title: 'Curiozități despre limba engleză', 
      date: 'Ianuarie 2025', 
      tag: 'Curiozități',
      img: '/teacher_anastasia.png',
      desc: 'Știai că limba engleză are peste 1 milion de cuvinte și că cel mai scurt termen propozițional complet este "Go!"? Descoperă mai multe lucruri fascinante în cursurile noastre!'
    }
  ]);
  const [siteData, setSiteData] = useState(() => {
    const defaultData = {
      hero: {
        awardText1: 'Centrul Lingvistic al Anului 2024',
        awardText2: 'Visionary Brand 2025',
        subtitle: 'Cursuri de limba engleză pentru copii, adolescenți și adulți, bazate pe metodologia Cambridge. Profesori cu experiență și certificați TEFL internațional.',
        typewriterWords: ['Învață Engleza', 'Un pas spre succes', 'Excelență în engleză'],
        images: ['/hero.png', '/cambridge.png', '/teacher_ludmila.png', '/teacher_anastasia.png']
      },
      stats: [
        { number: '500+', label: 'Cursanți formați' },
        { number: '98%', label: 'Rată de promovare Cambridge' },
        { number: '10+', label: 'Ani de experiență' },
        { number: '100%', label: 'Dedicare și profesionalism' }
      ],
      courses: COURSES,
      benefits: [
        { title: 'Metodologie Cambridge', desc: 'Predare bazată pe standarde internaționale și materiale moderne.' },
        { title: 'Profesori certificați TEFL', desc: 'Echipă de profesoare dedicate cu experiență.' },
        { title: 'Grupe restrânse', desc: 'Max. 12 cursanți per grupă - atenție individuală.' },
        { title: 'Lecții interactive', desc: 'Comunicare, jocuri și proiecte practice.' }
      ],
      team: TEAM,
      testimonials: [
        { author: 'Maria D.', course: 'Engleza pentru Copii', text: 'Fiica mea a avansat de la A1 la B1 în 18 luni!', rating: 5 },
        { author: 'Andrei C.', course: 'Pregătire Cambridge B2', text: 'Am promovat examenul FCE cu nota B!', rating: 5 }
      ],
      blog: [
        { 
          id: 'b1', 
          title: 'Start Înscrierilor pentru noul an de studii 2026-2027', 
          date: 'Iulie 2026', 
          tag: 'Noutăți',
          img: '/blog1.webp',
          desc: 'Centrul Lingvistic Progress CLS anunță deschiderea înscrierilor pentru noul an academic 2026-2027!\n\nOferim cursuri moderne de engleză pentru copii (8-11 ani), adolescenți (12-18 ani) și adulți, precum și grupe speciale de pregătire intensivă pentru examenele Cambridge (FCE / CAE).\n\nÎnscrie-te înainte de 1 septembrie și beneficiezi de o reducere de 5% la achitarea integrală a cursului!'
        },
        { 
          id: 'b2', 
          title: 'Progress CLS - decernare Centrul Lingvistic al Anului 2024', 
          date: 'Decembrie 2024', 
          tag: 'Premii',
          img: '/blog2.webp',
          desc: 'Suntem mândri să vă anunțăm că Progress CLS a fost desemnat Centrul Lingvistic al Anului 2024!\n\nMulțumim echipei noastre fantastice de profesori dedicați și tuturor cursanților care au ales să învețe engleza alături de noi.'
        },
        { 
          id: 'b3', 
          title: 'Cum poți învăța engleza ușor și eficient?', 
          date: 'Martie 2025', 
          tag: 'Sfaturi',
          img: '/blog3.webp',
          desc: 'Învățarea unei limbi străine nu trebuie să fie plictisitoare. Secretul constă în practică zilnică, vizionarea filmelor în engleză cu subtitrări și participarea la lecții interactive unde vorbești din prima zi.'
        }
      ],
      faq: {
        cambridgeFaq: [
          { q: 'De ce am nevoie de un certificat Cambridge?', a: 'Un certificat Cambridge este recunoscut internațional și îți oferă: scutire de proba de competențe lingvistice la Bacalaureat, avantaj la admiterea în universități din România și străinătate, mai multe oportunități profesionale și o certificare valabilă pe viață.' },
          { q: 'Care este diferența dintre cursul intensiv și cel extensiv?', a: 'Cursul intensiv este recomandat elevilor din clasa a XII-a sau celor care au nevoie să susțină examenul rapid - ritm alert, 3.5 luni. Cursul extensiv este ideal pentru elevii din clasele X-XI, oferind 9 luni de pregătire graduală, mai puțină presiune și timp pentru consolidarea cunoștințelor.' },
          { q: 'Unde susțin examenul Cambridge?', a: 'Pregătirea are loc la Progress CLS. Examenul propriu-zis este susținut la Alianța Franceză, centru autorizat de examinare Cambridge, unde cursanții noștri sunt programați pentru sesiunea aleasă.' },
          { q: 'Este ușor examenul?', a: 'Examenul Cambridge este riguros și evaluează toate competențele: Reading, Writing, Listening și Speaking. Cu o pregătire consecventă la Progress CLS - modele de examen, simulări și feedback constant - vei obține rezultatul dorit.' }
        ],
        generalFaq: [
          { q: 'Cum mă pot înscrie la cursuri?', a: 'Ne puteți contacta la numărul +373 69 44 77 68, prin email la progress.cls@gmail.com sau vizitând sediul nostru din Chișinău, Str. Sarmizegetusa 92.' },
          { q: 'Aveți sediu doar la Botanica sau și în alte sectoare?', a: 'Momentan activăm la sediul nostru din Chișinău, Str. Sarmizegetusa 92 (sectorul Botanica). Contactați-ne pentru mai multe detalii.' },
          { q: 'Aveți lecții Online sau doar Offline?', a: 'Contactați-ne pentru a afla despre formatele disponibile în prezent și orarul grupelor active.' }
        ]
      },
      contacts: {
        phone: '+373 69 44 77 68',
        phoneRaw: '+37369447768',
        address: 'Chișinău, Str. Sarmizegetusa 92',
        email: 'progress.cls@gmail.com'
      }
    };

    try {
      const saved = localStorage.getItem('progress_cls_site_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedCourses = (parsed.courses && Array.isArray(parsed.courses)) ? parsed.courses : COURSES;
        const mergedCourses = COURSES.map((defCourse) => {
          const found = savedCourses.find(c => c.id === defCourse.id);
          if (!found) return defCourse;
          return {
            ...found,
            label: defCourse.label,
            title: defCourse.title,
            age: defCourse.age,
            subLevels: defCourse.subLevels
          };
        });

        return {
          ...defaultData,
          ...parsed,
          courses: mergedCourses,
          hero: { ...defaultData.hero, ...(parsed.hero || {}) },
          faq: { ...defaultData.faq, ...(parsed.faq || {}) },
          contacts: { ...defaultData.contacts, ...(parsed.contacts || {}) }
        };
      }
    } catch (e) {
      console.error('Error loading saved siteData:', e);
    }
    return defaultData;
  });

  useFadeIn();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleAdminRoute = () => {
      if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
        setIsAdminOpen(true);
      }
    };
    handleAdminRoute();
    window.addEventListener('hashchange', handleAdminRoute);
    return () => window.removeEventListener('hashchange', handleAdminRoute);
  }, []);

  const openModal = (courseId = '') => {
    setSelectedCourse(courseId);
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar 
        scrolled={scrolled} 
        onOpenModal={() => openModal()} 
        onOpenMapModal={() => setIsMapModalOpen(true)} 
      />

      {/* ── HERO ─────────────────────────────── */}
      <section id="acasa" className="hero hero-uk-theme">
        <div className="hero-uk-bg-photo" style={{ backgroundImage: "url('/hero_uk_booth.webp')" }} />
        <div className="hero-uk-bg-overlay" />

        <div className="container hero-container">
          <div className="hero-content slide-in-left">
            <div className="hero-award-badge animate-fade-up">
              <span className="award-icon">🏆</span>
              <span className="award-text">{siteData.hero.awardText1}</span>
              <span className="award-divider">·</span>
              <span className="award-text">{siteData.hero.awardText2}</span>
              <span className="award-shimmer" />
            </div>
            <h1 className="hero-h1 animate-fade-up animate-delay-1">
              <span className="gradient-text"><Typewriter words={siteData.hero.typewriterWords || TYPEWRITER_WORDS} /></span><br />cu Progress CLS
            </h1>
            <p className="hero-subtitle animate-fade-up animate-delay-2" dangerouslySetInnerHTML={{ __html: siteData.hero.subtitle }} />
            <div className="hero-pills animate-fade-up animate-delay-2">
              <span className="hero-pill"><CheckCircle size={16} color="var(--color-accent)" /> Interactiv</span>
              <span className="hero-pill"><CheckCircle size={16} color="var(--color-accent)" /> Eficient</span>
              <span className="hero-pill"><CheckCircle size={16} color="var(--color-accent)" /> Accesibil</span>
            </div>
            <div className="hero-cta animate-fade-up animate-delay-3">
              <a href="#cursuri" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Descoperă cursurile <ArrowRight size={18} />
              </a>
              <a href="tel:+37369447768" className="btn btn-ghost hero-call-btn" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                <Phone size={18} /> Sună-ne
              </a>
            </div>
          </div>
          <div className="hero-image-wrap slide-in-right delay-2">
            <HeroCarousel images={siteData.hero.images || ['/hero.png', '/cambridge.png', '/teacher_ludmila.png', '/teacher_anastasia.png']} />
            <div className="hero-float-card hero-float-card--1">
              <div className="hero-float-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
                <Users size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{siteData.stats[0]?.label || 'Cursanți activi'}</div>
                <div style={{ fontWeight: 800 }}>{siteData.stats[0]?.number || '500+'}</div>
              </div>
            </div>
            <div className="hero-float-card hero-float-card--2">
              <div className="hero-float-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Centrul Anului</div>
                <div>2024 & 2025</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────── */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            {(siteData.stats || []).map((stat, idx) => (
              <div className={`stat-card fade-in delay-${idx + 1}`} key={idx}>
                <div className="stat-icon-wrapper">
                  {[<Users size={26} />, <GraduationCap size={26} />, <Calendar size={26} />, <Trophy size={26} />][idx % 4]}
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COURSES ──────────────────────────── */}
      <section id="cursuri" className="section section--alt">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-tag">Cursurile noastre</span>
            <h2 className="section-title">Alege drumul tău<br />spre noi oportunități</h2>
            <p className="section-subtitle">
              Descoperă plăcerea de a învăța limba engleză într-un mediu prietenos, modern și orientat spre rezultate!
            </p>
          </div>
          <div className="courses-sequential-list">
            {(siteData.courses || COURSES).map((courseItem) => (
              <CourseBlock 
                key={courseItem.id} 
                course={courseItem} 
                onOpenModal={openModal} 
                onOpenDetailsModal={(crs, subLvl) => {
                  setSelectedDetailsCourse(crs);
                  setSelectedDetailsSubLevel(subLvl);
                }} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CAMBRIDGE ────────────────────────── */}
      <section id="cambridge" className="section section--dark">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-tag section-tag--teal">Examene Internaționale</span>
            <h2 className="section-title section-title--white">Pregătire Examene Cambridge</h2>
            <p className="section-subtitle section-subtitle--white">
              Centru de pregătire în parteneriat cu Alianța Franceză. Pregătim cursanți pentru <strong style={{ color: 'var(--color-secondary)' }}>B2 First (FCE)</strong> și <strong style={{ color: 'var(--color-secondary)' }}>C1 Advanced (CAE)</strong>.
            </p>
          </div>

          <div className="cambridge-wrap">
            <div className="cambridge-card fade-in delay-1">
              <div className="cambridge-card-header">
                <div>
                  <span className="cambridge-card-type">Intensiv</span>
                </div>
              </div>
              <h3>Curs Intensiv</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Recomandat elevilor din clasa a XII-a sau celor care au nevoie să susțină examenul rapid. Ritm alert, concentrat pe rezultate maxime.
              </p>
              <div className="cambridge-detail"><Calendar size={18} /> 3.5 luni · Sâmbătă și duminică</div>
              <div className="cambridge-detail"><Clock size={18} /> 30 lecții · 135 minute</div>
              <div className="cambridge-detail"><Users size={18} /> Max. 12 cursanți / grupă</div>
              <div className="cambridge-price">6000 lei <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>(2000 lei/lună)</span></div>
            </div>
            <div className="cambridge-card fade-in delay-2">
              <div className="cambridge-card-header">
                <div>
                  <span className="cambridge-card-type">Extensiv</span>
                </div>
              </div>
              <h3>Curs Extensiv</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Recomandat elevilor din clasele X-XI. Proces gradual de 9 luni cu timp pentru consolidarea cunoștințelor, fără presiune.
              </p>
              <div className="cambridge-detail"><Calendar size={18} /> 9 luni · 2 ori săptămânal</div>
              <div className="cambridge-detail"><Clock size={18} /> 72 lecții · 80 minute</div>
              <div className="cambridge-detail"><Users size={18} /> Max. 12 cursanți / grupă</div>
              <div className="cambridge-price">9000 lei <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>(1000 lei/lună)</span></div>
            </div>
          </div>

          <div className="cambridge-faq">
            <h3 className="cambridge-faq-title">Întrebări frecvente - Cambridge</h3>
            <div className="faq-list">
              {CAMBRIDGE_FAQ.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────── */}
      <section id="beneficii" className="section">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-tag">De ce noi?</span>
            <h2 className="section-title">De ce să alegi Progress CLS?</h2>
            <p className="section-subtitle">
              Înveți mai mult decât o limbă - îți construiești încrederea, abilitățile și viitorul.
            </p>
          </div>
          <div className="benefits-grid">
            {BENEFITS.map((b, i) => (
              <div className={`benefit-card benefit-card--color-${(i % 8) + 1} fade-in delay-${(i % 4) + 1}`} key={i}>
                <div className="benefit-icon">{b.icon}</div>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────── */}
      <section id="echipa" className="section section--alt">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-tag">Echipa noastră</span>
            <h2 className="section-title">Profesori care inspiră</h2>
            <p className="section-subtitle">
              Toți membrii echipei sunt certificați internațional prin calificarea TEFL și au experiență în lucrul cu copii, adolescenți și adulți.
            </p>
          </div>
          <div className="team-grid">
            {TEAM.map((m, i) => (
              <TeacherCard member={m} index={i} key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-tag">Recenzii</span>
            <h2 className="section-title">Ce zic cursanții despre noi?</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className={`testimonial-card fade-in delay-${i + 1}`} key={i}>
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.author)}&background=e2e8f0&color=1e3a8a&size=80`}
                    alt={t.author}
                    className="author-avatar"
                  />
                  <div>
                    <div className="author-name">{t.author}</div>
                    <div className="author-course">{t.course}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────── */}
      <section id="blog" className="section section--alt">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-tag">Blog</span>
            <h2 className="section-title">Noutăți și articole</h2>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <div 
                className={`blog-card fade-in delay-${(i % 5) + 1}`} 
                key={i}
                onClick={() => setSelectedBlogArticle(post)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="blog-card-img-wrap" 
                  style={{ 
                    height: '220px', 
                    width: '100%', 
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={post.img || `/blog${(i % 3) + 1}.webp`} 
                    alt={post.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }} 
                  />
                </div>
                <div className="blog-card-body">
                  <span className="blog-tag">{post.tag || 'Noutăți'}</span>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-date">{post.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ GENERAL ──────────────────────── */}
      <section id="faq" className="section">
        <div className="faq-big-ben-bg" style={{ backgroundImage: "url('/big_ben.webp')" }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header fade-in">
            <h2 className="section-title">Întrebări frecvente</h2>
          </div>
          <div className="faq-list fade-in delay-2">
            {GENERAL_FAQ.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} light />)}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────── */}
      <div className="container">
        <div className="cta-banner fade-in">
          <h2>Mai mult decât un curs de engleză -<br />o investiție în viitorul tău!</h2>
          <p>Înscrie-te acum și fă primul pas spre succes alături de Progress CLS.</p>
          <div className="cta-buttons">
            <a href="tel:+37369447768" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              <Phone size={18} /> Sună acum
            </a>
            <a href="mailto:progress.cls@gmail.com" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              <Mail size={18} /> Trimite email
            </a>
          </div>
        </div>
      </div>

      {/* ── MAP & LOCATION SECTION ─────────────── */}
      <section id="contacte" className="section location-map-section">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-tag">Unde ne găsești</span>
            <h2 className="section-title">Ne găsești ușor în Chișinău</h2>
            <p className="section-subtitle">
              Sediul nostru modern te așteaptă în sectorul Botanica, Str. Sarmizegetusa 92. Te așteptăm pentru o testare gratuită a nivelului tău de engleză!
            </p>
          </div>

          <div className="map-card-wrapper fade-in delay-1">
            <iframe
              title="Progress CLS Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2721.4137258908865!2d28.8687!3d46.9882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c36a4392a83%3A0x6b8d4e9d3d3c8c88!2sStrada%20Sarmizegetusa%2092%2C%20Chi%C8%99in%C4%83u!5e0!3m2!1sro!2smd!4v1700000000000!5m2!1sro!2smd"
              width="100%"
              height="480"
              style={{ border: 0, display: 'block', width: '100%', height: '480px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            <div className="map-info-float-card">
              <div className="map-info-header">
                <div className="map-info-badge">Sediul Central</div>
                <h3 className="map-info-title">Progress CLS</h3>
              </div>

              <div className="map-info-list">
                <div className="map-info-item">
                  <MapPin size={18} className="map-info-icon" />
                  <div>
                    <strong>Adresă:</strong>
                    <span>Chișinău, Str. Sarmizegetusa 92 (Botanica)</span>
                  </div>
                </div>

                <div className="map-info-item">
                  <Phone size={18} className="map-info-icon" />
                  <div>
                    <strong>Telefon:</strong>
                    <a href="tel:+37369447768">+373 69 44 77 68</a>
                  </div>
                </div>

                <div className="map-info-item">
                  <Clock size={18} className="map-info-icon" />
                  <div>
                    <strong>Orar de lucru:</strong>
                    <span>Lun - Vin: 09:00 - 19:00 · Sâm: 09:00 - 15:00</span>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Strada+Sarmizegetusa+92,+Chisinau"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary map-directions-btn"
              >
                <Globe size={16} /> Deschide în Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img src="/logo.webp" alt="Progress CLS Logo" style={{ height: '34px', width: 'auto', display: 'block' }} />
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Progress CLS</span>
              </div>
              <p>Un pas spre succes. Centrul tău de excelență în limba engleză din Chișinău, bazat pe metodologia Cambridge.</p>
              <div className="footer-socials" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <a href="https://www.facebook.com/p/PROGRESS-CLS-100064022590521/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon-link">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/progress_cls/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon-link">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://t.me/+37369447768" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="social-icon-link">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .54-1.43.53-.47-.01-1.37-.26-2.04-.48-.82-.27-1.47-.42-1.42-.88.03-.24.36-.49.99-.75 3.88-1.69 6.47-2.8 7.78-3.34 3.7-1.54 4.47-1.81 4.97-1.82.11 0 .36.03.52.16.14.11.18.26.2.37.02.11.04.37.02.62z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@progress_cls" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-icon-link">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.84V7.63a6.34 6.34 0 0 0-5.06 2.05A6.34 6.34 0 0 0 3 14.15a6.34 6.34 0 0 0 6.35 6.35 6.34 6.34 0 0 0 6.35-6.35V9.4a8.28 8.28 0 0 0 4.89 1.58V7.53a4.83 4.83 0 0 1-1-.84z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <div className="footer-heading">Cursuri</div>
              {['Engleza pentru Copii (8-11 ani)', 'Engleza pentru Adolescenți (12-18 ani)', 'Engleza pentru Adulți', 'Pregătire Cambridge FCE/CAE'].map(c => (
                <div key={c} className="footer-contact-item" style={{ marginBottom: '0.5rem' }}>
                  <CheckCircle size={14} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: '0.875rem' }}>{c}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="footer-heading">Contact</div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon"><Phone size={16} /></div>
                <a href="tel:+37369447768" style={{ color: 'inherit' }}>+373 69 44 77 68</a>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon"><Mail size={16} /></div>
                <a href="mailto:progress.cls@gmail.com" style={{ color: 'inherit' }}>progress.cls@gmail.com</a>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon"><MapPin size={16} /></div>
                <span>Chișinău, Str. Sarmizegetusa 92</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-bottom-left">© {new Date().getFullYear()} Progress CLS - Centrul de Limbă Engleză. Toate drepturile rezervate.</span>
            <span className="footer-bottom-right" style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              Site dezvoltat de echipa <a href="https://cyberfolks.md/" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', fontWeight: 'normal', textDecoration: 'underline' }}>CYBERFOLKSMD</a>
            </span>
          </div>
        </div>
      </footer>

      {/* ── FLOATING CHATY WIDGET (like english-house.md) ── */}
      <div className="floating-chaty-widget">
        <a
          href="https://t.me/+37369447768"
          target="_blank"
          rel="noopener noreferrer"
          className="chaty-btn"
          aria-label="Telegram"
          title="Contactează-ne pe Telegram"
        >
          <span className="chaty-pulse" />
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .54-1.43.53-.47-.01-1.37-.26-2.04-.48-.82-.27-1.47-.42-1.42-.88.03-.24.36-.49.99-.75 3.88-1.69 6.47-2.8 7.78-3.34 3.7-1.54 4.47-1.81 4.97-1.82.11 0 .36.03.52.16.14.11.18.26.2.37.02.11.04.37.02.62z"/>
          </svg>
        </a>
      </div>

      {isModalOpen && (
        <RegistrationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          defaultCourse={selectedCourse} 
        />
      )}
      {isMapModalOpen && (
        <DirectionsModal 
          isOpen={isMapModalOpen} 
          onClose={() => setIsMapModalOpen(false)} 
        />
      )}
      {isAdminOpen && (
        <AdminPanel 
          onClose={() => setIsAdminOpen(false)} 
          initialData={siteData} 
          onSaveData={(updated) => {
            setSiteData(updated);
            if (updated.blog) setBlogPosts(updated.blog);
          }}
        />
      )}
      {selectedBlogArticle && (
        <BlogArticleModal 
          article={selectedBlogArticle} 
          onClose={() => setSelectedBlogArticle(null)} 
        />
      )}
      {selectedDetailsCourse && (
        <CourseDetailsModal
          course={selectedDetailsCourse}
          subLevel={selectedDetailsSubLevel}
          onClose={() => {
            setSelectedDetailsCourse(null);
            setSelectedDetailsSubLevel(null);
          }}
          onRegister={(courseId) => openModal(courseId)}
        />
      )}
    </>
  );
}

function RegistrationModal({ isOpen, onClose, defaultCourse }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(defaultCourse || 'kids');
  const [isSent, setIsSent] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('viber');

  useEffect(() => {
    if (defaultCourse) {
      setCourse(defaultCourse);
    }
  }, [defaultCourse]);

  const handleSend = (platform) => {
    if (!name || !phone) {
      const form = document.querySelector('.modal-card form');
      if (form) {
        form.reportValidity();
      }
      return;
    }

    setSelectedPlatform(platform);

    const courseNames = {
      kids: 'Copii (8-11 ani) - Engleza pentru Copii',
      teens: 'Adolescenți (12-18 ani) - Engleza pentru Adolescenți',
      adults: 'Adulți - Curs intensiv',
      cambridge: 'Pregătire Cambridge FCE/CAE'
    };

    const courseName = courseNames[course] || course;
    const msg = `Salut! Doresc să mă înscriu la curs.
Nume: ${name}
Telefon: ${phone}
Curs: ${courseName}`;

    let url = '';
    if (platform === 'viber') {
      url = `viber://chat?number=%2B37369447768&draft=${encodeURIComponent(msg)}`;
    } else if (platform === 'whatsapp') {
      url = `https://wa.me/37369447768?text=${encodeURIComponent(msg)}`;
    } else if (platform === 'telegram') {
      url = `https://t.me/+37369447768?text=${encodeURIComponent(msg)}`;
    }

    window.location.href = url;
    setIsSent(true);
  };

  const copyToClipboard = () => {
    const courseNames = {
      kids: 'Copii (8-11 ani) - Engleza pentru Copii',
      teens: 'Adolescenți (12-18 ani) - Engleza pentru Adolescenți',
      adults: 'Adulți - Curs intensiv',
      cambridge: 'Pregătire Cambridge FCE/CAE'
    };
    const courseName = courseNames[course] || course;
    const msg = `Salut! Doresc să mă înscriu la curs.
Nume: ${name}
Telefon: ${phone}
Curs: ${courseName}`;
    navigator.clipboard.writeText(msg);
    alert('Mesajul a fost copiat în clipboard!');
  };

  const getPlatformLabel = (platform) => {
    if (platform === 'viber') return 'Viber';
    if (platform === 'whatsapp') return 'WhatsApp';
    if (platform === 'telegram') return 'Telegram';
    return platform;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Închide">
          <X size={20} />
        </button>
        
        {!isSent ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSend(selectedPlatform); }}>
            <h3 className="modal-title">Înscrie-te la Curs</h3>
            <p className="modal-subtitle">Introduceți datele dvs. și alegeți rețeaua pentru a trimite cererea.</p>
            
            <div className="form-group">
              <label htmlFor="modal-name">Nume și Prenume</label>
              <input 
                id="modal-name"
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ion Popescu"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="modal-phone">Număr de Telefon</label>
              <input 
                id="modal-phone"
                type="tel" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +373 69 123 456"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="modal-course">Alege Cursul și Nivelul</label>
              <select 
                id="modal-course"
                value={course} 
                onChange={(e) => setCourse(e.target.value)}
                style={{ padding: '0.75rem 1rem', fontSize: '0.95rem', borderRadius: 'var(--radius-lg)' }}
              >
                <optgroup label="Copii (8-11 ani)">
                  <option value="kids_a1.1">Nivel A1.1 (Super Minds 1)</option>
                  <option value="kids_a1.2">Nivel A1.2 (Super Minds 2)</option>
                  <option value="kids_a2.1">Nivel A2.1 (Super Minds 3)</option>
                </optgroup>
                <optgroup label="Adolescenți (12-18 ani)">
                  <option value="teens_a1">Nivel A1 (Prepare 1)</option>
                  <option value="teens_a2">Nivel A2 (Prepare 2)</option>
                  <option value="teens_b1">Nivel B1 (Prepare 3)</option>
                  <option value="teens_b1plus">Nivel B1+ (Prepare 4)</option>
                  <option value="teens_b2">Nivel B2 (Prepare 5)</option>
                  <option value="teens_c1">Nivel C1 (Prepare 6)</option>
                </optgroup>
                <optgroup label="Adulți / Cursuri intensive (18+ ani)">
                  <option value="adults_a1">Nivel A1 (4 luni - 1440 lei/lună)</option>
                  <option value="adults_a2">Nivel A2 (4.5 luni - 1680 lei/lună)</option>
                  <option value="adults_b1">Nivel B1 (4.5 luni - 1680 lei/lună)</option>
                  <option value="adults_b1plus">Nivel B1+ (4.5 luni - 1750 lei/lună)</option>
                  <option value="adults_b2">Nivel B2 (4.5 luni - 1750 lei/lună)</option>
                </optgroup>
                <optgroup label="Pregătire Examene Cambridge (FCE / CAE)">
                  <option value="fce_intensive">B2 First (FCE) Intensiv (3.5 luni)</option>
                  <option value="fce_extensive">B2 First (FCE) Extensiv (9 luni)</option>
                  <option value="cae_intensive">C1 Advanced (CAE) Intensiv (3.5 luni)</option>
                  <option value="cae_extensive">C1 Advanced (CAE) Extensiv (9 luni)</option>
                </optgroup>
              </select>
            </div>

            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem', textAlign: 'left' }}>
              Trimite mesajul prin:
            </label>
            
            <div className="messenger-row">
              <button type="button" onClick={() => handleSend('viber')} className="btn btn-messenger btn-viber">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.323 0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03z"/>
                </svg>
                Viber
              </button>
              
              <button type="button" onClick={() => handleSend('whatsapp')} className="btn btn-messenger btn-whatsapp">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.601 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                WhatsApp
              </button>
              
              <button type="button" onClick={() => handleSend('telegram')} className="btn btn-messenger btn-telegram">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
                </svg>
                Telegram
              </button>
            </div>

            {/* GDPR & Moldovan Law Data Protection Notice */}
            <div className="modal-gdpr-notice">
              <ShieldCheck size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                Prin trimiterea cererii, ești de acord cu prelucrarea datelor cu caracter personal conform legislației Republicii Moldova și GDPR. Consultați{' '}
                <a 
                  href="https://www.legis.md/cautare/getResults?doc_id=129123&lang=ro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gdpr-link"
                >
                  Legea privind protecția datelor
                </a>.
              </span>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
            <h3 className="modal-title">Deschidem {getPlatformLabel(selectedPlatform)}...</h3>
            <p className="modal-subtitle" style={{ marginBottom: '1.5rem' }}>
              Dacă aplicația nu s-a deschis automat, puteți trimite mesajul manual la numărul <strong>+373 69 44 77 68</strong>.
            </p>
            <div className="message-preview">
              <strong>Salut! Doresc să mă înscriu la curs.</strong><br />
              Nume: {name}<br />
              Telefon: {phone}<br />
              Curs: {course === 'kids' ? 'Copii (8-11 ani)' : course === 'teens' ? 'Adolescenți (12-18 ani)' : course === 'adults' ? 'Adulți (curs intensiv)' : 'Pregătire Cambridge (FCE/CAE)'}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <button onClick={copyToClipboard} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                Copiază Textul
              </button>
              <button onClick={() => {
                const courseNames = {
                  kids: 'Copii (8-11 ani) - Engleza pentru Copii',
                  teens: 'Adolescenți (12-18 ani) - Engleza pentru Adolescenți',
                  adults: 'Adulți - Curs intensiv',
                  cambridge: 'Pregătire Cambridge FCE/CAE'
                };
                const courseName = courseNames[course] || course;
                const msg = `Salut! Doresc să mă înscriu la curs.
Nume: ${name}
Telefon: ${phone}
Curs: ${courseName}`;
                let url = '';
                if (selectedPlatform === 'viber') {
                  url = `viber://chat?number=%2B37369447768&draft=${encodeURIComponent(msg)}`;
                } else if (selectedPlatform === 'whatsapp') {
                  url = `https://wa.me/37369447768?text=${encodeURIComponent(msg)}`;
                } else if (selectedPlatform === 'telegram') {
                  url = `https://t.me/+37369447768?text=${encodeURIComponent(msg)}`;
                }
                window.location.href = url;
              }} className={`btn btn-messenger btn-${selectedPlatform}`} style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                Reîncearcă
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DirectionsModal({ isOpen, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Închide">
          <X size={20} />
        </button>
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
          <h3 className="modal-title">Cum ajungi la noi?</h3>
          <p className="modal-subtitle" style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Sediul Progress CLS se află în Chișinău, sectorul Botanica, <strong>Str. Sarmizegetusa 92</strong>.<br />
            Ne puteți găsi ușor pe hartă sau puteți obține indicații de orientare.
          </p>
          <a 
            href="https://maps.google.com/?q=Chișinău, Sarmizegetusa 92" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary btn-full"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <MapPin size={18} />
            Deschide în Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

function BlogArticleModal({ article, onClose }) {
  if (!article) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card blog-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Închide">
          <X size={20} />
        </button>

        {article.img && (
          <div className="blog-modal-img-wrap">
            <img src={article.img} alt={article.title} className="blog-modal-img" />
          </div>
        )}

        <div className="blog-modal-body">
          <div className="blog-modal-meta">
            <span className="blog-tag">{article.tag || 'Noutăți'}</span>
            <span className="blog-date" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>{article.date}</span>
          </div>

          <h2 className="blog-modal-title">{article.title}</h2>

          <div className="blog-modal-content" dangerouslySetInnerHTML={{ __html: article.desc || article.text || '' }} />

          <button onClick={onClose} className="btn btn-primary btn-full" style={{ marginTop: '1.75rem' }}>
            Închide Articolul
          </button>
        </div>
      </div>
    </div>
  );
}
