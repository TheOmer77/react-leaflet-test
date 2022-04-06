import { useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import FreeDraw from './FreeDraw';
import Geoman from './Geoman';
import Controls from './Controls';
import UpdatingGeoJSON from './UpdatingGeoJSON';

import { testGeoJsonOne } from '../../consts/testGeoJson';

import 'leaflet/dist/leaflet.css';

/**
 * Possible draw modes.
 * Circle is not included because it's not supported in GeoJSON.
 * @typedef { null | 'freedraw' | 'rectangle' | 'polygon' | 'marker' | 'delete' } Mode
 */

const Map = () => {
  /** @type {[import('leaflet').Map, React.Dispatch<import('leaflet').Map>]} */
  const [map, setMap] = useState(null);
  /** @type {[Mode, React.Dispatch<Mode>]} */
  const [mode, setMode] = useState(null),
    [geoJsonVisible, setGeoJSONVisible] = useState(true),
    [geoJsonData, setGeoJsonData] = useState(testGeoJsonOne);

  const handleDraw = useCallback(
    /**
     * @param {import("leaflet").Polygon} polygon
     * @param {number} id
     */
    (polygon, id) =>
      setGeoJsonData((prev) => ({
        ...prev,
        features: [
          ...prev.features,
          {
            id,
            ...polygon.toGeoJSON(),
            properties: { name: `New feature ${id}` },
          },
        ],
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

  return (
    <MapContainer
      id='map'
      attributionControl={false}
      doubleClickZoom={false}
      center={[51.505456972844144, -0.1302909851074219]}
      zoom={14}
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <FreeDraw
        drawing={mode === 'freedraw'}
        onDraw={handleDraw}
        onModeChange={setMode}
      />
      <Geoman
        mode={
          mode === 'rectangle'
            ? 'Rectangle'
            : mode === 'polygon'
            ? 'Polygon'
            : mode === 'marker'
            ? 'Marker'
            : null
        }
        onCreate={(event) => {
          handleDraw(event.layer, event.layer._leaflet_id);
          map && map.removeLayer(event.layer);
          setMode(null);
        }}
      />
      <Controls
        position='bottomright'
        showGeoJson={geoJsonVisible}
        mode={mode}
        onModeChange={setMode}
        onVisibilityChange={setGeoJSONVisible}
        onDataChange={setGeoJsonData}
      />
      {geoJsonVisible && (
        <UpdatingGeoJSON
          data={geoJsonData}
          onEachFeature={(feature, layer) => {
            // Has to be a string! Otherwise it causes errors
            layer.bindTooltip(`${feature.properties.name}`);
          }}
          eventHandlers={{
            click: (event) => {
              switch (mode) {
                case 'freedraw':
                  return;
                case 'delete':
                  setMode(null);
                  return handleDelete(event?.propagatedFrom?.feature?.id);
                default:
                  return alert(JSON.stringify(event?.propagatedFrom?.feature));
              }
            },
          }}
        />
      )}
    </MapContainer>
  );
};

export default Map;
