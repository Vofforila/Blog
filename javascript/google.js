let map;

async function initMap() {
   const { Map } = await google.maps.importLibrary("maps");
   const { Marker } = await google.maps.importLibrary("marker");
   const utmMarker = { lat: 44.41375970483904, lng: 26.114467577234773 };

   map = new Map(document.getElementById("map"), {
      center: utmMarker,
      zoom: 15,
   });

   new Marker({
      position: utmMarker,
      map,
      title: "Facultatea UTM",
   });
}
initMap();
