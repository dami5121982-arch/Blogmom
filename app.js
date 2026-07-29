document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-posts");

    if (typeof dataBlogger !== "undefined") {
        const feed = dataBlogger.feed || dataBlogger;
        const posts = feed.entry || feed.posts || feed.item || feed;

        if (Array.isArray(posts)) {
            contenedor.innerHTML = "";

            posts.forEach(post => {
                // 1. Extraer el TÍTULO
                let titulo = "Sin título";
                if (post.title) {
                    if (typeof post.title === "string") titulo = post.title;
                    else if (post.title.__text) titulo = post.title.__text;
                    else if (post.title.text) titulo = post.title.text;
                }

                // 2. Extraer y formatear la FECHA (Nueva función)
                let fechaFormateada = "";
                if (post.published) {
                    const fechaRaw = typeof post.published === "string" ? post.published : post.published.__text;
                    if (fechaRaw) {
                        const fechaObj = new Date(fechaRaw);
                        // Comprobamos que la fecha sea válida antes de formatear
                        if (!isNaN(fechaObj)) {
                            fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            });
                        }
                    }
                }

                // 3. Extraer el CONTENIDO
                let contenido = "";
                const cuerpo = post.content || post.summary || post.body;
                if (cuerpo) {
                    if (typeof cuerpo === "string") contenido = cuerpo;
                    else if (cuerpo.__text) contenido = cuerpo.__text;
                    else if (cuerpo.text) contenido = cuerpo.text;
                }

                // 4. Pintar la tarjeta con la fecha incluida
                const postElement = document.createElement("article");
                postElement.className = "post-tarjeta";

                postElement.innerHTML = `
                    <h3 class="post-titulo">${titulo}</h3>
                    ${fechaFormateada ? `<p class="post-fecha" style="color: #888; font-size: 0.9rem; margin-top: -10px; margin-bottom: 20px; font-style: italic;">Publicado el ${fechaFormateada}</p>` : ''}
                    <div class="post-contenido">${contenido}</div>
                    <hr>
                `;

                contenedor.appendChild(postElement);
            });
        }
    }
});
