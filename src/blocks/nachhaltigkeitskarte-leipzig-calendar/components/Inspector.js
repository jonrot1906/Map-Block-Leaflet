import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl, SelectControl } from "@wordpress/components";

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
            fetch_regions.push({label: "- " + region.name, value: region.id})
        })
      })
      .catch(error => {
        console.log(error);
      });
}

function getCategoryData(){
    console.log("Fetch again");
    fetch("https://blooming-chamber-31847.herokuapp.com/https://daten.nachhaltiges-sachsen.de/api/v1/categories.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        fetch_categories.push({label: "Kategorie(n) auswählen", value: "", disabled:true});
        fetch_categories.push({label: "- Alle", value: ""});
        data.map((category) => {
            if(category.depth == 0){
                fetch_categories.push({label: "- " + category.name, value: category.id})
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
    const addRegion = (region) => {
        setAttributes( { regions : region });
    }
    const addCategory = (category) => {
        console.log(category);
        setAttributes( { categories : category });
    }


    return (
        <InspectorControls>
<PanelBody title={__('Regionen voreinstellen', 'nachhaltigkeitskarte-leipzig')} initialOpen={false}>

<SelectControl style={{height: "auto", overflow: "scroll"}}
    multiple={true}
    label="Regionen"
    value={attributes.regions}
    options={fetch_regions}
    onChange={addRegion}
    __nextHasNoMarginBottom
/>

</PanelBody>
<PanelBody title={__('Kategorien voreinstellen', 'nachhaltigkeitskarte-leipzig')} initialOpen={false}>

<SelectControl style={{height: "auto", overflow: "scroll"}}
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