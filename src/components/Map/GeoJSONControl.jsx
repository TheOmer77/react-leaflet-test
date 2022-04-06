import { useMemo, useCallback } from 'react';

import POSITION_CLASSES from '../../consts/positionClasses';
import { testGeoJsonOne, testGeoJsonTwo } from '../../consts/testGeoJson';

/**
 * @typedef {{
 *  id: string;
 *  label: string;
 *  onClick: import('react').MouseEventHandler<HTMLButtonElement>;
 *  disabled?: boolean;
 * }} ListItem
 */

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

  const list = useCallback(
    /** @param {ListItem[]} listItems */
    (listItems) => (
      <div className='list'>
        {listItems.map(({ id, label, onClick, disabled }) => (
          <button
            key={id}
            id={`listItem-${id}`}
            disabled={disabled}
            className='list-item'
            onClick={(event) => {
              event.stopPropagation();
              onClick(event);
            }}
          >
            {label}
          </button>
        ))}
      </div>
    ),
    []
  );

  const geoJsonItems = useMemo(
    /** @type {() => ListItem[]} */
    () => [
      {
        id: 'toggleGeoJson',
        label: `${showGeoJson ? 'Hide' : 'Show'} GeoJSON`,
        onClick: () => onVisibilityChange(!showGeoJson),
      },
      {
        id: 'useGeoJsonOne',
        label: 'Use GeoJSON one',
        onClick: () => onDataChange(testGeoJsonOne),
      },
      {
        id: 'useGeoJsonTwo',
        label: 'Use GeoJSON two',
        onClick: () => onDataChange(testGeoJsonTwo),
      },
    ],
    [onDataChange, onVisibilityChange, showGeoJson]
  );

  const drawItems = useMemo(
    /** @type {() => ListItem[]} */
    () => [
      {
        id: 'freedraw',
        label: mode === 'freedraw' ? 'Drawing now lol' : 'Freedraw',
        disabled: mode === 'freedraw',
        onClick: () => onModeChange && onModeChange('freedraw'),
      },
      {
        id: 'delete',
        label: mode === 'delete' ? 'Deleting now lol' : 'Delete',
        disabled: mode === 'delete',
        onClick: () => onModeChange && onModeChange('delete'),
      },
    ],
    [mode, onModeChange]
  );

  return (
    <div className={positionClass}>
      <div className='leaflet-control list-group'>
        {list(geoJsonItems)}
        {list(drawItems)}
      </div>
    </div>
  );
};

export default GeoJSONControl;
