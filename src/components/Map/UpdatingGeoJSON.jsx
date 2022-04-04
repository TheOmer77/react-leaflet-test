import { useRef, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';

/** @param {import('react-leaflet').GeoJSONProps} */
const UpdatingGeoJSON = ({ data, ...props }) => {
  const geoJsonRef = useRef();

  useEffect(() => {
    geoJsonRef.current.addData(data);

    return () => geoJsonRef.current && geoJsonRef.current.clearLayers();
  }, [data]);

  return <GeoJSON ref={geoJsonRef} {...props} />;
};

export default UpdatingGeoJSON;
