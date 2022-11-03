/*
TRABAJO REALIZADO POR:
ANTHONY RAMOS CAMACHO
TOMAS FELIPE JIMENEZ MEDINA
JUAN DAVID MURCIA GIRALDO
*/

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        + 'contributors',
    maxZoom: 18
});

/* Capa base osm en coordenadas de florencia */
var map = L.map('map', {
    center: [1.61438, -75.60623],
    zoom: 5,
    layers: osm,
    /*scrollWheelZoom: true,*/
});

/*

6.3 Minimapa

*/
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data &copy; OpenStreetMap contributors';

var osm2 = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 13, attribution: osmAttrib });
var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);

/* 

3. Capa paises  

*/
L.geoJson(paises).addTo(map);

function getColor(d) {
    return d > 100000000 ? '#08306b' :
        d > 50000000 ? '#08519c' :
            d > 20000000 ? '#2171b5' :
                d > 10000000 ? '#4292c6' :
                    d > 5000000 ? '#6baed6' :
                        d > 2000000 ? '#9ecae1' :
                            d > 1000000 ? '#c6dbef' :
                                '#deebf7';
};
function style(feature) {
    return {
        fillColor: getColor(feature.properties.pop_est),
        weight: 2,
        opacity: 1,
        color: '#08306b',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.geoJson(paises, {
    style: style
}).addTo(map);

function popup(feature, layer) {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup("<div id='map_info_pop'>" +
            "<p>Nombre: <b>" + feature.properties.name + "</b></p>" +
            "<p>Código postal: <b>" + feature.properties.postal + "</b></p>" +
            "<p>Región: <b>" + feature.properties.continent + "</b></p>" +
            "<p>Población: <b>" + number_format_js(feature.properties.pop_est, 2, ',', '.') + "</b></p>" +
            "<p>Bandera: <b> <img src='https://www.banderas-mundo.es/data/flags/w580/" + feature.properties.iso_a2.toLowerCase() + ".png' width= '25px'></img>" + "</b></p>" +
            "</div>");
    }
}
geojson = L.geoJson(paises, {
    style: style,
    onEachFeature: popup
}).addTo(map)



/* 

5. Capa departamentos 

*/
L.geoJson(departamentos).addTo(map);

function getColor2(d) {
    return d <= 27265124524 ? '#ffffd9' :
        d <= 36353499366 ? '#edf8b1' :
            d <= 54530249049 ? '#c7e9b4' :
                d <= 109060498099 ? '#7fcdbb' :
                    '#41b6c4';
};
function style2(feature) {
    return {
        fillColor: getColor2(feature.properties.SHAPE_AREA),
        weight: 2,
        opacity: 1,
        color: '#247078',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function popup2(feature, layer) {
    if (feature.properties && feature.properties.NOM_DEPART) {
        layer.bindPopup("<div id='map_info_pop'>" +
            "<p>Nombre: <b>" + feature.properties.NOM_DEPART + "</b></p>" +
            "<p>Código DANE: <b>" + feature.properties.COD_DEPART + "</b></p>" +
            "</div>");
    }
}
geojson = L.geoJson(departamentos, {
    style: style2,
    onEachFeature: popup2
}).addTo(map)


/* 

4. Capa ciudades 

*/

var v_ciudades = L.markerClusterGroup();

function getColor3(d) {
    return d == 'N' ? '#ec7014' :
        d == 'S' ? '#e31a1c' :
            '#38383a';
};
function style3(feature) {
    return {
        color: getColor3(feature.properties.CAPITAL),
        stroke: true,
        radius: (feature.properties.CAPITAL == "S" ? 8 : 4),
        opacity: 1,
        fillColor: getColor3(feature.properties.CAPITAL),
        fillOpacity: 0.7
    };
}

/* 

6.1 Cluster

*/
L.geoJson(ciudades, {
    pointToLayer: function (feature, latlng) {
        return v_ciudades.addLayer(L.circleMarker(latlng, style3(feature))
            .bindPopup(
                "Nombre: <b>" + feature.properties.CIUDAD + "</b><br>" +
                "Tipo: <b>" + (feature.properties.CAPITAL == "S" ? 'Capital' : "Ciudad") + "</b>"
            ))
    },
}).addTo(map);
map.addLayer(v_ciudades);


/* Controles escala */
L.control.scale().addTo(map);

/* 

6.2 Control de capas 

*/

// Google layers
var g_roadmap = new L.Google('ROADMAP');
var g_satellite = new L.Google('SATELLITE');
var g_terrain = new L.Google('TERRAIN');

// Bing layers
var bing1 = new L.BingLayer("AvZ2Z8Jve41V_bnPTe2mw4Xi8YWTyj2eT87tSGSsezrYWiyaj0ldMaVdkyf8aik6", { type: 'Aerial' });
var bing2 = new L.BingLayer("AvZ2Z8Jve41V_bnPTe2mw4Xi8YWTyj2eT87tSGSsezrYWiyaj0ldMaVdkyf8aik6", { type: 'Road' });


var capa_ciudades = new L.LayerGroup();
var capa_departamentos = new L.LayerGroup();
var capa_paises = new L.LayerGroup();

L.geoJson(paises).addTo(capa_paises);
L.geoJson(departamentos).addTo(capa_departamentos);
L.geoJson(ciudades).addTo(capa_ciudades);

var baseMaps = [
    { 
        groupName : "Google Base Maps",
        expanded : true,
        layers    : {
            "Satellite" :  g_satellite,
            "Road Map"  :  g_roadmap,
            "Terreno"   :  g_terrain
        }
    }, {
        groupName : "OSM Base Maps",
        layers    : {
            "OpenStreetMaps" : osm
        }
    }/*, {
        groupName : "Bing Base Maps",
        layers    : {
            "Satellite" : bing1,
            "Road"      : bing2
      }
    } */							
];

var overlays = [
    {
        groupName: "Capas Mapa",
        expanded: true,
        layers: {
            "Paises": capa_paises,
            "Ciudades": capa_ciudades,
            "Departamentos Colombia": capa_departamentos
        }
    }
];

// configure StyledLayerControl options for the layer soybeans_sp
capa_paises.StyledLayerControl = {
    removable: false,
    visible: false
}

// configure the visible attribute with true to corn_bh
capa_departamentos.StyledLayerControl = {
    removable: false,
    visible: false
}

var options = {
    container_width: "400px",
    group_maxHeight: "150px",
    //container_maxHeight : "350px", 
    exclusive: false,
    collapsed: true,
    position: 'topright'
};

var control = L.Control.styledLayerControl(baseMaps, overlays, options);
map.addControl(control);

control.selectGroup("Capas mapa");




/* Formatear numeros */

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