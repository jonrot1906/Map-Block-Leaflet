		/*var todayDate = moment().startOf("day");
      var YM = todayDate.format("YYYY-MM");
      var YESTERDAY = todayDate.clone().subtract(1, "day").format("YYYY-MM-DD");
      var TODAY = todayDate.format("YYYY-MM-DD");
      var TOMORROW = todayDate.clone().add(1, "day").format("YYYY-MM-DD");
      var NEXTMONTH = todayDate.clone().add(1, "month").format("YYYY-MM");

		$("#calendar").fullCalendar({
			header: {
			  left: "prev,next today",
			  center: "title",
			  right: ""
			  //right: "month" agendaWeek,agendaDay,listWeek
			},
			editable: false,
			eventLimit: false, // Always FALSE
			navLinks: false,
			timeFormat: "HH:mm",
			slotLabelFormat: "HH:mm",
			firstDay: 1,
			selectable: true,
			contentHeight:"auto",
			fixedWeekCount: false,
			language: "de",
			views: {
			basic: {
			  // options apply to basicWeek and basicDay views
			},
			agenda: {
			  // options apply to agendaWeek and agendaDay views
			},
			week: {
			  columnHeaderFormat: "ddd D",
			  titleFormat: "DD MMM YYYY"
			},
			day: {
			  // options apply to basicDay and agendaDay views
			}
		  },
			events: [
			  {
				title: "The AI Summit 2016",
				start: YM + "-03",
				end: YM + "-06",
				backgroundColor: "#BCE4FD",
				borderColor: "#26A8FB"
			  },
			  {
				title: "Spring 2016",
				start: YM + "-09",
				end: YM + "-14",
				backgroundColor: "#BCE4FD",
				borderColor: "#26A8FB"
			  },
			  {
				title: "Virtual Assistant Summit",
				start: YM + "-17",
				end: YM + "-20",
				backgroundColor: "#FFBCBA",
				borderColor: "#D9624F"
			  },
			  {
				title: "OReilly Summit 2016",
				start: YM + "-23",
				end: YM + "-26",
				backgroundColor: "#FFBCBA",
				borderColor: "#D9624F"
			  },
			  {
				title: "SIGCHI 2016 Conference",
				start: YM + "-18",
				backgroundColor: "#FFBCBA",
				borderColor: "#D9624F"
			  },
			  {
				title: "Les Inggris 2016 Q4",
				start: YM + "-11",
				backgroundColor: "#BCE4FD",
				borderColor: "#26A8FB"
			  },
			  {
				title: "Minds Mastering Mac",
				start: YM + "-05",
				end: YM + "-07",
				backgroundColor: "#eee",
				borderColor: "#aaa"
			  },
			  {
				title: "AAAI-16",
				start: YM + "-18",
				end: YM + "-20",
				backgroundColor: "#eee",
				borderColor: "#aaa"
			  },
			  {
				title: "Service Experience",
				start: YM + "-26",
				end: YM + "-29",
				backgroundColor: "#eee",
				borderColor: "#aaa"
			  },
			  {
				title: "Les Bahasa Perancis",
				start: YM + "-26",
				backgroundColor: "#B3EFDA",
				borderColor: "#00c983"
			  },
			  {
				title: "SMS Las Vegas 2016",
				start: YM + "-27",
				backgroundColor: "#DACAFD",
				borderColor: "#8652FB"
			  },
			  {
				title: "Leadership Training",
				start: YM + "-27",
				backgroundColor: "#DACAFD",
				borderColor: "#8652FB"
			  },
			  {
				title: "Leadership Training 2",
				start: YM + "-28",
				end: YM + "-30",
				backgroundColor: "#DACAFD",
				borderColor: "#8652FB"
			  },
			  {
				title: "Leadership Camp Winter 2016",
				start: YM + "-27",
				backgroundColor: "#FFBCBA",
				borderColor: "#D9624F"
			  },
			  {
				title: "English Course",
				start: YM + "-27",
				backgroundColor: "#FFBCBA",
				borderColor: "#D9624F"
			  },
			  {
				title: "Sharing Session Hadoop",
				start: NEXTMONTH + "-02",
				backgroundColor: "#DACAFD",
				borderColor: "#8652FB"
			  },
			],
			eventTextColor: "#333",
			eventAfterRender: function( event, element, view ){
			  // Enable for the "month" view only.
			  if ( "month" !== view.name ) {
				return;
			  }
	
			  var a = moment( event.start, "YYYY-MM-DD" ),
				b = moment( event.end, "YYYY-MM-DD" ),
				duration = moment.duration( b.diff( a ) ),
				row = element.closest( ".fc-row" ),
				d = a.clone(), i, c;
	
			  var title = event.title;
			  if ( b.isValid() ) {
				title += " (" + $.fullCalendar.formatRange( a, b, "MMM D YYYY" ) + ")";
			  }
	
			  // Add the event"s "dot", styled with the appropriate background color.
			  for ( i = 0; i <= duration._data.days; i++ ) {
				if ( 0 === 1 ) {
				  c = a;
				} else {
				  d.add( 1, "days" );
				  c = d;
				}
	
				row.find( `.fc-day[data-date="` + c.format("YYYY-MM-DD") + `"]` )
				  .append(
					`<a href="#" class="fc-event-dot" onclick="return false;" ` +
					  `style="background-color: ` + event.backgroundColor + `;" ` +
					  `title="` + title + `"></a>`
				  );
			  }
	
			  // Here you can either completely remove the default element, or just
			  // hide it visually on screen.
			  element.remove();
			  //element.addClass( "hidden" );
			}
			  });*/