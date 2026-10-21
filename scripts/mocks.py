"""Genera las maquetas HTML de primera pantalla para la ronda de direccion.

Cada archivo es autocontenido (HTML + CSS inline) y mide 1440x900.
Se dibuja solo la composicion: el texto bajo 22px se lee como barras en la
pagina de decision, asi que el codigo real de copy no importa aqui.
"""
import os, json

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".impeccable", "mocks", "decision")
os.makedirs(BASE, exist_ok=True)

SHELL_CSS = """
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1440px;height:900px;overflow:hidden}
  body{position:relative;background:#fff;color:#111;font-family:'Arial Narrow',Arial,Helvetica,sans-serif}
  .sheet{position:absolute;inset:0;overflow:hidden}
  .rule{height:2px;background:currentColor;opacity:.85}
  .bar{background:currentColor;opacity:.82;height:11px;border-radius:1px}
  .bar.s{height:7px;opacity:.55}
  .bar.l{height:16px}
"""

def halftone(color, size=6, op=.14):
    return "background-image:radial-gradient(%s 1.1px, transparent 1.2px);background-size:%dpx %dpx;opacity:%s" % (
        color, size, size, op)

def sheet(name, css, body, title):
    css = css.replace("__HALFTONE__", halftone("#14323D", 5, .10))
    html = ("<!doctype html>\n<html lang=\"es\"><head><meta charset=\"utf-8\"><title>" + title +
            "</title>\n<style>\n" + SHELL_CSS + css +
            "\n</style></head>\n<body><div class=\"sheet\">" + body + "</div></body></html>")
    p = os.path.join(BASE, name)
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)
    return p


# ---------------------------------------------------------------- assigned
assigned_css = """
  .sheet{background:#F2E6C9;color:#14323D}
  .grain{position:absolute;inset:0;__HALFTONE__}
  .plate{position:absolute;background:#14323D}
  .t1{position:absolute;font-weight:900;letter-spacing:-.03em;line-height:.86;text-transform:uppercase}
  .t2{position:absolute;font-weight:800;letter-spacing:.22em;text-transform:uppercase;font-size:13px}
  .t3{position:absolute;font-weight:600;font-size:12px;letter-spacing:.05em}
  .vign{position:absolute;border-radius:52% 48% 46% 54% / 58% 52% 48% 42%;background:#3AB3B5}
"""
assigned_body = """
  <div class="grain"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:14px;background:#14323D"></div>
  <div style="position:absolute;left:72px;top:84px;width:150px" class="bar"></div>
  <div class="t1" style="left:72px;top:126px;font-size:132px">Turismo<br>Regional</div>
  <div class="t1" style="left:72px;top:400px;font-size:132px;color:#B45A2A">&amp;Naturaleza</div>
  <div class="rule" style="position:absolute;left:72px;top:566px;width:640px"></div>
  <div class="t2" style="left:72px;top:592px">Formosa &middot; Rep&uacute;blica Argentina</div>
  <div style="position:absolute;left:72px;top:640px;width:330px" class="bar s"></div>
  <div style="position:absolute;left:72px;top:664px;width:250px" class="bar s"></div>
  <div style="position:absolute;left:72px;top:726px;width:264px;height:54px;background:#B45A2A"></div>
  <div style="position:absolute;left:72px;top:746px;width:180px;height:13px;background:#F2E6C9;opacity:.9"></div>
  <div class="vign" style="left:820px;top:96px;width:520px;height:470px"></div>
  <div class="vign" style="left:640px;top:430px;width:340px;height:300px;background:#6B7A3A"></div>
  <div class="vign" style="left:990px;top:520px;width:300px;height:250px;background:#B45A2A;opacity:.9"></div>
  <div class="plate" style="left:846px;top:300px;width:9px;height:150px;transform:rotate(-8deg)"></div>
  <div class="plate" style="left:1030px;top:250px;width:9px;height:200px;transform:rotate(6deg)"></div>
  <div style="position:absolute;left:72px;bottom:44px;width:1296px" class="rule"></div>
  <div class="t3" style="left:72px;bottom:18px">Ministerio de Turismo &middot; Provincia de Formosa</div>
  <div class="t3" style="right:72px;bottom:18px">N&ordm; 01</div>
"""
sheet("assigned.html", assigned_css, assigned_body, "Cartel de Turismo")

