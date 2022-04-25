import { useCallback } from 'react';
import {
  Polyline,
  Polygon,
  Tooltip,
  FeatureGroup,
  Marker,
} from 'react-leaflet';

import markerIcon from '../../consts/markerIcon';

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
          [field]: (event) =>
            eventHandlers[field]({
              ...event,
              propagatedFrom: {
                ...event.propagatedFrom,
                feature,
                __proto__: event.propagatedFrom.__proto__,
              },
              layer: {
                ...event.layer,
                feature,
                __proto__: event.layer.__proto__,
              },
            }),
        }),
        {}
      )}
    >
      {tooltip && <Tooltip>{tooltip(feature)}</Tooltip>}
      {getFeatureComponent(feature, {
        pathOptions: typeof style === 'function' ? style(feature) : style,
      })}
    </FeatureGroup>
  ));
};

export default CustomGeoJSON;
