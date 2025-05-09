
var stan = 1;
function Funkcja()
{
    var element = document.getElementById("test");
    var tekst = document.getElementById("tekst1");
    if (stan) {
        element.innerHTML = "Cześć " + tekst.value;
        element.style.color = "blue";
    }
    else
        element.innerHTML = "";
    stan = !stan;
}