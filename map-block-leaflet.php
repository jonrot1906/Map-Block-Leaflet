<?php
/**
 *
 * @author      Jesús Olazagoitia (@goiblas)
 * @license     GPL2+
 *
 * @wordpress-plugin
 * Plugin Name: Map Block Leaflet
 * Description: Map Block Leaflet -- Allows embed maps in your contents, good alternative to Google Maps without the need for api key
 * Version:     2.2.1
 * Author:      Jonas Rotter
 * Author URI:  https://goiblas.com
 * Text Domain: map-block-leaflet
 * Domain Path: /languages
 * License:     GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */


//  Exit if accessed directly.
if (! defined('ABSPATH')) {
    exit;
}

function map_block_leaflet_load_textdomain() {
	load_plugin_textdomain( 'map-block-leaflet', false, basename( __DIR__ ) . '/languages' );
}
add_action( 'init', 'map_block_leaflet_load_textdomain' );

function map_block_leaflet_register() {
	if(!function_exists('register_block_type')) {
		return;
	}

	$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

	// Enqueue lib assets
	$lib_script_path = '/lib/leaflet.js';
	$lib_style_path = '/lib/leaflet.css';
	$lib_version = '1.7.1';

	//wp_register_style( 'bootstrap-css', plugins_url('/lib/bootstrap.min.css', __FILE__), array(), '4.6.1');
	//wp_register_script( 'bootstrap-js', plugins_url('/lib/bootstrap.min.js', __FILE__), array(), '4.6.1', false );
	wp_register_style( 'lib-css-map-block-leaflet', plugins_url($lib_style_path, __FILE__), array(), $lib_version );
	wp_register_script( 'lib-js-map-block-leaflet', plugins_url($lib_script_path, __FILE__), array(), $lib_version, false );
	wp_register_style( 'lib-css-map-block-leaflet-cluster', plugins_url("/lib/MarkerCluster.css", __FILE__), array("lib-css-map-block-leaflet"), $lib_version );
	wp_register_script( 'lib-js-map-block-leaflet-cluster', plugins_url("/lib/plugin_code.js", __FILE__), array("lib-js-map-block-leaflet"), $lib_version, false );

	wp_register_style( 'lib-css-bootstrap-blocks', plugins_url('/lib/bootstrap-blocks.css', __FILE__) );

	// Enqueue the bundled block JS file
	wp_register_script(
		'js-editor-map-block-leaflet',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);

	// register editor styles
	wp_register_style(
		'css-editor-map-block-leaflet',
		plugins_url( 'build/index.css', __FILE__ ),
        [],
		$asset_file['version']
	);

	// Register map-block-leaflet
    register_block_type( 'map-block-leaflet/map-block-leaflet', array(
		'editor_script' => 'js-editor-map-block-leaflet',
		'editor_style' => 'css-editor-map-block-leaflet',
		'render_callback' => 'map_block_leaflet_render',
		'script' => 'lib-js-map-block-leaflet',
		'style' => 'lib-css-map-block-leaflet',
		'attributes' => [
			'lat' => [
				'type' => 'number',
				'default' => 40.416775
			],
			'lng'  => [
				'type'  => 'number',
				'default' => -3.703790
			],
			'themeUrl' => [
				'type' => 'string',
				'default' =>  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
			],
			'themeAttribution' => [
				'type' => 'string',
				'default' => '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
			],
			'height' => [
				'type' => 'number',
				'default' => 600
			],
			'disableScrollZoom'=> [
				'type' => 'boolean',
				'default' => true
			],
			'zoom' => [
				'type' => 'number',
				'default' => 13
			],
			'themeId' => [
				'type' => 'number',
				'default' => 1
			],
			'content' => [
				'type' => 'string',
				'default' => ''
			]
		]
	 ) );

	// Register map-block-leaflet-multimarker
    register_block_type( 'map-block-leaflet/map-block-leaflet-multimarker', array(
		'editor_script' => 'js-editor-map-block-leaflet',
		'editor_style' => 'css-editor-map-block-leaflet',
		'render_callback' => 'map_block_leaflet_multi_marker_render',
		'script' => 'lib-js-map-block-leaflet-cluster',
		'style' => 'lib-css-map-block-leaflet-cluster',
		'attributes' => [
			'markers' => [
				'type' => 'array',
				'default' => []
			],
			'themeUrl' => [
				'type' => 'string',
				'default' =>  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
			],
			'themeAttribution' => [
				'type' => 'string',
				'default' => '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
			],
			'height' => [
				'type' => 'number',
				'default' => 800
			],
			'themeId' => [
				'type' => 'number',
				'default' => 1
			],
		]
	 ) );

	 // Register map-block-leaflet-calendar
	 register_block_type( 'map-block-leaflet/map-block-leaflet-calendar', array(
		'editor_script' => 'js-editor-map-block-leaflet',
		'editor_style' => 'css-editor-map-block-leaflet',
		'render_callback' => 'map_block_leaflet_calendar_render',
		'script' => 'lib-js-map-block-leaflet-cluster',
		'style' => 'lib-css-map-block-leaflet-cluster',
		'attributes' => [
			'themeUrl' => [
				'type' => 'string',
				'default' =>  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
			],
			'themeAttribution' => [
				'type' => 'string',
				'default' => '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
			],
			'height' => [
				'type' => 'number',
				'default' => 600
			],
			'themeId' => [
				'type' => 'number',
				'default' => 1
			],
		]
	 ) );
}
add_action('init', 'map_block_leaflet_register');



/**
 * Render in frontend leaflet map
 */
