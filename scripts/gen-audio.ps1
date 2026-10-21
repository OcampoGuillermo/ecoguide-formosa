# Genera las pistas de audioguia con las voces de Windows (SAPI) y las deja en MP3.
#   powershell -File scripts\gen-audio.ps1
param(
  [string]$Plan = ".impeccable\audio-plan.json",
  [string]$OutDir = "public\media\audio"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Speech

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
$tmp = Join-Path $env:TEMP "ecoguide-tts"
if (-not (Test-Path $tmp)) { New-Item -ItemType Directory -Path $tmp | Out-Null }

$voiceByLang = @{
  "ES" = "Microsoft Helena Desktop"
  "GN" = "Microsoft Helena Desktop"   # no hay voz guarani instalada: se usa la espanola como demo
  "EN" = "Microsoft Zira Desktop"
}

$items = Get-Content $Plan -Raw | ConvertFrom-Json
$made = 0

foreach ($item in $items) {
  $wav = Join-Path $tmp "$($item.slug)-$($item.language).wav"
  $mp3 = Join-Path $OutDir "$($item.slug)-$($item.language).mp3"

  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice($voiceByLang[$item.language])
  $synth.Rate = -1
  $synth.Volume = 100
  # El texto lleva saltos de linea: SAPI los lee como pausas.
  $synth.SetOutputToWaveFile($wav)
  $synth.Speak([string]$item.script)
  $synth.SetOutputToNull()
  $synth.Dispose()

  & ffmpeg -hide_banner -loglevel error -y -i $wav -codec:a libmp3lame -q:a 4 -ar 44100 -ac 1 $mp3
  if ($LASTEXITCODE -ne 0) { Write-Error "ffmpeg fallo en $mp3"; continue }
  $made++
  Write-Host ("[{0}/{1}] {2} ({3})" -f $made, $items.Count, $item.slug, $item.language)
}

Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "pistas generadas: $made"
