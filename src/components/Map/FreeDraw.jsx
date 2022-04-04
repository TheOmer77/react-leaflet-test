import { useRef, useCallback, useMemo, useEffect } from 'react';
import { Polygon } from 'leaflet';
import FreeDrawComponent, { CREATE, NONE } from 'react-leaflet-freedraw';
import POSITION_CLASSES from '../../consts/positionClasses';

/**
 * @param {{
 *  position?: keyof POSITION_CLASSES;
 *  drawing?: boolean;
 *  deleting?: boolean;
 *  onModeChange?: (mode?: import('.').Mode) => void;
 *  onDraw?: (polygon: Polygon, id?: number) => void;
 * }}
 */
const FreeDraw = ({ position, drawing, deleting, onModeChange, onDraw }) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  /** @type {React.MutableRefObject<import("leaflet-freedraw").default>} */
  const freedrawRef = useRef(null);

  const handleMarkersDraw = useCallback((event) => {
    if (event.eventType === 'create') {
      // Instantly clear the drawn polygon, which is passed to onDraw
      event.target.clear();

      const drawnPolygon = new Polygon(event.latLngs),
        id = event.target._leaflet_id;

      if (onDraw) onDraw(drawnPolygon, id);
      onModeChange(NONE);
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
            disabled={drawing}
            onClick={() => onModeChange && onModeChange('freedraw')}
          >
            {drawing ? 'Drawing now lol' : 'Start drawing'}
          </button>
          <button
            className='list-item'
            disabled={deleting}
            onClick={() => onModeChange && onModeChange('delete')}
          >
            {deleting ? 'Deleting now lol' : 'Delete stuff'}
          </button>
        </div>
      </div>
      <FreeDrawComponent
        mode={drawing ? CREATE : NONE}
        eventHandlers={handlers}
        ref={freedrawRef}
      />
    </>
  );
};

export default FreeDraw;
