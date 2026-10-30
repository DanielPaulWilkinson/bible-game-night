import json,sys,urllib.request,urllib.parse
UA={'User-Agent':'BibleGuessWho/0.1 (dpw.developer@gmail.com)'}
def q(s,n=6):
    p=dict(action='query',format='json',generator='search',gsrsearch=s+' filetype:bitmap',gsrnamespace=6,gsrlimit=n,prop='imageinfo',iiprop='url|extmetadata|size',iiurlwidth=360)
    u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(p)
    d=json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA)))
    out=[]
    for pg in sorted(d.get('query',{}).get('pages',{}).values(),key=lambda x:x.get('index',0)):
        ii=pg['imageinfo'][0];m=ii['extmetadata']
        g=lambda k:m.get(k,{}).get('value','')
        out.append(dict(title=pg['title'],lic=g('LicenseShortName'),artist=g('Artist')[:80],date=g('DateTimeOriginal')[:30],thumb=ii.get('thumburl'),page=ii['descriptionurl'],w=ii['width'],h=ii['height']))
    return out
if __name__=='__main__':
    for s in sys.argv[1:]:
        print('##',s)
        for r in q(s): print(' ',r['lic'],'|',r['title'],'|',r['artist'][:50],'|',r['w'],r['h'])
