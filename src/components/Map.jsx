import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import { FaSync } from 'react-icons/fa';

const clientData = [
  {
    id: 1,
    name: 'Metalware',
    position: [77.2090, 28.6139],
    meters: [
      { id: 'M1', label: 'Main Panel', position: [77.2095, 28.6145], status: 'Active' },
      { id: 'M2', label: 'DG Set', position: [77.2085, 28.6135], status: 'Inactive' },
    ],
  },
  {
    id: 2,
    name: 'RMZ',
    position: [77.5946, 12.9716],
    meters: [
      { id: 'M3', label: 'Solar', position: [77.5940, 12.9720], status: 'Active' },
      { id: 'M4', label: 'Lighting', position: [77.5950, 12.9710], status: 'Inactive' },
    ],
  },
];

const indiaExtent = [68.1114, 6.5546, 97.3954, 35.6745]; // [minX, minY, maxX, maxY]

const OpenLayersMap = () => {
  const mapRef = useRef();
  const popupRef = useRef();
  const overlayRef = useRef();
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientLayer, setClientLayer] = useState(null);
  const [meterLayer, setMeterLayer] = useState(null);

  useEffect(() => {
    const overlay = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10],
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([78.6569, 22.9734]),
        zoom: 5,
      }),
      overlays: [overlay],
    });

    overlayRef.current = overlay;
    setMapInstance(map);
    addClientMarkers(map);

    return () => map.setTarget(null);
  }, []);

  const addClientMarkers = (map) => {
    const source = new VectorSource();

    clientData.forEach((client) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(client.position)),
        name: client.name,
      });
      feature.setStyle(new Style({
        image: new Icon({ src: 'https://cdn-icons-png.flaticon.com/512/252/252025.png', scale: 0.05 }),
      }));
      feature.set('client', client);
      source.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({ source });
    setClientLayer(vectorLayer);
    map.addLayer(vectorLayer);

    map.on('click', (e) => {
      map.forEachFeatureAtPixel(e.pixel, (feature) => {
        const client = feature.get('client');
        if (client) {
          setSelectedClient(client);
          zoomToMeters(map, client);
        }
      });
    });

    map.on('pointermove', (e) => {
      const feature = map.forEachFeatureAtPixel(e.pixel, (f) => f);
      if (feature && feature.get('client')) {
        const coordinate = e.coordinate;
        popupRef.current.innerHTML = feature.get('client').name;
        overlayRef.current.setPosition(coordinate);
      } else {
        overlayRef.current.setPosition(undefined);
      }
    });
  };

  const zoomToMeters = (map, client) => {
    if (clientLayer) {
      clientLayer.setVisible(false); // Hide client markers
    }

    if (meterLayer) {
      map.removeLayer(meterLayer); // Remove any existing meter layers to avoid duplication
    }

    const source = new VectorSource();

    client.meters.forEach((meter) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(meter.position)),
        label: meter.label,
        id: meter.id,
        status: meter.status,
      });
      feature.setStyle(new Style({
        image: new Icon({ src: 'https://cdn-icons-png.flaticon.com/512/149/149059.png', scale: 0.04 }),
      }));
      source.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({ source });
    setMeterLayer(vectorLayer);
    map.addLayer(vectorLayer);

    map.getView().setCenter(fromLonLat(client.position));
    map.getView().setZoom(15);

    map.on('pointermove', (e) => {
      const feature = map.forEachFeatureAtPixel(e.pixel, (f) => f);
      if (feature && feature.get('id')) {
        popupRef.current.innerHTML = `<b>${feature.get('label')}</b><br />ID: ${feature.get('id')}<br />Status: ${feature.get('status')}`;
        overlayRef.current.setPosition(e.coordinate);
      } else {
        overlayRef.current.setPosition(undefined);
      }
    });
  };

  const resetView = () => {
    if (clientLayer) {
      clientLayer.setVisible(true); // Show client markers
    }

    if (meterLayer) {
      mapInstance.removeLayer(meterLayer); // Remove meter markers
      setMeterLayer(null);
    }

    if (mapInstance) {
      mapInstance.getView().setCenter(fromLonLat([78.6569, 22.9734]));
      mapInstance.getView().setZoom(5);
      setSelectedClient(null);
    }
  };

  return (
    <div className="relative flex-1 bg-white shadow-md rounded-lg p-2 overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <div ref={popupRef} className="absolute z-10 bg-white text-xs px-2 py-1 rounded shadow-md" style={{ pointerEvents: 'none' }}></div>
      <div
        className="absolute bottom-16 right-4 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded cursor-pointer shadow-md"
        onClick={resetView}
      >
        <FaSync size={18} />
      </div>
    </div>
  );
};

export default OpenLayersMap;