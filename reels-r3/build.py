import json, os, sys, subprocess, importlib.util, numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
H=os.path.dirname(os.path.abspath(__file__)); IG=H+'/../ig'
sys.path.insert(0,H); from lines import R, ORDER
SR=48000
CONF={
 'C1':dict(cap='cn',foot=IG+'/px/w2r1',ex=False,key=0,gap=.32),
 'C2':dict(cap='cn',ex=False,key=1,gap=.30),
 'C3':dict(cap='cn',ex=False,key=2,gap=.55,music=False),
 'K1':dict(cap='kr',foot=IG+'/px/w2r2',foot2=IG+'/px/w3r1',ex=False,key=3,gap=.30),
 'K2':dict(cap='kr',ex=False,key=0,gap=.34),
 'K3':dict(cap='kr',ex=True,key=1,gap=.28),
 'P1':dict(cap='pl',ex=True,key=2,gap=.36),
 'P2':dict(cap='pl',ex=True,key=3,gap=.32),
 'P3':dict(cap='pl',foot=IG+'/px/w4r2',ex=True,key=0,gap=.32),
}
def voice_files():
    d=H+'/vo'; fs=sorted(f for f in os.listdir(d) if f.endswith('.wav')) if os.path.isdir(d) else []
    return [os.path.join(d,f) for f in fs]
def load(p):
    sr,x=wavfile.read(p); x=x.astype(np.float32)
    if x.ndim>1: x=x.mean(1)
    if np.abs(x).max()>2: x/=32768
    if sr!=SR: x=resample_poly(x,SR,sr)
    a=np.where(np.abs(x)>.012)[0]; return x[max(0,a[0]-300):a[-1]+2400]
def build(name,mode=''):
    c=CONF[name]; lines=R[name]
    vf=voice_files(); idx=sum(len(R[k]) for k in ORDER[:ORDER.index(name)])
    clips=[load(vf[idx+i]) for i in range(len(lines))] if len(vf)>=49 else None
    t=.3; L=[]
    for i,(tts,cap) in enumerate(lines):
        d=len(clips[i])/SR if clips else max(.9,len(tts)*.14)
        L.append(dict(a=round(t,3),b=round(t+d,3),tts=tts,cap=cap)); t+=d+c['gap']
    dur=round(L[-1]['b']+1.5,2)
    spec=dict(name=name,dur=dur,L=L,capStyle=c['cap'],example=c['ex'])
    for k in ('foot','foot2'):
        if k in c: spec[k]=os.path.relpath(c[k],H); spec[k.replace('foot','footmax')]=len(os.listdir(c[k]))
    open(H+'/spec.js','w').write('window.SPEC='+json.dumps(spec,ensure_ascii=False)+';')
    subprocess.run(f'cd {H} && node rv.js {name} {dur} {mode}',shell=True,check=True)
    if mode: return
    n=int(dur*SR); v=np.zeros(n)
    for l,cp in zip(L,clips):
        i=int(l['a']*SR); v[i:i+len(cp)]+=cp[:n-i]
    v=v/np.abs(v).max()*.95
    mix=v
    if c.get('music',True):
        spec_=importlib.util.spec_from_file_location('g',IG+'/groove_lib.py'); g=importlib.util.module_from_spec(spec_)
        sys.path.insert(0,IG); spec_.loader.exec_module(g); g.SR=44100
        tr=[L[1]['a'],L[len(L)//2]['a']]
        g.make(dur,tr,L[-1]['a'],c['key'],f'/tmp/m3_{name}.wav')
        sr,m=wavfile.read(f'/tmp/m3_{name}.wav'); m=m[:,0].astype(np.float32)/32768; m=resample_poly(m,SR,sr)
        m=np.pad(m,(0,max(0,n-len(m))))[:n]
        env=np.convolve(np.abs(v),np.ones(2400)/2400,'same'); act=np.clip(env/(env.max()*.15),0,1)
        duck=1-.6*np.convolve(act,np.ones(7200)/7200,'same'); mix=v+m*.2*duck
    mix/=np.abs(mix).max()*1.05
    wavfile.write(f'/tmp/a3_{name}.wav',SR,(np.stack([mix,mix],1)*32767).astype(np.int16))
    os.makedirs(H+'/mp4',exist_ok=True)
    subprocess.run(f'cd {H} && ffmpeg -y -loglevel error -framerate 30 -i out/{name}/f%04d.jpg -i /tmp/a3_{name}.wav -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -af "loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000" -ar 48000 -movflags +faststart -shortest mp4/{name}.mp4',shell=True,check=True)
    print(name,dur)
if __name__=='__main__':
    for n in sys.argv[1].split(','): build(n,sys.argv[2] if len(sys.argv)>2 else '')
