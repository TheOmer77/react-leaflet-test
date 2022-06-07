import { useCallback } from 'react';
import {
  Polyline,
  Polygon,
  Tooltip,
  FeatureGroup,
  Marker,
} from 'react-leaflet';

import markerIcon, { ICON_OPTIONS } from '../../consts/markerIcon';

/**
 * @param {{
 *  data: import('geojson').GeoJSON;
 *  style?: import('leaflet').PathOptions | import('leaflet').StyleFunction<any>
 *  eventHandlers?: import('leaflet').LeafletEventHandlerFnMap;
 *  tooltip?: (feature: import('geojson').Feature) => string;
 * }} props
 */
const CustomGeoJSON = ({ data, style = {}, eventHandlers = {}, tooltip }) => {
  const getFeatureComponent = useCallback(
    /** @param {import('geojson').Feature} feature */
    (feature, props) => {
      switch (feature.geometry.type) {
        case 'Point':
          return (
            <Marker
              {...props}
              icon={markerIcon(props?.pathOptions?.color)}
              position={[...feature.geometry.coordinates].reverse()}
            />
          );
        case 'LineString':
          return (
            <Polyline
              {...props}
              positions={feature.geometry.coordinates.map((coordinate) =>
                [...coordinate].reverse()
              )}
            />
          );
        case 'Polygon':
          return (
            <Polygon
              {...props}
              positions={feature.geometry.coordinates.map((polygon) =>
                polygon.map((coordinate) => [...coordinate].reverse())
              )}
            />
          );
        default:
          return null;
      }
    },
    []
  );

  return data.features.map((feature, index) => (
    <FeatureGroup
      key={index}
      eventHandlers={Object.keys(eventHandlers).reduce(
        (obj, field) => ({
          ...obj,
          /** @param {import('leaflet').LeafletEvent} event */
          [field]: (event) => {
            event.layer.feature = feature;
            event.propagatedFrom = event.layer; // `layer` is deprecated
            return eventHandlers[field](event);
          },
        }),
        {}
      )}
    >
      {tooltip && (
        <Tooltip
          {...(feature.geometry.type === 'Point' && {
            offset: [0, ICON_OPTIONS.iconSize[1] * -1],
            direction: 'top',
          })}
        >
          {tooltip(feature)}
        </Tooltip>
      )}
      {getFeatureComponent(feature, {
        pathOptions: typeof style === 'function' ? style(feature) : style,
      })}
    </FeatureGroup>
  ));
};

export default CustomGeoJSON;
