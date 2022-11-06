document.addEventListener("DOMContentLoaded", function () {

    var container3 = document.getElementById("list_wrapper");
    var observer3 = ResizeObserver && new ResizeObserver(function () {
        adjust_result_div_height();
    });
    observer3 && observer3.observe(container3);

    if (jQuery(window).width() < 576) {
        document.getElementById("results_filter_div").style.height = default_height + 200 + "px";
    }else if (jQuery(window).width() > 576) {
        document.getElementById("results_filter_div").style.height = default_height + "px";
    }

    const list_container = document.getElementById("list_wrapper");
    const org_data_container = document.getElementById("info-modal-organisation-data");

    function returnCards(markets) {
        markets.forEach(function (market) {
            if (market.description != null) {
                market.shortdescription = market.description.substring(0, 150);
            }
            switch (market.service_type) {
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

        return "<div id=\"list_results\" class=\"result-list list-group list\">" + markets.map(markets => {
            let result_card = `
<div class="card result_list list-group-item-action" id="${markets.id}_div" style="border-right: solid 7px ${markets.color}">
<div class="card-body">
<p class="card_type" style="font-size:16px;margin-bottom: 3px;color:${markets.color}"><small>${markets.service_type}</small></p>
<div class="row" style="margin-bottom: 5px;">
<h5><a class="modal_link link-dark stretched-link card_title" id="${markets.id}_link" style="font-size:18px;">${markets.name}</a></h5>
</div>
<p>`;
            let act_time;
            if (markets.start_at != null) {
                let start_date = moment(markets.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>Start: ${start_date}</span>
<br>`;
            }
            if (markets.end_at != null) {
                let end_date = moment(markets.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>Ende: ${end_date}</span>
<br>`;
            }
            if ((markets.end_at != null) && (markets.end_at != null)) {
                let start_date = moment(markets.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                let end_date = moment(markets.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>${start_date} - ${end_date}</span>
<br>`;
            }
            if (act_time != null) {
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
        data_arr.forEach(function (market) {
            if (market.description != null) {
                market.shortdescription = market.description.substring(0, 150);
            }
            switch (market.service_type) {
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

        return "<div id=\"org_activities\" class=\"list-group list\">" + data_arr.map(data_single => {
            let act_card = `
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
            if (data_single.start_at != null) {
                let start_date = moment(data_single.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>Start: ${start_date}</span>
    <br>`;
            }
            if (data_single.end_at != null) {
                let end_date = moment(data_single.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>Ende: ${end_date}</span>
    <br>`;
            }
            if ((data_single.end_at != null) && (data_single.end_at != null)) {
                let start_date = moment(data_single.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                let end_date = moment(data_single.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                act_time = `<i class="fa fa-clock" aria-hidden="true"></i>&nbsp;<span>${start_date} - ${end_date}</span>
    <br>`;
            }
            if (act_time != null) {
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



    var center = [51.340199, 12.360103]; //51.340199,12.360103

    var layer = L.tileLayer(themeUrl, {
        themeAttribution
    })
    var layer2 = L.tileLayer(themeUrl, {
        themeAttribution
    })

    map = L.map("leaflet_map", {
        center: center,
        layers: [layer]
    });
    //map.scrollWheelZoom.disable();

        oms = new OverlappingMarkerSpiderfier(map, {
            keepSpiderfied: true
        });

        oms.addListener("click", function (marker) {
            //map.panTo(marker.getLatLng());
            marker.openPopup();
            let selected_div = document.getElementById(marker.options.ID + "_div");
            if (!former_div) {
                former_div = selected_div;
            } else {
                former_div.style.backgroundColor = "";
                former_div = selected_div;
            }
            scrollParentToChild(list_wrapper, selected_div);
            selected_div.style.backgroundColor = "#D3D3D3";
        });
        oms.addListener("spiderfy", function (markers) {
            map.closePopup();
        });
        oms.addListener("unspiderfy", function (markers) {

        });


    map2 = L.map("leaflet_small_map", {
        center: center,
        layers: [layer2],
        zoom: 12
    });
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
            map.setView([51.340199, 12.360103], 13);
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
    var observer = ResizeObserver && new ResizeObserver(function () {
        map.invalidateSize(true);
    });
    observer && observer.observe(container);

    var container2 = document.getElementById("leaflet_small_map");
    var observer2 = ResizeObserver && new ResizeObserver(function () {
        map2.invalidateSize(true);
    });


    observer2 && observer2.observe(container2);

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
        // if you cant see the child try to scroll parent
        //if (!isViewable) {
        // scroll by offset relative to parent
        parent.scrollTop = (childRect.top + parent.scrollTop) - (parentRect.top + 200)
        //}

    }

    jQuery(".input-daterange").datepicker({
        format: "dd.mm.yyyy",
        weekStart: 1,
        todayBtn: true,
        language: "de",
        clearBtn: true,
        beforeShowDay: function (date) {
            if (date.getMonth() == (new Date()).getMonth())
                switch (date.getDate()) {
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

    jQuery(".swalDefaultQuestion").click(function () {
        Toast.fire({
            icon: "question",
            title: "Um die Ergebnisse zu filtern, klickst du einfach auf die Kategorien Initiativen, Angebote und Veranstaltungen, gibst ein Stichwort in der Suche ein oder wählst einen Zeitraum für Veranstaltungen aus."
        })
    });

    jQuery("#extendedSwal").click(function () {
        Toast.fire({
            icon: "question",
            title: "Hier kannst du die Ergebnisse noch feiner filtern. Regionen: Wähle hier deine Ziel-Region(en) aus. Kategorien: Hier wählst du aus, ob du lieber Initiativen zum Umweltschutz oder zum Thema Globale Verantwortung sehen möchtest. Start & Ende: Hier gibst du an, in welchem Zeitraum dir Veranstaltungen angezeigt werden sollen. Falls du nichts angibst, werden dir alle kommenden Veranstaltungen angezeigt."
        })
    });

    jQuery("#redoButton").click(function () {
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        jQuery("#regions_picker").selectpicker("deselectAll");
        jQuery("#kategorie_picker").selectpicker("deselectAll");

        jQuery("#regions_picker").selectpicker("refresh");
        jQuery("#regions_picker").selectpicker("val", default_regions);

        jQuery("#kategorie_picker").selectpicker("refresh");
        jQuery("#kategorie_picker").selectpicker("val", default_categories);

        jQuery(".check-category-single").prop("checked", false);
        jQuery("#alle-btn").prop("checked", true);
    });



    jQuery("#alle-btn").change(function () {
        jQuery(".check-category-single").prop("checked", false);
    });

    jQuery(".check-category-single").change(function () {
        if (jQuery(".check-category-single:checked").length == jQuery(".check-category-single").length) {
            jQuery("#alle-btn").prop("checked", true);
            jQuery(".check-category-single").prop("checked", false);
        } else {
            jQuery("#alle-btn").prop("checked", false);
        }
    });

    jQuery("#thisWeek").click(function () {
        var curr = new Date; // get current date
        var first = curr.getDate() - (curr.getDay() - 1); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        document.getElementById("startDate").value = new Date(curr.setDate(first)).toISOString().substring(0, 10);
        document.getElementById("endDate").value = new Date(curr.setDate(last)).toISOString().substring(0, 10);
    });

    jQuery("#thisMonth").click(function () {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        document.getElementById("startDate").value = firstDay.toISOString().substring(0, 10);
        document.getElementById("endDate").value = lastDay.toISOString().substring(0, 10);
    });

    jQuery("#clearThis").click(function () {
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
    });


    jQuery.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/categories.json", function (data) {

        categories_array = data;

        jQuery.each(data, function (ind, elem) {
            if (elem.depth == 0) {
                jQuery("#kategorie_picker").append(jQuery("<option>", {
                    value: elem.id,
                    text: elem.name
                }));
            }

        });
        jQuery("#kategorie_picker").selectpicker("refresh");
        jQuery("#kategorie_picker").selectpicker("val", default_categories);

    });

    jQuery.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/regions.json", function (data) {
        jQuery.each(data, function (ind, elem) {

            jQuery("#regions_picker").append(jQuery("<option>", {
                value: elem.id,
                text: elem.name
            }));
        });
        jQuery("#regions_picker").selectpicker("refresh");
        jQuery("#regions_picker").selectpicker("val", default_regions);
    });

    jQuery.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json", function (activities_data) {
        all_data = activities_data;
    });


    function getAPIData(web_addresses) {
        jQuery("#list_wrapper").LoadingOverlay("show", {
            image: "",
            fontawesome: "fa fa-recycle fa-spin"
        });
        document.getElementById("map_wrapper").style.zIndex = "1";
        jQuery("#map_wrapper").LoadingOverlay("show", {
            image: "",
            fontawesome: "fa fa-recycle fa-spin"
        });
        jQuery.when.apply(jQuery, web_addresses.map(function (url) {
            return jQuery.getJSON(url);
        })).done(function () {
            jQuery("#list_wrapper").LoadingOverlay("hide");
            jQuery("#map_wraper").LoadingOverlay("hide");
            document.getElementById("map_wrapper").style.zIndex = "6";
            jQuery(".loadingoverlay").css('z-index', 4);
            var data_helper = [];
            // there will be one argument passed to this callback for each ajax call
            // each argument is of this form [data, statusText, jqXHR]
            if ((web_addresses.length > 1)) {
                for (var i = 0; i < arguments.length; i++) {
                    data_helper.push(arguments[i][0]);
                    var data = [].concat.apply([], data_helper);
                }
            } else {
                var data = arguments[0];
            }
            // all data is now in the results array in order
            //console.log(data);
            marker_data = data;
            /*if(markets.length > 0) {
            
            }*/
            if(data.length > 0){
                list_container.innerHTML = returnCards(data);
            }else{
                list_container.innerHTML = '<div class="card"><div class="card-body"><h5 style="font-size:20px;">Keine Ergebnisse gefunden. Bitte noch einmal suchen!</h5></div></div>';
            }

            var options = {
                valueNames: ["card_type", "card_title", "card_description"]
            };
            setTimeout(function () {
                var search_list = new List("another_wrap", options);
            }, 2500);




            jQuery("#info-result-number").text(data.length + " Ergebnisse");

            if (typeof markers != "undefined") {
                map.removeLayer(markers);
            }

            var corner1 = L.latLng(50.1609,11.8531);
            var corner2 = L.latLng(51.6907, 15.0705);
            var bounds  = L.latLngBounds(corner1, corner2);
            map.fitBounds(bounds, {
                padding: [50, 50]
            }); 


            oms.clearMarkers();

            markers = L.featureGroup();
            var promises = [];

            service_types = [];

            jQuery.each(data, function (ind, elem) {
                service_types.push(elem.service_type);
                var ID = elem.id;

                if (elem.latlng == null && elem.full_address != null) {
                    promises.push(jQuery.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + elem.full_address, function (latlng_data) {
                        if (latlng_data.length != 0) {
                            elem.latlng = [latlng_data[0].lat, latlng_data[0].lon];
                            switch (elem.service_type) {
                                case "Projekt":
                                case "Filiale":
                                    var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {
                                        ID,
                                        icon: blueIcon
                                    }).bindPopup("<span style=color:#4285F4;>" + elem.service_type + "</span><br><b>" + elem.name + "</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers);
                                    oms.addMarker(marker);
                                    break;
                                case "Veranstaltung":
                                    var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {
                                        ID,
                                        icon: yellowIcon
                                    }).bindPopup("<span style=color:#ffbb33;>" + elem.service_type + "</span><br><b>" + elem.name + "</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers);
                                    oms.addMarker(marker);
                                    break;
                                case "Beratungsangebot":
                                case "Bildungsangebot":
                                    var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {
                                        ID,
                                        icon: redIcon
                                    }).bindPopup("<span style=color:#ff4444;>" + elem.service_type + "</span><br><b>" + elem.name + "</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers);
                                    oms.addMarker(marker);
                                    break;
                            }
                        }
                    }));
                } else if (elem.latlng != null) {
                    switch (elem.service_type) {
                        case "Projekt":
                        case "Filiale":
                            var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {
                                ID,
                                icon: blueIcon
                            }).bindPopup("<span style=color:#4285F4;>" + elem.service_type + "</span><br><b>" + elem.name + "</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers);
                            oms.addMarker(marker);
                            break;
                        case "Veranstaltung":
                            var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {
                                ID,
                                icon: yellowIcon
                            }).bindPopup("<span style=color:#ffbb33;>" + elem.service_type + "</span><br><b>" + elem.name + "</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers);
                            oms.addMarker(marker);
                            break;
                        case "Beratungsangebot":
                        case "Bildungsangebot":
                            var marker = new L.marker([elem.latlng[0], elem.latlng[1]], {
                                ID,
                                icon: redIcon
                            }).bindPopup("<span style=color:#ff4444;>" + elem.service_type + "</span><br><b>" + elem.name + "</b><br><button class=marker_click id=" + ID + "_marker>Kurzinfo</button> | <button class=modal_link id=" + ID + "_link>Detailliert</button>").addTo(markers);
                            oms.addMarker(marker);
                            break;

                    }
                }

            });
            if(promises.length > 0 && data.length > 0){
                jQuery.when.apply($, promises).then(function(){
                    map.addLayer(markers);
                    map.fitBounds(markers.getBounds(), {
                        padding: [50, 50]
                    });
                });
            }else if (data.length > 0){
                map.addLayer(markers);
                map.fitBounds(markers.getBounds(), {
                    padding: [50, 50]
                });
            }
            if (jQuery.inArray("Projekt", service_types) > -1) {
                jQuery("#jump-projects").show();
            } else {
                jQuery("#jump-projects").hide();
            }
            if (jQuery.inArray("Bildungsangebot", service_types) > -1 || jQuery.inArray("Beratungsangebot", service_types) > -1) {
                jQuery("#jump-offers").show();
            } else {
                jQuery("#jump-offers").hide();
            }
            if (jQuery.inArray("Veranstaltung", service_types) > -1) {
                jQuery("#jump-events").show();
            } else {
                jQuery("#jump-events").hide();
            }
        });
    }
    jQuery("#jump-projects").click(function () {
        first_project = marker_data[service_types.indexOf("Projekt")].id;
        let selected_div = document.getElementById(first_project + "_div");
        scrollParentToChild(list_wrapper, selected_div);
    });

    jQuery("#jump-offers").click(function () {
        first_offer = marker_data[service_types.indexOf("Bildungsangebot")].id;
        let selected_div = document.getElementById(first_offer + "_div");
        scrollParentToChild(list_wrapper, selected_div);
    });

    jQuery("#jump-events").click(function () {
        first_event = marker_data[service_types.indexOf("Veranstaltung")].id;
        let selected_div = document.getElementById(first_event + "_div");
        scrollParentToChild(list_wrapper, selected_div);
    });

    //getAPIData(urls);

    jQuery(".filter-button").click(function () {
        setTimeout(function () {
            adjust_result_div_height();
        }, 50);
    });

    jQuery('#extended_filters').on('shown.bs.collapse', function () {
        setTimeout(function () {
            adjust_result_div_height();
        }, 50);
     });
     
     jQuery('#extended_filters').on('hidden.bs.collapse', function () {
        setTimeout(function () {
            adjust_result_div_height();
        }, 50);
     });

    jQuery("#search_input").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == "13") {
            jQuery(".search-button").click();
        }
    });


    jQuery(".search-button").click(function () {
        getDataPoints();
    });

    getDataPoints();

    function getDataPoints() {

        urls = [];
        var search_var = 0;

        if (jQuery("#alle-btn").is(":checked")) {
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=project");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=store");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=education");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=counseling");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&upcoming");
        }
        if (jQuery("#initiative-btn").is(":checked")) {
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=project");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=store");
        }
        if (jQuery("#angebote-btn").is(":checked")) {
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=education");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=counseling");
        }
        if (jQuery("#veranstaltungen-btn").is(":checked")) {
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&upcoming");
        }
        if (!(jQuery.trim(jQuery("#search_input").val()) == "")) {
            search_var = 1;
            urls = [];
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=project");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=store");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=education");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=counseling");
            urls.push("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&upcoming");

            jQuery.each(urls, function (key, value) {
                urls[key] = value + "&text=" + jQuery("#search_input").val();
            });
        }
        //console.log(urls);
        if (!(jQuery.trim(jQuery("#startDate").val()) == "") && (jQuery.trim(jQuery("#endDate").val()) == "")) {
            jQuery.each(urls, function (key, value) {
                if (~value.indexOf("upcoming")) {
                    urls[key] = value.replace("upcoming", "upcoming=" + jQuery("#startDate").val());
                }
                //console.log(urls[key]);
            });
        }

        if (!(jQuery.trim(jQuery("#startDate").val()) == "") && !(jQuery.trim(jQuery("#endDate").val()) == "")) {
            const listDate = [];
            const startDate = Date.parse(jQuery("#startDate").val());
            const endDate = Date.parse(jQuery("#endDate").val());
            const dateMove = new Date(startDate);
            let endDate2 = new Date(endDate);
            let strDate = startDate;

            while (dateMove <= endDate2) {
                let formatDate = moment(dateMove).format("DD-MM-YYYY");
                listDate.push(formatDate);
                dateMove.setDate(dateMove.getDate() + 1);
            };

            jQuery.each(urls, function (key, value) {
                if (~value.indexOf("upcoming")) {
                    urls.splice(key, 1);
                }
            });

            jQuery.each(listDate, function (key, value) {
                var url_date = "https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&timestamp=" + value;
                url_date = url_date.replace(/#038;/g, "");
                urls.push(url_date);
            });
        }

        var region_arr = [],
            category_arr = [];
        if (default_var === 0) {
            if(default_regions){
                region_arr = default_regions;
            }
            if(default_categories){
                category_arr = default_categories;
            }
            default_var = 1;
        } else {
            region_arr = jQuery("#regions_picker").val(); 
            category_arr = jQuery("#kategorie_picker").val();
        }

        if (search_var == 1){
            region_arr = [];
            category_arr = [];
        }

        let ext_arr = [];
        //loop through each region
        if (region_arr.length > 0) {
            jQuery.each(region_arr, function (region_key, region_val) {
                jQuery.each(urls, function (url_key, url_value) {
                    let int_url = url_value + "&region_id=" + region_val;
                    int_url = int_url.replace(/#038;/g, "");
                    ext_arr.push(int_url);
                });
            });
        }
        //loop through each category
        let pre_length = ext_arr.length;
        let ext_arr_cat = [];
        if (category_arr.length > 0) {
            jQuery.each(category_arr, function (cat_key, cat_val) {
                if (pre_length > 0) {
                    jQuery.each(ext_arr, function (url_key, url_value) {
                        let int_cat_url = url_value + "&category_id=" + cat_val;
                        int_cat_url = int_cat_url.replace(/#038;/g, "");
                        //ext_arr.splice(url_key, 1);
                        ext_arr_cat.push(int_cat_url);
                    });
                } else {
                    jQuery.each(urls, function (url_key, url_value) {
                        let int_url = url_value + "&category_id=" + cat_val;
                        int_url = int_url.replace(/#038;/g, "");
                        ext_arr.push(int_url);
                    });
                }
            });
            if (pre_length > 0) {
                ext_arr = ext_arr_cat;
            }
        }


        if (region_arr.length > 0 || category_arr.length > 0) {
            getAPIData(ext_arr);
        } else {
            getAPIData(urls);
        }

        jQuery("#extended_filters").collapse("hide");

        setTimeout(function () {
            adjust_result_div_height();
        }, 50);


    };


    function clickFunction(e) {
        //map.panTo(this.getLatLng());
        let selected_div = document.getElementById(e.target.options.ID + "_div");
        if (!former_div) {
            former_div = selected_div;
        } else {
            former_div.style.backgroundColor = "";
            former_div = selected_div;
        }
        scrollParentToChild(list_wrapper, selected_div);
        selected_div.style.backgroundColor = "#D3D3D3";
    }

    jQuery(document).on("click", ".marker_click", function (e) {
        var marker_id_long = e.target.id;
        var marker_id = marker_id_long.substr(0, marker_id_long.indexOf("_"));
        let selected_div = document.getElementById(marker_id + "_div");
        if (!former_div) {
            former_div = selected_div;
        } else {
            former_div.style.backgroundColor = "";
            former_div = selected_div;
        }
        scrollParentToChild(list_wrapper, selected_div);
        selected_div.style.backgroundColor = "#D3D3D3";
        if (jQuery(window).width() < 576) {
            jQuery(selected_div)[0].scrollIntoView({
                behavior: "smooth", // or "auto" or "instant"
                block: "start" // or "end"
            });
        }
    });

    jQuery(document).on("click", ".modal_link", function (e) {
        jQuery(".modal-content").animate({
            scrollTop: 0
        });
        jQuery("#infoModal").modal("show");
        jQuery("#info-modal-content").LoadingOverlay("show", {
            image: "",
            fontawesome: "fa fa-recycle fa-spin",
            zindex: 3
        });

        var marker_id_long = e.target.id;
        var marker_id = marker_id_long.substr(0, marker_id_long.indexOf("_"));
        let selected_div = document.getElementById(marker_id + "_div");
        if (!former_div) {
            former_div = selected_div;
        } else {
            former_div.style.backgroundColor = "";
            former_div = selected_div;
        }
        selected_div.style.backgroundColor = "#D3D3D3";
        var obj = marker_data.find(x => x.id === parseInt(marker_id));
        if (obj.latlng != null) {
            map.panTo([obj.latlng[0], obj.latlng[1]]);
        }
        let marker_arr = markers.getLayers();
        marker_arr.forEach(function (market) {
            if (market.options.ID == marker_id) {
                market.openPopup();
            }
        });
        //show important stuff
        jQuery("#info-modal-organisation").text("");
        var hint_card = document.getElementById("info-modal-hint-card");
        hint_card.style.display = "block";
        var category_accord = document.getElementById("category_accordion");
        category_accord.style.display = "block";
        var organisation_info = document.getElementById("info-modal-organisation-card");
        organisation_info.style.display = "block";

        let entry_obj = {
            "type": 0,
            "id": marker_id
        };
        entry_tap.push(entry_obj);

        if (entry_tap.length > 1) {
            jQuery("#info-modal-back").show();
        } else {
            jQuery("#info-modal-back").hide();
        }

        jQuery("#info-modal-date-card").hide();

        jQuery.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/users/" + obj.user_id + ".json", function (organisation_data) {
            jQuery("#info-modal-organisation").text(organisation_data.name);
            jQuery("#info-modal-organisation").attr("data-link", organisation_data.id);
            if (organisation_data.email != null) {
                jQuery("#info-modal-email").text(organisation_data.email);
                jQuery("#info-modal-email").prop("href", "mailto:" + organisation_data.email);
            } else {
                jQuery("#info-modal-email").text("Keine Mail-Adresse vorhanden.");
                jQuery("#info-modal-email").removeAttr("href");
            }
            if (organisation_data.telephone != null) {
                jQuery("#info-modal-telephone").text(organisation_data.phone_primary);
                jQuery("#info-modal-telephone").prop("href", "tel:" + organisation_data.phone_primary);
            } else {
                jQuery("#info-modal-telephone").text("Keine Telefon-Nr. vorhanden.");
                jQuery("#info-modal-telephone").removeAttr("href");
            }
            jQuery("#info-modal-content").LoadingOverlay("hide");
        });
        jQuery("#info-modal-title").text(obj.name);
        jQuery("#info-modal-type").text(obj.service_type);
        if (obj.description != null) {
            jQuery("#info-modal-text").text(obj.description);
        } else {
            jQuery("#info-modal-text").text("Keine Beschreibung hinterlegt.");
        }
        if (obj.requirements != null) {
            jQuery("#info-modal-hints").text(obj.requirements);
        } else {
            jQuery("#info-modal-hints").text("Keine Hinweise.");
        }
        if (obj.info_url != null) {
            if (!obj.info_url.startsWith("https") || !obj.info_url.startsWith("http")) {
                obj.info_url = "https://" + obj.info_url;
            }
            jQuery("#info-modal-website").prop("href", obj.info_url);
            jQuery("#info-modal-website").text("Website");
        } else {
            jQuery("#info-modal-website").text("Keine Website vorhanden.");
            jQuery("#info-modal-website").removeAttr("href");
        }
        jQuery("#info-modal-address").text(obj.full_address);
        jQuery("#info-modal-route").prop("href", "https://www.google.com/maps/dir/?api=1&destination=" + obj.full_address);
        jQuery("#info-modal-photo").LoadingOverlay("show", {
            image: "",
            fontawesome: "fa fa-recycle fa-spin",
            zindex: 3
        });
        setTimeout(function () {
            jQuery("#info-modal-photo").LoadingOverlay("hide");
        }, 500);
        switch (obj.service_type) {
            case "Projekt":
                obj.color = "#4169E1"; //blue
                jQuery("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/project.png");
                break;
            case "Filiale":
                obj.color = "#4169E1"; //blue
                jQuery("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/store.png");
                break;
            case "Veranstaltung":
                obj.color = "#FFBF00"; //yellow
                jQuery("#info-modal-date-card").show();
                jQuery("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/event.png");
                if (obj.start_at != null) {
                    let start_date = moment(obj.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                    jQuery("#info-modal-date").text("Start: " + start_date);
                }
                if (obj.end_at != null) {
                    let end_date = moment(obj.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                    jQuery("#info-modal-date").text("Ende: " + end_date);
                }
                if ((obj.end_at != null) && (obj.end_at != null)) {
                    let start_date = moment(obj.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                    let end_date = moment(obj.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                    jQuery("#info-modal-date").text(start_date + " - " + end_date);
                }
                break;
            case "Beratungsangebot":
                jQuery("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/offer.png");
                obj.color = "#D2042D"; //red
                break;
            case "Bildungsangebot":
                jQuery("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/education.png");
                obj.color = "#D2042D"; //red
                break;
        }
        if (obj.image_url_base != null) {
            jQuery("#info-modal-photo").attr("src", obj.image_url_base + "?width=200&height=200");
        }
        document.getElementById("info-modal-header").style.borderBottomColor = obj.color;
        jQuery("#info-modal-type").css("color", obj.color);

        //add toolbar-btn

        const toolbar_group = document.getElementById("toolbar-group");

        var toolbar_btn_html = "";

        if (obj.region == null) {
            obj.region = [];
            obj.region.name = obj.city;
        }

        toolbar_btn_html += `<input type="checkbox" class="btn-check" autocomplete="off">
        <label class="btn btn-outline-danger filter-btn-unterkategorie">${obj.region.name}</label><br>`;

        jQuery.each(obj.categories, function (key, value) {
            var category_obj = categories_array.find(x => x.id === parseInt(value));
            toolbar_btn_html += `<input type="checkbox" class="btn-check" autocomplete="off">
            <label class="btn btn-outline-info filter-btn-unterkategorie">${category_obj.name}</label><br>`;
        });

        jQuery.each(obj.goals, function (key, value) {
            toolbar_btn_html += `<input type="checkbox" class="btn-check" autocomplete="off">
            <label class="btn btn-outline-secondary filter-btn-unterkategorie" for="btn-check-1-outlined">${value}</label><br>`;
        });


        toolbar_group.innerHTML = toolbar_btn_html;


        if (single_marker != undefined) {
            map2.removeLayer(single_marker);
        };
        if (obj.latlng == null && obj.full_address != null) {
            jQuery.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + obj.full_address, function (obj_latlng_data) {
                if (obj_latlng_data.length != 0) {
                    obj.latlng = [obj_latlng_data[0].lat, obj_latlng_data[0].lon];
                    switch (obj.service_type) {
                        case "Projekt":
                        case "Filiale":
                            single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {
                                icon: blueIcon
                            }).addTo(map2).bindPopup("<b>" + obj.name + "</b>");
                            break;
                        case "Veranstaltung":
                            single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {
                                icon: yellowIcon
                            }).addTo(map2).bindPopup("<b>" + obj.name + "</b>");
                            break;
                        case "Beratungsangebot":
                        case "Bildungsangebot":
                            single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {
                                icon: redIcon
                            }).addTo(map2).bindPopup("<b>" + obj.name + "</b>");
                            break;
                    }
                    map2.setView([obj.latlng[0], obj.latlng[1]], 13);
                }
            });
        } else if (obj.latlng != null) {
            switch (obj.service_type) {
                case "Projekt":
                case "Filiale":
                    single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {
                        icon: blueIcon
                    }).addTo(map2).bindPopup("<b>" + obj.name + "</b>");
                    break;
                case "Veranstaltung":
                    single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {
                        icon: yellowIcon
                    }).addTo(map2).bindPopup("<b>" + obj.name + "</b>");
                    break;
                case "Beratungsangebot":
                case "Bildungsangebot":
                    single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {
                        icon: redIcon
                    }).addTo(map2).bindPopup("<b>" + obj.name + "</b>");
                    break;
            }
            map2.setView([obj.latlng[0], obj.latlng[1]], 13);
        }

        // fil div info-modal-organisation-data with all data
        var org_data_arr = marker_data.filter(x => (x.user_id === parseInt(obj.user_id)) && (x.id != parseInt(obj.id)));
        if (org_data_arr.length > 0) {
            org_data_container.innerHTML = returnOrgActivities(org_data_arr);
        } else {
            org_data_container.innerHTML = "<p>Leider keine weiteren Angebote/Veranstaltungen vorhanden!</p>"
        }
    });

    //organisation info in modal

    jQuery(document).on("click", ".organisation_link", function (e) {
        jQuery(".modal-content").animate({
            scrollTop: 0
        });
        jQuery("#infoModal").modal("show");
        jQuery("#info-modal-content").LoadingOverlay("show", {
            image: "",
            fontawesome: "fa fa-recycle fa-spin",
            zindex: 3
        });
        var org_id = jQuery("#info-modal-organisation").attr("data-link");

        let entry_obj = {
            "type": 1,
            "id": org_id
        };
        entry_tap.push(entry_obj);

        //hide unnecessary stuff
        jQuery("#info-modal-organisation").text("");
        var hint_card = document.getElementById("info-modal-hint-card");
        hint_card.style.display = "none";
        var category_accord = document.getElementById("category_accordion");
        category_accord.style.display = "none";
        var organisation_info = document.getElementById("info-modal-organisation-card");
        organisation_info.style.display = "none";
        jQuery("#info-modal-back").show();
        jQuery("#info-modal-date-card").hide();

        jQuery.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/users/" + org_id + ".json", function (organisation_data) {
            jQuery("#info-modal-title").text(organisation_data.name);
            jQuery("#info-modal-photo").LoadingOverlay("show", {
                image: "",
                fontawesome: "fa fa-recycle fa-spin",
                zindex: 3
            });
            setTimeout(function () {
                jQuery("#info-modal-photo").LoadingOverlay("hide");
            }, 500);
            if (organisation_data.organization_logo_url_base != null) {
                jQuery("#info-modal-photo").attr("src", organisation_data.organization_logo_url_base + "?width=200&height=200");
            } else {
                jQuery("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/organisation_default.png");
            }
            jQuery("#info-modal-type").text("Organisation");
            if (organisation_data.description != null) {
                jQuery("#info-modal-text").text(organisation_data.description);
            } else {
                jQuery("#info-modal-text").text("-");
            }
            jQuery("#info-modal-hints").text("");
            jQuery("#info-modal-address").text(organisation_data.full_address);
            jQuery("#info-modal-route").prop("href", "https://www.google.com/maps/dir/?api=1&destination=" + organisation_data.full_address);

            /*if(organisation_data.website != null){
                jQuery("#info-modal-website").prop("href", organisation_data.info_url);
                jQuery("#info-modal-website").text("Website");
            }else{
                jQuery("#info-modal-website").text("Keine Website vorhanden.");
                jQuery("#info-modal-website").removeAttr("href");
            }*/
            if (organisation_data.email != null) {
                jQuery("#info-modal-email").text(organisation_data.email);
                jQuery("#info-modal-email").prop("href", "mailto:" + organisation_data.email);
            } else {
                jQuery("#info-modal-email").text("Keine Mail-Adresse vorhanden.");
                jQuery("#info-modal-email").removeAttr("href");
            }
            if (organisation_data.telephone != null) {
                jQuery("#info-modal-telephone").text(organisation_data.phone_primary);
                jQuery("#info-modal-telephone").prop("href", "tel:" + organisation_data.phone_primary);
            } else {
                jQuery("#info-modal-telephone").text("Keine Telefon-Nr. vorhanden.");
                jQuery("#info-modal-telephone").removeAttr("href");
            }


            if (single_marker != undefined) {
                map2.removeLayer(single_marker);
            };

            if (organisation_data.latlng == null) {
                jQuery.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + organisation_data.full_address, function (organisation_latlng_data) {
                    organisation_data.latlng = [organisation_latlng_data[0].lat, organisation_latlng_data[0].lon];
                    single_marker = L.marker([organisation_data.latlng[0], organisation_data.latlng[1]]).addTo(map2)
                        .bindPopup("<b>" + organisation_data.name + "</b>");
                    map2.setView([organisation_data.latlng[0], organisation_data.latlng[1]], 13);
                });
            } else {
                single_marker = L.marker([organisation_data.latlng[0], organisation_data.latlng[1]]).addTo(map2)
                    .bindPopup("<b>" + organisation_data.name + "</b>");
                map2.setView([organisation_data.latlng[0], organisation_data.latlng[1]], 13);
            }
            jQuery("#info-modal-content").LoadingOverlay("hide");
        });

        // fil div info-modal-organisation-data with all data

        var org_data_arr = marker_data.filter(x => x.user_id === parseInt(org_id));
        if (org_data_arr.length > 0) {
            org_data_container.innerHTML = returnOrgActivities(org_data_arr);
        } else {
            org_data_container.innerHTML = "<p>Leider keine weiteren Angebote/Veranstaltungen vorhanden!</p>"
        }

        document.getElementById("info-modal-header").style.borderBottomColor = "#008000";

        //add toolbar-btn

        const toolbar_group = document.getElementById("toolbar-group");

        var toolbar_btn_html = "";

        toolbar_group.innerHTML = toolbar_btn_html;
    });

    jQuery("#infoModal").on("hidden.bs.modal", function () {
        entry_tap = [];
    })

}); //end

