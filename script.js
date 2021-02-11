var mouseDown = 0;
document.body.onmousedown = function() {
    mouseDown = true;
}
document.body.onmouseup = function() {
    mouseDown = false;
}

var TimerId = null;


function nouveau() {
    // on récupere la taille
    var tx = document.getElementById("tx").value;
    var ty = document.getElementById("ty").value;
    var taille = document.getElementById("taille_case").value;
    // on nettoie :
    var t = document.getElementById("table");
    t.innerHTML = "";
    // On va créer le nouveau tableau
    for (y = 0; y <= parseInt(ty) + 1; y++) {
        var ligne = document.createElement("tr");
        for (x = 0; x <= parseInt(tx) + 1; x++) {
            var cell = document.createElement("td");
            cell.value = 0; // 0 = mort, 1 = vivant
            cell.classList.add("cell");
            cell.classList.add("dead");
            cell.style.width = taille;
            cell.style.height = taille;
            cell.setAttribute("id", "" + x + "-" + y);
            if (x == 0 || x == parseInt(tx) + 1 || y == 0 || y == parseInt(ty) + 1) {
                cell.classList.add("hidden");
            } else {
                cell.setAttribute("onclick", "cell_click(this.id, false)");
                cell.setAttribute("onmouseover", "cell_click(this.id)");
            }
            ligne.appendChild(cell);
        }
        t.appendChild(ligne);
    }
}

function set_life(ide) {
    var c = document.getElementById(ide);
    if (c.value == 0) {
        c.value = 1;
        c.classList.remove("dead");
        c.classList.add("life");
    }
}

function set_dead(ide) {
    var c = document.getElementById(ide);
    if (c.value == 1) {
        c.value = 0;
        c.classList.add("dead");
        c.classList.remove("life");
    }
}

function cell_click(ide, test = true) {
    if (test && !mouseDown) {
        return
    }
    var c = document.getElementById(ide);
    if (c.value == 0) {
        c.value = 1;
        c.classList.remove("dead");
        c.classList.add("life");
    } else {
        c.value = 0;
        c.classList.add("dead");
        c.classList.remove("life");
    }
}

function execute() {
    // on récupere la taille
    var tx = parseInt(document.getElementById("tx").value);
    var ty = parseInt(document.getElementById("ty").value);
    // on récupère l'ancienne matrice
    var m = [];
    for (y = 0; y <= ty + 1; y++) {
        m.push([]);
        for (x = 0; x <= tx + 1; x++) {
            var idd = "" + x + "-" + y;
            m[y].push(document.getElementById(idd).value);
        }
    }
    //
    for (x = 1; x <= tx; x++) {
        for (y = 1; y <= ty; y++) {
            // on récupère la somme des etats des autres cellules à côté
            var s = 0;
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    if (!(i == 0 && j == 0)) {
                        s += m[y + j][x + i];
                    }
                }
            }
            //
            if (document.getElementById("" + x + "-" + y).value == 1) {
                if (s < 2 || s > 3) {
                    set_dead("" + x + "-" + y);
                }
            } else {
                if (s == 3) {
                    set_life("" + x + "-" + y);
                }
            }
        }
    }
}

function play() {
    // timerId = setInterval(() => execute, parseInt(document.getElementById("timer").value));
    timerId = setInterval(() => execute(), parseInt(document.getElementById("timer").value));
    document.getElementById("bt_play").innerHTML = "stop";
    document.getElementById("bt_play").onclick = stop;
}

function stop() {
    clearInterval(timerId);
    document.getElementById("bt_play").innerHTML = "play";
    document.getElementById("bt_play").onclick = play;
}

function resize() {
    var val = parseInt(document.getElementById("taille_case").value);
    if (val < 1) {
        document.getElementById("taille_case").value = 1;
        return;
    } else if (val > 50) {
        document.getElementById("taille_case").value = 50;
        return;
    }
    var taille = "" + val + "px";
    if (taille.sub) {
        var all = document.getElementsByClassName('cell');
    }
    for (var i = 0; i < all.length; i++) {
        all[i].style.width = taille;
        all[i].style.height = taille;
    }
}


function import_rle() {
    // on récupere la taille
    var tx = document.getElementById("tx").value;
    var ty = document.getElementById("ty").value;
    // on récupère les infos RLE
    var texte = document.getElementById("rle").value;
    var debx = parseInt(document.getElementById("import_x").value);
    var deby = parseInt(document.getElementById("import_y").value);
    // on init les variables dont on aura besoin
    var x = debx;
    var y = deby;
    var c = 0; // curseur
    var chiffres = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var nb = 1;
    var state = 0; // 0 = on a rien en cours, 1 = on a un nombre en cours
    // on traite tout le codage RLE
    while (c < texte.length) {
        var charactere = texte[c];
        if (chiffres.includes(charactere)) { // c'est un chiffre
            if (state == 0) {
                state = 1;
                nb = charactere; // ce sont des chaines de charactere normalement
            } else {
                nb += charactere; // ce sont des chaines de charactere normalement
            }
        } else { // c'est "o", "b" ou "$"
            if (charactere == "$") { // on va s'occuper du "$" séparemment, ce sera plus simple
                y += nb;
                x = debx;
            } else { // c'est soit "o" soit "b"
                console.log(nb, charactere);
                if (charactere == "o") {
                    var func = set_life
                } else {
                    var func = set_dead
                }
                for (i = 0; i < nb; i++) {
                    x++;
                    if (x >= 0 && x <= tx && y >= 0 && y <= ty) {
                        func("" + x + "-" + y);
                    }
                }
            }
            state = 0; // on a finit notre charactere
            nb = 1;
        }
        c++;
    }
}