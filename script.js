document.addEventListener("DOMContentLoaded", () => {
  initializeCarousel()
  initializeAutoTimeChange()
  initializeSkyObjects()
  initializeHorizontalScrolls()
  initializeMenuToggle() // Add this line to initialize the menu toggle functionality
})

function initializeCarousel() {
  const carousel = document.querySelector(".carousel-container")
  if (!carousel) return

  const items = document.querySelectorAll(".carousel-item")
  let currentRotation = 0
  const rotationStep = 0.2
  let radius = calculateRadius() // Nuevo método para calcular el radio
  let isRotating = true
  let animationId
  let touchStartX = 0
  let touchStartY = 0

  // Función para calcular el radio basado en el ancho de la pantalla
  function calculateRadius() {
    const screenWidth = window.innerWidth
    if (screenWidth <= 480) {
      return screenWidth * 0.35 // 35% del ancho de la pantalla para móviles pequeños
    } else if (screenWidth <= 768) {
      return screenWidth * 0.4 // 40% del ancho de la pantalla para tablets
    } else {
      return 450 // Valor original para desktop
    }
  }

  function updateItemsPositions() {
    const screenWidth = window.innerWidth
    items.forEach((item, index) => {
      const angle = (index * 36 + currentRotation) * (Math.PI / 180)
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      // Ajustar la opacidad basada en la posición horizontal para móviles
      let opacity
      if (screenWidth <= 768) {
        // En móviles, mostrar elementos en el lado izquierdo y derecho
        opacity = x < -radius ? 0 : 1
      } else {
        // Mantener la lógica original para desktop
        opacity = Math.sin(angle) < 0 ? 1 : Math.sin(angle) < 0.2 ? 1 - Math.sin(angle) * 5 : 0
      }

      item.style.transform = `translate(${x}px, ${y}px)`
      item.style.opacity = opacity
      item.style.pointerEvents = opacity > 0 ? "auto" : "none"
    })
  }

  function rotateCarousel() {
    if (isRotating) {
      currentRotation += rotationStep
      if (currentRotation >= 360) currentRotation = 0
      updateItemsPositions()
    }
    animationId = requestAnimationFrame(rotateCarousel)
  }

  // Eventos táctiles para móviles
  carousel.addEventListener("touchstart", (e) => {
    isRotating = false
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  })

  carousel.addEventListener("touchmove", (e) => {
    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    const deltaX = touchX - touchStartX
    const deltaY = touchY - touchStartY

    // Calcular la dirección del movimiento
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      currentRotation += deltaX * 0.2
      updateItemsPositions()
    }

    touchStartX = touchX
    touchStartY = touchY
  })

  carousel.addEventListener("touchend", () => {
    isRotating = true
  })

  // Eventos de mouse
  carousel.addEventListener("mouseenter", () => {
    isRotating = false
  })

  carousel.addEventListener("mouseleave", () => {
    isRotating = true
  })

  items.forEach((item) => {
    item.addEventListener("click", () => {
      currentRotation += 36
      updateItemsPositions()
    })
  })

  // Actualizar radio cuando cambie el tamaño de la ventana
  window.addEventListener("resize", () => {
    radius = calculateRadius()
    updateItemsPositions()
  })

  // Inicializar
  updateItemsPositions()
  rotateCarousel()
}

function initializeAutoTimeChange() {
  function updateTimeOfDay() {
    const hour = new Date().getHours()
    let timeOfDay

    if (hour >= 6 && hour < 12) {
      timeOfDay = 'morning'
    } else if (hour >= 12 && hour < 19) {
      timeOfDay = 'afternoon'
    } else {
      timeOfDay = 'night'
    }

    document.body.className = timeOfDay
    updateSkyObjects(timeOfDay)
  }

  // Actualizar inmediatamente
  updateTimeOfDay()

  // Calcular el tiempo hasta la próxima hora
  const now = new Date()
  const minutesUntilNextHour = 60 - now.getMinutes()
  const secondsUntilNextHour = 60 - now.getSeconds()
  const msUntilNextHour = (minutesUntilNextHour * 60 + secondsUntilNextHour) * 1000

  // Programar la primera actualización al inicio de la próxima hora
  setTimeout(() => {
    updateTimeOfDay()
    // Después de la primera actualización, programar actualizaciones cada hora
    setInterval(updateTimeOfDay, 3600000) // 3600000 ms = 1 hora
  }, msUntilNextHour)
}

