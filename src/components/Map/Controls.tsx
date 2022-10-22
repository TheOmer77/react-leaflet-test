import { MouseEventHandler, useCallback, useMemo } from 'react';
import classNames from 'classnames';

import POSITION_CLASSES from '../../constants/positionClasses';
import { testGeoJsonOne, testGeoJsonTwo } from '../../constants/testGeoJson';

import type { Mode } from '.';
import type { FeatureCollection } from 'geojson';

type ListItem = {
  id: string;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

interface ControlsProps {
  position?: keyof typeof POSITION_CLASSES;
  showGeoJson?: boolean;
  mode?: Mode;
  onModeChange?: (mode: Mode) => void;
  onVisibilityChange?: (show: boolean) => void;
  onDataChange?: (data: FeatureCollection) => void;
}

const Controls = ({
  position,
  showGeoJson,
  mode,
  onModeChange,
  onVisibilityChange,
  onDataChange,
}: ControlsProps) => {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  const list = useCallback(
    (listItems: ListItem[]) => (
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

  const geoJsonItems = useMemo<ListItem[]>(
      () => [
        {
          id: 'toggleGeoJson',
          label: `${showGeoJson ? 'Hide' : 'Show'} GeoJSON`,
          onClick: () => onVisibilityChange?.(!showGeoJson),
        },
        {
          id: 'useGeoJsonOne',
          label: 'Use GeoJSON one',
          onClick: () => onDataChange?.(testGeoJsonOne),
        },
        {
          id: 'useGeoJsonTwo',
          label: 'Use GeoJSON two',
          onClick: () => onDataChange?.(testGeoJsonTwo),
        },
      ],
      [onDataChange, onVisibilityChange, showGeoJson]
    ),
    drawItems = useMemo<ListItem[]>(
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
    editItems = useMemo<ListItem[]>(
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
