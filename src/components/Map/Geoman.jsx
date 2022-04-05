import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

/**
 * @param {{
 *  onCreate?: import('leaflet').PM.CreateEventHandler;
 * }} props
 */
const Geoman = ({ onCreate = () => {} }) => {
  const map = useMap();

  useEffect(() => {
    // TODO: Replace Geoman toolbar with custom controls
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      drawRectangle: true,
      drawCircle: true,
      drawCircleMarker: false,
      // TODO: Enable editing functionality while updating state
      editControls: false,
    });

    const createEventListener = (event) => onCreate(event);
    map.on('pm:create', createEventListener);

    return () => {
      map.off('pm:create', createEventListener);
      map.pm.removeControls();
    };
  }, [map, onCreate]);

  return <div></div>;
};

export default Geoman;
