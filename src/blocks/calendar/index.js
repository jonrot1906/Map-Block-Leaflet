import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import "./editor.scss";

import attributes from './attributes';
import icon from './icon';

import Inspector from "./components/Inspector";
import Resizable from "../../components/Resizable";
import RevoCalendar from "revo-calendar";

export default registerBlockType('map-block-leaflet/map-block-leaflet-calendar', {
    title: __('Map Leaflet Calendar', 'map-block-leaflet'),
    description: __('Easy way to inside maps in your contents', 'map-block-leaflet'),
    category: 'embed',
    keywords: [
        __('kalendar', 'map-block-leaflet'),
        __('leaflet', 'map-block-leaflet'),
    ],
    attributes,
    icon,
    supports: {
        html: false,
        align: true
    },
    edit: props => {
        const { attributes, setAttributes, toggleSelection } = props;

        const handleHeight = (height) => setAttributes({ height })

        return (
            <>
                <Inspector {...props} />
                <Resizable
                    height={attributes.height}
                    setHeight={handleHeight}
                    toggleSelection={toggleSelection}
                >
                    <RevoCalendar/>
                </Resizable>
            </>
        )
    },
    save: () => null
});
