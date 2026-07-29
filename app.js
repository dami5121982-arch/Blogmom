document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-posts");

    if (typeof dataBlogger !== "undefined") {
        // Buscamos dónde están los posts automáticamente si cambiaste la estructura
        const feed = dataBlogger.feed || dataBlogger;
        const posts = feed.entry || feed.posts || feed;

        if (Array.isArray(posts)) {
            contenedor.innerHTML = ""; // Limpiamos el contenedor

            posts.forEach((post, index) => {
                // Dejamos un rastro en la consola para espiar la estructura real del primer post
                if (index === 0) console.log("Estructura del primer post encontrado:", post);

                // 1. Extracción ultra-segura del TÍTULO
                let titulo = "Sin título";
                if (post.title) {
                    if (typeof post.title === "string") titulo = post.title;
                    else if (post.title._text) titulo = post.title._text;
                    else if (post.title.$t) titulo = post.title.$t;
                }

                // 2. Extracción ultra-segura del CONTENIDO
                let contenido = "";
                const cuerpo = post.content || post.summary || post.body;
                if (cuerpo) {
                    if (typeof cuerpo === "string") contenido = cuerpo;
                    else if (cuerpo._text) contenido = cuerpo._text;
                    else if (cuerpo.$t) contenido = cuerpo.$t;
                }

                // 3. Crear y pintar la tarjeta en la página web
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
            contenedor.innerHTML = "<p>El archivo de datos no contiene una lista válida de entradas.</p>";
        }
    } else {
        contenedor.innerHTML = "<p>No se pudo encontrar la variable global dataBlogger.</p>";
    }
});
