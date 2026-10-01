"""Publica Code Quest en s3://rogeliovargas.com/code-quest/

1. Respalda TODO lo que hay hoy en code-quest/ del servidor (para poder regresar).
2. Regenera la copia para compartir y su zip (CodeQuest-para-compartir/).
3. Sube los archivos del curso con su tipo (ContentType) y caché corta.
4. Verifica que lo subido sea idéntico a lo local (MD5 = ETag).

⚠️ SOLO escribe dentro de code-quest/ y NUNCA borra: el bucket tiene otras
cosas de rogeliovargas.com (assets/, forgesteel/, archivos de la raíz).

Uso (desde la raíz del repo):
  python3 herramientas/publicar.py <carpeta-respaldo>              → simulación
  python3 herramientas/publicar.py <carpeta-respaldo> --de-verdad  → publica
Necesita boto3 y las llaves de ~/.aws/credentials (usuario S3-User).
"""
import hashlib
import mimetypes
import os
import shutil
import sys

import boto3

BUCKET = "rogeliovargas.com"
PREFIJO = "code-quest/"
TIPOS = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".zip": "application/zip",
}
# Las páginas siempre se revisan (así piden los archivos ?v= correctos);
# los demás archivos se pueden guardar 5 minutos.
CACHE_HTML = "no-cache"
CACHE_RESTO = "max-age=300"
# herramientas/ son scripts del profe: no se publican ni van en el zip
IGNORAR_DIRS = {".git", "CodeQuest-para-compartir", "node_modules", "herramientas"}
# Notas internas (mencionan el bucket y AWS): tampoco se publican
IGNORAR_ARCHIVOS = {"CLAUDE.md"}

curso = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
respaldo = sys.argv[1]
de_verdad = "--de-verdad" in sys.argv
s3 = boto3.client("s3", region_name="us-west-2")


def md5(ruta):
    h = hashlib.md5()
    with open(ruta, "rb") as f:
        h.update(f.read())
    return h.hexdigest()


def listar_servidor():
    objs, tok = [], None
    while True:
        kw = dict(Bucket=BUCKET, Prefix=PREFIJO)
        if tok:
            kw["ContinuationToken"] = tok
        r = s3.list_objects_v2(**kw)
        objs += r.get("Contents", [])
        if not r.get("IsTruncated"):
            return objs
        tok = r["NextContinuationToken"]


# 1) Respaldo
servidor = listar_servidor()
os.makedirs(respaldo, exist_ok=True)
for o in servidor:
    destino = os.path.join(respaldo, o["Key"][len(PREFIJO):])
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    s3.download_file(BUCKET, o["Key"], destino)
print(f"Respaldo: {len(servidor)} archivos del servidor en {respaldo}")

# 2) Copia para compartir + zip (la carpeta está en .gitignore)
compartir = os.path.join(curso, "CodeQuest-para-compartir")
copia = os.path.join(compartir, "developer_course")
shutil.rmtree(copia, ignore_errors=True)
shutil.copytree(curso, copia, ignore=lambda d, nombres: [
    n for n in nombres if n in IGNORAR_DIRS or n in IGNORAR_ARCHIVOS or n.startswith(".")])
shutil.make_archive(os.path.join(compartir, "code-quest"), "zip", compartir, "developer_course")
print("Copia para compartir y code-quest.zip regenerados")

# 3) Qué subir
subir = []
for raiz, dirs, archivos in os.walk(curso):
    dirs[:] = [d for d in dirs if d not in IGNORAR_DIRS]
    for a in archivos:
        if a.startswith(".") or a in IGNORAR_ARCHIVOS:
            continue
        ruta = os.path.join(raiz, a)
        subir.append((ruta, PREFIJO + os.path.relpath(ruta, curso).replace(os.sep, "/")))
zip_compartir = os.path.join(curso, "CodeQuest-para-compartir", "code-quest.zip")
if os.path.exists(zip_compartir):
    subir.append((zip_compartir, PREFIJO + "code-quest.zip"))

etags = {o["Key"]: o["ETag"].strip('"') for o in servidor}
cambios = [(r, k) for r, k in subir if etags.get(k) != md5(r)]
print(f"{len(subir)} archivos en total, {len(cambios)} nuevos o cambiados:")
for r, k in cambios:
    print("  ", k, "(nuevo)" if k not in etags else "")

if not de_verdad:
    print("\n(Simulación: agrega --de-verdad para subir)")
    sys.exit(0)

# 4) Subir: primero los archivos nuevos y de assets, al final las páginas,
#    para que una página nueva nunca apunte a un archivo que aún no existe.
cambios.sort(key=lambda rk: rk[1].endswith(".html"))
for ruta, clave in subir:
    ext = os.path.splitext(ruta)[1].lower()
    tipo = TIPOS.get(ext) or mimetypes.guess_type(ruta)[0] or "application/octet-stream"
    cache = CACHE_HTML if ext == ".html" else CACHE_RESTO
    if (ruta, clave) not in cambios:
        # Igual por dentro: solo actualizamos la caché para futuras publicaciones
        s3.copy_object(Bucket=BUCKET, Key=clave, CopySource={"Bucket": BUCKET, "Key": clave},
                       MetadataDirective="REPLACE", ContentType=tipo, CacheControl=cache)
for ruta, clave in cambios:
    ext = os.path.splitext(ruta)[1].lower()
    tipo = TIPOS.get(ext) or mimetypes.guess_type(ruta)[0] or "application/octet-stream"
    cache = CACHE_HTML if ext == ".html" else CACHE_RESTO
    s3.upload_file(ruta, BUCKET, clave, ExtraArgs={"ContentType": tipo, "CacheControl": cache})
print(f"Subidos {len(cambios)} archivos")

# 5) Verificar
final = {o["Key"]: o["ETag"].strip('"') for o in listar_servidor()}
malos = [k for r, k in subir if final.get(k) != md5(r)]
print("Verificación:", "TODO IDÉNTICO ✅" if not malos else f"DIFERENTES: {malos}")
sys.exit(1 if malos else 0)
