document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const btn = document.getElementById("feedbackBtn");
  const close = document.querySelector(".close");
  const form = document.getElementById("feedbackForm");

  // Open modal
  btn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Close modal when clicking X
  close.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✅ Thank you for your feedback!");
    modal.style.display = "none";
    form.reset();
  });
});

/* =========================
   HERO SLIDER / GALLERY + TEXT
========================= */
const hero = document.querySelector(".hero");
const heroTitle = document.querySelector(".hero-text h2");
const heroDesc = document.querySelector(".hero-text p:nth-of-type(1)");
const heroInfo = document.querySelector(".hero-text p:nth-of-type(2)");

if (hero && heroTitle && heroDesc && heroInfo) {
  // Your slider data (image + author + description)
  const slides = [
    {
      img: "/img/maxresdefault.jpg",
      title: "LAUFEY",
      desc: "A PLAYLIST",
      info: "From bedrooms and broom closets to studios and stadiums, SoundCloud is where you define what’s next in music. Just hit upload."
    },
    {
      img: "/img/xxxtentacion.jpg",
      title: "XXXTENTACION",
      desc: "AMERICAN ARTIST",
      info: "One of the world’s biggest rap artists. Famous for mixing rap with R&B vibes."
    },
    {
      img: "/img/BillieEilish.jpg",
      title: "BILLIE EILISH",
      desc: "SINGER & SONGWRITER",
      info: "Known for her unique voice and emotional lyrics that connect deeply with listeners."
    },
    {
      img: "/img/PostMalone.jpg",
      title: "POST MALONE",
      desc: "RAPPER & PRODUCER",
      info: "Blending genres from hip-hop to rock, Post Malone dominates modern music charts."
    }
  ];

  let current = 0;

  // Create navigation dots
  const dotsContainer = document.createElement("div");
  dotsContainer.style.position = "absolute";
  dotsContainer.style.bottom = "10px";
  dotsContainer.style.left = "50%";
  dotsContainer.style.transform = "translateX(-50%)";
  dotsContainer.style.display = "flex";
  dotsContainer.style.gap = "6px";

  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.style.width = "10px";
    dot.style.height = "10px";
    dot.style.borderRadius = "50%";
    dot.style.background = i === 0 ? "white" : "rgba(255,255,255,0.5)";
    dot.style.cursor = "pointer";
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  hero.appendChild(dotsContainer);

  const dots = dotsContainer.querySelectorAll("span");

  function goToSlide(n) {
    current = n;
    const slide = slides[current];
    hero.style.backgroundImage = `url('${slide.img}')`;

    // Change text
    heroTitle.textContent = slide.title;
    heroDesc.textContent = slide.desc;
    heroInfo.textContent = slide.info;

    dots.forEach((d, i) => d.style.background = i === current ? "white" : "rgba(255,255,255,0.5)");
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    goToSlide(current);
  }

  setInterval(nextSlide, 4000); // Auto slide every 4s

  // Init first slide
  goToSlide(0);
}

/* =========================
   FAQ ACCORDION
========================= */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const btn = item.querySelector(".faq-question");
  btn.addEventListener("click", () => {
    item.classList.toggle("active");
    const span = btn.querySelector("span");
    span.textContent = item.classList.contains("active") ? "−" : "+";
  });
});

/* =========================
   SMOOTH SCROLL
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});
