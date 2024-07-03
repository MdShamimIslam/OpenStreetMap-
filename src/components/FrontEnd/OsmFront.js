import React,{useState,useEffect} from "react";
import Style from "../Style/Style";
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// resetCenterView
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
const MapViewSwitch = ({options,layer,setLayer }) => {
    const map = useMap();
  
    useEffect(() => {
      const mapViewSwitchDiv = L.control({ position: 'topright' });
      mapViewSwitchDiv.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar mapViewSwitch');
        div.innerHTML = `
          <button class="mapViewBtn ${layer === 'default' ? 'active' : ''}" id="defaultView">
          <img src="https://shorturl.at/oUNQQ" alt="default" />
           <span> Default</span>
          </button>
          <div class="vertical-divider"></div>
          <button class="mapViewBtn ${layer === 'satellite' ? 'active' : ''}" id="satelliteView">
          <img src="https://shorturl.at/8r4L1" alt="satellite" />
           <span> Satellite</span>
          </button>
        `;
        L.DomEvent.on(div, 'click', (e) => {
          if (e.target.closest('#defaultView')) {
           setLayer('default');
          } else if (e.target.closest('#satelliteView')) {
            setLayer('satellite');
          }
        });
        return div;
      };
      mapViewSwitchDiv.addTo(map);
  
      return () => mapViewSwitchDiv.remove();
    }, [map, layer, options]);
  
    return null;
  };

const OsmFront = ({attributes}) => {
    const { cId, map, options, layout } = attributes;
    const { marker,selectPosition } = map;
    const { scrollZoom,mapLayerType} = options;
    const { width, height } = layout.markerColumns;
    const locationSelection = [selectPosition?.lat, selectPosition?.lon];
    const [mapKey, setMapKey] = useState(0);
    const [layer,setLayer] = useState(mapLayerType);

    // marker and position inf
    const position = [parseFloat(selectPosition.lat) || 23.8693275, parseFloat(selectPosition.lon) || 90.3926893];
    const icon = L.icon({
        iconUrl: marker.url,
        // iconSize: [width[device], height[device]]
        iconSize: [width.desktop, height.desktop]
    });

    useEffect(() => {
        setMapKey(prevKey => prevKey + 1);
      }, [scrollZoom]);

  return (
    <>
      <Style attributes={attributes}></Style>
      <div id={`osmHelloBlock-${cId}`}>
        <div className="maps">
          <MapContainer
            key={mapKey}
            center={position}
            zoom={8}
            scrollWheelZoom={scrollZoom}
            className="mapContainer"
          >
            {layer === "default" ? (
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
            {selectPosition && (
              <div>
                <Marker position={locationSelection} icon={icon}>
                  <Popup>{'Loc'}</Popup>
                </Marker>
              </div>
            )}
            <ResetCenterView selectPosition={selectPosition} />
            <MapViewSwitch
              options={options}
              layer={layer}
              setLayer={setLayer}
            />
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default OsmFront;
