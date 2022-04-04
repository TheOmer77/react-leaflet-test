import { useRef, useCallback, useMemo, useEffect } from 'react';
import { Polygon } from 'leaflet';
import FreeDrawComponent, { CREATE, NONE } from 'react-leaflet-freedraw';

/**
 * @param {{
 *  drawing?: boolean;
 *  deleting?: boolean;
 *  onModeChange?: (mode?: import('.').Mode) => void;
 *  onDraw?: (polygon: Polygon, id?: number) => void;
 * }}
 */
const FreeDraw = ({ drawing, onModeChange = () => {}, onDraw = () => {} }) => {
  /** @type {React.MutableRefObject<import("leaflet-freedraw").default>} */
  const freedrawRef = useRef(null);

  const handleMarkersDraw = useCallback(
    (event) => {
      if (event.eventType === 'create') {
        // Instantly clear the drawn polygon, which is passed to onDraw
        event.target.clear();

        const drawnPolygon = new Polygon(event.latLngs),
          id = event.target._leaflet_id;

        if (onDraw) onDraw(drawnPolygon, id);
        onModeChange(NONE);
      }
    },
    [onDraw, onModeChange]
  );

  const handlers = useMemo(
    () => ({ markers: handleMarkersDraw }),
    [handleMarkersDraw]
  );

  const handleEscapeKey = useCallback((event) => {
    // Cancel the current FreeDraw action when the escape key is pressed.
    if (event.key === 'Escape') {
      freedrawRef.current.cancel();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  return (
    <FreeDrawComponent
      mode={drawing ? CREATE : NONE}
      eventHandlers={handlers}
      ref={freedrawRef}
    />
  );
};

export default FreeDraw;
