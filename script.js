let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');

async function holeScooterDaten(url) {
    try {
        let data = await fetch(url);
        return await data.json();
        // wenn daten geladen werden
    } catch(e) {
        console.error(e);
        // wenn ein fehler auftaucht
    }
}

//let ScooterDaten = await holeDaten('https://api.sharedmobility.ch/v1/sharedmobility/identify?filters=ch.bfe.sharedmobility.vehicle_type=E-Scooter&Geometry=8.536919584914061,47.38059039878863&Tolerance=500&offset=0&gemetryFormat=esrijson');
////console.log(ScooterDaten);

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

  /*      function datenDarstellen(scooter) {
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
}*/
//datenDarstellen(ScooterDaten);



function datenInArray(data) {
    let scooterArray = [];
    
    data.forEach( scooter => {
        let scooterObj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [scooter.geometry.x, scooter.geometry.y]
          },
          properties: {
            title: 'Mapbox',
            description: `<strong>Scooter</strong> <br> 
                          ${scooter.attributes.station_name} <br>
                          <strong> <a class="applink" href="https://apps.apple.com/us/app/tier-move-better/id1436140272?mt=8">App Store</a> | <a class="applink" href="https://play.google.com/store/apps/details?id=io.voiapp.voi&hl=en&gl=US">Google Play</a></strong>`

          }
      }
      scooterArray.push(scooterObj);
    })
    return scooterArray;
}

async function init() {
  let ScooterDaten = await holeScooterDaten('https://api.sharedmobility.ch/v1/sharedmobility/identify?filters=ch.bfe.sharedmobility.vehicle_type=E-Scooter&Geometry=8.536919584914061,47.38059039878863&Tolerance=1000&offset=0&gemetryFormat=esrijson');
  console.log(ScooterDaten);
  let mapBoxArray = datenInArray(ScooterDaten);
  drawMap(mapBoxArray)
}
init();

suche.addEventListener('input', async function() {
    let ergebnis = suche.value;
    let searchUrl = 'https://api.sharedmobility.ch/v1/sharedmobility/find?searchText=' + ergebnis + '&searchField=ch.bfe.sharedmobility.station.name&offset=0&geometryFormat=esrijson&Geometry=8.536919584914061,47.38059039878863&Tolerance=1000';
    let scooter_aus_suche = await holeScooterDaten(searchUrl);
    datenDarstellen(scooter_aus_suche)
})

// Marker zu Karte hinzufügen für Scooter:
function drawMap(pointArray) {
  mapboxgl.accessToken = 'pk.eyJ1IjoibHVrYXNzY2hsZWdlbCIsImEiOiJjbHc2Y2J3YngxcXRiMmxweWIwM3V3eWg0In0.grSxvL6hdG7c-8UeuDq2rA';
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v11', // style URL
  center: [8.538, 47.38], // starting position [lng, lat]
  zoom: 14.2, // starting zoom
  });

  const geojson = {
      type: 'FeatureCollection',
      features: pointArray

  };
  // add markers to map
  for (const feature of geojson.features) {
  // create a HTML element for each feature
  const el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map); 

  new mapboxgl.Marker(el)
    .setLngLat(feature.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
          `<p class="describtion">${feature.properties.description}</p>`
        )
    )
    .addTo(map);
  };
  
   // Add geolocate control to the map.
   map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    })
);
const geocoder = new MapboxGeocoder({
  // geocoder.className = 'geocoder',
  accessToken: 'pk.eyJ1IjoibHVrYXNzY2hsZWdlbCIsImEiOiJjbHc2Y2J3YngxcXRiMmxweWIwM3V3eWg0In0.grSxvL6hdG7c-8UeuDq2rA', // Set the access token
  placeholder: 'Suche nach einer Adresse', // Placeholder text for the search bar
  mapboxgl: 0, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  types: 'poi',
        // see https://docs.mapbox.com/api/search/#geocoding-response-object for information about the schema of each response feature
        render: function (item) {
            // extract the item's maki icon or use a default
            const maki = item.properties.maki || 'marker';
            return `<div class='geocoder-dropdown-item'>
                    <img class='geocoder-dropdown-icon' src='https://unpkg.com/@mapbox/maki@6.1.0/icons/${maki}-15.svg'>
                    <span class='geocoder-dropdown-text'>
                    ${item.text} </span>
                    </div>`;
        },

});

// Add the geocoder to the map
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
}


