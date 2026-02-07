// services-page.js — extracted from services.html to avoid inline scripts (CSP-friendly)
(async function(){
  // Static services mapping (fallback)
  const services = {
    urine: {title: 'Анализ мочи', short: 'Быстрый тест для выявления инфекций и нарушений мочеполовой системы. Результаты готовы в течение одного дня.', img: '../images/анализКала.jpg'},
    stool: {title: 'Анализ кала', short: 'Диагностика паразитов и пищеварительных нарушений. Помогает выявить проблемы с пищеварением и инфекции.', img: '../images/анализКала.jpg'},
    blood: {title: 'Анализ крови', short: 'Общий и биохимический анализ для оценки состояния организма. Выявляет анемию, инфекции и нарушения обмена веществ.', img: '../images/анализКрови.jpg'},
    xray: {title: 'Рентген', short: 'Изображения костей и органов для диагностики травм и заболеваний. Быстрое и безопасное обследование груди, рук и ног.', img: '../images/Ренгтен.png'},
    ecg: {title: 'ЭКГ', short: 'Оценка работы сердца и ритма. Выявляет аритмии, ишемию и другие сердечные нарушения в течение 10 минут.', img: '../images/ЭКГ.png'},
    ultrasound: {title: 'УЗИ', short: 'Безопасное исследование внутренних органов без излучения. Применяется для диагностики органов брюшной полости и сосудов.', img: '../images/УЗИ.jpg'},
    mri: {title: 'МРТ', short: 'Подробная картина тканей и органов высокого разрешения. Идеально для диагностики опухолей и заболеваний головного мозга.', img: '../images/МРТ.jpg'},
    vaccination: {title: 'Вакцинация', short: 'Профилактика инфекций с использованием современных вакцин. Защита от гриппа, пневмонии и других опасных заболеваний.', img: '../images/Вакцинация.jpeg'},
    physiotherapy: {title: 'Физиотерапия', short: 'Процедуры для восстановления после травм и операций. Включает массаж, электротерапию и другие эффективные методы.', img: '../images/Физиотерапия.jpg'},
    dentistry: {title: 'Стоматология', short: 'Профилактика и лечение зубов и десен. Чистка, пломбирование и консультация по гигиене полости рта.', img: '../images/Стоматология.jpeg'},
    ophthalmology: {title: 'Офтальмология', short: 'Осмотр зрения и лечение глазных заболеваний. Проверка остроты зрения, диагностика катаракты и глаукомы.', img: '../images/Офтальмология.webp'},
    endocrinology: {title: 'Эндокринология', short: 'Диагностика и лечение гормональных нарушений. Управление диабетом, проблемами щитовидной железы и метаболизма.', img: '../images/Эндокринология.jpg'}
  };

  // Modal handling
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const moreBtn = document.getElementById('moreBtn');

  document.querySelectorAll('.service-card img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      const key = img.dataset.service;
      const s = services[key];
      if (!s) return;
      modalImg.src = s.img;
      modalImg.alt = s.title;
      modalTitle.textContent = s.title;
      modalDesc.textContent = s.short;
      moreBtn.href = 'services-detail.html?id=' + encodeURIComponent(key);
      modal.style.display = 'flex';
    });
  });

  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  // CRT badge click
  (function attachBadge(){
    const badge = document.getElementById("crtBadge");
    if (!badge) return;

    badge.addEventListener("click", () => {
      const path = location.pathname.includes('/service-HTML/') ? '../buyToken.html' : 'buyToken.html';
      window.location.href = path;
    });
  })();

  // Try to load services from database and replace static list if present
  (async function() {
    try {
      const servicesFromDb = await dbFunctions.getServices();
      if (!servicesFromDb || servicesFromDb.length === 0) return; // keep static fallback

      const main = document.querySelector('main');
      main.innerHTML = servicesFromDb.map(s => `
        <div class="service-card">
          <img src="${s.image_url || '../images/анализКала.jpg'}" alt="${s.name || s.title}" data-service-id="${s.id}">
          <p>${s.name || s.title}</p>
        </div>
      `).join('');

      // Wire up clicks to open details page (use DB id)
      document.querySelectorAll('.service-card img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
          const id = img.dataset.serviceId;
          window.location.href = 'services-detail.html?id=' + encodeURIComponent(id);
        });
      });
    } catch (err) {
      console.error('Failed to load services from DB:', err);
    }
  })();

  // Initialize badge using app.js helper if available
  // Also manually check localStorage for saved wallet and try to load balance immediately
  (async function initBadgeImmediately() {
    // Try using global function first (from app.js)
    if (typeof initializeAndUpdateBadge === 'function') {
      try { await initializeAndUpdateBadge(); } catch(e){ console.error('Error in initializeAndUpdateBadge:', e); }
    }
  })();

  // account and chain listeners
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async () => {
      if (typeof initializeAndUpdateBadge === 'function') {
        try{ await initializeAndUpdateBadge(); } catch(e){ console.error(e); }
      }
    });
    window.ethereum.on("chainChanged", () => { window.location.reload(); });
  }
})();