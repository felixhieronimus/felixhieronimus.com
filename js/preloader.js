
// ------------------animation slider----------------
var swiper = new Swiper(".infinite-container", {

});


// ------------------preloader----------------

function getVisibleImages() {
  const images = document.querySelectorAll('.swiper-slide .initial-image');
  const visibleImages = [];
  const viewportWidth = window.innerWidth;

  images.forEach(image => {
    const rect = image.getBoundingClientRect();
    if (rect.left < viewportWidth && rect.right > 0) { // Vérifie si l'image est dans le viewport
      visibleImages.push(image);
    }
  });

  return visibleImages;
}
window.onload = function() {
  var path = window.location.pathname;
  var page = path.split("/").pop();

  if (page === "index.html" || page === "") {
    initPreloader();
  }
};

// document.addEventListener('DOMContentLoaded', function () {
//   var path = window.location.pathname;
//   var page = path.split("/").pop();

//   if (page === "index.html" || page === "") {
//     initPreloader();
//   }
// });

function initPreloader() {

  
  if (sessionStorage.getItem('preloaderShown') === 'true') {
    revealContent();
    return;
  }



  sessionStorage.setItem('preloaderShown', 'true');

  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  document.body.prepend(preloader);
  document.body.style.pointerEvents = 'none';
  document.documentElement.style.height = '100vh';

  const imagesContainer = document.createElement('div');
  imagesContainer.id = 'preloader-images';
  preloader.appendChild(imagesContainer);

  const percentageText = document.createElement('div');
  percentageText.id = 'preloader-percentage';
  percentageText.style.position = 'fixed';
  percentageText.style.right = '20px';
  percentageText.style.bottom = '20px';
  percentageText.innerHTML = '0%';
  preloader.appendChild(percentageText);

  // Utilise getVisibleImages pour déterminer les images à cloner
  let images = getVisibleImages();
  const cloneInfo = [];
  while (images.length > 0 && cloneInfo.length < 3) {
    const randomIndex = Math.floor(Math.random() * images.length);
    const original = images[randomIndex];
    images.splice(randomIndex, 1);

    const clone = original.cloneNode();
    clone.style.width = '100px';
    clone.style.height = 'auto';
    clone.style.position = 'absolute';
    clone.style.scale = '.5';
    clone.style.opacity = '0'; // Opacité initiale à 0
    clone.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
    clone.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    imagesContainer.appendChild(clone);

    const originalRect = original.getBoundingClientRect();
    cloneInfo.push({ clone, originalRect });
  }
  cloneInfo.forEach(({ clone }, index) => {
    // Démarrez l'animation d'opacité immédiatement pour chaque clone
    gsap.to(clone, {
      opacity: 1, // Anime l'opacité de 0 à 1
      delay: 0.2 * index, // Introduit un délai pour que les images apparaissent successivement
      duration: 0.5,
      scale: 1, // Réduit la taille à 50% de l'original
    });
  });
  

  Promise.all([loadImages(), document.fonts.ready]).then(() => {
    simulateLoading(percentageText, () => {
      let animationsCompleted = 0;
      cloneInfo.forEach(({ clone, originalRect }) => {
        gsap.to(clone, {
          x: originalRect.left - clone.getBoundingClientRect().left + window.scrollX,
          y: originalRect.top - clone.getBoundingClientRect().top + window.scrollY,
          width: originalRect.width,
          height: originalRect.height,
          duration: 1.5,
          ease: "expo.inOut",
          onComplete: () => {
            animationsCompleted++;
            if (animationsCompleted === cloneInfo.length) {
              revealContent();
              setTimeout(() => {
                preloader.remove();
                document.body.style.pointerEvents = 'all';
              }, 1000);
            }
          }
        });
      });
    });
  });
}
function loadImages() {
  return new Promise(resolve => {
    const images = document.images;
    const imagesToLoad = Array.from(images);
    let imagesLoaded = 0;

    function imageLoaded() {
      imagesLoaded++;
      if (imagesLoaded === imagesToLoad.length) {
        resolve();
      }
    }

    if (imagesToLoad.length === 0) {
      resolve();
    } else {
      imagesToLoad.forEach(img => {
        if (img.complete) {
          imageLoaded();
        } else {
          img.addEventListener('load', imageLoaded);
          img.addEventListener('error', imageLoaded);
        }
      });
    }
  });
}

function simulateLoading(percentageText, callback) {
  let percentage = 0;
  const interval = setInterval(() => {
    percentage += 5;
    percentageText.innerHTML = `${percentage}%`;
    if (percentage >= 100) {
      clearInterval(interval);
      setTimeout(callback, 2500);
    }
  }, 100);
}

function revealContent() {
  console.log("Reveal content called");
  const elements = document.querySelectorAll('.opacityhome');
  elements.forEach(el => {
    el.style.opacity = 1;
    el.style.transition = 'opacity 2s ease';
  });

  const event = new Event('preloaderFinished');
  document.dispatchEvent(event);
  // Indiquer que le contenu est révélé
  sessionStorage.setItem('preloaderFinished', 'true');
}
