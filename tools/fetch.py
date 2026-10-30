import json,urllib.request,urllib.parse,re,io,os,time
from PIL import Image
UA={'User-Agent':'BibleGuessWho/0.1 (dpw.developer@gmail.com)'}
P=[('noah','Tissot The Dove Returns to Noah.jpg'),('abraham','Tissot The Caravan of Abraham.jpg'),('sarah','Tissot Sarah Hears and Laughs.gif'),
('joseph','Tissot Joseph Reveals His Dream to His Brethren.jpg'),('moses','Moses Speaks to Pharaoh, by James Tissot.jpg'),
('miriam',"Tissot Drawing 134 The songs of joy (Exodus 15;20) for Brunoff 126 Les chants d'allégresse.jpg"),
('deborah','Tissot Deborah Beneath the Palm Tree.jpg'),('ruth','Tissot Drawing 241 Ruth gleaning Ruth 2 7 for Brunoff 229 Ruth glanant.jpg'),
('hannah','~Tissot Drawing 245 The high priest and Hannah'),('david','~Tissot Drawing 266 Goliath addresses David'),
('solomon','Tissot The Wisdom of Solomon.jpg'),('elijah','Tissot Elijah.jpg'),('esther','~Tissot Drawing 362 Esther presented'),
('daniel',"Tissot Daniel in the Lion's Den.jpg"),('jonah','Tissot Jonah.jpg'),('mary','TissotAnnunciation.JPG'),
('john-baptist','~Brooklyn Museum - The Voice in the Desert'),('peter','Brooklyn Museum - Saint Peter (Saint Pierre) - James Tissot.jpg'),
('matthew','Brooklyn Museum - Saint Matthew (Saint Mathieu) - James Tissot - overall.jpg'),('zacchaeus','~Brooklyn Museum - Zacchaeus in the Sycamore'),
('martha','Brooklyn Museum - Martha (Marthe) - James Tissot.jpg'),('mary-magdalene','~Brooklyn Museum - Mary Magdalene Questions the Angels'),
('paul','Brooklyn Museum - Saint Paul - James Tissot - overall.jpg'),('thomas','Brooklyn Museum - Saint Thomas - James Tissot.jpg')]
def api(**p):
    p.update(action='query',format='json')
    return json.load(urllib.request.urlopen(urllib.request.Request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(p),headers=UA)))
strip=lambda s:re.sub(r'\s+',' ',re.sub('<[^>]+>','',s)).strip()
os.makedirs('../public/figures',exist_ok=True); credits={}
for k,t in P:
    if t.startswith('~'):
        d=api(list='search',srsearch='intitle:"'+t[1:]+'"',srnamespace=6,srlimit=3); t=d['query']['search'][0]['title'][5:]
    d=api(titles='File:'+t,prop='imageinfo',iiprop='url|extmetadata',iiurlwidth=640)
    pg=list(d['query']['pages'].values())[0]; ii=pg['imageinfo'][0]; m=ii['extmetadata']
    g=lambda x:strip(m.get(x,{}).get('value',''))
    img=Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(ii['thumburl'],headers=UA)).read())).convert('RGB')
    img.thumbnail((480,480)); img.save(f'../public/figures/{k}.webp','WEBP',quality=72,method=6)
    credits[k]=dict(file=pg['title'],source=ii['descriptionurl'],licence=g('LicenseShortName'),artist=g('Artist')[:120],date=g('DateTimeOriginal')[:40],credit=g('Credit')[:160])
    print(k,credits[k]['licence'],'|',credits[k]['artist'][:40],'|',pg['title'][:70],img.size,os.path.getsize(f'../public/figures/{k}.webp')); time.sleep(0.5)
json.dump(credits,open('credits.json','w'),indent=1,ensure_ascii=False)
