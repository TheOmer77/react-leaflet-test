import POSITION_CLASSES from '../../consts/positionClasses';
import { testGeoJsonOne, testGeoJsonTwo } from '../../consts/testGeoJson';

const GeoJSONControl = ({
  position,
  isShown,
  onVisibilityChange = () => {},
  onDataChange = () => {},
}) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  return (
    <div className={positionClass} style={{ marginBlockEnd: '5rem' }}>
      <div className='leaflet-control list'>
        <button
          className='list-item'
          onClick={(event) => {
            event.stopPropagation();
            onVisibilityChange(!isShown);
          }}
        >{`${isShown ? 'Hide' : 'Show'} GeoJSON`}</button>
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
    </div>
  );
};

export default GeoJSONControl;
