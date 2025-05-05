document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("background-animation-container");
  if (!container) {
    console.error("Background animation container not found!");
    return;
  }

  // --- Configuration ---
  const words = [
    "AI",
    "ML",
    "DEEP",
    "DATA",
    "CODE",
    "BITS",
    "NODE",
    "LEARN",
    "ETHICS",
    "FORM",
    "STUDY",
    "SYSTEM",
    "WRITER",
    "○", // Donut/Circle
    "{}",
    "()",
    ";",
    "=>",
    "∑",
    "∇",
    "λ",
    "∫",
    "∂",
    "THINK",
    "CREATE",
    "QUERY",
    "AGENT",
    "MODEL",
    "{",
    "}",
    ";",
    "<",
    "/>",
    "∑",
    "∀",
    "∃",
    "λ",
    "μ",
    "σ",
    "∂",
    "∫",
    "∇",
    "∴",
    "∵",
    "0",
    "1",
    "AI",
    "ML",
    "D",
    "X",
    "f(x)",
    "g(y)",
    "dx",
    "dy",
    "lim",
    "log",
    "ln",
    "E=mc²",
    "a²+b²=c²",
    "sin(θ)",
    "cos(φ)",
    "tan(α)",
    "d/dx",
    "?",
    "∅",
    "NaN",
    "⊕",
    "⊗",
    "α",
    "β",
    "γ",
    "δ",
    "ε",
    "ζ",
    "η",
    "θ",
    "ι",
    "κ",
    "φ",
    "χ",
    "ψ",
    "ω",
    "0",
    "1", // Add more relevant words
  ];
  const numberOfElements = 35; // How many elements on screen
  const changeIntervalBase = 3000; // Base interval for change attempt (ms). CSS animation duration also affects this.
  const changeIntervalVariance = 1500; // Random variance +/- (ms)
  const minSize = 14; // Min font size (px)
  const maxSize = 30; // Max font size (px)
  const glitchDuration = 150; // How long the 'is-changing' class stays (ms)
  // --- End Configuration ---

  // Store references to elements and their change timers
  const elements = [];

  function getRandomWord(currentWord = null) {
    let newWord;
    if (words.length <= 1) return words[0] || ""; // Handle empty or single-word list
    do {
      newWord = words[Math.floor(Math.random() * words.length)];
    } while (newWord === currentWord); // Ensure it's different
    return newWord;
  }

  function scheduleWordChange(element) {
    // Clear existing timeout for this element if any
    if (element.changeTimeoutId) {
      clearTimeout(element.changeTimeoutId);
    }

    const randomInterval =
      changeIntervalBase +
      Math.random() * changeIntervalVariance * 2 -
      changeIntervalVariance;

    element.changeTimeoutId = setTimeout(() => {
      const currentWord = element.textContent;
      const nextWord = getRandomWord(currentWord);

      // Apply glitch effect class
      element.classList.add("is-changing");

      // Change the text slightly after the glitch class is applied
      setTimeout(() => {
        element.textContent = nextWord;
        // Remove glitch effect class after a short delay
        setTimeout(() => {
          element.classList.remove("is-changing");
        }, glitchDuration / 2); // Remove slightly after text change seems better
      }, 50); // Small delay for the glitch effect to render

      // Schedule the next change
      scheduleWordChange(element);
    }, Math.max(500, randomInterval)); // Ensure interval isn't too small
  }

  function createElement() {
    const element = document.createElement("div"); // Using div for potentially wider content
    element.classList.add("morphing-element");

    // Initial random properties
    const randomX = Math.random() * 100; // vw
    const randomY = Math.random() * 100; // vh
    const randomSize = Math.random() * (maxSize - minSize) + minSize;
    const randomDuration = Math.random() * 10 + 15; // Duration for gentleFloat
    const randomDelay = Math.random() * 10; // Delay for gentleFloat
    const morphDuration = Math.random() * 1.5 + 2.5; // Duration for morphTransition (affects change rate)

    element.style.left = `${randomX}vw`;
    element.style.top = `${randomY}vh`;
    element.style.fontSize = `${randomSize}px`;
    element.style.animationDuration = `${randomDuration}s, ${morphDuration}s`; // Durations for both animations
    element.style.animationDelay = `-${randomDelay}s, 0s`; // Apply delay only to float

    // Set initial word
    element.textContent = getRandomWord();

    // Attach listener for the morphTransition animation iteration
    // This is an ALTERNATIVE way to trigger changes, potentially more synced
    // Choose ONE method: either animationiteration or the setTimeout scheduling above.
    // Using setTimeout (scheduleWordChange) is often more flexible for timing.

    /* // --- Alternative Method: Using animationiteration ---
      element.addEventListener('animationiteration', (event) => {
           // Only act on the 'morphTransition' animation
           if (event.animationName === 'morphTransition') {
               const currentWord = element.textContent;
               const nextWord = getRandomWord(currentWord);

               element.classList.add('is-changing'); // Add glitch class

               setTimeout(() => { // Small delay to let class apply
                   element.textContent = nextWord; // Change text
                   setTimeout(() => { // Remove glitch class
                       element.classList.remove('is-changing');
                   }, glitchDuration);
               }, 50);
          }
       });
       */ // --- End Alternative Method ---

    container.appendChild(element);
    elements.push(element); // Store reference

    // Start the timeout-based change scheduling for this element
    scheduleWordChange(element);
  }

  // Create initial elements
  for (let i = 0; i < numberOfElements; i++) {
    createElement();
  }

  console.log("Morphing background animation initialized.");

  // --- Optional: Handle Window Resize ---
  // Could remove/recreate elements or just let them redistribute visually.
  // Simple approach: just let CSS handle it. More complex: re-run setup.
});
