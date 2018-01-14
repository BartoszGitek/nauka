/**
 * Funkcja losuje liczby z podanego przedziału
 * @param {int} min
 * @param {int} max
 * @returns {int} zwracana losowa liczba
 */
function randomNumber(min, max) {
    var liczba = Math.round(Math.random() * (max - min) + min);
    return liczba;
}

