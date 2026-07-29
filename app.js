document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-posts");

    if (typeof dataBlogger !== "undefined") {
        const feed = dataBlogger.feed || dataBlogger;
        const posts = feed.entry || feed.posts || feed;

        if (Array.isArray(posts)) {
            contenedor.innerHTML = ""; // Limpiamos el contenedor

            posts.forEach(post => {
                // 1. Extraer el TÍTULO
                let titulo = "Sin título";
                if (post.title) {
                    if (typeof post.title === "string") titulo = post.title;
                    else if (post.title.text) titulo = post.title.text;
                    else if (post.title.$t) titulo = post.title.$t;
                    else if (post.title._text) titulo = post.title._text;
                }

                // 2. Extraer el CONTENIDO de la historia
                let contenido = "";
                const cuerpo = post.content || post.summary || post.body;
                if (cuerpo) {
                    if (typeof cuerpo === "string") contenido = cuerpo;
                    else if (cuerpo.text) contenido = cuerpo.text;
                    else if (cuerpo.$t) contenido = cuerpo.$t;
                    else if (cuerpo._text) contenido = cuerpo._text;
                }

                // 3. Crear la tarjeta limpia en la página web
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
