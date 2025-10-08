document.addEventListener("DOMContentLoaded", () => {
  // =================================================================
  // == Global Variables & DOM Element Selection
  // =================================================================
  const grid = document.querySelector(".tracks-grid");
  const filterInput = document.querySelector(".filter-input");
  const filterContainer = document.querySelector(".filter-container");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const audio = document.getElementById("audioPlayer");
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const currentTimeEl = document.querySelector(".current-time");
  const durationEl = document.querySelector(".duration");
  const volumeBar = document.getElementById("volumeBar");
  const volumeFill = document.getElementById("volumeFill");
  const volumeIcon = document.querySelector(".volume-container i");
  const likeBtn = document.querySelector(".like-btn");
  const profile = document.querySelector(".profile");

  let allTracks = []; // This will hold the data fetched from the API
  let filteredTracks = [];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let currentPage = 1;
  const itemsPerPage = 12;
  let sortAscending = true;

  // =================================================================
  // == API Data Fetching
  // =================================================================
  /**
   * Fetches top tracks from the Apple iTunes API and maps them to our app's format.
   */
  async function fetchTracks() {
    // --- API CHANGED TO APPLE ITUNES ---
    // This API is great because it requires NO API KEY.
    const artistQuery = "Da Baby";
    const apiUrl = `https://itunes.apple.com/search?term=${artistQuery}&entity=song&limit=30`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();

      // Map the iTunes API data to the structure our app expects
      if (json.results) {
        allTracks = json.results.map((track) => ({
          id: track.trackId,
          name: track.trackName,
          artist: track.artistName,
          // Get a higher resolution image by replacing '100x100' with '300x300'
          img: track.artworkUrl100.replace("100x100", "300x300"),
          preview: track.previewUrl, // iTunes provides a 30s preview URL
        }));
      } else {
        allTracks = [];
      }

      filteredTracks = [...allTracks];
      initializePage(); // Initialize the page after data is loaded
    } catch (error) {
      console.error("Could not fetch tracks:", error);
      grid.innerHTML =
        "<p style='color: #ff8a8a;'>Failed to load tracks. Please try again later.</p>";
    }
  }

  // =================================================================
  // == UI Rendering & Updates
  // =================================================================
  /**
   * Renders a list of tracks to the grid.
   */
  function renderTracks() {
    const start = 0;
    const end = currentPage * itemsPerPage;
    const visibleTracks = filteredTracks.slice(start, end);

    grid.innerHTML = visibleTracks
      .map(
        (track) => `
        <div class="track-item" data-id="${track.id}" data-preview="${
          track.preview
        }">
          <img class="track-album-art" src="${track.img}" alt="${track.name}">
          <p class="track-name">${track.name}</p>
          <p class="artist-name">${track.artist}</p>
          <i class="fa-heart ${
            favorites.includes(track.id) ? "fa-solid" : "fa-regular"
          } like-icon"></i>
        </div>
      `
      )
      .join("");

    // Hide 'Load More' button if all tracks are shown
    const loadMoreBtn = document.querySelector(".load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.style.display =
        end >= filteredTracks.length ? "none" : "block";
    }
  }

  /**
   * Formats time in seconds to a "minutes:seconds" string.
   */
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // =================================================================
  // == Event Handlers & Logic
  // =================================================================

  // --- Filtering by search query ---
  filterInput.addEventListener("input", () => {
    const q = filterInput.value.toLowerCase();
    filteredTracks = allTracks.filter(
      (t) =>
        t.name.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
    );
    currentPage = 1;
    renderTracks();
  });

  // --- Sorting A-Z / Z-A ---
  function handleSort() {
    sortAscending = !sortAscending;
    filteredTracks.sort((a, b) =>
      sortAscending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    const sortBtn = document.querySelector(".sort-btn");
    sortBtn.textContent = sortAscending ? "Sort A–Z" : "Sort Z–A";
    currentPage = 1;
    renderTracks();
  }

  // --- Loading more tracks ---
  function handleLoadMore() {
    currentPage++;
    renderTracks();
  }

  // --- Favorite/Like toggling ---
  grid.addEventListener("click", (e) => {
    // Handle liking a track
    if (e.target.classList.contains("like-icon")) {
      const trackItem = e.target.closest(".track-item");
      const id = Number(trackItem.dataset.id);

      if (favorites.includes(id)) {
        favorites = favorites.filter((favId) => favId !== id);
        e.target.classList.replace("fa-solid", "fa-regular");
      } else {
        favorites.push(id);
        e.target.classList.replace("fa-regular", "fa-solid");
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    // Handle playing a track preview
    const trackItem = e.target.closest(".track-item");
    if (trackItem) {
      const previewUrl = trackItem.dataset.preview;
      // Only change the track if the click was not on the like icon
      if (
        !e.target.classList.contains("like-icon") &&
        previewUrl &&
        previewUrl !== "undefined"
      ) {
        audio.src = previewUrl;
        audio.play();
        playPauseBtn.classList.replace("fa-circle-play", "fa-circle-pause");
        document.querySelector(".song-title").textContent =
          trackItem.querySelector(".track-name").textContent;
        document.querySelector(".song-artist").textContent =
          trackItem.querySelector(".artist-name").textContent;
        document.querySelector(".song-album-art").src =
          trackItem.querySelector(".track-album-art").src;
      }
    }
  });

  // --- Audio Player Controls ---
  playPauseBtn.addEventListener("click", () => {
    if (!audio.src || audio.src === window.location.href) return; // Don't play if no src
    if (audio.paused) {
      audio.play();
      playPauseBtn.classList.replace("fa-circle-play", "fa-circle-pause");
    } else {
      audio.pause();
      playPauseBtn.classList.replace("fa-circle-pause", "fa-circle-play");
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (isNaN(audio.duration)) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  progressBar.addEventListener("click", (e) => {
    if (isNaN(audio.duration)) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });

  // --- Volume Control ---
  volumeBar.addEventListener("click", (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const volume = Math.min(Math.max(percent, 0), 1);
    audio.volume = volume;
    volumeFill.style.width = volume * 100 + "%";

    if (volume === 0) {
      volumeIcon.className = "fa-solid fa-volume-xmark icon-btn";
    } else if (volume < 0.5) {
      volumeIcon.className = "fa-solid fa-volume-low icon-btn";
    } else {
      volumeIcon.className = "fa-solid fa-volume-high icon-btn";
    }
  });

  // --- Like Button on Player ---
  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("fa-regular");
    likeBtn.classList.toggle("fa-solid");
    likeBtn.style.color = likeBtn.classList.contains("fa-solid")
      ? "#1db954"
      : "#b3b3b3";
  });

  // --- Profile Dropdown Menu ---
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown-menu");
  dropdown.style.cssText = `
      position: absolute; top: 70px; right: 30px; background: #111;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
      padding: 10px 0; display: none; flex-direction: column;
      width: 180px; z-index: 2000;
    `;
  dropdown.innerHTML = `
      <a href="/html/Profile.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-user"></i> Profile</a>
      <a href="/html/Likes.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-heart"></i> Likes</a>
      <a href="/html/Stations.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-broadcast-tower"></i> Stations</a>
      <a href="/html/Playlist.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-music"></i> Tracks</a>
      <a href="/html/Login.html" style="padding:10px 16px;display:flex;align-items:center;gap:8px;color:white;text-decoration:none;"><i class="fa fa-sign-out-alt"></i> Log out</a>
    `;
  document.body.appendChild(dropdown);

  profile.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!profile.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // =================================================================
  // == Page Initialization
  // =================================================================
  /**
   * Sets up the initial page view and creates dynamic elements.
   */
  function initializePage() {
    // --- Create and append Sort Button ---
    const sortBtn = document.createElement("button");
    sortBtn.textContent = "Sort A–Z";
    sortBtn.className = "sort-btn";
    sortBtn.addEventListener("click", handleSort);
    filterContainer.appendChild(sortBtn);

    // --- Create and append Load More Button ---
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "Load More";
    loadMoreBtn.className = "load-more-btn";
    loadMoreBtn.addEventListener("click", handleLoadMore);
    document.querySelector(".tracks-section").appendChild(loadMoreBtn);

    // --- Initial render of tracks ---
    renderTracks();
  }

  // --- Start the application by fetching data ---
  fetchTracks();
});
