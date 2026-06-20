 const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map', 
        center: coordinates, 
        zoom: 10
    });

const marker = new mapboxgl.Marker({color : "red"})
  .setLngLat(coordinates)
  .setPopup( new mapboxgl.Popup({offset : 25}) .setHTML('<p>You will be here.</p>'))
  .addTo(map);
  
 