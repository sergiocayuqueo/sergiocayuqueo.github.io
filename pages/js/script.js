document.addEventListener("DOMContentLoaded", function () {
  // --- DOM Element References ---
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const leftSidebar = document.getElementById("leftSidebar");
  // Ensure mainContent is correctly selected if it's an ID, otherwise use '.content'
  // const mainContent = document.getElementById("mainContent"); // Use this if main has id="mainContent"
  const contentArea = document.querySelector(".content"); // The scrollable content area
  const menuLinks = document.querySelectorAll(".poem-list a"); // CORRECTED SELECTOR

  // --- Theme Switcher ---
  const applyTheme = (theme) => {
    htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeToggle) {
      const newLabel =
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      themeToggle.setAttribute("aria-label", newLabel);
    }
  };

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme ? savedTheme : prefersDark ? "dark" : "light";
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });

  // --- Mobile Menu Logic ---

  // Function to close the mobile menu (Best Practice)
  const closeMobileMenu = () => {
    // Check if elements exist and if the sidebar is active
    if (leftSidebar && leftSidebar.classList.contains("active")) {
      leftSidebar.classList.remove("active");
      if (mobileMenuToggle) {
        mobileMenuToggle.textContent = "☰"; // Hamburger icon
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      }
      // Optional: Re-enable body scroll if it was disabled
      // document.body.style.overflow = ''; // Or 'auto'
      console.log("Mobile menu closed");
    }
  };

  // Function to open the mobile menu (Best Practice)
  const openMobileMenu = () => {
    // Check if elements exist and sidebar is not already active
    if (leftSidebar && !leftSidebar.classList.contains("active")) {
      leftSidebar.classList.add("active");
      if (mobileMenuToggle) {
        mobileMenuToggle.textContent = "✕"; // Close icon
        mobileMenuToggle.setAttribute("aria-expanded", "true");
      }
      // Optional: Disable body scroll when menu is open to prevent background scrolling
      // document.body.style.overflow = 'hidden';
      console.log("Mobile menu opened");
    }
  };

  // Mobile Menu Toggle Button Handler
  if (mobileMenuToggle && leftSidebar) {
    mobileMenuToggle.addEventListener("click", function () {
      const isExpanded = leftSidebar.classList.contains("active");
      if (isExpanded) {
        closeMobileMenu(); // Use the helper function
      } else {
        openMobileMenu(); // Use the helper function
      }
    });
  }

  // --- poem List Navigation & Active State ---
  if (menuLinks.length > 0 && contentArea) {
    menuLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        // 1. Update Active Class Styling
        menuLinks.forEach((el) => {
          // Add checks for parentElement existence
          if (el.parentElement) {
            el.parentElement.classList.remove("active");
          }
        });
        if (this.parentElement) {
          this.parentElement.classList.add("active");
        }

        // 2. Smooth Scroll to Section (if it's an internal hash link)
        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // --- REFINED SCROLL CALCULATION ---
            const containerRect = contentArea.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            // Calculate the offset from the top of the container's visible area
            const scrollOffset = targetRect.top - containerRect.top;
            const currentScrollTop = contentArea.scrollTop;
            const headerOffset = 20; // Desired padding from the top of the container

            const targetScrollTop =
              currentScrollTop + scrollOffset - headerOffset;
            // --- END REFINED SCROLL CALCULATION ---

            contentArea.scrollTo({
              top: targetScrollTop,
              behavior: "smooth",
            });
            console.log(`Scrolling smoothly to: ${href}`);

            // --- >>> BEST PRACTICE: CLOSE MOBILE MENU <<< ---
            // Check if we are in mobile view and the sidebar is open
            if (
              window.innerWidth <= 768 &&
              leftSidebar &&
              leftSidebar.classList.contains("active")
            ) {
              console.log(
                "Is mobile and sidebar active, closing menu with delay..."
              );
              // Use setTimeout to allow scroll to start before menu closes visually
              setTimeout(closeMobileMenu, 150); // Delay 150ms (adjust as needed)
            }
            // --- <<< END BEST PRACTICE >>> ---
          } else {
            console.warn(`Target element with ID '${targetId}' not found.`);
          }
        } else {
          // Handle non-hash links or other link types if necessary
          // Optionally close mobile menu even for non-scrolling links
          if (
            window.innerWidth <= 768 &&
            leftSidebar &&
            leftSidebar.classList.contains("active")
          ) {
            setTimeout(closeMobileMenu, 150);
          }
        }

        // IMPORTANT: Do NOT call preventDefault() here if you want the hash to update in the URL bar
        // event.preventDefault();
      });
    });
  } else {
    if (menuLinks.length === 0)
      console.warn(
        "No links found with selector '.poem-list a'. Check HTML class."
      );
    if (!contentArea)
      console.warn("Scrollable content area '.content' not found.");
  }

  // --- Initial Active State based on URL Hash ---
  function setActiveLinkFromHash() {
    // Clear previous active states first
    menuLinks.forEach((el) => {
      if (el.parentElement) {
        el.parentElement.classList.remove("active");
      }
    });

    if (window.location.hash) {
      try {
        // Use CSS.escape for robustness if hash contains special characters
        const escapedHash = CSS.escape(window.location.hash);
        const activeLink = document.querySelector(
          `.poem-list a[href="${escapedHash}"]`
        ); // CORRECTED SELECTOR

        if (activeLink && activeLink.parentElement) {
          activeLink.parentElement.classList.add("active");
          console.log(
            `Initial active link set from hash: ${window.location.hash}`
          );
          // Optional: Scroll on initial load. Browser might do this anyway.
          // If you need specific offset on load, uncomment and adjust:
          /*
                  const targetId = window.location.hash.substring(1);
                  const targetElement = document.getElementById(targetId);
                  if (targetElement && contentArea) {
                      const containerRect = contentArea.getBoundingClientRect();
                      const targetRect = targetElement.getBoundingClientRect();
                      const scrollOffset = targetRect.top - containerRect.top;
                      // Use 'auto' behavior for instant jump on load
                      contentArea.scrollTo({ top: scrollOffset - 20, behavior: 'auto' });
                  }
                  */
        } else {
          console.log(
            `No link found matching hash: ${window.location.hash}. Setting first as active.`
          );
          // Fallback: Set the first link as active if hash doesn't match
          const firstLink = document.querySelector(
            ".poem-list li:first-child a"
          ); // CORRECTED SELECTOR
          if (firstLink && firstLink.parentElement) {
            firstLink.parentElement.classList.add("active");
          }
        }
      } catch (e) {
        console.error("Error processing hash for active link:", e);
        // Fallback on error
        const firstLink = document.querySelector(".poem-list li:first-child a"); // CORRECTED SELECTOR
        if (firstLink && firstLink.parentElement) {
          firstLink.parentElement.classList.add("active");
        }
      }
    } else {
      // Set the first link as active if no hash is present
      const firstLink = document.querySelector(".poem-list li:first-child a"); // CORRECTED SELECTOR
      if (firstLink && firstLink.parentElement) {
        firstLink.parentElement.classList.add("active");
        console.log("No hash found, setting first link as active.");
      }
    }
  }
  setActiveLinkFromHash(); // Set initial state on load
  window.addEventListener("hashchange", setActiveLinkFromHash); // Update on back/forward

  // --- Handle Device Change ---
  function handleDeviceChange() {
    if (window.innerWidth > 768) {
      // If resizing larger than mobile breakpoint and mobile menu was open, close it.
      closeMobileMenu(); // Use the helper function
    }
  }
  window.addEventListener("resize", handleDeviceChange);

  // --- Paste Functionality (Consider Removing) ---
  /* // Commented out as likely not needed for a display page
  const contentPasteTarget = document.querySelector(".content"); // Ensure this targets the right element if kept
  if (contentPasteTarget) {
    contentPasteTarget.addEventListener("paste", function (e) {
        console.log("Paste event detected - default prevented");
        e.preventDefault();
        const text = e.clipboardData?.getData("text/plain");
        if (text) {
             console.log("Pasted text:", text);
             // Avoid complex DOM manipulation here unless strictly necessary
        }
    });
  }
  */

  console.log("poem page interactive scripts loaded.");
}); // End DOMContentLoaded
