
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet/dist/leaflet.css";
import 'leaflet-fullscreen';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import { MapContainer,TileLayer, useMap } from "react-leaflet";
import Style from "../Style/Style";
import useDeviceWidth from "../hooks/useDeviceWidth";


// set location direction
function ResetCenterView(props) {
  const { selectPosition, routeDirection,selfMarkerColumns,othersMarkerColumns,pathMarkerColumns,marker,device } = props;
  const { fromLocation } = routeDirection;
  const routeControlRef = useRef(null);
  const map = useMap();

  const waypoints = [
        {
          latLng: L.latLng(fromLocation.lat, fromLocation.lon),
          name: fromLocation.locationName
        },
        {
          latLng: L.latLng(selectPosition.lat, selectPosition.lon),
          name: selectPosition.display_name
        }
      ];

  useEffect(() => {

    if (selectPosition) {
      map.setView(
        L.latLng(selectPosition?.lat, selectPosition?.lon),
        map.getZoom(),
        {
          animate: true,
        }
      );
    }
    // self location
    map.on("click", (e) => {
      L.popup()
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    });
    
    // Set Routing Control
  if(routeControlRef.current) {
    map.removeControl(routeControlRef.current);
    routeControlRef.current = null;
  }

   routeControlRef.current = L.Routing.control({
      waypoints,
      createMarker: (i, waypoint, n) => {
        let markerOptions = {};
        if (i === 0) {
          // Custom icon for the start point
          markerOptions.icon = L.icon({
            iconUrl: marker.url,
            iconSize: [selfMarkerColumns.width[device], selfMarkerColumns.height[device]],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
        } else if (i === n - 1) {
          // Custom icon for the end point
          markerOptions.icon = L.icon({
            iconUrl: marker.toUrl,
            iconSize: [othersMarkerColumns.width[device], othersMarkerColumns.height[device]],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
        } else {
          // Custom icon for the intermediate points
          markerOptions.icon = L.icon({
            iconUrl: marker.pathUrl,
            iconSize: [pathMarkerColumns.width[device], pathMarkerColumns.height[device]],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
        }
        return L.marker(waypoint.latLng, markerOptions);
      }
    }).addTo(map);

    return () => {
      if(routeControlRef.current) {
        map.removeControl(routeControlRef.current);
        routeControlRef.current = null;
      }
   };

  }, [selectPosition, routeDirection,marker,selfMarkerColumns,othersMarkerColumns,pathMarkerColumns,device]);

  return null;
}

  // map type view
const MapViewSwitch = ({layer,setLayer }) => {
    const map = useMap();
    console.log(layer);
  
    useEffect(() => {
      const mapViewSwitchDiv = L.control({ position: 'topleft' });
      mapViewSwitchDiv.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar mapViewSwitch');
        div.innerHTML = `
          <button title="Default Layer" class="mapViewBtn ${
            layer === "default" ? "active" : ""
        }" id="defaultView">
        <img src="https://shorturl.at/oUNQQ" alt="default" />
        </button>
        <div class="vertical-divider"></div>
        <button title="Satellite Layer" class="mapViewBtn ${
          layer === "satellite" ? "active" : ""
        }" id="satelliteView">
        <img src="https://shorturl.at/8r4L1" alt="satellite" />
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
    }, [map, layer,setLayer]);
  
    return null;
  };

const OsmFront = ({attributes}) => {
  const { cId, map, options,routeDirection,layout,style } = attributes;
  const { selectPosition,marker} = map;
  const { isMapLayer,scrollZoom, mapLayerType, isFullScreen,isViewMyLocation,isViewOtherAddress } = options;
  const { selfMarkerColumns,othersMarkerColumns,pathMarkerColumns} = layout;
  const [mapKey, setMapKey] = useState(0);
  const [layer,setLayer] = useState(mapLayerType);
  const mapInstance = useRef(null);
  const {device} = useDeviceWidth();
    // position info
    const position = [parseFloat(selectPosition.lat) || 23.8693275, parseFloat(selectPosition.lon) || 90.3926893];
  
 // for scrollWheelZoom etc...
 useEffect(() => {
  setMapKey((prevKey) => prevKey + 1);
}, [scrollZoom,marker,isViewMyLocation,isViewOtherAddress,isMapLayer,style]);

 // self location by map button
 const GeolocationControl = () => {
  const map = useMap();
  mapInstance.current = map;

  useEffect(() => {
    if (!map) return;
    const lc = L.control.locate({
      position: "topleft",
      drawCircle: true,
      keepCurrentZoomLevel: true,
      strings: {
        title: "Start Point Location",
        metersUnit: "meters",
      },
      locateOptions: {
        maxZoom: 16,
        enableHighAccuracy: true,
      },
    });
    lc.addTo(map);

    return () => map.removeControl(lc);
  }, [map]);
  return null;
};

// Full SCreen Function
const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const fullscreenControl = L.control.fullscreen({
      position: 'topleft',
      title: 'View Fullscreen',
      titleCancel: 'Exit Fullscreen',
    }).addTo(map);

    // Change the icon using CSS
    const fullscreenButton = document.querySelector('.leaflet-control-fullscreen-button');
    if (fullscreenButton) {
      fullscreenButton.style.backgroundImage = 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp9Uvyf1t_DCNvQ_-qklxJ5QYnk_G2W843sQ&s")';
      fullscreenButton.style.backgroundSize = 'cover';
    }
    map.on('fullscreenchange', () => {
      if (map.isFullscreen()) {
        fullscreenButton.style.backgroundImage = 'url("https://png.pngtree.com/element_our/png/20181205/fullscreen-vector-icon-png_256716.jpg")';
      } else {
        fullscreenButton.style.backgroundImage = 'url("https://png.pngtree.com/element_our/png/20181205/fullscreen-vector-icon-png_256716.jpg")';
      }
    });

    return () => map.removeControl(fullscreenControl);
  }, [map]);

  return null;
};

  return (
    <>
      <Style attributes={attributes}></Style>
      <div id={`osmHelloBlock-${cId}`}>
      <div className="maps">
          <MapContainer
            key={mapKey}
            center={position}
            zoom={style.zoom}
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

            {/* self location by map button */}
            {isViewMyLocation && <GeolocationControl />}

            {/* resetCenterView */}
            <ResetCenterView
              selfMarkerColumns={selfMarkerColumns}
              othersMarkerColumns={othersMarkerColumns}
              pathMarkerColumns={pathMarkerColumns}
              marker={marker}
              device={device}
              selectPosition={selectPosition}
              routeDirection={routeDirection}
            />
            {/* map layer */}
            <div>
            {
              isMapLayer &&  <MapViewSwitch
              layer={layer}
              setLayer={setLayer}
            />
            }
            </div>

            {/* full screen button in map */}
            {isFullScreen && <FullscreenControl/>}

          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default OsmFront;
