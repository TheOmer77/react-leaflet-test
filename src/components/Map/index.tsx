import { useCallback, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import {
  LeafletMouseEvent,
  Map as LeafletMap,
  GeoJSON as LeafletGeoJSON,
  stamp,
  Layer,
} from 'leaflet';
import type { Feature, FeatureCollection } from 'geojson';

import FreeDraw from './FreeDraw';
import Geoman from './Geoman';
import Controls from './Controls';
import CustomGeoJSON from './CustomGeoJSON';

import { testGeoJsonOne } from '../../constants/testGeoJson';
import { defaultColor } from '../../constants/colors';

import 'leaflet/dist/leaflet.css';

/**
 * Possible draw modes.
 * Circle is not included because it's not supported in GeoJSON.
 */
export type Mode =
  | null
  | 'freedraw'
  | 'rectangle'
  | 'polygon'
  | 'polyline'
  | 'marker'
  | 'edit'
  | 'drag'
  | 'delete';

const getTypeString = (feature: Feature) =>
  feature.geometry.type === 'LineString'
    ? 'line'
    : feature.geometry.type === 'Point'
    ? 'marker'
    : feature.geometry.type.toLowerCase();

const Map = () => {
  const [mode, setMode] = useState<Mode>(null),
    [geoJsonVisible, setGeoJSONVisible] = useState<boolean>(true),
    [geoJsonData, setGeoJsonData] = useState<FeatureCollection>(testGeoJsonOne);

  const mapRef = useRef<LeafletMap>(null);

  const handleDraw = useCallback((layer: LeafletGeoJSON, id: number) => {
    const feature = layer.toGeoJSON() as Feature;
    setGeoJsonData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          id,
          ...feature,
          properties: {
            name: `New ${getTypeString(feature)} ${id}`,
          },
        },
      ],
    }));
  }, []);

  const handleEdit = useCallback((layer: Layer) => {
    const feature = (layer as LeafletGeoJSON).toGeoJSON() as Feature;

    setGeoJsonData((prev) => ({
      ...prev,
      features: prev.features.map((prevFeature) =>
        prevFeature.id === feature.id
          ? { ...prevFeature, ...feature }
          : prevFeature
      ),
    }));
  }, []);

  const handlePropertiesChange = useCallback(
    (featureId: string, properties = {}) =>
      setGeoJsonData((prev) => ({
        ...prev,
        features: prev.features.map((prevFeature) =>
          prevFeature.id === featureId
            ? {
                ...prevFeature,
                properties: { ...prevFeature.properties, ...properties },
              }
            : prevFeature
        ),
      })),
    []
  );

  const handleDelete = useCallback(
    (featureId: string) =>
      setGeoJsonData((prev) => ({
        ...prev,
        features: prev.features.filter((feature) => feature.id !== featureId),
      })),
    []
  );

  const handleClick = useCallback(
    (event: LeafletMouseEvent, feature: Feature) => {
      switch (mode) {
        case 'edit':
          handlePropertiesChange(feature?.id as string, {
            color:
              prompt(
                `Enter color for ${
                  feature?.properties?.name
                    ? `'${feature?.properties?.name}'`
                    : 'this feature'
                }:`,
                feature?.properties?.color || defaultColor
              ) || feature?.properties?.color,
          });
          break;
        case 'freedraw':
        case 'drag':
          return;
        case 'delete':
          setMode(null);
          return handleDelete(feature.id as string);
        default:
          return alert(JSON.stringify(feature, null, 2));
      }
    },
    [handleDelete, handlePropertiesChange, mode]
  );

  return (
    <MapContainer
      id='map'
      center={[51.505456972844144, -0.1302909851074219]}
      zoom={14}
      doubleClickZoom={false}
      attributionControl={false}
      ref={mapRef}
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
            : mode === 'edit'
            ? 'Edit'
            : mode === 'drag'
            ? 'Drag'
            : undefined
        }
        onCreate={({ layer }) => {
          handleDraw(layer as LeafletGeoJSON, stamp(layer));
          mapRef.current?.removeLayer(layer);
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
        onVisibilityChange={(show) => {
          setGeoJSONVisible(show);
          setMode(null);
        }}
        onDataChange={(data) => {
          setGeoJsonData(data);
          setMode(null);
        }}
      />

      {geoJsonVisible && (
        <CustomGeoJSON
          data={geoJsonData}
          style={(feature) => ({
            color: feature?.properties.color || defaultColor,
          })}
          tooltip={(feature) => feature?.properties?.name}
          onEachFeature={(feature, layer) => {
            layer.on('click', (event) => handleClick(event, feature));
            layer.on('pm:edit', (event) => handleEdit(event.layer));
            layer.on('pm:dragend', (event) => handleEdit(event.layer));
          }}
        />
      )}
    </MapContainer>
  );
};

export default Map;
