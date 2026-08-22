(function(){
  function escText(v){ return String(v == null ? "" : v); }
  function apply(s){
    if(!s)return;
    var name=s.shopName||"La boutique", parts=name.split(/\s+/), logo=document.querySelector(".pnav .logo");
    var titleParts=document.title.split("—");
    if(titleParts.length>1)document.title=titleParts[0].trim()+" — "+name;
    if(logo){
      logo.replaceChildren();
      if(s.logo){var im=document.createElement("img");im.src=s.logo;im.alt=name;im.className="page-store-logo";logo.appendChild(im);}
      else{logo.textContent=parts.shift()||name;if(parts.length){var sp=document.createElement("span");sp.textContent=parts.join(" ");logo.appendChild(sp);}}
    }
    document.querySelectorAll(".pfooter p").forEach(function(p){p.textContent="© "+new Date().getFullYear()+" "+name+". Tous droits réservés.";});
    var l=s.legal||{}, seller=document.getElementById("sellerIdentity");
    if(seller){
      seller.replaceChildren();
      ["Dénomination : "+escText(name),"Forme juridique : "+escText(l.forme||"À compléter"),"Siège social : "+escText(l.adresse||s.address||"À compléter"),"Registre du commerce (RCCM) : "+escText(l.rccm||"À compléter"),"Numéro d'identification fiscale (NIF) : "+escText(l.nif||"À compléter"),"Contact : WhatsApp "+escText(s.whatsapp||"")+" — "+escText(l.email||"À compléter")].forEach(function(line,i){if(i)seller.appendChild(document.createElement("br"));seller.appendChild(document.createTextNode(line));});
    }
    /* L'avertissement des CGV disparaît dès que les mentions obligatoires
       sont renseignées : laissé visible, il annonce au client que le
       document qu'il est en train d'accepter n'est pas terminé. */
    var sellerNote=document.getElementById("sellerCompletionNote");
    if(sellerNote)sellerNote.hidden=!!(l.forme&&(l.adresse||s.address)&&l.rccm&&l.nif&&l.email);
    var privacy=document.getElementById("privacyIdentity");
    if(privacy)privacy.textContent=name+", "+escText(l.adresse||s.address||"adresse à compléter")+", Bamako, Mali. Contact : WhatsApp "+escText(s.whatsapp||"à compléter")+" — "+escText(l.email||"adresse e-mail à compléter")+".";
    var privacyNote=document.getElementById("privacyCompletionNote");
    if(privacyNote)privacyNote.hidden=!!((l.adresse||s.address)&&l.email&&s.whatsapp);
    var size=document.getElementById("merchantSizeAdvice");if(size&&s.sizeGuideText){size.textContent=s.sizeGuideText;size.closest(".note").hidden=false;}
  }
  function showPreviewBar(){
    var bar=document.createElement("div");bar.className="preview-bar";bar.setAttribute("role","status");
    var local=location.hostname==="127.0.0.1"||location.hostname==="localhost";
    bar.innerHTML='<span>APERÇU — les clients ne voient pas encore ces changements</span><a href="admin.html'+(local?'?demo=1':'')+'">Retour au dashboard</a>';
    document.body.insertBefore(bar,document.body.firstChild);
    bar.querySelector("a").addEventListener("click",function(){try{sessionStorage.removeItem("aura_preview_active");sessionStorage.removeItem("aura_preview_store");}catch(e){}});
  }
  var preview=false;
  try{
    preview=sessionStorage.getItem("aura_preview_active")==="1";
    if(preview){var draft=JSON.parse(sessionStorage.getItem("aura_preview_store")||"null");if(draft&&draft.settings){apply(draft.settings);showPreviewBar();return;}}
  }catch(e){}
  try{var local=JSON.parse(localStorage.getItem("aura_store_v9")||"null");if(local)apply(local.settings);}catch(e){}
  if(window.AURA_DB&&window.AURA_DB.ready())window.AURA_DB.loadSettings(function(er,s){if(!er&&s)apply(s);});
})();
