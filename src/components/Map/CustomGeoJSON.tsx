import { useEffect } from 'react';
import { GeoJSON, Layer, marker } from 'leaflet';
import { GeoJSONProps, useMap } from 'react-leaflet';
import type { Feature, FeatureCollection } from 'geojson';

import markerIcon, { ICON_OPTIONS } from '../../constants/markerIcon';

interface CustomGeoJSONProps extends GeoJSONProps {
  data: FeatureCollection;
  tooltip?: (feature: Feature) => string;
}

const CustomGeoJSON = ({
  data,
  tooltip,
  onEachFeature,
  ...props
}: CustomGeoJSONProps) => {
  const map = useMap();

  /**
   * Avoiding the use of react-leaflet's GeoJSON component,
   * instead just creating a regular leaflet GeoJSON object
   */
  useEffect(() => {
    const geoJson = new GeoJSON(data, {
      onEachFeature: (feature: Feature, layer: Layer) => {
        tooltip &&
          layer.bindTooltip(
            tooltip(feature),
            feature.geometry.type === 'Point'
              ? { direction: 'top', offset: [0, ICON_OPTIONS.iconSize[1] * -1] }
              : {}
          );
        onEachFeature?.(feature, layer);
      },
      pointToLayer: (feature, latLng) =>
        marker(latLng, { icon: markerIcon(feature.properties.color) }),
      ...props,
    });
    map.addLayer(geoJson);

    return () => {
      geoJson.remove();
    };
  }, [data, map, onEachFeature, props, tooltip]);

  return null;
};

export default CustomGeoJSON;