function initializeSkyObjects() {
  const skyContainer = document.getElementById("sky-objects")
  const time = document.body.className
  updateSkyObjects(time)
}

function updateSkyObjects(time) {
  const skyContainer = document.getElementById("sky-objects")
  skyContainer.innerHTML = ""

  document.body.className = time

  if (time === "night") {
    createStars(skyContainer)
  } else {
    createClouds(skyContainer)
  }
}

function createClouds(container) {
  const cloudCount = 5
  const minDuration = 30
  const maxDuration = 60
  const minHeight = 100 // Nueva altura mínima
  const maxHeight = 300 // Nueva altura máxima

  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div")
    cloud.className = "cloud"
    cloud.style.top = `${minHeight + Math.random() * (maxHeight - minHeight)}px`
    cloud.style.animationDuration = `${minDuration + Math.random() * (maxDuration - minDuration)}s`
    cloud.style.animationDelay = `${Math.random() * maxDuration}s`
    container.appendChild(cloud)
  }
}

function createStars(container) {
  const starCount = 100 // AJUSTAR: Cantidad de estrellas

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div")
    star.className = "star"
    star.style.top = `${Math.random() * 100}%`
    star.style.left = `${Math.random() * 100}%`
    star.style.animationDelay = `${Math.random()}s`
    container.appendChild(star)
  }
}