# ---------------------------------------------------------------- pick
pick_css = """
  .sheet{background:#F4EAD2;color:#1C3B33}
  .grain{position:absolute;inset:0;__HALFTONE__}
  .gutter{position:absolute;left:50%;top:0;bottom:0;width:2px;background:#1C3B33;opacity:.35}
  .t1{position:absolute;font-weight:700;letter-spacing:-.01em;line-height:1.02}
  .t2{position:absolute;font-weight:700;font-size:12px;letter-spacing:.2em;text-transform:uppercase}
  .it{font-style:italic;font-family:Georgia,serif}
  .plate{position:absolute;background:#C9D3C0}
"""
pick_body = """
  <div class="grain"></div>
  <div class="gutter"></div>
  <div class="t2" style="left:64px;top:52px">Gu&iacute;a de Campo &middot; Formosa</div>
  <div class="t2" style="right:64px;top:52px">L&aacute;mina 14</div>
  <div style="position:absolute;left:64px;top:96px;width:560px" class="bar"></div>
  <div class="t1" style="left:64px;top:132px;font-size:62px">Yacar&eacute;<br><span class="it" style="font-size:32px">Caiman yacar&eacute;</span></div>
  <div style="position:absolute;left:64px;top:320px;width:540px" class="bar s"></div>
  <div style="position:absolute;left:64px;top:348px;width:520px" class="bar s"></div>
  <div style="position:absolute;left:64px;top:376px;width:560px" class="bar s"></div>
  <div style="position:absolute;left:64px;top:404px;width:430px" class="bar s"></div>
  <div class="plate" style="left:64px;top:470px;width:560px;height:330px;background:#8E9C7A"></div>
  <div style="position:absolute;left:64px;top:470px;width:560px;height:330px;background:#1C3B33;opacity:.22;border-radius:48% 52% 40% 60% / 62% 44% 56% 38%"></div>
  <div class="t2" style="left:64px;top:826px">Distribuci&oacute;n &middot; R&iacute;o Bermejo</div>
  <div class="t2" style="left:790px;top:52px">Ficha de campo</div>
  <div class="t1" style="left:790px;top:132px;font-size:34px">Ficha de campo</div>
  <div style="position:absolute;left:790px;top:200px;width:560px" class="bar"></div>
  <div style="position:absolute;left:790px;top:232px;width:520px" class="bar s"></div>
  <div style="position:absolute;left:790px;top:260px;width:548px" class="bar s"></div>
  <div style="position:absolute;left:790px;top:288px;width:500px" class="bar s"></div>
  <div style="position:absolute;left:790px;top:316px;width:540px" class="bar s"></div>
  <div style="position:absolute;left:790px;top:380px;width:560px;height:230px;background:#D8CDB2"></div>
  <div style="position:absolute;left:790px;top:380px;width:560px;height:230px;background:#1C3B33;opacity:.14"></div>
  <div style="position:absolute;left:820px;top:560px;width:120px;height:9px;background:#B45A2A"></div>
  <div style="position:absolute;left:790px;top:660px;width:300px" class="bar s"></div>
  <div style="position:absolute;left:790px;top:690px;width:260px" class="bar s"></div>
  <div style="position:absolute;left:790px;top:740px;width:210px;height:46px;background:#1C3B33"></div>
  <div style="position:absolute;left:810px;top:757px;width:130px;height:12px;background:#F4EAD2"></div>
"""
sheet("model-pick.html", pick_css, pick_body, "Guia de Campo")

