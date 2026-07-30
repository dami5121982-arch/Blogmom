// Esperar a que el HTML de la página esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // 1. Seleccionar el contenedor del HTML donde se meterán los posts
    const contenedor = document.getElementById("contenedor-posts");

    // Verificar si los datos del blog existen
    if (typeof dataBlogger === 'undefined' || !dataBlogger.feed || !dataBlogger.feed.entry) {
        console.error("No se encontraron los datos en blog-data.js");
        return;
    }

    // 2. Filtrar solo los elementos que sean posts reales (evitar comentarios u otros datos)
    const posts Reales = dataBlogger.feed.entry.filter(entry => {
        return entry.type && entry.type.__text === "POST";
    });

    // 3. Recorrer cada post para extraer e inyectar su información
    postsReales.forEach(post => {
        // Extraer Título (si no tiene, poner genérico)
        const titulo = post.title || "Sin título";

        // Extraer Fecha de edición (cortar los primeros 10 caracteres: AAAA-MM-DD)
        const fechaOriginal = post.published || post.created.__text || "";
        const fechaFormateada = fechaOriginal ? fechaOriginal.substring(0, 10) : "Sin fecha";

        // Obtener el HTML sucio del contenido
        const contenidoHtml = post.content ? post.content.__text : "";

        // 4. Crear una tarjeta o estructura HTML para este post
        const postElement = document.createElement("article");
        postElement.className = "tarjeta-post"; // Clase por si quieres darle estilos CSS

        // Introducir la estructura limpia en el dbody del elemento
        postElement.innerHTML = `
            <div class="cabecera-post">
                <h2 class="titulo-post">${titulo}</h2>
                <span class="fecha-post">Publicado el: ${fechaFormateada}</span>
            </div>
            <div class="cuerpo-post">
                ${contenidoHtml}
            </div>
            <hr class="separador-post">
        `;

        // 5. Meter el post dentro del contenedor principal del index.html
        contenedor.appendChild(postElement);
    });
});
