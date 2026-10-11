#!/usr/bin/env python3
"""Lee los calendarios exportados de Airbnb (iCal) y guarda SOLO las noches ocupadas en disponibilidad.json.
Corre en GitHub Actions cada 3 horas (.github/workflows/disponibilidad.yml). Los enlaces viven como secretos
del repositorio (ICAL_CASA, ICAL_DEPA) porque el iCal de Airbnb trae datos de huéspedes (p. ej. los últimos 4
dígitos del teléfono): nada de eso se publica, solo rangos de fechas. Sin dependencias: solo biblioteca estándar."""
import json, os, re, sys, urllib.request, datetime as dt

ARCHIVO = os.path.join(os.path.dirname(__file__), "..", "disponibilidad.json")
PROPS = {"casa": "ICAL_CASA", "depa": "ICAL_DEPA"}

def descargar(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (kauri-calendario)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

def fecha(valor):
    m = re.search(r"(\d{4})(\d{2})(\d{2})", valor)
    return dt.date(int(m.group(1)), int(m.group(2)), int(m.group(3))) if m else None

def rangos(ics):
    ics = re.sub(r"\r?\n[ \t]", "", ics)            # líneas dobladas del formato iCal
    hoy = dt.date.today() - dt.timedelta(days=1)
    limite = hoy + dt.timedelta(days=550)
    res = []
    for ev in re.findall(r"BEGIN:VEVENT(.*?)END:VEVENT", ics, re.S):
        ini = re.search(r"^DTSTART[^:\n]*:(.+)$", ev, re.M)
        fin = re.search(r"^DTEND[^:\n]*:(.+)$", ev, re.M)
        if not ini:
            continue
        a = fecha(ini.group(1)); b = fecha(fin.group(1)) if fin else a + dt.timedelta(days=1)
        if not a or not b or b <= hoy or a > limite:
            continue
        res.append([max(a, hoy), min(b, limite)])        # [llegada, salida): la noche de salida queda libre
    res.sort()
    unidos = []
    for a, b in res:
        if unidos and a <= unidos[-1][1]:
            unidos[-1][1] = max(unidos[-1][1], b)
        else:
            unidos.append([a, b])
    return [[a.isoformat(), b.isoformat()] for a, b in unidos]

def main():
    try:
        datos = json.load(open(ARCHIVO, encoding="utf-8"))
    except Exception:
        datos = {"actualizado": None}
    cambio = False
    for prop, var in PROPS.items():
        url = os.environ.get(var, "").strip()
        if not url:
            print(f"{prop}: sin enlace ({var}); se conserva lo que había")
            datos.setdefault(prop, [])
            continue
        try:
            nuevo = rangos(descargar(url))
        except Exception as e:                            # un fallo de red no borra el calendario
            print(f"{prop}: no se pudo leer ({e}); se conserva lo que había", file=sys.stderr)
            datos.setdefault(prop, [])
            continue
        if nuevo != datos.get(prop):
            datos[prop] = nuevo; cambio = True
        datos.setdefault("sincronizado", {})[prop] = True
        print(f"{prop}: {len(nuevo)} periodos ocupados")
    viejo = datos.get("actualizado")
    vencido = not viejo or (dt.datetime.utcnow() - dt.datetime.fromisoformat(viejo.replace("Z", ""))).total_seconds() > 86400
    if cambio or (vencido and datos.get("sincronizado")):
        datos["actualizado"] = dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
        json.dump(datos, open(ARCHIVO, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print("disponibilidad.json actualizado")
    else:
        print("sin cambios")

if __name__ == "__main__":
    main()
