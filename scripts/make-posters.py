import os, subprocess, glob
out = os.path.join(os.getcwd(), "public", "media", "video")
for mp4 in sorted(glob.glob(os.path.join(out, "*.mp4"))):
    jpg = mp4[:-4] + ".jpg"
    # A los 3.2 s la lamina ya esta impresa entera: ese es el poster.
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss","3.2","-i",mp4,"-vframes","1","-q:v","3",jpg], check=True)
    print(os.path.basename(jpg), os.path.getsize(jpg))
