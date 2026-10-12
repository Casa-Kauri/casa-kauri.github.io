/* Tarifas y cálculo de precio de Casa Kauri y Departamento Kauri (11 oct 2026).
   Fuente: política de precio de Dalí. Casa (11 oct 2026): ancla $4,000; normal $3,500 entre semana y $3,800 viernes y
   sábado; mes bajo $3,200 / $3,500; mes bajo y llegada cercana $3,250 el fin de semana; piso $3,200. Depa: piso $1,500.
   Casa: el precio es para 8 personas; desde la 9.ª, $400 por persona por noche. Depa: no admite mascotas.
   Siempre: mínimo 2 noches, limpieza $600 por estancia (una sola vez), anticipo 50 %, cancelación sin costo hasta 31
   días antes, y todo precio menor al ancla se rotula como especial o preferencial. Para cambiar un precio se edita SOLO este archivo.
   "finde" = noches de viernes y sábado. Una temporada pisa al precio base en las noches [desde, hasta). */
window.KAURI_TARIFAS = {
  casa: {
    nombre: "Casa Kauri", prefijo: "RES-CK", max: 10, incluidos: 8, extraPersona: 400, minNoches: 2,   // precio para 8; desde la 9.ª persona $400 por persona por noche (Dalí, 11 oct 2026)
    entrada: "3:00 p.m.", salida: "11:00 a.m.",
    ancla: 4000,                                   // precio base que se muestra tachado (11 oct 2026)
    base: { semana: 3500, finde: 3800 },           // demanda normal
    /* precio dinámico (decisión de Dalí, 11 oct 2026): si el mes va bajo (< 40 % de noches ocupadas) entre semana
       $3,200 y fin de semana $3,500; si además la llegada está a 10 días o menos, el fin de semana baja a $3,250.
       Piso nuevo: $3,200. Puentes y fiestas no bajan. */
    dinamica: { ocupacionBaja: 0.4, diasCerca: 10, baja: { semana: 3200, finde: 3500 }, bajaCerca: { semana: 3200, finde: 3250 } },
    limpieza: 600, mascota: 300, anticipo: 0.5,
    /* cupones: tarifa privada para un prospecto, solo en las noches [desde, hasta) y hasta el día "vence" (incluido).
       Se aplica con ?cupon=CODIGO en apartar.html o escribiéndolo ahí; el servidor de cobros lo recalcula igual. */
    cupones: {
      KAURI3000: { desde: "2026-11-22", hasta: "2026-11-24", noche: 3000, vence: "2026-10-16" }   // oferta de Dalí (12 oct 2026), pareja del anuncio
    },
    temporadas: [
      { desde: "2026-11-13", hasta: "2026-11-16", noche: 4200, nombre: "Puente de la Revolución" },
      { desde: "2026-12-23", hasta: "2027-01-03", noche: 4500, nombre: "Fiestas de fin de año" },
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
    temporadas: [
      { desde: "2026-11-13", hasta: "2026-11-16", noche: 2200, nombre: "Puente de la Revolución" },
      { desde: "2026-12-23", hasta: "2027-01-03", noche: 2600, nombre: "Fiestas de fin de año" },
      { desde: "2027-01-29", hasta: "2027-02-01", noche: 2200, nombre: "Puente de la Constitución" },
      { desde: "2027-03-12", hasta: "2027-03-15", noche: 2200, nombre: "Puente de Benito Juárez" },
      { desde: "2027-03-20", hasta: "2027-03-28", noche: 2600, nombre: "Semana Santa" }
    ]
  },
  /* Servidor de cobros (operacion/kauri-pagos, Cloudflare Worker). Vacío = la solicitud se manda por WhatsApp.
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
  var grupos = {}, orden = [], noches = 0, subtotal = 0, especial = false, ahorro = 0;
  for (var d = new Date(llegada); d < salida; d.setDate(d.getDate() + 1)) {
    var key = k(d), finde = (d.getDay() === 5 || d.getDay() === 6), tipo = finde ? "finde" : "semana";
    var precio = T.base[tipo], etiqueta = finde ? "Viernes y sábado" : "Domingo a jueves", motivo = "";
    var temp = null; T.temporadas.forEach(function (t) { if (key >= t.desde && key < t.hasta && !(t.vence && k(hoy) > t.vence)) temp = t; });   // vence: último día (incluido) en que vale una oferta
    if (cup && key >= cup.desde && key < cup.hasta) { precio = cup.noche; etiqueta = "Cupón " + codigo + " · tarifa especial"; temp = cup; usoCupon = true; }
    else if (temp) { precio = temp.noche; etiqueta = temp.nombre; }
    else if (T.dinamica) {
      var occ = ocupacion(d);
      if (occ !== null && occ < T.dinamica.ocupacionBaja) {
        if (diasFaltan <= T.dinamica.diasCerca) { precio = T.dinamica.bajaCerca[tipo]; motivo = "Precio especial de última hora"; }
        else { precio = T.dinamica.baja[tipo]; motivo = "Precio especial de temporada baja"; }
        etiqueta = (finde ? "Viernes y sábado" : "Domingo a jueves") + " · " + motivo.toLowerCase();
      }
    }
    if (!temp && !motivo && T.ancla && precio < T.ancla) { motivo = "Precio preferencial de reserva directa"; etiqueta = (finde ? "Viernes y sábado" : "Domingo a jueves") + " · precio preferencial de reserva directa"; }
    if (T.ancla && precio < T.ancla) { especial = true; ahorro += T.ancla - precio; }
    var g = etiqueta + "|" + precio;
    if (!grupos[g]) { grupos[g] = { etiqueta: etiqueta, precio: precio, noches: 0, especial: !!motivo }; orden.push(g); }
    grupos[g].noches++; noches++; subtotal += precio;
  }
  var m = T.mascota ? Math.max(0, mascotas | 0) : 0, cargoM = m * (T.mascota || 0);
  var extra = Math.max(0, (personas | 0) - (T.incluidos || T.max)), cargoExtra = extra * (T.extraPersona || 0) * noches;   // por persona, por noche
  var total = subtotal + T.limpieza + cargoM + cargoExtra;
  var anticipo = Math.round(total * T.anticipo / 50) * 50;          // redondeado a múltiplos de $50
  return { noches: noches, lineas: orden.map(function (g) { return grupos[g]; }), subtotal: subtotal, limpieza: T.limpieza,
           mascotas: m, cargoMascotas: cargoM, personasExtra: extra, cargoExtra: cargoExtra, total: total, anticipo: anticipo, saldo: total - anticipo, tarifa: T,
           ancla: T.ancla || null, especial: especial, ahorro: ahorro, cupon: usoCupon ? codigo : "", cuponInvalido: !!codigo && !usoCupon, cuponVencido: cupVencido, cuponVence: cupVence };
};
window.KAURI_TARIFAS.pagoURL = window.KAURI_TARIFAS.servidor ? window.KAURI_TARIFAS.servidor + "/pago" : "";
window.kauriMoneda = function (n) { return "$" + Math.round(n).toLocaleString("es-MX"); };
