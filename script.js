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
        return
    } else if (val > 50) {
        document.getElementById("taille_case").value = 50;
        return
    }
    var taille = "" + val + "px";
    if (taille.sub)
        var all = document.getElementsByClassName('cell');
    for (var i = 0; i < all.length; i++) {
        all[i].style.width = taille;
        all[i].style.height = taille;
    }
}