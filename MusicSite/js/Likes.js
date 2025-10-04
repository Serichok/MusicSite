document.addEventListener("DOMContentLoaded", () => {
  // ---------- Dropdown Profile Menu ----------
  const profile = document.querySelector(".profile");
  const chev = document.querySelector(".chev");

  // Create dropdown dynamically
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown-menu");
  dropdown.style.cssText = `
    position: absolute;
    top: 70px;
    right: 30px;
    background: #111;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 10px 0;
    display: none;
    flex-direction: column;
    width: 180px;
    z-index: 2000;
  `;

  dropdown.innerHTML = `
    <a href="/html/Profile.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-user"></i> Profile</a>
    <a href="/html/Likes.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-heart"></i> Likes</a>
    <a href="/html/Stations.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-broadcast-tower"></i> Stations</a>
    <a href="/html/Playlist.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-music"></i> Tracks</a>
    <a href="/html/Login.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-sign-out-alt"></i> Log out</a>
  `;
  document.body.appendChild(dropdown);

  // Toggle dropdown
  profile.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!profile.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // ---------- Burger Menu ----------
  const nav = document.querySelector("nav");

  // Create burger button dynamically
  const burger = document.createElement("div");
  burger.classList.add("burger");
  burger.innerHTML = `<i class="fa fa-bars" style="font-size:22px;cursor:pointer;"></i>`;
  burger.style.display = "none";
  burger.style.cursor = "pointer";
  document.querySelector("header").insertBefore(burger, nav);

  // Apply responsive toggle
  const checkWidth = () => {
    if (window.innerWidth <= 600) {
      burger.style.display = "block";
      nav.style.display = "none";
    } else {
      burger.style.display = "none";
      nav.style.display = "flex";
    }
  };

  // Toggle nav on burger click
  burger.addEventListener("click", () => {
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.background = "#111";
    nav.style.position = "absolute";
    nav.style.top = "60px";
    nav.style.left = "0";
    nav.style.width = "100%";
    nav.style.padding = "10px 0";
    nav.style.textAlign = "center";
    nav.style.gap = "10px";
    nav.style.zIndex = "1500";
  });

  window.addEventListener("resize", checkWidth);
  checkWidth();
});



document.addEventListener("DOMContentLoaded", () => {
  // ====== FILTERING TRACKS ======
  const filterInput = document.querySelector(".filter-input");
  const trackItems = document.querySelectorAll(".track-item");

  filterInput.addEventListener("input", () => {
    const query = filterInput.value.toLowerCase().trim();

    trackItems.forEach((item) => {
      const trackName = item.querySelector(".track-name").textContent.toLowerCase();
      const artistName = item.querySelector(".artist-name").textContent.toLowerCase();

      if (trackName.includes(query) || artistName.includes(query)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });

  // ====== OPTIONAL: SORT BUTTON ======
  const filterContainer = document.querySelector(".filter-container");
  const sortBtn = document.createElement("button");
  sortBtn.textContent = "Sort A–Z";
  sortBtn.style.cssText = `
    margin-left: 10px;
    padding: 8px 14px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background: #333;
    color: white;
    font-weight: 600;
    transition: background 0.2s;
  `;
  sortBtn.addEventListener("mouseover", () => (sortBtn.style.background = "#444"));
  sortBtn.addEventListener("mouseout", () => (sortBtn.style.background = "#333"));

  filterContainer.appendChild(sortBtn);

  sortBtn.addEventListener("click", () => {
    const grid = document.querySelector(".tracks-grid");
    const itemsArray = Array.from(trackItems);

    itemsArray.sort((a, b) => {
      const nameA = a.querySelector(".track-name").textContent.toLowerCase();
      const nameB = b.querySelector(".track-name").textContent.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    grid.innerHTML = ""; // clear
    itemsArray.forEach((item) => grid.appendChild(item));
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const audio = document.getElementById("audioPlayer");
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const currentTimeEl = document.querySelector(".current-time");
  const durationEl = document.querySelector(".duration");

  // Format seconds → mm:ss
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // ---- PLAY / PAUSE ----
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playPauseBtn.classList.replace("fa-circle-play", "fa-circle-pause");
    } else {
      audio.pause();
      playPauseBtn.classList.replace("fa-circle-pause", "fa-circle-play");
    }
  });

  // ---- UPDATE DURATION ----
  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  // ---- UPDATE PROGRESS ----
  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  // ---- SEEK ON CLICK ----
  progressBar.addEventListener("click", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audioPlayer");

  // --- VOLUME CONTROL ---
  const volumeBar = document.getElementById("volumeBar");
  const volumeFill = document.getElementById("volumeFill");
  const volumeIcon = document.querySelector(".volume-container i");

  volumeBar.addEventListener("click", (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const volume = Math.min(Math.max(percent, 0), 1);
    audio.volume = volume;
    volumeFill.style.width = volume * 100 + "%";

    // update volume icon
    if (volume === 0) {
      volumeIcon.className = "fa-solid fa-volume-xmark icon-btn";
    } else if (volume < 0.5) {
      volumeIcon.className = "fa-solid fa-volume-low icon-btn";
    } else {
      volumeIcon.className = "fa-solid fa-volume-high icon-btn";
    }
  });

  // --- HEART (LIKE) BUTTON ---
  const likeBtn = document.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    if (likeBtn.classList.contains("fa-regular")) {
      likeBtn.classList.remove("fa-regular");
      likeBtn.classList.add("fa-solid");
      likeBtn.style.color = "#1db954"; // Spotify green
    } else {
      likeBtn.classList.remove("fa-solid");
      likeBtn.classList.add("fa-regular");
      likeBtn.style.color = "#b3b3b3"; // grey
    }
  });
});