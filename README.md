# Sitio Web de TiBO para GitHub Pages

Este es un sitio web inspirado en la serie infantil TiBO, diseñado para ser alojado en GitHub Pages. El sitio utiliza HTML, CSS y JavaScript puro para crear una experiencia interactiva y atractiva.

## Características

- Diseño responsivo que funciona en dispositivos móviles y de escritorio
- Navegación de tipo scroll donde los enlaces del menú llevan a diferentes secciones de la página
- Carrusel interactivo en forma de reloj en la página de inicio
- Animaciones y efectos visuales para mejorar la experiencia del usuario
- Enlaces a redes sociales en el pie de página
- Secciones para episodios, manualidades, personajes y juegos
- Versión en inglés y español disponible

## Cómo usar

1. Clona este repositorio
2. Personaliza el contenido según tus necesidades
3. Sube los cambios a tu repositorio de GitHub
4. Activa GitHub Pages en la configuración del repositorio

## Estructura de archivos

- `index.html` - La página principal del sitio en español
- `english.html` - La versión en inglés del sitio
- `styles.css` - Estilos CSS para el diseño
- `script.js` - Funcionalidades JavaScript
- `images/` - Carpeta para almacenar todas las imágenes del sitio

## Imágenes necesarias

Para que el sitio funcione correctamente, necesitarás crear o conseguir las siguientes imágenes:

- `images/tibo-logo.png` - Logo de TiBO para la navegación
- `images/tibo-logo-small.png` - Logo más pequeño para el pie de página
- `images/tibo-main.png` - Imagen principal de TiBO para el centro del carrusel
- `images/story1.jpg` a `images/story10.jpg` - Imágenes para el carrusel
- `images/book-icon.png` y `images/abc-icon.png` - Iconos para el carrusel
- Imágenes para episodios, manualidades, personajes y juegos

## Personalización

Puedes personalizar fácilmente los colores del sitio modificando las variables CSS en el archivo `styles.css`:

```css
:root {
    --primary-color: #FF85C0;
    --secondary-color: #D14D9A;
    --accent-color: #FF6B6B;
    --background-color: #F5A9E1;
    --text-color: #7D4A6A;
    --light-color: #FFFFFF;
    --shadow-color: rgba(0, 0, 0, 0.1);
}

