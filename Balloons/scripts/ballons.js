var folder = 'img/balloons/';
var rozszerzenie_pliku = '.png';
var szerokosc_balonow = 'px';
var eksplozja2 = 'img/animation/exp2.gif';
var ile_balonow = 10; // parametr skryptu
var tablica_balonow = [];
var szer_ekranu;
var wysokosc_ekranu;
var bujanieX = 30;
var zycie = 3;
var ilosc_punktow = 0;
var ile_punktow_wygrywa = 10;
var dodaj_balonik_interval;

// projekt tworzenia balona
var balon = function (_szer, _kolor, _predkoscX, _predkoscY, _x, _y) {
    this.id = 'balon' + randomNumber(0, 100000);
    this.szerokosc = _szer;
    this.predkoscX = _predkoscX;
    this.predkoscY = _predkoscY;
    this.obrazek = folder + _kolor + rozszerzenie_pliku;
    this.x = _x;
    this.y = _y;
    this.x_polozenie_bazowe = _x;
    this.czy_jest_w_DOM = true;

    //definicja metoda obiektu, kt�ra wykona jak�� akcje
    this.narysujBalon = function () {
        var match_field = document.querySelector('#match_field');
        var balon = document.createElement('img');
        balon.id = this.id;
        balon.style.width = this.szerokosc + szerokosc_balonow;
        balon.src = this.obrazek;
        balon.className = 'balonik';
        balon.style.bottom = this.y + szerokosc_balonow;
        balon.style.left = this.x + szerokosc_balonow;
        balon.addEventListener('click', obsluga_klikania);
        match_field.appendChild(balon);
    };

    this.ruchY = function () {
        if (this.czy_jest_w_DOM) {
            this.y += this.predkoscY;
            var balonik = document.querySelector('#' + this.id); // <<
            var style = window.getComputedStyle(balonik, null); // <<   sci�gaj� wielko�� balon�w
            var wys_balonu = parseInt(style.getPropertyValue('height')); // <<
            if (this.y >= wysokosc_ekranu + wys_balonu){
                usunBalonZeStrukturyDOM(balonik);
                this.czy_jest_w_DOM = false;
                //wylecia� z ekranu
                uaktualnijStanGry(0, 1); // (str�cony, wylecia� z ekranu)
            }
            this.aktualizacjaPolozeniaBalonu();
        }
    };

    this.ruchX = function () {
        if (this.czy_jest_w_DOM) {
            console.log('Jestem');
            this.x += this.predkoscX;
            this.aktualizacjaPolozeniaBalonu();

            if (this.x >= this.x_polozenie_bazowe + bujanieX || this.x <= this.x_polozenie_bazowe - bujanieX) {
                this.predkoscX = -this.predkoscX;
            }
        }
    };

    this.aktualizacjaPolozeniaBalonu = function () {
        if (this.czy_jest_w_DOM) {
            var balonik = document.querySelector('#' + this.id);
            balonik.style.left = this.x + 'px';
            balonik.style.bottom = this.y + 'px';
        }
        console.log('1341234');
    };

    this.narysujBalon();

};// koneic definicji obiektu balon

function uaktualnijStanGry(stracony, uciekl) {
    console.log(ilosc_punktow);
    if(uciekl > 0){
        zycie--;
        if(zycie === 0){
            koniec_gry();
        }
    }

    if(stracony > 0){
        ilosc_punktow++;
        if (ilosc_punktow === ile_punktow_wygrywa){
            koniec_gry();
        }
    }
    Punkty();
}

function koniec_gry() {
    for (var i = 0; i < tablica_balonow.length; i++) {
        if(tablica_balonow[i].czy_jest_w_DOM === true){
            var plansza = document.querySelector('#match_field');
            var balonik = document.querySelector('#' + tablica_balonow[i].id);
            plansza.removeChild(balonik);
        }
    }

    if(zycie === 0){
        alert('Przegrałeś. Uiekły 3 balony');
    }
    if(ilosc_punktow === ile_punktow_wygrywa){
        alert('Wygrałeś. Zdobyłeś: ' + ilosc_punktow + ' punktów');
    }
}

function obsluga_klikania() {
    //znamy obiekt this - obrazek w strukturze DOM
    this.src = eksplozja2;
    //wylaczenie animacji
    var index = znajdzObiektWTablicy(this.id);
    tablica_balonow[index].predkoscX = 0;
    tablica_balonow[index].predkoscY = 0;
    tablica_balonow[index].czy_jest_w_DOM = false;
    usunBalonZeStrukturyDOM(this);
    uaktualnijStanGry(1, 0);
    this.removeEventListener('click', obsluga_klikania); // usuwanie onlcika z elementu
}


function znajdzObiektWTablicy(id) {
    var index;
    for (var i = 0; i < tablica_balonow.length; i++) {
        if (tablica_balonow[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
}

function usunBalonZeStrukturyDOM(balon) {
    var field = document.querySelector('#match_field');
    setTimeout(function () {
        field.removeChild(balon); // this to element ktory zosta� nacisniety
    }, 700);

}

function Punkty () {
    var wynikGry = document.querySelector('#points');
    wynikGry.innerHTML = 'Punkty: ' + ilosc_punktow;

    var live = document.querySelector('#live');
    live.innerHTML = 'Zdjecie serca: ' + zycie;
    // wynikGry.appendChild(points);
}


function start() {

    var match_field = document.querySelector('#match_field');
    var style = window.getComputedStyle(match_field, null);
    szer_ekranu = parseInt(style.getPropertyValue('width'));
    wysokosc_ekranu = parseInt(style.getPropertyValue('height'));
    for (var i = 0; i < ile_balonow; i++) {
        tablica_balonow.push(generujBalonik());
        ruchBalonuY(i);
        ruchBalonuX(i);
    }
    Punkty();
    dodaj_balonik_interval = setInterval('dodaj_balonik()', 1000)


}

function ruchBalonuY(ktory_balon) {
    setInterval(function () {
        tablica_balonow[ktory_balon].ruchY();
    }, 30);
}

function ruchBalonuX(ktory_balon) {
    setInterval(function () {
        tablica_balonow[ktory_balon].ruchX();
    }, 30);
}

function generujBalonik() {
    var szer = randomNumber(30, 100);
    var kolor = randomNumber(1, 10);
    var predkX = randomNumber(1, 2);
    var predkY = randomNumber(1, 2);
    var x = randomNumber(2 + bujanieX, szer_ekranu - szer - bujanieX);
    var y = randomNumber(50, 65);
    return new balon(szer, kolor, predkX, predkY, x, -y);
}
function dodaj_balonik(){
    var balon = generujBalonik();
    balon.ruchY();
    balon.ruchX();

    uaktualnijStanGry();
}
