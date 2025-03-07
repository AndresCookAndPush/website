document.addEventListener("DOMContentLoaded", () => {
  initializeCarousel()
  initializeTimeButtons()
  initializeSkyObjects()
})

function initializeCarousel() {
  const carousel = document.querySelector(".carousel-container")
  if (!carousel) return

  const items = document.querySelectorAll(".carousel-item")
  let currentRotation = 0
  const rotationStep = 0.2 // AJUSTAR: Controla la velocidad de rotación (menor = más lento, mayor = más rápido)
  const radius = 450
  let isRotating = true
  let animationId

  function updateItemsPositions() {
    items.forEach((item, index) => {
      const angle = (index * 36 + currentRotation) * (Math.PI / 180)
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      const opacity = Math.sin(angle) < 0 ? 1 : Math.sin(angle) < 0.2 ? 1 - Math.sin(angle) * 5 : 0

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

  rotateCarousel()
}

function initializeTimeButtons() {
  const buttons = document.querySelectorAll(".time-button")
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const time = button.dataset.time
      document.body.className = time
      updateSkyObjects(time)
    })
  })
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
  const cloudCount = 5 // AJUSTAR: Cantidad de nubes
  const minDuration = 30 // AJUSTAR: Duración mínima de la animación en segundos
  const maxDuration = 60 // AJUSTAR: Duración máxima de la animación en segundos

  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div")
    cloud.className = "cloud"
    cloud.style.top = `${350 + Math.random() * 50}px` // AJUSTAR: Cambia estos valores para ajustar la posición vertical de las nubes
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
