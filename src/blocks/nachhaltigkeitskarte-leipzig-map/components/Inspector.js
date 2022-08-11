import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl, TextControl } from "@wordpress/components";

import themes from '../../../shared/themes';
import providers from '../../../shared/providers';
import ThemePicker from '../../../components/ThemePicker';

var fetch_categories = [];
var fetch_regions = [];

function getRegionData(){
    fetch("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/regions.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        fetch_regions.push({label: "Region(en) auswählen", value: "", disabled:true});
        fetch_regions.push({label: "- Alle", value: ""});
        data.map((region) => {
            fetch_regions.push({label: "- " + region.name, value: region.id});
        })
      })
      .catch(error => {
        console.log(error);
      });
}

function getCategoryData(){
    fetch("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/categories.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        fetch_categories.push({label: "Kategorie(n) auswählen", value: "", disabled:true});
        fetch_categories.push({label: "- Alle", value: ""});
        data.map((category) => {
            if(category.depth == 0){
                fetch_categories.push({label: "- " + category.name, value: category.id});
            }
        })
      })
      .catch(error => {
        console.log(error);
      });
}

getRegionData();
getCategoryData();

const Inspector = ( props ) => {
    const { attributes, setAttributes } = props;
    const { themeId, height } = attributes;

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

    const addRegion = (region) => {
        setAttributes( { regions : region });
    }
    const addCategory = (category) => {
        setAttributes( { categories : category });
    }

    return (
        <InspectorControls>
                                <PanelBody title={__('Optionen', 'nachhaltigkeitskarte-leipzig')} initialOpen={false}>

<label class="blocks-base-control__label" for="calendar-block-text-control-lon">{__('Karten-Größe', 'nachhaltigkeitskarte-leipzig')}</label>
<TextControl 
    onChange={ height => setAttributes({height: Number(height)})}
    id="calendar-block-text-control-lon"
    type="number"
    step="10"
    value={height}
/>
<small class="blocks-base-control__label" for="calendar-block-text-control-lon">mind. 650px empfohlen</small>
</PanelBody>
        <PanelBody title={__('Theme', 'nachhaltigkeitskarte-leipzig')} initialOpen={false}>
            <ThemePicker
                value={ themeId }
                themes={ themes }
                onChange={ setTheme }
            />
        </PanelBody>
        <PanelBody title={__('Regionen voreinstellen', 'nachhaltigkeitskarte-leipzig')} initialOpen={false}>

<SelectControl style={{height: "auto"}}
    multiple={true}
    label="Regionen"
    value={attributes.regions}
    options={fetch_regions}
    onChange={addRegion}
    __nextHasNoMarginBottom
/>

</PanelBody>
<PanelBody title={__('Kategorien voreinstellen', 'nachhaltigkeitskarte-leipzig')} initialOpen={false}>

<SelectControl style={{height: "auto"}}
    multiple={true}
    label="Kategorien"
    value={attributes.categories}
    options={fetch_categories}
    onChange={addCategory}
    __nextHasNoMarginBottom
/>


</PanelBody>
    </InspectorControls>
    )
}

export default Inspector