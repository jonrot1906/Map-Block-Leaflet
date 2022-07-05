import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";
import { useState } from '@wordpress/element';

import themes from '../../../shared/themes';
import providers from '../../../shared/providers';
import ThemePicker from '../../../components/ThemePicker';
import AddMarker from "./AddMarker";
import ListMarkers from "./ListMarkers";

const Inspector = ( props ) => {
    const { attributes, setAttributes } = props;
    const { themeId } = attributes;

    const setTheme = ({ id }) => {
        const themeSelected = providers.find( provider => provider.id === id);
        if( themeSelected) {
            setAttributes({
                themeId: themeSelected.id,
                themeUrl: themeSelected.url,
                themeAttribution: themeSelected.attribution,
            })
        }
    }
    console.log(attributes.regions);

    var fetch_regions = [];
    
    function getRegionData(){
        fetch("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/regions.json")
          .then(response => {
            return response.json();
          })
          .then(data => {
            console.log(data);
            data.map((region) => {
                fetch_regions.push({label: region.name, value: region.id})
            })
          })
          .catch(error => {
            console.log(error);
          });
    }

    getRegionData();

    const addMarker = (marker) => {
        setAttributes( { markers : attributes.markers.concat(marker) });
    }

    const addRegion = (region) => {
        setAttributes( { regions : region });
    }

    const handleChangeMarkers = (markers) => {
        setAttributes({ markers });
    }

    return (
        <InspectorControls>
                    <PanelBody title={__('Markers', 'map-block-leaflet')} initialOpen>
            <AddMarker themeUrl={attributes.themeUrl} onCreate={addMarker} />
            <ListMarkers themeUrl={attributes.themeUrl} onChange={handleChangeMarkers} markers={attributes.markers} />
        </PanelBody>
        <PanelBody title={__('Theme', 'map-block-leaflet')} initialOpen={false}>
            <ThemePicker
                value={ themeId }
                themes={ themes }
                onChange={ setTheme }
            />
        </PanelBody>
        <PanelBody title={__('Plugin-Optionen', 'map-block-leaflet')} initialOpen={false}>

<SelectControl style={{height: "auto"}}
    multiple={true}
    label="Regionen"
    value={attributes.regions}
    options={fetch_regions}
    onChange={addRegion}
    __nextHasNoMarginBottom
/>

</PanelBody>
    </InspectorControls>
    )
}

export default Inspector