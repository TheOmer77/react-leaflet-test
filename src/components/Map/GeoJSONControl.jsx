import POSITION_CLASSES from '../../consts/positionClasses';

const GeoJSONControl = ({
  position,
  isShown,
  useGeoJsonTwo,
  onVisibilityChange = () => {},
  onGeoJsonChange = () => {},
}) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  return (
    <div className={positionClass} style={{ marginBlockEnd: '3rem' }}>
      <div
        className='leaflet-control leaflet-bar'
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 120,
          backgroundColor: 'white',
        }}
      >
        <button
          onClick={(event) => {
            event.stopPropagation();
            onVisibilityChange(!isShown);
          }}
        >{`${isShown ? 'hide' : 'show'} geojson`}</button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onGeoJsonChange(!useGeoJsonTwo);
          }}
        >{`use geojson ${useGeoJsonTwo ? 'one' : 'two'}`}</button>
      </div>
    </div>
  );
};

export default GeoJSONControl;
