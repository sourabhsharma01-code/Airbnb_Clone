

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11',

    center: [77.2088, 28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9
});

console.log(coordinates);


const marker = new mapboxgl.Marker({color: 'red', rotaion: 45})
    .setLngLat(coordinates)     /// listing.geometry.cordinates
    .addTo(map);