function getLoc(zoomLevel) {
    map.setView([51.3406, 12.3747], zoomLevel); // ([lat, lng], zoom)
};

function adjust_result_div_height() {
    if (jQuery(window).width() < 576) {
        document.getElementById("results_filter_div").style.height = default_height + 200 + "px";
    }else if (jQuery(window).width() > 576) {
        document.getElementById("results_filter_div").style.height = default_height + "px";
    }
    var height_parent_div = document.querySelector("#results_filter_div").offsetHeight;
    var height_search_div = document.querySelector("#search_div").offsetHeight;
    var height_jump_div = document.querySelector("#go-to-div").offsetHeight;
    document.getElementById("list_wrapper").style.height = height_parent_div - height_search_div - height_jump_div - 30 + "px";
}

function goBackFunction(e) {
    entry_tap.pop();
    let entry_tap_id = entry_tap[entry_tap.length - 1].id;
    if (entry_tap[entry_tap.length - 1].type === 1) {
        jQuery(".organisation_link").click();
        entry_tap.pop();
    } else {
        jQuery("#" + entry_tap_id + "_link").click();
        entry_tap.pop();
        if (entry_tap.length > 1) {
            jQuery("#info-modal-back").show();
        } else {
            jQuery("#info-modal-back").hide();
        }
    }
}