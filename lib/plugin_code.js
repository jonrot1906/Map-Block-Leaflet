document.addEventListener("DOMContentLoaded", function() {

    var container3 = document.getElementById("list_wrapper");
    var observer3 = ResizeObserver && new ResizeObserver(function() {
        adjust_result_div_height();
    });
observer3 && observer3.observe(container3);

if ($(window).width() < 576) {
document.getElementById("results_filter_div").style.height = "1000px";
}

const list_container = document.getElementById("list_wrapper");
const org_data_container = document.getElementById("info-modal-organisation-data");

function returnCards(markets) {
markets.forEach(function(market) {
if (market.description != null){
    market.shortdescription = market.description.substring(0,150);
}
switch(market.service_type){
    case "Projekt":
    case "Filiale":
        market.color = "#4169E1"; //blue
        break;
    case "Veranstaltung":
        market.color = "#FFBF00"; //yellow
        break;
    case "Beratungsangebot":
    case "Bildungsangebot":
        market.color = "#D2042D"; //red
        break;
    }			
});

return "<div id=\"list_results\" class=\"result-list list-group list\">" + markets.map(markets => { let result_card = `
<div class="card result_list list-group-item-action" id="${markets.id}_div" style="border-right: solid 7px ${markets.color}">
<div class="card-body">
<p class="card_type" style="font-size:16px;margin-bottom: 3px;color:${markets.color}"><small>${markets.service_type}</small></p>
<div class="row" style="margin-bottom: 5px;">
<h5><a class="modal_link link-dark stretched-link card_title" id="${markets.id}_link" style="font-size:18px;">${markets.name}</a></h5>
</div>
<p>`;
let act_time;
if(markets.start_at != null){
let start_date = moment(markets.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>Start: ${start_date}</span>
<br>`;
}
if(markets.end_at != null){
let end_date = moment(markets.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>Ende: ${end_date}</span>
<br>`;
}
if((markets.end_at != null) && (markets.end_at != null)){
let start_date = moment(markets.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
let end_date = moment(markets.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>${start_date} - ${end_date}</span>
<br>`;
}
if(act_time != null){
result_card += act_time;
}
result_card += `<i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;<span>${markets.full_address}</span>
<br>
<i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp;<span>${markets.shortdescription}...</span>
</p>
</div>
</div>`;
return result_card;
}).join("") + "</div>";
}

function returnOrgActivities(data_arr) {
data_arr.forEach(function(market) {
if (market.description != null){
    market.shortdescription = market.description.substring(0,150);
}
switch(market.service_type){
    case "Projekt":
    case "Filiale":
        market.color = "#4169E1"; //blue
        break;
    case "Veranstaltung":
        market.color = "#FFBF00"; //yellow
        break;
    case "Beratungsangebot":
    case "Bildungsangebot":
        market.color = "#D2042D"; //red
        break;
    }			
});

return "<div id=\"org_activities\" class=\"list-group list\">" + data_arr.map(data_single => { let act_card = `
<div class="card card-body mb-2 list-group-item-action" id="${data_single.id}_orgdiv" style="border-right: solid 7px ${data_single.color}">
<div class="row">
<div class="col-9">
    <h5><a class="modal_link link-dark stretched-link" id="${data_single.id}_link">${data_single.name}</a></h5>
</div>
<div class="col-3" align="right">
<p class="type-text" style="color:${data_single.color}"><small>${data_single.service_type}</small></p>
</div>
<p>`;
let act_time;
if(data_single.start_at != null){
    let start_date = moment(data_single.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
    act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>Start: ${start_date}</span>
    <br>`;
}
if(data_single.end_at != null){
    let end_date = moment(data_single.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
    act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>Ende: ${end_date}</span>
    <br>`;
}
if((data_single.end_at != null) && (data_single.end_at != null)){
    let start_date = moment(data_single.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
    let end_date = moment(data_single.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
    act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>${start_date} - ${end_date}</span>
    <br>`;
}
if(act_time != null){
    act_card += act_time;
}
act_card += `<i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;<span>${data_single.full_address}</span>
<br>
<i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp;<span>${data_single.shortdescription}...</span>
</p>
</div>
</div>`;
return act_card;
}).join("") + "</div>";
}



    var center = [51.340199,12.360103]; //51.340199,12.360103

    var layer = L.tileLayer(themeUrl, {themeAttribution})
    var layer2 = L.tileLayer(themeUrl, {themeAttribution})

    map = L.map("leaflet_map", { center: center, layers: [layer]});
    //map.scrollWheelZoom.disable();

    $.ajax({
        url: "https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier-Leaflet/0.2.6/oms.min.js",
        dataType: "script",
        cache: true
    }).done(function(data){
        oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied:true});

        var popup = new L.Popup();

        oms.addListener("click", function(marker) {
            //map.panTo(marker.getLatLng());
            marker.openPopup();
            let selected_div = document.getElementById(marker.options.ID+"_div");
            if(!former_div){
                former_div = selected_div;
            }else{
                console.log(former_div);
                former_div.style.backgroundColor="";
                former_div = selected_div;
            }
            scrollParentToChild(list_wrapper, selected_div);
            selected_div.style.backgroundColor="#D3D3D3";
        });
        oms.addListener("spiderfy", function(markers) {
          
          map.closePopup();
        });
        oms.addListener("unspiderfy", function(markers) {
          
        });
    });


    map2 = L.map("leaflet_small_map", { center: center, layers: [layer2], zoom: 12});
    map2.scrollWheelZoom.disable();

    var yellowIcon = new L.Icon({
        iconUrl: "https://cdn.mapmarker.io/api/v1/pin?icon=fa-calendar&size=100&background=ffbb33&hoffset=0&voffset=-1",
        iconSize: [40, 40],
        iconAnchor: [20, 34],
        popupAnchor: [0, -28]
      });

      var redIcon = new L.Icon({
        iconUrl: "https://cdn.mapmarker.io/api/v1/pin?icon=fa-users&size=100&background=ff4444&hoffset=0&voffset=-1",
        iconSize: [40, 40],
        iconAnchor: [20, 34],
        popupAnchor: [0, -28]
      });

      var blueIcon = new L.Icon({
        iconUrl: "https://cdn.mapmarker.io/api/v1/pin?icon=fa-sitemap&size=100&background=4285F4&hoffset=0&voffset=-1",
        iconSize: [40, 40],
        iconAnchor: [20, 34],
        popupAnchor: [0, -28]
      });

    /*var yellowIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    
      var redIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    
      var blueIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    */

    L.Control.zoomHome = L.Control.extend({
        options: {
            position: "topleft",
            zoomHomeText: "<i class=\"fa fa-home\" style=\"line-height:1.65;\"></i>",
            zoomHomeTitle: "Zoom home"
        },
    
        onAdd: function (map) {
            var controlName = "gin-control-zoom",
                container = L.DomUtil.create("div", controlName + " leaflet-bar"),
                options = this.options;
    
            this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
            controlName + "-home", container, this._zoomHome);
    
            this._updateDisabled();
            map.on("zoomend zoomlevelschange", this._updateDisabled, this);
    
            return container;
        },
    
        onRemove: function (map) {
            map.off("zoomend zoomlevelschange", this._updateDisabled, this);
        },
    
        _zoomHome: function (e) {
            map.setView([51.340199,12.360103], 13);
        },
    
        _createButton: function (html, title, className, container, fn) {
            var link = L.DomUtil.create("a", className, container);
            link.innerHTML = html;
            link.href = "#";
            link.title = title;
    
            L.DomEvent.on(link, "mousedown dblclick", L.DomEvent.stopPropagation)
                .on(link, "click", L.DomEvent.stop)
                .on(link, "click", fn, this)
                .on(link, "click", this._refocusOnMap, this);
    
            return link;
        },
    
        _updateDisabled: function () {
            var map = this._map,
                className = "leaflet-disabled";
        }
    });
    // add the new control to the map
    var zoomHome = new L.Control.zoomHome();
    zoomHome.addTo(map);

var container = document.getElementById("leaflet_map");
var observer = ResizeObserver && new ResizeObserver(function() {
map.invalidateSize(true);
});
observer && observer.observe(container);

var container2 = document.getElementById("leaflet_small_map");
var observer2 = ResizeObserver && new ResizeObserver(function() {
map2.invalidateSize(true);
});


observer2 && observer2.observe(container2);

/*$(".result_list").click(function() {
console.log(this.id)
var div_id_bf = this.id;
var div_id = div_id_bf.substr(0, div_id_bf.indexOf("_"));
console.log(div_id);
  let marker_arr=markers.getLayers();
  marker_arr.forEach(function(market) {
      console.log("MarketID"+market.options.ID);
      console.log(div_id);
      if(market.options.ID == div_id){
        map.panTo(market.getLatLng());
      }
    });
});*/

    function scrollParentToChild(parent, child) {
    
      // Where is the parent on page
      var parentRect = parent.getBoundingClientRect();
      // What can you see?
      var parentViewableArea = {
        height: parent.clientHeight,
        width: parent.clientWidth
      };
    
      // Where is the child
      var childRect = child.getBoundingClientRect();
      // Is the child viewable?
      var isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height);
      console.log(isViewable);
      // if you cant see the child try to scroll parent
      //if (!isViewable) {
        // scroll by offset relative to parent
        parent.scrollTop = (childRect.top + parent.scrollTop) - (parentRect.top+200)
      //}
    
    }

 $(".input-daterange").datepicker({
    format: "dd.mm.yyyy",
    weekStart: 1,
    todayBtn: true,
    language: "de",
    clearBtn: true,
    beforeShowDay: function(date){
          if (date.getMonth() == (new Date()).getMonth())
            switch (date.getDate()){
              case 4:
                return {
                  tooltip: "Example tooltip",
                  classes: "active"
                };
              case 8:
                return false;
              case 12:
                return "green";
          }
        }
});


      var Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: true,
        timer: 15000,
        width: "600px"
      });

      $(".swalDefaultQuestion").click(function() {
        Toast.fire({
          icon: "question",
          title: "Um die Ergebnisse zu filtern, klickst du einfach auf die Kategorien Initiativen, Angebote und Veranstaltungen, gibst ein Stichwort in der Suche ein oder wählst einen Zeitraum für Veranstaltungen aus."
        })
      });

      $("#extendedSwal").click(function() {
        Toast.fire({
          icon: "question",
          title: "Hier kannst du die Ergebnisse noch feiner filtern. Regionen: Wähle hier deine Ziel-Region(en) aus. Kategorien: Hier wählst du aus, ob du lieber Initiativen zum Umweltschutz oder zum Thema Globale Verantwortung sehen möchtest. Start & Ende: Hier gibst du an, in welchem Zeitraum dir Veranstaltungen angezeigt werden sollen. Falls du nichts angibst, werden dir alle kommenden Veranstaltungen angezeigt."
        })
      });

      $("#redoButton").click(function() {
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        $("#regions_picker").selectpicker("deselectAll");
        $("#kategorie_picker").selectpicker("deselectAll");

        $("#regions_picker").selectpicker("val", "106");
        $( ".check-category-single" ).prop( "checked", false );
        $( "#alle-btn" ).prop( "checked", true );
      });



      $("#alle-btn").change(function() {
        $( ".check-category-single" ).prop( "checked", false );
      });

      $(".check-category-single").change(function() {
        if ($(".check-category-single:checked").length == $(".check-category-single").length) {
            $( "#alle-btn" ).prop( "checked", true );
            $( ".check-category-single" ).prop( "checked", false );
        }else{
            $( "#alle-btn" ).prop( "checked", false );
        }
      });
      
      $("#thisWeek").click(function(){
        var curr = new Date; // get current date
        var first = curr.getDate() - (curr.getDay() - 1); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        document.getElementById("startDate").value = new Date(curr.setDate(first)).toISOString().substring(0,10);
        document.getElementById("endDate").value = new Date(curr.setDate(last)).toISOString().substring(0,10);
    });

    $("#thisMonth").click(function(){
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        document.getElementById("startDate").value = firstDay.toISOString().substring(0,10);
        document.getElementById("endDate").value = lastDay.toISOString().substring(0,10);
    });

    $("#clearThis").click(function(){
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
    });


    $.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/categories.json", function( data ) {

        categories_array = data;

        $.each( data, function(ind, elem) {
            if(elem.depth == 0){
                $("#kategorie_picker").append($("<option>", {
                    value: elem.id,
                    text: elem.name
                  }));
            }

        });
        $("#kategorie_picker").selectpicker("refresh");
        $("#kategorie_picker").selectpicker("val", default_categories);

    });

    $.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/regions.json", function( data ) {
        $.each( data, function(ind, elem) {

            $("#regions_picker").append($("<option>", {
                value: elem.id,
                text: elem.name
              }));
        });
        $("#regions_picker").selectpicker("refresh");
        $("#regions_picker").selectpicker("val", default_regions);
    });

    $.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json", function( activities_data ) {
        all_data = activities_data;
    });


        function getAPIData(web_addresses){
            $("#list_wrapper").LoadingOverlay("show",{
                image       : "",
                fontawesome : "fa fa-recycle fa-spin",
                zIndex: 3
            });
            $("#map_wrapper").LoadingOverlay("show",{
                image       : "",
                fontawesome : "fa fa-recycle fa-spin",
                zIndex: 3
            });
        $.when.apply($, web_addresses.map(function(url) {
            return $.getJSON(url);
        })).done(function() {
            $("#list_wrapper").LoadingOverlay("hide");
            $("#map_wraper").LoadingOverlay("hide");
            var data_helper = [];
            // there will be one argument passed to this callback for each ajax call
            // each argument is of this form [data, statusText, jqXHR]
            if((web_addresses.length > 1)){
            for (var i = 0; i < arguments.length; i++) {
                data_helper.push(arguments[i][0]);
                var data = [].concat.apply([], data_helper); 
            }
        }else{
            var data = arguments[0];
        }
            // all data is now in the results array in order
            console.log(data);
        marker_data = data;
        /*if(markets.length > 0) {
        
        }*/

        list_container.innerHTML = returnCards(data);
        var options = {
            valueNames: ["card_type", "card_title", "card_description"]
        };
        setTimeout(function () {
            var search_list = new List("another_wrap", options);
        }, 2500);


        

        $("#info-result-number").text(data.length + " Ergebnisse");

        if( typeof markers != "undefined" ){
            map.removeLayer(markers);
        }

        oms.clearMarkers();

        markers = L.featureGroup();
        
        service_types=[];
        
        $.each( data, function(ind, elem) {
            service_types.push(elem.service_type);
            var ID = elem.id;
            
            if(elem.latlng == null && elem.full_address != null){
                $.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + elem.full_address, function( latlng_data ) {
                    if(latlng_data.length != 0){
                        elem.latlng = [latlng_data[0].lat, latlng_data[0].lon];
                        switch(elem.service_type){
                            case "Projekt":
                            case "Filiale":
                                var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {ID, icon:blueIcon}).bindPopup("<span style=color:#4285F4;>"+elem.service_type+"</span><br><b>"+elem.name+"</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers).on("mouseover", mouseFunction);
                                oms.addMarker(marker);
                                break;
                            case "Veranstaltung":
                                var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {ID, icon:yellowIcon}).bindPopup("<span style=color:#ffbb33;>"+elem.service_type+"</span><br><b>"+elem.name+"</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers).on("mouseover", mouseFunction);
                                oms.addMarker(marker);
                                break;
                            case "Beratungsangebot":
                            case "Bildungsangebot":
                                var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {ID, icon:redIcon}).bindPopup("<span style=color:#ff4444;>"+elem.service_type+"</span><br><b>"+elem.name+"</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers).on("mouseover", mouseFunction);
                                oms.addMarker(marker);
                                break;			
                        } 
                    }
                });
            }else if (elem.latlng != null ){
                switch(elem.service_type){
                    case "Projekt":
                    case "Filiale":
                        var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {ID, icon:blueIcon}).bindPopup("<span style=color:#4285F4;>"+elem.service_type+"</span><br><b>"+elem.name+"</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers).on("mouseover", mouseFunction);
                        oms.addMarker(marker);
                        break;
                    case "Veranstaltung":
                        var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {ID, icon:yellowIcon}).bindPopup("<span style=color:#ffbb33;>"+elem.service_type+"</span><br><b>"+elem.name+"</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers).on("mouseover", mouseFunction);
                        oms.addMarker(marker);
                        break;
                    case "Beratungsangebot":
                    case "Bildungsangebot":
                        var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {ID, icon:redIcon}).bindPopup("<span style=color:#ff4444;>"+elem.service_type+"</span><br><b>"+elem.name+"</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers).on("mouseover", mouseFunction);
                        oms.addMarker(marker);
                        break;
                                
                } 
            }
            
        });

        map.addLayer(markers);
        map.fitBounds(markers.getBounds(), {padding: [50, 50]});
        console.log(service_types);
        if(jQuery.inArray("Projekt", service_types) > -1){
            $("#jump-projects").show();
        }else{
            $("#jump-projects").hide();
        }
        if(jQuery.inArray("Bildungsangebot", service_types) > -1 || jQuery.inArray("Beratungsangebot", service_types) > -1){
            $("#jump-offers").show();
        }else{
            $("#jump-offers").hide();
        }
        if(jQuery.inArray("Veranstaltung", service_types) > -1){
            $("#jump-events").show();
        }else{
            $("#jump-events").hide();
        }
    });
}
$( "#jump-projects" ).click(function() {
    first_project = marker_data[service_types.indexOf("Projekt")].id;
    let selected_div = document.getElementById(first_project+"_div");
    scrollParentToChild(list_wrapper, selected_div);
});

