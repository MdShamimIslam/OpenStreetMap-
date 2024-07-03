import React, { useEffect, useState } from 'react';
import Style from '../Style/Style';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { produce } from 'immer';

function ResetCenterView(props) {
  const { selectPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (selectPosition) {
      map.setView(
        L.latLng(selectPosition?.lat, selectPosition?.lon),
        map.getZoom(),
        {
          animate: true
        }
      )
    }
  }, [selectPosition]);

  return null;
}
// map type view
const MapViewSwitch = ({ mapLayerType, setAttributes, options }) => {

  const map = useMap();

  useEffect(() => {
    const mapViewSwitchDiv = L.control({ position: 'topright' });
    mapViewSwitchDiv.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar mapViewSwitch');
      div.innerHTML = `
        <button class="mapViewBtn ${mapLayerType === 'default' ? 'active' : ''}" id="defaultView">
        <img src="https://shorturl.at/oUNQQ" alt="default" />
         <span> Default</span>
        </button>
        <div class="vertical-divider"></div>
        <button class="mapViewBtn ${mapLayerType === 'satellite' ? 'active' : ''}" id="satelliteView">
        <img src="https://shorturl.at/8r4L1" alt="satellite" />
         <span> Satellite</span>
        </button>
      `;
      L.DomEvent.on(div, 'click', (e) => {
        if (e.target.closest('#defaultView')) {
          setAttributes({
            options: produce(options, draft => {
              draft.mapLayerType = "default";
          })})
        } else if (e.target.closest('#satelliteView')) {
          setAttributes({
            options: produce(options, draft => {
              draft.mapLayerType = "satellite";
            })
          })
        }
      });
      return div;
    };
    mapViewSwitchDiv.addTo(map);

    return () => mapViewSwitchDiv.remove();
  }, [map, setAttributes, mapLayerType, options]);

  return null;
};

const OsmBack = ({ attributes, setAttributes, device, searchText }) => {
  const { cId, map, options, layout } = attributes;
  const { marker,selectPosition } = map;
  const { scrollZoom, mapLayerType} = options;
  const { width, height } = layout.markerColumns;
  const locationSelection = [selectPosition?.lat, selectPosition?.lon];
  const [mapKey, setMapKey] = useState(0);
  // const [position, setPosition] = useState([]);
 
  // marker and position info
  // const position = [51.505, -0.09];
  const position = [23.8693275, 90.3926893];
  const icon = L.icon({
    iconUrl: marker.url,
    iconSize: [width[device], height[device]]
  });

  useEffect(() => {
    setMapKey(prevKey => prevKey + 1);
  }, [scrollZoom]);

  return (
    <>
      <Style attributes={attributes}></Style>
      <div  id={`osmHelloBlock-${cId}`}>
        <div className='maps' >
          <MapContainer
            key={mapKey}
            center={position}
            zoom={8}
            scrollWheelZoom={scrollZoom}
            className='mapContainer'
          >
            {mapLayerType === 'default' ? (
              <TileLayer
                attribution='&copy; <a href="https://www.bplugins.com/">bPlugins</a> contributors'
                url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=YEI95Jvk57zAEnNOTx8u"
              />
            ) : (
              <TileLayer
                attribution='&copy; <a href="https://www.bplugins.com/">bPlugins</a> contributors'
                url="https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=YEI95Jvk57zAEnNOTx8u"
              />
            )}
            {
              selectPosition && (
                <div>
                  <Marker position={locationSelection} icon={icon}>
                    <Popup>
                      {searchText}
                    </Popup>
                  </Marker>
                </div>
              )
            }
            <ResetCenterView selectPosition={selectPosition} />
            <MapViewSwitch mapLayerType={mapLayerType} setAttributes={setAttributes} options={options} />
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default OsmBack;
