console.log("liste brukere")

let utskrift = document.getElementById("utskrift");

async function skrivutbrukere(){
    const response = await fetch("/brukere")
    const data = await response.json();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        let brukernavn = document.createElement("p");
        brukernavn.innerText = data[i].bnavn;
        utskrift.appendChild(brukernavn);

        let fornavn = document.createElement("p");
        fornavn.innerText = data[i].bfornavn;
        utskrift.appendChild(fornavn);

        let etternavn = document.createElement("p");
        etternavn.innerText = data[i].betternavn;
        utskrift.appendChild(etternavn);

        let brukerrolle = document.createElement("p");
        brukerrolle.innerText = data[i].brolle;
        utskrift.appendChild(brukerrolle);
    }
}

skrivutbrukere()