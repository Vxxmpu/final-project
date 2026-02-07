// services-detail.js

(function () {

  const CRT_PRICE_USD = 100;

  const services = {
    urine:{ title:"Urine Test", priceUsd:10 },
    stool:{ title:"Stool Test", priceUsd:10 },
    blood:{ title:"Blood Test", priceUsd:14 },
    xray:{ title:"X-Ray", priceUsd:30 },
    ecg:{ title:"ECG", priceUsd:16 },
    ultrasound:{ title:"Ultrasound", priceUsd:40 },
    mri:{ title:"MRI", priceUsd:120 },
    vaccination:{ title:"Vaccination", priceUsd:20 },
    physiotherapy:{ title:"Physiotherapy", priceUsd:24 },
    dentistry:{ title:"Dentistry", priceUsd:50 },
    ophthalmology:{ title:"Ophthalmology", priceUsd:36 },
    endocrinology:{ title:"Endocrinology", priceUsd:30 }
  };

  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  const id = getParam("id");
  const s = services[id];

  if (!s) return;

  const payCard = document.querySelector(".pay-card");
  const payToken = document.querySelector(".pay-token");
  const payOnsite = document.querySelector(".pay-onsite");

  const priceCRT = s.priceUsd / CRT_PRICE_USD;

  if (payOnsite) {
    payOnsite.onclick = () => {
      alert("Pay at clinic: " + s.priceUsd + " USD");
    };
  }

  if (payCard) {
    payCard.onclick = () => {
      location.href =
        `../pay.html?method=card&id=${id}&usd=${s.priceUsd}`;
    };
  }

  if (payToken) {
    payToken.onclick = () => {
      location.href =
        `../pay.html?method=token&id=${id}&crt=${priceCRT}&name=${encodeURIComponent(s.title)}`;
    };
  }

})();
