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

document.addEventListener("DOMContentLoaded", function () {

    $("#calendarButton").click(function (event) {
        console.log("Click cal button");

        let obj_cal_btn = calendar_data.find(x => x.id === entry_tap[entry_tap.length - 1].id);
        console.log(entry_tap[entry_tap.length - 1]);

        event.preventDefault();
        let current_date = moment(Date.now()).utc().format("YYYYMMDD");
        let current_time = moment(Date.now()).utc().format("HHmmss");
        let event_start_date = moment(obj_cal_btn.start_at).utc().format("YYYYMMDD");
        let event_start_time = moment(obj_cal_btn.start_at).utc().format("HHmmss");
        let event_end_date = moment(obj_cal_btn.end_at).utc().format("YYYYMMDD");
        let event_end_time = moment(obj_cal_btn.end_at).utc().format("HHmmss");
        let description_data;

        $.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/users/" + obj_cal_btn.user_id + ".json", function (organisation_data) {

            description_data = "Von: " + organisation_data.name + " | ";

            if (organisation_data.website != null) {
                description_data += "Website: " + organisation_data.info_url + " | ";
            }
            if (obj_cal_btn.email != null) {
                description_data += "E-Mail: " + obj_cal_btn.email + " | ";
            } else if (organisation_data.email != null) {
                description_data += "E-Mail: " + organisation_data.email + " | ";
            }
            if (organisation_data.telephone != null) {
                description_data += "Tel-Nr.: " + organisation_data.phone_primary + " | ";
            }
            if (obj_cal_btn.description != null) {
                description_data += "Beschreibung: " + obj_cal_btn.description + " | ";
            }
            if (obj_cal_btn.hints != null) {
                description_data += "Hinweise: " + obj_cal_btn.hints + " | ";
            }
            console.log(description_data);

            // Format: https://docs.fileformat.com/email/ics/
            //icsMSG += "DTSTART:" + $(".start-time").text() + "\r\n";
            var icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\r\n";
            icsMSG += "PRODID:-//Our Company//NONSGML v1.0//EN\r\n";
            icsMSG += "BEGIN:VEVENT\r\n";
            icsMSG += "UID:rotter.jonas@google.com\r\n"
            //icsMSG += "DTSTAMP:20220516T170000Z\r\n";
            icsMSG += "DTSTAMP:" + current_date + "T" + current_time + "Z\r\n";
            //icsMSG += "ATTENDEE;CN=Ich;RSVP=TRUE:MAILTO:rotter.jonas@gmail.com\r\n";
            //icsMSG += "ORGANIZER;CN=Me:MAILTO::rotter.jonas@gmail.com\r\n";
            icsMSG += "DTSTART:" + event_start_date + "T" + event_start_time + "Z\r\n";
            icsMSG += "DTEND:" + event_end_date + "T" + event_end_time + "Z\r\n";
            icsMSG += "LOCATION:" + obj_cal_btn.full_address + "\r\n";
            icsMSG += "SUMMARY:Veranstaltung - " + obj_cal_btn.name + "\r\n";
            icsMSG += "DESCRIPTION:" + description_data + "\r\n";
            icsMSG += "END:VEVENT\r\nEND:VCALENDAR";
            var title = obj_cal_btn.name + ".ics";
            var uri = "data:text/calendar;charset=utf8," + escape(icsMSG);
            var link = $("<a>", {
                href: uri,
                download: title,
                target: "_BLANK"
            }).html("").appendTo("body");
            link.get(0).click();
            link.remove();
        });

    });

    var calendar = $("#calendar_container").evoCalendar({
        theme: "Royal Navy",
        language: "de",
        format: "dd. MM yyyy",
        eventHeaderFormat: "dd. MM yyyy",
        titleFormat: "MM",
        firstDayofWeek: 1,
        todayHighlight: true
    });

    var center = [51.340199, 12.360103]; //51.340199,12.360103

    var layer = L.tileLayer(themeUrl, {
        attribution: themeAttribution
    })

    map = L.map("leaflet_map_small", {
        center: center,
        layers: [layer]
    });
    map.setView(center, 13);
    //map.scrollWheelZoom.disable();

    yellowIcon = new L.Icon({
        iconUrl: "https://cdn.mapmarker.io/api/v1/pin?icon=fa-calendar&size=100&background=ffbb33&hoffset=0&voffset=-1",
        iconSize: [40, 40],
        iconAnchor: [20, 34],
        popupAnchor: [0, -28]
    });

    var container = document.getElementById("leaflet_map_small");

    var observer = ResizeObserver && new ResizeObserver(function () {
        map.invalidateSize(true);
    });
    observer && observer.observe(container);



    function getDataPoints() {
        let urls = [
            "https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=education",
            "https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=counseling",
            "https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&upcoming",
        ]

        var region_arr = default_regions;
        var category_arr = default_categories;
        let ext_arr = [];
        //loop through each region
        if (region_arr.length > 0) {
            $.each(region_arr, function (region_key, region_val) {
                $.each(urls, function (url_key, url_value) {
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
            $.each(category_arr, function (cat_key, cat_val) {
                if (pre_length > 0) {
                    $.each(ext_arr, function (url_key, url_value) {
                        console.log(url_value);
                        let int_cat_url = url_value + "&category_id=" + cat_val;
                        int_cat_url = int_cat_url.replace(/#038;/g, "");
                        //ext_arr.splice(url_key, 1);
                        ext_arr_cat.push(int_cat_url);
                    });
                } else {
                    $.each(urls, function (url_key, url_value) {
                        console.log(url_value);
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
    }

    function getAPIData(web_addresses) {
        $("#all_container").LoadingOverlay("show", {
            image: "",
            fontawesome: "fa fa-recycle fa-spin",
            zIndex: 2
        });
        $.when.apply($, web_addresses.map(function (url) {
            return $.getJSON(url);
        })).done(function () {
            $("#all_container").LoadingOverlay("hide");
            var data_helper = [];
            console.log(arguments);
            if (web_addresses.length > 1) {
                data_helper.push(arguments[0][0]);
                data_helper.push(arguments[1][0]);
                data_helper.push(arguments[2][0]);
                var data = [].concat.apply([], data_helper);

            } else {
                var data = arguments[0];
            }
            // all data is now in the results array in order
            console.log(data);
            //make data global

            calendar_data = data;

            //$("#info-result-number").text(data.length + " Ergebnisse");

            service_types = [];

            $.each(data, function (ind, elem) {
                service_types.push(elem.service_type);
                elem.color = "#FFBF00";
                switch (elem.service_type) {
                    case "Projekt":
                    case "Filiale":
                        elem.color = "#4169E1";
                        break;
                    case "Veranstaltung":
                        elem.color = "#FFBF00";
                        break;
                    case "Beratungsangebot":
                    case "Bildungsangebot":
                        elem.color = "#D2042D";
                        break;
                }
                if (elem.description != null) {
                    elem.shortdescription = elem.description.substring(0, 120) + "...";
                }
                if (elem.name.length > 17) {
                    elem.shortname = elem.name.substring(0, 15) + "...";
                } else {
                    elem.shortname = elem.name;
                }
                if (elem.start_at != null && elem.end_at != null) {

                    elem.start_datetime = moment(elem.start_at).format("DD.MM.YYYY HH:mm");
                    elem.end_datetime = moment(elem.end_at).format("DD.MM.YYYY HH:mm");
                    elem.start_date = moment(elem.start_at).format("MM/DD/YYYY");
                    elem.end_date = moment(elem.end_at).format("MM/DD/YYYY");
                    let date_arr;
                    if (elem.start_date != elem.end_date) {
                        date_arr = [elem.start_date, elem.end_date];
                    } else if (elem.start_date == elem.end_date) {
                        date_arr = elem.start_date;
                    }

                    $("#calendar_container").evoCalendar("addCalendarEvent", [{
                        id: elem.id,
                        name: elem.shortname,
                        date: date_arr,
                        badge: elem.start_datetime + " - " + elem.end_datetime,
                        type: elem.service_type,
                        color: elem.color,
                        description: elem.shortdescription
                    }]);
                } else if ((elem.start_at == null) && (elem.end_at != null)) {
                    elem.end_datetime = moment(elem.end_at).format("DD.MM.YYYY HH:mm");
                    elem.end_date = moment(elem.end_at).format("MM/DD/YYYY");
                    $("#calendar_container").evoCalendar("addCalendarEvent", [{
                        id: elem.id,
                        name: elem.shortname,
                        date: elem.end_date,
                        badge: "Ende: " + elem.end_datetime,
                        type: elem.service_type,
                        color: elem.color,
                        description: elem.shortdescription
                    }]);
                } else if ((elem.start_at != null) && (elem.end_at == null)) {
                    elem.start_datetime = moment(elem.start_at).format("DD.MM.YYYY HH:mm");
                    elem.start_date = moment(elem.start_at).format("MM/DD/YYYY");
                    $("#calendar_container").evoCalendar("addCalendarEvent", [{
                        id: elem.id,
                        name: elem.shortname,
                        date: elem.start_date,
                        badge: "Start: " + elem.start_datetime,
                        type: elem.service_type,
                        color: elem.color,
                        description: elem.shortdescription
                    }]);
                }
            });
        });
    }

    getDataPoints();

    $.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/categories.json", function (data) {

        categories_array = data;
    });

    $('#calendar_container').on("selectEvent", function (event, activeEvent) {
        modalTrigger(activeEvent.id);
    });

    $(document).on("click", ".modal_link", function (e) {
        var marker_id_long = e.target.id;
        var marker_id = marker_id_long.substr(0, marker_id_long.indexOf("_"));
        modalTrigger(parseInt(marker_id));
    });


    $(document).on("click", ".organisation_link", function (e) {
        $(".modal-content").animate({
            scrollTop: 0
        });
        $("#infoModal").modal("show");
        $("#info-modal-content").LoadingOverlay("show", {
            image: "",
            fontawesome: "fa fa-recycle fa-spin",
            zindex: 2
        });
        var org_id = event.target.getAttribute("data-link");
        var org_id = $("#info-modal-organisation").attr("data-link");

        let entry_obj = {
            "type": 1,
            "id": org_id
        };
        entry_tap.push(entry_obj);
        //hide unnecessary stuff
        $("#info-modal-organisation").text("");
        var hint_card = document.getElementById("info-modal-hint-card");
        hint_card.style.display = "none";
        var category_accord = document.getElementById("category_accordion");
        category_accord.style.display = "none";
        var organisation_info = document.getElementById("info-modal-organisation-card");
        organisation_info.style.display = "none";
        $("#info-modal-back").show();
        $("#info-modal-date-card").hide();
        $.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/users/" + org_id + ".json", function (organisation_data) {
            $("#info-modal-title").text(organisation_data.name);
            if (organisation_data.organization_logo_url_base != null) {
                $("#info-modal-photo").attr("src", organisation_data.organization_logo_url_base + "?width=200&height=200");
            } else {
                $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/organisation_default.png");
            }
            $("#info-modal-type").text("Organisation");
            if (organisation_data.description != null) {
                $("#info-modal-text").text(organisation_data.description);
            } else {
                $("#info-modal-text").text("-");
            }
            $("#info-modal-hints").text("");
            $("#info-modal-address").text(organisation_data.full_address);
            $("#info-modal-route").prop("href", "https://www.google.com/maps/dir/?api=1&destination=" + organisation_data.full_address);

            /*if(organisation_data.website != null){
                $("#info-modal-website").prop("href", organisation_data.info_url);
                $("#info-modal-website").text("Website");
            }else{
                $("#info-modal-website").text("Keine Website vorhanden.");
                $("#info-modal-website").removeAttr("href");
            }*/
            if (organisation_data.email != null) {
                $("#info-modal-email").text(organisation_data.email);
                $("#info-modal-email").prop("href", "mailto:" + organisation_data.email);
            } else {
                $("#info-modal-email").text("Keine Mail-Adresse vorhanden.");
                $("#info-modal-email").removeAttr("href");
            }
            if (organisation_data.telephone != null) {
                $("#info-modal-telephone").text(organisation_data.phone_primary);
                $("#info-modal-telephone").prop("href", "tel:" + organisation_data.phone_primary);
            } else {
                $("#info-modal-telephone").text("Keine Telefon-Nr. vorhanden.");
                $("#info-modal-telephone").removeAttr("href");
            }


            if (single_marker != undefined) {
                map.removeLayer(single_marker);
            };

            if (organisation_data.latlng == null) {
                $.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + organisation_data.full_address, function (organisation_latlng_data) {
                    organisation_data.latlng = [organisation_latlng_data[0].lat, organisation_latlng_data[0].lon];
                    single_marker = L.marker([organisation_data.latlng[0], organisation_data.latlng[1]]).addTo(map)
                        .bindPopup("<b>" + organisation_data.name + "</b>");
                    map.setView([organisation_data.latlng[0], organisation_data.latlng[1]], 13);
                });
            } else {
                single_marker = L.marker([organisation_data.latlng[0], organisation_data.latlng[1]]).addTo(map)
                    .bindPopup("<b>" + organisation_data.name + "</b>");
                map.setView([organisation_data.latlng[0], organisation_data.latlng[1]], 13);
            }
        });

        document.getElementById("info-modal-header").style.borderBottomColor = "#008000";

        //add toolbar-btn

        const toolbar_group = document.getElementById("toolbar-group");

        var toolbar_btn_html = "";

        toolbar_group.innerHTML = toolbar_btn_html;
        $("#info-modal-content").LoadingOverlay("hide");
    });

});

function modalTrigger(event_id) {
    $(".modal-content").animate({
        scrollTop: 0
    });
    $("#infoModal").modal("show");
    $("#info-modal-content").LoadingOverlay("show", {
        image: "",
        fontawesome: "fa fa-recycle fa-spin",
        zindex: 2
    });

    var obj = calendar_data.find(x => x.id === event_id);
    console.log(event_id);
    console.log(obj);


    $("#info-modal-organisation").text("");
    var hint_card = document.getElementById("info-modal-hint-card");
    hint_card.style.display = "block";
    var category_accord = document.getElementById("category_accordion");
    category_accord.style.display = "block";
    var organisation_info = document.getElementById("info-modal-organisation-card");
    organisation_info.style.display = "block";
    $("#info-modal-back").show();
    $("#info-modal-date-card").hide();

    let entry_obj = {
        "type": 0,
        "id": event_id
    };
    entry_tap.push(entry_obj);
    console.log(entry_tap);


    if (entry_tap.length > 1) {
        $("#info-modal-back").show();
    } else {
        $("#info-modal-back").hide();
    }



    $.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/users/" + obj.user_id + ".json", function (organisation_data) {
        $("#info-modal-organisation").text(organisation_data.name);
        $("#info-modal-organisation").attr("data-link", organisation_data.id);
        if (organisation_data.email != null) {
            $("#info-modal-email").text(organisation_data.email);
            $("#info-modal-email").prop("href", "mailto:" + organisation_data.email);
        } else {
            $("#info-modal-email").text("Keine Mail-Adresse vorhanden.");
            $("#info-modal-email").removeAttr("href");
        }
        if (organisation_data.telephone != null) {
            $("#info-modal-telephone").text(organisation_data.phone_primary);
            $("#info-modal-telephone").prop("href", "tel:" + organisation_data.phone_primary);
        } else {
            $("#info-modal-telephone").text("Keine Telefon-Nr. vorhanden.");
            $("#info-modal-telephone").removeAttr("href");
        }
        $("#info-modal-content").LoadingOverlay("hide");
    });

    $("#info-modal-title").text(obj.name);
    $("#info-modal-type").text(obj.service_type);
    if (obj.description != null) {
        $("#info-modal-text").text(obj.description);
    } else {
        $("#info-modal-text").text("Keine Beschreibung hinterlegt.");
    }
    if (obj.requirements != null) {
        $("#info-modal-hints").text(obj.requirements);
    } else {
        $("#info-modal-hints").text("Keine Hinweise.");
    }
    if (obj.info_url != null) {
        if (!obj.info_url.startsWith("https") || !obj.info_url.startsWith("http")) {
            obj.info_url = "https://" + obj.info_url;
        }
        $("#info-modal-website").prop("href", obj.info_url);
        $("#info-modal-website").text("Website");
    } else {
        $("#info-modal-website").text("Keine Website vorhanden.");
        $("#info-modal-website").removeAttr("href");
    }
    $("#info-modal-address").text(obj.full_address);
    $("#info-modal-route").prop("href", "https://www.google.com/maps/dir/?api=1&destination=" + obj.full_address);
    switch (obj.service_type) {
        case "Veranstaltung":
            $("#info-modal-date-card").show();
            $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/event.png");
            if (obj.start_at != null) {
                let start_date = moment(obj.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                $("#info-modal-date").text("Start: " + start_date);
            }
            if (obj.end_at != null) {
                let end_date = moment(obj.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                $("#info-modal-date").text("Ende: " + end_date);
            }
            if ((obj.end_at != null) && (obj.end_at != null)) {
                let start_date = moment(obj.start_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                let end_date = moment(obj.end_at).format("DD.MM.YYYY, HH:mm") + " Uhr";
                $("#info-modal-date").text(start_date + " - " + end_date);
            }
            break;
        case "Beratungsangebot":
            $("#info-modal-date-card").show();
            $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/offer.png");
            break;
        case "Bildungsangebot":
            $("#info-modal-date-card").show();
            $("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/education.png");
            break;
    }
    if (obj.image_url_base != null) {
        $("#info-modal-photo").attr("src", obj.image_url_base + "?width=200&height=200");
    }
    document.getElementById("info-modal-header").style.borderBottomColor = obj.color;
    $("#info-modal-type").css("color", obj.color);

    //add toolbar-btn

    const toolbar_group = document.getElementById("toolbar-group");

    var toolbar_btn_html = "";

    if (obj.region == null) {
        obj.region = [];
        obj.region.name = obj.city;
    }

    toolbar_btn_html += `<input type="checkbox" class="btn-check" autocomplete="off">
        <label class="btn btn-outline-danger filter-btn-unterkategorie">${obj.region.name}</label><br>`;

    $.each(obj.categories, function (key, value) {
        var category_obj = categories_array.find(x => x.id === parseInt(value));
        toolbar_btn_html += `<input type="checkbox" class="btn-check" autocomplete="off">
            <label class="btn btn-outline-info filter-btn-unterkategorie">${category_obj.name}</label><br>`;
    });

    $.each(obj.goals, function (key, value) {
        toolbar_btn_html += `<input type="checkbox" class="btn-check" autocomplete="off">
            <label class="btn btn-outline-secondary filter-btn-unterkategorie" for="btn-check-1-outlined">${value}</label><br>`;
    });


    toolbar_group.innerHTML = toolbar_btn_html;


    if (single_marker != undefined) {
        map.removeLayer(single_marker);
    };
    if (obj.latlng == null && obj.full_address != null) {
        $.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + obj.full_address, function (obj_latlng_data) {
            if (obj_latlng_data.length != 0) {
                obj.latlng = [obj_latlng_data[0].lat, obj_latlng_data[0].lon];
                single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {
                    icon: yellowIcon
                }).addTo(map).bindPopup("<b>" + obj.name + "</b>");
                map.setView([obj.latlng[0], obj.latlng[1]], 13);
            }
        });
    } else if (obj.latlng != null) {
        single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {
                icon: yellowIcon
            }).addTo(map)
            .bindPopup("<b>" + obj.name + "</b>");
        map.setView([obj.latlng[0], obj.latlng[1]], 13);
    }

    // fil div info-modal-organisation-data with all data
    var org_data_container = document.getElementById("info-modal-organisation-data");

    var org_data_arr = calendar_data.filter(x => (x.user_id === parseInt(obj.user_id)) && (x.id != parseInt(obj.id)));
    if (org_data_arr.length > 0) {
        org_data_container.innerHTML = returnOrgActivities(org_data_arr);
    } else {
        org_data_container.innerHTML = "<p>Leider keine weiteren Angebote/Veranstaltungen vorhanden!</p>"
    }
};

$("#infoModal").on("hidden.bs.modal", function () {
    entry_tap = [];
    console.log("hidden!");
})

function goBackFunction(e) {
    entry_tap.pop();
    let entry_tap_id = entry_tap[entry_tap.length - 1].id;
    if (entry_tap[entry_tap.length - 1].type === 1) {
        $(".organisation_link").click();
        entry_tap.pop();
    } else {
        modalTrigger(parseInt(entry_tap_id));
        entry_tap.pop();
        if (entry_tap.length > 1) {
            $("#info-modal-back").show();
        } else {
            $("#info-modal-back").hide();
        }
    }
}