# ---------------------------------------------------------------- ebru
ebru_css = """
  .sheet{background:#EFE3CB;color:#20242B}
  .bath{position:absolute;inset:0;background:
    radial-gradient(58% 44% at 24% 34%, #1E6F72 0%, transparent 62%),
    radial-gradient(48% 40% at 62% 28%, #B45A2A 0%, transparent 58%),
    radial-gradient(62% 52% at 78% 70%, #1B4D3E 0%, transparent 60%),
    radial-gradient(40% 30% at 38% 76%, #3AB3B5 0%, transparent 56%),
    radial-gradient(30% 26% at 56% 52%, #E0A93B 0%, transparent 54%),
    #F4EDDD;}
  .comb{position:absolute;inset:0;mix-blend-mode:multiply;opacity:.85}
  .t1{position:absolute;font-weight:800;letter-spacing:-.02em;line-height:.92}
  .t2{position:absolute;font-weight:600;font-size:12px;letter-spacing:.22em;text-transform:uppercase}
"""
ebru_body = """
  <div class="bath"></div>
  <svg class="comb" viewBox="0 0 1440 900" preserveAspectRatio="none">
    <path d="M-40 250 C 200 120, 420 420, 660 300 S 1120 120, 1480 260" stroke="#20242B" stroke-width="5" fill="none" opacity=".30"/>
    <path d="M-40 330 C 240 210, 440 500, 700 380 S 1160 210, 1480 340" stroke="#20242B" stroke-width="3" fill="none" opacity=".22"/>
    <path d="M-40 640 C 260 520, 480 790, 740 660 S 1180 520, 1480 660" stroke="#20242B" stroke-width="4" fill="none" opacity=".26"/>
    <path d="M-40 720 C 300 610, 520 860, 780 740 S 1200 620, 1480 740" stroke="#20242B" stroke-width="2.5" fill="none" opacity=".18"/>
  </svg>
  <div style="position:absolute;inset:0;background:#20242B;opacity:.18"></div>
  <div class="t2" style="left:72px;top:78px">Una sola vuelta de agua</div>
  <div class="t1" style="left:72px;top:120px;font-size:96px;color:#F4EDDD;text-shadow:0 2px 0 rgba(32,36,43,.45)">El delta<br>del Bermejo</div>
  <div style="position:absolute;left:72px;bottom:96px;width:420px;height:2px;background:#20242B;opacity:.6"></div>
  <div class="t2" style="left:72px;bottom:62px">Cada destino se tinta encima y no se borra</div>
"""
sheet("challenger-ebru.html", ebru_css, ebru_body, "Ebru")

