import { useState, useCallback } from 'react';
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
 * @typedef { null | 'freedraw' | 'rectangle' | 'polygon' | 'polyline' | 'marker' | 'delete' } Mode
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
            properties: {
              name: `New ${getTypeString(polygon.toGeoJSON())} ${id}`,
            },
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
        onModeChange={setMode}
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
            click: (event) => {
              switch (mode) {
                case 'freedraw':
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
          }}
        />
      )}
    </MapContainer>
  );
};

export default Map;
