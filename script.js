document.addEventListener("DOMContentLoaded", () => {
    // === 1. CAPTURA DE ELEMENTOS MAESTROS ===
    const seccionBlog = document.getElementById("seccion-blog");
    const contenidosDinamicos = document.querySelectorAll(".contenido-dinamico");
    const enlacesMenu = document.querySelectorAll(".navegacion-vertical a");
    const pantallaCarga = document.getElementById("pantalla-carga");
    const nuevoCanvas = document.getElementById("lienzo-horizontal");
    const ctxH = nuevoCanvas ? nuevoCanvas.getContext("2d") : null;

    let bucleHorizontal;

    // === 2. SISTEMA DE CONTROL DE SECCIONES (PANTALLAS) ===
    function irASeccion(idDestino) {
        // Detener la animación del lienzo si se cambia de sección
        clearInterval(bucleHorizontal);
        if (pantallaCarga) pantallaCarga.style.display = "none";

        // ¡AQUÍ ESTÁ LA SOLUCIÓN!: Si van a otra sección, obligamos al panel derecho a cerrarse de inmediato
        if (idDestino !== "#inicio" && idDestino !== "#biografia") {
            document.body.classList.remove("mostrar-panel-derecho");
        }

        // Capturamos el contenedor macro de 3 columnas de la web
        const pantallaDividida = document.querySelector(".pantalla-dividida");
        const botonVolver = document.getElementById("boton-volver");

        // 1. Ocultar el blog y el botón volver por defecto
        if (seccionBlog) seccionBlog.classList.add("oculto");
        if (botonVolver) {
            botonVolver.classList.add("oculto");
            botonVolver.style.display = "none";
        }
        contenidosDinamicos.forEach(div => div.classList.add("oculto"));

        // Por defecto, quitamos la clase de pantalla completa del body
        document.body.classList.remove("seccion-poemas-activa");

        // 2. Evaluamos la navegación hacia la sección seleccionada
        if (idDestino === "#poemas") {
            // Disparador místico hacia los poemas con la pantalla de carga animada
            if (pantallaCarga && nuevoCanvas && ctxH) {
                pantallaCarga.classList.remove("oculto");
                pantallaCarga.style.display = "block";
                ejecutarAnimacionHorizontal();

                // Tiempo fijo de contemplación de la carga (4 segundos)
                setTimeout(() => {
                    clearInterval(bucleHorizontal);
                    pantallaCarga.style.display = "none";

                    // Ocultamos la pantalla dividida completa
                    if (pantallaDividida) pantallaDividida.classList.add("oculto");

                    // ¡AQUÍ ESTÁ LA SOLUCIÓN!: Activamos el fondo limpio en el body
                    document.body.classList.add("seccion-poemas-activa");

                    // Mostramos el blog de poemas y el botón volver
                    if (seccionBlog) seccionBlog.classList.remove("oculto");
                    if (botonVolver) {
                        botonVolver.classList.remove("oculto");
                        botonVolver.style.display = "inline-block";
                    }
                }, 4000);
            } else {
                // Si falla el canvas por algún motivo, aplica el cambio directo de inmediato
                if (pantallaDividida) pantallaDividida.classList.add("oculto");
                document.body.classList.add("seccion-poemas-activa");
                if (seccionBlog) seccionBlog.classList.remove("oculto");
                if (botonVolver) {
                    botonVolver.classList.remove("oculto");
                    botonVolver.style.display = "inline-block";
                }
            }
        } else {
            // Si vamos a Inicio o Biografía, volvemos a mostrar la pantalla dividida original
            if (pantallaDividida) pantallaDividida.classList.remove("oculto");

            // REFUERZO: Nos aseguramos de que la tercera columna esté libre de la clase oculto
            const columnaDerecha = document.getElementById("columna-derecha");
            if (columnaDerecha) columnaDerecha.classList.remove("oculto");

            const cleanId = idDestino.replace("#", "");
            const divActivo = document.getElementById(`contenido-${cleanId}`);
            if (divActivo) divActivo.classList.remove("oculto");
        }
    }

    // === 3. EVENTOS DEL MENÚ LATERAL ===
    enlacesMenu.forEach(enlace => {
        enlace.addEventListener("click", (e) => {
            e.preventDefault(); // Evita el salto brusco del scroll en la página
            const destino = enlace.getAttribute("href");
            irASeccion(destino);
        });
    });
    // === EVENTO DEL BOTÓN VOLVER (SOLO POEMAS) ===
    const botonVolverInicio = document.getElementById("boton-volver");
    if (botonVolverInicio) {
        botonVolverInicio.addEventListener("click", (e) => {
            e.preventDefault();
            irASeccion("#inicio"); // Fuerza la reconstrucción de la pantalla de bienvenida limpia
        });
    }
    // === 4. LÓGICA DE FILTRADO CRUZADO (AÑO Y MES) ===
    const filtroAno = document.getElementById("filtro-ano");
    const filtroMes = document.getElementById("filtro-mes");
    const poemas = document.querySelectorAll("#lista-poemas article");

    function filtrarPoemas() {
        const anoSeleccionado = filtroAno.value;
        const mesSeleccionado = filtroMes.value;

        poemas.forEach(poema => {
            const textoFecha = poema.querySelector(".post-fecha").textContent.toLowerCase();
            const coincideAno = anoSeleccionado === "todos" || textoFecha.includes(anoSeleccionado);
            const coincideMes = mesSeleccionado === "todos" || textoFecha.includes(mesSeleccionado);

            if (coincideAno && coincideMes) {
                poema.classList.remove("oculto");
            } else {
                poema.classList.add("oculto");
            }
        });
    }

    if (filtroAno && filtroMes) {
        filtroAno.addEventListener("change", filtrarPoemas);
        filtroMes.addEventListener("change", filtrarPoemas);
    }

    // === 5. MOTOR DE ANIMACIÓN HORIZONTAL (CANVAS DE CARGA) ===
    const caracteresMisticos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzБГДЖИЛПФЦЧШЩЪЫЬЭЮЯбгджилпфцчшщыьэюяあいうえおかきくけこさしすせそアイウエオカキクケコサシスセソ天地明暗幽玄";

    function ejecutarAnimacionHorizontal() {
        if (!nuevoCanvas || !ctxH) return;

        nuevoCanvas.width = window.innerWidth;
        nuevoCanvas.height = window.innerHeight;

        const tamañoLetra = 24;
        const filasTotales = Math.floor(nuevoCanvas.height / tamañoLetra);
        const renglonesMecanograficos = [];

        for (let i = 0; i < filasTotales; i++) {
            renglonesMecanograficos.push({
                textoActual: "",
                y: i * tamañoLetra,
                ritmoEscritura: Math.random() * 2 + 1,
                contadorFotogramas: 0
            });
        }

        bucleHorizontal = setInterval(() => {
            ctxH.fillStyle = "#0b0b0b";
            ctxH.fillRect(0, 0, nuevoCanvas.width, nuevoCanvas.height);
            ctxH.fillStyle = "rgba(184, 115, 51, 0.95)";
            ctxH.font = "600 " + tamañoLetra + "px monospace";
            ctxH.textBaseline = "top";

            renglonesMecanograficos.forEach(renglon => {
                renglon.contadorFotogramas++;
                if (renglon.contadorFotogramas >= renglon.ritmoEscritura) {
                    const anchoActualEnPixeles = ctxH.measureText(renglon.textoActual).width;
                    if (anchoActualEnPixeles < nuevoCanvas.width) {
                        const letraNueva = caracteresMisticos[Math.floor(Math.random() * caracteresMisticos.length)];
                        renglon.textoActual += letraNueva;
                    } else {
                        if (Math.random() * 100 > 98) {
                            renglon.textoActual = renglon.textoActual.substring(1);
                        }
                    }
                    renglon.contadorFotogramas = 0;
                }
                ctxH.fillText(renglon.textoActual, 0, renglon.y);
            });
        }, 22);
    }

    // Redimensionar el lienzo si cambia el tamaño de la ventana
    window.addEventListener("resize", () => {
        if (pantallaCarga && pantallaCarga.style.display === "block" && nuevoCanvas) {
            nuevoCanvas.width = window.innerWidth;
            nuevoCanvas.height = window.innerHeight;
        }

    });
    // === CONTROL HÍBRIDO DEL PANEL DERECHO (HOVER Y CLIC) ===
    let fixClickActivo = false;

    enlacesMenu.forEach(enlace => {
        const destino = enlace.getAttribute("href");

        // Esta lógica interactiva solo se activa para las secciones de la columna derecha
        if (destino === "#inicio" || destino === "#biografia") {

            // [PASO 1] PASAR EL RATÓN (Hover): Muestra el panel expandiendo el grid y el texto
            enlace.addEventListener("mouseenter", () => {
                if (!fixClickActivo) {
                    irASeccion(destino); // Cambia el texto correspondiente en segundo plano
                    document.body.classList.add("mostrar-panel-derecho");
                }
            });

            // Al retirar el ratón del botón, el panel se vuelve a encoger a 0%
            enlace.addEventListener("mouseleave", () => {
                if (!fixClickActivo) {
                    document.body.classList.remove("mostrar-panel-derecho");
                }
            });

            // [PASO 2] HACER CLIC: Deja fijada la columna derecha de forma permanente
            enlace.addEventListener("click", (e) => {
                e.preventDefault();
                irASeccion(destino);
                fixClickActivo = true; // Congela el estado para que el ratón no lo cierre
                document.body.classList.add("mostrar-panel-derecho");
            });
        }
    });

    // [PASO 3] CLIC FUERA: Si hace clic en la foto central o fondo, el panel se esconde
    document.addEventListener("click", (e) => {
        const panelMenu = document.querySelector(".menu-lateral");
        const columnaInfo = document.getElementById("columna-derecha");

        if (panelMenu && columnaInfo) {
            // Comprobamos si el clic ocurrió dentro de la botonera o de la zona de información
            const clickDentroDeMenu = panelMenu.contains(e.target);
            const clickDentroDeColumna = columnaInfo.contains(e.target);

            // Si se pulsó en cualquier otro lugar vacío, cerramos la columna
            if (!clickDentroDeMenu && !clickDentroDeColumna) {
                fixClickActivo = false;
                document.body.classList.remove("mostrar-panel-derecho");
            }
        }
    });


    // === 6. ARRANQUE POR DEFECTO ===
    // Asegura que la web inicie mostrando únicamente el bloque de bienvenida
    irASeccion("#inicio");
});

// === 7. FUNCIONES GLOBALES (FUERA DEL DOM CONTENT LOADED) ===
function cambiarIdioma(idioma) {
    console.log("Idioma cambiado a:", idioma);
}
