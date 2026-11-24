// פעמונית – סקריפט קטן: הודעת טופס ותמונות מתחלפות בכרטיסים

// כרטיס עם כמה תמונות: חיצים והחלקה (הגלילה עצמה ב-CSS)
document.querySelectorAll('.card-slider').forEach((slider) => {
  const track = slider.querySelector('.slides');
  const slides = [...track.children];
  const prev = slider.querySelector('.slide-prev');
  const next = slider.querySelector('.slide-next');
  let current = 0;

  const update = () => {
    prev.hidden = current === 0;
    next.hidden = current === slides.length - 1;
  };
  const go = (i) => {
    const t = slides[Math.max(0, Math.min(slides.length - 1, i))];
    // גלילה של המסילה בלבד (בעברית הערך שלילי), בלי להזיז את הדף
    track.scrollTo({ left: t.offsetLeft - slides[0].offsetLeft, behavior: 'smooth' });
  };

  // איזו תמונה מוצגת עכשיו (גם אחרי החלקה באצבע)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { current = slides.indexOf(en.target); update(); }
    });
  }, { root: track, threshold: 0.6 });
  slides.forEach((s) => io.observe(s));

  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  update();
});

// תמונה מוגדלת: לחיצה על תמונה בכרטיס מוצר; חיצים אם יש בכרטיס כמה תמונות
const lb = document.querySelector('.lightbox');
if (lb && lb.showModal) {
  const lbImg = lb.querySelector('.lb-img');
  const lbPrev = lb.querySelector('.lb-prev');
  const lbNext = lb.querySelector('.lb-next');
  let group = [];
  let at = 0;

  const show = (i) => {
    at = Math.max(0, Math.min(group.length - 1, i));
    lbImg.src = group[at].currentSrc || group[at].src;
    lbImg.alt = group[at].alt;
    lbPrev.hidden = at === 0;
    lbNext.hidden = at === group.length - 1;
  };

  document.querySelectorAll('.card-media').forEach((media) => {
    const imgs = [...media.querySelectorAll('img')];
    imgs.forEach((img, i) => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      const open = () => { group = imgs; show(i); lb.showModal(); };
      img.addEventListener('click', open);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  });

  lbPrev.addEventListener('click', () => show(at - 1));
  lbNext.addEventListener('click', () => show(at + 1));
  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  // לחיצה על הרקע הכהה סוגרת
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  // חץ ימינה = הבאה, כמו מיקום הכפתור
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(at + 1);
    if (e.key === 'ArrowLeft') show(at - 1);
  });
}

// טופס יצירת קשר: נשלח ל-Netlify Forms ברקע, וההודעה מופיעה באותו מקום בעמוד
// (אם data-ready="false" ב-index.html, מציגים הודעה במקום לשלוח)
const form = document.getElementById('contact-form');

if (form) {
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const say = (text, ok) => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('ok', !!ok);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.dataset.ready !== 'true') {
      say('הטופס עדיין לא מחובר. בינתיים אפשר לכתוב לנו בוואטסאפ או להתקשר.');
      return;
    }
    if (button) button.disabled = true;
    say('שולחים...');
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        say('תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.', true);
      })
      .catch(() => {
        say('משהו השתבש בשליחה. אפשר לכתוב לנו בוואטסאפ או להתקשר.');
      })
      .finally(() => { if (button) button.disabled = false; });
  });
}
