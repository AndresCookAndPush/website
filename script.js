document.addEventListener("DOMContentLoaded", () => {
  initializeCarousel()
  initializeAutoTimeChange()
  initializeSkyObjects()
  initializeHorizontalScrolls()
  initializeMenuToggle() // Add this line to initialize the menu toggle functionality
  initializeSectionManagement()
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
  // Reducimos el número de nubes para que no se superpongan tanto
  const cloudCount = 5
  // Aumentamos la duración para un movimiento más suave y lento
  const minDuration = 60
  const maxDuration = 120
  // Distribuir las nubes verticalmente a lo largo de toda la página
  const screenHeight = Math.max(window.innerHeight, document.body.scrollHeight)
  const sectionHeight = screenHeight / cloudCount
  
  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div")
    cloud.className = "cloud"
    
    // Posicionamiento vertical distribuido en secciones para evitar superposición
    const sectionTop = i * sectionHeight
    const randomOffset = Math.random() * (sectionHeight * 0.8)
    cloud.style.top = `${sectionTop + randomOffset}px`
    
    // Tamaño aleatorio para las nubes (entre 70% y 100% del tamaño original)
    const scale = 0.7 + Math.random() * 0.3
    cloud.style.transform = `scale(${scale})`
    
    // Velocidad variable para más naturalidad
    cloud.style.animationDuration = `${minDuration + Math.random() * (maxDuration - minDuration)}s`
    
    // Distribuir el inicio horizontal de las nubes
    cloud.style.animationDelay = `${Math.random() * maxDuration}s`
    
    // Ajustar la opacidad de forma aleatoria para dar sensación de profundidad
    cloud.style.opacity = 0.4 + Math.random() * 0.6
    
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
    
    // Nueva lógica de centrado estilo Bluey
    // Si hay más de 3 elementos, solo mostramos 3 a la vez
    // Si hay menos de 3, los mostramos todos centrados
    function getMaxVisibleCards() {
      return window.innerWidth <= 768 ? 1 : 3;
    }
    
    let maxVisibleCards = getMaxVisibleCards();
    
    // Ocultar todos los cards primero
    cards.forEach((card, index) => {
      if (cards.length > maxVisibleCards) {
        // Si hay más de 3 cards, solo mostrar los primeros 3
        if (index < maxVisibleCards) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      } else {
        // Si hay 3 o menos, mostrar todos
        card.style.display = 'flex';
      }
    });
    
    // Centrar los contenedores
    container.style.justifyContent = 'center';
    
    // Si hay más de 3 elementos, creamos flechas de navegación
    if (cards.length > maxVisibleCards) {
      // Create arrows for navigation
      const leftArrow = document.createElement('div');
      leftArrow.className = 'scroll-arrow left';
      leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
      section.appendChild(leftArrow);
      
      const rightArrow = document.createElement('div');
      rightArrow.className = 'scroll-arrow right';
      rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
      section.appendChild(rightArrow);
      
      // Variables para controlar la posición actual
      let currentPosition = 0;
      
      // Función para actualizar los cards visibles
      function updateVisibleCards() {
        cards.forEach((card, index) => {
          if (index >= currentPosition && index < currentPosition + maxVisibleCards) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        
        // Actualizar estado de las flechas
        leftArrow.style.opacity = currentPosition === 0 ? '0.5' : '1';
        leftArrow.style.pointerEvents = currentPosition === 0 ? 'none' : 'auto';
        
        rightArrow.style.opacity = currentPosition + maxVisibleCards >= cards.length ? '0.5' : '1';
        rightArrow.style.pointerEvents = currentPosition + maxVisibleCards >= cards.length ? 'none' : 'auto';
      }
      
      // Left arrow click event - mostrar elementos previos
      leftArrow.addEventListener('click', () => {
        if (currentPosition > 0) {
          currentPosition--;
          updateVisibleCards();
        }
      });
      
      // Right arrow click event - mostrar elementos siguientes
      rightArrow.addEventListener('click', () => {
        if (currentPosition + maxVisibleCards < cards.length) {
          currentPosition++;
          updateVisibleCards();
        }
      });
      
      // Inicialización de estado de flechas
      updateVisibleCards();
    }
    
    // Adjust card widths based on screen size
    function adjustCardWidths() {
      const containerWidth = container.clientWidth;
      const isMobile = window.innerWidth <= 768;
      const gap = 30; // Gap between cards
      
      // On mobile, show only one card at a time
      if (isMobile) {
        const cardWidth = Math.min(containerWidth - (gap * 2), 300);
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
    
    // Aplicar ajustes iniciales
    adjustCardWidths();
    
    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
      adjustCardWidths();
      
      // Actualizar número de tarjetas visibles en función del ancho de pantalla
      const newMaxVisibleCards = getMaxVisibleCards();
      if (maxVisibleCards !== newMaxVisibleCards && cards.length > Math.min(maxVisibleCards, newMaxVisibleCards)) {
        // Actualizar el valor de maxVisibleCards
        maxVisibleCards = newMaxVisibleCards;
        
        // Solo llamar updateVisibleCards si existen las flechas de navegación
        if (typeof updateVisibleCards === 'function') {
          // Resetear a la primera página
          currentPosition = 0;
          updateVisibleCards();
        } else {
          // Si no hay navegación, actualizar manualmente la visualización
          cards.forEach((card, index) => {
            if (cards.length > maxVisibleCards) {
              if (index < maxVisibleCards) {
                card.style.display = 'flex';
              } else {
                card.style.display = 'none';
              }
            } else {
              card.style.display = 'flex';
            }
          });
        }
      }
    });
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

// Configuración global del sitio
const siteConfig = {
  adminPanelVisible: true, // Controla si el engranaje de administración es visible
  sections: {
    personajes: {
      enabled: false, // Cambiado a false para desactivar por defecto
      spanish: 'personajes',
      english: 'characters'
    },
    jugar: {
      enabled: true, 
      spanish: 'jugar',
      english: 'play'
    }
  }
};

// Función para aplicar la configuración de visibilidad de secciones
function applySectionVisibility() {
  // Ocultar/mostrar secciones en base a la configuración
  Object.keys(siteConfig.sections).forEach(sectionKey => {
    const config = siteConfig.sections[sectionKey];
    
    // Secciones en español
    const spanishSection = document.getElementById(config.spanish);
    if (spanishSection) {
      spanishSection.style.display = config.enabled ? 'block' : 'none';
    }
    
    // Enlaces del menú en español
    const spanishMenuItems = document.querySelectorAll(`.menu a[href="#${config.spanish}"]`);
    spanishMenuItems.forEach(item => {
      item.parentElement.style.display = config.enabled ? '' : 'none';
    });
    
    // Secciones en inglés (en english.html)
    // Esto solo afectará cuando se esté en la página en inglés
    const englishSection = document.getElementById(config.english);
    if (englishSection) {
      englishSection.style.display = config.enabled ? 'block' : 'none';
    }
    
    // Enlaces del menú en inglés
    const englishMenuItems = document.querySelectorAll(`.menu a[href="#${config.english}"]`);
    englishMenuItems.forEach(item => {
      item.parentElement.style.display = config.enabled ? '' : 'none';
    });
  });
  
  // Centrar el menú después de aplicar los cambios
  centerMenu();
}

// Función para centrar el menú cuando se ocultan elementos
function centerMenu() {
  const menuContainer = document.querySelector('.menu');
  if (menuContainer) {
    // Aseguramos que el menú tenga justificación centrada
    menuContainer.style.justifyContent = 'center';
  }
}

// Función para guardar la configuración en localStorage
function saveConfig() {
  localStorage.setItem('siteConfig', JSON.stringify(siteConfig));
}

// Función para cargar la configuración desde localStorage
function loadConfig() {
  const savedConfig = localStorage.getItem('siteConfig');
  if (savedConfig) {
    const parsedConfig = JSON.parse(savedConfig);
    
    // Actualizar adminPanelVisible si existe en la configuración guardada
    if (parsedConfig.adminPanelVisible !== undefined) {
      siteConfig.adminPanelVisible = parsedConfig.adminPanelVisible;
    }
    
    // Actualizar configuración de secciones
    if (parsedConfig.sections) {
      Object.keys(parsedConfig.sections).forEach(key => {
        if (siteConfig.sections[key] && parsedConfig.sections[key]) {
          siteConfig.sections[key].enabled = parsedConfig.sections[key].enabled;
        }
      });
    }
  }
}

// Inicializar la gestión de secciones
function initializeSectionManagement() {
  // Cargar configuración guardada
  loadConfig();
  
  // Aplicar la configuración cargada
  applySectionVisibility();
  
  // Solo crear el panel de administración si está configurado como visible
  if (siteConfig.adminPanelVisible) {
    // Crear panel de administración
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.innerHTML = `
      <div class="admin-toggle" title="Configuración de secciones">⚙️</div>
      <div class="admin-controls">
        <h3>Configuración de secciones</h3>
        <div class="section-toggle">
          <label>
            <input type="checkbox" id="toggle-personajes" ${siteConfig.sections.personajes.enabled ? 'checked' : ''}>
            Mostrar sección PERSONAJES
          </label>
        </div>
        <div class="section-toggle">
          <label>
            <input type="checkbox" id="toggle-jugar" ${siteConfig.sections.jugar.enabled ? 'checked' : ''}>
            Mostrar sección JUGAR
          </label>
        </div>
        <button id="save-section-config">Guardar</button>
      </div>
    `;
    
    document.body.appendChild(adminPanel);
    
    // Evento para mostrar/ocultar el panel de administración
    const adminToggle = adminPanel.querySelector('.admin-toggle');
    const adminControls = adminPanel.querySelector('.admin-controls');
    
    adminToggle.addEventListener('click', () => {
      adminControls.classList.toggle('visible');
    });
    
    // Eventos para los toggles
    const togglePersonajes = document.getElementById('toggle-personajes');
    const toggleJugar = document.getElementById('toggle-jugar');
    
    togglePersonajes.addEventListener('change', () => {
      siteConfig.sections.personajes.enabled = togglePersonajes.checked;
    });
    
    toggleJugar.addEventListener('change', () => {
      siteConfig.sections.jugar.enabled = toggleJugar.checked;
    });
    
    // Evento para guardar configuración
    const saveButton = document.getElementById('save-section-config');
    saveButton.addEventListener('click', () => {
      saveConfig();
      applySectionVisibility();
      adminControls.classList.remove('visible');
      alert('Configuración guardada');
    });
  }
}

// Para desactivar PERSONAJES
siteConfig.sections.personajes.enabled = false;
applySectionVisibility();

// Para desactivar JUGAR
siteConfig.sections.jugar.enabled = false;
applySectionVisibility();

siteConfig.adminPanelVisible = false;
saveConfig(); // Guardar en localStorage
// Requiere recargar la página para que el cambio surta efecto
