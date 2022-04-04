import { useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MinimapControl from './MinimapControl';
import FreeDraw from './FreeDraw';
import GeoJSONControl from './GeoJSONControl';
import UpdatingGeoJSON from './UpdatingGeoJSON';

import { testGeoJsonOne } from '../../consts/testGeoJson';

import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [geoJsonVisible, setGeoJSONVisible] = useState(true),
    [geoJsonData, setGeoJsonData] = useState(testGeoJsonOne);

  const handleDraw = useCallback(
    /** @param {import("leaflet").Polygon} polygon */
    (polygon) =>
      setGeoJsonData((prev) => ({
        ...prev,
        features: [...prev.features, polygon.toGeoJSON()],
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
      <FreeDraw position='bottomright' onDraw={handleDraw} />
      <GeoJSONControl
        position='bottomright'
        isShown={geoJsonVisible}
        onVisibilityChange={setGeoJSONVisible}
        onDataChange={setGeoJsonData}
      />
      {geoJsonVisible && (
        <UpdatingGeoJSON
          data={geoJsonData}
          eventHandlers={{
            click: (event) =>
              alert(JSON.stringify(event?.propagatedFrom?.feature)),
          }}
        />
      )}
    </MapContainer>
  );
};

export default Map;
