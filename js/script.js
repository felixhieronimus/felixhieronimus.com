console.log('hello')

function initProjectHoverAnimation() {
  document.querySelectorAll('.info-projetsuivant h2, .info-projetsuivant p').forEach(textElement => {
    // Assurez-vous que cette partie ne s'exécute pas plusieurs fois pour le même élément
    if (!textElement.classList.contains('initialized')) {
      let words = textElement.innerText.split(/\s+/).map(word => `<span class="word-slide-in">${word}</span>`);
      textElement.innerHTML = words.join(' ');
      textElement.classList.add('initialized');
    }
  });

  document.querySelectorAll('.initial-image').forEach(image => {
    image.addEventListener('mouseover', handleMouseOver);
    image.addEventListener('mouseout', handleMouseOut);
  });
}

function handleMouseOver(event) {
  const container = event.target.closest('.relative');
  if (!container) return;

  container.querySelectorAll('.word-slide-in').forEach((word, index) => {
    setTimeout(() => {
      word.style.opacity = '1';
      word.style.transform = 'translateY(0%)';
    }, 100 * index);
  });
}

function handleMouseOut(event) {
  const container = event.target.closest('.relative');
  if (!container) return;

  container.querySelectorAll('.word-slide-in').forEach(word => {
    word.style.opacity = '0';
    word.style.transform = 'translateY(100%)';
  });
}



