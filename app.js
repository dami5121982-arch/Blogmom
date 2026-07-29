document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-posts");

    if (typeof dataBlogger !== "undefined") {
        const feed = dataBlogger.feed || dataBlogger;
        const posts = feed.entry || feed.posts || feed;

        if (Array.isArray(posts)) {
            contenedor.innerHTML = "";

            posts.forEach(post => {
                // 1. Extraer TÍTULO
                let titulo = "Sin título";
                if (post.title) {
                    if (typeof post.title === "string") titulo = post.title;
                    else if (post.title.text) titulo = post.title.text;
                    else if (post.title.$t) titulo = post.title.$t;
                    else if (post.title._text) titulo = post.title._text;
                }

                // 2. BUSCADOR AGRESIVO DE CONTENIDO
                let contenido = "";

                // Intentamos las rutas estándar primero
                const opciones comunes = [post.content, post.summary, post.body, post.description];
                opcionescomunes.forEach(opcion => {
                    if (opcion && !contenido) {
                        if (typeof opcion === "string") contenido = opcion;
                        else if (opcion.text) contenido = opcion.text;
                        else if (opcion.$t) contenido = opcion.$t;
                        else if (opcion._text) contenido = opcion._text;
                    }
                });

                // Si sigue vacío, buscamos cualquier propiedad que sea un texto largo (el poema)
                if (!contenido) {
                    for (let clave in post) {
                        if (post[clave] && typeof post[clave] === "string" && post[clave].length > 100) {
                            contenido = post[clave];
                            break;
                        } else if (post[clave] && (post[clave].text || post[clave].$t || post[clave]._text)) {
                            let subTexto = post[clave].text || post[clave].$t || post[clave]._text;
                            if (typeof subTexto === "string" && subTexto.length > 100) {
                                contenido = subTexto;
                                break;
                            }
                        }
                    }
                }

                // 3. Si de verdad no encuentra nada, creamos un chivato de diagnóstico
                if (!contenido) {
                    const propiedadesDisponibles = Object.keys(post).join(" | ");
                    contenido = `<p style="color: red; font-size: 13px; background: #fff0f0; padding: 10px; border: 1px dashed red;">
                        ⚠️ Texto no encontrado. Propiedades de este post: [ ${propiedadesDisponibles} ]
                    </p>`;
                }

                // 4. Pintar la tarjeta
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
