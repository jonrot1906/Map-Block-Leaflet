import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import "./editor.scss";

import attributes from './attributes';
import icon from './icon';

import Inspector from "./components/Inspector";
import Resizable from "../../components/Resizable";
import { Map, Cluster } from "../../components/Map";

export default registerBlockType('nachhaltigkeitskarte-leipzig/nachhaltigkeitskarte-leipzig-map', {
    title: __('Nachhaltigkeits-Karte', 'nachhaltigkeitskarte-leipzig'),
    description: __('Hier werden je nach Einstellung (Region/Kategorie) alle Projekte, Initiativen, Angebote und Veranstaltungen aus der Datenbank Nachhaltiges Sachsen auf einer Karte angezeigt.', 'nachhaltigkeitskarte-leipzig'),
    category: 'embed',
    keywords: [
        __('map', 'nachhaltigkeitskarte-leipzig'),
        __('leaflet', 'nachhaltigkeitskarte-leipzig'),
    ],
    attributes,
    icon,
    supports: {
        html: false,
        align: true
    },
    edit: props => {
        const { attributes, setAttributes, toggleSelection } = props;
        const { markers } = attributes;

        const defaultPosition = [51.340199, 12.360103]
        const handleZoom = () => { }
        const handleHeight = (height) => setAttributes({ height })

        return (
            <>
                <Inspector {...props} />
                <Resizable
                    height={attributes.height}
                    setHeight={handleHeight}
                    toggleSelection={toggleSelection}
                >
                    <Map
                        disableScrollZoom={attributes.disableScrollZoom}
                        position={defaultPosition}
                        zoom={10}
                        themeUrl={attributes.themeUrl}
                        height={attributes.height}
                        setZoom={handleZoom}
                    >
                        <Cluster markers={markers} />
                    </Map>
                </Resizable>
            </>
        )
    },
    save: () => null
});
