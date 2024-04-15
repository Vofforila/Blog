function initMap() {
   const myLatLng = { lat: 43.257986816180114, lng: 13.759198978475222 };
   const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: myLatLng,
   });

   new google.maps.Marker({
      position: myLatLng,
      map,
      title: "Hello World!",
   });
}

window.initMap = initMap;