# ---------------------------------------------------------------- oscilloscope
osc_css = """
  .sheet{background:#0B0E10;color:#7DF2A8}
  .grat{position:absolute;inset:0;background-image:
    linear-gradient(rgba(125,242,168,.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125,242,168,.18) 1px, transparent 1px);
    background-size:10% 10%;}
  .t1{position:absolute;font-weight:700;letter-spacing:.14em;font-size:13px;text-transform:uppercase}
  .seg{position:absolute;font-weight:700;font-size:34px;letter-spacing:.04em;color:#FFB347}
  .knob{position:absolute;border-radius:50%;background:#161B1E;border:2px solid #39434A}
"""
osc_body = """
  <div class="grat"></div>
  <div class="t1" style="left:56px;top:44px">Canal 1 &middot; Bermejo &middot; 2.4 V</div>
  <div class="seg" style="left:56px;top:76px">12.480 kHz</div>
  <div class="t1" style="right:56px;top:44px;color:#FFB347">Disparado</div>
  <svg style="position:absolute;left:80px;top:170px;width:900px;height:520px" viewBox="0 0 900 520">
    <polyline points="0,300 40,300 60,180 80,420 100,300 140,300 160,220 180,380 200,300 240,300 260,140 280,460 300,300 340,300 360,240 380,360 400,300 440,300 460,190 480,410 500,300 540,300 560,250 580,350 600,300 640,300 660,160 680,440 700,300 740,300 760,230 780,370 800,300 840,300 860,210 880,390 900,300"
      fill="none" stroke="#7DF2A8" stroke-width="3" stroke-linejoin="round"/>
    <polyline points="0,420 90,420 150,430 210,412 270,428 330,416 390,424 450,418 510,426 570,414 630,422 690,416 750,424 810,418 870,422 900,420"
      fill="none" stroke="#3E6B57" stroke-width="2"/>
  </svg>
  <div style="position:absolute;left:1060px;top:170px;width:300px;height:520px;border:1px solid #2A3339"></div>
  <div class="knob" style="left:1130px;top:210px;width:100px;height:100px"></div>
  <div class="knob" style="left:1130px;top:360px;width:100px;height:100px"></div>
  <div class="knob" style="left:1130px;top:510px;width:100px;height:100px"></div>
  <div class="t1" style="left:1096px;top:326px;color:#FFB347">Tiempo base</div>
  <div class="t1" style="left:1100px;top:476px;color:#FFB347">Nivel</div>
  <div class="t1" style="left:1092px;top:626px;color:#FFB347">Canal</div>
  <div class="t1" style="left:56px;bottom:52px">Lat -26.1847 &middot; Long -58.1747 &middot; 78 m</div>
"""
sheet("challenger-oscilloscope.html", osc_css, osc_body, "Osciloscopio")

# ---------------------------------------------------------------- sleeping city
sleep_css = """
  .sheet{background:#131A3A;color:#F2E9D8}
  .band{position:absolute;left:0;right:0}
  .win{position:absolute;background:#F0C46A;opacity:.85}
  .t1{position:absolute;font-weight:800;letter-spacing:-.01em}
  .t2{position:absolute;font-weight:600;font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.7}
"""
sleep_body = """
  <div class="band" style="top:0;height:250px;background:#1B2450"></div>
  <div class="band" style="top:250px;height:230px;background:#243061"></div>
  <div class="band" style="top:480px;height:200px;background:#2E3B72"></div>
  <div class="band" style="top:680px;height:220px;background:#1B2450"></div>
  <div style="position:absolute;left:0;right:0;top:480px;height:200px;background:#0E1430;opacity:.45"></div>
  <div class="win" style="left:120px;top:300px;width:12px;height:16px"></div>
  <div class="win" style="left:180px;top:340px;width:12px;height:16px;opacity:.4"></div>
  <div class="win" style="left:260px;top:290px;width:12px;height:16px"></div>
  <div class="win" style="left:420px;top:330px;width:12px;height:16px;opacity:.5"></div>
  <div class="win" style="left:980px;top:300px;width:12px;height:16px"></div>
  <div class="win" style="left:1100px;top:350px;width:12px;height:16px;opacity:.35"></div>
  <div class="t1" style="left:72px;top:70px;font-size:92px">La ciudad<br>se duerme</div>
  <div class="t2" style="left:72px;top:280px">Distrito&nbsp;01 &middot; 03:14 &middot; lluvia tropical</div>
  <div class="t2" style="left:72px;top:820px">Cada comarca con su hora y su clima</div>
"""
sheet("challenger-sleeping-city.html", sleep_css, sleep_body, "Ciudad dormida")

