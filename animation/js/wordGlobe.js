document.addEventListener("DOMContentLoaded", function () {
  const globe = document.querySelector(".word-globe");
  const container = document.querySelector(".word-globe-container");

  if (!globe || !container) {
    console.warn("Word globe elements not found.");
    return;
  }

  const formulas = [
    "E = c²",
    "F = ma",
    "PV = nRT",
    "KE = ½mv²",
    "PE = mgh",
    "λ = h/p",
    "∇⋅E = ρ/ε₀",
    "∇⋅B = 0",
    "∇×E = -∂B/∂t",
    "∇×B = μ₀(J + ε₀∂E/∂t)",
    "S = kᵦ ln Ω",
    "F = -kx",
    "a² + b² = c²",
    "A = πr²",
    "e^(iπ) + 1 = 0",
    "x = [-b ± √(b²-4ac)] / 2a",
    "sin²θ + cos²θ = 1",
    "d/dx (xⁿ) = nxⁿ⁻¹",
    "∫xⁿ dx = (xⁿ⁺¹)/(n+1) + C",
    "f'(x) = lim┬(h→0)⁡〖(f(x+h)-f(x))/h〗",
    "P(A|B) = [P(B|A)P(A)] / P(B)",
    "n! = n × (n-1)!",
    "e = lim (1 + 1/n)ⁿ",
    "Fₙ = Fₙ₋₁ + Fₙ₋₂",
    "(x+y)ⁿ = ∑ (n¦k) x^(n-k) y^k",
    "∬D f(x,y) dA",
    "det(A)",
    "||v|| = √(v₁²+v₂²)",
    "a · b = ||a|| ||b|| cosθ",
    "σ = √[∑(xᵢ-μ)²/N]",
    // Add more or use the full list from above
  ];

  const numItems = formulas.length > 40 ? 40 : formulas.length; // Limit for performance, or use all
  const radius = container.offsetWidth / 2.5; // Adjust radius factor based on container size and desired look

  for (let i = 0; i < numItems; i++) {
    const item = document.createElement("span");
    item.classList.add("word-globe-item");
    item.textContent = formulas[i % formulas.length]; // Cycle through formulas

    // Distribute points on a sphere using Fibonacci lattice (approximates even distribution)
    const phi = Math.acos(-1 + (2 * i) / numItems);
    const theta = Math.sqrt(numItems * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    // Adjust font size and opacity based on Z-depth for a pseudo-perspective
    const scale = (z + radius) / (2 * radius); // Scale from 0 to 1
    item.style.fontSize = `${8 + Math.round(scale * 10)}px`; // e.g., 8px to 18px
    item.style.opacity = `${0.4 + scale * 0.6}`; // e.g., 0.4 to 1.0

    // Apply 3D transform. Note: translate by -50% for x and y because of top/left: 50%
    // The rotateY makes the text face outwards a bit. More complex orientation needs quaternions.
    item.style.transform = `translateX(-50%) translateY(-50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${
      (theta * 180) / Math.PI + 90
    }deg)`;

    globe.appendChild(item);
  }
});
