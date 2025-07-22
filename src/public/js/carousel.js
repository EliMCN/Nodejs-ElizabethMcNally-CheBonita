// public/js/carousel.js
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("logoTrack");
  const originalGroup = track?.querySelector(".logo-group");
  if (track && originalGroup) {
    for (let i = 0; i < 2; i++) {
      const clone = originalGroup.cloneNode(true);
      track.appendChild(clone);
    }
  }
});
