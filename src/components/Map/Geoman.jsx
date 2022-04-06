import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const MODES = {
  Marker: 'Marker',
  CircleMarker: 'CircleMarker',
  Circle: 'Circle',
  Line: 'Line',
  Rectangle: 'Rectangle',
  Polygon: 'Polygon',
};

/**
 * @param {{
 *  controls?: import('leaflet').PM.ToolbarOptions | false;
 *  mode?: keyof MODES;
 *  onCreate?: import('leaflet').PM.CreateEventHandler;
 * }} props
 */
const Geoman = ({ controls = false, mode, onCreate = () => {} }) => {
  const map = useMap();

  useEffect(() => {
    const createEventListener = (event) => onCreate(event);
    map.on('pm:create', createEventListener);

    if (controls) map.pm.addControls(controls);

    return () => {
      map.off('pm:create', createEventListener);
      if (controls) map.pm.removeControls();
    };
  }, [controls, map, onCreate]);

  useEffect(() => {
    if (Object.keys(MODES).includes(mode)) map.pm.enableDraw(mode);
    return () => map.pm.disableDraw();
  }, [map.pm, mode]);

  return null;
};

export default Geoman;
