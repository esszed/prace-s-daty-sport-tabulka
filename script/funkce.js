/* nastaveni cookies a refresh */
function set_cookie(){
  let date = new Date();
  date.setTime(date.getTime()+(86400*3));
  let expires = date.toGMTString();
  let trida = document.getElementById('trida_in');
  document.cookie = "vyber_trida="+trida.value+"; expires="+expires+"; path=/";
  location.reload();
}

/*global barvy */
window.chartColors = {
red: "#ff0000",                                 
orange: "#ffa500",                              
yellow: "#ffff00",                              
green: "#008000",                               
cyan: "#00ffff",                                
blue: "#4169e1",                               
purple: "#ff00ff",                             
grey: "#808080",                               
white: "#ffffff", 
black: "#000000" 
};

/**
* Zobrazovani a skryvani prvku.
* Uziti: Cteme ze sportovni tabulky  
*/ 
function show_hide(element){ 
var item = document.getElementById(element);
if(item.style.display == "none")
  item.style.display = "block";
else
  item.style.display = "none";  
}

/**
* drag and drop 
* Uziti: Doplnujeme sportovni tabulku
*/
/*
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  kontrola_drop(data,ev.target.className);
  
}
drag and drop konec */ 


/**
* Pomocna funkce pro generovani cisel.
* Uziti: Sber papiru, adopce_zviratek 
*/
function in_array(item, array){
  for(var i in array) {
      if(array[i] == item) return true;
  }
  return false;
}

/**
* generovani cisel do pole 
* Uziti: Sber papiru, adopce_zviratek 
*/
function vytvor_pole(pocet,min,max,repeat){
if(repeat === undefined)
  repeat = true;
var count = 0;
var pole = new Array(pocet);
while(count<pocet){
  var cislo = random_int(min,max);
  if(!repeat && count > 0 && in_array(cislo,pole))
    continue;      
  else{
    pole[count] = cislo;
    count++;
  }    
}
return pole;      
}
/**
* Vklada data z pole do cilovych elementu (bunka tabulky)
* Rozsah pole a pocet bunek musi byt stejny!  
* Uziti: Sber papiru, adopce_zviratek 
*/
function vypln_bunky(pole, rows){
var table = document.getElementsByClassName(rows);
for(var i = 0; i< table.length; i++){
  table[i].innerHTML = "";
  table[i].appendChild(document.createTextNode(pole[i])); 
}
}

/**
* Pomocna fukce pro generovani cisel
* Uziti: Sber papiru, adopce_zviratek 
* Pro male rozdily, napr: (5,6) to vraci spatne udaje (vetsi jak max) -> pridan if 
*/ 
function random_int(min,max){
var number = Math.round(Math.random() * max) + min;
if(number > max) 
  number = max;
return number;
}

/**
* Vytvoří procenta pro číselné hodnoty
* Uziti: Sber papiru 
*/ 
function procenta(pole_hodnot,rad){
var suma = 0;
var procenta = new Array(pole_hodnot.length)
for(var i in pole_hodnot)
  suma=suma+pole_hodnot[i];
  
var procento = suma / 100;  
for(var x in pole_hodnot){
  procenta[x] = Math.round((pole_hodnot[x]/procento)*Math.pow(10,rad))/Math.pow(10,rad);  
}           
   
return procenta;  
}

/**
* Zobrazovani a skryvani zalozek, oznaceni aktivni zalozky
* zalozka - string zalozky, co se zobrazi
* tab - int zalozky, ktera se oznaci jako aktivni 
* Uziti: Sber papiru     
*/ 
function zobraz_tab(zalozka,tab){
    
var x = document.getElementsByClassName("tabs");
for (var i = 0; i < x.length; i++) {
    if(zalozka != 'all'){
      x[i].classList.remove("w3-show");
      x[i].classList.add("w3-hide");   
    }else 
      x[i].classList.remove("w3-hide");      
}
if(zalozka != 'all')
  document.getElementById(zalozka).classList.remove("w3-hide");
  
var zalozky = document.getElementsByClassName("w3-bar-item"); 
for (var i = 0; i < zalozky.length; i++) {
    if(i==tab)
      zalozky[i].classList.add("active");  
    else
      zalozky[i].classList.remove("active");     
}
  
} 


/* modalni okna */
function show_modal(element){
element.style.display='block';
}

function close_modal(element){
element.style.display='none';
}    

function print_modal(element,trida,text=null){
  modal = document.getElementById(element);
  modal.innerHTML = "";
  var obal = document.createElement("div");
  obal.classList.add("w3-modal-content", "w3-animate-zoom", "w3-card-4",trida);
  //var header = document.createElement("header");
  //header.classList.add("w3-container");
  var zavreni = document.createElement("span");
  zavreni.classList.add("w3-button", "w3-display-topright", "modal-close");
  zavreni.addEventListener("click", function(){
    close_modal(modal)         
  });
  zavreni.innerHTML = "&times;";
      
  var datik = document.createElement("img");
  datik.alt="hodnoceni";
  
  var hlaska = document.createElement("h6");
  switch(trida){
    case "chyba": 
      datik.src= "image/vys_nok.png";
      if(text==null)
        text = random_string(1);  
    break;
    case "ok": 
      datik.src= "image/vys_ok.png";
      if(text==null)
        text = random_string(2);  
    break;
    case "neutr": 
      datik.src= "image/vys_neu.png";
    break;
  }       
 
  //obal.appendChild(header); 
      
  var obsah = document.createElement("div");
  obsah.appendChild(zavreni);
  
  let text_o = document.createElement("p");
  text_o.innerHTML = text;
  obsah.classList.add("w3-container");
  //obsah.innerHTML = "<p>"+text+"</p>";
  
  obsah.appendChild(datik);
  obsah.appendChild(text_o);
  obal.appendChild(obsah);
  modal.appendChild(obal);
  show_modal(modal);
}

/////////////////
//vraci string podle daneho parametru 1(NOK), 2(OK)
/////////////////
function random_string(typ){
let int_r = Math.floor(Math.random() * 6);
let ok_string = ["Sám bych to neudělal lépe!","Přesně takhle to má být!","Jo, to je správné řešení!","Dobře ty!","Uhodil jsi hřebíček na hlavičku!","Zvládl jsi to bezvadně!"];
let nok_string = ["Něco mi na tom nesedí.","Ne, to nebude správně.","Zkus to ještě jednou.","Tohle nebude správné řešení.","Takhle to být nemá.","Nope, takhle to nemá být."];
if(typ == 1){
  return nok_string[int_r];
}else{
  return ok_string[int_r];
}   
}

/* modalni okna konec */