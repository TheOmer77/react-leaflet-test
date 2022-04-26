import { useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import Leaflet from 'leaflet';
import 'leaflet-freehandshapes';

/** @type {import('leaflet').FreeHandShapesOptions} */
const FREEHANDSHAPES_OPTIONS = {
  polygon: { smoothFactor: 0.3 },
  polyline: { smoothFactor: 0 },
  simplify_tolerance: 0,
};
/**
 * @param {{
 *  drawing?: boolean;
 *  onCreate?: import('leaflet').LeafletEventHandlerFn;
 *  onEscape?: import('leaflet').LeafletKeyboardEventHandlerFn;
 * }} props
 */
const FreeDraw = ({ drawing = false, onCreate, onEscape }) => {
  const map = useMap();

  const freeHandShapes = useMemo(
    /** @returns {import('leaflet').FreeHandShapes} */
    () => new Leaflet.FreeHandShapes(FREEHANDSHAPES_OPTIONS),
    []
  );

  // On mount, mode change
  useEffect(() => {
    if (!drawing || !freeHandShapes) return;

    map.addLayer(freeHandShapes);
    freeHandShapes.setMode(drawing ? 'add' : 'view');
    // This line fixes a touch issue on mobile Chrome
    map.hasLayer(freeHandShapes) &&
      drawing &&
      freeHandShapes.setMapPermissions('enable');

    /** @type {import('leaflet').LeafletKeyboardEventHandlerFn} */
    const escEventListener = (event) => {
      if (event.code === 'Escape') {
        freeHandShapes.stopDraw();
        if (onEscape) return onEscape(event);
      }
    };
    document.addEventListener('keydown', escEventListener);

    return () => {
      document.removeEventListener('keydown', escEventListener);
      map.removeLayer(freeHandShapes);
    };
  }, [drawing, freeHandShapes, map, onEscape]);

  // Add layerAdd event handler
  useEffect(() => {
    if (!freeHandShapes) return;

    const handleLayerAdd = (event) => onCreate && onCreate(event);
    freeHandShapes.on('layeradd', handleLayerAdd);
    return () => freeHandShapes.off('layeradd', handleLayerAdd);
  }, [freeHandShapes, onCreate]);

  return null;
};

export default FreeDraw;
