/* Tarifas y cálculo de precio de Casa Kauri y Departamento Kauri (11 oct 2026; casa actualizada el 24 oct 2026).
   Fuente: política de precio de Dalí. Casa (24 oct 2026): ancla $4,000; $3,800 entre semana y $4,000 viernes y sábado;
   cierre con cupón DIRECTO a $3,500; piso $3,000, solo a criterio de Dalí. Depa: piso $1,500.
   Casa: el precio es para 8 personas; desde la 9.ª, $400 por persona por noche. Depa: no admite mascotas.
   Siempre: mínimo 2 noches, limpieza $600 por estancia (una sola vez), anticipo 50 %, cancelación sin costo hasta 31
   días antes, y todo precio menor al ancla se rotula como especial o preferencial. Para cambiar un precio se edita SOLO este archivo.
   "finde" = noches de viernes y sábado. Una temporada pisa al precio base en las noches [desde, hasta). */
window.KAURI_TARIFAS = {
  casa: {
    nombre: "Casa Kauri", prefijo: "RES-CK", max: 10, incluidos: 8, extraPersona: 400, minNoches: 2,   // precio para 8; desde la 9.ª persona $400 por persona por noche (Dalí, 11 oct 2026)
    entrada: "3:00 p.m.", salida: "11:00 a.m.",
    ancla: 4000,                                   // precio base que se muestra tachado (11 oct 2026)
    /* 24 oct 2026 (Dalí): la página ya no baja sola. Muestra $3,800 entre semana y $4,000 viernes y sábado, lo mismo que
       anuncia la pauta, y el descuento lo da él en el chat con el cupón DIRECTO ($3,500). Se quitaron la baja por mes
       flojo ($3,200) y la vista de reserva anticipada a $4,000: las dos dejaban la página abajo o arriba del anuncio. */
    base: { semana: 3800, finde: 4000 },
    limpieza: 600, mascota: 300, anticipo: 0.5,
    /* cupones: tarifa privada para un prospecto, solo en las noches [desde, hasta) y hasta el día "vence" (incluido).
       Se aplica con ?cupon=CODIGO en apartar.html o escribiéndolo ahí; el servidor de cobros lo recalcula igual. */
    cupones: {
      KAURI3000: { desde: "2026-11-22", hasta: "2026-11-24", noche: 3000, vence: "2026-10-16" },  // oferta de Dalí (12 oct 2026), pareja del anuncio
      /* tipo "nocheGratis": en cualquier fecha, con 3 noches o más, la noche más barata va de regalo (una por estancia);
         no aplica si alguna noche cae en temporada (puentes, fiestas, Semana Santa). */
      NOVIEMBRE: { desde: "2026-11-20", hasta: "2026-11-22", noche: 3000, vence: "2026-10-16" },  // misma pareja: la casa estaba ocupada en el puente
      NAVIDAD: { desde: "2026-12-21", hasta: "2026-12-23", noche: 3750, vence: "2026-10-16" },   // prospecto con mascota, antes de Navidad (Dalí, 13 oct 2026)
      MARY3X2: { tipo: "nocheGratis", vence: "2027-10-12" },   // regalo a Mary, huésped que comentó el anuncio (12 oct 2026)
      /* tipo "tope": cualquier fecha; la noche queda en "noche" solo si estaba arriba (nunca sube un precio) y no toca
         puentes, fiestas ni Semana Santa. Es el precio especial por reserva anticipada que se da en el chat (19 oct 2026). */
      ANTICIPADA: { tipo: "tope", noche: 3500 },
      DIRECTO: { tipo: "tope", noche: 3500, motivo: "reserva directa" }   // el que da Dalí en el chat a quien llega de la pauta (24 oct 2026)
    },
    temporadas: [
      { desde: "2026-11-13", hasta: "2026-11-16", noche: 4200, nombre: "Puente de la Revolución" },
      { desde: "2026-12-20", hasta: "2027-01-03", noche: 4500, nombre: "Fiestas de fin de año" },   // desde el 20: política del 19 sep 2026 (antes decía 23)
      { desde: "2027-01-03", hasta: "2027-02-01", noche: 4000, nombre: "Temporada de enero" },   // todo enero a $4,000, sin baja dinámica (Dalí, 13 oct 2026); el puente de febrero va después y lo pisa
      { desde: "2027-01-29", hasta: "2027-02-01", noche: 4200, nombre: "Puente de la Constitución" },
      { desde: "2027-03-12", hasta: "2027-03-15", noche: 4200, nombre: "Puente de Benito Juárez" },
      { desde: "2027-03-20", hasta: "2027-03-28", noche: 4500, nombre: "Semana Santa" }
    ]
  },
  depa: {
    nombre: "Departamento Kauri", prefijo: "RES-DK", max: 6, incluidos: 6, extraPersona: 0, minNoches: 2,
    entrada: "3:00 p.m.", salida: "12:00 p.m.",
    base: { semana: 1500, finde: 1800 },
    limpieza: 600, mascota: null, anticipo: 0.5,         // el depa NO admite mascotas (Dalí, 11 oct 2026)
    cupones: {   // mismo formato que los de la casa
      NAVIDAD: { desde: "2026-12-31", hasta: "2027-01-02", noche: 2200, vence: "2026-10-16" },   // Año Nuevo a $2,200 (Dalí, 13 oct 2026); en la casa el mismo código vale 21–23 dic
      NOVIEMBRE: { desde: "2026-11-13", hasta: "2026-11-16", noche: 1750, vence: "2026-10-16" }   // puente nov, pareja (Dalí, 12 oct 2026); en la casa el mismo código vale 20–22 nov
    },
    temporadas: [
      { desde: "2026-11-13", hasta: "2026-11-16", noche: 2200, nombre: "Puente de la Revolución" },
      { desde: "2026-12-23", hasta: "2027-01-03", noche: 3000, nombre: "Fiestas de fin de año" },   // $3,000 (Dalí, 13 oct 2026; antes $2,600)
      { desde: "2027-01-29", hasta: "2027-02-01", noche: 2200, nombre: "Puente de la Constitución" },
      { desde: "2027-03-12", hasta: "2027-03-15", noche: 2200, nombre: "Puente de Benito Juárez" },
      { desde: "2027-03-20", hasta: "2027-03-28", noche: 2600, nombre: "Semana Santa" }
    ]
  },
  /* Servidor de cobros (casa-kauri/operacion/kauri-pagos, Cloudflare Worker). Vacío = la solicitud se manda por WhatsApp.
     Con valor: el botón cobra el anticipo con Mercado Pago y el calendario suma las reservas directas. */
  servidor: "https://kauri-pagos.casakauri.workers.dev"
};

