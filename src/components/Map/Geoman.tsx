import { useEffect } from 'react';
import { PM } from 'leaflet';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';

import markerIcon from '../../constants/markerIcon';

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
    Edit: 'Edit',
    Drag: 'Drag',
  };

const DRAW_OPTIONS = { markerStyle: { icon: markerIcon() } };

interface GeomanProps {
  controls?: PM.ToolbarOptions | false;
  mode?: keyof typeof DRAW_MODES | keyof typeof EDIT_MODES;
  onCreate?: PM.CreateEventHandler;
  onEscape?: (event: KeyboardEvent) => void;
}

const Geoman = ({
  controls = false,
  mode,
  onCreate,
  onEscape,
}: GeomanProps) => {
  const map = useMap();

  // On mount
  useEffect(() => {
    if (controls) map.pm.addControls(controls);

    const createEventListener: PM.CreateEventHandler = (event) =>
      onCreate && onCreate(event);
    map.on('pm:create', createEventListener);

    return () => {
      if (controls) map.pm.removeControls();
      map.off('pm:create', createEventListener);
    };
  }, [controls, map, onCreate]);

  // On mode change
  useEffect(() => {
    if (!mode) return;

    const escEventListener = (event: KeyboardEvent) => {
      if (event.code !== 'Escape') return;

      map.pm.disableDraw();
      if (onEscape) return onEscape(event);
      map.pm.enableDraw(mode, DRAW_OPTIONS);
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalDragMode();
    };

    if ([...Object.keys(DRAW_MODES), ...Object.keys(EDIT_MODES)].includes(mode))
      document.addEventListener('keydown', escEventListener);
    if (Object.keys(DRAW_MODES).includes(mode))
      map.pm.enableDraw(mode, DRAW_OPTIONS);
    if (Object.keys(EDIT_MODES).includes(mode))
      switch (mode) {
        case 'Edit':
          map.pm.enableGlobalEditMode();
          break;

        case 'Drag':
          map.pm.enableGlobalDragMode();
          break;

        default:
          break;
      }

    return () => {
      document.removeEventListener('keydown', escEventListener);
      map.pm.disableDraw();
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalDragMode();
    };
  }, [map, mode, onEscape]);

  return null;
};

export default Geoman;
