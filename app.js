document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-posts");

    if (typeof dataBlogger !== "undefined") {
        // Buscamos la lista de entradas en cualquier formato
        const feed = dataBlogger.feed || dataBlogger;
        const posts = feed.entry || feed.posts || feed.item || feed;

        if (Array.isArray(posts)) {
            contenedor.innerHTML = ""; // Limpiar pantalla

            posts.forEach(post => {
                // 1. Extraer el TÍTULO usando la ruta exacta de tu pantalla (.__text)
                let titulo = "Sin título";
                if (post.title) {
                    if (typeof post.title === "string") titulo = post.title;
                    else if (post.title.__text) titulo = post.title.__text;
                    else if (post.title.text) titulo = post.title.text;
                    else if (post.title.$t) titulo = post.title.$t;
                }

                // 2. Extraer el CONTENIDO usando la ruta exacta de tu pantalla (.__text)
                let contenido = "";
                const cuerpo = post.content || post.summary || post.body;
                if (cuerpo) {
                    if (typeof cuerpo === "string") contenido = cuerpo;
                    else if (cuerpo.__text) contenido = cuerpo.__text; // <-- ¡La clave de tu captura!
                    else if (cuerpo.text) contenido = cuerpo.text;
                    else if (cuerpo.$t) contenido = cuerpo.$t;
                }

                // 3. Pintar la tarjeta en la página web
                const postElement = document.createElement("article");
                postElement.className = "post-tarjeta";

                postElement.innerHTML = `
                    <h3 class="post-titulo">${titulo}</h3>
                    <div class="post-contenido">${contenido}</div>
                    <hr>
                `;

                contenedor.appendChild(postElement);
            });
        } else {
            contenedor.innerHTML = "<p>El archivo de datos no contiene una lista de entradas válida.</p>";
        }
    } else {
        contenedor.innerHTML = "<p>No se pudo encontrar la variable dataBlogger. Comprueba si el archivo blog-data.js tiene un error de sintaxis.</p>";
    }
});
