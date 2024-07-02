import React, { useState, useEffect, useRef } from 'react';
import Style from '../Style/Style';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

const position = [51.505, -0.09];

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
const MapViewSwitch = ({ defaultView, setMapView }) => {
  const map = useMap();
  const [activeView, setActiveView] = useState(defaultView); 

  useEffect(() => {
    setActiveView(defaultView); 
  }, [defaultView]);

  useEffect(() => {
    const mapViewSwitchDiv = L.control({ position: 'topright' });
    mapViewSwitchDiv.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar mapViewSwitch');
      div.innerHTML = `
        <button class="mapViewBtn ${activeView === 'default' ? 'active' : ''}" id="defaultView">
          Default
        </button>
        <div class="vertical-divider"></div>
        <button class="mapViewBtn ${activeView === 'satellite' ? 'active' : ''}" id="satelliteView">
          Satellite
        </button>
      `;
      L.DomEvent.on(div, 'click', (e) => {
        if (e.target.closest('#defaultView')) {
          setMapView('default');
          setActiveView('default');
        } else if (e.target.closest('#satelliteView')) {
          setMapView('satellite');
          setActiveView('satellite');
        }
      });
      return div;
    };
    mapViewSwitchDiv.addTo(map);

    return () => mapViewSwitchDiv.remove();
  }, [map, setMapView, activeView]);

  return null;
};



const OsmBack = ({ attributes, mapView, setMapView, searchText,selectPosition, }) => {
  const locationSelection = [selectPosition?.lat, selectPosition?.lon];
  const { cId, map,options} = attributes;
  const { scrollZoom } = options;
  const mapInstance = useRef(null)
  // marker info
  const icon = L.icon({
    iconUrl: map.marker.url,
    iconSize: [38, 38]
  });

  useEffect(() => {
    if (mapInstance.current) {
      if (scrollZoom) {
        mapInstance.current.scrollWheelZoom.enable();
      } else {
        mapInstance.current.scrollWheelZoom.disable();
      }
    }
  }, [scrollZoom]);
 
 

  return (
    <>
      <Style attributes={attributes}></Style>
      <div  id={`osmHelloBlock-${cId}`}>
        <div className='maps' >
          <MapContainer
            center={position}
            zoom={8}
            scrollWheelZoom={scrollZoom}
            className='mapContainer'
          >
            
            {mapView === 'default' ? (
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
            <MapViewSwitch defaultView="default" setMapView={setMapView} />
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default OsmBack;
