document.addEventListener("DOMContentLoaded", () => {
  initializeCarousel()
  initializeAutoTimeChange()
  initializeSkyObjects()
  initializeHorizontalScrolls()
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

  scrollContainers.forEach(container => {
    if (!container) return;
    
    // Mover las flechas fuera del contenedor de scroll
    const section = container.closest('.content-section');
    if (!section) return;
    
    // Eliminar flechas existentes para evitar duplicados
    const existingLeftArrows = section.querySelectorAll('.scroll-arrow.left');
    const existingRightArrows = section.querySelectorAll('.scroll-arrow.right');
    
    existingLeftArrows.forEach(arrow => arrow.remove());
    existingRightArrows.forEach(arrow => arrow.remove());
    
    // Crear nuevas flechas y añadirlas a la sección
    const leftArrow = document.createElement('div');
    leftArrow.className = 'scroll-arrow left';
    leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    section.appendChild(leftArrow);
    
    const rightArrow = document.createElement('div');
    rightArrow.className = 'scroll-arrow right';
    rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    section.appendChild(rightArrow);
    
    const cards = container.querySelectorAll('.story-card, .minigame-card, .character-card, .game-card');
    
    if (!cards.length) return;
    
    // Ajustar el ancho de las tarjetas según el tamaño de la pantalla
    function adjustCardWidths() {
      const containerWidth = container.clientWidth;
      const isMobile = window.innerWidth <= 768;
      const gap = 30; // Gap entre tarjetas
      
      // En móviles y tablets, mostrar solo una tarjeta a la vez
      if (isMobile) {
        const cardWidth = containerWidth - (gap * 2);
        cards.forEach(card => {
          card.style.flex = `0 0 ${cardWidth}px`;
          card.style.minWidth = `${cardWidth}px`;
          card.style.maxWidth = `${cardWidth}px`;
        });
        return cardWidth + gap;
      } else {
        // En desktop, mantener el tamaño fijo
        cards.forEach(card => {
          card.style.flex = '0 0 300px';
          card.style.minWidth = '300px';
          card.style.maxWidth = '300px';
        });
        return 330; // 300px + 30px gap
      }
    }
    
    let scrollAmount = adjustCardWidths();
    
    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
      scrollAmount = adjustCardWidths();
      updateArrowVisibility();
    });
    
    // Función para actualizar la visibilidad de las flechas
    function updateArrowVisibility() {
      // Mostrar/ocultar flecha izquierda
      if (container.scrollLeft <= 10) {
        leftArrow.style.opacity = '0.5';
        leftArrow.style.pointerEvents = 'none';
      } else {
        leftArrow.style.opacity = '1';
        leftArrow.style.pointerEvents = 'auto';
      }
      
      // Mostrar/ocultar flecha derecha
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        rightArrow.style.opacity = '0.5';
        rightArrow.style.pointerEvents = 'none';
      } else {
        rightArrow.style.opacity = '1';
        rightArrow.style.pointerEvents = 'auto';
      }
    }
    
    // Evento para el botón izquierdo - scroll elemento por elemento
    leftArrow.addEventListener('click', () => {
      const currentScroll = container.scrollLeft;
      const targetScroll = Math.floor(currentScroll / scrollAmount) * scrollAmount - scrollAmount;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      
      // Actualizar visibilidad de flechas después del scroll
      setTimeout(updateArrowVisibility, 500);
    });
    
    // Evento para el botón derecho - scroll elemento por elemento
    rightArrow.addEventListener('click', () => {
      const currentScroll = container.scrollLeft;
      const targetScroll = Math.ceil(currentScroll / scrollAmount) * scrollAmount + scrollAmount;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      
      // Actualizar visibilidad de flechas después del scroll
      setTimeout(updateArrowVisibility, 500);
    });
    
    // Detectar cuando termina el scroll para ajustar a la posición correcta
    container.addEventListener('scroll', () => {
      clearTimeout(container.scrollEndTimer);
      container.scrollEndTimer = setTimeout(() => {
        updateArrowVisibility();
      }, 150);
    });
    
    // Inicializar visibilidad de flechas
    updateArrowVisibility();
    
    // Desactivar el scroll libre con el mouse/touch para forzar el uso de las flechas
    container.style.overscrollBehaviorX = 'none';
    
    // Eventos táctiles para swipe en móviles (con snap a elementos)
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

// Funcionalidad del menú hamburguesa
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Cerrar el menú al hacer clic en un enlace
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
    });
});

// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove('active');
    }
});
