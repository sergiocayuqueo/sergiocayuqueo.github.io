document.addEventListener("DOMContentLoaded", function () {
  const globeContainer = document.querySelector(".word-globe-container");
  const globe = document.querySelector(".word-globe");

  if (!globe || !globeContainer) {
      console.warn("Word globe elements not found.");
      return;
  }

  // --- Part 1: Create the static globe items (Your existing code) ---
  const formulas = [
      'E = mc²', 'F = ma', 'PV = nRT', 'KE = ½mv²', 'PE = mgh', 'λ = h/p',
      '∇⋅E = ρ/ε₀', '∇⋅B = 0', '∇×E = -∂B/∂t', '∇×B = μ₀(J + ε₀∂E/∂t)',
      'S = kᵦ ln Ω', 'F = -kx', 'a² + b² = c²', 'A = πr²', 'e^(iπ) + 1 = 0',
      'x = [-b ± √(b²-4ac)] / 2a', 'sin²θ + cos²θ = 1', 'd/dx (xⁿ) = nxⁿ⁻¹',
      '∫xⁿ dx = (xⁿ⁺¹)/(n+1) + C', 'f\'(x) = lim┬(h→0)⁡〖(f(x+h)-f(x))/h〗',
      'P(A|B) = [P(B|A)P(A)] / P(B)', 'n! = n × (n-1)!', 'e = lim (1 + 1/n)ⁿ',
      'Fₙ = Fₙ₋₁ + Fₙ₋₂', '(x+y)ⁿ = ∑ (n¦k) x^(n-k) y^k', '∬D f(x,y) dA',
      'det(A)', '||v|| = √(v₁²+v₂²)', 'a · b = ||a|| ||b|| cosθ', 'σ = √[∑(xᵢ-μ)²/N]',
  ];

  const numItems = formulas.length > 40 ? 40 : formulas.length;
  let radius; // Will be set in buildGlobe

  function buildGlobe() {
      if (!globeContainer) return;
      radius = globeContainer.offsetWidth / 2.5;
      globe.innerHTML = ''; // Clear previous items if rebuilding (for resize)

      for (let i = 0; i < numItems; i++) {
          const item = document.createElement("span");
          item.classList.add("word-globe-item");
          item.textContent = formulas[i % formulas.length];

          const phi = Math.acos(-1 + (2 * i) / numItems);
          const theta = Math.sqrt(numItems * Math.PI) * phi;

          const x = radius * Math.cos(theta) * Math.sin(phi);
          const y = radius * Math.sin(theta) * Math.sin(phi);
          const z = radius * Math.cos(phi);

          const scale = (z + radius) / (2 * radius);
          
          item.style.fontSize = `${8 + Math.round(scale * 10)}px`;
          item.style.opacity = `${0.4 + scale * 0.6}`;
          item.style.transform = `translateX(-50%) translateY(-50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${(theta * 180 / Math.PI + 90).toFixed(2)}deg)`;
          globe.appendChild(item);
      }
  }

  // --- Part 2: Add Mouse Drag Functionality ---
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;

  // Get current rotation from CSS or set defaults
  // This is tricky if CSS animation is actively changing it.
  // For simplicity, we'll track our own JS-based rotation angles.
  let currentRotateX = 10; // Default initial X rotation (matching your CSS animation)
  let currentRotateY = 0;  // Default initial Y rotation

  const dragSensitivity = 0.3;

  if (globeContainer) {
      globeContainer.style.cursor = 'grab'; // Set initial cursor

      globeContainer.addEventListener('mousedown', function (e) {
          isDragging = true;
          previousMouseX = e.clientX;
          previousMouseY = e.clientY;
          globeContainer.style.cursor = 'grabbing';
          // Temporarily disable CSS animation if it's applied via a class
          // If animation is directly on .word-globe, this override is enough.
          globe.style.animation = 'none'; // Stop CSS animation
          // Apply current JS-tracked rotation
          globe.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
          e.preventDefault();
      });
  }

  document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      currentRotateY += deltaX * dragSensitivity;
      currentRotateX -= deltaY * dragSensitivity; // Invert for natural feel

      // Optional: Clamp X rotation
      currentRotateX = Math.max(-85, Math.min(85, currentRotateX));

      globe.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
  });

  document.addEventListener('mouseup', function () {
      if (isDragging) {
          isDragging = false;
          if (globeContainer) globeContainer.style.cursor = 'grab';
          // Re-enable CSS animation
          // The animation will restart from its 0% state.
          // If you need it to resume from currentRotateY, that's more complex.
          globe.style.animation = ''; // Resets to CSS defined animation
                                      // Or: globe.style.animation = 'spinGlobe 25s linear infinite';
      }
  });

  // Optional: Handle mouse leaving the window while dragging
  document.addEventListener('mouseleave', function() {
      if (isDragging) {
          isDragging = false;
          if (globeContainer) globeContainer.style.cursor = 'grab';
          globe.style.animation = '';
      }
  });

  // --- Initial Build & Resize ---
  buildGlobe(); // Build the globe initially

  let resizeTimer;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
          buildGlobe();
          // After rebuild, re-apply current JS-tracked rotation if not animating
          if (!isDragging && globe.style.animation === 'none') {
               globe.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
          }
      }, 250);
  });

});
