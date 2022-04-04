import { useRef, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';

/** @param {import('react-leaflet').GeoJSONProps} */
const UpdatingGeoJSON = ({ data, ...props }) => {
  const geoJsonRef = useRef();

  useEffect(() => {
    const geoJson = geoJsonRef.current;
    geoJson.addData(data);

    return () => geoJson && geoJson.clearLayers();
  }, [data]);

  return <GeoJSON ref={geoJsonRef} {...props} />;
};

export default UpdatingGeoJSON;
