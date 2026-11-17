// פעמונית – סקריפט קטן: הודעת טופס ושנה בתחתית

// טופס: עד שהטופס יחובר (data-ready="true" ב-index.html) מציגים הודעה במקום לשלוח
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

// שנה נוכחית בתחתית
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
