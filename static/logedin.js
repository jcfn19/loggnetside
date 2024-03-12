console.log("hello world")
let utskrift = document.getElementById("utskrift");

async function skrivutitem() {
    const response = await fetch("/navnlist")
    const data = await response.json();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        let listenavn = document.createElement("option");
        listenavn.innerText = data[i].navnlist;
        utskrift.appendChild(listenavn);
    }
    
}

skrivutitem();