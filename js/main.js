// פעמונית – סקריפט קטן: הודעת טופס ותמונות מתחלפות בכרטיסים

// כרטיס עם כמה תמונות: חיצים, נקודות, והחלקה (הגלילה עצמה ב-CSS)
document.querySelectorAll('.card-slider').forEach((slider) => {
  const track = slider.querySelector('.slides');
  const slides = [...track.children];
  const prev = slider.querySelector('.slide-prev');
  const next = slider.querySelector('.slide-next');
  const dotsBox = slider.querySelector('.slide-dots');
  const dots = slides.map(() => dotsBox.appendChild(document.createElement('span')));
  let current = 0;

  const update = () => {
    dots.forEach((d, i) => d.classList.toggle('on', i === current));
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

// עד שהטופס יחובר (data-ready="true" ב-index.html) מציגים הודעה במקום לשלוח
const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', (e) => {
    if (form.dataset.ready !== 'true') {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'הטופס עדיין לא מחובר. בינתיים אפשר לכתוב לנו בוואטסאפ או להתקשר.';
      }
    }
  });
}
