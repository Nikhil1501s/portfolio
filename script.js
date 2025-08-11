// Simple, self-contained JS for interactions
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  const yearSpan = document.getElementById('year');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // Set year
  yearSpan.textContent = new Date().getFullYear();

  // Theme: persist in localStorage
  const THEME_KEY = 'stellar_theme';
  function applyTheme(theme){
    if(theme === 'light'){
      document.documentElement.classList.add('light');
      themeToggle.textContent = '🌞';
      themeToggle.setAttribute('aria-pressed','true');
    } else {
      document.documentElement.classList.remove('light');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed','false');
    }
  }
  const stored = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(stored);

  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
    // small animate
    themeToggle.animate([{transform:'rotate(0)'},{transform:'rotate(360deg)'}],{duration:420});
  });

  // Mobile nav
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile nav if open
        if(navList.classList.contains('show')){
          navList.classList.remove('show');
          navToggle.setAttribute('aria-expanded','false');
        }
      }
    });
  });

  // Gallery lightbox
  galleryItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.src;
      lbImg.src = src;
      lbImg.alt = btn.querySelector('img').alt || 'Gallery image';
      lightbox.setAttribute('aria-hidden','false');
      // trap focus to close button
      lbClose.focus();
    });
  });

  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e)=> {
    if(e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeLightbox();
  });

  // Contact form: client-side validation + fake submit
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    clearErrors();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    let ok = true;

    if(name.length < 2){ setError('err-name','Please enter your name (2+ characters)'); ok=false; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setError('err-email','Enter a valid email address'); ok=false; }
    if(message.length < 10){ setError('err-message','Message must be at least 10 characters'); ok=false; }

    if(!ok) return;

    // Fake submit: show spinner, then success
    formStatus.textContent = 'Sending message...';
    formStatus.style.color = 'var(--muted)';
    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;

    // Simulate network latency (no background tasks; everything happens here)
    setTimeout(()=>{
      submitBtn.disabled = false;
      contactForm.reset();
      formStatus.textContent = 'Thanks! Your message has been received. We’ll be in touch soon.';
      formStatus.style.color = 'var(--accent)';
      // clear after a while
      setTimeout(()=> formStatus.textContent = '', 7000);
    }, 1100);
  });

  function setError(id, msg){
    const el = document.getElementById(id);
    if(el){ el.textContent = msg; }
  }
  function clearErrors(){
    ['err-name','err-email','err-message'].forEach(id=>{
      const el = document.getElementById(id);
      if(el) el.textContent = '';
    });
  }

  // Prefers-color-scheme fallback if no localStorage set
  if(!localStorage.getItem(THEME_KEY)){
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }

  // Small accessibility: close nav on focusout when clicking outside
  document.addEventListener('click', (e) => {
    if(!navList.contains(e.target) && !navToggle.contains(e.target)){
      if(navList.classList.contains('show')){
        navList.classList.remove('show');
        navToggle.setAttribute('aria-expanded','false');
      }
    }
  });

})();
