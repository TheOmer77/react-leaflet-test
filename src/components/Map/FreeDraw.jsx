import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Polygon } from 'leaflet';
import FreeDrawComponent, {
  CREATE,
  DELETE,
  NONE,
} from 'react-leaflet-freedraw';
import POSITION_CLASSES from '../../consts/positionClasses';

const FreeDraw = ({ position }) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  const [mode, setMode] = useState(NONE);
  const isDrawing = mode === CREATE,
    isDeleting = mode === DELETE;

  const freedrawRef = useRef(null);

  const handleMarkersDraw = useCallback((event) => {
    switch (event.eventType) {
      case 'create':
        const drawnPolygon = new Polygon(event.latLngs);
        console.log('New polygon drawn:', drawnPolygon.toGeoJSON());
        // TODO: Call createMapDrawing action with newPolygon
        break;
      case 'remove':
      // TODO: Find polygon & remove it?
      default:
        console.log(
          `A ${event.eventType} event just happened, but I have no idea what to do with it 🤷🏻‍♂️\nBut just in case...`,
          event
        );
    }
    setMode(NONE);
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
        <div
          className='leaflet-control leaflet-bar'
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 120,
            backgroundColor: 'white',
          }}
        >
          <button disabled={isDrawing} onClick={() => setMode(CREATE)}>
            {isDrawing ? 'drawing now lol' : 'start draw'}
          </button>
          <button disabled={isDeleting} onClick={() => setMode(DELETE)}>
            {isDeleting ? 'deleting now lol' : 'delete stuff'}
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
