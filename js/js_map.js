/*
TRABAJO REALIZADO POR:
ANTHONY RAMOS CAMACHO
TOMAS FELIPE JIMENEZ MEDINA
*/

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        + 'contributors',
    maxZoom: 18
});

/* 1. Capa base osm en coordenadas de florencia */
var map = L.map('map', {
    center: [1.61438, -75.60623],
    zoom: 15,
    layers: osm,
    /*scrollWheelZoom: true,*/
});

/* 2. Marcador universidad de la amazonia */
var marker = L.marker([1.62020, -75.60430], {
}).addTo(map)
    .bindPopup('Universidad de la Amazonia')
    .openPopup();

/* 3. Marcador circulo Alcaldia de Florencia */
var marker2 = L.marker([1.6150752, -75.61386], {
}).addTo(map)
    .bindPopup('Alcaldia de Florencia')
    .openPopup();
var circle = L.circle([1.6150752, -75.61386], 500, {
    color: 'green',
    fillColor: 'green',
    fillOpacity: 0.5
}).addTo(map);

/* 4. Marcador Poligono Parque Santander Florencia */

var polygon = L.polygon([
    [1.6151491, -75.6136903],
    [1.6153663, -75.6130144],
    [1.6146960, -75.6128106],
    [1.6145056, -75.6135026]
]).addTo(map)
    .bindPopup('Parque Santander');
polygon.bindTooltip("Parque Santander", {
    permanent: true
})

/* 5. Línea ubicación vivienda a la u amazonia*/
var pointA = new L.LatLng(1.6133393, -75.6072611);
var pointB = new L.LatLng(1.6139104, -75.6069446);
var pointC = new L.LatLng(1.6138327, -75.6055284);
var pointD = new L.LatLng(1.6153931, -75.6041282);
var pointE = new L.LatLng(1.6188089, -75.6064242);
var pointF = new L.LatLng(1.6201709, -75.6051207);

var latlngs = [pointA, pointB, pointC, pointD, pointE, pointF];
var polyline = L.polyline(
    latlngs, { color: 'blue' }
)
    .addTo(map)
    .bindPopup('Ruta para ir a clase');

var marker3 = L.marker([1.6133393, -75.6072611], {
}).addTo(map)
    .bindPopup('Casa Anthony Ramos')
    .openPopup();

/*Capas paises
var cities = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    layers: 'paises_mundo',
    format: 'image/png',
    transparent: true,
    tiled: true,
    attribution: "Natural Earth"
}).addTo(map);
*/
L.geoJson(paises).addTo(map);

function getColor(d) {
    return d > 100000000 ? '#800026' :
        d > 50000000 ? '#BD0026' :
            d > 20000000 ? '#E31A1C' :
                d > 10000000 ? '#FC4E2A' :
                    d > 5000000 ? '#FD8D3C' :
                        d > 2000000 ? '#FEB24C' :
                            d > 1000000 ? '#FED976' :
                                '#FFEDA0';
};
function style(feature) {
    return {
        fillColor: getColor(feature.properties.pop_est),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.geoJson(paises, {
    style: style
}).addTo(map);

function popup(feature, layer) {
    if (feature.properties && feature.properties.name) {
    layer.bindPopup("<div id='map_info_pop'>"+
    "<p>Nombre: <b>" + feature.properties.name + "</b></p>"+    
    "<p>Código postal: <b>" + feature.properties.postal + "</b></p>"+   
    "<p>Región: <b>" + feature.properties.continent + "</b></p>"+    
    "<p>Población: <b>" + number_format_js(feature.properties.pop_est,2,',','.') + "</b></p>"+
    "<p>Bandera: <b> <img src='https://www.banderas-mundo.es/data/flags/w580/"+feature.properties.iso_a2.toLowerCase()+".png' width= '25px'></img>"  + "</b></p>"+
    "</div>");
    }
}
geojson = L.geoJson(paises, {
    style: style,
    onEachFeature: popup
}).addTo(map)
/*Capas ciudades*/
var cities = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    layers: 'ciudades_mundo',
    format: 'image/png',
    transparent: true,
    tiled: true,
    attribution: "Natural Earth"
}).addTo(map);

/*Capas hidrografia*/
var cities = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    layers: 'hidrografia_mundo',
    format: 'image/png',
    transparent: true,
    tiled: true,
    attribution: "Natural Earth"
}).addTo(map);

L.control.scale().addTo(map);



function number_format_js(number, decimals, dec_point, thousands_point) {

    if (number == null || !isFinite(number)) {
        throw new TypeError("number is not valid");
    }

    if (!decimals) {
        var len = number.toString().split('.').length;
        decimals = len > 1 ? len : 0;
    }

    if (!dec_point) {
        dec_point = '.';
    }

    if (!thousands_point) {
        thousands_point = ',';
    }

    number = parseFloat(number).toFixed(decimals);

    number = number.replace(".", dec_point);

    var splitNum = number.split(dec_point);
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
    number = splitNum.join(dec_point);

    return number;
}