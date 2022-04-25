import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

import markerImage, {
  ReactComponent as MarkerImage,
} from '../assets/images/marker_image.svg';

/** @type {import('leaflet').Icon.DefaultIconOptions} */
export const ICON_OPTIONS = {
  iconUrl: markerImage,
  iconRetinaUrl: markerImage,
  iconSize: [48, 52],
  iconAnchor: [24, 44],
};

/** @param {string} [color] */
const markerIcon = (color) =>
  divIcon({
    html: renderToStaticMarkup(
      <MarkerImage
        width={ICON_OPTIONS.iconSize[0]}
        height={ICON_OPTIONS.iconSize[1]}
        {...(color && { fill: color })}
      />
    ),
    iconSize: ICON_OPTIONS.iconSize,
    iconAnchor: ICON_OPTIONS.iconAnchor,
    shadowUrl: ICON_OPTIONS.shadowUrl,
    shadowAnchor: ICON_OPTIONS.shadowAnchor,
    shadowSize: ICON_OPTIONS.shadowSize,
  });

export default markerIcon;

export { markerImage };
