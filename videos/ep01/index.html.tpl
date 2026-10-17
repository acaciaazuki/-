<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Episode 01 分鏡預覽｜什麼是失智症？</title>
<style>
  :root{color-scheme:light;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif}
  body{margin:0;background:#eef3fb;color:#183153;display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px}
  #stage{position:relative;width:min(360px,90vw);aspect-ratio:9/16;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(48,66,106,.2);transition:background .4s}
  #card{position:absolute;left:5%;right:5%;top:10%;background:rgba(255,255,255,.92);border-radius:22px;padding:6% 5%;text-align:center;animation:rise .5s ease}
  @keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  #icon{font-size:48px}#title{font-size:24px;font-weight:800;margin:6px 0}
  #kw{display:inline-block;background:#2f80ed;color:#fff;border-radius:99px;padding:4px 14px;font-weight:700;animation:pop .6s ease}
  @keyframes pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
  #points{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:6px}
  #points li{background:#f0f7ff;border-radius:12px;padding:6px;font-weight:600;font-size:14px}
  #cap{position:absolute;left:4%;right:4%;bottom:6%;background:rgba(40,50,70,.88);color:#fff;border-radius:14px;padding:10px;font-size:16px;font-weight:700;text-align:center}
  #bar{width:min(360px,90vw)}#seek{width:100%}
  .row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
  button{font:inherit;padding:8px 14px;border-radius:10px;border:0;background:#2f80ed;color:#fff;cursor:pointer}
  button.alt{background:#fff;color:#183153;border:1px solid #c5d3ea}button.alt[aria-pressed=true]{background:#183153;color:#fff}
  #meta{font-size:13px;max-width:360px;line-height:1.5}
  #notes{max-width:360px;font-size:13px;background:#fff;border-radius:12px;padding:10px}
  footer{max-width:360px;font-size:12px;color:#51607a;line-height:1.5}
</style>
</head>
<body>
<h1 style="font-size:18px;margin:0" id="h"></h1>
<div id="stage" role="img" aria-label="分鏡預覽畫面"><div id="card"><div id="icon"></div><div id="title"></div><div id="kw"></div><ul id="points"></ul></div><div id="cap" aria-live="polite"></div></div>
<div id="bar"><input id="seek" type="range" min="0" max="60" step="0.1" value="0" aria-label="時間軸"><div id="time" style="text-align:center;font-size:13px">0.0 / 60.0 秒</div></div>
<div class="row">
  <button id="play">播放</button><button id="pause">暫停</button><button id="replay">重播</button>
  <button id="prev" class="alt">上一場景</button><button id="next" class="alt">下一場景</button>
  <button id="speak" class="alt" aria-pressed="false">朗讀旁白（瀏覽器語音）</button>
</div>
<div class="row" id="scenes" aria-label="場景切換"></div>
<div id="notes"></div>
<footer id="disc"></footer>
<script id="ep-data" type="application/json">__SCRIPT_JSON__</script>
<script>
(function(){
  var D=JSON.parse(document.getElementById('ep-data').textContent),S=D.scenes,T=D.meta.video.durationSeconds;
  var colors=['#dff5ff','#ecf3ff','#f3eeff','#e8f8f1','#fff4e3','#ffecef','#eaf5ff','#fff9db'];
  var $=function(i){return document.getElementById(i)};
  var t=0,playing=false,last=0,cur=-1,speak=false;
  $('h').textContent='Episode 01｜'+D.meta.title;
  $('disc').textContent=D.meta.disclaimer+' '+D.meta.copyright;
  function idx(x){for(var i=0;i<S.length;i++)if(x>=S[i].startSec&&x<S[i].endSec)return i;return S.length-1}
  function show(i){
    if(i===cur)return;cur=i;var s=S[i];
    $('stage').style.background=colors[i%colors.length];
    $('icon').textContent=s.icon;$('title').textContent=s.title;$('kw').textContent=s.keywords[0];
    $('points').innerHTML='';s.points.forEach(function(p){var l=document.createElement('li');l.textContent=p;$('points').appendChild(l)});
    $('cap').textContent=s.subtitle;
    $('notes').innerHTML='';[['旁白',s.narration],['畫面',s.visual],['轉場',s.transition]].forEach(function(r){var p=document.createElement('p');p.style.margin='4px 0';p.textContent=r[0]+'：'+r[1];$('notes').appendChild(p)});
    [].forEach.call(document.querySelectorAll('#scenes button'),function(b,j){b.setAttribute('aria-pressed',j===i)});
    var c=$('card');c.style.animation='none';void c.offsetWidth;c.style.animation='';
    if(speak&&playing&&window.speechSynthesis){speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(s.narration);u.lang='zh-TW';speechSynthesis.speak(u)}
  }
  function render(){show(idx(t));$('seek').value=t;$('time').textContent=t.toFixed(1)+' / '+T.toFixed(1)+' 秒'}
  function tick(n){if(!playing)return;t+=(n-last)/1000;last=n;if(t>=T){t=T-0.001;playing=false;render();return}render();requestAnimationFrame(tick)}
  function play(){if(t>=T-0.01)t=0;playing=true;cur=-1;last=performance.now();requestAnimationFrame(tick)}
  function pause(){playing=false;if(window.speechSynthesis)speechSynthesis.cancel()}
  function seek(x){t=Math.max(0,Math.min(T-0.001,x));render()}
  S.forEach(function(s,i){var b=document.createElement('button');b.className='alt';b.textContent=s.id.toUpperCase();b.title=s.title;b.setAttribute('aria-pressed','false');b.onclick=function(){seek(s.startSec)};$('scenes').appendChild(b)});
  $('play').onclick=play;$('pause').onclick=pause;
  $('replay').onclick=function(){t=0;cur=-1;play()};
  $('prev').onclick=function(){seek(S[Math.max(0,idx(t)-1)].startSec)};
  $('next').onclick=function(){seek(S[Math.min(S.length-1,idx(t)+1)].startSec)};
  $('seek').oninput=function(e){seek(parseFloat(e.target.value))};
  $('speak').onclick=function(e){speak=!speak;e.target.setAttribute('aria-pressed',speak)};
  render();
})();
</script>
</body>
</html>
