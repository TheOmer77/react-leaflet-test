import { useRef, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';

/** @param {import('react-leaflet').GeoJSONProps} */
const UpdatingGeoJSON = ({ data, ...props }) => {
  const geoJsonRef = useRef();

  useEffect(() => {
    console.log(geoJsonRef.current);
    geoJsonRef.current.addData(data);

    return () => geoJsonRef.current.clearLayers();
  }, [data]);

  return <GeoJSON ref={geoJsonRef} {...props} />;
};

export default UpdatingGeoJSON;
