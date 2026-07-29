document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-posts");

    if (typeof dataBlogger !== "undefined" && dataBlogger.feed && dataBlogger.feed.entry) {
        const posts = dataBlogger.feed.entry;

        posts.forEach(post => {
            // 1. Buscamos el título intentando varias rutas posibles del conversor
            let titulo = "Sin título";
            if (post.title) {
                if (typeof post.title === "string") titulo = post.title;
                else if (post.title.$t) titulo = post.title.$t;
                else if (post.title._text) titulo = post.title._text;
            }

            // 2. Buscamos el contenido intentando varias rutas posibles del conversor
            let contenido = "";
            if (post.content) {
                if (typeof post.content === "string") contenido = post.content;
                else if (post.content.$t) contenido = post.content.$t;
                else if (post.content._text) contenido = post.content._text;
            }
            // Si viene guardado como 'summary' en vez de 'content'
            else if (post.summary) {
                if (typeof post.summary === "string") contenido = post.summary;
                else if (post.summary.$t) contenido = post.summary.$t;
                else if (post.summary._text) contenido = post.summary._text;
            }

            // 3. Crear la tarjeta si el post contiene algo de información
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
        contenedor.innerHTML = "<p>No se pudieron cargar las entradas del blog o el archivo de datos está vacío.</p>";
    }
});
