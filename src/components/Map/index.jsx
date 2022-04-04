import { useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MinimapControl from './MinimapControl';
import FreeDraw from './FreeDraw';
import GeoJSONControl from './GeoJSONControl';
import UpdatingGeoJSON from './UpdatingGeoJSON';

import { testGeoJsonOne } from '../../consts/testGeoJson';

import 'leaflet/dist/leaflet.css';

/**
 * @typedef { null | 'freedraw' | 'delete' } Mode
 */

const Map = () => {
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
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <MinimapControl position='topright' />
      <FreeDraw drawing={mode === 'freedraw'} onDraw={handleDraw} />
      <GeoJSONControl
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
