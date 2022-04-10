import { useState, useEffect } from 'react';
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
  /** @type {[import('leaflet').FreeHandShapes, React.Dispatch<import('leaflet').FreeHandShapes>]} */
  const [freeHandShapes, setFreeHandShapes] = useState(null);

  // On mount
  useEffect(() => {
    const freeHandShapes = new Leaflet.FreeHandShapes(FREEHANDSHAPES_OPTIONS);
    setFreeHandShapes(freeHandShapes);
    map.addLayer(freeHandShapes);
    return () => map.removeLayer(freeHandShapes);
  }, [map]);

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
      drawing && freeHandShapes.setMapPermissions('enable');
    }
  }, [freeHandShapes, drawing]);

  return null;
};

export default FreeDraw;
