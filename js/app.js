/*
 * app.js — lógica de la lista de deseos.
 *
 * Organizado en tres capas:
 *   1. DATOS   cargarProductos() y marcarReservado(). Es lo único que hay que
 *              sustituir para conectar un backend (ver README).
 *   2. ESTADO  productos cargados y filtros activos.
 *   3. VISTA   todo lo que se pinta en pantalla y los eventos.
 *
 * Todo el contenido se crea con createElement/textContent (nunca innerHTML
 * con datos), así es seguro aunque algún día los productos vengan de fuera.
 */
(function () {
  "use strict";

  const CONFIG = window.CONFIG || {};
  const DIA_MS = 24 * 60 * 60 * 1000;
  const TODAS = "__todas__";
  const ETIQUETAS_PRIORIDAD = { 3: "Alta", 2: "Media", 1: "Baja" };

  const formatoPrecio = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    useGrouping: "always", // en es-ES, sin esto 1469 € no lleva punto de miles
  });
  const formatoFecha = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long" });

  /* ======================================================================
     1. DATOS
     ====================================================================== */

  /**
   * Devuelve la lista de productos normalizada.
   *
   * Ahora la lee de window.PRODUCTOS (js/productos.js). Para usar un backend,
   * cambia solo el interior de esta función: mientras devuelva una promesa
   * con un array de productos con la misma forma, el resto no cambia.
   *
   * @returns {Promise<Array<Object>>}
   */
  async function cargarProductos() {
    const lista = Array.isArray(window.PRODUCTOS) ? window.PRODUCTOS : [];
    return lista.map(normalizarProducto);
  }

  /**
   * Marca (o desmarca) un producto como reservado.
   *
   * PREPARADA PARA EL FUTURO: en esta versión la interfaz NO la llama. Sin
   * backend, el cambio solo existiría en el navegador de quien lo pulsa y el
   * resto seguiría viendo el producto libre. De momento el reservado se marca
   * a mano en js/productos.js.
   *
   * Con backend: haz aquí la llamada y devuelve el producto actualizado.
   * Ver la sección «Reservas desde la web» del README.
   *
   * @param {string} id
   * @param {boolean} [reservado=true]
   * @returns {Promise<Object>} el producto actualizado
   */
  // eslint-disable-next-line no-unused-vars
  async function marcarReservado(id, reservado = true) {
    throw new Error(
      "marcarReservado(" + id + ", " + reservado + "): todavía no hay backend conectado."
    );
  }

  /** Limpia y completa un producto para que la vista no tenga que comprobar nada. */
  function normalizarProducto(p) {
    const prioridad = Math.min(3, Math.max(1, Math.round(Number(p.prioridad)) || 1));
    const precio = Number(p.precio);
    return {
      id: String(p.id),
      nombre: String(p.nombre || "Sin nombre").trim(),
      categoria: String(p.categoria || "Otros").trim(),
      precio: Number.isFinite(precio) && precio > 0 ? precio : null,
      enlace: urlSegura(p.enlace),
      imagen: p.imagen ? String(p.imagen) : "",
      nota: p.nota ? String(p.nota).trim() : "",
      prioridad: prioridad,
      reservado: p.reservado === true,
    };
  }

  /** Solo deja pasar enlaces http(s). */
  function urlSegura(url) {
    if (!url) return "";
    try {
      const u = new URL(String(url), window.location.href);
      return u.protocol === "http:" || u.protocol === "https:" ? u.href : "";
    } catch (e) {
      return "";
    }
  }

  /* ======================================================================
     2. ESTADO
     ====================================================================== */

  const estado = {
    productos: [],
    categoria: TODAS,
    ocultarRegalados: false,
  };

  /** Productos filtrados y ordenados: libres primero, luego prioridad 3 → 1. */
  function productosVisibles() {
    return estado.productos
      .filter((p) => estado.categoria === TODAS || p.categoria === estado.categoria)
      .filter((p) => !(estado.ocultarRegalados && p.reservado))
      .sort(compararProductos);
  }

  function compararProductos(a, b) {
    return (
      Number(a.reservado) - Number(b.reservado) ||
      b.prioridad - a.prioridad ||
      a.nombre.localeCompare(b.nombre, "es")
    );
  }

  /** [[categoría, nº de productos], …] ordenadas alfabéticamente. */
  function contarCategorias() {
    const cuenta = new Map();
    estado.productos.forEach((p) => cuenta.set(p.categoria, (cuenta.get(p.categoria) || 0) + 1));
    return Array.from(cuenta).sort((a, b) => a[0].localeCompare(b[0], "es"));
  }

  /* ======================================================================
     3. VISTA
     ====================================================================== */

  const $ = (selector) => document.querySelector(selector);

  function el(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto != null) nodo.textContent = texto;
    return nodo;
  }

  /* ---------- Cabecera y cuenta atrás ---------- */

  function pintarCabecera() {
    const nombre = String(CONFIG.nombre || "").trim();
    const titulo =
      String(CONFIG.titulo || "").trim() || (nombre ? "El cumple de " + nombre : "Mi cumpleaños");
    $("#titulo").textContent = titulo;
    document.title = titulo;
    pintarCuentaAtras();
  }

  /** Lee "MM-DD" (o "AAAA-MM-DD") y devuelve { mes, dia } o null si no es válida. */
  function leerFechaCumple(texto) {
    const m = /^(?:\d{4}-)?(\d{1,2})-(\d{1,2})$/.exec(String(texto || "").trim());
    if (!m) return null;
    const mes = Number(m[1]);
    const dia = Number(m[2]);
    // 2000 es bisiesto, así que el 29 de febrero se acepta.
    const prueba = new Date(2000, mes - 1, dia);
    return prueba.getMonth() === mes - 1 && prueba.getDate() === dia ? { mes: mes, dia: dia } : null;
  }

  /** La fecha de hoy a las 00:00 en hora local. */
  function medianoche(fecha) {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  }

  /** El cumpleaños en un año concreto, a medianoche local. */
  function cumpleEnAnio(anio, fecha) {
    // Si naciste un 29 de febrero, en años no bisiestos cuenta el 28.
    const ultimoDiaDelMes = new Date(anio, fecha.mes, 0).getDate();
    return new Date(anio, fecha.mes - 1, Math.min(fecha.dia, ultimoDiaDelMes));
  }

  let temporizadorCuentaAtras = null;

  function pintarCuentaAtras() {
    const caja = $("#cuenta-atras");
    const fecha = leerFechaCumple(CONFIG.cumpleanos);
    if (!fecha) {
      caja.hidden = true;
      $("#fecha-cumple").textContent = "";
      return;
    }

    // Ambas fechas a medianoche local: así cuentan días de calendario, no
    // bloques de 24 h. Math.round absorbe los días de 23/25 h del cambio de hora.
    const hoy = medianoche(new Date());
    let objetivo = cumpleEnAnio(hoy.getFullYear(), fecha);
    if (objetivo < hoy) objetivo = cumpleEnAnio(hoy.getFullYear() + 1, fecha);
    const dias = Math.round((objetivo - hoy) / DIA_MS);

    let antes, numero, despues;
    if (dias === 0) {
      [antes, numero, despues] = ["", "¡Hoy!", "es el día"];
    } else if (dias === 1) {
      [antes, numero, despues] = ["Falta", "1", "día"];
    } else {
      [antes, numero, despues] = ["Faltan", String(dias), "días"];
    }
    $("#cuenta-atras-antes").textContent = antes;
    $("#cuenta-atras-numero").textContent = numero;
    $("#cuenta-atras-despues").textContent = despues;
    $("#fecha-cumple").textContent =
      (dias === 0 ? "Hoy, " : "Mi cumpleaños: ") + formatoFecha.format(objetivo);
    caja.hidden = false;

    // Volver a calcular justo después de la próxima medianoche.
    clearTimeout(temporizadorCuentaAtras);
    const ahora = new Date();
    const manana = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    temporizadorCuentaAtras = setTimeout(pintarCuentaAtras, manana - ahora + 1000);
  }

  /* ---------- Filtros ---------- */

  function pintarFiltros() {
    const contenedor = $("#filtros");
    const categorias = contarCategorias();
    contenedor.replaceChildren(
      crearChip(TODAS, "Todas", estado.productos.length),
      ...categorias.map(([categoria, n]) => crearChip(categoria, categoria, n))
    );
    // Con una sola categoría los filtros no aportan nada.
    contenedor.hidden = categorias.length < 2;
  }

  function crearChip(valor, texto, numero) {
    const chip = el("button", "chip");
    chip.type = "button";
    chip.dataset.categoria = valor;
    chip.setAttribute("aria-pressed", String(valor === estado.categoria));
    chip.append(texto, el("span", "chip__num", String(numero)));
    return chip;
  }

  function actualizarChips() {
    document.querySelectorAll("#filtros .chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", String(chip.dataset.categoria === estado.categoria));
    });
  }

  /* ---------- Productos ---------- */

  function pintarProductos() {
    const visibles = productosVisibles();
    $("#rejilla").replaceChildren(...visibles.map(crearTarjeta));

    const vacio = $("#vacio");
    vacio.hidden = visibles.length > 0;
    vacio.textContent = estado.productos.length
      ? "No hay nada que mostrar con estos filtros."
      : "Todavía no hay nada en la lista.";

    const libres = visibles.filter((p) => !p.reservado).length;
    $("#resumen").textContent =
      plural(visibles.length, "regalo", "regalos") + " · " +
      plural(libres, "disponible", "disponibles");
  }

  function plural(n, singular, varios) {
    return n + " " + (n === 1 ? singular : varios);
  }

  function crearTarjeta(p) {
    const tarjeta = el("li", "tarjeta" + (p.reservado ? " tarjeta--regalada" : ""));

    // Imagen o placeholder
    const media = el("div", "tarjeta__media");
    if (p.imagen) {
      const img = el("img");
      img.src = p.imagen;
      img.alt = ""; // decorativa: el nombre ya está en el título de la tarjeta
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", () => img.replaceWith(crearPlaceholder(p)), { once: true });
      media.append(img);
    } else {
      media.append(crearPlaceholder(p));
    }
    if (p.reservado) media.append(el("span", "sello", "Ya regalado"));

    // Texto
    const cuerpo = el("div", "tarjeta__cuerpo");
    const meta = el("div", "tarjeta__meta");
    meta.append(el("span", "tarjeta__categoria", p.categoria), crearPrioridad(p.prioridad));
    cuerpo.append(meta, el("h2", "tarjeta__nombre", p.nombre));
    if (p.nota) cuerpo.append(el("p", "tarjeta__nota", p.nota));

    // Precio y botones
    const pie = el("div", "tarjeta__pie");
    if (p.precio !== null) {
      const precio = el("p", "tarjeta__precio");
      precio.append(el("span", "tarjeta__aprox", "Aprox."), formatoPrecio.format(p.precio));
      pie.append(precio);
    }

    const acciones = el("div", "tarjeta__acciones");
    if (p.enlace) {
      const enlace = el("a", "boton boton--secundario");
      enlace.href = p.enlace;
      enlace.target = "_blank";
      enlace.rel = "noopener noreferrer";
      enlace.append("Ver en tienda", el("span", "sr-only", ": " + p.nombre + " (se abre en otra pestaña)"));
      acciones.append(enlace);
    }
    const regalar = el("button", "boton boton--primario");
    regalar.type = "button";
    regalar.dataset.id = p.id;
    regalar.disabled = p.reservado;
    regalar.append("Lo regalo yo", el("span", "sr-only", ": " + p.nombre));
    acciones.append(regalar);
    pie.append(acciones);

    cuerpo.append(pie);
    tarjeta.append(media, cuerpo);
    return tarjeta;
  }

  function crearPlaceholder(p) {
    const placeholder = el("div", "placeholder");
    placeholder.setAttribute("aria-hidden", "true");
    const inicial = (p.nombre.match(/[\p{L}\p{N}]/u) || ["?"])[0].toLocaleUpperCase("es");
    placeholder.append(
      el("span", "placeholder__inicial", inicial),
      el("span", "placeholder__categoria", p.categoria)
    );
    return placeholder;
  }

  function crearPrioridad(prioridad) {
    const contenedor = el("span", "prioridad");
    contenedor.title = "Prioridad " + prioridad + " de 3";

    const barras = el("span", "prioridad__barras");
    barras.setAttribute("aria-hidden", "true");
    for (let i = 1; i <= 3; i++) {
      barras.append(el("span", "prioridad__barra" + (i <= prioridad ? " prioridad__barra--on" : "")));
    }

    const texto = el("span", "prioridad__texto");
    texto.append(el("span", "sr-only", "Prioridad "), ETIQUETAS_PRIORIDAD[prioridad]);

    contenedor.append(barras, texto);
    return contenedor;
  }

  /* ---------- Diálogo «Lo regalo yo» ---------- */

  let botonQueAbrio = null;

  function abrirDialogo(producto, boton) {
    const nombre = String(CONFIG.nombre || "").trim();
    const telefono = String(CONFIG.whatsapp || "").replace(/\D/g, "");
    const email = String(CONFIG.email || "").trim();

    const mensaje =
      "¡Hola" + (nombre ? ", " + nombre : "") + "! Te escribo desde tu lista de deseos: " +
      "te voy a regalar «" + producto.nombre + "». " +
      "Márcalo como regalado para que nadie lo repita.";
    const asunto = "Lista de deseos: te regalo «" + producto.nombre + "»";

    $("#dialogo-producto").textContent = producto.nombre;

    const whatsapp = $("#dialogo-whatsapp");
    whatsapp.hidden = !telefono;
    whatsapp.href = telefono ? "https://wa.me/" + telefono + "?text=" + encodeURIComponent(mensaje) : "#";

    // encodeURIComponent (y no URLSearchParams) porque mailto necesita %20, no «+».
    const correo = $("#dialogo-email");
    correo.hidden = !email;
    correo.href = email
      ? "mailto:" + email + "?subject=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(mensaje)
      : "#";

    $("#dialogo-sin-contacto").hidden = Boolean(telefono || email);

    botonQueAbrio = boton;
    $("#dialogo").showModal();
  }

  function prepararDialogo() {
    const dialogo = $("#dialogo");

    // Clic en el fondo oscuro → cerrar.
    dialogo.addEventListener("click", (e) => {
      if (e.target === dialogo) dialogo.close();
    });

    // Tras elegir WhatsApp o email, cerrar (el enlace se abre igualmente).
    ["#dialogo-whatsapp", "#dialogo-email"].forEach((selector) => {
      $(selector).addEventListener("click", () => dialogo.close());
    });

    // Devolver el foco al botón que lo abrió.
    dialogo.addEventListener("close", () => {
      if (botonQueAbrio) botonQueAbrio.focus();
      botonQueAbrio = null;
    });
  }

  /* ---------- Eventos ---------- */

  function prepararEventos() {
    $("#filtros").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      estado.categoria = chip.dataset.categoria;
      actualizarChips();
      pintarProductos();
    });

    $("#ocultar-regalados").addEventListener("change", (e) => {
      estado.ocultarRegalados = e.target.checked;
      pintarProductos();
    });

    // «Lo regalo yo» solo abre el diálogo: NO llama a marcarReservado().
    $("#rejilla").addEventListener("click", (e) => {
      const boton = e.target.closest("button[data-id]");
      if (!boton || boton.disabled) return;
      const producto = estado.productos.find((p) => p.id === boton.dataset.id);
      if (producto) abrirDialogo(producto, boton);
    });

    // Si la pestaña estuvo dormida, el temporizador puede no haber saltado.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) pintarCuentaAtras();
    });
  }

  /* ---------- Arranque ---------- */

  async function iniciar() {
    pintarCabecera();
    prepararDialogo();
    prepararEventos();

    try {
      estado.productos = await cargarProductos();
    } catch (error) {
      console.error(error);
      $("#vacio").textContent = "No se ha podido cargar la lista. Prueba a recargar la página.";
      $("#vacio").hidden = false;
      return;
    }

    pintarFiltros();
    pintarProductos();
  }

  iniciar();
})();
