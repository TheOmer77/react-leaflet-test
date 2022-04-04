import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MinimapControl from './MinimapControl';
import FreeDraw from './FreeDraw';
import GeoJSONControl from './GeoJSONControl';
import UpdatingGeoJSON from './UpdatingGeoJSON';

import { testGeoJsonOne, testGeoJsonTwo } from '../../consts/testGeoJson';

import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [geoJSONshown, setGeoJSONshown] = useState(true),
    [useGeoJsonTwo, setUseGeoJsonTwo] = useState(false);

  return (
    <MapContainer
      id='map'
      attributionControl={false}
      center={[51.505456972844144, -0.1302909851074219]}
      zoom={14}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <MinimapControl position='topright' />
      <FreeDraw position='bottomright' />
      <GeoJSONControl
        position='bottomright'
        isShown={geoJSONshown}
        useGeoJsonTwo={useGeoJsonTwo}
        onVisibilityChange={setGeoJSONshown}
        onGeoJsonChange={setUseGeoJsonTwo}
      />
      {geoJSONshown && (
        <UpdatingGeoJSON
          data={useGeoJsonTwo ? testGeoJsonTwo : testGeoJsonOne}
        />
      )}
    </MapContainer>
  );
};

export default Map;
