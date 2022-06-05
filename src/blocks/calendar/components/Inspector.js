import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";

const Inspector = ( props ) => {
    const { attributes, setAttributes } = props;
    const { height } = attributes;
    return (
        <InspectorControls>
                    <PanelBody title={__('Options', 'map-block-leaflet')} initialOpen={false}>

<label class="blocks-base-control__label" for="calendar-block-text-control-lon">{__('Calendar height', 'map-block-leaflet')}</label>
<TextControl 
    onChange={ height => setAttributes({height: Number(height)})}
    id="calendar-block-text-control-lon"
    type="number"
    step="10"
    value={height}
/>
</PanelBody>
    </InspectorControls>
    )
}

export default Inspector