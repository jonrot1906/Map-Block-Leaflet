<?php
/**
 *
 * @author      Jesús Olazagoitia/Jonas Rotter
 * @license     GPL2+
 *
 * @wordpress-plugin
 * Plugin Name: Nachhaltigkeitskarte
 * Description: Die Nachhaltigskeitskarte vom Leipziger Bündnis Abfallvermeidung. Unter Nutzung der APIv1 des Datenbank des LVNS (https://daten.nachhaltiges-sachsen.de) können sachsenweit je nach Filterkriterien nachhaltige Orte, Initiativen, Angebote und Veranstaltungen angezeigt werden.
 * Version:     1.1.0
 * Author:      Jonas Rotter
 * Text Domain: nachhaltigkeitskarte-leipzig
 * Domain Path: /languages
 * License:     GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */


//  Exit if accessed directly.
if (! defined('ABSPATH')) {
    exit;
}

function nachhaltigkeitskarte_load_textdomain() {
	load_plugin_textdomain('nachhaltigkeitskarte-leipzig', false, basename( __DIR__ ) . '/languages' );
}
add_action( 'init', 'nachhaltigkeitskarte_load_textdomain' );

function nachhaltigkeitskarte_register() {
	if(!function_exists('register_block_type')) {
		return;
	}

	$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

	// Enqueue lib assets
	$lib_script_path = '/lib/leaflet.js';
	$lib_style_path = '/lib/leaflet.css';
	$lib_version = '1.7.1';
	$google_fonts_style_path = '/lib/Open+Sans-400,400i,700,700i.css';


	wp_register_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');
	wp_enqueue_style('bootstrap-css');
	wp_register_style('bootstrap-select-css', 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.14.0-beta2/css/bootstrap-select.min.css');
	wp_register_style('font-awesome-css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');
	wp_enqueue_style('font-awesome-css');
	wp_register_style('fonts-css', plugins_url($google_fonts_style_path, __FILE__));
	wp_enqueue_style('fonts-css');
	wp_register_style('easy-button-css', 'https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.css');
	wp_register_style('evo-calendar-css', 'https://cdn.jsdelivr.net/npm/evo-calendar@1.1.3/evo-calendar/css/evo-calendar.min.css');
	wp_register_style('evo-calendar-navy-css', 'https://cdn.jsdelivr.net/npm/evo-calendar@1.1.3/evo-calendar/css/evo-calendar.royal-navy.css');
	wp_register_style('color-calendar-css', 'https://cdn.jsdelivr.net/npm/color-calendar/dist/css/theme-basic.css');

	
	
	wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js', array('jquery'), null, true);
	wp_enqueue_script('bootstrap-js');
	wp_register_script('bootstrap-select-js', 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.14.0-beta2/js/bootstrap-select.min.js', array('jquery'), null, true);
	wp_register_script('bootstrap-select-german-js', 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.14.0-beta2/js/i18n/defaults-de_DE.min.js', array('jquery'), null, true);
	wp_register_script('font-awesome-js', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/js/all.min.js', array('jquery'), null, true);
	wp_enqueue_script('font-awesome-js');
	wp_register_script('loading-overlay-js', 'https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js', array('jquery'), null, true);
	wp_enqueue_script('loading-overlay-js');
	wp_register_script('moment-js', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js', array('jquery'), null, true);
	wp_enqueue_script('moment-js');
	wp_register_script('moment-german-js', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/locale/de.min.js', array('jquery'), null, true);
	wp_enqueue_script('moment-german-js');
	wp_register_script('oms-js', 'https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier-Leaflet/0.2.6/oms.min.js', array('jquery', 'lib-js-nachhaltigkeitskarte-leipzig'), null, true);
	wp_register_script('easy-button-js', 'https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.js', array('jquery', 'lib-js-nachhaltigkeitskarte-leipzig'), null, true);
	wp_register_script('sweetalert-js', 'https://cdn.jsdelivr.net/npm/sweetalert2@11', array('jquery'), null, true);
	wp_enqueue_script('sweetalert-js');
	wp_register_script('jquery-ui-js', 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js', array('jquery'), null, true);
	wp_register_script('list-js', 'https://cdnjs.cloudflare.com/ajax/libs/list.js/2.3.1/list.min.js', array('jquery'), null, true);
	wp_register_script('evo-calendar-js', 'https://cdn.jsdelivr.net/npm/evo-calendar@1.1.3/evo-calendar/js/evo-calendar.min.js', array('jquery'), null, true);
	wp_register_script('color-calendar-js', 'https://cdn.jsdelivr.net/npm/color-calendar/dist/bundle.js', array('jquery'), null, true);
	

	wp_register_style( 'lib-css-nachhaltigkeitskarte-leipzig', plugins_url($lib_style_path, __FILE__), array(), $lib_version );
	wp_register_script( 'lib-js-nachhaltigkeitskarte-leipzig', plugins_url($lib_script_path, __FILE__), array('jquery', 'bootstrap-js'), $lib_version, false );
	wp_register_style( 'lib-css-nachhaltigkeitskarte-leipzig-sustainability', plugins_url("/lib/Map_Calendar_Design.css", __FILE__), array("lib-css-nachhaltigkeitskarte-leipzig"), $lib_version );
	wp_register_script( 'lib-js-nachhaltigkeitskarte-leipzig-sustainability', plugins_url("/lib/sustainability_map.js", __FILE__), array("lib-js-nachhaltigkeitskarte-leipzig", 'jquery', 'bootstrap-js'), $lib_version, false );
	wp_register_script( 'lib-js-calendar-block-leaflet-sustainability', plugins_url("/lib/sustainability_calendar.js", __FILE__), array("lib-js-nachhaltigkeitskarte-leipzig", 'jquery', 'bootstrap-js'), $lib_version, false );

	// Enqueue the bundled block JS file
	wp_register_script(
		'js-editor-nachhaltigkeitskarte-leipzig',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);

	// register editor styles
	wp_register_style(
		'css-editor-nachhaltigkeitskarte-leipzig',
		plugins_url( 'build/index.css', __FILE__ ),
        [],
		$asset_file['version']
	);

	// Register nachhaltigkeitskarte-leipzig-map
    register_block_type( 'nachhaltigkeitskarte-leipzig/nachhaltigkeitskarte-leipzig-map', array(
		'editor_script' => 'js-editor-nachhaltigkeitskarte-leipzig',
		'editor_style' => 'css-editor-nachhaltigkeitskarte-leipzig',
		'render_callback' => 'nachhaltigkeitskarte_map_render',
		'script' => 'lib-js-nachhaltigkeitskarte-leipzig-sustainability',
		'style' => 'lib-css-nachhaltigkeitskarte-leipzig-sustainability',
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

	 // Register nachhaltigkeitskarte-leipzig-calendar
	 register_block_type( 'nachhaltigkeitskarte-leipzig/nachhaltigkeitskarte-leipzig-calendar', array(
		'editor_script' => 'js-editor-nachhaltigkeitskarte-leipzig',
		'editor_style' => 'css-editor-nachhaltigkeitskarte-leipzig',
		'render_callback' => 'nachhaltigkeitskarte_calendar_render',
		'script' => 'lib-js-calendar-block-leaflet-sustainability',
		'style' => 'lib-css-nachhaltigkeitskarte-leipzig-sustainability',
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
add_action('init', 'nachhaltigkeitskarte_register');


function nachhaltigkeitskarte_map_render($settings) {

	wp_enqueue_style('bootstrap-select-css');
	wp_enqueue_style('easy-button-css');
	wp_enqueue_script('bootstrap-select-js');
	wp_enqueue_script('bootstrap-select-german-js');
	wp_enqueue_script('oms-js');
	wp_enqueue_script('easy-button-js');
	wp_enqueue_script('jquery-ui-js');
	wp_enqueue_script('list-js');

	$classes = 'nachhaltigkeitskarte';
	if(array_key_exists('align', $settings)) {
		switch ($settings['align']) {
			case 'wide':
			$classes_all = ' alignwide';
			break;
			case 'full':
			$classes_all = ' alignfull';
			break;
		}
	}

	return '
	<div class="container mt-5 mb-5 '.$classes_all .'" id="all_container">
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
						 <div class="col-12 col-sm-8 py-1">
							<input type="text" class="form-control search bg-white" placeholder="Angebot gesucht?" aria-label="Suche">
						 </div>
						 <div class="col-12 col-sm-4 py-1">
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
		  <hr>
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
		var default_categories = '. json_encode($settings['categories']) .';
		var default_regions = '. json_encode($settings['regions']) .';
		var themeUrl = '.json_encode($settings['themeUrl']).';
		var themeAttribution = '.json_encode($settings['themeAttribution']).';
		var default_height = '.json_encode($settings['height']).';
		
		var markers, map, oms, map2 = {}, former_div, single_marker, marker_data = [], categories_array = [], first_project, first_offer, first_event, service_types, entry_tap = [], all_data, default_var = 0;
	</script>
	';
}

	function nachhaltigkeitskarte_calendar_render($settings) {

		wp_enqueue_style('evo-calendar-css');
		wp_enqueue_style('evo-calendar-navy-css');
		wp_enqueue_script('evo-calendar-js');
		wp_enqueue_style('color-calendar-css');
		wp_enqueue_script('color-calendar-js');

		$classes = 'nachhaltigkeitskarte';
		if(array_key_exists('align', $settings)) {
			switch ($settings['align']) {
				case 'wide':
				$classes_all .= ' alignwide';
				break;
				case 'full':
				$classes_all .= ' alignfull';
				break;
			}
		}
	
		$id = uniqid('lmb_');
		$id2 = uniqid('lmb_');
	
		return '
<div class="container mt-5 '.$classes_all .'" id="all_container">
   <hr>
   <div class="row gx-5">
   <div class="col-xs-6 col-md-4 mt-2" id="color-calendar">
   </div>
   <div class="col-xs-6 col-md-8 bg-light result_wrapper mt-2" id="list_wrapper_cal" style="height: inherit;box-shadow:0 7px 30px -10px rgba(150, 170, 180, 0.5);">
   <div class="row g-1 mt-1">
   <div class="text-end">
	  <button type="button" class="btn btn-outline-dark border-white" id="questionSwal">
	  <i class="fa fa-question-circle" aria-hidden="true"></i>
	  </button>
   </div>
</div>
   <div class="events-display"></div>
   </div>
   
	</div>
	</div>

   <div class="row py-1">
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
                  <div id="leaflet_map_small" class="'.$classes .'" style="height:400px"></div>
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
			var default_categories = '. json_encode($settings['categories']) .';
			var default_regions = '. json_encode($settings['regions']) .';
			var themeUrl = '.json_encode($settings['themeUrl']).';
			var themeAttribution = '.json_encode($settings['themeAttribution']).';
			var single_marker, calendar_data, categories_array, entry_tap = [], map, yellowIcon;
		</script>
		';
}


/**
 * Dequeue assets from plugin block leaflet if isn't in page
 */
function nachhaltigkeitskarte_dequeue_lib_script()
{
  $id = get_the_ID();
  if (!has_block('nachhaltigkeitskarte-leipzig/nachhaltigkeitskarte-leipzig', $id)) {
    wp_dequeue_script('lib-js-nachhaltigkeitskarte-leipzig');
    wp_dequeue_script('lib-js-nachhaltigkeitskarte-leipzig-sustainability');
	wp_dequeue_script('lib-js-calendar-block-leaflet-sustainability');
    wp_dequeue_script('js-editor-nachhaltigkeitskarte-leipzig');

    wp_dequeue_style('css-editor-nachhaltigkeitskarte-leipzig');
    wp_dequeue_style('lib-css-nachhaltigkeitskarte-leipzig');
    wp_dequeue_style('lib-css-nachhaltigkeitskarte-leipzig-sustainability');
	wp_dequeue_style('lib-css-bootstrap-blocks');
  }

}

add_action('wp_enqueue_scripts', 'nachhaltigkeitskarte_dequeue_lib_script');