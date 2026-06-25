/* Jurix — cookie consent banner + preferences.
   Self-contained: injects its own styles, persists choice in localStorage.
   Reopen the preferences dialog anywhere via window.jurixCookiePrefs(). */
(function(){
  "use strict";
  var KEY = "jurix_cookie_consent_v1";
  var CATS = [
    { id:"essential",  name:"Essential",  desc:"Required for sign-in, security and core functionality.", locked:true },
    { id:"functional", name:"Functional", desc:"Remember preferences such as language and saved filters." },
    { id:"analytics",  name:"Analytics",  desc:"Help us understand usage so we can improve the platform." },
    { id:"marketing",  name:"Marketing",  desc:"Measure the effectiveness of our campaigns." }
  ];

  function read(){
    try { return JSON.parse(localStorage.getItem(KEY)); } catch(e){ return null; }
  }
  function write(prefs){
    prefs.ts = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch(e){}
  }

  var css = ""
  + ".jcc-bar{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#171819;color:#D7D5D1;"
  + "padding:18px 22px;display:flex;gap:18px 26px;align-items:center;justify-content:center;flex-wrap:wrap;"
  + "box-shadow:0 -8px 30px rgba(0,0,0,.28);font-family:'Albert Sans',system-ui,sans-serif;}"
  + ".jcc-bar p{margin:0;font-size:13px;line-height:1.55;max-width:640px;color:#B7B5B1;}"
  + ".jcc-bar a{color:#E2B85F;text-decoration:underline;text-underline-offset:2px;}"
  + ".jcc-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}"
  + ".jcc-btn{font:inherit;font-size:13px;font-weight:600;cursor:pointer;border-radius:999px;padding:10px 18px;border:1px solid transparent;transition:background .2s,border-color .2s,color .2s;}"
  + ".jcc-btn.primary{background:linear-gradient(92deg,#C89541,#8D621A);color:#fff;}"
  + ".jcc-btn.primary:hover{filter:brightness(1.06);}"
  + ".jcc-btn.ghost{background:transparent;color:#D7D5D1;border-color:#3a3c3e;}"
  + ".jcc-btn.ghost:hover{border-color:#6a6c6e;color:#fff;}"
  + ".jcc-overlay{position:fixed;inset:0;z-index:100000;background:rgba(10,10,12,.55);display:flex;align-items:center;justify-content:center;padding:22px;}"
  + ".jcc-modal{background:#fff;color:#1B1815;max-width:460px;width:100%;border-radius:18px;padding:28px;box-shadow:0 30px 80px rgba(0,0,0,.35);font-family:'Albert Sans',system-ui,sans-serif;max-height:88vh;overflow:auto;}"
  + ".jcc-modal h3{margin:0 0 6px;font-family:'Playfair Display',Georgia,serif;font-size:22px;}"
  + ".jcc-modal .lede{margin:0 0 18px;font-size:13.5px;color:#5b574f;line-height:1.55;}"
  + ".jcc-row{display:flex;justify-content:space-between;gap:14px;padding:14px 0;border-top:1px solid #ece8e1;}"
  + ".jcc-row h4{margin:0 0 3px;font-size:14px;}"
  + ".jcc-row p{margin:0;font-size:12.5px;color:#6b665e;line-height:1.5;}"
  + ".jcc-sw{position:relative;flex:0 0 auto;width:42px;height:24px;}"
  + ".jcc-sw input{opacity:0;width:0;height:0;position:absolute;}"
  + ".jcc-track{position:absolute;inset:0;background:#d6d1c8;border-radius:999px;transition:background .2s;cursor:pointer;}"
  + ".jcc-track:before{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.25);}"
  + ".jcc-sw input:checked + .jcc-track{background:#9A6A23;}"
  + ".jcc-sw input:checked + .jcc-track:before{transform:translateX(18px);}"
  + ".jcc-sw input:disabled + .jcc-track{opacity:.55;cursor:not-allowed;}"
  + ".jcc-modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:22px;flex-wrap:wrap;}"
  + "@media(max-width:640px){.jcc-bar{justify-content:flex-start;}.jcc-actions{width:100%;}.jcc-btn{flex:1;text-align:center;}}";

  function injectCss(){
    if(document.getElementById("jcc-style")) return;
    var s=document.createElement("style"); s.id="jcc-style"; s.textContent=css;
    document.head.appendChild(s);
  }

  function el(tag, cls, html){
    var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e;
  }

  function removeBar(){ var b=document.getElementById("jcc-bar"); if(b) b.remove(); }

  function acceptAll(){
    write({essential:true,functional:true,analytics:true,marketing:true,choice:"accept_all"});
    removeBar();
  }
  function rejectNonEssential(){
    write({essential:true,functional:false,analytics:false,marketing:false,choice:"reject"});
    removeBar();
  }

  function showBanner(){
    if(document.getElementById("jcc-bar")) return;
    var bar=el("div","jcc-bar"); bar.id="jcc-bar";
    bar.appendChild(el("p", null,
      "We use cookies to run Jurix, remember your preferences and understand usage. Essential cookies are always on. You can accept all, reject non-essential, or choose what to allow. See our <a href=\"/Cookies\">Cookie Policy</a>."));
    var actions=el("div","jcc-actions");
    var prefBtn=el("button","jcc-btn ghost","Preferences");
    var rejBtn=el("button","jcc-btn ghost","Reject non-essential");
    var accBtn=el("button","jcc-btn primary","Accept all");
    prefBtn.addEventListener("click", openPrefs);
    rejBtn.addEventListener("click", rejectNonEssential);
    accBtn.addEventListener("click", acceptAll);
    actions.appendChild(prefBtn); actions.appendChild(rejBtn); actions.appendChild(accBtn);
    bar.appendChild(actions);
    document.body.appendChild(bar);
  }

  function openPrefs(){
    injectCss();
    var saved=read()||{};
    var overlay=el("div","jcc-overlay");
    var modal=el("div","jcc-modal");
    modal.appendChild(el("h3",null,"Cookie preferences"));
    modal.appendChild(el("p","lede","Choose which cookies Jurix may use. Essential cookies are always active because the platform cannot function without them."));
    var inputs={};
    CATS.forEach(function(c){
      var row=el("div","jcc-row");
      var txt=el("div",null,"<h4>"+c.name+"</h4><p>"+c.desc+"</p>");
      var sw=el("label","jcc-sw");
      var inp=document.createElement("input"); inp.type="checkbox";
      inp.checked = c.locked ? true : (saved[c.id]===true);
      if(c.locked) inp.disabled=true;
      inputs[c.id]=inp;
      sw.appendChild(inp); sw.appendChild(el("span","jcc-track"));
      row.appendChild(txt); row.appendChild(sw);
      modal.appendChild(row);
    });
    var acts=el("div","jcc-modal-actions");
    var cancel=el("button","jcc-btn ghost","Cancel");
    var save=el("button","jcc-btn primary","Save choices");
    cancel.addEventListener("click", function(){ overlay.remove(); });
    save.addEventListener("click", function(){
      write({
        essential:true,
        functional:inputs.functional.checked,
        analytics:inputs.analytics.checked,
        marketing:inputs.marketing.checked,
        choice:"custom"
      });
      overlay.remove(); removeBar();
    });
    acts.appendChild(cancel); acts.appendChild(save);
    modal.appendChild(acts);
    overlay.appendChild(modal);
    overlay.addEventListener("click", function(e){ if(e.target===overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  // public: reopen preferences from a link/button anywhere
  window.jurixCookiePrefs = openPrefs;

  function init(){
    injectCss();
    if(!read()) showBanner();
    // wire any element with data-cookie-prefs to reopen the dialog
    document.querySelectorAll("[data-cookie-prefs]").forEach(function(b){
      b.addEventListener("click", function(e){ e.preventDefault(); openPrefs(); });
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
