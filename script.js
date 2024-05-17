let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');

// url = https://api.sharedmobility.ch/v1/sharedmobility/find?searchText=ETH_Hönggerberg&searchField=ch.bfe.sharedmobility.station.name&offset=0&geometryFormat=esrijson

async function holeDaten(url) {
    try {
        let data = await fetch(url);
        return await data.json();
        // wenn daten geladen werden
    } catch(e) {
        console.error(e);
        // wenn ein fehler auftaucht
    }
}
let ScooterDaten = await holeDaten('https://api.sharedmobility.ch/v1/sharedmobility/identify?filters=ch.bfe.sharedmobility.vehicle_type=E-Scooter&Geometry=8.72334,47.50024&Tolerance=500&offset=0&gemetryFormat=esrijson');
console.log(ScooterDaten);

function datenDarstellen(scooter) {
    anzeige.innerHTML = '';
    scooter.forEach( scooter => {
        let div = document.createElement('div');
            div.className = 'scooterrow';
                let image = document.createElement('img')
                image.className = 'scooterpic';
                image.src = "img/Stadtparking1.webp";
                div.appendChild(image);
        let title = document.createElement('p');
        title.className = 'scootertitle'
        title.innerText = scooter.attributes.station_name;
        div.appendChild(title);
        anzeige.appendChild(div);

        if (scooter.attributes.station_name == 'undefined')
        {
            anzeige.appendChild('p');
            anzeige.innerText = 'Keine Ergebnisse';
        } else {
            anzeige.appendChild(div);
        }
        // keine anzeige wenn undefined
    })
}
datenDarstellen(ScooterDaten);

suche.addEventListener('input', async function() {
    let ergebnis = suche.value;
    let searchUrl = 'https://api.sharedmobility.ch/v1/sharedmobility/find?searchText=' + ergebnis + '&searchField=ch.bfe.sharedmobility.station.name&offset=0&geometryFormat=esrijson&Geometry=8.72334,47.50024&Tolerance=500';
    let scooter_aus_suche = await holeDaten(searchUrl);
    console.log(scooter_aus_suche);
    datenDarstellen(scooter_aus_suche)
})


