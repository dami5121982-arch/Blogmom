document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-posts");

    if (typeof dataBlogger !== "undefined") {
        const feed = dataBlogger.feed || dataBlogger;
        const posts = feed.entry || feed.posts || feed;

        if (Array.isArray(posts)) {
            contenedor.innerHTML = ""; // Limpiar contenedor

            posts.forEach(post => {
                // 1. Extraer TÍTULO (Tu conversor lo deja como texto directo o dentro de .text)
                let titulo = "Sin título";
                if (post.title) {
                    if (typeof post.title === "string") titulo = post.title;
                    else if (post.title.text) titulo = post.title.text;
                    else if (post.title.$t) titulo = post.title.$t;
                }

                // 2. Extraer CONTENIDO (Tu conversor usa la propiedad exacta .text)
                let contenido = "";
                const cuerpo = post.content || post.summary || post.body;
                if (cuerpo) {
                    if (typeof cuerpo === "string") contenido = cuerpo;
                    else if (cuerpo.text) contenido = cuerpo.text; // <-- Clave de tu conversor
                    else if (cuerpo.$t) contenido = cuerpo.$t;
                }

                // 3. Crear la tarjeta e inyectarla
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
        contenedor.innerHTML = "<p>No se pudo encontrar la variable dataBlogger.</p>";
    }
});
