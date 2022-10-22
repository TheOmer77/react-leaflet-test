import { useEffect, useMemo } from 'react';
import {
  FreeHandShapes,
  FreeHandShapesOptions,
  LeafletEventHandlerFn,
} from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet-freehandshapes';

interface FreeDrawProps {
  drawing?: boolean;
  onCreate?: LeafletEventHandlerFn;
  onEscape?: (event: KeyboardEvent) => void;
}

const FREEHANDSHAPES_OPTIONS: FreeHandShapesOptions = {
  polygon: { smoothFactor: 0.3 },
  polyline: { smoothFactor: 0 },
  simplify_tolerance: 0,
};

const FreeDraw = ({ drawing = false, onCreate, onEscape }: FreeDrawProps) => {
  const map = useMap();

  const freeHandShapes = useMemo(
    () => new FreeHandShapes(FREEHANDSHAPES_OPTIONS),
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

    const escEventListener = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        freeHandShapes.stopDraw();
        return onEscape?.(event);
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

    const handleLayerAdd: LeafletEventHandlerFn = (event) => onCreate?.(event);
    freeHandShapes.on('layeradd', handleLayerAdd);
    return () => {
      freeHandShapes.off('layeradd', handleLayerAdd);
    };
  }, [freeHandShapes, onCreate]);

  return null;
};

export default FreeDraw;