$( "#jump-offers" ).click(function() {
    first_offer = marker_data[service_types.indexOf("Bildungsangebot")].id;
    let selected_div = document.getElementById(first_offer+"_div");
    scrollParentToChild(list_wrapper, selected_div);
});

$( "#jump-events" ).click(function() {
    first_event = marker_data[service_types.indexOf("Veranstaltung")].id;
    let selected_div = document.getElementById(first_event+"_div");
    scrollParentToChild(list_wrapper, selected_div);
});

//getAPIData(urls);

$(".filter-button").click(function() {
    setTimeout(function () {
        adjust_result_div_height();
    }, 50);
    
});

$("#search_input").keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == "13"){
        $(".search-button").click();
    }
  });


    $( ".search-button" ).click(function() {
        getDataPoints();
    });

    getDataPoints();

    function getDataPoints(){

        urls = [];
        
        if($("#alle-btn").is(":checked")){
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=project");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=store");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=education");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=counseling");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&upcoming");
        }
        if($("#initiative-btn").is(":checked")){
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=project");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=store");
        }
        if($("#angebote-btn").is(":checked")){
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=education");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=counseling");
        }
        if($("#veranstaltungen-btn").is(":checked")){
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&upcoming");
        }
        if(!($.trim($("#search_input").val()) == "")){
            
            $.each( urls, function( key, value ) {
                urls[key] = value + "&text=" + $("#search_input").val();
              });
          }
          if(!($.trim($("#startDate").val()) == "") && ($.trim($("#endDate").val()) == "")){
            $.each( urls, function( key, value ) {
                if (~value.indexOf("upcoming")){
                    urls[key] = value.replace("upcoming","upcoming=" + $("#startDate").val());
                }
                console.log(urls[key]);
              });
          }

          if(!($.trim($("#startDate").val()) == "") && !($.trim($("#endDate").val()) == "")){
            const listDate = [];
            const startDate = Date.parse($("#startDate").val());
            const endDate = Date.parse($("#endDate").val());
            const dateMove = new Date(startDate);
            let endDate2 = new Date(endDate);
            let strDate = startDate;
            
            while (dateMove <= endDate2) {
              let formatDate = moment(dateMove).format("DD-MM-YYYY");
              listDate.push(formatDate);
              dateMove.setDate(dateMove.getDate() + 1);
            };

            $.each( urls, function( key, value ) {
                if (~value.indexOf("upcoming")){
                    urls.splice(key,1);
                }
              });

              $.each( listDate, function( key, value ) {
                var url_date = "https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&timestamp=" + value;
                url_date = url_date.replace(/#038;/g, "");
                urls.push(url_date);
              });
          }

        var region_arr = [], category_arr = [];
        if(default_var === 0){
            region_arr = default_regions;
            category_arr = default_categories;
            default_var = 1;
        }else{
            region_arr = $("#regions_picker").val();
            category_arr = $("#kategorie_picker").val();
        }

        console.log(region_arr);

          let ext_arr = [];
          //loop through each region
          if(region_arr.length > 0){
            $.each( region_arr, function( region_key, region_val ) {
                $.each( urls, function( url_key, url_value ) {
                    let int_url = url_value + "&region_id=" + region_val;
                    int_url = int_url.replace(/#038;/g, "");
                    ext_arr.push(int_url);
                });
              });
          }
          //loop through each category
          let pre_length = ext_arr.length;
          let ext_arr_cat = [];
          if(category_arr.length > 0){
            $.each( category_arr, function( cat_key, cat_val ) {
                if(pre_length > 0){
                    $.each(ext_arr, function( url_key, url_value ) {
                        console.log(url_value);
                        let int_cat_url = url_value + "&category_id=" + cat_val;
                        int_cat_url = int_cat_url.replace(/#038;/g, "");
                        //ext_arr.splice(url_key, 1);
                        ext_arr_cat.push(int_cat_url);
                    });
                }else{
                    $.each( urls, function( url_key, url_value ) {
                        console.log(url_value);
                        let int_url = url_value + "&category_id=" + cat_val;
                        int_url = int_url.replace(/#038;/g, "");
                        ext_arr.push(int_url);
                    });
                }
            });
            if(pre_length > 0){
                ext_arr = ext_arr_cat;
            }
          }

          if(region_arr.length > 0 || category_arr.length > 0){
            getAPIData(ext_arr);
          }else{
            getAPIData(urls);
          }


          console.log(ext_arr);


        
        
        /*if($("#alle-btn").is(":checked")){
            urls = [
                "https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=education&region_id=106", 
                "https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=counseling&region_id=106", 
                "https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&upcoming&region_id=106"
            ]
        }else if(){

        }*/
        $("#extended_filters").collapse("hide");

        setTimeout(function () {
            adjust_result_div_height();
        }, 50);


      };

    
      
    function mouseFunction(e) {
        this.openPopup();
    }

    function clickFunction(e) {
        //map.panTo(this.getLatLng());
        let selected_div = document.getElementById(e.target.options.ID+"_div");
        if(!former_div){
            former_div = selected_div;
        }else{
            console.log(former_div);
            former_div.style.backgroundColor="";
            former_div = selected_div;
        }
        scrollParentToChild(list_wrapper, selected_div);
        selected_div.style.backgroundColor="#D3D3D3";
        console.log(e.target.options.ID);
    }

    $(document).on("click",".marker_click",function(e) {
        var marker_id_long = e.target.id;
        var marker_id = marker_id_long.substr(0, marker_id_long.indexOf("_"));
        let selected_div = document.getElementById(marker_id+"_div");
        if(!former_div){
            former_div = selected_div;
        }else{
            console.log(former_div);
            former_div.style.backgroundColor="";
            former_div = selected_div;
        }
        scrollParentToChild(list_wrapper, selected_div);
        selected_div.style.backgroundColor="#D3D3D3";
        if ($(window).width() < 576) {
            $(selected_div)[0].scrollIntoView({
                behavior: "smooth", // or "auto" or "instant"
                block: "start" // or "end"
            });
        }
    });

    $(document).on("click",".modal_link",function(e) {
        $(".modal-content").animate({ scrollTop: 0 });
        $("#infoModal").modal("show");
        $("#info-modal-content").LoadingOverlay("show",{
            image       : "",
            fontawesome : "fa fa-recycle fa-spin",
            zindex: 3
        });
        
        var marker_id_long = e.target.id;
        var marker_id = marker_id_long.substr(0, marker_id_long.indexOf("_"));
        let selected_div = document.getElementById(marker_id+"_div");
        if(!former_div){
            former_div = selected_div;
        }else{
            former_div.style.backgroundColor="";
            former_div = selected_div;
        }
        selected_div.style.backgroundColor="#D3D3D3";
        var obj = marker_data.find(x => x.id === parseInt(marker_id));
        if(obj.latlng != null){
            map.panTo([obj.latlng[0], obj.latlng[1]]);
        }
        let marker_arr=markers.getLayers();
        marker_arr.forEach(function(market) {
            if(market.options.ID == marker_id){
              market.openPopup();
            }
          });
          //show important stuff
          $("#info-modal-organisation").text("");
          var hint_card = document.getElementById("info-modal-hint-card");
          hint_card.style.display  = "block";
            var category_accord = document.getElementById("category_accordion");
            category_accord.style.display  = "block";
            var organisation_info = document.getElementById("info-modal-organisation-card");
          organisation_info.style.display  = "block";
          
          let entry_obj = {"type":0,"id":marker_id};
          entry_tap.push(entry_obj);
          console.log(entry_tap);
          
          if(entry_tap.length > 1){
            $("#info-modal-back").show();
          }else{
            $("#info-modal-back").hide();
          }
          
          $("#info-modal-date-card").hide();
          console.log(obj.user_id);
        $.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/users/" + obj.user_id + ".json", function( organisation_data ) {
            $("#info-modal-organisation").text(organisation_data.name);
            $("#info-modal-organisation").attr("data-link", organisation_data.id);
            if(organisation_data.email != null){
                $("#info-modal-email").text(organisation_data.email);
                $("#info-modal-email").prop("href", "mailto:" + organisation_data.email);
            }else{
                $("#info-modal-email").text("Keine Mail-Adresse vorhanden.");
                $("#info-modal-email").removeAttr("href");
            }
            if(organisation_data.telephone != null){
                $("#info-modal-telephone").text(organisation_data.phone_primary);
                $("#info-modal-telephone").prop("href", "tel:"+organisation_data.phone_primary);
            }else{
                $("#info-modal-telephone").text("Keine Telefon-Nr. vorhanden.");
                $("#info-modal-telephone").removeAttr("href");
            }
            $("#info-modal-content").LoadingOverlay("hide");
        });
        $("#info-modal-title").text(obj.name);
        $("#info-modal-type").text(obj.service_type);
        if(obj.description != null){
            $("#info-modal-text").text(obj.description);
        }else{
            $("#info-modal-text").text("Keine Beschreibung hinterlegt.");
        }
        if(obj.requirements != null){
            $("#info-modal-hints").text(obj.requirements);
        }else{
            $("#info-modal-hints").text("Keine Hinweise.");
        }
        if(obj.info_url!= null){
            if(!obj.info_url.startsWith("https") || !obj.info_url.startsWith("http")){
                obj.info_url = "https://" + obj.info_url;
            }
            $("#info-modal-website").prop("href", obj.info_url);
            $("#info-modal-website").text("Website");
        }else{
            $("#info-modal-website").text("Keine Website vorhanden.");
            $("#info-modal-website").removeAttr("href");
        }
        $("#info-modal-address").text(obj.full_address);
        $("#info-modal-route").prop("href", "https://www.google.com/maps/dir/?api=1&destination="+obj.full_address);
        $("#info-modal-photo").LoadingOverlay("show",{
            image       : "",
            fontawesome : "fa fa-recycle fa-spin",
            zindex: 3
        });
        setTimeout(function(){
            $("#info-modal-photo").LoadingOverlay("hide");
        }, 500);
        switch(obj.service_type){
            case "Projekt":
                obj.color = "#4169E1"; //blue
                $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/project.png");
                break;
            case "Filiale":
                obj.color = "#4169E1"; //blue
                $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/store.png");
                break;
            case "Veranstaltung":
                obj.color = "#FFBF00"; //yellow
                $("#info-modal-date-card").show();
                $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/event.png");
                if(obj.start_at != null){
                    let start_date = moment(obj.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                    $("#info-modal-date").text("Start: " + start_date);
                }
                if(obj.end_at != null){
                    let end_date = moment(obj.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                    $("#info-modal-date").text("Ende: " + end_date);
                }
                if((obj.end_at != null) && (obj.end_at != null)){
                    let start_date = moment(obj.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                    let end_date = moment(obj.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                    $("#info-modal-date").text(start_date + " - " + end_date);
                }
                break;
            case "Beratungsangebot":
                $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/offer.png");
                obj.color = "#D2042D"; //red
                break;
            case "Bildungsangebot":
                $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/education.png");
                obj.color = "#D2042D"; //red
                break;
            }
            if(obj.image_url_base != null){
                $("#info-modal-photo").attr("src", obj.image_url_base + "?width=200&height=200");
            }
        document.getElementById("info-modal-header").style.borderBottomColor = obj.color;
        $("#info-modal-type").css("color", obj.color);
        console.log(obj.color);

        //add toolbar-btn

        const toolbar_group = document.getElementById("toolbar-group");

        var toolbar_btn_html = "";

        if(obj.region == null){
            obj.region = [];
            obj.region.name = obj.city;
        }

        toolbar_btn_html += `<input type="checkbox" class="btn-check" autocomplete="off">
        <label class="btn btn-outline-danger filter-btn-unterkategorie">${obj.region.name}</label><br>`;

        $.each(obj.categories, function( key, value ) {
            var category_obj = categories_array.find(x => x.id === parseInt(value));
            toolbar_btn_html += `<input type="checkbox" class="btn-check" autocomplete="off">
            <label class="btn btn-outline-info filter-btn-unterkategorie">${category_obj.name}</label><br>`;
          });

          $.each(obj.goals, function( key, value ) {
            toolbar_btn_html += `<input type="checkbox" class="btn-check" autocomplete="off">
            <label class="btn btn-outline-secondary filter-btn-unterkategorie" for="btn-check-1-outlined">${value}</label><br>`;
          });


          toolbar_group.innerHTML = toolbar_btn_html;

        
        if (single_marker != undefined) {
            map2.removeLayer(single_marker);
          };
          if(obj.latlng == null && obj.full_address != null){
            $.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + obj.full_address, function( obj_latlng_data ) {
                if(obj_latlng_data.length != 0){
                    obj.latlng = [obj_latlng_data[0].lat, obj_latlng_data[0].lon];
                    switch(obj.service_type){
                        case "Projekt":
                        case "Filiale":
                            single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {icon:blueIcon}).addTo(map2).bindPopup("<b>"+obj.name+"</b>");
                            break;
                        case "Veranstaltung":
                            single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {icon:yellowIcon}).addTo(map2).bindPopup("<b>"+obj.name+"</b>");
                            break;
                        case "Beratungsangebot":
                        case "Bildungsangebot":
                            single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {icon:redIcon}).addTo(map2).bindPopup("<b>"+obj.name+"</b>");
                            break;			
                    }
                    map2.setView([obj.latlng[0], obj.latlng[1]], 13);
                }
            });
        }else if (obj.latlng != null ){
            switch(obj.service_type){
                case "Projekt":
                case "Filiale":
                    single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {icon:blueIcon}).addTo(map2).bindPopup("<b>"+obj.name+"</b>");
                    break;
                case "Veranstaltung":
                    single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {icon:yellowIcon}).addTo(map2).bindPopup("<b>"+obj.name+"</b>");
                    break;
                case "Beratungsangebot":
                case "Bildungsangebot":
                    single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {icon:redIcon}).addTo(map2).bindPopup("<b>"+obj.name+"</b>");
                    break;			
            }
            map2.setView([obj.latlng[0], obj.latlng[1]], 13);
        }

        // fil div info-modal-organisation-data with all data
        var org_data_arr = marker_data.filter(x => (x.user_id === parseInt(obj.user_id)) && (x.id != parseInt(obj.id)));
        if(org_data_arr.length > 0){
            org_data_container.innerHTML = returnOrgActivities(org_data_arr);
        }else{
            org_data_container.innerHTML = "<p>Leider keine weiteren Angebote/Veranstaltungen vorhanden!</p>"
        }
    });

    //organisation info in modal

    $(document).on("click",".organisation_link",function(e) { 
        $(".modal-content").animate({ scrollTop: 0 });
        $("#infoModal").modal("show");
        $("#info-modal-content").LoadingOverlay("show",{
            image       : "",
            fontawesome : "fa fa-recycle fa-spin",
            zindex: 3
        });
        var org_id = $("#info-modal-organisation").attr("data-link");
        
        let entry_obj = {"type":1,"id":org_id};
        entry_tap.push(entry_obj);
        
        console.log(entry_tap);
        //hide unnecessary stuff
        $("#info-modal-organisation").text("");
        var hint_card = document.getElementById("info-modal-hint-card");
        hint_card.style.display  = "none";
          var category_accord = document.getElementById("category_accordion");
          category_accord.style.display  = "none";
          var organisation_info = document.getElementById("info-modal-organisation-card");
          organisation_info.style.display  = "none";
          $("#info-modal-back").show();
          $("#info-modal-date-card").hide();
          console.log(org_id);
        $.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/users/" + org_id + ".json", function( organisation_data ) {
            $("#info-modal-title").text(organisation_data.name);
            $("#info-modal-photo").LoadingOverlay("show",{
                image       : "",
                fontawesome : "fa fa-recycle fa-spin",
                zindex: 3
            });
            setTimeout(function(){
                $("#info-modal-photo").LoadingOverlay("hide");
            }, 500);
            if(organisation_data.organization_logo_url_base != null){
                $("#info-modal-photo").attr("src", organisation_data.organization_logo_url_base + "?width=200&height=200");
            }else{
                $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/organisation_default.png");
            }
            $("#info-modal-type").text("Organisation");
            if(organisation_data.description != null){
                $("#info-modal-text").text(organisation_data.description);
            }else{
                $("#info-modal-text").text("-");
            }
            $("#info-modal-hints").text("");
            $("#info-modal-address").text(organisation_data.full_address);
            $("#info-modal-route").prop("href", "https://www.google.com/maps/dir/?api=1&destination="+organisation_data.full_address);
            
            /*if(organisation_data.website != null){
                $("#info-modal-website").prop("href", organisation_data.info_url);
                $("#info-modal-website").text("Website");
            }else{
                $("#info-modal-website").text("Keine Website vorhanden.");
                $("#info-modal-website").removeAttr("href");
            }*/
            if(organisation_data.email != null){
                $("#info-modal-email").text(organisation_data.email);
                $("#info-modal-email").prop("href", "mailto:" + organisation_data.email);
            }else{
                $("#info-modal-email").text("Keine Mail-Adresse vorhanden.");
                $("#info-modal-email").removeAttr("href");
            }
            if(organisation_data.telephone != null){
                $("#info-modal-telephone").text(organisation_data.phone_primary);
                $("#info-modal-telephone").prop("href", "tel:"+organisation_data.phone_primary);
            }else{
                $("#info-modal-telephone").text("Keine Telefon-Nr. vorhanden.");
                $("#info-modal-telephone").removeAttr("href");
            }


            if (single_marker != undefined) {
                map2.removeLayer(single_marker);
              };

            if(organisation_data.latlng == null){
                $.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + organisation_data.full_address, function( organisation_latlng_data ) {
                    organisation_data.latlng = [organisation_latlng_data[0].lat, organisation_latlng_data[0].lon];
                    single_marker = L.marker([organisation_data.latlng[0], organisation_data.latlng[1]]).addTo(map2)
                    .bindPopup("<b>"+organisation_data.name+"</b>");
                    map2.setView([organisation_data.latlng[0], organisation_data.latlng[1]], 13);
                });
            }else{
                single_marker = L.marker([organisation_data.latlng[0], organisation_data.latlng[1]]).addTo(map2)
                .bindPopup("<b>"+organisation_data.name+"</b>");
                map2.setView([organisation_data.latlng[0], organisation_data.latlng[1]], 13);
            }
            $("#info-modal-content").LoadingOverlay("hide");
        });

        // fil div info-modal-organisation-data with all data

        var org_data_arr = marker_data.filter(x => x.user_id === parseInt(org_id));
        if(org_data_arr.length > 0){
            org_data_container.innerHTML = returnOrgActivities(org_data_arr);
        }else{
            org_data_container.innerHTML = "<p>Leider keine weiteren Angebote/Veranstaltungen vorhanden!</p>"
        }

        document.getElementById("info-modal-header").style.borderBottomColor = "#008000";

        //add toolbar-btn

        const toolbar_group = document.getElementById("toolbar-group");

        var toolbar_btn_html = "";

          toolbar_group.innerHTML = toolbar_btn_html;
    });

    $("#infoModal").on("hidden.bs.modal", function () {
        entry_tap = [];
      })

});//end

function getLoc(zoomLevel) {
    map.setView([51.3406, 12.3747], zoomLevel); // ([lat, lng], zoom)
};

function adjust_result_div_height(){
    if ($(window).width() < 576) {
        document.getElementById("results_filter_div").style.height = "1000px";
    }
    var height_parent_div = document.querySelector("#results_filter_div").offsetHeight;
    var height_search_div = document.querySelector("#search_div").offsetHeight;
    var height_jump_div = document.querySelector("#go-to-div").offsetHeight;
    document.getElementById("list_wrapper").style.height = height_parent_div - height_search_div - height_jump_div - 50 + "px";
}

function goBackFunction(e) {
    entry_tap.pop();
    let entry_tap_id = entry_tap[entry_tap.length-1].id;
    console.log(entry_tap_id);
    if(entry_tap[entry_tap.length-1].type === 1){
        $(".organisation_link").click();
        entry_tap.pop();
    }else{
        $("#" + entry_tap_id + "_link").click();
        entry_tap.pop();
        if(entry_tap.length > 1){
            $("#info-modal-back").show();
          }else{
            $("#info-modal-back").hide();
          }
    }
}