# ---------------------------------------------------------------- rain night
rain_css = """
  .sheet{background:#0A1424;color:#E8EEF6}
  .t1{position:absolute;font-weight:800;letter-spacing:-.01em}
  .t2{position:absolute;font-weight:600;font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.72}
  .win{position:absolute;background:#FFB454;opacity:.8}
  .sky{position:absolute;left:0;right:0;background:linear-gradient(#1C3A63,#0A1424)}
  .refl{position:absolute;left:0;right:0;background:linear-gradient(#0A1424,#16283F)}
"""
rain_body = """
  <div class="sky" style="top:0;height:330px"></div>
  <div class="refl" style="top:330px;height:300px"></div>
  <div style="position:absolute;left:0;right:0;top:630px;height:270px;background:#0D1A2C"></div>
  <div style="position:absolute;left:0;right:0;top:330px;height:2px;background:#3C5C88;opacity:.7"></div>
  <div style="position:absolute;left:0;right:0;top:330px;height:300px;opacity:.30">
    <svg width="1440" height="300"><g fill="#FFB454">
      <rect x="120" y="30" width="10" height="14"/><rect x="180" y="70" width="10" height="14" opacity=".5"/>
      <rect x="980" y="40" width="10" height="14"/><rect x="1100" y="96" width="10" height="14" opacity=".45"/>
      <rect x="420" y="120" width="10" height="14" opacity=".35"/></g></svg></div>
  <div class="t1" style="left:72px;top:64px;font-size:88px">Hora azul<br>sobre el r&iacute;o</div>
  <div class="t2" style="left:72px;top:296px">23:47 &middot; lluvia</div>
  <div class="t2" style="left:72px;top:356px">Cada banda lleva su reflejo</div>
  <div class="t2" style="left:72px;bottom:56px">Trens, neones y el r&iacute;o duplicando cada luz</div>
"""
sheet("challenger-rain-night.html", rain_css, rain_body, "Nocturno")

# ---------------------------------------------------------------- polish poster
polish_css = """
  .sheet{background:#E4D9C0;color:#2A1A12}
  .t1{position:absolute;font-weight:800;letter-spacing:-.02em;line-height:.9;text-transform:uppercase}
  .t2{position:absolute;font-weight:600;font-size:12px;letter-spacing:.24em;text-transform:uppercase}
  .blob{position:absolute;background:#8E2F22;border-radius:52% 48% 61% 39% / 47% 56% 44% 53%}
"""
polish_body = """
  <div class="blob" style="left:520px;top:110px;width:720px;height:640px"></div>
  <div class="blob" style="left:640px;top:230px;width:420px;height:380px;background:#C4913C;opacity:.9"></div>
  <div class="blob" style="left:880px;top:330px;width:240px;height:210px;background:#3B2B4E;opacity:.85"></div>
  <div class="t1" style="left:72px;top:120px;font-size:104px;color:#2A1A12">El Gran<br>Pantano</div>
  <div class="t2" style="left:72px;top:376px">Una sola imagen por l&aacute;mina</div>
  <div style="position:absolute;left:72px;top:420px;width:330px;height:2px;background:#2A1A12;opacity:.5"></div>
  <div style="position:absolute;left:72px;top:456px;width:300px" class="bar s"></div>
  <div style="position:absolute;left:72px;top:482px;width:250px" class="bar s"></div>
  <div style="position:absolute;left:72px;top:760px;width:220px;height:48px;background:#8E2F22"></div>
  <div style="position:absolute;left:92px;top:776px;width:130px;height:13px;background:#E4D9C0"></div>
"""
sheet("challenger-polish-poster.html", polish_css, polish_body, "Poster polaco")