// Funcionalidad para el scroll horizontal
function initializeHorizontalScrolls() {
  const scrollContainers = [
    document.querySelector('.stories-container'),
    document.querySelector('.minigames-container'),
    document.querySelector('.characters-container'),
    document.querySelector('.games-container')
  ];

  // Add styles for centered section titles
  const sectionTitles = document.querySelectorAll('.content-section h2');
  sectionTitles.forEach(title => {
    title.style.textAlign = 'center';
    title.style.marginBottom = '30px';
  });

  scrollContainers.forEach(container => {
    if (!container) return;
    
    const section = container.closest('.content-section');
    if (!section) return;
    
    // Remove existing arrows
    const existingLeftArrows = section.querySelectorAll('.scroll-arrow.left');
    const existingRightArrows = section.querySelectorAll('.scroll-arrow.right');
    
    existingLeftArrows.forEach(arrow => arrow.remove());
    existingRightArrows.forEach(arrow => arrow.remove());
    
    const cards = container.querySelectorAll('.story-card, .minigame-card, .character-card, .game-card');
    
    // Only create arrows if there are enough cards to scroll
    if (cards.length <= 1) return;
    
    // Create arrows only if needed
    const leftArrow = document.createElement('div');
    leftArrow.className = 'scroll-arrow left';
    leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    section.appendChild(leftArrow);
    
    const rightArrow = document.createElement('div');
    rightArrow.className = 'scroll-arrow right';
    rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    section.appendChild(rightArrow);
    
    if (!cards.length) return;
    
    // Adjust card widths based on screen size
    function adjustCardWidths() {
      const containerWidth = container.clientWidth;
      const isMobile = window.innerWidth <= 768;
      const gap = 30; // Gap between cards
      
      // On mobile and tablets, show only one card at a time
      if (isMobile) {
        const cardWidth = containerWidth - (gap * 2);
        cards.forEach(card => {
          card.style.flex = `0 0 ${cardWidth}px`;
          card.style.minWidth = `${cardWidth}px`;
          card.style.maxWidth = `${cardWidth}px`;
        });
        return cardWidth + gap;
      } else {
        // On desktop, maintain fixed size
        cards.forEach(card => {
          card.style.flex = '0 0 300px';
          card.style.minWidth = '300px';
          card.style.maxWidth = '300px';
        });
        return 330; // 300px + 30px gap
      }
    }
    
    let scrollAmount = adjustCardWidths();
    
    // Check if we need arrows (only if content width exceeds container width)
    function checkIfArrowsNeeded() {
      const totalContentWidth = cards.length * scrollAmount;
      const containerWidth = container.clientWidth;
      
      // Hide both arrows if there's not enough content to scroll
      if (totalContentWidth <= containerWidth) {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
        return false;
      } else {
        leftArrow.style.display = 'flex';
        rightArrow.style.display = 'flex';
        return true;
      }
    }
    
    // Update when window resizes
    window.addEventListener('resize', () => {
      scrollAmount = adjustCardWidths();
      const arrowsNeeded = checkIfArrowsNeeded();
      if (arrowsNeeded) {
        updateArrowVisibility();
      }
    });
    
    // Function to update arrow visibility
    function updateArrowVisibility() {
      // Show/hide left arrow
      if (container.scrollLeft <= 10) {
        leftArrow.style.opacity = '0.5';
        leftArrow.style.pointerEvents = 'none';
      } else {
        leftArrow.style.opacity = '1';
        leftArrow.style.pointerEvents = 'auto';
      }
      
      // Show/hide right arrow
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        rightArrow.style.opacity = '0.5';
        rightArrow.style.pointerEvents = 'none';
      } else {
        rightArrow.style.opacity = '1';
        rightArrow.style.pointerEvents = 'auto';
      }
    }
    
    // Left arrow click event - scroll element by element
    leftArrow.addEventListener('click', () => {
      const currentScroll = container.scrollLeft;
      const targetScroll = Math.floor(currentScroll / scrollAmount) * scrollAmount - scrollAmount;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      
      // Update arrow visibility after scrolling
      setTimeout(updateArrowVisibility, 500);
    });
    
    // Right arrow click event - scroll element by element
    rightArrow.addEventListener('click', () => {
      const currentScroll = container.scrollLeft;
      const targetScroll = Math.ceil(currentScroll / scrollAmount) * scrollAmount + scrollAmount;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      
      // Update arrow visibility after scrolling
      setTimeout(updateArrowVisibility, 500);
    });
    
    // Detect when scrolling ends to adjust to correct position
    container.addEventListener('scroll', () => {
      clearTimeout(container.scrollEndTimer);
      container.scrollEndTimer = setTimeout(() => {
        updateArrowVisibility();
      }, 150);
    });
    
    // Initialize arrow visibility and check if arrows are needed
    const arrowsNeeded = checkIfArrowsNeeded();
    if (arrowsNeeded) {
      updateArrowVisibility();
    }
    
    // Disable free scrolling with mouse/touch to force using arrows
    container.style.overscrollBehaviorX = 'none';
    
    // Touch events for swipe on mobile (with snap to elements)
    let startX;
    let startScrollLeft;
    let touchStartTime;
    
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      startScrollLeft = container.scrollLeft;
      touchStartTime = new Date().getTime();
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
      const touchEndTime = new Date().getTime();
      const touchDuration = touchEndTime - touchStartTime;
      
      // Si el swipe fue rápido, mover un elemento completo
      if (touchDuration < 300) {
        const endX = e.changedTouches[0].pageX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) { // Umbral mínimo para considerar un swipe
          if (diffX > 0) {
            // Swipe a la izquierda - ir al siguiente elemento
            const targetScroll = Math.ceil(startScrollLeft / scrollAmount) * scrollAmount + scrollAmount;
            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
          } else {
            // Swipe a la derecha - ir al elemento anterior
            const targetScroll = Math.floor(startScrollLeft / scrollAmount) * scrollAmount - scrollAmount;
            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
          }
        } else {
          // Si no fue un swipe claro, volver a la posición de snap más cercana
          const targetScroll = Math.round(container.scrollLeft / scrollAmount) * scrollAmount;
          container.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
      } else {
        // Para toques largos, snap al elemento más cercano
        const targetScroll = Math.round(container.scrollLeft / scrollAmount) * scrollAmount;
        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
      
      // Actualizar visibilidad de flechas después del scroll
      setTimeout(updateArrowVisibility, 500);
    }, { passive: true });
  });
}

function initializeMenuToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const header = document.querySelector('header');
  const logo = document.querySelector('.logo img');
  let lastScrollTop = 0;
  
  // Create back to top button
  const backToTopBtn = document.createElement('div');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(backToTopBtn);
  
  if (menuToggle && menu) {
    // Add logo to mobile menu
    const menuLogo = document.createElement('div');
    menuLogo.className = 'menu-logo';
    menuLogo.innerHTML = `<img src="${logo.src}" alt="${logo.alt}">`;
    menu.insertBefore(menuLogo, menu.firstChild);
    
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.menu a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
  
  // Hide header on scroll down, show on scroll up
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.classList.add('header-hidden');
    } else {
      // Scrolling up
      header.classList.remove('header-hidden');
    }
    
    // Show/hide back to top button
    if (scrollTop > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    
    lastScrollTop = scrollTop;
  });
  
  // Back to top functionality
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
