import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Polygon } from 'leaflet';
import FreeDrawComponent, {
  CREATE,
  DELETE,
  NONE,
} from 'react-leaflet-freedraw';
import POSITION_CLASSES from '../../consts/positionClasses';

/**
 * @param {{
 *  position?: keyof POSITION_CLASSES;
 *  onDraw?: (polygon: Polygon) => void;
 * }}
 */
const FreeDraw = ({ position, onDraw }) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  const [mode, setMode] = useState(NONE);
  const isDrawing = mode === CREATE,
    isDeleting = mode === DELETE;

  /** @type {React.MutableRefObject<import("leaflet-freedraw").default>} */
  const freedrawRef = useRef(null);

  const handleMarkersDraw = useCallback((event) => {
    setMode(NONE);
    if (event.eventType === 'create') {
      // Instantly clear the drawn polygon, which is passed to onDraw
      event.target.clear();
      const drawnPolygon = new Polygon(event.latLngs);
      if (onDraw) return onDraw(drawnPolygon);
    }
  }, []);

  const handleModeChange = useCallback((event) => {
    console.log('mode changed to', event.mode);
  }, []);

  const handlers = useMemo(
    () => ({
      markers: handleMarkersDraw,
      mode: handleModeChange,
    }),
    [handleMarkersDraw, handleModeChange]
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
    <>
      <div className={positionClass}>
        <div className='leaflet-control list'>
          <button
            className='list-item'
            disabled={isDrawing}
            onClick={() => setMode(CREATE)}
          >
            {isDrawing ? 'Drawing now lol' : 'Start drawing'}
          </button>
          <button
            className='list-item'
            disabled={isDeleting}
            onClick={() => setMode(DELETE)}
          >
            {isDeleting ? 'Deleting now lol' : 'Delete stuff'}
          </button>
        </div>
      </div>
      <FreeDrawComponent
        mode={mode}
        eventHandlers={handlers}
        ref={freedrawRef}
      />
    </>
  );
};

export default FreeDraw;