function map_block_leaflet_render($settings) {
	$content = trim(preg_replace('/\s\s+/', ' ', $settings['content']));

	$classes = 'map_block_leaflet';
	if(array_key_exists('align', $settings)) {
		switch ($settings['align']) {
			case 'wide':
			$classes .= ' alignwide';
			break;
			case 'full':
			$classes .= ' alignfull';
			break;
		}
	}

	$id = uniqid('lmb_');
	$output = '<div id=\''. $id .'\' class="'.$classes .'" style="height: '. $settings['height'] . 'px"></div>';
	$output .= '
		<script>
		( function(){

		var map = L.map(\''. $id .'\').setView([' . $settings['lat'] . ', '. $settings['lng'] .'], \''. $settings['zoom'] .'\');

			L.tileLayer(\''. $settings['themeUrl'] . '\', {
				attribution: \''. $settings['themeAttribution'] .'\'
			}).addTo(map);

	';
	if($settings['disableScrollZoom']) {
		$output .= 'map.scrollWheelZoom.disable();';
	}
	if ( !empty( $content ) ){
		$output .= '
			var content = \''. esc_js($content) .'\';
			L.marker([' . $settings['lat'] . ', '. $settings['lng'] .']).addTo(map)
				.bindPopup( content.replace(/\r?\n/g, "<br />") )';
	} else {
		$output .= 'L.marker([' . $settings['lat'] . ', '. $settings['lng'] .']).addTo(map)';
	}

	$output .= '
		function is_loading() {
			return document.body.classList.contains("loading");
		}
		var timer = 100;
		function checkRender() {
			if( is_loading()) {
				setTimeout(function(){
					checkRender();
				}, timer);
			} else {
				map.invalidateSize(true);
			}
		}
		if( is_loading()) {
			checkRender();
		} else {
			document.addEventListener("DOMContentLoaded", function() {
				map.invalidateSize(true);
			});
		}

    var container = document.getElementById(\'' . $id . '\');
    var observer = ResizeObserver && new ResizeObserver(function() {
      map.invalidateSize(true);
    });

    observer && observer.observe(container);
	';
	$output .= '})();</script>';

	return $output;
}

/**
 * Render in frontend leaflet map multimarker
 */
/*function map_block_leaflet_multi_marker_render2($settings) {

	$classes = 'map_block_leaflet';
	if(array_key_exists('align', $settings)) {
		switch ($settings['align']) {
			case 'wide':
			$classes .= ' alignwide';
			break;
			case 'full':
			$classes .= ' alignfull';
			break;
		}
	}

	$id = uniqid('lmb_');

	return '
	<div id=\''. $id .'\' class="'.$classes .'" style="height: '. $settings['height'] . 'px"></div>
	<script>
		console.log('. json_encode($settings).');
		document.addEventListener("DOMContentLoaded", function() {
			var markets = '. json_encode($settings['markers']).';
			var center = [51.505, -0.09];

			var layer = L.tileLayer(\''. $settings['themeUrl'] . '\', {
				attribution: \''. $settings['themeAttribution'] .'\'
			})

			var map = L.map('. $id .', { center: center, layers: [layer]});
			map.scrollWheelZoom.disable();

			if(markets.length > 0) {
				var markers = L.markerClusterGroup();

				markets.forEach( function(market) {
					L.marker([market.latlng.lat, market.latlng.lng]).bindPopup(market.content).addTo(markers)
				})

				map.addLayer(markers);
				map.fitBounds(markers.getBounds(), {padding: [50, 50]})
			}

      var container = document.getElementById(\'' . $id . '\');
      var observer = ResizeObserver && new ResizeObserver(function() {
        map.invalidateSize(true);
      });

      observer && observer.observe(container);
		});
	</script>
	';
}*/
function map_block_leaflet_multi_marker_render($settings) {

	$classes = 'map_block_leaflet';
	if(array_key_exists('align', $settings)) {
		switch ($settings['align']) {
			case 'wide':
			$classes .= ' alignwide';
			break;
			case 'full':
			$classes .= ' alignfull';
			break;
		}
	}

	$id = uniqid('lmb_');
	$id2 = uniqid('lmb_');

	return '
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.14.0-beta2/css/bootstrap-select.min.css" integrity="sha512-mR/b5Y7FRsKqrYZou7uysnOdCIJib/7r5QeJMFvLNHNhtye3xJp1TdJVPLtetkukFn227nKpXD9OjUc09lx97Q==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" integrity="sha512-mSYUmp1HYZDFaVKK//63EcZq4iFWFjxSL+Z3T/aCt4IO9Cejm03q3NKKYN6pFQzY0SBOr8h+eCIAZHPXcpZaNw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spin.js/4.1.1/spin.min.css" integrity="sha512-ssYEuK9Epo/48VIlBWTFosf1izrgGZqEMELJP+L7Clh0nvaOSTg87dM+Z8L+KKjrPdMbMvKYOOnzBOkNMhWFsg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" integrity="sha512-aOG0c6nPNzGk+5zjwyJaoRUgCdOrfSDhmMID2u4+OIslr0GjpLKo7Xm0Ao3xmpM4T8AmIouRkqwj1nrdVsLKEQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.14.0-beta2/js/bootstrap-select.min.js" integrity="sha512-FHZVRMUW9FsXobt+ONiix6Z0tIkxvQfxtCSirkKc5Sb4TKHmqq1dZa8DphF0XqKb3ldLu/wgMa8mT6uXiLlRlw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.14.0-beta2/js/i18n/defaults-de_DE.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/js/all.min.js" integrity="sha512-6PM0qYu5KExuNcKt5bURAoT6KCThUmHRewN3zUFNaoI6Di7XJPTMoT6K0nsagZKk2OB4L7E3q1uQKHNHd4stIQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" integrity="sha512-T/tUfKSV1bihCnd+MxKD0Hm1uBBroVYBOYSk1knyvQ9VyZJpc/ALb4P0r6ubwVPSGB2GvjeoMAJJImBG12TiaQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script src="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.js"></script>
	<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" integrity="sha512-uto9mlQzrs59VwILcLiRYeLKPPbS/bT71da/OEBYEwcdNUk8jYIy+D176RYoop1Da+f9mvkYrmj5MCLZWEtQuA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/list.js/2.3.1/list.min.js"></script>
	<script type="text/javascript" src="../lib/plugin_code.js"></script>

	<div class="container mt-5 mb-5" id="all_container">
	   <div class="row d-flex justify-content-center">
		  <div class="col-md-12">
			 <h5>Filter dich zur Nachhaltigkeit!</h5>
			 <div class="row">
				<div class="col-md-8 mb-md-0 mb-5" id="map_wrapper">
				   <div id="leaflet_map" class="'.$classes .'" style="height: '. $settings['height'] . 'px">
				</div>
			 </div>
			 <div class="col-md-4 mb-md-0 mb-5" style="height: '. $settings['height'] . 'px" id="results_filter_div">
				<div class="card card-body" style="margin-left: -10px; margin-bottom: 15px;" id="search_div">
				   <span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-secondary">
				   Suche
				   </span>
				   <div class="row g-3 mt-1">
					  <div class="input-group mb-3">
						 <input type="text" class="form-control" placeholder="Suche nach..." aria-label="Suche" aria-describedby="search-button" id="search_input">
						 <button class="btn btn-outline-dark filter-button" type="button" type="button" data-bs-toggle="collapse" data-bs-target="#extended_filters" aria-expanded="false" aria-controls="extended_filters"><i class="fa-solid fa-filter"></i></button>
						 <button class="btn btn-outline-success btn-arrow search-button" type="button"><span>Los!</span></button>
					  </div>
				   </div>
				   <div class="collapse" id="extended_filters">
					  <div class="row g-3">
						 <div class="col-9">
							<div class="btn-toolbar btn-group-sm" role="toolbar" aria-label="Toolbar with filter buttons">
							   <input type="checkbox" class="btn-check filter-btn" id="alle-btn" autocomplete="off" checked>
							   <label class="btn btn-outline-secondary filter-btn" for="alle-btn">Alle</label><br>
							   <input type="checkbox" class="btn-check filter-btn check-category-single" id="initiative-btn" autocomplete="off">
							   <label class="btn btn-outline-primary filter-btn" for="initiative-btn">Initiativen</label><br>
							   <input type="checkbox" class="btn-check filter-btn check-category-single" id="angebote-btn" autocomplete="off">
							   <label class="btn btn-outline-danger filter-btn" for="angebote-btn">Angebote</label><br>
							   <input type="checkbox" class="btn-check filter-btn check-category-single" id="veranstaltungen-btn" autocomplete="off">
							   <label class="btn btn-outline-warning filter-btn" for="veranstaltungen-btn">Veranstaltungen</label><br>
							</div>
						 </div>
						 <div class="col-3 text-end">
							<button type="button" class="btn btn-outline-dark border-white swalDefaultQuestion">
							<i class="fa fa-question-circle" aria-hidden="true"></i>
							</button>
							<button type="button" class="btn btn-outline-dark border-white" id="redoButton">
							<i class="fa fa-redo" aria-hidden="true"></i>
							</button>
						 </div>
					  </div>
					  <label for="test">Region</label>
					  <select class="selectpicker" multiple data-live-search="true" title="Regionen auswählen" id="regions_picker" data-actions-box="true" data-width="100%">
					  </select>
					  <label for="test">Kategorie(n)</label>
					  <select class="selectpicker" multiple data-live-search="true" title="Kategorien auswählen" id="kategorie_picker" data-actions-box="true" data-width="100%">
					  </select>
					  <div class="row g-1 mt-1">
						 <div class="col-lg-6 col-sm-6">
							<label for="startDate">Start</label>
							<input id="startDate" class="form-control" type="date" />
							<span id="startDateSelected"></span>
						 </div>
						 <div class="col-lg-6 col-sm-6">
							<label for="endDate">Ende</label>
							<input id="endDate" class="form-control" type="date" />
							<span id="endDateSelected"></span>
						 </div>
					  </div>
					  <div class="row g-1 mt-1">
						 <div class="d-grid gap-2 d-md-block">
							<button class="btn btn-outline-primary btn-sm" type="button" id="thisWeek">Diese Woche</button>
							<button class="btn btn-outline-primary btn-sm" type="button" id="thisMonth">Dieser Monat</button>
							<button class="btn btn-outline-primary btn-sm" type="button" id="clearThis">Leeren</button>
						 </div>
					  </div>
					  <div class="row g-1 mt-1">
						 <div class="text-end">
							<button type="button" class="btn btn-outline-dark border-white" id="extendedSwal">
							<i class="fa fa-question-circle" aria-hidden="true"></i>
							</button>
						 </div>
					  </div>
					  <div class="btn-group d-flex" role="group" aria-label="Control filter box group">
						 <button type="button" class="btn btn-outline-secondary filter-button" data-bs-toggle="collapse" data-bs-target="#extended_filters" aria-expanded="false" aria-controls="extended_filters"><i class="fa-solid fa-angles-up"></i> Einklappen</button>
						 <button type="button" class="btn btn-outline-success search-button"><i class="fa-solid fa-magnifying-glass"></i> Suchen</button>
					  </div>
				   </div>
				</div>
				<div class="content" id="another_wrap">
				   <div class="d-grid gap-2 d-md-block card card-body" id="go-to-div" style="margin-left: -10px; margin-bottom: 15px; background-color: #e9e9e9;">
					  <span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-secondary">
					  Ergebnisse
					  </span>
					  <div class="d-grid gap-2 d-md-block">
						 <small style="font-size:12px;">Springe zu:</small><br>
						 <button class="btn btn-outline-primary btn-sm mb-1" type="button" id="jump-projects"><i class="fa-solid fa-arrow-right"></i> Projekte</button>
						 <button class="btn btn-outline-danger btn-sm mb-1" type="button" id="jump-offers"><i class="fa-solid fa-arrow-right"></i> Angebote</button>
						 <button class="btn btn-outline-warning btn-sm mb-1" type="button" id="jump-events"><i class="fa-solid fa-arrow-right"></i> Veranstaltungen</button>
					  </div>
					  <div class="row mt-2">
						 <div class="col-8">
							<input type="text" class="form-control search bg-white" placeholder="Angebot gesucht?" aria-label="Suche">
						 </div>
						 <div class="d-grid gap-2 col-4 mx-auto">
							<div class="dropdown">
							   <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
							   <span style="font-size:10px;"><i class="fa-solid fa-sort"></i>  Sortieren</span>
							   </button>
							   <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
								  <li><a class="dropdown-item sort" data-sort="card_type" href="#">Angebots-Typ</a></li>
								  <li><a class="dropdown-item sort" data-sort="card_title" href="#">Titel</a></li>
							   </ul>
							</div>
						 </div>
					  </div>
					  <div class="row">
						 <small class="text-secondary text-end" id="info-result-number" style="margin-bottom: -10px;"></small>
					  </div>
				   </div>
				   <div class="overflow-auto bg-light result_wrapper" id="list_wrapper" style="height: inherit;">
				   </div>
				</div>
			 </div>
		  </div>
		  <hr/>
		  <div class="row">
			 <div class="col-10">
				<a href="https://daten.nachhaltiges-sachsen.de" target="_blank" class="link-secondary">Eigenes Projekt/Veranstaltung veröffentlichen</a>
			 </div>
			 <div class="col-2">
			 </div>
		  </div>
	   </div>
	   <div class="modal left fade" id="infoModal" tabindex="" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
		  <div class="modal-dialog modal-xl" role="document">
			 <div class="modal-content" id="info-modal-content">
				<div class="modal-header" id="info-modal-header" style="border-bottom: solid 5px;margin-left:-30px;margin-right:-30px;margin-top:-30px;">
				   <div class="container">
					  <div class="row">
						 <div class="col-6">
							<b><a id="info-modal-back" class="text-dark mb-2" onclick="goBackFunction()" style="margin-bottom:10px;"><i class="fa fa-arrow-left"></i> Zurück</a></b>
						 </div>
						 <div class="col-6">
							<button type="button" class="btn btn-secondary float-end" data-bs-dismiss="modal">Schließen</button>
						 </div>
					  </div>
					  <hr>
					  <div class="row" style="margin-top:10px;">
						 <div class="col-3">
							<img src="https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/organisation_default.png" class="img-fluid cover" alt="Responsive image" id="info-modal-photo">
						 </div>
						 <div class="col-9">
							<div style="display: block; margin-right: 4px;">
							   <h3 id="info-modal-title"></h3>
							</div>
							<div style="display: block; margin-right: 4px;">
							   <p id="info-modal-type"></p>
							</div>
							<div class="accordion-preview" id="category_accordion">
							   <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
								  <div class="accordion-body">
									 <div class="btn-toolbar btn-group-sm flex" id="toolbar-group" role="toolbar" aria-label="Toolbar with filter buttons" aria-expanded="false">
									 </div>
								  </div>
							   </div>
							   <a class="link-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">Mehr anzeigen</a>	
							</div>
						 </div>
					  </div>
				   </div>
				</div>
				<div class="modal-body small-text">
				   <div id="info-modal-organisation-card">
					  Von:&nbsp;<i class="fa fa-angle-right"></i>&nbsp;<b><a id="info-modal-organisation" data-link="" class="text-dark organisation_link"></a></b>
					  <hr>
				   </div>
				   <div id="info-modal-date-card">
					  Wann?&nbsp;<b><a id="info-modal-date" data-link="" class="text-dark"></a></b>
					  <hr>
				   </div>
				   <div class="card mb-2" style="margin-left: -4px;">
					  <div class="card-body">
						 <b class="text-secondarys">Beschreibung</b>
						 <p id="info-modal-text"></p>
					  </div>
				   </div>
				   <div class="card mb-0" style="margin-left: -4px;" id="info-modal-hint-card">
					  <div class="card-body">
						 <b class="text-secondarys">Hinweise</b>
						 <p id="info-modal-hints"></p>
					  </div>
				   </div>
				   <hr>
				   <div class="card" style="margin-left: -4px;">
					  <div class="card-body">
						 <b class="text-secondarys">Kontaktdaten</b>
						 <p>
							<i class="fa fa-globe" aria-hidden="true"></i>&nbsp;<a class="link-dark" id="info-modal-website" href="" target="_blank"></a><br>
							<i class="fa fa-envelope" aria-hidden="true"></i>&nbsp;<a class="link-dark" id="info-modal-email" href=""></a><br>
							<i class="fa fa-phone" aria-hidden="true"></i>&nbsp;<a class="link-dark" id="info-modal-telephone" href=""></a><br>
						 </p>
					  </div>
				   </div>
				   <hr>
				   <div class="card" style="margin-left: -4px;">
					  <div class="card-body">
						 <b class="text-secondarys">Adresse & Karte</b>
						 <p>
							<i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;<span id="info-modal-address"></span><br>
							<i class="fa fa-route" aria-hidden="true"></i>&nbsp;<a class="link-dark" id="info-modal-route" href="" target="_blank">Route</a>
						 </p>
						 <div id="leaflet_small_map" class="'.$classes .'" style="height:250px">
					  </div>
				   </div>
				</div>
				<hr>
				<div class="card" style="margin-left: -4px;">
				   <div class="card-header">
					  <b>Weitere Projekte/Angebote/Veranstaltungen der Organisation</b>
				   </div>
				   <div class="card-body" id="info-modal-organisation-data">
				   </div>
				</div>
			 </div>
			 <div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Schließen</button>
			 </div>
		  </div>
	   </div>
	</div>

	<script>
		console.log('. json_encode($settings).');
		var default_categories = '. json_encode($settings['categories']) .';
		var default_regions = '. json_encode($settings['regions']) .';
		var themeUrl = '.json_encode($settings['themeUrl']).';
		var themeAttribution = '.json_encode($settings['themeAttribution']).';
		
		var markers, map, oms, map2 = {}, former_div, single_marker, marker_data = [], categories_array = [], first_project, first_offer, first_event, service_types, entry_tap = [], all_data, default_var = 0;
		
		
	</script>
	';
}

	function map_block_leaflet_calendar_render($settings) {

		$classes = 'map_block_leaflet';
		if(array_key_exists('align', $settings)) {
			switch ($settings['align']) {
				case 'wide':
				$classes .= ' alignwide';
				break;
				case 'full':
				$classes .= ' alignfull';
				break;
			}
		}
	
		$id = uniqid('lmb_');
		$id2 = uniqid('lmb_');
	
		return '
		<!-- Add the evo-calendar.css for styling -->
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
		<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/evo-calendar@1.1.3/evo-calendar/css/evo-calendar.min.css"/>
		<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/evo-calendar@1.1.3/evo-calendar/css/evo-calendar.royal-navy.css"/>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
		<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet">
		<!-- Add jQuery library (required) -->
		<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
		<!-- Add the evo-calendar.js for.. obviously, functionality! -->
		<script src="https://cdn.jsdelivr.net/npm/evo-calendar@1.1.3/evo-calendar/js/evo-calendar.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js"></script>
		<style>

		</style>
		<div class="container mt-5" id="all_container">
		<div id=\''. $id .'\' style="height: '. $settings['height'] . 'px; zoom:90%;"></div>
		</div>

		<div class="modal left fade" id="infoModal" tabindex="" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content" id="info-modal-content">
			<div class="modal-header" id="info-modal-header" style="border-bottom: solid 5px;margin-left:-30px;margin-right:-30px;margin-top:-30px;">
				<div class="container">
				<div class="row">
				<div class="col-6">
				<b><a id="info-modal-back" class="text-dark mb-2" onclick="goBackFunction()" style="margin-bottom:10px;"><i class="fa fa-arrow-left"></i> Zurück</a></b>
				</div>
				<div class="col-6">
				<button type="button" class="btn btn-secondary float-end" data-bs-dismiss="modal">Schließen</button>
				</div>
				</div>
				<div class="row" style="margin-top:10px;">
				<div class="col-4 col-md-3 col-lg-3">
				<img src="https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/organisation_default.png" class="img-fluid cover" alt="Responsive image" id="info-modal-photo">
				</div>
				<div class="col-8 col-md-9 col-lg-9">
					<div style="display: block; margin-right: 4px;">
					<h3 id="info-modal-title"></h3>
					</div>
					<div style="display: block; margin-right: 4px;">
					<p id="info-modal-type"></p>
					</div>
					<div class="accordion-preview" id="category_accordion">
					  <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
						<div class="accordion-body">
						<div class="btn-toolbar btn-group-sm flex" id="toolbar-group" role="toolbar" aria-label="Toolbar with filter buttons" aria-expanded="false">
						</div>
						</div>
					  </div>
					  					<a class="link-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">Mehr anzeigen</a>	
					</div>	
				</div>
				</div>
				</div>
				</div>
                <div class="modal-body">
				<div id="info-modal-organisation-card">
					Von:&nbsp;<i class="fa fa-angle-right"></i>&nbsp;<b><a id="info-modal-organisation" data-link="" class="text-dark organisation_link"></a></b>
					<hr>
					</div>
					<div id="info-modal-date-card">
					<div class="row">
					<div class="col-8">
					Wann?&nbsp;<b><a id="info-modal-date" data-link="" class="text-dark"></a></b>
					</div>
					<div class="col-4">
					<button type="button" class="btn btn-outline-secondary btn-sm" id="calendarButton">Zum Kalender hinzufügen</button>
					</div>
					</div>
					<hr>
					</div>
					<div class="card mb-2" style="margin-left: -4px;">
					<div class="card-body">
					<b class="text-secondarys">Beschreibung</b>
					<p id="info-modal-text"></p>
					</div>
					</div>
					<div class="card mb-0" style="margin-left: -4px;" id="info-modal-hint-card">
					<div class="card-body">
					<b class="text-secondarys">Hinweise</b>
					<p id="info-modal-hints"></p>
					</div>
					</div>
					<hr>
					<div class="card" style="margin-left: -4px;">
					<div class="card-body">
					<b class="text-secondarys">Kontaktdaten</b>
					<p>
					<i class="fa fa-globe" aria-hidden="true"></i>&nbsp;<a class="link-dark" id="info-modal-website" href="" target="_blank"></a><br>
					<i class="fa fa-envelope" aria-hidden="true"></i>&nbsp;<a class="link-dark" id="info-modal-email" href=""></a><br>
					<i class="fa fa-phone" aria-hidden="true"></i>&nbsp;<a class="link-dark" id="info-modal-telephone" href=""></a><br>
					</p>
					</div>
					</div>
					<hr>
					<div class="card" style="margin-left: -4px;">
					<div class="card-body">
					<b class="text-secondarys">Adresse & Karte</b>
					<p>
					<i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;<span id="info-modal-address"></span><br>
					<i class="fa fa-route" aria-hidden="true"></i>&nbsp;<a class="link-dark" id="info-modal-route" href="" target="_blank">Route</a>
					</p>
					<div id=\''. $id2 .'\' class="'.$classes .'" style="height:400px"></div>
					</div>
					</div>
					<hr>
					<div class="card" style="margin-left: -4px;">
					<div class="card-header">
					<b>Weitere Projekte/Angebote/Veranstaltungen der Organisation</b>
					</div>
					<div class="card-body" id="info-modal-organisation-data">
					</div>
					</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Schließen</button>
                </div>
            </div>
        </div>
    </div>
</div>
</div>


		<script>
			console.log('. json_encode($settings).');
			var single_marker, calendar_data, categories_array, entry_tap = [], map, yellowIcon;
			var default_categories = '. json_encode($settings['categories']) .';
			var default_regions = '. json_encode($settings['regions']) .';

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
			document.addEventListener("DOMContentLoaded", function() {

						
				$("#calendarButton").click(function(event) {
					console.log("Click cal button");

					let obj_cal_btn = calendar_data.find(x => x.id === entry_tap[entry_tap.length-1].id);
					console.log(entry_tap[entry_tap.length-1]);

					event.preventDefault();
					let current_date = moment(Date.now()).utc().format("YYYYMMDD");
					let current_time = moment(Date.now()).utc().format("HHmmss");
					let event_start_date = moment(obj_cal_btn.start_at).utc().format("YYYYMMDD");
					let event_start_time = moment(obj_cal_btn.start_at).utc().format("HHmmss");
					let event_end_date = moment(obj_cal_btn.end_at).utc().format("YYYYMMDD");
					let event_end_time = moment(obj_cal_btn.end_at).utc().format("HHmmss");
					let description_data;
					
					$.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/users/" + obj_cal_btn.user_id + ".json", function( organisation_data ) {

						description_data = "Von: " + organisation_data.name + " | ";
												
						if(organisation_data.website != null){
							description_data += "Website: " + organisation_data.info_url + " | ";
						}
						if(obj_cal_btn.email != null){
							description_data += "E-Mail: " + obj_cal_btn.email + " | ";
						}else if (organisation_data.email != null){
							description_data += "E-Mail: " + organisation_data.email + " | ";
						}
						if(organisation_data.telephone != null){
							description_data += "Tel-Nr.: " + organisation_data.phone_primary + " | ";
						}
						if(obj_cal_btn.description != null){
							description_data += "Beschreibung: " + obj_cal_btn.description + " | ";
						}
						if(obj_cal_btn.hints != null){
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

				

				  var eventObj = [
					{
					  id: "bHay68s", // Event"s ID (required)
					  name: "Tauschmarkt", // Event name (required)
					  badge: "10:00 - 16:00 Uhr",
					  date: "04/30/2022", // Event date (required)
					  type: "offer", // Event type (required)
					  color: "#7743f0" ,
					  "latlng": {
						"lat": 51.344688692548985,
						"lng": 12.40929480960208
					},
					"times": ["14:00", "18:00"]
					},
					{
						id: "bHay68t", // Event"s ID (required)
						name: "Sammelfest", // Event name (required)
						badge: "08:00 - 18:00 Uhr",
						date: "04/02/2022", // Event date (required)
						type: "offer", // Event type (required)
						color: "#ddb713",
						"latlng": {
							"lat": 51.344688692548985,
							"lng": 12.40929480960208
						},
						"times": ["14:00", "18:00"]
					  },
					  {
						id: "bHay68u", // Event"s ID (required)
						name: "Cleanup 1", // Event name (required)
						badge: "16:00 - 18:00 Uhr",
						date: "04/03/2022", // Event date (required)
						type: "angebot", // Event type (required)
						color: "#4bfa30",
						"latlng": {
							"lat": 51.344688692548985,
							"lng": 12.40929480960208
						},
						"times": ["14:00", "18:00"]
					  },
					  {
						id: "bHay68v", // Event"s ID (required)
						name: "Cleanup 2", // Event name (required)
						badge: "16:00 - 18:00 Uhr",
						date: "04/13/2022", // Event date (required)
						type: "fest", // Event type (required)
						color: "#1decaf",
						"latlng": {
							"lat": 51.344688692548985,
							"lng": 12.40929480960208
						},
						"times": ["14:00", "18:00"]
					  },
					  {
						id: "bHay68w", // Event"s ID (required)
						name: "Workshop", // Event name (required)
						badge: "13:00 - 14:00 Uhr",
						date: "04/17/2022", // Event date (required)
						type: "angebot", // Event type (required)
						description: "Der Workshop dient zur Auseinandersetzung mit der persönlichen Abfallvermeidung.",
						color: "#ddb713",
						"latlng": {
							"lat": 51.344688692548985,
							"lng": 12.40929480960208
						},
						"times": ["14:00", "18:00"]
					  },
					{
					  id: "sdf222",
					  name: "Tauschfest",
					  badge: "13. April - 16. April", // Event badge (optional)
					  date: ["04/13/2022", "04/16/2022"], // Date range
					  description: "Event über 3 Tage", // Event description (optional)
					  type: "event",
					  color: "#63d867", // Event custom color (optional),
					  "latlng": {
						"lat": 51.344688692548985,
						"lng": 12.40929480960208
					},
					"times": ["14:00", "18:00"]
					}
				];
				var calendar = $('. $id .').evoCalendar({
					theme: "Royal Navy",
					language: "de",
					format: "dd. MM yyyy",
					eventHeaderFormat: "dd. MM yyyy",
					titleFormat: "MM",
					firstDayofWeek: 1,
					todayHighlight: true
				});

			var center = [51.340199,12.360103]; //51.340199,12.360103

			var layer = L.tileLayer(\''. $settings['themeUrl'] . '\', {
				attribution: \''. $settings['themeAttribution'] .'\'
			})

			map = L.map('. $id2 .', { center: center, layers: [layer]});
			map.setView(center, 13);
			//map.scrollWheelZoom.disable();
			
			yellowIcon = new L.Icon({
				iconUrl: "https://cdn.mapmarker.io/api/v1/pin?icon=fa-calendar&size=100&background=ffbb33&hoffset=0&voffset=-1",
				iconSize: [40, 40],
				iconAnchor: [20, 34],
				popupAnchor: [0, -28]
			  });

		var container = document.getElementById("' . $id2 . '");
		
		var observer = ResizeObserver && new ResizeObserver(function() {
		  map.invalidateSize(true);
		});
		observer && observer.observe(container);



		function getDataPoints(){
			let urls = [
				"https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=education",
				"https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=counseling",
				"https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/activities.json?type=event&upcoming",
			]

			var region_arr = default_regions;
			var category_arr =  default_categories;
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
		}

		function getAPIData(web_addresses){
			$("#all_container").LoadingOverlay("show",{
				image       : "",
				fontawesome : "fa fa-recycle fa-spin",
				zIndex: 2
			});
		$.when.apply($, web_addresses.map(function(url) {
			return $.getJSON(url);
		})).done(function() {
			$("#all_container").LoadingOverlay("hide");
			var data_helper = [];
			console.log(arguments);
			if(web_addresses.length > 1){
				data_helper.push(arguments[0][0]);
				data_helper.push(arguments[1][0]);
				data_helper.push(arguments[2][0]);
				var data = [].concat.apply([], data_helper);

			}else{
				var data = arguments[0];
			}
			// all data is now in the results array in order
			console.log(data);
			//make data global

			calendar_data = data;

		//$("#info-result-number").text(data.length + " Ergebnisse");
		
		service_types=[];
		
		$.each( data, function(ind, elem) {
			service_types.push(elem.service_type);
			elem.color = "#FFBF00";
			switch(elem.service_type){
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
			if (elem.description != null){
				elem.shortdescription = elem.description.substring(0,120) + "...";
			}
			if(elem.name.length > 17){
				elem.shortname = elem.name.substring(0,15) + "...";
			}else{
				elem.shortname = elem.name;
			}
			if(elem.start_at != null && elem.end_at != null){
				
				elem.start_datetime = moment(elem.start_at).format("DD.MM.YYYY HH:mm");
				elem.end_datetime = moment(elem.end_at).format("DD.MM.YYYY HH:mm");
				elem.start_date = moment(elem.start_at).format("MM/DD/YYYY");
				elem.end_date = moment(elem.end_at).format("MM/DD/YYYY");
				let date_arr;
				if(elem.start_date != elem.end_date){
					date_arr = [elem.start_date, elem.end_date];
				}else if(elem.start_date == elem.end_date){
					date_arr = elem.start_date;
				}
				
				$("#'. $id .'").evoCalendar("addCalendarEvent", [{
					id: elem.id,
					name: elem.shortname,
					date: date_arr,
					badge: elem.start_datetime + " - " + elem.end_datetime,
					type: elem.service_type,
					color: elem.color,
					description: elem.shortdescription
				  }]);
			}else if((elem.start_at == null) && (elem.end_at != null)){
				elem.end_datetime = moment(elem.end_at).format("DD.MM.YYYY HH:mm");
				elem.end_date = moment(elem.end_at).format("MM/DD/YYYY");
				$("#'. $id .'").evoCalendar("addCalendarEvent", [{
					id: elem.id,
					name: elem.shortname,
					date: elem.end_date,
					badge: "Ende: " + elem.end_datetime,
					type: elem.service_type,
					color: elem.color,
					description: elem.shortdescription
				  }]);
			}else if((elem.start_at != null) && (elem.end_at == null)){
				elem.start_datetime = moment(elem.start_at).format("DD.MM.YYYY HH:mm");
				elem.start_date = moment(elem.start_at).format("MM/DD/YYYY");
				$("#'. $id .'").evoCalendar("addCalendarEvent", [{
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

$.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/categories.json", function( data ) {

	categories_array = data;
});
		  
		  $('. $id .').on("selectEvent", function(event, activeEvent) {
			modalTrigger(activeEvent.id);
		  });

		  $(document).on("click",".modal_link",function(e) {
			var marker_id_long = e.target.id;
			var marker_id = marker_id_long.substr(0, marker_id_long.indexOf("_"));
			modalTrigger(parseInt(marker_id));
			});


			$(document).on("click",".organisation_link",function(e) { 
				$(".modal-content").animate({ scrollTop: 0 });
				$("#infoModal").modal("show");
				$("#info-modal-content").LoadingOverlay("show",{
					image       : "",
					fontawesome : "fa fa-recycle fa-spin",
					zindex: 2
				});
				var org_id = event.target.getAttribute("data-link");
				var org_id = $("#info-modal-organisation").attr("data-link");
				
				let entry_obj = {"type":1,"id":org_id};
				entry_tap.push(entry_obj);
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
				$.getJSON("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/users/" + org_id + ".json", function( organisation_data ) {
					$("#info-modal-title").text(organisation_data.name);
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
						map.removeLayer(single_marker);
					  };

					if(organisation_data.latlng == null){
						$.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + organisation_data.full_address, function( organisation_latlng_data ) {
							organisation_data.latlng = [organisation_latlng_data[0].lat, organisation_latlng_data[0].lon];
							single_marker = L.marker([organisation_data.latlng[0], organisation_data.latlng[1]]).addTo(map)
							.bindPopup("<b>"+organisation_data.name+"</b>");
							map.setView([organisation_data.latlng[0], organisation_data.latlng[1]], 13);
						});
					}else{
						single_marker = L.marker([organisation_data.latlng[0], organisation_data.latlng[1]]).addTo(map)
						.bindPopup("<b>"+organisation_data.name+"</b>");
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
			function modalTrigger(event_id){
				$(".modal-content").animate({ scrollTop: 0 });
				$("#infoModal").modal("show");
				$("#info-modal-content").LoadingOverlay("show",{
					image       : "",
					fontawesome : "fa fa-recycle fa-spin",
					zindex: 2
				});
	
				var obj = calendar_data.find(x => x.id === event_id);
				console.log(event_id);
				console.log(obj);
				
					/*var date_var = "";
					var times_var = "";
					if($.isArray(singleEvent.date)){
						jQuery.each(singleEvent.date, function(index, item) {
							var d = new Date(item);
							var curr_date = d.getDate();
							var curr_month = d.getMonth();
							var curr_year = d.getFullYear();
							var newDate = curr_date + "." + curr_month + "." + curr_year;
							date_var += newDate;
							if(index == 0){
								date_var += " - ";
							}
						});
						$("#event_dates").text(singleEvent.date);
					}else{
						var d = new Date(singleEvent.date);
						var curr_date = d.getDate();
						var curr_month = d.getMonth();
						var curr_year = d.getFullYear();
						var newDate = curr_date + "." + curr_month + "." + curr_year;
						date_var = newDate;
					}
					$("#event_dates").text(date_var);
	
					if($.isArray(singleEvent.times)){
						jQuery.each(singleEvent.times, function(index, item) {
							var d = new Time(item);
							var curr_hour= d.getHours();
							var curr_minute = d.getMinutes();
							var newDate = curr_hour + ":" + curr_minute;
							times_var += newDate;
							if(index == 0){
								times_var += " - ";
							}
						});
					}else{
						var d = new Date(singleEvent.times);
						var curr_date = d.getDate();
						var curr_month = d.getMonth();
						var curr_year = d.getFullYear();
						var newDate = curr_date + "." + curr_month + "." + curr_year;
						times_var = newDate;
					}
	
					$("#event_times").text(times_var);*/
	
					//add from map part
	
					$("#info-modal-organisation").text("");
					  var hint_card = document.getElementById("info-modal-hint-card");
					  hint_card.style.display  = "block";
						var category_accord = document.getElementById("category_accordion");
						category_accord.style.display  = "block";
						var organisation_info = document.getElementById("info-modal-organisation-card");
					  organisation_info.style.display  = "block";
					  $("#info-modal-back").show();
					  $("#info-modal-date-card").hide();
					
					  let entry_obj = {"type":0,"id":event_id};
					  entry_tap.push(entry_obj);
					  console.log(entry_tap);

					  
					  if(entry_tap.length > 1){
						$("#info-modal-back").show();
					  }else{
						$("#info-modal-back").hide();
					  }

					 

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
					switch(obj.service_type){
						case "Veranstaltung":
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
							$("#info-modal-date-card").show();
							$("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/offer.png");
							break;
						case "Bildungsangebot":
							$("#info-modal-date-card").show();
							$("#info-modal-photo").attr("src", "https://buendnis-abfallvermeidung.de/wp-content/uploads/2022/06/education.png");
							break;
						}
						if(obj.image_url_base != null){
							$("#info-modal-photo").attr("src", obj.image_url_base + "?width=200&height=200");
						}
					document.getElementById("info-modal-header").style.borderBottomColor = obj.color;
					$("#info-modal-type").css("color", obj.color);
	
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
						map.removeLayer(single_marker);
					  };
					  if(obj.latlng == null && obj.full_address != null){
						$.getJSON("https://nominatim.openstreetmap.org/search?format=json&q=" + obj.full_address, function( obj_latlng_data ) {
							if(obj_latlng_data.length != 0){
								obj.latlng = [obj_latlng_data[0].lat, obj_latlng_data[0].lon];
								single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {icon:yellowIcon}).addTo(map).bindPopup("<b>"+obj.name+"</b>");
								map.setView([obj.latlng[0], obj.latlng[1]], 13);
							}
						});
					}else if (obj.latlng != null ){
						single_marker = L.marker([obj.latlng[0], obj.latlng[1]], {icon:yellowIcon}).addTo(map)
						.bindPopup("<b>"+obj.name+"</b>");
						map.setView([obj.latlng[0], obj.latlng[1]], 13);
					}

					// fil div info-modal-organisation-data with all data
					var org_data_container = document.getElementById("info-modal-organisation-data");

					var org_data_arr = calendar_data.filter(x => (x.user_id === parseInt(obj.user_id)) && (x.id != parseInt(obj.id)));
					if(org_data_arr.length > 0){
						org_data_container.innerHTML = returnOrgActivities(org_data_arr);
					}else{
						org_data_container.innerHTML = "<p>Leider keine weiteren Angebote/Veranstaltungen vorhanden!</p>"
					}

					
				};

				$("#infoModal").on("hidden.bs.modal", function () {
					entry_tap = [];
					console.log("hidden!");
				  })

				function goBackFunction(e) {
					console.log(entry_tap);
					entry_tap.pop();
					console.log(entry_tap[entry_tap.length-1]);
					let entry_tap_id = entry_tap[entry_tap.length-1].id;
					console.log(entry_tap_id);
					if(entry_tap[entry_tap.length-1].type === 1){
						$(".organisation_link").click();
						entry_tap.pop();
					}else{
						modalTrigger(parseInt(entry_tap_id));
						entry_tap.pop();
						if(entry_tap.length > 1){
							$("#info-modal-back").show();
						  }else{
							$("#info-modal-back").hide();
						  }
					}
					console.log(entry_tap);
				}

			/*function goBackFunction(e) {
				console.log(entry_tap);
				modalTrigger(parseInt(entry_tap));
			}*/
		</script>
		';
}


/**
 * Dequeue assets from plugin block leaflet if isn't in page
 */
function map_block_leaflet_dequeue_lib_script()
{
  $id = get_the_ID();
  if (!has_block('map-block-leaflet/map-block-leaflet', $id)) {
    wp_dequeue_script('lib-js-map-block-leaflet');
    wp_dequeue_script('lib-js-map-block-leaflet-cluster');
    wp_dequeue_script('js-editor-map-block-leaflet');

    wp_dequeue_style('css-editor-map-block-leaflet');
    wp_dequeue_style('lib-css-map-block-leaflet');
    wp_dequeue_style('lib-css-map-block-leaflet-cluster');
	wp_dequeue_style('lib-css-bootstrap-blocks');
  }
}

add_action('wp_enqueue_scripts', 'map_block_leaflet_dequeue_lib_script');