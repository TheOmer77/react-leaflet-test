import POSITION_CLASSES from '../../consts/positionClasses';
import { testGeoJsonOne, testGeoJsonTwo } from '../../consts/testGeoJson';

/**
 * @param {{
 *  position?: keyof POSITION_CLASSES;
 *  showGeoJson?: boolean;
 *  mode?: import('.').Mode;
 *  onModeChange?: (mode: import('.').Mode) => void;
 *  onVisibilityChange?: (show: boolean) => void;
 *  onDataChange?: (data: object) => void;
 * }} props
 */
const GeoJSONControl = ({
  position,
  showGeoJson,
  mode,
  onModeChange = () => {},
  onVisibilityChange = () => {},
  onDataChange = () => {},
}) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  return (
    <div className={positionClass}>
      <div className='leaflet-control'>
        <div className='list mb-1'>
          <button
            className='list-item'
            onClick={(event) => {
              event.stopPropagation();
              onVisibilityChange(!showGeoJson);
            }}
          >{`${showGeoJson ? 'Hide' : 'Show'} GeoJSON`}</button>
          <button
            className='list-item'
            onClick={(event) => {
              event.stopPropagation();
              onDataChange(testGeoJsonOne);
            }}
          >
            Use GeoJSON one
          </button>
          <button
            className='list-item'
            onClick={(event) => {
              event.stopPropagation();
              onDataChange(testGeoJsonTwo);
            }}
          >
            Use GeoJSON two
          </button>
        </div>
        <div className='list'>
          <button
            className='list-item'
            disabled={mode === 'freedraw'}
            onClick={() => onModeChange && onModeChange('freedraw')}
          >
            {mode === 'freedraw' ? 'Drawing now lol' : 'Freedraw'}
          </button>
          <button
            className='list-item'
            disabled={mode === 'delete'}
            onClick={() => onModeChange && onModeChange('delete')}
          >
            {mode === 'delete' ? 'Deleting now lol' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeoJSONControl;
