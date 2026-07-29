document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-posts");

    // Función interna para calcular la estación de una fecha concreta
    const obtenerEstacionDelPost = (fechaObj) => {
        if (isNaN(fechaObj)) return "verano"; // Por si falla, dejamos uno base

        const mes = fechaObj.getMonth() + 1; // Enero es 1, Diciembre es 12
        const dia = fechaObj.getDate();

        // Rangos astronómicos exactos
        if ((mes === 3 && dia >= 20) || mes === 4 || mes === 5 || (mes === 6 && dia <= 20)) {
            return "tarjeta-primavera";
        } else if ((mes === 6 && dia >= 21) || mes === 7 || mes === 8 || (mes === 9 && dia <= 21)) {
            return "tarjeta-verano";
        } else if ((mes === 9 && dia >= 22) || mes === 10 || mes === 11 || (mes === 12 && dia <= 20)) {
            return "tarjeta-otono";
        } else {
            return "tarjeta-invierno";
        }
    };

    if (typeof dataBlogger !== "undefined") {
        const feed = dataBlogger.feed || dataBlogger;
        const posts = feed.entry || feed.posts || feed.item || feed;

        if (Array.isArray(posts)) {
            contenedor.innerHTML = "";

            // Ordenamos de más nuevo a más viejo
            posts.sort((a, b) => {
                const fechaA = new Date(a.published?.__text || a.published || 0);
                const fechaB = new Date(b.published?.__text || b.published || 0);
                return fechaB - fechaA;
            });

            posts.forEach(post => {
                // 1. Extraer el TÍTULO
                let titulo = "Sin título";
                if (post.title) {
                    if (typeof post.title === "string") titulo = post.title;
                    else if (post.title.__text) titulo = post.title.__text;
                    else if (post.title.text) titulo = post.title.text;
                }

                // 2. Extraer la FECHA y calcular su ESTACIÓN INDIVIDUAL
                let fechaFormateada = "";
                let claseEstacionTarjeta = "tarjeta-verano"; // Por defecto

                if (post.published) {
                    const fechaRaw = typeof post.published === "string" ? post.published : post.published.__text;
                    if (fechaRaw) {
                        const fechaObj = new Date(fechaRaw);
                        if (!isNaN(fechaObj)) {
                            // Calculamos la estación exacta del día en que se escribió
                            claseEstacionTarjeta = obtenerEstacionDelPost(fechaObj);

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

                // 4. Crear la tarjeta aplicando su clase estacional propia
                const postElement = document.createElement("article");
                postElement.className = `post-tarjeta ${claseEstacionTarjeta}`;

                postElement.innerHTML = `
                    <h3 class="post-titulo">${titulo}</h3>
                    ${fechaFormateada ? `<p class="post-fecha">Publicado el ${fechaFormateada}</p>` : ''}
                    <div class="post-contenido">${contenido}</div>
                    <hr>
                `;

                contenedor.appendChild(postElement);
            });
        }
    }
});
