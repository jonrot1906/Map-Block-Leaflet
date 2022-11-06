import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import "./editor.scss";

import attributes from './attributes';
import icon from './icon';

import Inspector from "./components/Inspector";
import Resizable from "../../components/Resizable";
import Calendar from "color-calendar";
import "color-calendar/dist/css/theme-basic.css";
import moment from 'moment';

class CalendarComponent extends React.Component {
    componentDidMount() {
      new Calendar({
        id: "#color-calendar",
        weekdayType: "long-upper",
        monthDisplayType: "long",
        calendarSize: "small",
        layoutModifiers: ["month-left-align"],
      });
    }
  
    render() {
      return ([<div class="row gx-5">
      <div class="col-xs-6 col-md-4 mt-2" id="color-calendar">
      </div>
      <div class="col-xs-6 col-md-8 bg-light mt-2" id="list_wrapper_cal">
      <div class="events-display">
      <h5>Veranstaltungen für <b>{moment().format("dddd, DD.MM.YYYY")}</b></h5>    
        <div class="event card">
              <div class="event-left card-body">
                <div class="row">
                    <span class="card_title text-dark">Leider gibt es an diesem Tag keine Veranstaltungen. Viel Spaß beim Ausruhen!</span>
                </div>
              </div>
            </div>
      </div>
      </div>
      </div>]);
    }
  }

export default registerBlockType('nachhaltigkeitskarte-leipzig/nachhaltigkeitskarte-leipzig-calendar', {
    title: __('Nachhaltigkeits-Kalender', 'nachhaltigkeitskarte-leipzig'),
    description: __('Hier werden je nach Einstellung (Region/Kategorie) die entsprechenden zukünftigen Veranstaltungen aus der Datenbank Nachhaltiges Sachsen in Kalenderform angezeigt.', 'nachhaltigkeitskarte-leipzig'),
    category: 'embed',
    keywords: [
        __('kalendar', 'nachhaltigkeitskarte-leipzig'),
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

        const handleHeight = (height) => setAttributes({ height })

        return (
            <>
                <Inspector {...props} />
                <Resizable
                    height={attributes.height}
                    setHeight={handleHeight}
                    toggleSelection={toggleSelection}
                >
                    <CalendarComponent/>
                </Resizable>
            </>
        )
    },
    save: () => null
});
