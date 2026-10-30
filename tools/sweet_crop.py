import json,urllib.request,urllib.parse,os,time
from PIL import Image,ImageDraw
H={"User-Agent":"GrokBot/1.0 (dpw.developer@gmail.com)"};api="https://commons.wikimedia.org/w/api.php"
P=json.load(open("picks.json")); out={}
os.makedirs("full",exist_ok=True); os.makedirs("/workspace/bible-guess-who/public/figures",exist_ok=True)
for fid,(sh,i,cx,cy,h) in P.items():
    t=json.load(open(f"sheets/{sh}.json"))[i]; fn="full/"+fid+".jpg"
    q={"action":"query","titles":t,"prop":"imageinfo","iiprop":"url","iiurlwidth":"1024","format":"json"}
    info=list(json.load(urllib.request.urlopen(urllib.request.Request(api+"?"+urllib.parse.urlencode(q),headers=H)))["query"]["pages"].values())[0]["imageinfo"][0]
    if not os.path.exists(fn):
        for a in range(4):
            try: open(fn,"wb").write(urllib.request.urlopen(urllib.request.Request(info["thumburl"],headers=H)).read()); Image.open(fn); break
            except Exception: time.sleep(5)
    im=Image.open(fn).convert("RGB"); W,Hh=im.size
    ch=h*Hh; cw=ch*0.75
    if cw>W: cw=W; ch=cw/0.75
    x=min(max(cx*W-cw/2,0),W-cw); y=min(max(cy*Hh-ch/2,0),Hh-ch)
    c=im.crop((int(x),int(y),int(x+cw),int(y+ch))).resize((240,320),Image.LANCZOS)
    c.save(f"/workspace/bible-guess-who/public/figures/{fid}.webp","WEBP",quality=78,method=6)
    out[fid]={"file":t,"source":info["descriptionurl"]}
json.dump(out,open("cropsrc.json","w"),indent=1)
ids=list(P); s=Image.new("RGB",(8*240,3*340),"white"); d=ImageDraw.Draw(s)
for k,f in enumerate(ids):
    s.paste(Image.open(f"/workspace/bible-guess-who/public/figures/{f}.webp"),((k%8)*240,(k//8)*340+20)); d.text(((k%8)*240+4,(k//8)*340+4),f,fill="red")
s.save("sheets/_crops.jpg",quality=75)
