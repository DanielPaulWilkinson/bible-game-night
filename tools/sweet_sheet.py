import json,urllib.request,urllib.parse,sys,re,os
from PIL import Image,ImageDraw
api="https://commons.wikimedia.org/w/api.php";H={"User-Agent":"GrokBot/1.0 (dpw.developer@gmail.com)"}
files=[l.strip() for l in open("sweet.txt") if l.startswith("File:")]
def get(u): return urllib.request.urlopen(urllib.request.Request(u,headers=H)).read()
def thumbs(titles):
    res={}
    for i in range(0,len(titles),40):
        p={"action":"query","titles":"|".join(titles[i:i+40]),"prop":"imageinfo","iiprop":"url","iiurlwidth":"240","format":"json"}
        r=json.loads(get(api+"?"+urllib.parse.urlencode(p)))
        n={x["to"]:x["from"] for x in r["query"].get("normalized",[])}
        for pg in r["query"]["pages"].values():
            res[pg["title"]]=pg["imageinfo"][0]["thumburl"]
    return res
name,pat=sys.argv[1],sys.argv[2]
def key(t):
    m=re.search(r"Chapter (\d+)-(\d+)",t); return (int(m.group(1)),int(m.group(2))) if m else (0,0)
sel=sorted([f for f in files if re.search(pat,f)],key=key)
tu=thumbs(sel); W,Hh=240,180; cols=6
sheet=Image.new("RGB",(cols*W,((len(sel)+cols-1)//cols)*(Hh+16)),"white"); d=ImageDraw.Draw(sheet)
idx=[]
for i,t in enumerate(sel):
    fn="thumbs/"+re.sub(r"\W","_",t)[:120]+".jpg"
    import time
    for a in range(4):
        try:
            if not os.path.exists(fn): open(fn,"wb").write(get(tu[t]))
            im=Image.open(fn).convert("RGB"); break
        except Exception:
            if os.path.exists(fn): os.remove(fn)
            time.sleep(5*(a+1))
    else: continue
    im.thumbnail((W,Hh))
    x,y=(i%cols)*W,(i//cols)*(Hh+16); sheet.paste(im,(x,y+16))
    c=re.search(r"Chapter ([\d-]+)",t).group(1); d.text((x+2,y+2),f"{i}: {c}",fill="red"); idx.append(t)
sheet.save(f"sheets/{name}.jpg",quality=70); json.dump(idx,open(f"sheets/{name}.json","w"))
print(name,len(sel))
