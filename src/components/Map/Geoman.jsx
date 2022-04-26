import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';

import markerIcon from '../../consts/markerIcon';

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const MODES = {
  Marker: 'Marker',
  CircleMarker: 'CircleMarker',
  Circle: 'Circle',
  Line: 'Line',
  Rectangle: 'Rectangle',
  Polygon: 'Polygon',
};

const DRAW_OPTIONS = { markerStyle: { icon: markerIcon() } };

/**
 * @param {{
 *  controls?: import('leaflet').PM.ToolbarOptions | false;
 *  mode?: keyof MODES;
 *  onCreate?: import('leaflet').PM.CreateEventHandler;
 *  onEscape?: import('leaflet').LeafletKeyboardEventHandlerFn
 * }} props
 */
const Geoman = ({ controls = false, mode, onCreate, onEscape }) => {
  const map = useMap();

  useEffect(() => {
    if (controls) map.pm.addControls(controls);

    const createEventListener = (event) => onCreate && onCreate(event);
    map.on('pm:create', createEventListener);

    return () => {
      if (controls) map.pm.removeControls();
      map.off('pm:create', createEventListener);
    };
  }, [controls, map, onCreate]);

  useEffect(() => {
    /** @type {import('leaflet').LeafletKeyboardEventHandlerFn} */
    const escEventListener = (event) => {
      if (event.originalEvent.code === 'Escape') {
        map.pm.disableDraw();
        if (onEscape) return onEscape(event);
        map.pm.enableDraw(mode, DRAW_OPTIONS);
      }
    };

    if (Object.keys(MODES).includes(mode)) {
      map.pm.enableDraw(mode, DRAW_OPTIONS);
      map.on('keydown', escEventListener);
    }
    return () => {
      map.off('keydown', escEventListener);
      map.pm.disableDraw();
    };
  }, [map, mode, onEscape]);

  return null;
};

export default Geoman;
