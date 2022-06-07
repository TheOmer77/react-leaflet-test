import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Leaflet from 'leaflet';

import FreeDraw from './FreeDraw';
import Geoman from './Geoman';
import Controls from './Controls';
import CustomGeoJSON from './CustomGeoJSON';

import { testGeoJsonOne } from '../../consts/testGeoJson';
import { ICON_OPTIONS } from '../../consts/markerIcon';

import 'leaflet/dist/leaflet.css';

/**
 * Possible draw modes.
 * Circle is not included because it's not supported in GeoJSON.
 * @typedef { null | 'freedraw' | 'rectangle' | 'polygon' | 'polyline' | 'marker' | 'drag' | 'delete' } Mode
 */

/** @param {import('geojson').Feature} feature */
const getTypeString = (feature) =>
  feature.geometry.type === 'LineString'
    ? 'line'
    : feature.geometry.type === 'Point'
    ? 'marker'
    : feature.geometry.type.toLowerCase();

const Map = () => {
  /** @type {[import('leaflet').Map, React.Dispatch<import('leaflet').Map>]} */
  const [map, setMap] = useState(null);
  /** @type {[Mode, React.Dispatch<Mode>]} */
  const [mode, setMode] = useState(null),
    [geoJsonVisible, setGeoJSONVisible] = useState(true),
    [geoJsonData, setGeoJsonData] = useState(testGeoJsonOne);

  const handleDraw = useCallback(
    /**
     * @param {import("leaflet").Layer} layer
     * @param {number} id
     */
    (layer, id) =>
      setGeoJsonData((prev) => ({
        ...prev,
        features: [
          ...prev.features,
          {
            id,
            ...layer.toGeoJSON(),
            properties: {
              name: `New ${getTypeString(layer.toGeoJSON())} ${id}`,
            },
          },
        ],
      })),
    []
  );

  const handleDrag = useCallback(
    /** @param {import("leaflet").Polygon} layer */
    (layer) =>
      setGeoJsonData((prev) => ({
        ...prev,
        features: prev.features.map((prevFeature) =>
          prevFeature.id === layer.feature.id
            ? { ...prevFeature, ...layer.toGeoJSON() }
            : prevFeature
        ),
      })),
    []
  );

  const handleDelete = useCallback(
    (id) =>
      setGeoJsonData((prev) => ({
        ...prev,
        features: prev.features.filter((feature) => feature.id !== id),
      })),
    []
  );

  useEffect(() => {
    /**
     * Esc event handler for delete mode only
     * @type {KeyboardEvent}
     */
    const escEventListener = (event) =>
      event.code === 'Escape' && setMode(null);

    mode === 'delete' && document.addEventListener('keydown', escEventListener);
    return () => document.removeEventListener('keydown', escEventListener);
  }, [mode]);

  return (
    <MapContainer
      id='map'
      attributionControl={false}
      doubleClickZoom={false}
      center={[51.505456972844144, -0.1302909851074219]}
      zoom={14}
      whenCreated={setMap}
      whenReady={() => {
        delete Leaflet.Icon.Default.prototype._getIconUrl;
        Leaflet.Icon.Default.mergeOptions(ICON_OPTIONS);
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <FreeDraw
        drawing={mode === 'freedraw'}
        onCreate={(event) => {
          event.target.clearLayers();
          handleDraw(event.layer, event.layer._leaflet_id);
          setMode(null);
        }}
        onEscape={() => setMode(null)}
      />
      <Geoman
        mode={
          mode === 'rectangle'
            ? 'Rectangle'
            : mode === 'polygon'
            ? 'Polygon'
            : mode === 'polyline'
            ? 'Line'
            : mode === 'marker'
            ? 'Marker'
            : mode === 'drag'
            ? 'Drag'
            : null
        }
        onCreate={(event) => {
          handleDraw(event.layer, event.layer._leaflet_id);
          map && map.removeLayer(event.layer);
          setMode(null);
        }}
        onEscape={() => setMode(null)}
      />
      <Controls
        position='bottomright'
        showGeoJson={geoJsonVisible}
        mode={mode}
        onModeChange={(mode) =>
          setMode((prev) => (prev === mode ? null : mode))
        }
        onVisibilityChange={setGeoJSONVisible}
        onDataChange={setGeoJsonData}
      />
      {geoJsonVisible && (
        <CustomGeoJSON
          data={geoJsonData}
          style={(feature) => ({
            color: feature.properties.color || '#3388ff',
          })}
          tooltip={(feature) => feature.properties.name}
          eventHandlers={{
            /** @type {import('leaflet').PM.DragEndEventHandler} */
            click: (event) => {
              switch (mode) {
                case 'freedraw':
                case 'drag':
                  return;
                case 'delete':
                  setMode(null);
                  return handleDelete(event?.propagatedFrom?.feature?.id);
                default:
                  return alert(
                    JSON.stringify(event?.propagatedFrom?.feature, null, 2)
                  );
              }
            },
            /** @type {import('leaflet').PM.DragEndEventHandler} */
            'pm:dragend': (event) => handleDrag(event?.propagatedFrom),
          }}
        />
      )}
    </MapContainer>
  );
};

export default Map;
