<script tyṕe="javascript/text">
// OpenStreetMap
let osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

//url donde se encuentra servida la capa de agricultura
var url = 'http://adesur.centrogeo.org.mx/geoserver/gwc/service/wms';
//se saca el servicio de dicha url, proporcionando el nombre de la capa
let polygons = L.tileLayer.wms(url, {
    layers: 'geonode:poligonos_agricultura',
    format: 'image/png',
    transparent: true,
    attribution: ""
});

// Sentinel Hub WMS service
// tiles generated using EPSG:3857 projection - Leaflet takes care of that
let baseUrl = "https://services.sentinel-hub.com/ogc/wms/538f72f2-3777-49c7-8177-6d74964d74f8";
// mapa base falso color (rural) del año 2018
let false_color = L.tileLayer.wms(baseUrl, {
    tileSize: 512,
    attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
    urlProcessingApi:"https://services.sentinel-hub.com/ogc/wms/aeafc74a-c894-440b-a85b-964c7b26e471",
 	maxcc:20,
 	minZoom:6,
 	maxZoom:16,
 	preset:"FALSE_COLOR",
 	layers:"FALSE_COLOR",
	time:"2018-04-01/2018-04-29",
});

// mapa base ndvi del año 2018
let ndvi = L.tileLayer.wms(baseUrl, {
    tileSize: 512,
    attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
    urlProcessingApi:"https://services.sentinel-hub.com/ogc/wms/aeafc74a-c894-440b-a85b-964c7b26e471",
 	maxcc:20,
 	minZoom:6,
 	maxZoom:16,
 	preset:"NDVI",
 	layers:"NDVI",
 	time:"2018-04-01/2018-04-29",
});

// mapa base falso color (urbano) del año 2018
let urban = L.tileLayer.wms(baseUrl, {
    tileSize: 512,
    attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
    urlProcessingApi:"https://services.sentinel-hub.com/ogc/wms/aeafc74a-c894-440b-a85b-964c7b26e471",
 	maxcc:20,
 	minZoom:6,
 	maxZoom:16,
 	preset:"FALSE_COLOR_URBAN",
 	layers:"FALSE_COLOR_URBAN",
	time:"2018-04-01/2018-04-29",
});

// mapa base agricultura del año 2018
let agriculture = L.tileLayer.wms(baseUrl, {
    tileSize: 512,
    attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
    urlProcessingApi:"https://services.sentinel-hub.com/ogc/wms/aeafc74a-c894-440b-a85b-964c7b26e471",
 	maxcc:20,
 	minZoom:6,
 	maxZoom:16,
 	preset:"AGRICULTURE",
 	layers:"AGRICULTURE",
	time:"2018-04-01/2018-04-29",
});

// mapa base batimétrica del año 2018
let bathymetric = L.tileLayer.wms(baseUrl, {
    tileSize: 512,
    attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
    urlProcessingApi:"https://services.sentinel-hub.com/ogc/wms/aeafc74a-c894-440b-a85b-964c7b26e471",
 	maxcc:20,
 	minZoom:6,
 	maxZoom:16,
 	preset:"BATHYMETRIC",
 	layers:"BATHYMETRIC",
	time:"2018-04-01/2018-04-29",
});

//diccionaro con los keys y los valores de los mapas base
let baseMaps = {
    'NDVI': ndvi,
    'False Color (Vegetation)':false_color,
    'False Color (urban)':urban,
    'Agriculture':agriculture,
    'Gray':osm
};
//se le pasa el valor y el key de la capa de agricultura al diccionario de capas
let overlayMaps = {
    'Agricultura': polygons
}

let map = L.map('map', {
    center: [17.887699, -94.8586217], // lat/lng in EPSG:4326
    zoom: 13,
    layers: [agriculture, polygons]
});

//se crea el control de Leaflet con los mapas bases y la capa
L.control.layers(baseMaps, overlayMaps).addTo(map);
      L.tileLayer.betterWms(url, {
        layers: 'geonode:poligonos_agricultura',
        transparent: true,
        format: 'image/png'
   }).addTo(map);

//hacemos filtros para que no haga busquedas innecesarias el servidor
   function runScript(e) {
     if (e.keyCode == 13) {
      var tb = document.getElementById("scriptBox");
      //isNan evalua un argumento para determinar si es un número
      if (isNaN(tb.value)){
          alert("ingresa un área valida");
      }
      else {
        //si es número nos vamos al método searchData
        searchData(tb.value);
      }
    }
   }
//searchdata tiene como parametros area,
//buscamos el aŕea del poligono vía ajax, con el método search_area, haciendo uso de GET
function searchData(area) {
$.ajax({
   url: '{% url "search_area" %}',
   data: {'area': area},
   type: 'GET',
   success : function(data) {
     //si no existe el área, entonces mandamos un mensaje de busqueda no encontrada
       if (data.features.length==0) {
         alert("No hay un área con esos valores")
         return false;
       }
       //si es la primera consulta no removemos el geojson
       if (typeof(activityGeojson)!='undefined') {
         map.removeLayer(activityGeojson);
       }
       /* Eventos del geojson */
       function onEachCommonFeature(feature, layer) {
         //abrimos el popup del poligono que se ingreso
           layer.bindPopup('<div>area:<br><strong>'+feature.properties.area+'</strong></div>'+
            '<div>descripción:<br><strong>'+feature.properties.description+'</strong></div>'
         );
           layer.on('mouseover', function() {
               layer.openPopup();
           });
           layer.on('mouseout', function() { layer.closePopup(); });
       }
       /* Geojson de capas */
       activityGeojson = L.geoJson(data, {
           onEachFeature: onEachCommonFeature,
           style: function(feature) {
             //coloreamos el poligono ingresado desde el input search y le ponemos transparencia al geojson
               return { fillColor: "#b942f5", color: "#f54299", weight: 1, fillOpacity: 0.5 };
           }
       }).addTo(map);
       //vamos al zoom del poligono que se ingreso desde el input
       map.fitBounds(activityGeojson.getBounds());
   },
   error : function(message) {
           console.log(message);
   }
});
}
</script>
