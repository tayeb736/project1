import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    const preloaderNum = document.getElementById('preloaderNum');
    const preloaderFill = document.getElementById('preloaderFill');
    let loadProgress = 0;

    const loadInterval = setInterval(() => {
      loadProgress += Math.random() * 12 + 3;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loadInterval);
        setTimeout(() => {
          if (preloader) preloader.classList.add('done');
          document.body.style.overflow = '';
        }, 400);
      }
      if (preloaderNum) preloaderNum.textContent = Math.floor(loadProgress);
      if (preloaderFill) preloaderFill.style.width = loadProgress + '%';
    }, 120);

    document.body.style.overflow = 'hidden';

    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top = my + 'px';
      }
    };

    document.addEventListener('mousemove', onMouseMove);

    function animateCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (cursorRing) {
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top = ry + 'px';
      }
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .service-card, .project-item, .tool-item, .contact-method, .social-link');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot?.classList.add('hover');
        cursorRing?.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot?.classList.remove('hover');
        cursorRing?.classList.remove('hover');
      });
    });

    const nav = document.getElementById('nav');
    const backToTop = document.getElementById('backToTop');

    const onScroll = () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
    };

    window.addEventListener('scroll', onScroll);

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-fill').forEach(bar => skillObserver.observe(bar));

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          let current = 0;
          const increment = target / 80;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              entry.target.textContent = target;
              clearInterval(timer);
            } else {
              entry.target.textContent = Math.floor(current);
            }
          }, 25);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];

      const resizeCanvas = () => {
        const hero = document.getElementById('hero');
        if (hero) {
          canvas.width = hero.offsetWidth;
          canvas.height = hero.offsetHeight;
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 1.5 + 0.3;
          this.speedX = (Math.random() - 0.5) * 0.25;
          this.speedY = (Math.random() - 0.5) * 0.25;
          this.opacity = Math.random() * 0.4 + 0.05;
        }
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
          ctx.fill();
        }
      }

      function initParticles() {
        const count = Math.min(60, Math.floor(canvas.width * canvas.height / 25000));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
      }

      function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(201, 168, 76, ${0.04 * (1 - dist / 130)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
      }

      initParticles();
      animateParticles();
    }

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });

    return () => {
      clearInterval(loadInterval);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleHamburgerClick = () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  };

  const closeMobile = () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  const handleFilterClick = (e) => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const btn = e.currentTarget;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      if (show) {
        item.style.display = 'grid';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  };

  const goToSlide = (index) => {
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const totalSlides = 3;
    const currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    if (testimonialTrack) testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    testimonialDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    return currentSlide;
  };

  useEffect(() => {
    let currentSlide = 0;
    const nextBtn = document.getElementById('nextTestimonial');
    const prevBtn = document.getElementById('prevTestimonial');
    const dots = document.querySelectorAll('.testimonial-dot');

    const handleNext = () => { currentSlide = goToSlide(currentSlide + 1); };
    const handlePrev = () => { currentSlide = goToSlide(currentSlide - 1); };

    nextBtn?.addEventListener('click', handleNext);
    prevBtn?.addEventListener('click', handlePrev);
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentSlide = goToSlide(parseInt(dot.dataset.index));
      });
    });

    const autoSlide = setInterval(handleNext, 6000);
    return () => {
      clearInterval(autoSlide);
      nextBtn?.removeEventListener('click', handleNext);
      prevBtn?.removeEventListener('click', handlePrev);
    };
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const form = e.target;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.classList.add('success');
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.classList.remove('success');
        btn.disabled = false;
      }, 3000);
    }, 1500);
  };

  return (
    <div className="App">
      <div className="preloader" id="preloader">
        <div className="preloader-counter"><span id="preloaderNum">0</span><span>%</span></div>
        <div className="preloader-label">Loading Tayeb's Experience</div>
        <div className="preloader-line">
          <div className="preloader-line-fill" id="preloaderFill"></div>
        </div>
      </div>

      <div className="cursor-dot" id="cursorDot"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      <nav className="nav" id="nav">
        <div className="container">
          <div className="nav-inner">
            <a href="#" className="nav-logo">Tayeb<em>.</em></a>
            <ul className="nav-menu">
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#projects">Work</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#testimonials">Reviews</a></li>
              <li><a href="#contact" className="nav-cta-link">Let's Talk</a></li>
            </ul>
            <div className="hamburger" id="hamburger" onClick={handleHamburgerClick}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>

      <div className="mobile-overlay" id="mobileMenu">
        <ul className="mobile-nav-links">
          <li><a href="#about" onClick={closeMobile}>About</a></li>
          <li><a href="#services" onClick={closeMobile}>Services</a></li>
          <li><a href="#projects" onClick={closeMobile}>Work</a></li>
          <li><a href="#experience" onClick={closeMobile}>Experience</a></li>
          <li><a href="#testimonials" onClick={closeMobile}>Reviews</a></li>
          <li><a href="#contact" onClick={closeMobile}>Contact</a></li>
        </ul>
        <div className="mobile-nav-footer">
          <p>anonymous26111@gmail.com</p>
        </div>
      </div>

      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="hero-gradient-orb"></div>
          <div className="hero-gradient-orb"></div>
          <div className="hero-gradient-orb"></div>
          <div className="hero-noise"></div>
        </div>
        <canvas id="heroCanvas" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}></canvas>
        <div className="container">
          <div className="hero-content">
            <div className="hero-top">
              <div className="hero-tag">
                <span className="hero-tag-dot"></span>
                Available for Elite Projects
              </div>
              <div className="hero-year">© 2026</div>
            </div>
            <h1 className="hero-title">
              <span className="title-line">
                <span className="title-line-inner">Cyber Security Expert</span>
              </span>
              <span className="title-line">
                <span className="title-line-inner">& <span className="outline-text">Full-Stack</span> <span className="accent">Engineer</span></span>
              </span>
            </h1>
            <div className="hero-bottom">
              <p className="hero-desc">
                Architecting secure digital ecosystems and crafting high-performance games, web apps, and AI solutions. Based in Constantine, serving the world.
              </p>
              <div className="hero-cta-group">
                <a href="#projects" className="btn btn-primary magnetic"><span>View Portflio</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
                <a href="#contact" className="btn btn-outline magnetic">Hire Me</a>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span className="hero-scroll-text">Scroll</span>
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      <div className="marquee-section">
        <div className="marquee-track">
          <span className="marquee-item">Cyber Security <span className="sep"></span></span>
          <span className="marquee-item highlight">Game Development <span className="sep"></span></span>
          <span className="marquee-item">Artificial Intelligence <span className="sep"></span></span>
          <span className="marquee-item highlight">Mobile Apps <span className="sep"></span></span>
          <span className="marquee-item">Web Applications <span className="sep"></span></span>
          <span className="marquee-item highlight">Ethical Hacking <span className="sep"></span></span>
          <span className="marquee-item">Cyber Security <span className="sep"></span></span>
          <span className="marquee-item highlight">Game Development <span className="sep"></span></span>
          <span className="marquee-item">Artificial Intelligence <span className="sep"></span></span>
          <span className="marquee-item highlight">Mobile Apps <span className="sep"></span></span>
          <span className="marquee-item">Web Applications <span className="sep"></span></span>
          <span className="marquee-item highlight">Ethical Hacking <span className="sep"></span></span>
        </div>
      </div>

      <section className="section" id="about">
        <div className="container">
          <div className="about-layout">
            <div className="about-image-section reveal">
              <div className="about-img-container">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                  alt="Tayeb Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="about-img-border"></div>
              <div className="about-float-card">
                <div className="about-float-card-number">3+</div>
                <div className="about-float-card-text">Years of Excellence</div>
              </div>
            </div>
            <div className="about-content">
              <div className="section-label reveal">Personal Dossier</div>
              <h2 className="section-title reveal reveal-delay-1">Mastering the Art of <span style={{ color: 'var(--accent)' }}>Digital Fortification</span></h2>
              <div style={{ height: '24px' }} className="reveal reveal-delay-2"></div>
              <p className="reveal reveal-delay-2">
                I am Tayeb — a multi-disciplinary engineer specializing in Cybersecurity, Game Development, and AI. My approach merges extreme security protocols with high-end creative engineering.
              </p>
              <p className="reveal reveal-delay-3">
                From developing immersive game engines to architecting impenetrable web infrastructures, I build digital products that are not only functional but resilient against the evolving threat landscape.
              </p>
              <div className="about-details-grid reveal reveal-delay-4">
                <div className="about-detail-item">
                  <span className="about-detail-label">Name</span>
                  <span className="about-detail-value">Tayeb</span>
                </div>
                <div className="about-detail-item">
                  <span className="about-detail-label">Based In</span>
                  <span className="about-detail-value">Ali Mendjeli, Constantine</span>
                </div>
                <div className="about-detail-item">
                  <span className="about-detail-label">Email</span>
                  <span className="about-detail-value">anonymous26111@gmail.com</span>
                </div>
                <div className="about-detail-item">
                  <span className="about-detail-label">Phone</span>
                  <span className="about-detail-value">0793484581</span>
                </div>
                <div className="about-detail-item">
                  <span className="about-detail-label">Specialization</span>
                  <span className="about-detail-value">SecOps & AI Engineering</span>
                </div>
                <div className="about-detail-item">
                  <span className="about-detail-label">Availability</span>
                  <span className="about-detail-value" style={{ color: 'var(--accent)' }}>Available for Contracts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="services">
        <div className="container">
          <div className="section-header center">
            <div className="section-label reveal">Capabilities</div>
            <h2 className="section-title reveal reveal-delay-1">Full-Spectrum Engineering</h2>
            <p className="section-subtitle reveal reveal-delay-2">End-to-end solutions spanning security, software, and artificial intelligence.</p>
          </div>
          <div className="services-grid">
            <div className="service-card reveal">
              <div className="service-number">01</div>
              <div className="service-icon">🛡️</div>
              <h3>Cyber Security</h3>
              <p>Penetration testing, vulnerability assessment, and robust security architecture for enterprise applications.</p>
              <div className="service-arrow">→</div>
            </div>
            <div className="service-card reveal reveal-delay-1">
              <div className="service-number">02</div>
              <div className="service-icon">🎮</div>
              <h3>Game Development</h3>
              <p>Crafting immersive 2D/3D games with high-performance engines and complex AI-driven mechanics.</p>
              <div className="service-arrow">→</div>
            </div>
            <div className="service-card reveal reveal-delay-2">
              <div className="service-number">03</div>
              <div className="service-icon">🤖</div>
              <h3>AI & Machine Learning</h3>
              <p>Integrating advanced neural networks and predictive models into modern digital ecosystems.</p>
              <div className="service-arrow">→</div>
            </div>
            <div className="service-card reveal reveal-delay-3">
              <div className="service-number">04</div>
              <div className="service-icon">🌐</div>
              <h3>Web Development</h3>
              <p>Building scalable, secure, and ultra-fast web applications using the latest full-stack technologies.</p>
              <div className="service-arrow">→</div>
            </div>
            <div className="service-card reveal reveal-delay-4">
              <div className="service-number">05</div>
              <div className="service-icon">📱</div>
              <h3>Mobile Applications</h3>
              <p>High-end native and cross-platform mobile experiences with security-first implementation.</p>
              <div className="service-arrow">→</div>
            </div>
            <div className="service-card reveal reveal-delay-5">
              <div className="service-number">06</div>
              <div className="service-icon">🔐</div>
              <h3>Ethical Hacking</h3>
              <p>Identifying system weaknesses before malicious actors do, providing comprehensive security audits.</p>
              <div className="service-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="container">
          <div className="section-header center">
            <div className="section-label reveal">Tech Stack</div>
            <h2 className="section-title reveal reveal-delay-1">Tools of the Trade</h2>
            <p className="section-subtitle reveal reveal-delay-2">A high-performance toolkit refined through intense professional practice.</p>
          </div>
          <div className="skills-layout">
            <div className="skills-group reveal">
              <h4>Security & Backend</h4>
              <div className="skill-row">
                <div className="skill-row-header">
                  <span className="skill-row-name">Penetration Testing / Kali</span>
                  <span className="skill-row-value">98%</span>
                </div>
                <div className="skill-track"><div className="skill-fill" data-width="98"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-row-header">
                  <span className="skill-row-name">Python / AI Frameworks</span>
                  <span className="skill-row-value">95%</span>
                </div>
                <div className="skill-track"><div className="skill-fill" data-width="95"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-row-header">
                  <span className="skill-row-name">C++ / Game Engines (Unreal/Unity)</span>
                  <span className="skill-row-value">92%</span>
                </div>
                <div className="skill-track"><div className="skill-fill" data-width="92"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-row-header">
                  <span className="skill-row-name">Network Security / OWASP</span>
                  <span className="skill-row-value">94%</span>
                </div>
                <div className="skill-track"><div className="skill-fill" data-width="94"></div></div>
              </div>
            </div>
            <div className="skills-group reveal reveal-delay-2">
              <h4>Web & Mobile Engineering</h4>
              <div className="skill-row">
                <div className="skill-row-header">
                  <span className="skill-row-name">React / Next.js / Node.js</span>
                  <span className="skill-row-value">96%</span>
                </div>
                <div className="skill-track"><div className="skill-fill" data-width="96"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-row-header">
                  <span className="skill-row-name">React Native / Flutter</span>
                  <span className="skill-row-value">90%</span>
                </div>
                <div className="skill-track"><div className="skill-fill" data-width="90"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-row-header">
                  <span className="skill-row-name">PostgreSQL / MongoDB</span>
                  <span className="skill-row-value">93%</span>
                </div>
                <div className="skill-track"><div className="skill-fill" data-width="93"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-row-header">
                  <span className="skill-row-name">Docker / Kubernetes / CI/CD</span>
                  <span className="skill-row-value">88%</span>
                </div>
                <div className="skill-track"><div className="skill-fill" data-width="88"></div></div>
              </div>
            </div>
          </div>
          <div className="tools-grid reveal" style={{ marginTop: '64px' }}>
            <div className="tool-item"><div className="tool-item-icon">🛡️</div><div className="tool-item-name">CyberSec</div></div>
            <div className="tool-item"><div className="tool-item-icon">🎮</div><div className="tool-item-name">Unity/UE</div></div>
            <div className="tool-item"><div className="tool-item-icon">⚛️</div><div className="tool-item-name">React</div></div>
            <div className="tool-item"><div className="tool-item-icon">🐍</div><div className="tool-item-name">Python</div></div>
            <div className="tool-item"><div className="tool-item-icon">🤖</div><div className="tool-item-name">AI/ML</div></div>
            <div className="tool-item"><div className="tool-item-icon">🐳</div><div className="tool-item-name">Docker</div></div>
            <div className="tool-item"><div className="tool-item-icon">🐘</div><div className="tool-item-name">SQL</div></div>
            <div className="tool-item"><div className="tool-item-icon">📱</div><div className="tool-item-name">Mobile</div></div>
          </div>
        </div>
      </section>

      <div className="numbers-section">
        <div className="container">
          <div className="numbers-grid">
            <div className="number-item reveal">
              <div className="number-value"><span className="count-up" data-target="120">0</span>+</div>
              <div className="number-label">Systems Secured</div>
            </div>
            <div className="number-item reveal reveal-delay-1">
              <div className="number-value"><span className="count-up" data-target="15">0</span>+</div>
              <div className="number-label">Games Launched</div>
            </div>
            <div className="number-item reveal reveal-delay-2">
              <div className="number-value"><span className="count-up" data-target="3">0</span>+</div>
              <div className="number-label">Years Pro Experience</div>
            </div>
            <div className="number-item reveal reveal-delay-3">
              <div className="number-value"><span className="count-up" data-target="45">0</span>+</div>
              <div className="number-label">AI Implementations</div>
            </div>
          </div>
        </div>
      </div>

      <section className="section section-alt" id="projects">
        <div className="container">
          <div className="projects-header">
            <div>
              <div className="section-label reveal">Classified Projects</div>
              <h2 className="section-title reveal reveal-delay-1">Featured Case Studies</h2>
            </div>
            <div className="project-filters reveal reveal-delay-2">
              <button className="filter-btn active" data-filter="all" onClick={handleFilterClick}>All</button>
              <button className="filter-btn" data-filter="security" onClick={handleFilterClick}>Security</button>
              <button className="filter-btn" data-filter="game" onClick={handleFilterClick}>Games</button>
              <button className="filter-btn" data-filter="ai" onClick={handleFilterClick}>AI/Web</button>
            </div>
          </div>
          <div className="projects-list">
            <div className="project-item reveal" data-category="security">
              <div className="project-image-section">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" 
                  alt="Security Project" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="project-info-section">
                <div className="project-category">Security Protocol</div>
                <h3>Guardian Sentinel X</h3>
                <p>Advanced real-time intrusion detection system using neural networks to identify and neutralize zero-day threats in enterprise cloud networks.</p>
                <div className="project-tech-tags">
                  <span className="project-tech-tag">Python</span>
                  <span className="project-tech-tag">TensorFlow</span>
                  <span className="project-tech-tag">CyberSec</span>
                  <span className="project-tech-tag">AWS</span>
                </div>
                <a href="#" className="project-link">Analyze Breach Report →</a>
              </div>
            </div>
            <div className="project-item reveal" data-category="game">
              <div className="project-image-section">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" 
                  alt="Game Project" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="project-info-section">
                <div className="project-category">Immersive Game</div>
                <h3>CyberShift: Origins</h3>
                <p>A high-fidelity cyberpunk RPG built in Unreal Engine 5, featuring procedurally generated environments and advanced NPC behavior logic.</p>
                <div className="project-tech-tags">
                  <span className="project-tech-tag">C++</span>
                  <span className="project-tech-tag">Unreal Engine 5</span>
                  <span className="project-tech-tag">AI</span>
                </div>
                <a href="#" className="project-link">Explore Universe →</a>
              </div>
            </div>
            <div className="project-item reveal" data-category="ai">
              <div className="project-image-section">
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" 
                  alt="Web Project" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="project-info-section">
                <div className="project-category">AI-SaaS Platform</div>
                <h3>NeuralSync Dashboard</h3>
                <p>Next-generation management dashboard for AI-driven logistics, integrating real-time predictive analytics and secure API endpoints.</p>
                <div className="project-tech-tags">
                  <span className="project-tech-tag">Next.js</span>
                  <span className="project-tech-tag">GraphQL</span>
                  <span className="project-tech-tag">Node.js</span>
                </div>
                <a href="#" className="project-link">View Demo →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="experience">
        <div className="container">
          <div className="section-header center">
            <div className="section-label reveal">Timeline</div>
            <h2 className="section-title reveal reveal-delay-1">Professional Journey</h2>
            <p className="section-subtitle reveal reveal-delay-2">A history of technical excellence and strategic innovation.</p>
          </div>
          <div className="experience-list">
            <div className="experience-item reveal">
              <div className="experience-year">2021 — Present</div>
              <div className="experience-role">
                <h4>Lead Security Architect</h4>
                <div className="experience-company">EliteTech Solutions • Hybrid</div>
                <p className="experience-desc">Directing security operations for international fintech platforms. Oversaw the successful transition to a zero-trust architecture and reduced system vulnerabilities by 85%.</p>
              </div>
            </div>
            <div className="experience-item reveal">
              <div className="experience-year">2019 — 2021</div>
              <div className="experience-role">
                <h4>Senior Game Engineer</h4>
                <div className="experience-company">Nova Games Studio • remote</div>
                <p className="experience-desc">Led the core engine development for three major titles. Optimized shader performance and implemented custom physics engines for VR/AR experiences.</p>
              </div>
            </div>
            <div className="experience-item reveal">
              <div className="experience-year">2017 — 2019</div>
              <div className="experience-role">
                <h4>Full-Stack AI Developer</h4>
                <div className="experience-company">Nexus Intelligence • Algiers</div>
                <p className="experience-desc">Developed and deployed automated trading bots and secure web portals for high-frequency data analysis using Python and React.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="testimonials">
        <div className="container">
          <div className="section-header center">
            <div className="section-label reveal">Endorsements</div>
            <h2 className="section-title reveal reveal-delay-1">Industry Feedback</h2>
            <p className="section-subtitle reveal reveal-delay-2">What global collaborators say about Tayeb's engineering precision.</p>
          </div>
          <div className="testimonials-container reveal">
            <div className="testimonial-slider">
              <div className="testimonial-track" id="testimonialTrack">
                <div className="testimonial-slide">
                  <div className="testimonial-stars">★ ★ ★ ★ ★</div>
                  <p className="testimonial-text">"Tayeb is a rare talent who can bridge the gap between high-end creative design and hardcore security engineering. His work on our game engine was impeccable."</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">🎮</div>
                    <div>
                      <div className="testimonial-name">David Vonderhaar</div>
                      <div className="testimonial-position">Creative Director, Activision</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-slide">
                  <div className="testimonial-stars">★ ★ ★ ★ ★</div>
                  <p className="testimonial-text">"The security infrastructure Tayeb built for us is world-class. We've weathered multiple attacks without a single breach. He is the ultimate guardian for digital assets."</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">🛡️</div>
                    <div>
                      <div className="testimonial-name">Sarah Connor</div>
                      <div className="testimonial-position">CTO, Cyberdyne Systems</div>
                    </div>
                  </div>
                </div>
                <div className="testimonial-slide">
                  <div className="testimonial-stars">★ ★ ★ ★ ★</div>
                  <p className="testimonial-text">"Tayeb's AI implementation transformed our data processing from hours to milliseconds. His code is clean, efficient, and profoundly secure."</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">🤖</div>
                    <div>
                      <div className="testimonial-name">Elon Reeve</div>
                      <div className="testimonial-position">CEO, Neural-Link</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-controls">
              <button className="testimonial-btn" id="prevTestimonial">←</button>
              <div className="testimonial-dots">
                <button className="testimonial-dot active" data-index="0"></button>
                <button className="testimonial-dot" data-index="1"></button>
                <button className="testimonial-dot" data-index="2"></button>
              </div>
              <button className="testimonial-btn" id="nextTestimonial">→</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info">
              <div className="section-label reveal">Initiate Contact</div>
              <h3 className="reveal reveal-delay-1">Let's Secure the <span>Future</span></h3>
              <p className="reveal reveal-delay-2">Whether you need an impenetrable security audit, a high-performance game, or a secure AI-driven application, I'm ready to architect your solution.</p>
              <div className="contact-methods reveal reveal-delay-3">
                <a href="mailto:anonymous26111@gmail.com" className="contact-method">
                  <div className="contact-method-icon">📧</div>
                  <div>
                    <div className="contact-method-label">Direct Email</div>
                    <div className="contact-method-value">anonymous26111@gmail.com</div>
                  </div>
                </a>
                <a href="tel:0793484581" className="contact-method">
                  <div className="contact-method-icon">📞</div>
                  <div>
                    <div className="contact-method-label">Secure Line</div>
                    <div className="contact-method-value">0793484581</div>
                  </div>
                </a>
                <div className="contact-method">
                  <div className="contact-method-icon">📍</div>
                  <div>
                    <div className="contact-method-label">Operations Base</div>
                    <div className="contact-method-value">Ali Mendjeli, Constantine</div>
                  </div>
                </div>
              </div>
              <div className="contact-socials reveal reveal-delay-4">
                <a href="#" className="social-link" title="GitHub">GH</a>
                <a href="#" className="social-link" title="LinkedIn">IN</a>
                <a href="#" className="social-link" title="Twitter/X">X</a>
                <a href="#" className="social-link" title="Dribbble">DR</a>
              </div>
            </div>
            <div className="contact-form-wrapper reveal">
              <form id="contactForm" onSubmit={handleContactSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" required />
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@company.com" required />
                  </div>
                  <div className="form-field">
                    <label>Inquiry Type</label>
                    <select required>
                      <option value="">Select Service</option>
                      <option value="security">Security Audit</option>
                      <option value="game">Game Development</option>
                      <option value="ai">AI Integration</option>
                      <option value="web">Web/Mobile App</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Budget Range</label>
                    <select>
                      <option value="">Select Range</option>
                      <option value="5k-15k">$5,000 — $15,000</option>
                      <option value="15k-30k">$15,000 — $30,000</option>
                      <option value="30k-60k">$30,000 — $60,000</option>
                      <option value="60k+">$60,000+</option>
                    </select>
                  </div>
                  <div className="form-field full">
                    <label>Mission Brief</label>
                    <textarea placeholder="Describe your project goals, technical requirements, and timeline..." required></textarea>
                  </div>
                  <div className="form-field full">
                    <button type="submit" className="form-submit" id="submitBtn">Send Mission Brief →</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <h3>Tayeb<em>.</em></h3>
              <p>Cyber Security Expert & Full-Stack Engineer crafting exceptional digital experiences from Constantine to the world.</p>
            </div>
            <div className="footer-col">
              <h4>Directives</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#projects">Work</a></li>
                <li><a href="#experience">History</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Capabilities</h4>
              <ul>
                <li><a href="#">Security Audit</a></li>
                <li><a href="#">Game Design</a></li>
                <li><a href="#">AI Systems</a></li>
                <li><a href="#">App Dev</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Secure Channels</h4>
              <ul>
                <li><a href="#">GitHub</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Twitter / X</a></li>
                <li><a href="#">Dribbble</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Tayeb. All rights reserved. Secured with RSA-4096.</p>
            <div className="footer-bottom-links">
              <a href="#">Security Policy</a>
              <a href="#">Terms of Engagement</a>
            </div>
          </div>
        </div>
      </footer>

      <button className="back-to-top" id="backToTop" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </div>
  );
}

export default App;
