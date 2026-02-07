// services-detail.js — extracted inline script from services-detail.html
(function(){
  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  const services = {
    urine: {title: 'Анализ мочи', long: 'Лабораторное исследование для выявления инфекций, заболеваний почек и контроля уровня сахара. Анализ мочи помогает обнаружить проблемы с мочеполовой системой на ранней стадии. Результаты готовы в течение одного рабочего дня.', img: '../images/анализКала.jpg', price: 5000},
    stool: {title: 'Анализ кала', long: 'Тест для обнаружения паразитов, бактерий и проблем пищеварения. Это исследование выявляет нарушения в работе желудочно-кишечного тракта и помогает определить причину диареи или других проблем. Анализ особенно важен для выявления паразитов и кишечных инфекций.', img: '../images/анализКала.jpg', price: 5000},
    blood: {title: 'Анализ крови', long: 'Общий и биохимические анализы для оценки состояния крови и внутренних органов. Исследование выявляет анемию, инфекции и нарушения обмена веществ. Биохимический анализ показывает функцию печени, почек и уровень сахара.', img: '../images/анализКрови.jpg', price: 7000},
    xray: {title: 'Рентген', long: 'Рентгеновские снимки для диагностики переломов, патологий легких и других состояний. Метод быстрый и безопасный при правильном использовании. Позволяет выявить пневмонию, туберкулёз и другие заболевания органов грудной клетки.', img: '../images/Ренгтен.png', price: 15000},
    ecg: {title: 'ЭКГ', long: 'Исследование электрической активности сердца для выявления аритмий и ишемии. ЭКГ выполняется в течение 10 минут и дает информацию о работе сердца. Это первый тест при подозрении на сердечные проблемы.', img: '../images/ЭКГ.png', price: 8000},
    ultrasound: {title: 'УЗИ', long: 'Ультразвуковое исследование внутренних органов, безопасный и быстрый метод без излучения. УЗИ позволяет оценить размер, форму и структуру органов. Применяется для диагностики органов брюшной полости, почек и мочевого пузыря.', img: '../images/УЗИ.jpg', price: 20000},
    mri: {title: 'МРТ', long: 'Магнитно-резонансная томография для детальной визуализации мягких тканей. МРТ использует магнитные поля вместо рентгена и совершенно безопасна. Идеально для диагностики опухолей, заболеваний головного мозга и позвоночника.', img: '../images/МРТ.jpg', price: 60000},
    vaccination: {title: 'Вакцинация', long: 'Профилактические прививки для защиты от инфекционных заболеваний. Мы используем современные вакцины, одобренные ВОЗ. Вакцинация защищает от гриппа, пневмонии, кори и других опасных инфекций.', img: '../images/Вакцинация.jpeg', price: 10000},
    physiotherapy: {title: 'Физиотерапия', long: 'Процедуры восстановления и реабилитации после травм и операций. Физиотерапия помогает восстановить подвижность и уменьшить боль. Включает массаж, электротерапию, магнитотерапию и другие методы.', img: '../images/Физиотерапия.jpg', price: 12000},
    dentistry: {title: 'Стоматология', long: 'Лечение и профилактика заболеваний зубов и полости рта. Мы предлагаем чистку, пломбирование, удаление и имплантацию зубов. Консультация по правильной гигиене полости рта входит в каждый визит.', img: '../images/Стоматология.jpeg', price: 25000},
    ophthalmology: {title: 'Офтальмология', long: 'Диагностика и лечение заболеваний глаз, коррекция зрения. Проверка остроты зрения, диагностика катаракты, глаукомы и других проблем. Мы помогаем подобрать правильные очки или контактные линзы.', img: '../images/Офтальмология.webp', price: 18000},
    endocrinology: {title: 'Эндокринология', long: 'Диагностика и лечение гормональных нарушений и заболеваний щитовидной железы. Специалист управляет диабетом, проблемами щитовидной железы и метаболическими нарушениями. Индивидуальный подход к лечению каждого пациента.', img: '../images/Эндокринология.jpg', price: 15000}
  };

  // DOM elements
  const titleEl = document.getElementById('title');
  const descEl = document.getElementById('longDesc');
  const imgEl = document.getElementById('detailImg');
  const priceTableBody = document.getElementById('priceTableBody');
  const badge = document.getElementById("crtBadge");
  const payOnsite = document.querySelector('.pay-onsite');
  const payCard = document.querySelector('.pay-card');
  const payToken = document.querySelector('.pay-token');

  const id = getParam('id');
  let s = null;

  if (id && services[id]) {
    s = services[id];
  }

  if (!id || !s) {
    if (titleEl) titleEl.textContent = 'Услуга не найдена';
    if (descEl) descEl.textContent = 'Выберите услугу на странице услуг.';
    if (imgEl) imgEl.src = '';
    if (priceTableBody) priceTableBody.innerHTML = '';
  } else {
    if (titleEl) titleEl.textContent = s.title;
    if (descEl) descEl.textContent = s.long;
    if (imgEl) { imgEl.src = s.img; imgEl.alt = s.title; }

    if (priceTableBody) priceTableBody.innerHTML = `\n        <tr>\n          <td>${s.title}</td>\n          <td>${s.price.toLocaleString('ru-RU')} KZT</td>\n        </tr>\n      `;
  }

  // CRT Badge click handler
  if (badge) {
    badge.addEventListener("click", () => { 
      const path = location.pathname.includes('/service-HTML/') ? '../buyToken.html' : 'buyToken.html';
      window.location.href = path; 
    });
  }

  // Payment buttons
  if (payOnsite && s) {
    payOnsite.addEventListener('click', () => {
      alert(`Вы выбрали оплату на месте. Сумма: ${s.price.toLocaleString('ru-RU')} KZT`);
    });
  }

  if (payCard && s) {
    payCard.addEventListener('click', () => {
      alert(`Вы выбрали оплату картой. Сумма: ${s.price.toLocaleString('ru-RU')} KZT`);
    });
  }

  if (payToken && s) {
    payToken.addEventListener('click', async () => {
      const discount = 0.15;
      const charityPercent = 0.10;
      const priceCRT = s.price * (1 - discount);
      const charityAmount = priceCRT * charityPercent;
      const finalAmount = priceCRT - charityAmount;

      if (!confirm(
        `Вы оплачиваете токенами.\n` +
        `Цена со скидкой: ${priceCRT.toLocaleString('ru-RU')} KZT\n` +
        `Charity (10%): ${charityAmount.toLocaleString('ru-RU')} KZT\n` +
        `Итоговая сумма к списанию: ${finalAmount.toLocaleString('ru-RU')} KZT\n` +
        `Продолжить?`
      )) return;

      try {
        await redeem(finalAmount, s.title);
        alert('Услуга успешно оплачена токенами!');
      } catch (err) {
        console.error(err);
        alert('Ошибка при оплате токенами: ' + (err.reason || err.message));
      }
    });
  }

  // Initialize on page load (immediately, not waiting for load event)
  (async function initBadgeImmediately() {
    if (typeof initializeAndUpdateBadge === 'function') {
      try { await initializeAndUpdateBadge(); } catch(e){ console.error('Error in initializeAndUpdateBadge:', e); }
    }
  })();

  // Listen for account changes
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async () => {
      if (typeof initializeAndUpdateBadge === 'function') {
        try{ await initializeAndUpdateBadge(); } catch(e){ console.error(e); }
      }
    });
    
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  }
})();