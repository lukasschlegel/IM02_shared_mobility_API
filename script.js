let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');

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
let ScooterDaten = await holeDaten('https://api.sharedmobility.ch/v1/sharedmobility/identify?filters=ch.bfe.sharedmobility.vehicle_type=E-Scooter&Geometry=8.536919584914061,47.38059039878863&Tolerance=500&offset=0&gemetryFormat=esrijson');
console.log(ScooterDaten);

// function datenDarstellen(scooter) {
//     anzeige.innerHTML = '';
//     scooter.forEach( scooter => {
//         let div = document.createElement('div');
//             div.className = 'scooterrow';
//                 let image = document.createElement('img')
//                 image.className = 'scooterpic';
//                 image.src = "img/Stadtparking1.webp";
//                 div.appendChild(image);
//         let title = document.createElement('p');
//         title.className = 'scootertitle'
//         title.innerText = scooter.attributes.station_name;
//         div.appendChild(title);
//         anzeige.appendChild(div);    

        function datenDarstellen(scooter) {
            anzeige.innerHTML = '';
            scooter.forEach( scooter => {
                let div = document.createElement('div');
                    div.className = 'scooterrow';
                        // let image = document.createElement('img')
                        // image.className = 'scooterpic';
                        // image.src = "img/Stadtparking1.webp";
                        // div.appendChild(image);
                let title = document.createElement('p');
                title.className = 'scootertitle'
                title.innerText = scooter.geometry;
                div.appendChild(title);
                anzeige.appendChild(div);
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

// Marker zu Karte hinzufügen für Scooter:

mapboxgl.accessToken = 'pk.eyJ1IjoibHVrYXNzY2hsZWdlbCIsImEiOiJjbHc2Y2J3YngxcXRiMmxweWIwM3V3eWg0In0.grSxvL6hdG7c-8UeuDq2rA';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v11', // style URL
center: [8.5, 46.85], // starting position [lng, lat]
zoom: 6, // starting zoom
});

const geojson = {
    type: 'FeatureCollection',
    features: [
{
    type: 'Feature',
    geometry: {
    type: 'Point',
    coordinates: [8.536919584914061, 47.38059039878863]
  },
    properties: {
    title: 'Mapbox',
    description: 'FHGR Standort Zürich'
  }
},
]

};
// add markers to map
for (const feature of geojson.features) {
// create a HTML element for each feature
const el = document.createElement('div');
el.className = 'marker';

// make a marker for each feature and add to the map
new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
} 