// services-page.js

(function () {

  const services = {
    urine: {
      title: "Urine Test",
      short: "Fast laboratory test for detecting infections and kidney disorders.",
      img: "../images/анализКала.jpg"
    },
    stool: {
      title: "Stool Test",
      short: "Test for digestive problems and parasite detection.",
      img: "../images/анализКала.jpg"
    },
    blood: {
      title: "Blood Test",
      short: "General and biochemical blood analysis.",
      img: "../images/анализКрови.jpg"
    },
    xray: {
      title: "X-Ray",
      short: "Radiology imaging for bones and internal organs.",
      img: "../images/Ренгтен.png"
    },
    ecg: {
      title: "ECG",
      short: "Heart rhythm and cardiac activity examination.",
      img: "../images/ЭКГ.png"
    },
    ultrasound: {
      title: "Ultrasound",
      short: "Safe ultrasound imaging of internal organs.",
      img: "../images/УЗИ.jpg"
    },
    mri: {
      title: "MRI",
      short: "High-resolution magnetic resonance imaging.",
      img: "../images/МРТ.jpg"
    },
    vaccination: {
      title: "Vaccination",
      short: "Preventive vaccination against infectious diseases.",
      img: "../images/Вакцинация.jpeg"
    },
    physiotherapy: {
      title: "Physiotherapy",
      short: "Rehabilitation and recovery procedures.",
      img: "../images/Физиотерапия.jpg"
    },
    dentistry: {
      title: "Dentistry",
      short: "Dental care and oral treatment services.",
      img: "../images/Стоматология.jpeg"
    },
    ophthalmology: {
      title: "Ophthalmology",
      short: "Eye examination and vision diagnostics.",
      img: "../images/Офтальмология.webp"
    },
    endocrinology: {
      title: "Endocrinology",
      short: "Hormonal and metabolic disorder treatment.",
      img: "../images/Эндокринология.jpg"
    }
  };

  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const moreBtn = document.getElementById("moreBtn");

  document.querySelectorAll(".service-card img").forEach(img => {
    img.addEventListener("click", () => {
      const key = img.dataset.service;
      const s = services[key];
      if (!s) return;

      modalImg.src = s.img;
      modalTitle.innerText = s.title;
      modalDesc.innerText = s.short;
      moreBtn.href = "services-detail.html?id=" + key;

      modal.style.display = "flex";
    });
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  const badge = document.getElementById("crtBadge");
  if (badge) {
    badge.onclick = () => {
      window.location.href = "../buyToken.html";
    };
  }

  if (window.ethereum && typeof initializeAndUpdateBadge === "function") {
    initializeAndUpdateBadge();

    ethereum.on("accountsChanged", initializeAndUpdateBadge);
    ethereum.on("chainChanged", () => location.reload());
  }

})();
