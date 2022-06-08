import { useMemo, useCallback } from 'react';
import classNames from 'classnames';

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
const Controls = ({
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
            className={classNames('list-item', mode === id && 'selected')}
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
    [mode]
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
    ),
    drawItems = useMemo(
      /** @type {() => ListItem[]} */
      () => [
        {
          id: 'freedraw',
          label: 'Freedraw',
          onClick: () => onModeChange?.('freedraw'),
        },
        {
          id: 'rectangle',
          label: 'Rectangle',
          onClick: () => onModeChange?.('rectangle'),
        },
        {
          id: 'polygon',
          label: 'Polygon',
          onClick: () => onModeChange?.('polygon'),
        },
        {
          id: 'polyline',
          label: 'Line',
          onClick: () => onModeChange?.('polyline'),
        },
        {
          id: 'marker',
          label: 'Marker',
          onClick: () => onModeChange?.('marker'),
        },
      ],
      [onModeChange]
    ),
    editItems = useMemo(
      /** @type {() => ListItem[]} */
      () => [
        {
          id: 'edit',
          label: 'Edit layers',
          onClick: () => onModeChange?.('edit'),
        },
        {
          id: 'drag',
          label: 'Drag layers',
          onClick: () => onModeChange?.('drag'),
        },
        {
          id: 'delete',
          label: 'Delete layer',
          onClick: () => onModeChange?.('delete'),
        },
      ],
      [onModeChange]
    );

  return (
    <div className={positionClass}>
      <div className='leaflet-control list-group'>
        {list(geoJsonItems)}
        {list(drawItems)}
        {list(editItems)}
      </div>
    </div>
  );
};

export default Controls;