document.addEventListener("DOMContentLoaded", function () {
  initProjectHoverAnimation();
});
// -----------------------------------------------AI PAGE----------------------------------------------
function initializeGallery() {
  const images = [
    "../img/ai/assiette.jpg",
    "../img/ai/canape.jpg",
    "../img/ai/hand.jpg",
    "../img/ai/jimmy6.jpg",
    "../img/ai/lacoste.jpg",
    "../img/ai/handj.jpg",
    "../img/ai/lolipop.jpg",
    "../img/ai/red.jpg",
    "../img/ai/samourai.jpg",
    "../img/ai/samourai2.jpg",
    "../img/ai/sdb.jpg",
  ];
  const galleryContainer = document.getElementById("gallery-container");
  if (!galleryContainer) return;
  let originalPosition = {};
  let currentTopIndex = 0;

  currentLayoutFunction = setRandomLayout;
  currentLayoutFunction();
  setTimeout(() => {
    currentLayoutFunction = setStackLayout;
    currentLayoutFunction();
  }, 2000);
  function attachClickHandlers() {
    galleryContainer.querySelectorAll("img").forEach((img) => {
      img.removeEventListener("click", handleImageClick);
      img.addEventListener("click", handleImageClick);
    });
  }

  function handleImageClick() {
    if (!this.classList.contains("in-lightbox")) {
      enlargeImage(this);
    }
  }

  function loadImages() {
    if (galleryContainer.children.length === 0) {
      let delayIncrement = 0.1;
      let maxDelay = 0;

      images.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Image ${index + 1}`;
        img.style.opacity = 0;
        img.style.cursor = "pointer";
        img.style.transition = `transform .5s ease, opacity 0.5s ease ${
          index * delayIncrement
        }s`;
        galleryContainer.appendChild(img);
        img.addEventListener("click", function () {
          enlargeImage(this);
        });

        requestAnimationFrame(() => {
          img.style.opacity = 1;
        });

        maxDelay = index * delayIncrement;
      });

      setTimeout(() => {
        currentLayoutFunction = setStackLayout;
        currentLayoutFunction();
      }, (maxDelay + 0.5) * 2000);
    }
  }

  function enlargeImage(img) {
    gsap.set("#lightbox", {
      y: "100%",
      autoAlpha: 1,
    });

    gsap.to("#lightbox", {
      y: 0,
      autoAlpha: 1,
      duration: 0.5,
      delay: 0,
      ease: "power2.inOut",
      from: "bottom",
    });

    galleryContainer.querySelectorAll("img").forEach((otherImg) => {
      if (otherImg !== img) {
        otherImg.classList.add("imgFadeOut");
      }
    });

    document.querySelectorAll(".buttons-container").forEach((container) => {
      container.classList.add("imgFadeOut");
    });
    document.querySelectorAll("#lightbox").forEach((container) => {
      container.classList.remove("imgFadeOut");
    });

    img.classList.add("in-lightbox");

    img.setAttribute("data-original-width", img.style.width);
    img.setAttribute("data-original-height", img.style.height);
    img.setAttribute("data-original-position", img.style.position);
    img.setAttribute("data-original-top", img.style.top);
    img.setAttribute("data-original-left", img.style.left);
    img.setAttribute("data-original-transform", img.style.transform);
    img.setAttribute("data-original-zIndex", img.style.zIndex);

    img.style.position = "fixed";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%) scale(5)";
    img.style.zIndex = "1000";

    createCloseButton(img);
  }

  function createCloseButton(img) {
    let btn = document.querySelector(".closeimg");
    if (!btn) {
      btn = document.createElement("button");
      btn.innerHTML = "Fermer";
      btn.className = "closeimg";
      btn.style.zIndex = "1001";
      document.body.appendChild(btn);
    }

    btn.onclick = function () {
      resetImage(img);
      this.remove();
    };
  }
  function resetImage(img) {
    img.style.width = img.getAttribute("data-original-width");
    img.style.height = img.getAttribute("data-original-height");
    img.style.position = img.getAttribute("data-original-position");
    img.style.top = img.getAttribute("data-original-top");
    img.style.left = img.getAttribute("data-original-left");
    img.style.transform = img.getAttribute("data-original-transform");
    img.style.zIndex = img.getAttribute("data-original-zIndex");

    galleryContainer.querySelectorAll("img").forEach((otherImg) => {
      otherImg.classList.remove("imgFadeOut");
    });
    document.querySelectorAll(".buttons-container").forEach((container) => {
      container.classList.remove("imgFadeOut");
    });
    document.querySelectorAll("#lightbox").forEach((container) => {
      container.classList.add("imgFadeOut");
    });

    img.addEventListener("transitionend", function handleTransitionEnd() {
      img.style.transition = "";
      img.removeEventListener("transitionend", handleTransitionEnd);
    });

    gsap.to("#lightbox", {
      y: "-100%",
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.in",
      onComplete: function () {
        gsap.set("#lightbox", { y: "100%", autoAlpha: 1 });
      },
    });
    img.classList.remove("in-lightbox");
    currentLayoutFunction();
  }

  function setRandomLayout() {
    const imgs = galleryContainer.querySelectorAll("img");
    const containerRect = galleryContainer.getBoundingClientRect();

    imgs.forEach((img) => {
      const maxX = containerRect.width - img.clientWidth;
      const maxY = containerRect.height - img.clientHeight;

      const posX = Math.random() * maxX;
      const posY = Math.random() * maxY;

      const relativeX = posX - (containerRect.width / 2 - img.clientWidth / 2);
      const relativeY =
        posY - (containerRect.height / 2 - img.clientHeight / 2);

      gsap.to(img, {
        x: relativeX,
        y: relativeY,
        scale: 1,
        duration: 0.3,
        rotation: 0,
        ease: "power1.out",
      });
    });
  }

  function setStackLayout() {
    const imgs = galleryContainer.querySelectorAll("img");

    document.getElementById("prev-image").style.display = "inline-block";
    document.getElementById("next-image").style.display = "inline-block";

    imgs.forEach((img, index) => {
      const rotationDuration = index === currentTopIndex ? 0.01 : 1;

      gsap.to(img, {
        scale: 3.5, 
        x: 0,
        y: 0,
        rotation: index === currentTopIndex ? 0 : Math.random() * 20 - 10,
        duration: rotationDuration, 
        ease: "power1.inOut",
        duration: 0.5,
        transformOrigin: "center center",
      });
      img.style.zIndex = index === currentTopIndex ? imgs.length : 1;
    });
  }

  document.getElementById("next-image").addEventListener("click", () => {
    const imgs = galleryContainer.querySelectorAll("img");
    currentTopIndex = (currentTopIndex + 1) % imgs.length;
    setStackLayout(); 
  });

  document.getElementById("prev-image").addEventListener("click", () => {
    const imgs = galleryContainer.querySelectorAll("img");
    currentTopIndex = (currentTopIndex - 1 + imgs.length) % imgs.length;
    setStackLayout();
  });

  function setLineLayout() {
    const imgs = galleryContainer.querySelectorAll("img");
    let offsetX = 0; 

    imgs.forEach((img, index) => {
      gsap.to(img, {
        duration: 1,
        scale: 1, 
        x: offsetX,
        y: 0, 
        rotation: 0,
        ease: "power1.out",
        clearProps: "all",
      });

      offsetX += img.offsetWidth + 10; 
    });

    gsap.to(galleryContainer, {
      duration: 1,
      ease: "power1.out",
      x: (() => {
        const containerWidth = galleryContainer.offsetWidth;
        return (containerWidth - offsetX) / 2;
      })(),
    });
  }

  function setupLayoutChangeEvents() {
    document.getElementById("random-layout").addEventListener("click", () => {
      currentLayoutFunction = setRandomLayout;
      currentLayoutFunction();
    });
    document.getElementById("line-layout").addEventListener("click", () => {
      currentLayoutFunction = setLineLayout;
      currentLayoutFunction();
    });
    document.getElementById("stack-layout").addEventListener("click", () => {
      currentLayoutFunction = setStackLayout;
      currentLayoutFunction();
    });
  }

  function navigateImages(direction) {
    const imgs = galleryContainer.querySelectorAll("img");
    if (direction === "next") {
      currentTopIndex = (currentTopIndex + 1) % imgs.length;
    } else if (direction === "prev") {
      currentTopIndex = (currentTopIndex - 1 + imgs.length) % imgs.length;
    }
    setStackLayout(); 
  }

  function closeLightboxIfOpen() {
    const imgInLightbox = document.querySelector(".in-lightbox");
    if (imgInLightbox) {
      resetImage(imgInLightbox);
      document.querySelector(".closeimg").remove();
    }
  }

  document.addEventListener("keydown", function(event) {
    const imgInLightbox = document.querySelector(".in-lightbox");
    // Vérifie si une image est en mode lightbox
    if (imgInLightbox) {
      switch(event.key) {
        case "ArrowRight":
        case "ArrowLeft":
          // Si on appuie sur les flèches gauche ou droite et une image est en mode lightbox, fermer la lightbox
          closeLightboxIfOpen();
          break;
        case "Escape":
          // Comportement existant pour la touche Escape
          closeLightboxIfOpen();
          break;
      }
    } else {
      // Si aucune image n'est en mode lightbox, permet la navigation entre les images avec les flèches
      switch(event.key) {
        case "ArrowRight":
          navigateImages("next");
          break;
        case "ArrowLeft":
          navigateImages("prev");
          break;
      }
    }
  });

  let lastScrollTime = 0;

  function handleScrollEvent(e) {
    const now = Date.now();
    if (now - lastScrollTime < 500) { // Empêche les actions trop rapides
      e.preventDefault();
      return;
    }
    lastScrollTime = now;

    // Vérifie si une image est en mode lightbox
    const imgInLightbox = document.querySelector(".in-lightbox");
    if (imgInLightbox) {
      closeLightboxIfOpen(); // Ferme la lightbox sur un scroll
      return; // Ne pas continuer avec la navigation des images
    }

    // Logique pour naviguer entre les images en dehors de la lightbox
    if (e.deltaY > 0) {
      navigateImages("next"); // Scroll vers le bas
    } else if (e.deltaY < 0) {
      navigateImages("prev"); // Scroll vers le haut
    }
  }

  galleryContainer.addEventListener('wheel', handleScrollEvent);

  setupLayoutChangeEvents();
  loadImages();
  currentLayoutFunction();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGallery();
});

// -----------------------------------------------FIN AI PAGE----------------------------------------------

function initComingSoonAnimations() {
  const container = document.querySelector("#comingSoonContainer");

  if (!container) {
    return;
  }

  const colors = ["#FF477E"];

  function generateComingSoon() {
    const element = document.createElement("div");
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomAngle = Math.random() * 20 - 10;

    element.style.position = "absolute";
    element.style.fontSize = "20px";
    element.style.textTransform = "uppercase";
    element.style.left = `${randomX}%`;
    element.style.top = `${randomY}%`;
    element.style.transform = `translate(-50%, -50%) rotate(${randomAngle}deg)`;
    element.style.color = randomColor;
    element.style.opacity = 0;
    element.style.transition = "opacity 0.5s ease-in-out";
    element.innerText = "Coming Soon";
    container.appendChild(element);

    fadeIn(element, () => {
      setTimeout(() => {
        fadeOut(element, () => {
          container.removeChild(element);
        });
      }, 2000);
    });
  }

  function fadeIn(element, callback) {
    element.style.opacity = 1;
    if (callback) setTimeout(callback, 500);
  }

  function fadeOut(element, callback) {
    element.style.opacity = 0;
    if (callback) setTimeout(callback, 500);
  }

  setInterval(generateComingSoon, 100);
}

initComingSoonAnimations();

// ------------------rolling text----------------

function rollingText() {
  document.addEventListener("DOMContentLoaded", () => {
    let elements = document.querySelectorAll(".rolling-text");

    elements.forEach((element) => {
      let innerText = element.innerText;
      element.innerHTML = "";

      let textContainer = document.createElement("div");
      textContainer.classList.add("block");

      for (let i = 0; i < innerText.length; i++) {
        let letter = innerText[i];
        let span = document.createElement("span");
        span.innerText = letter.trim() === "" ? "\xa0" : letter;
        span.classList.add("letter");
        textContainer.appendChild(span);
      }

      element.appendChild(textContainer);
      let clonedContainer = textContainer.cloneNode(true);
      clonedContainer.classList.add("cloned-text");
      element.appendChild(clonedContainer);

      element.addEventListener("mouseover", () => {
        let letters = element.querySelectorAll(".letter");
        letters.forEach((letter, index) => {
          setTimeout(() => {
            letter.style.transform = "translateY(-100%)";
            letter.style.transition =
              "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)";
          }, index * 15);
        });
      });

      element.addEventListener("mouseout", () => {
        let letters = element.querySelectorAll(".letter");
        letters.forEach((letter, index) => {
          setTimeout(() => {
            letter.style.transform = "";
            letter.style.transition =
              "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)";
          }, index * 15);
        });
      });
    });
  });
}
rollingText();
// ---------------------------------STICKERS-----------------------
function initializeStickerFeature() {
  let compteur = sessionStorage.getItem("compteur")
    ? parseInt(sessionStorage.getItem("compteur"), 10)
    : 0;
  document.getElementById("compteur").innerText = compteur.toString();

  function incrementerCompteur() {
    compteur = parseInt(sessionStorage.getItem("compteur"), 10) || 0;
    compteur++;
    sessionStorage.setItem("compteur", compteur.toString());
    document.getElementById("compteur").innerText = compteur.toString();
  }

  document.addEventListener("dblclick", function (e) {
    e.preventDefault();
    var img = document.createElement("img");
    img.src = "../img/stickers.svg";
    img.className = "sticker";
    img.style.position = "fixed";
    img.style.left = `${e.clientX - 20}px`;
    img.style.top = `${e.clientY - 20}px`;
    img.style.zIndex = "1000";
    img.style.width = "40px";
    img.style.height = "40px";
    var rotation = Math.floor(Math.random() * 181) - 90;
    img.style.transform = `rotate(${rotation}deg)`;
    document.body.appendChild(img);
    incrementerCompteur();
    setTimeout(() => {
      img.classList.add("fade-out");
      img.addEventListener("transitionend", () => {
        if (img.parentNode) {
          img.parentNode.removeChild(img);
        }
      });
    }, 500);
  });

  document
    .getElementById("envoyerCoeurs")
    .addEventListener("click", function () {
      let compteur = parseInt(sessionStorage.getItem("compteur"), 10) || 0;
      if (compteur === 0) {
        return;
      }
      const intervalId = setInterval(() => {
        if (compteur > 0) {
          var img = document.createElement("img");
          img.src = "../img/stickers.svg";
          img.className = "sticker envole";
          img.style.position = "fixed";
          img.style.left = `${Math.random() * window.innerWidth}px`;
          img.style.bottom = "-100px";
          img.style.zIndex = "1000";
          img.style.width = "80px";
          img.style.height = "80px";
          img.style.opacity = "1";
          var rotation = Math.floor(Math.random() * 181) - 90;
          img.style.transform = "rotate(" + rotation + "deg)";
          document.body.appendChild(img);
          setTimeout(() => {
            img.style.bottom = `${window.innerHeight + 100}px`;
            img.style.opacity = "0";
            img.style.transition = "2s ease-in-out";
            img.addEventListener("transitionend", () => {
              if (img.parentNode) {
                img.parentNode.removeChild(img);
              }
            });
          }, 10);
          compteur--;
          sessionStorage.setItem("compteur", compteur.toString());
          document.getElementById("compteur").innerText = compteur.toString();
        } else {
          clearInterval(intervalId);
          sessionStorage.setItem("compteur", "0");
          document.getElementById("compteur").innerText = "0";
        }
      }, 100);
    });

  document
    .getElementById("compteur")
    .addEventListener("mouseover", function (e) {
      var tooltip = document.querySelector(".tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        document.body.appendChild(tooltip);
      }
      tooltip.classList.add("toolin");
      var span = document.createElement("div");
      span.innerText = "Double clique pour liker !";
      tooltip.innerHTML = "";
      tooltip.appendChild(span);
      var tooltipWidth = tooltip.offsetWidth;
      var xOffset = 15;
      var yOffset = 20;
      tooltip.style.display = "block";
      tooltip.style.left = e.pageX - tooltipWidth / 2 + "px";
      tooltip.style.top = e.pageY + yOffset + "px";
    });
  document.getElementById("compteur").addEventListener("mouseout", function () {
    var tooltip = document.querySelector(".tooltip");
    if (tooltip) {
      tooltip.style.opacity = 0;
      tooltip.classList.remove("toolin");
    }
  });
  document
    .getElementById("compteur")
    .addEventListener("mousemove", function (e) {
      var tooltip = document.querySelector(".tooltip");
      if (tooltip && tooltip.style.display === "block") {
        var tooltipWidth = tooltip.offsetWidth;
        var xOffset = 15;
        var yOffset = 20;
        tooltip.style.left = e.pageX - tooltipWidth / 2 + "px";
        tooltip.style.top = e.pageY + yOffset + "px";
        tooltip.style.opacity = 1;
      }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  initializeStickerFeature();
});

// --------------------------------- FIN STICKERS-----------------------

// --------------------------------- DELETE AND ADD FUNCTION WITH RESIZE-----------------------

function manageFeatures() {
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  if (screenWidth < 768) {
    console.log("Désactivation des fonctionnalités pour petits écrans");
  } else {
    console.log("Activation des fonctionnalités pour grands écrans");
  }
}

window.addEventListener("resize", manageFeatures);

// --------------------------------- NEXT PROJET-----------------------

function toggleNoOverlayClass() {
  const currentPage = window.location.pathname;
  const pagesWithNoOverlay = ["/index.html", "/ai.html", "/contact.html", "/merci.html"];

  if (pagesWithNoOverlay.includes(currentPage)) {
    document.body.classList.add("noOverlay");
  } else {
    document.body.classList.remove("noOverlay");
  }
}

function checkPageAndInitEffects() {
  const currentPage = window.location.pathname;
  const pagesWithEffects = ["/index.html", "/ai.html", "/contact.html"];

  if (pagesWithEffects.includes(currentPage)) {
    initCustomScrollEffect();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initCustomScrollEffect();
});

function initCustomScrollEffect() {
  let isAtBottom = false;
  let scrollBeyondBottom = 0;
  const maxSectionHeight = 80;
  const scrollThreshold = 50;

  removeExistingOverlays();

  function removeExistingOverlays() {
    const existingOverlays = document.querySelectorAll('[id^="overlay-rose"]');
    existingOverlays.forEach((overlay) => {
      overlay.parentNode.removeChild(overlay);
    });
  }

  document.addEventListener("cleanOverlays", function () {
    removeExistingOverlays();
  });

  const zoomImages = document.querySelectorAll('[id^="section-cachee"]');
  let overlays = [];

  zoomImages.forEach((zoomImage, index) => {
    manageOverlayAndZoom(zoomImage, index + 1);
  });

  function manageOverlayAndZoom(zoomImage, index) {
    const zoomImageId = zoomImage.id;
    const overlayId = "overlay-rose-" + index;

    let overlay = document.getElementById(overlayId);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.style.cssText =
        "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #FF477E; opacity: 0; z-index: 50; transition: opacity 0.5s ease-in-out;";
      document.body.appendChild(overlay);
      overlays.push(overlay);

      zoomImage.addEventListener("click", () => {
        fadeOutOverlay(overlay);
        overlays = overlays.filter((item) => item !== overlay);
      });
    }
  }

  function resetZoomAndOverlay() {
    scrollBeyondBottom = 0;
    zoomImages.forEach((zoomImage) => {
      zoomImage.style.transform = "scale(1)";
      zoomImage.style.bottom = "-100vh";
    });
    overlays.forEach((overlay) => {
      overlay.style.opacity = "0";
    });
  }

  function fadeOutOverlay(overlay) {
    if (overlay && getComputedStyle(overlay).opacity !== "0") {
      overlay.style.opacity = "0";
      setTimeout(() => {}, 500);
    }
  }

  attachEventListeners();

  function attachEventListeners() {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel, { passive: false });
  }

  function handleScroll() {
    const scrolledToBottom =
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (scrolledToBottom) {
      isAtBottom = true;
    } else {
      if (isAtBottom) {
        resetZoomAndOverlay();
      }
      isAtBottom = false;
    }
  }

  function handleWheel(e) {
    if (isAtBottom) {
      e.preventDefault();
      scrollBeyondBottom += e.deltaY;
      if (e.deltaY < 0 || scrollBeyondBottom < 0) {
        resetZoomAndOverlay();
        return;
      }

      updateZoomAndOverlay();
    }
  }

  function updateZoomAndOverlay() {
    let scale = Math.min(1 + (scrollBeyondBottom / scrollThreshold) * 0.5, 1.2);
    let newBottom = Math.min(
      maxSectionHeight,
      (scrollBeyondBottom / scrollThreshold) * maxSectionHeight
    );

    zoomImages.forEach((zoomImage) => {
      zoomImage.style.transform = `scale(${scale})`;
      zoomImage.style.bottom = `-${100 - newBottom}vh`;
    });

    overlays.forEach((overlay) => {
      overlay.style.opacity = Math.min(
        0.5,
        scrollBeyondBottom / scrollThreshold
      ).toString();
    });
  }
}

function cleanCustomScrollEffect() {
  overlays.forEach((overlay) => {
    if (overlay) {
      document.body.removeChild(overlay);
    }
  });

  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("wheel", handleWheel);

  zoomImages.forEach((zoomImage) => {
    if (zoomImage) {
      zoomImage.style.transform = "";
      zoomImage.style.bottom = "";
    }
  });
}

// ---------------------------------  FIN NEXT PROJET-----------------------
// ---------------------------------  MENU-----------------------
function initMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = mobileMenu.querySelectorAll("a");
  let menuOpen = false;

  mobileMenu.style.pointerEvents = "none";

  let tl = gsap.timeline({
    paused: true,
    onStart: () => {
      mobileMenu.style.visibility = "visible";
      mobileMenu.style.pointerEvents = "all";
    },
    onReverseComplete: () => {
      mobileMenu.style.pointerEvents = "none";
    },
  });

  tl.to(mobileMenu, {
    height: "100%",
    duration: 0.3,
    ease: "power2.inOut",
  }).from(
    menuLinks,
    {
      opacity: 0,
      duration: 0.2,
      stagger: 0.1,
      delay: 0.2,
    },
    "-=0.1"
  );

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      if (!menuOpen) {
        tl.play();
        menuBtn.textContent = "Fermer";
      } else {
        tl.reverse();
        menuBtn.textContent = "Menu";
      }
      menuOpen = !menuOpen;
    });
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (menuOpen) {
        tl.reverse();
        menuBtn.textContent = "Menu";
        menuOpen = false;
      }
    });
  });
}

initMenu();

// ---------------------------------  FIN MENU-----------------------

// ------------------------------------------------Video JS ------------------------------------------------

function autoplayVideoWhenVisible() {
  var video = document.querySelector("video");
  if (!video) return;

  video.pause();
  video.currentTime = 0;

  var options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  var callback = function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        video
          .play()
          .catch((e) =>
            console.log("Erreur lors de la lecture automatique : ", e)
          );
      } else {
        video.pause();
      }
    });
  };

  if (window.videoObserver) {
    window.videoObserver.disconnect();
  }

  window.videoObserver = new IntersectionObserver(callback, options);
  window.videoObserver.observe(video);
}

document.addEventListener("DOMContentLoaded", autoplayVideoWhenVisible);

// --------------------------------- Text slide-----------------------
function animateTextOnEnter() {
  let delayIncrement = 100;
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const container = entry.target;
          let animationName =
            container.firstChild.tagName === "HR"
              ? "expandRight"
              : "slideInText";
          const delay =
            Array.from(container.parentNode.children).indexOf(container) *
            delayIncrement;
          container.firstChild.style.animation = `${animationName} 1s ${delay}ms ease-out forwards`;
          observer.unobserve(container);
        }
      });
    },
    {
      rootMargin: "0px 0px -3% 0px",
      threshold: 0.04,
    }
  );

  const elements = document.querySelectorAll(
    "main h1, main h2, main h3, main p, main li, main hr, main a, footer h1, footer h2, footer h3, footer p, footer li, footer hr, footer a"
  );
  elements.forEach((el) => {
    if (
      !el.classList.contains("noSlide") &&
      !el.parentNode.classList.contains("containerSlide")
    ) {
      el.style.opacity = "0";

      const container = document.createElement("div");
      container.className = "containerSlide";
      el.parentNode.insertBefore(container, el);
      container.appendChild(el);

      observer.observe(container);
    }
  });
}

document.addEventListener("DOMContentLoaded", animateTextOnEnter);

// --------------------------------- FIN Text slide-----------------------

// --------------------------------- SCROLL INDEX-----------------------
function initHorizontalSmoothScrollForSwiper() {
  if (!(location.pathname.endsWith("index.html") || location.pathname === "/")) {
    return;
  }

  const swiperWrapper = document.querySelector(".swiper-wrapper");
  if (!swiperWrapper) return;

  var velocity = 0;
  var isScrollingHorizontally = false;

  function onHorizontalWheel(e) {
    e.preventDefault();
    velocity -= e.deltaY * 0.2;
    velocity = Math.max(Math.min(velocity, 100), -100);

    if (!isScrollingHorizontally) {
      isScrollingHorizontally = true;
      animateHorizontalScroll();
    }
  }

  function animateHorizontalScroll() {
    if (!isScrollingHorizontally) return;

    velocity *= 0.88;
    const currentTranslateX = parseFloat(
      getComputedStyle(swiperWrapper).transform.split(",")[4]
    );
    const newTranslateX = currentTranslateX + velocity;

    swiperWrapper.style.transform = `translate3d(${newTranslateX}px, 0, 0)`;

    if (Math.abs(velocity) > 0.88) {
      requestAnimationFrame(animateHorizontalScroll);
    } else {
      isScrollingHorizontally = false;
    }
  }

  document.addEventListener("wheel", onHorizontalWheel, { passive: false });

  window.removeHorizontalSmoothScrollListenerForSwiper = function () {
    document.removeEventListener("wheel", onHorizontalWheel, {
      passive: false,
    });
  };
}

document.addEventListener("DOMContentLoaded", function () {
  initHorizontalSmoothScrollForSwiper();
});
window.addEventListener("load", function () {
  initHorizontalSmoothScrollForSwiper();
});
// --------------------------------- SCROLL AUTRE PAGES -----------------------

function initSmoothScroll() {
  if (
    location.pathname.endsWith("index.html") ||
    location.pathname.endsWith("ai.html")
  ) {
    return;
  }

  var scrollY = window.scrollY;
  var velocity = 0;
  var isScrolling = false;

  function animateScroll() {
    if (!isScrolling) return;

    velocity *= 0.85;
    scrollY += velocity;

    if (Math.abs(velocity) > 0.5) {
      window.scrollTo(0, scrollY);
      requestAnimationFrame(animateScroll);
    } else {
      isScrolling = false;
    }
  }

  function onWheel(e) {
    e.preventDefault();
    velocity += e.deltaY * 0.5;
    scrollY = window.scrollY;

    if (!isScrolling) {
      isScrolling = true;
      animateScroll();
    }
  }

  window.addEventListener("wheel", onWheel, { passive: false });

  window.removeSmoothScrollListener = function () {
    window.removeEventListener("wheel", onWheel, { passive: false });
  };
}
document.addEventListener("DOMContentLoaded", function () {
  initSmoothScroll();
});

// --------------------------------- FIN SCROLL-----------------------

// -------------------------------PARALLAX-IMAGE-------------------------------
function updateWrapperAndImage(image) {
  const imageWidth = image.offsetWidth;
  const imageHeight = image.offsetHeight;

  const containerHeight = imageHeight * 0.9;

  let wrapper = image.closest(".parallax-container");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.classList.add("parallax-container");
    image.parentNode.insertBefore(wrapper, image);
    wrapper.appendChild(image);

    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "relative";
    wrapper.style.maxWidth = "100vw";
  }

  wrapper.style.width = `100%`;
  wrapper.style.height = `${containerHeight}px`;

  applyParallaxEffect(image, containerHeight);
}

function applyParallaxEffect(image, containerHeight) {
  // Utiliser l'attribut data-parallax-range s'il est présent, sinon utiliser 0.2 comme valeur par défaut
  const parallaxDataAttribute = image.getAttribute('data-parallax-range');
  const parallaxRange = parallaxDataAttribute ? parseFloat(parallaxDataAttribute) * containerHeight : containerHeight * 0.1;

  function doParallax() {
    const windowHeight = window.innerHeight;
    const containerRect = image.parentElement.getBoundingClientRect();
    const containerVisibleHeight = Math.min(containerRect.bottom, windowHeight) - Math.max(containerRect.top, 0);

    if (containerVisibleHeight > 0) {
      const totalScrollableDistance = windowHeight + containerHeight;
      const scrolledEntryPosition = Math.min(windowHeight - containerRect.top, windowHeight);
      const percentageScrolledThroughContainer = scrolledEntryPosition / totalScrollableDistance;
      const translateY = -(parallaxRange * percentageScrolledThroughContainer);
      image.style.transform = `translateY(${translateY}px)`;
    }
  }

  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        doParallax();
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initParallaxEffect() {
  document.querySelectorAll(".parallax-image").forEach((image) => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        updateWrapperAndImage(entry.target);
      }
    });

    observer.observe(image);

    if (image.complete) {
      updateWrapperAndImage(image);
    } else {
      image.onload = () => updateWrapperAndImage(image);
    }
  });
}

document.addEventListener("DOMContentLoaded", initParallaxEffect);


// --------------------------------PARALLAX-DIV-------------------------------

function adjustTitleMarginOnScroll() {
  if (window.innerWidth >= 768) { // Exécuter seulement si la largeur de la fenêtre est au moins 768 pixels
    const titles = document.querySelectorAll('.title-project');
    titles.forEach(title => {
      const additionalMargin = window.scrollY * 0.06; // Ajustez ce facteur au besoin
      const additionalMarginB = window.scrollY * 0.02; // Ajustez ce facteur au besoin
      title.style.marginTop = `${-15 - additionalMargin}vh`; // `-15` est la marge de base. Ajustez selon vos besoins.
      title.style.marginBottom = `${5 + additionalMarginB}vh`; // `5` est la marge de base. Ajustez selon vos besoins.
    });
  }
}

window.addEventListener('scroll', adjustTitleMarginOnScroll);

document.addEventListener("DOMContentLoaded", function() {
  initParallaxEffectForDivsAndTitles();
});

function applyParallaxEffectToDivAndTitle(div) {
  const initialHeight = div.offsetHeight; // Hauteur initiale pour les calculs.
  const title = div.querySelector('.title-project'); // Recherche du titre dans la div.
  
  // Définit un point de référence initial pour la marge inférieure du titre, si nécessaire
  let initialMarginBottom = 5; // La valeur initiale, peut être ajustée selon le besoin ou calculée dynamiquement

  // Fonction pour ajuster la hauteur de la div et la position du titre en fonction du défilement.
  function adjustDivAndTitle() {
    if (window.innerWidth < 768) {
      // Pour les écrans plus petits, applique une hauteur fixe et réinitialise la position du titre.
      div.style.setProperty('height', '32vh', 'important');
      if (title) {
        title.style.marginBottom = initialMarginBottom + 'vh'; // Réinitialise la marge du titre
        title.style.transform = 'translateY(0)'; // Réinitialise la position du titre.
      }
    } else {
      const windowHeight = window.innerHeight;
      const divTopToViewportTop = div.getBoundingClientRect().top;
      const scrollDistanceFromTop = window.scrollY;

      // Calcule la nouvelle hauteur de la div en fonction du défilement.
      const parallaxIntensity = 0.5;
      let newHeight = Math.max(initialHeight - (scrollDistanceFromTop * parallaxIntensity), initialHeight * 0.5);
      div.style.setProperty('height', `${newHeight}px`, 'important');

      // Déplace le titre plus rapidement que la div pour accentuer l'effet de parallaxe.
      if (title) {
        const titleMovementIntensity = 0.1; // Intensité du mouvement du titre
        const titleTranslation = Math.max(0, (scrollDistanceFromTop - divTopToViewportTop) * titleMovementIntensity);
        title.style.transform = `translateY(-${titleTranslation}px)`; // Applique la translation au titre.

        // Ajustement dynamique de la marge inférieure du titre en fonction du défilement
        const scrollFactor = 0.05; // Facteur d'ajustement pour la marge en fonction du défilement
        const additionalMargin = window.scrollY * scrollFactor;
        title.style.marginBottom = `${initialMarginBottom + additionalMargin}vh`;
      }
    }
  }

  // Écoute les événements de défilement et de redimensionnement pour ajuster la div et le titre.
  window.addEventListener('scroll', adjustDivAndTitle);
  window.addEventListener('resize', adjustDivAndTitle);

  adjustDivAndTitle(); // Appel initial pour ajuster dès le chargement de la page.
}

function initParallaxEffectForDivsAndTitles() {
  document.querySelectorAll(".hp-projet, .background-clone").forEach(applyParallaxEffectToDivAndTitle);
}


// --------------------------------PARALLAX-DIV-------------------------------

function removeOpacityHome() {
  document.querySelectorAll(".opacityhome").forEach(function (el) {
    el.classList.remove("opacityhome");
  });
}

window.addEventListener("preloaderFinished", removeOpacityHome);

barba.hooks.after(() => {
  removeOpacityHome();
});

// -----------------------------transition barba-----------------------------------
document.addEventListener("DOMContentLoaded", function () {

  function preloadBackgroundImages() {
    const images = document.querySelectorAll("img");
    let imagesLoaded = 0;

    images.forEach((img) => {
      const imageUrl = img.getAttribute("src");
      const imageExtension = imageUrl.substring(
        imageUrl.lastIndexOf("."),
        imageUrl.length
      );
      const imageNameWithoutExtension = imageUrl.substring(
        0,
        imageUrl.lastIndexOf(".")
      );
      const highResImageUrl = `${imageNameWithoutExtension}-h${imageExtension}`;

      const preloadedImage = new Image();
      preloadedImage.src = highResImageUrl;
      preloadedImage.onload = function() {
        imagesLoaded++;
        if(imagesLoaded === images.length) {
          console.log("Toutes les images ont été préchargées !");
        }
      };
    });
  }

  // Vérifie si les images sont déjà préchargées dans le stockage local
  const imagesPreloaded = localStorage.getItem("imagesPreloaded");
  if (!imagesPreloaded) {
    // Si les images ne sont pas préchargées, chargez-les et enregistrez-les dans le stockage local
    preloadBackgroundImages();
    localStorage.setItem("imagesPreloaded", true);
  }



  barba.init({
    preventRunning: true,
    transitions: [
      {
        name: "fade",
        once(data) {
          initializtions();
          transitionWithBackgroundImage();
          initHorizontalSmoothScrollForSwiper();
          initCustomScrollEffect();
          initMenu();
          autoplayVideoWhenVisible();
          initAboutInteractions();
          updateClock();
          adjustTextOpacity();
          initializeStickerFeature();
          initProjectHoverAnimation();
          rollingText();
          initComingSoonAnimations();
          initializeGallery();
        },

        async leave(data) {
          const done = this.async();
          document.dispatchEvent(new Event("cleanOverlays"));

          const imgToAnimate =
            data.trigger && data.trigger.querySelector("img");
          if (imgToAnimate) {
   
            await transitionWithBackgroundImage(imgToAnimate, () => done());
          } else {
            await gsap.to(data.current.container, {
              opacity: 0,
              duration: 0.3,
            });
            done(); 
          }
        },

        enter(data) {
          window.scrollTo(0, 0);
          initCustomScrollEffect();
          initHorizontalSmoothScrollForSwiper();
          initComingSoonAnimations();
          initializeGallery();

          gsap.from(data.next.container, {
            opacity: 0,
            duration: 2,
            delay: 0.5,
          });
        },

        beforeEnter({ next }) {
          const images = next.container.querySelectorAll("img");
          gsap.set(images, { clearProps: "all" });
          gsap.set(next.container, { opacity: 1 });
        },
        afterEnter(data) {
          autoplayVideoWhenVisible();
          toggleNoOverlayClass();
          initAboutInteractions();
        },
      },
    ],
  });
  barba.hooks.enter(() => {
    initParallaxEffect();
    initParallaxEffectForDivsAndTitles();
    adjustTitleMarginOnScroll();
    if (window.removeSmoothScrollListener) {
      window.removeSmoothScrollListener();
    }
    initSmoothScroll();
    initProjectHoverAnimation();
    rollingText();
    adjustTextOpacity();
    updateClock();
    initHorizontalSmoothScrollForSwiper();
    animateTextOnEnter();
    disableCurrentPageLinks();
    transitionWithBackgroundImage();
    initScrollReveal();

    initMenu();
  });
  barba.hooks.after(() => {
    initializtions();
    removeOpacityHome();
    initProjectHoverAnimation();
    adjustTextOpacity();
    initHorizontalSmoothScrollForSwiper();
    transitionWithBackgroundImage();
    initializeStickerFeature();

    document.querySelectorAll(".sticker").forEach((sticker) => {
      sticker.parentNode.removeChild(sticker);
    });
  });

  let isReturningHome = false; 

  barba.hooks.beforeEnter((data) => {
    const isHomePage =
      window.location.pathname === "/" ||
      window.location.pathname.endsWith("index.html");
    if (isHomePage) {
      const swiperSlides = document.querySelectorAll(".swiper-slide");
      swiperSlides.forEach((slide) => {
        slide.style.transform = "translateY(50vh)";
        slide.style.opacity = "0";
      });
      isReturningHome = true;
    }
  });

  barba.hooks.afterEnter(() => {
    adjustTextOpacity();
    if (isReturningHome) {
      console.log("Returning to home page, animate slides.");
      setTimeout(() => {
        const swiperSlides = document.querySelectorAll(".swiper-slide");
        swiperSlides.forEach((slide, index) => {
          setTimeout(() => {
            slide.classList.add("slideUpAndFadeIn");
          }, index * 50);
        });
      }, 50);
      isReturningHome = false;
    }
  });

  barba.hooks.beforeLeave((data) => {
    const clonedImageFromTransition = document.querySelector(
      ".background-clone.from-image-transition"
    );
    if (clonedImageFromTransition) {
      gsap.to(clonedImageFromTransition, {
        duration: 0.1,
        opacity: 0,
        onComplete: () => {
          clonedImageFromTransition.remove();
        },
      });
    }
  });
});
function transitionWithBackgroundImage(imgToAnimate, callback) {
  const backgroundDiv = document.createElement("div");
  backgroundDiv.classList.add("background-clone", "from-image-transition");
  document.body.appendChild(backgroundDiv);

  let imageUrl = imgToAnimate.src;
  const imageExtension = imageUrl.substring(
    imageUrl.lastIndexOf("."),
    imageUrl.length
  );
  const imageNameWithoutExtension = imageUrl.substring(
    0,
    imageUrl.lastIndexOf(".")
  );
  imageUrl = `${imageNameWithoutExtension}-h${imageExtension}`;

  backgroundDiv.style.backgroundImage = `url('${imageUrl}')`;
  backgroundDiv.style.backgroundSize = "cover";
  backgroundDiv.style.backgroundPosition = "center";

  const rect = imgToAnimate.getBoundingClientRect();

  backgroundDiv.style.position = "fixed";
  backgroundDiv.style.left = `${rect.left}px`;
  backgroundDiv.style.top = `${rect.top}px`;
  backgroundDiv.style.width = `${rect.width}px`;
  backgroundDiv.style.height = `${rect.height}px`;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if (screenWidth < 768) {

    gsap.to(backgroundDiv, {
      width: "calc(100% - 20px)",
      height: "32vh",
      position: "fixed",
      x: "0",
      y: "0",
      top: "100px",
      left: "10px",
      right:"10px",
      scale: 1,
      zIndex: -1,
      duration: 1.5,
      ease: "expo.inOut",
      onComplete: () => {
        backgroundDiv.style.position = "absolute";
        setTimeout(() => {
          backgroundDiv.classList.add("imgClonedResize"); // Ajouter votre classe ici
          callback();
        }, 10);
      },
    });
  } else {
 
    gsap.to(backgroundDiv, {
      x: screenWidth / 2 - rect.width / 2 - rect.left,
      y: screenHeight / 2 - rect.height / 2 - rect.top,
      scale: 1.1,
      duration: 1.5,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.to(backgroundDiv, {
          width: "calc(100% - 80px)",
          height: "85vh",
          transformOrigin: "center center",
          position: "fixed",
          x: "0",
          y: "0",
          top: "100px",
          left: "40px",
          right: "40px",
          opacity: 1,
          scale: 1,
          zIndex: -2,
          duration: 1.5,
          ease: "expo.inOut",
          onComplete: () => {
 
            setTimeout(() => {
              backgroundDiv.style.position = "absolute";
              backgroundDiv.classList.add("imgClonedResize"); // Ajouter votre classe ici
              callback();
            }, 100); 
          },
        });
      },
    });
  }

  const allTargets = document.querySelectorAll(
    ".indicator-container, .swiper-slide:not(:focus), #hoverTextContainer, .main-content"
  );
  gsap.to(allTargets, {
    opacity: 0,
    duration: 0.8,
  });
}

// ------------------------------------------------RECHARGEMENT JS ------------------------------------------------
function initializtions() {
  if (
    window.location.pathname == "/index.html" ||
    window.location.pathname == "/"
  ) {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
  } else {
    document.body.style.overflow = "auto";
  }

  // ------------------------------------------------OVERLAY ------------------------------------------------
  let leaveTimer;
  let movementTimer;
  document.addEventListener('preloaderFinished', () => {
    document.body.addEventListener("mouseleave", function () {
      leaveTimer = setTimeout(function () {
        var overlay = document.getElementById("overlay");
        overlay.classList.remove("overlay-hidden");
        overlay.classList.add("overlay-visible");
      }, 2000);
    });
  
    document.body.addEventListener("mousemove", function () {
      clearTimeout(movementTimer);
  
      movementTimer = setTimeout(function () {
        var overlay = document.getElementById("overlay");
        overlay.classList.remove("overlay-hidden");
        overlay.classList.add("overlay-visible");
      }, 15000);
    });
  
    document.body.addEventListener("mouseover", function () {
      clearTimeout(leaveTimer);
      clearTimeout(movementTimer);
  
      var overlay = document.getElementById("overlay");
      if (overlay.classList.contains("overlay-visible")) {
        overlay.classList.add("overlay-hidden");
        overlay.classList.remove("overlay-visible");
      }
    });
  });
  
  
  // ------------------animation slider----------------

  function isProbablyDesktop() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  var swiperConfig = {
    loopedSlides: 8,
    direction: "horizontal",
    loop: true,
    slidesPerView: "auto",
    freeMode: true,
    cssMode: true,
    // speed: 2000,
    centeredSlides: false,
    mousewheel: {
      speed: 700,
    },
    on: {
      init: function () {
        this.slideTo(this.loopedSlides);
      },
      slideChange: function () {
        var currentIndex = this.realIndex;
        var totalSlides = this.loopedSlides;
        document.getElementById("currentSlide").textContent = currentIndex + 1;
        document.getElementById("totalSlides").textContent = totalSlides;
      },
    },
    breakpoints: {},
  };

  if (!isProbablyDesktop()) {
    swiperConfig.breakpoints = {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
        loop: false,
      },
    };
  }

  var swiper = new Swiper(".infinite-container", swiperConfig);

  // ------------------Indicateur circulaire ----------------

  var multiplier = 2.5;
  var totalIndicators = swiper.loopedSlides * multiplier;

  var indicatorContainer = document.querySelector(".indicator-container");

  swiper.on("slideChange", function () {
    var totalSlides = this.slides.length / multiplier;
    var progress = (this.realIndex + 1) / totalSlides;
    var circle = document.querySelector(".progress-circle");
    var circumference = 2 * Math.PI * 18;
    var dashArray = progress * circumference + ", " + circumference;
    circle.setAttribute("stroke-dasharray", dashArray);
    var color = `rgba(255, 71, 126, 1)`;
    circle.setAttribute("stroke", color);
  });

  // ------------------text hover block----------------

  var thumbContainers = document.querySelectorAll(".thumbContainer");
  var hoverTextContainer = document.getElementById("hoverTextContainer");

  thumbContainers.forEach(function (thumbContainer) {
    var infoProjetText = thumbContainer.querySelector(".info-projet p");

    thumbContainer.addEventListener("mouseenter", function () {
      hoverTextContainer.innerHTML = "";


      var docFragment = document.createDocumentFragment();

      var htmlWithMarker = infoProjetText.innerHTML.replace(
        /<br\s*\/?>/gi,
        "||br||"
      );
      var lines = htmlWithMarker.split("||br||");

      lines.forEach((lineText, index) => {
        const lineDiv = document.createElement("div");
        lineDiv.classList.add("line");
        lineDiv.style.setProperty("--line-index", index);

        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = lineText;
        lineText = tempDiv.textContent || tempDiv.innerText || "";

        lineDiv.textContent = lineText;
        docFragment.appendChild(lineDiv);
      });

      hoverTextContainer.appendChild(docFragment);
      hoverTextContainer.style.display = "block";
    });

    thumbContainer.addEventListener("mouseleave", function () {
      hoverTextContainer.style.display = "none";
    });
  });

  var mainSlider = new Swiper(".main-slider", {
    direction: "vertical",
    slidesPerView: "auto",
    centeredSlides: true,
    loop: false,
    mousewheel: true,
    spaceBetween: 10,
    freeMode: true,
    freeModeMomentum: true,
    freeModeSticky: true,

    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
  });

  var thumbSlider = new Swiper(".thumb-slider", {
    direction: "vertical",
    slidesPerView: "auto",
    centeredSlides: true,
    loop: false,
    mousewheel: false,
    spaceBetween: 10,
  });

  mainSlider.controller.control = thumbSlider;
  thumbSlider.controller.control = mainSlider;

  document.addEventListener("DOMContentLoaded", function () {
    var slides = document.querySelectorAll(".thumb-slider .swiper-slide");
    var slidess = document.querySelectorAll(".main-slider .swiper-slide");

    slides.forEach((slide, index) => {
      slide.style.opacity = 0;
      slide.style.animation = `slideUp 0.5s ease forwards ${index * 0.3}s`;
    });
    slidess.forEach((slidess, index) => {
      slidess.style.opacity = 0;
      slidess.style.animation = `slideUp 1.5s ease forwards ${index * 0.3}s`;
    });
  });




  // ------------------------------------------------FIN INITIALE ------------------------------------------------
}

// ------------------------------------------------FIN INITIALE ------------------------------------------------

// ------------------about----------------
function initAboutInteractions() {
  function wrapElements(hiddenDiv) {
    if (hiddenDiv) {
      var children = hiddenDiv.querySelectorAll("h2, h3, p, a");
      var delay = 0; // Initialiser le délai
      children.forEach(function (child) {
        if (!child.classList.contains("overflow-content")) {
          var wrapper = document.createElement("div");
          wrapper.classList.add("overflow-content");
          child.parentNode.insertBefore(wrapper, child);
          wrapper.appendChild(child);
          child.style.animationDelay = delay + "s";
          delay += 0.05;
        }
      });
    }
  }

  function applyFadeEffect(hiddenDiv, fadeIn = true) {
    const hrs = hiddenDiv.querySelectorAll("hr");
    hrs.forEach((hr) => {
      hr.classList.remove(fadeIn ? "fade-out-hr" : "fade-in-hr");
      hr.classList.add(fadeIn ? "fade-in-hr" : "fade-out-hr");
    });
  }

  document.querySelectorAll(".about-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const hiddenDiv = document.querySelector(".hidden-div");
      hiddenDiv.style.transform = "translateX(0%)";
      hiddenDiv.classList.add("content-about");
      hiddenDiv.classList.remove("content-about-remove");
      applyFadeEffect(hiddenDiv, true);
    });
  });

  document.querySelectorAll(".close-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const hiddenDiv = document.querySelector(".hidden-div");
      hiddenDiv.style.transform = "translateX(100%)";
      hiddenDiv.classList.add("content-about-remove");
      hiddenDiv.classList.remove("content-about");
      applyFadeEffect(hiddenDiv, false);
    });
  });


  document.querySelectorAll(".hidden-div").forEach(function (hiddenDiv) {
    wrapElements(hiddenDiv);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initAboutInteractions();
});

// ---------------------------------Fin ABout-----------------------

// ---------------------------------CLock-----------------------

function updateClock() {
  let franceTime = new Date().toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
  });

  document.querySelectorAll(".clock").forEach(function (clockElement) {
    clockElement.textContent = franceTime;
  });

  setTimeout(updateClock, 1000);
}

function initClock() {
  updateClock();
}

window.onload = function () {
  initClock();
};

// --------------------------------- FIN CLock-----------------------
// -----------------------------------------------DESCRIPTION SCROLL----------------------------------------------

function adjustTextOpacity() {

  function createAdjustWordOpacity(textContainer) {
    return function () {
      const spans = textContainer.querySelectorAll("span");
      const totalWords = spans.length;
      const viewportHeight = window.innerHeight;
      const { top } = textContainer.getBoundingClientRect();
      const targetTop = viewportHeight * 0.2;

      let progress = (viewportHeight - top) / (viewportHeight - targetTop);
      progress = Math.min(Math.max(progress, 0), 1);

      let wordsToReveal = Math.floor(totalWords * progress);

      spans.forEach((span, index) => {
        span.style.opacity = index < wordsToReveal ? 1 : 0.2;
      });
    };
  }

  const textContainers = document.querySelectorAll(".dynamicText");
  textContainers.forEach((textContainer) => {
    const text = textContainer.textContent;
    textContainer.innerHTML = text
      .split(/\s+/)
      .map(
        (word) =>
          `<span style="opacity: 0.2; transition: opacity 0.5s;">${word}</span>`
      )
      .join(" ");

    const adjustWordOpacity = createAdjustWordOpacity(textContainer);
    window.addEventListener("scroll", adjustWordOpacity);
    window.addEventListener("resize", adjustWordOpacity);
    adjustWordOpacity();
  });
}

document.addEventListener("DOMContentLoaded", adjustTextOpacity);

// -----------------------------------------------FIN DESCRIPTION SCROLL----------------------------------------------

// -------------------------------------- PAGE 404--------------------------------------

let engine = Matter.Engine.create();
let world = engine.world;

world.gravity.y = 0.6;

let bodies = [];
let num404s = 250;
let originalWidth = 100;
let originalHeight = 100; 
let desiredWidth = 50; 
let desiredHeight = 50; 
let xScale = desiredWidth / originalWidth;
let yScale = desiredHeight / originalHeight;
let imageDetails = [
  { texture: "../img/4041.svg", xScale: 1, yScale: 1 }, 
  { texture: "../img/4042.svg", xScale: 0.1, yScale: 0.1 }, 
];

for (let i = 0; i < num404s; i++) {
  let x = Math.random() * window.innerWidth;
  let y = (Math.random() * -window.innerHeight) / 2;
  let imageDetail =
    imageDetails[Math.floor(Math.random() * imageDetails.length)];

  let body = Matter.Bodies.rectangle(x, y, 50, 50, {
    label: "404",
    render: {
      sprite: {
        texture: imageDetail.texture,
        xScale: imageDetail.xScale,
        yScale: imageDetail.yScale,
      },
    },
  });
  bodies.push(body);

  setTimeout(() => {
    Matter.World.add(world, body);
  }, Math.random() * 5000);
}

let ground = Matter.Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight + 50,
  window.innerWidth,
  100,
  {
    isStatic: true,
  }
);
Matter.World.add(world, ground);

let borderOptions = {
  isStatic: true,
  render: {
    visible: false,
  },
};
let borderLeft = Matter.Bodies.rectangle(
  -5,
  window.innerHeight / 2,
  10,
  window.innerHeight,
  borderOptions
);
let borderRight = Matter.Bodies.rectangle(
  window.innerWidth + 5,
  window.innerHeight / 2,
  10,
  window.innerHeight,
  borderOptions
);
Matter.World.add(world, [borderLeft, borderRight]);

let render = Matter.Render.create({
  element: document.getElementById("container"),
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "transparent",
    showAngleIndicator: false,
    showCollisions: false,
    showVelocity: false,
    showIds: false,
    showShadows: false,
    strokeStyle: "transparent",
  },
});

Matter.Render.run(render);
Matter.Runner.run(engine);
Matter.Composite.add(world, [ground]);

window.addEventListener("resize", function () {
  Matter.Render.canvas.width = window.innerWidth;
  Matter.Render.canvas.height = window.innerHeight;
  Matter.Render.bounds.max.x = window.innerWidth;
  Matter.Render.bounds.max.y = window.innerHeight;
  Matter.Render.options.width = window.innerWidth;
  Matter.Render.options.height = window.innerHeight;
  Matter.Bounds.update(render.bounds, engine.world.bounds);
});

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
});

Matter.World.add(world, mouseConstraint);

Matter.Events.on(mouseConstraint, "mousemove", function (event) {
  let position = event.mouse.position;
  for (let i = 0; i < bodies.length; i++) {
    let body = bodies[i];
    let distance = Matter.Vector.magnitude(
      Matter.Vector.sub(position, body.position)
    );
    if (distance < 50) {
      let direction = Matter.Vector.normalise(
        Matter.Vector.sub(body.position, position)
      );
      Matter.Body.applyForce(
        body,
        body.position,
        Matter.Vector.mult(direction, 0.01)
      );
    }
  }
});
``;
// -------------------------------------- fin PAGE 404--------------------------------------
