document.addEventListener("DOMContentLoaded", () => {
  // --- Configuration ---
  const TILT_MAX_ROTATION = 12;
  const ZOOM_LEVEL = 0.9; // Your adjusted zoom level

  // --- DOM Element References ---
  const interactionAreas = document.querySelectorAll(".perspective-wrapper");
  const zoomCursor = document.getElementById("zoom-cursor-square");

  // --- State Variables ---
  let currentActiveImage = null;
  let imageState = {
    isLoaded: false,
    rect: null,
    naturalWidth: 0,
    naturalHeight: 0,
    displayWidth: 0,
    displayHeight: 0,
    ratioX: 1,
    ratioY: 1,
  };
  let cursorWidth = 0;
  let cursorHeight = 0;

  // --- Error Handling ---
  if (!zoomCursor) {
    console.error("Zoom cursor missing");
    return;
  }
  if (interactionAreas.length === 0) {
    console.warn("No perspective-wrapper found");
    return;
  }

  // --- Get Cursor Dimensions Early ---
  // (Keep this section as is)
  zoomCursor.style.visibility = "hidden";
  zoomCursor.style.display = "block";
  cursorWidth = zoomCursor.offsetWidth;
  cursorHeight = zoomCursor.offsetHeight;
  zoomCursor.style.display = "none";
  zoomCursor.style.visibility = "visible";
  if (cursorWidth === 0 || cursorHeight === 0) {
    console.warn("Could not get cursor dimensions.");
  }
  // --- End Cursor Dimension Grab ---

  // --- Setup Function (Remains the same) ---
  function setupEffectForImage(imgElement) {
    imageState = { isLoaded: false };
    currentActiveImage = imgElement; // Track the image intended for setup

    if (!imgElement.complete || imgElement.naturalHeight === 0) {
      console.warn("Target image not fully loaded yet.", imgElement.src);
      imgElement.addEventListener(
        "load",
        () => {
          console.log("Lazy/late loaded image ready:", imgElement.src);
          // Re-run setup *if needed* (e.g., mouse might have left/re-entered)
          // The main mouseenter handler will usually call setup again if needed
          if (currentActiveImage === imgElement) {
            // Check if still relevant
            setupEffectForImage(imgElement); // Re-run setup
          }
        },
        { once: true }
      );
      return false;
    }
    // (Rest of setup logic remains the same)
    imageState.rect = imgElement.getBoundingClientRect();
    imageState.displayWidth = imgElement.offsetWidth;
    imageState.displayHeight = imgElement.offsetHeight;
    imageState.naturalWidth = imgElement.naturalWidth;
    imageState.naturalHeight = imgElement.naturalHeight;
    if (imageState.naturalWidth === 0 || imageState.displayWidth === 0) {
      console.error("Image dimensions zero.", imgElement.src);
      return false;
    }
    imageState.ratioX = imageState.naturalWidth / imageState.displayWidth;
    imageState.ratioY = imageState.naturalHeight / imageState.displayHeight;
    zoomCursor.style.backgroundImage = `url('${imgElement.src}')`;
    zoomCursor.style.backgroundSize = `${
      imageState.naturalWidth * ZOOM_LEVEL
    }px ${imageState.naturalHeight * ZOOM_LEVEL}px`;
    if (cursorWidth === 0 || cursorHeight === 0) {
      /* Re-check cursor size */
    }
    imageState.isLoaded = true;
    console.log("Setup complete for image:", imgElement.src);
    return true;
  }

  // --- Event Handler: Mouse Movement (Attached to Wrapper) ---
  function handleMouseMove(event) {
    // Only proceed if an image is active and loaded
    if (!currentActiveImage || !imageState.isLoaded || cursorWidth === 0)
      return;

    // Find tilt wrapper within the currently hovered wrapper (currentTarget)
    const tiltWrapper = event.currentTarget.querySelector(
      ".image-tilt-wrapper"
    );
    if (!tiltWrapper) return;

    // --- Tilt Calculation (Remains the same) ---
    const tiltRect = tiltWrapper.getBoundingClientRect();
    const centerX = tiltRect.left + tiltRect.width / 2;
    const centerY = tiltRect.top + tiltRect.height / 2;
    const distanceX = (event.clientX - centerX) / (tiltRect.width / 2);
    const distanceY = (event.clientY - centerY) / (tiltRect.height / 2);
    const rotateY = distanceX * TILT_MAX_ROTATION;
    const rotateX = -distanceY * TILT_MAX_ROTATION;
    tiltWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // --- Zoom Cursor ELEMENT POSITION Calculation (Remains the same) ---
    let cursorLeftPage = event.pageX - cursorWidth / 2;
    let cursorTopPage = event.pageY - cursorHeight / 2;
    zoomCursor.style.left = `${cursorLeftPage}px`;
    zoomCursor.style.top = `${cursorTopPage}px`;

    // --- Zoom Cursor BACKGROUND POSITION Calculation (Remains the same) ---
    imageState.rect = currentActiveImage.getBoundingClientRect(); // Update rect
    let cursorXRelative = event.clientX - imageState.rect.left;
    let cursorYRelative = event.clientY - imageState.rect.top;
    cursorXRelative = Math.max(
      0,
      Math.min(cursorXRelative, imageState.displayWidth)
    );
    cursorYRelative = Math.max(
      0,
      Math.min(cursorYRelative, imageState.displayHeight)
    );
    let bgPosX = -(
      cursorXRelative * ZOOM_LEVEL * imageState.ratioX -
      cursorWidth / 2
    );
    let bgPosY = -(
      cursorYRelative * ZOOM_LEVEL * imageState.ratioY -
      cursorHeight / 2
    );
    const minBgX = -(imageState.naturalWidth * ZOOM_LEVEL - cursorWidth);
    const minBgY = -(imageState.naturalHeight * ZOOM_LEVEL - cursorHeight);
    bgPosX = Math.max(minBgX, Math.min(0, bgPosX));
    bgPosY = Math.max(minBgY, Math.min(0, bgPosY));
    zoomCursor.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  }

  // --- Event Handler: Mouse Enters WRAPPER Area ---
  function handleWrapperMouseEnter(event) {
    // Find the image within this specific wrapper
    const targetImage = event.currentTarget.querySelector(".tilt-zoom-image");
    if (!targetImage) return;

    // Run setup for this image IF NOT ALREADY SET AS ACTIVE/LOADED
    // This ensures setup runs even if mouse enters wrapper before image loads fully
    if (currentActiveImage !== targetImage || !imageState.isLoaded) {
      setupEffectForImage(targetImage); // currentActiveImage is set inside here
    }

    // Set faster tilt transition
    const tiltWrapper = event.currentTarget.querySelector(
      ".image-tilt-wrapper"
    );
    if (tiltWrapper) tiltWrapper.style.transition = "transform 0.1s linear";

    // DO NOT show cursor here - wait for image mouseenter
  }

  // --- Event Handler: Mouse Leaves WRAPPER Area ---
  function handleWrapperMouseLeave(event) {
    // Hide the cursor as a fallback / definitive action
    zoomCursor.style.display = "none";
    // Reset state only if leaving the area associated with the current image
    if (
      currentActiveImage &&
      event.currentTarget.contains(currentActiveImage)
    ) {
      currentActiveImage = null;
      imageState = { isLoaded: false };
    }

    // Reset tilt
    const tiltWrapper = event.currentTarget.querySelector(
      ".image-tilt-wrapper"
    );
    if (tiltWrapper) {
      tiltWrapper.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
      tiltWrapper.style.transition =
        "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    }
  }

  // --- NEW Event Handler: Mouse Enters IMAGE Element ---
  function handleImageMouseEnter(event) {
    // The event target IS the image element
    const targetImage = event.target;

    // Ensure setup has run for this specific image
    // This is important if mouse quickly enters image before wrapper setup finishes
    if (currentActiveImage !== targetImage || !imageState.isLoaded) {
      if (!setupEffectForImage(targetImage)) {
        // If setup failed (e.g., image still loading), don't show cursor yet
        return;
      }
    }

    // Show the cursor only if setup is complete
    if (imageState.isLoaded) {
      zoomCursor.style.display = "block";
    }
  }

  // --- NEW Event Handler: Mouse Leaves IMAGE Element ---
  function handleImageMouseLeave(event) {
    // Hide the cursor when leaving the image itself
    zoomCursor.style.display = "none";
  }

  // --- Attach Event Listeners ---
  interactionAreas.forEach((area) => {
    // Get the image within this area
    const img = area.querySelector(".tilt-zoom-image");
    if (!img) return; // Skip if no image found

    // Attach listeners to the WRAPPER (.perspective-wrapper)
    area.addEventListener("mousemove", handleMouseMove);
    area.addEventListener("mouseenter", handleWrapperMouseEnter); // Renamed handler
    area.addEventListener("mouseleave", handleWrapperMouseLeave); // Renamed handler

    // Attach listeners DIRECTLY to the IMAGE
    img.addEventListener("mouseenter", handleImageMouseEnter);
    img.addEventListener("mouseleave", handleImageMouseLeave);

    // Error listener for the image (remains useful)
    if (!(img.complete && img.naturalHeight !== 0)) {
      img.addEventListener(
        "error",
        () => console.error("Image failed to load:", img.src),
        { once: true }
      );
    }
  });
}); // End DOMContentLoaded