/* Desglose de la estancia. ctx opcional: { busy: {"AAAA-MM-DD":1,...} } con las noches ocupadas (de disponibilidad.json),
   para medir qué tan lleno va cada mes. Cada noche dice si lleva precio especial y por qué. */
window.kauriPrecio = function (prop, llegada, salida, mascotas, ctx, personas) {
  var T = window.KAURI_TARIFAS[prop]; if (!T) return null;
  var busy = (ctx && ctx.busy) || null, hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  function k(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  var occCache = {};
  function ocupacion(d) {                                   // noches ocupadas / noches por venir del mes (de hoy en adelante)
    var key = d.getFullYear() + "-" + d.getMonth(); if (key in occCache) return occCache[key];
    if (!busy) return (occCache[key] = null);
    var x = new Date(d.getFullYear(), d.getMonth(), 1), fin = new Date(d.getFullYear(), d.getMonth() + 1, 1), tot = 0, oc = 0;
    if (x < hoy) x = new Date(hoy);
    for (; x < fin; x.setDate(x.getDate() + 1)) { tot++; if (busy[k(x)]) oc++; }
    return (occCache[key] = tot ? oc / tot : null);
  }
  var diasFaltan = Math.round((new Date(llegada) - hoy) / 864e5);
  var codigo = String((ctx && ctx.cupon) || "").trim().toUpperCase(), cup = T.cupones && T.cupones[codigo], usoCupon = false;
  var cupVencido = !!(cup && cup.vence && k(hoy) > cup.vence), cupVence = cup ? cup.vence || "" : ""; if (cupVencido) cup = null;
  var cupTemporada = false;
  var grupos = {}, orden = [], noches = 0, subtotal = 0, especial = false, ahorro = 0;
  for (var d = new Date(llegada); d < salida; d.setDate(d.getDate() + 1)) {
    var key = k(d), finde = (d.getDay() === 5 || d.getDay() === 6), tipo = finde ? "finde" : "semana";
    var precio = T.base[tipo], etiqueta = finde ? "Viernes y sábado" : "Domingo a jueves", motivo = "";
    var temp = null; T.temporadas.forEach(function (t) { if (key >= t.desde && key < t.hasta && !(t.vence && k(hoy) > t.vence)) temp = t; });   // vence: último día (incluido) en que vale una oferta
    if (cup && cup.tipo === "nocheGratis" && temp) cupTemporada = true;
    if (cup && !cup.tipo && key >= cup.desde && key < cup.hasta) { precio = cup.noche; etiqueta = "Cupón " + codigo + " · tarifa especial"; temp = cup; usoCupon = true; }
    else if (temp) { precio = temp.noche; etiqueta = temp.nombre; }
    else if (T.anticipada && diasFaltan > T.anticipada.dias) { precio = T.anticipada.noche; }
    else if (T.dinamica) {
      var occ = ocupacion(d);
      if (occ !== null && occ < T.dinamica.ocupacionBaja) {
        if (diasFaltan <= T.dinamica.diasCerca) { precio = T.dinamica.bajaCerca[tipo]; motivo = "Precio especial de última hora"; }
        else { precio = T.dinamica.baja[tipo]; motivo = "Precio especial de temporada baja"; }
        etiqueta = (finde ? "Viernes y sábado" : "Domingo a jueves") + " · " + motivo.toLowerCase();
      }
    }
    if (cup && cup.tipo === "tope" && !temp) usoCupon = true;   // válido aunque la noche ya estuviera abajo: así no sale «cupón no válido»
    if (cup && cup.tipo === "tope" && !temp && precio > cup.noche) {   // el cupón solo baja: nunca sube lo que ya estaba abajo
      var porque = cup.motivo || "reserva anticipada";
      precio = cup.noche; motivo = "Precio especial de " + porque; usoCupon = true;
      etiqueta = (finde ? "Viernes y sábado" : "Domingo a jueves") + " · cupón " + codigo + " · " + porque;
    }
    if (!temp && !motivo && T.ancla && precio < T.ancla) { motivo = "Precio preferencial de reserva directa"; etiqueta = (finde ? "Viernes y sábado" : "Domingo a jueves") + " · precio preferencial de reserva directa"; }
    if (T.ancla && precio < T.ancla) { especial = true; ahorro += T.ancla - precio; }
    var g = etiqueta + "|" + precio;
    if (!grupos[g]) { grupos[g] = { etiqueta: etiqueta, precio: precio, noches: 0, especial: !!motivo }; orden.push(g); }
    grupos[g].noches++; noches++; subtotal += precio;
  }
  if (cup && cup.tipo === "nocheGratis" && !cupTemporada && noches >= 3) {   // se regala la noche más barata
    var gb = null; orden.forEach(function (g) { if (!gb || grupos[g].precio < grupos[gb].precio) gb = g; });
    var regalo = grupos[gb].precio; subtotal -= regalo; ahorro += regalo; especial = true; usoCupon = true;
    if (!--grupos[gb].noches) orden.splice(orden.indexOf(gb), 1);
    grupos.regalo = { etiqueta: "Noche de regalo · cupón " + codigo, precio: 0, noches: 1, especial: true }; orden.push("regalo");
  }
  var m = T.mascota ? Math.max(0, mascotas | 0) : 0, cargoM = m * (T.mascota || 0);
  var extra = Math.max(0, (personas | 0) - (T.incluidos || T.max)), cargoExtra = extra * (T.extraPersona || 0) * noches;   // por persona, por noche
  var total = subtotal + T.limpieza + cargoM + cargoExtra;
  var anticipo = Math.round(total * T.anticipo / 50) * 50;          // redondeado a múltiplos de $50
  return { noches: noches, lineas: orden.map(function (g) { return grupos[g]; }), subtotal: subtotal, limpieza: T.limpieza,
           mascotas: m, cargoMascotas: cargoM, personasExtra: extra, cargoExtra: cargoExtra, total: total, anticipo: anticipo, saldo: total - anticipo, tarifa: T,
           ancla: T.ancla || null, especial: especial, ahorro: ahorro, cupon: usoCupon ? codigo : "", cuponInvalido: !!codigo && !usoCupon, cuponVencido: cupVencido, cuponVence: cupVence, cuponTemporada: cupTemporada };
};
window.KAURI_TARIFAS.pagoURL = window.KAURI_TARIFAS.servidor ? window.KAURI_TARIFAS.servidor + "/pago" : "";
window.kauriMoneda = function (n) { return "$" + Math.round(n).toLocaleString("es-MX"); };
