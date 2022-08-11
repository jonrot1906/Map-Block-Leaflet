import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { 
    PanelBody,
    TextareaControl,
    TextControl,
    RangeControl,
    ToggleControl
} from "@wordpress/components";
import themes from '../../../shared/themes';
import providers from '../../../shared/providers';
import ThemePicker from '../../../components/ThemePicker';

const Inspector = ( props ) => {
    const { attributes, setAttributes } = props;
    const { lat, lng, height, content, zoom, themeId, disableScrollZoom, themeUrl, themeAttribution } = attributes;

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

    const safeThemeUrl = (url) => {
        const reqex = /{ext}|{ex}|{e}$/;
        return url.replace(reqex, 'png');
    }

    return (
        <InspectorControls>
        <PanelBody>
            <TextareaControl 
            label={__('Content of tooltip', 'nachhaltigkeitskarte-leipzig')}
                onChange={ content => setAttributes({content})}
                value={content}
            />
        </PanelBody>
        <PanelBody title={__('Theme', 'nachhaltigkeitskarte-leipzig')} initialOpen={false}>
       
        <ThemePicker
            value={ themeId }
            themes={ themes }
            onChange={ setTheme }
        />
       <label class="blocks-base-control__label" for="nachhaltigkeitskarte-leipzig-text-control-xyz">{__('XYZ Tiles', 'nachhaltigkeitskarte-leipzig')}</label>
      <TextControl 
          onChange={ themeUrl => setAttributes({ themeId: '', themeUrl: safeThemeUrl(themeUrl) })}
          id="nachhaltigkeitskarte-leipzig-text-control-xyz"
          type="text"
          value={themeUrl}
      />
       <label class="blocks-base-control__label" for="nachhaltigkeitskarte-leipzig-text-control-attribution">{__('Attribution', 'nachhaltigkeitskarte-leipzig')}</label>
      <TextControl 
          onChange={ themeAttribution => setAttributes({  themeAttribution })}
          id="nachhaltigkeitskarte-leipzig-text-control-attribution"
          type="text"
          value={themeAttribution}
      />
        </PanelBody>
        <PanelBody title={__('Position', 'nachhaltigkeitskarte-leipzig')} initialOpen={false}>
            <label class="blocks-base-control__label" for="nachhaltigkeitskarte-leipzig-text-control-lat">{__('Latitude', 'nachhaltigkeitskarte-leipzig')}</label>
            <TextControl 
                id="nachhaltigkeitskarte-leipzig-text-control-lat"
                onChange={ lat => setAttributes({ lat: Number(lat) })}
                type="number"
                value={lat}
            />
            <label class="blocks-base-control__label" for="nachhaltigkeitskarte-leipzig-text-control-lon">{__('Longitude', 'nachhaltigkeitskarte-leipzig')}</label>
            <TextControl 
                onChange={ lng => setAttributes({lng: Number(lng)})}
                id="nachhaltigkeitskarte-leipzig-text-control-lon"
                type="number"
                value={lng}
            />
            <RangeControl
                label={__("Zoom", "nachhaltigkeitskarte-leipzig")}
                value={zoom}
                onChange={zoom => setAttributes({ zoom: Number(zoom) })}
                min={1}
                max={17} />

        </PanelBody>
        <PanelBody title={__('Options', 'nachhaltigkeitskarte-leipzig')} initialOpen={false}>

            <label class="blocks-base-control__label" for="nachhaltigkeitskarte-leipzig-text-control-lon">{__('Map height', 'nachhaltigkeitskarte-leipzig')}</label>
            <TextControl 
                onChange={ height => setAttributes({height: Number(height)})}
                id="nachhaltigkeitskarte-leipzig-text-control-lon"
                type="number"
                step="10"
                value={height}
            />
        
            <ToggleControl
                label={ __( 'Disable scroll zoom', 'nachhaltigkeitskarte-leipzig' ) }
                checked={ disableScrollZoom }
                onChange={ value =>  setAttributes( { disableScrollZoom: value } ) }
            />
        </PanelBody>
    </InspectorControls>
    )
}

export default Inspector