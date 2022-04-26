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
 *  onCreate?: import('leaflet').LeafletEventHandlerFn
 * }} props
 */
const FreeDraw = ({ drawing = false, onCreate = () => {} }) => {
  const map = useMap();

  const freeHandShapes = useMemo(
    /** @returns {[import('leaflet').FreeHandShapes, React.Dispatch<import('leaflet').FreeHandShapes>]} */
    () => new Leaflet.FreeHandShapes(FREEHANDSHAPES_OPTIONS),
    []
  );

  // On mount
  useEffect(() => {
    if (!drawing) return;

    map.addLayer(freeHandShapes);
    return () => map.removeLayer(freeHandShapes);
  }, [drawing, freeHandShapes, map]);

  // Add layerAdd event handler
  useEffect(() => {
    if (!freeHandShapes) return;

    const handleLayerAdd = (event) => onCreate(event);
    freeHandShapes.on('layeradd', handleLayerAdd);
    return () => freeHandShapes.off('layeradd', handleLayerAdd);
  }, [freeHandShapes, onCreate]);

  // On mode change
  useEffect(() => {
    if (freeHandShapes) {
      freeHandShapes.setMode(drawing ? 'add' : 'view');
      // This line fixes a touch issue on mobile Chrome
      map.hasLayer(freeHandShapes) &&
        drawing &&
        freeHandShapes.setMapPermissions('enable');
    }
  }, [freeHandShapes, drawing, map]);

  return null;
};

export default FreeDraw;
