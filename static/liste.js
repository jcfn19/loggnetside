console.log("liste")
//let utskrift = document.getElementById("utskrift");

let itemsid = document.getElementById("itemsid");
let navn = document.getElementById("navn");
let tilstand = document.getElementById("tilstand");
let ansvarlig = document.getElementById("ansvarlig");
let roe = document.getElementById("roe");
let skap = document.getElementById("skap");

let navnliste = document.getElementById("navnliste");

async function skrivutnavn() {
    const response = await fetch("/navnlist")
    const data = await response.json();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        let listenavn = document.createElement("option");
        listenavn.innerText = data[i].navnlist;
        navnliste.appendChild(listenavn);
    }
    
}

skrivutnavn();

async function skrivutitem() {
    const response = await fetch("/items")
    const data = await response.json();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        let itemid = document.createElement("p");
        itemid.innerText = data[i].iid;
        itemsid.appendChild(itemid);

        let itemnavn = document.createElement("p");
        itemnavn.innerText = data[i].inavn;
        navn.appendChild(itemnavn);

        let itemtilstand = document.createElement("p");
        itemtilstand.innerText = data[i].itilstand;
        tilstand.appendChild(itemtilstand);

        let itemansvarlig = document.createElement("p");
        itemansvarlig.innerText = data[i].iansvarlig;
        ansvarlig.appendChild(itemansvarlig);

        let itemrometasje = document.createElement("p");
        itemrometasje.innerText = data[i].irometasje;
        roe.appendChild(itemrometasje);

        let itemskap = document.createElement("p");
        itemskap.innerText = data[i].iskap;
        skap.appendChild(itemskap);
    }
}

skrivutitem();