mapboxgl.accessToken = mapToken;
let map = new mapboxgl.Map({
container: 'map', 
style: 'mapbox://styles/mapbox/light-v9', 
center: campgroundJSON.geometry.coordinates, 
zoom: 9 
});

let marker1 = new mapboxgl.Marker()
.setLngLat(campgroundJSON.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${campgroundJSON.title}</h4> <p class='text-muted'>${campgroundJSON.description.substring(0,100)}...</p>`)
)
.addTo(map);
