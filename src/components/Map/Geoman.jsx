import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';

import markerIcon from '../../consts/markerIcon';

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const DRAW_MODES = {
    Marker: 'Marker',
    CircleMarker: 'CircleMarker',
    Circle: 'Circle',
    Line: 'Line',
    Rectangle: 'Rectangle',
    Polygon: 'Polygon',
  },
  EDIT_MODES = {
    Drag: 'Drag',
  };

const DRAW_OPTIONS = { markerStyle: { icon: markerIcon() } };

/**
 * @param {{
 *  controls?: import('leaflet').PM.ToolbarOptions | false;
 *  mode?: keyof DRAW_MODES | keyof EDIT_MODES;
 *  onCreate?: import('leaflet').PM.CreateEventHandler;
 *  onEscape?: import('leaflet').LeafletKeyboardEventHandlerFn;
 * }} props
 */
const Geoman = ({ controls = false, mode, onCreate, onEscape }) => {
  const map = useMap();

  // On mount
  useEffect(() => {
    if (controls) map.pm.addControls(controls);

    const createEventListener = (event) => onCreate && onCreate(event);
    map.on('pm:create', createEventListener);

    return () => {
      if (controls) map.pm.removeControls();
      map.off('pm:create', createEventListener);
    };
  }, [controls, map, onCreate]);

  // On mode change
  useEffect(() => {
    /** @type {import('leaflet').LeafletKeyboardEventHandlerFn} */
    const escEventListener = (event) => {
      if (event.code === 'Escape') {
        map.pm.disableDraw();
        if (onEscape) return onEscape(event);
        map.pm.enableDraw(mode, DRAW_OPTIONS);
        map.pm.disableGlobalDragMode();
      }
    };

    if ([...Object.keys(DRAW_MODES), ...Object.keys(EDIT_MODES)].includes(mode))
      document.addEventListener('keydown', escEventListener);
    if (Object.keys(DRAW_MODES).includes(mode))
      map.pm.enableDraw(mode, DRAW_OPTIONS);
    if (Object.keys(EDIT_MODES).includes(mode))
      switch (mode) {
        case 'Drag':
          map.pm.enableGlobalDragMode();
          break;

        default:
          break;
      }

    return () => {
      document.removeEventListener('keydown', escEventListener);
      map.pm.disableDraw();
      map.pm.disableGlobalDragMode();
    };
  }, [map, mode, onEscape]);

  return null;
};

export default Geoman;
