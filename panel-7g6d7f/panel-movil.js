/* ===========================================================================
   Panel de venta directa — piezas comunes a las tres páginas del panel.

   Hace tres cosas:
     1. El candado de PIN (kGate).
     2. Abrir WhatsApp ya con el texto puesto (kWhats), que es el flujo del celular.
     3. Marcar el <html> con .k-movil para los ajustes de pantalla chica.

   OJO: esto NO es seguridad. El archivo es público y quien lo abra puede leer
   el PIN. Es un cerrojo contra el curioso que dé con la URL, nada más. Lo que
   de verdad protege es que la carpeta tenga un nombre que nadie adivina y que
   las páginas lleven noindex.
   =========================================================================== */

/* ---- CAMBIA AQUÍ EL PIN (4 dígitos, solo números: el teclado del celular
        se abre en modo numérico y no tiene letras ni símbolos) ---- */
const K_PIN = '7412';

/* Cuántos días recuerda el candado en este teléfono antes de volver a pedirlo. */
const K_DIAS = 60;

const K_LLAVE = 'kauri_panel_ok';

/* Oculta la página desde el primer instante: sin esto se alcanza a ver el
   generador un parpadeo antes de que aparezca el candado. */
(function () {
  const s = document.createElement('style');
  s.textContent = 'html.k-lock body{visibility:hidden}';
  document.head.appendChild(s);
  document.documentElement.classList.add('k-lock');
})();

function kDesbloqueado() {
  try {
    const v = localStorage.getItem(K_LLAVE);
    if (!v) return false;
    const { pin, hasta } = JSON.parse(v);
    /* Si se cambia el PIN en el archivo, los teléfonos ya desbloqueados
       tienen que volver a teclearlo. Por eso se guarda cuál se usó. */
    return pin === K_PIN && Date.now() < hasta;
  } catch (e) { return false; }
}

function kAbrir() {
  try {
    localStorage.setItem(K_LLAVE, JSON.stringify({
      pin: K_PIN,
      hasta: Date.now() + K_DIAS * 864e5
    }));
  } catch (e) { /* modo privado: no se recuerda, pero deja entrar */ }
  document.documentElement.classList.remove('k-lock');
  const c = document.getElementById('k-candado');
  if (c) c.remove();
}

function kGate() {
  if (kDesbloqueado()) { document.documentElement.classList.remove('k-lock'); return; }

  const d = document.createElement('div');
  d.id = 'k-candado';
  d.innerHTML =
    '<div class="k-caja">' +
      '<div class="k-logo">Casa Kauri</div>' +
      '<div class="k-sub">Panel de venta directa</div>' +
      '<input id="k-pin" type="password" inputmode="numeric" pattern="[0-9]*" ' +
        'autocomplete="off" maxlength="4" placeholder="••••" />' +
      '<button id="k-ok" type="button">Entrar</button>' +
      '<div class="k-err" id="k-err"></div>' +
    '</div>';
  document.body.appendChild(d);
  /* El candado se pinta aunque el body esté oculto por .k-lock */
  d.style.visibility = 'visible';

  const inp = d.querySelector('#k-pin');
  const err = d.querySelector('#k-err');
  const probar = () => {
    if (inp.value === K_PIN) { kAbrir(); }
    else {
      err.textContent = 'PIN incorrecto';
      inp.value = '';
      inp.focus();
    }
  };
  d.querySelector('#k-ok').addEventListener('click', probar);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') probar(); });
  /* En cuanto teclea el cuarto dígito entra solo: un botón menos que picar. */
  inp.addEventListener('input', () => {
    err.textContent = '';
    if (inp.value.length === 4) probar();
  });
  setTimeout(() => inp.focus(), 60);
}

/* --------------------------------------------------------------------------
   WhatsApp
   -------------------------------------------------------------------------- */

/* Normaliza a lo que espera wa.me: solo dígitos, con lada de país.
   Un número escrito con "+" se respeta tal cual — puede ser un huésped
   extranjero y anteponerle 52 lo rompería. Solo se asume México cuando
   vienen exactamente los 10 dígitos nacionales. */
function kTelE164(txt) {
  const crudo = (txt || '').trim();
  const d = crudo.replace(/\D/g, '');
  if (!d) return '';
  if (crudo.startsWith('+')) return d;
  if (d.length === 10) return '52' + d;
  if (d.length === 13 && d.startsWith('521')) return '52' + d.slice(3);
  return d;
}

/* Abre WhatsApp con el mensaje ya escrito. Sin número abre el selector de
   contactos, que es justo lo que se quiere cuando el chat ya está abierto. */
function kWhats(texto, tel) {
  const num = kTelE164(tel);
  const url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(texto);
  window.open(url, '_blank');
}

/* --------------------------------------------------------------------------
   Arranque
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  if (matchMedia('(max-width: 960px)').matches) {
    document.documentElement.classList.add('k-movil');
  }
  kGate();
});
