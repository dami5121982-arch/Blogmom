document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-posts");

    // Comprobamos si los datos del blog existen
    if (typeof dataBlogger !== "undefined" && dataBlogger.feed && dataBlogger.feed.entry) {
        const posts = dataBlogger.feed.entry;

        posts.forEach(post => {
            // 1. Extraer el título del post
            const titulo = post.title && post.title.$t ? post.title.$t : "Sin título";

            // 2. Extraer el contenido del post (texto/html)
            let contenido = post.content && post.content.$t ? post.content.$t : "";

            // Opcional: Si el post es un borrador (DRAFT), podemos decidir saltárnoslo
            if (post['blogger:status'] && post['blogger:status'].$t === "DRAFT") {
                // Si quieres ocultar borradores, descomenta la siguiente línea:
                // return;
            }

            // 3. Crear la estructura HTML para la tarjeta del post
            const postElement = document.createElement("article");
            postElement.className = "post-tarjeta";

            postElement.innerHTML = `
                <h3 class="post-titulo">${titulo}</h3>
                <div class="post-contenido">${contenido}</div>
                <hr>
            `;

            // 4. Inyectarlo en la página web
            contenedor.appendChild(postElement);
        });
    } else {
        contenedor.innerHTML = "<p>No se pudieron cargar las entradas del blog o el archivo de datos está vacío.</p>";
    }
});

