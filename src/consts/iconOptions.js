import markerImage from '../assets/images/marker_image.svg';
import markerShadow from '../assets/images/marker_shadow.svg';

/** @type {import('leaflet').Icon.DefaultIconOptions} */
const ICON_OPTIONS = {
  iconUrl: markerImage,
  iconRetinaUrl: markerImage,
  iconSize: [48, 48],
  iconAnchor: [24, 44],
  shadowUrl: markerShadow,
  shadowSize: [48, 52],
};

export default ICON_OPTIONS;

export { markerImage, markerShadow };
