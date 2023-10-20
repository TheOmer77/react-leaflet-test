import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

/* eslint-disable import/no-duplicates */
import markerImage from '../assets/images/marker_image.svg';
import MarkerImage from '../assets/images/marker_image.svg?react';

export const ICON_OPTIONS = {
  iconUrl: markerImage,
  iconRetinaUrl: markerImage,
  iconSize: [48, 52] as [number, number],
  iconAnchor: [24, 44] as [number, number],
};

const markerIcon = (color?: string) =>
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
  });

export default markerIcon;

export { markerImage };
