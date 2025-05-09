document.addEventListener("DOMContentLoaded", function () {
  // --- 2. UTC Time ---
  const utcTimeSpan = document.getElementById("utc-time");
  function updateUTCTime() {
    if (utcTimeSpan) {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      utcTimeSpan.textContent = `${hours}:${minutes}:${seconds}`;
    }
  }
  if (utcTimeSpan) {
    updateUTCTime(); // Initial call
    setInterval(updateUTCTime, 1000); // Update every second
  }

  // --- 4. "Wild" Feature: Digital Rain/Particle Canvas Effect ---
  const canvas = document.getElementById("footer-wild-effect-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const particleCount = 50; // Adjust for density
    const charSet = "0123456789ABCDEF<>/{}[]()*&^%$#@!~?".split(""); // Characters for digital rain

    function resizeCanvas() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio; // For sharpness on retina
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      particles = []; // Reinitialize particles on resize
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = Math.random() * 0.5 + 0.1; // Slower speed
        this.char = charSet[Math.floor(Math.random() * charSet.length)];
        this.fontSize = Math.random() * 5 + 7; // Smaller font size for footer
        this.color =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--color-text-muted")
            .trim() || "#666666";
        // Update color if theme changes (more advanced: listen to theme change event)
        if (document.body.classList.contains("dark-theme")) {
          this.color =
            getComputedStyle(document.documentElement)
              .getPropertyValue("--color-text-muted-dark")
              .trim() || "#888888";
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}px monospace`;
        ctx.fillText(this.char, this.x, this.y);
      }

      update() {
        this.y += this.speed;
        if (this.y > height + this.fontSize) {
          // Reset when it goes off screen
          this.y = 0 - this.fontSize;
          this.x = Math.random() * width;
          this.char = charSet[Math.floor(Math.random() * charSet.length)];
          this.speed = Math.random() * 0.5 + 0.1;
        }
      }
    }

    function initParticles() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(
        0,
        0,
        canvas.width / window.devicePixelRatio,
        canvas.height / window.devicePixelRatio
      ); // Clear considering devicePixelRatio
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    // Debounced resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 100);
    });

    // Initial setup
    resizeCanvas(); // Sets initial size and particles
    animateParticles();
  }
});
