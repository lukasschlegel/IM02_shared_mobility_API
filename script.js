let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');

async function holeScooterDaten(url) {
    try {
        let data = await fetch(url);
        return await data.json();
    } catch(e) {
        console.error(e);
    }
}

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
                          <strong>
                            <a class="applink" target="_blank" href="${scooter.attributes.provider_apps_ios_store_uri}">App Store</a> | 
                            <a class="applink" target="_blank" href="${scooter.attributes.provider_apps_android_store_uri}">Google Play</a>
                          </strong>`
          }
      }
      scooterArray.push(scooterObj);
    })
    return scooterArray;
}

async function init() {
  initMap();
}

async function initMap(lat = 8.536919584914061, long = 47.38059039878863) {
  let ScooterDaten = await holeScooterDaten(`https://api.sharedmobility.ch/v1/sharedmobility/identify?filters=ch.bfe.sharedmobility.vehicle_type=E-Scooter&Geometry=${lat},${long}&Tolerance=1000&offset=0&gemetryFormat=esrijson`);
  console.log(ScooterDaten);
  let mapBoxArray = datenInArray(ScooterDaten);
  drawMap(mapBoxArray, lat, long)
}
init();

// geocoder.addEventListener('input', async function() {
//     let ergebnis = input.value;
//     let searchUrl = 'https://api.sharedmobility.ch/v1/sharedmobility/find?searchText=' + ergebnis + '&offset=0&geometryFormat=esrijson&Geometry=8.536919584914061,47.38059039878863&Tolerance=1000';
//     let scooter_aus_suche = await holeScooterDaten(searchUrl);
//     datenDarstellen(scooter_aus_suche)
// })

function drawMap(pointArray, lat = 8.538, long = 47.38) {
  mapboxgl.accessToken = 'pk.eyJ1IjoibHVrYXNzY2hsZWdlbCIsImEiOiJjbHc2Y2J3YngxcXRiMmxweWIwM3V3eWg0In0.grSxvL6hdG7c-8UeuDq2rA';
  const map = new mapboxgl.Map({
  container: 'map',
  countries: 'ch',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [lat, long],
  zoom: 14.2,
  });
  
  const geojson = {
      type: 'FeatureCollection',
      features: pointArray
  };

  for (const feature of geojson.features) {
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map); 

  new mapboxgl.Marker(el)
    .setLngLat(feature.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<p class="describtion">${feature.properties.description}</p>`
        )
    )
    .addTo(map);
  };
  
   map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    })
);

const geocoder = new MapboxGeocoder({
  accessToken: 'pk.eyJ1IjoibHVrYXNzY2hsZWdlbCIsImEiOiJjbHc2Y2J3YngxcXRiMmxweWIwM3V3eWg0In0.grSxvL6hdG7c-8UeuDq2rA',
  mapboxgl: 0,
  countries: 'CH',
  lanugage: 'de',
  bbox: [6.02260949059, 45.7769477403, 10.4427014502, 47.8308275417],
  placeholder: 'Suche nach einer Adresse',
  marker: false,
  feature_type: 'place' + 'address',
        render: function (item) {
            const maki = item.properties.maki || 'marker';
            return `<div class='geocoder-dropdown-item'>
                    <img class='geocoder-dropdown-icon' src='https://unpkg.com/@mapbox/maki@6.1.0/icons/${maki}-15.svg'>
                    <span class='geocoder-dropdown-text'>
                    ${item.text} </span>
                    </div>`;
        },


}).on('result', (selected) => {
  console.log(selected)

  initMap(selected.result.center[0], selected.result.center[1]);
})   

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
}