# ---------------------------------------------------------------- brodovitch
brod_css = """
  .sheet{background:#FAF7F1;color:#141414}
  .gutter{position:absolute;left:50%;top:0;bottom:0;width:1px;background:#141414;opacity:.22}
  .t1{position:absolute;font-weight:400;letter-spacing:-.02em;line-height:.94;font-family:Georgia,'Times New Roman',serif}
  .t2{position:absolute;font-weight:600;font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.6}
  .img{position:absolute;background:#B9B2A5}
"""
brod_body = """
  <div class="gutter"></div>
  <div class="t2" style="left:64px;top:48px">Bazar del Plata</div>
  <div class="img" style="left:64px;top:120px;width:520px;height:620px;background:#8C8C86"></div>
  <div style="position:absolute;left:64px;top:120px;width:520px;height:620px;background:#141414;opacity:.18"></div>
  <div class="t1" style="left:660px;top:150px;font-size:92px">La<br>orquesta<br>del<br>domingo</div>
  <div style="position:absolute;left:660px;top:596px;width:420px;height:1px;background:#141414;opacity:.4"></div>
  <div class="t2" style="left:660px;top:620px">Dos p&aacute;ginas, un medianil</div>
  <div style="position:absolute;left:660px;top:660px;width:380px" class="bar s"></div>
  <div style="position:absolute;left:660px;top:686px;width:330px" class="bar s"></div>
  <div style="position:absolute;left:660px;top:712px;width:360px" class="bar s"></div>
  <div style="position:absolute;left:660px;top:770px;width:190px;height:44px;background:#141414"></div>
  <div style="position:absolute;left:678px;top:785px;width:120px;height:12px;background:#FAF7F1"></div>
"""
sheet("challenger-brodovitch.html", brod_css, brod_body, "Brodovitch")

# ---------------------------------------------------------------- canon
canon_css = """
  .sheet{background:#FFFFFF;color:#111827}
  .t1{position:absolute;font-weight:700;letter-spacing:-.02em;line-height:1.05}
  .t2{position:absolute;font-weight:400;font-size:17px;color:#4B5563;line-height:1.6}
  .btn{position:absolute;border-radius:12px;background:#2563EB}
  .card{position:absolute;border-radius:16px;border:1px solid #E5E7EB;background:#fff}
  .t3{position:absolute;font-weight:600;font-size:17px}
  .s{position:absolute;height:12px;background:#D1D5DB;border-radius:6px}
"""
canon_body = """
  <div style="position:absolute;left:0;right:0;top:0;height:64px;border-bottom:1px solid #E5E7EB"></div>
  <div style="position:absolute;left:80px;top:22px;width:120px;height:20px;background:#111827"></div>
  <div class="t1" style="left:80px;top:190px;font-size:62px;width:820px">Descubre la<br>naturaleza de Formosa</div>
  <div class="t2" style="left:80px;top:380px;width:520px">Geolocalizaci&oacute;n, audiogu&iacute;as de gu&iacute;as locales,<br>esc&aacute;ner QR y rutas ecotur&iacute;sticas.</div>
  <div class="btn" style="left:80px;top:480px;width:220px;height:52px"></div>
  <div class="t1" style="left:80px;top:494px;font-size:18px;color:#fff;font-weight:600">Explorar mapa</div>
  <div class="card" style="left:900px;top:150px;width:460px;height:180px"></div>
  <div class="card" style="left:900px;top:350px;width:460px;height:180px"></div>
  <div class="card" style="left:900px;top:550px;width:460px;height:180px"></div>
  <div style="position:absolute;left:928px;top:180px;width:40px;height:40px;background:#DBEAFE;border-radius:10px"></div>
  <div class="t3" style="left:984px;top:188px">Mapa interactivo</div>
  <div class="s" style="left:928px;top:240px;width:380px"></div>
  <div style="position:absolute;left:928px;top:380px;width:40px;height:40px;background:#DBEAFE;border-radius:10px"></div>
  <div class="t3" style="left:984px;top:388px">Audiogu&iacute;as</div>
  <div class="s" style="left:928px;top:440px;width:380px"></div>
  <div style="position:absolute;left:928px;top:580px;width:40px;height:40px;background:#DBEAFE;border-radius:10px"></div>
  <div class="t3" style="left:984px;top:588px">Esc&aacute;ner QR</div>
  <div class="s" style="left:928px;top:640px;width:380px"></div>
"""
sheet("canon.html", canon_css, canon_body, "Estandar de categoria")

print(json.dumps(sorted(os.listdir(BASE)), indent=1))
