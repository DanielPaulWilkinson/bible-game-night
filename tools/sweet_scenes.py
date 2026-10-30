# Download Sweet Publishing story scenes (CC BY-SA 3.0) as 480px WebP. Run from /workspace.
import json,urllib.request,urllib.parse,os,time
from PIL import Image
H={"User-Agent":"GrokBot/1.0 (dpw.developer@gmail.com)"};api="https://commons.wikimedia.org/w/api.php"
S={"noah":[("noah",7),("noah",9),("noah",15),("noah",21),("noah",29)],
"jonah":[("jonah",1),("jonah",2),("jonah",5),("jonah",7),("jonah",10)],
"joseph":[("joseph",2),("joseph",13),("joseph",20),("joseph",33)]}
out={}; D="/workspace/bible-guess-who/public/scenes"; os.makedirs(D,exist_ok=True); os.makedirs("full",exist_ok=True)
for story,lst in S.items():
  for n,(sh,i) in enumerate(lst):
    t=json.load(open(f"sheets/{sh}.json"))[i]; fid=f"{story}-{n+1}"; fn=f"full/scene-{fid}.jpg"
    q={"action":"query","titles":t,"prop":"imageinfo","iiprop":"url","iiurlwidth":"1024","format":"json"}
    info=list(json.load(urllib.request.urlopen(urllib.request.Request(api+"?"+urllib.parse.urlencode(q),headers=H)))["query"]["pages"].values())[0]["imageinfo"][0]
    for a in range(6):
      if os.path.exists(fn):
        try: Image.open(fn); break
        except Exception: pass
      try: open(fn,"wb").write(urllib.request.urlopen(urllib.request.Request(info["thumburl"],headers=H)).read())
      except Exception: pass
      time.sleep(4)
    im=Image.open(fn).convert("RGB"); im.thumbnail((480,480)); im.save(f"{D}/{fid}.webp","WEBP",quality=74,method=6)
    out[fid]={"file":t,"source":info["descriptionurl"]}
json.dump(out,open("/workspace/bible-guess-who/src/scenecredits.json","w"),indent=1)
