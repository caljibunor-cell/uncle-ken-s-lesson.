/* ==========================================================================
   Uncle Ken's Lesson - website scripts
   Sections:  1. Settings   2. Theme   3. Mobile menu   4. Active menu link
              5. Animated stats   6. Enrolment form
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. SETTINGS  (the only part you normally need to edit)
   -------------------------------------------------------------------------- */
const CONFIG = {
  // Get a free key at https://web3forms.com (enter the email that should receive enrolments).
  // Until you paste your key, the form opens WhatsApp instead.
  accessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
  whatsappNumber: '2348033932763',
  phoneDisplay: '+234 803 393 2763',
};

/* Small helpers */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* --------------------------------------------------------------------------
   2. THEME  (light / dark, remembered on the visitor's device)
   -------------------------------------------------------------------------- */
function initTheme() {
  const root = document.documentElement;

  try {
    const saved = localStorage.getItem('ukl-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved) root.dataset.theme = saved;
    else if (prefersDark) root.dataset.theme = 'dark';
  } catch (error) { /* storage unavailable - ignore */ }

  $('#theme-button').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('ukl-theme', next); } catch (error) { /* ignore */ }
  });
}


/* --------------------------------------------------------------------------
   3. MOBILE MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const nav = $('#nav');
  const button = $('#menu-button');

  const setOpen = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    button.setAttribute('aria-expanded', isOpen);
  };

  button.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  $$('#nav a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
}


/* --------------------------------------------------------------------------
   4. ACTIVE MENU LINK  (highlights the section you are viewing)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const links = [...$$('#nav a')];
  const sectionIds = ['home', 'about', 'courses', 'why', 'enrol', 'contact'];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}


/* --------------------------------------------------------------------------
   5. ANIMATED STATS  (numbers count up when scrolled into view)
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const strip = $('.stats');
  let hasRun = false;

  const countUp = (element) => {
    const target = Number(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const step = Math.max(1, Math.ceil(target / 40));
    let value = 0;

    const timer = setInterval(() => {
      value = Math.min(target, value + step);
      element.textContent = value + suffix;
      if (value >= target) clearInterval(timer);
    }, 30);
  };

  const observer = new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting || hasRun) return;
    hasRun = true;
    $$('.stats__number').forEach(countUp);
    obs.disconnect();
  }, { threshold: 0.4 });

  observer.observe(strip);
}


/* --------------------------------------------------------------------------
   6. ENROLMENT FORM
      - With an access key: sends the details to your email, shows a thank-you.
      - Without a key: falls back to opening WhatsApp with the details filled in.
   -------------------------------------------------------------------------- */
function initEnrolForm() {
  const form = $('#enrol-form');
  const button = $('#send-button');
  const message = $('#form-message');

  const showMessage = (text, type) => {
    message.textContent = text;
    message.className = type || '';
  };

  const openWhatsApp = (data) => {
    const text =
      "Hello Uncle Ken's Lesson, I'd like to enrol.\n" +
      `Parent: ${data.parent_name}\n` +
      `Phone: ${data.phone}\n` +
      `Student: ${data.student_name}\n` +
      `Class: ${data.class}\n` +
      `Exam: ${data.exam}\n` +
      `Subjects: ${data.subjects}`;
    window.location.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const sendToEmail = async (data) => {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: CONFIG.accessKey,
        subject: "New enrolment - Uncle Ken's Lesson",
        from_name: "Uncle Ken's Lesson website",
        ...data,
      }),
    });
    const result = await response.json();
    if (!result.success) throw new Error('Send failed');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    data.subjects = data.subjects || 'Not stated';

    const keyIsMissing = CONFIG.accessKey.startsWith('YOUR_');
    if (keyIsMissing) return openWhatsApp(data);

    button.disabled = true;
    button.textContent = 'Sending...';
    showMessage('');

    try {
      await sendToEmail(data);
      form.reset();
      showMessage('Thank you! Your enrolment has been sent. We will contact you shortly.', 'is-success');
    } catch (error) {
      showMessage(`Sorry, it could not be sent. Please call ${CONFIG.phoneDisplay}.`, 'is-error');
    } finally {
      button.disabled = false;
      button.textContent = 'Send Enrolment';
    }
  });
}


/* --------------------------------------------------------------------------
   START
   -------------------------------------------------------------------------- */
initTheme();
initMobileMenu();
initScrollSpy();
initStatsCounter();
initEnrolForm();
