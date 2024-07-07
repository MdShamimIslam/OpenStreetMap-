import React, { useEffect, useRef, useState } from "react";
import Style from "../Style/Style";
import { produce } from "immer";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// set location direction
function ResetCenterView(props) {
  const { selectPosition, isViewLatLon} = props;
  const map = useMap();
  // **Update routeDirection=fromAndDestination**
  // const { myLocation } = routeDirection;
  // const routeControlRef = useRef(null);
  // from and to location set
  // const waypoints = [
  //   {
  //     latLng: L.latLng(myLocation.lat, myLocation.lon),
  //     name: myLocation.locationName,
  //   },
  //   {
  //     latLng: L.latLng(selectPosition.lat, selectPosition.lon),
  //     name: selectPosition.display_name,
  //   },
  // ];
  // show map
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
    // show lat and lon when click in the map start
    if(isViewLatLon){
      map.on("click", (e) => {
        L.popup()
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
      });
    }
   
    // show lat and lon when click in the map start

    // Set Routing Control start
    // if (routeControlRef.current) {
    //   map.removeControl(routeControlRef.current);
    //   routeControlRef.current = null;
    // }

    // routeControlRef.current = L.Routing.control({
    //   waypoints,
    //   createMarker: (i, waypoint, n) => {
    //     let markerOptions = {};
    //     if (i === 0) {
    //       // Custom icon for the start point
    //       markerOptions.icon = L.icon({
    //         iconUrl: marker.url,
    //         iconSize: [
    //           selfMarkerColumns.width[device],
    //           selfMarkerColumns.height[device],
    //         ],
    //         iconAnchor: [12, 41],
    //         popupAnchor: [1, -34],
    //         shadowSize: [41, 41],
    //       });
    //     } else if (i === n - 1) {
    //       // Custom icon for the end point
    //       markerOptions.icon = L.icon({
    //         iconUrl: marker.toUrl,
    //         iconSize: [
    //           othersMarkerColumns.width[device],
    //           othersMarkerColumns.height[device],
    //         ],
    //         iconAnchor: [12, 41],
    //         popupAnchor: [1, -34],
    //         shadowSize: [41, 41],
    //       });
    //     } else {
    //       // Custom icon for the intermediate points
    //       markerOptions.icon = L.icon({
    //         iconUrl: marker.pathUrl,
    //         iconSize: [
    //           pathMarkerColumns.width[device],
    //           pathMarkerColumns.height[device],
    //         ],
    //         iconAnchor: [12, 41],
    //         popupAnchor: [1, -34],
    //         shadowSize: [41, 41],
    //       });
    //     }
    //     return L.marker(waypoint.latLng, markerOptions);
    //   },
    // }).addTo(map);

    // return () => {
    //   if (routeControlRef.current) {
    //     map.removeControl(routeControlRef.current);
    //     routeControlRef.current = null;
    //   }
    // };
    // Set Routing Control end
  }, [
    selectPosition,
    isViewLatLon,
    map,
  ]);

  return null;
}

// map layer type view
const MapViewSwitch = ({ mapLayerType, setAttributes, options }) => {
  const map = useMap();

  useEffect(() => {
    const mapViewSwitchDiv = L.control({ position: "topleft" });
    mapViewSwitchDiv.onAdd = () => {
      const div = L.DomUtil.create("div", "leaflet-bar mapViewSwitch");
      div.innerHTML = `
        <button title="Default Layer" class="mapViewBtn ${
          mapLayerType === "default" ? "active" : ""
        }" id="defaultView">
        <img src="https://shorturl.at/oUNQQ" alt="default" />
        </button>
        <div class="vertical-divider"></div>
        <button title="Satellite Layer" class="mapViewBtn ${
          mapLayerType === "satellite" ? "active" : ""
        }" id="satelliteView">
        <img src="https://shorturl.at/8r4L1" alt="satellite" />
        </button>
      `;
      L.DomEvent.on(div, "click", (e) => {
        if (e.target.closest("#defaultView")) {
          setAttributes({
            options: produce(options, (draft) => {
              draft.mapLayerType = "default";
            }),
          });
        } else if (e.target.closest("#satelliteView")) {
          setAttributes({
            options: produce(options, (draft) => {
              draft.mapLayerType = "satellite";
            }),
          });
        }
      });
      return div;
    };
    mapViewSwitchDiv.addTo(map);

    return () => mapViewSwitchDiv.remove();
  }, [map, setAttributes, mapLayerType, options]);

  return null;
};

const OsmBack = ({ attributes, setAttributes, device, searchText}) => {
  const { cId, map, options, layout, style } = attributes;
  const { selectPosition, marker, routeDirection } = map;
  console.log(map.searchQuery);
  const { fromLocation, toLocation } = routeDirection;
  const routingControlRef = useRef(null);
  const {
    isViewLatLon,
    isMapLayer,
    scrollZoom,
    mapLayerType,
    isFullScreen,
    isViewMyLocation,
    isRoutingControl
  } = options;
  const { markerColumns,selfMarkerColumns, othersMarkerColumns, pathMarkerColumns } = layout;
  const [mapKey, setMapKey] = useState(0);
  const mapInstance = useRef(null);
  const locationSelection = [  selectPosition?.lat || 25.7494, selectPosition?.lon || 89.2611 ];

  // position and icon info
  const position = [
    parseFloat(selectPosition.lat) || 25.7494,
    parseFloat(selectPosition.lon) || 89.2611,
  ];
  const icon = L.icon({
    iconUrl: marker.currentUrl,
    iconSize: [ markerColumns.width[device], markerColumns.height[device] ],
  });

  // for scrollWheelZoom etc...
  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1);
  }, [
    scrollZoom,
    marker,
    isViewMyLocation,
    isMapLayer,
    style,
    isViewLatLon
  ]);

  // get self location
  useEffect(() => {
    if (!fromLocation.lat || !fromLocation.lon) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data && data.display_name) {
                setAttributes({
                  map: produce(map, (draft) => {
                    draft.routeDirection.fromLocation.lat =
                      position.coords.latitude;
                    draft.routeDirection.fromLocation.lon =
                      position.coords.longitude;
                    draft.routeDirection.fromLocation.locationName =
                      data.display_name;
                  }),
                });
              }
            });
        },
        (error) => {
          console.error("Error fetching current location:", error);
        }
      );
    }
  }, [
    fromLocation.lat,
    fromLocation.lon,
    fromLocation.locationName,
    setAttributes,
  ]);

  // from and destination distance
  const RoutingControl = () => {
    const map = useMap();

    useEffect(() => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      if (fromLocation && toLocation) {
        const fromLatLng = L.latLng(fromLocation.lat, fromLocation.lon);
        const toLatLng = L.latLng(toLocation.lat, toLocation.lon);

        routingControlRef.current = L.Routing.control({
          waypoints: [fromLatLng, toLatLng],
          position: 'topleft',
          // routeWhileDragging: true,
          geocoder: L.Control.Geocoder.nominatim(),
          createMarker: (i, waypoint, n) => {
            let markerOptions = {};
            if (i === 0) {
              // Custom icon for the start point
              markerOptions.icon = L.icon({
                iconUrl: marker.fromUrl,
                iconSize: [ selfMarkerColumns.width[device], selfMarkerColumns.height[device] ],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              });
            } else if (i === n - 1) {
              // Custom icon for the end point
              markerOptions.icon = L.icon({
                iconUrl: marker.toUrl,
                iconSize: [ othersMarkerColumns.width[device], othersMarkerColumns.height[device] ],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              });
            } else {
              // Custom icon for the intermediate points
              markerOptions.icon = L.icon({
                iconUrl: marker.pathUrl,
                iconSize: [ pathMarkerColumns.width[device], pathMarkerColumns.height[device] ],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              });
            }
            return L.marker(waypoint.latLng, markerOptions);
          },
        }).addTo(map);
      }

      return () => {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
      };
    }, [map, fromLocation, toLocation,marker, device]);

    return null;
  };

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
      const fullscreenControl = L.control
        .fullscreen({
          position: "topleft",
          titleCancel: "Exit Fullscreen",
        })
        .addTo(map);

      // Change the icon using CSS
      const fullscreenButton = document.querySelector(
        ".leaflet-control-fullscreen-button"
      );
      if (fullscreenButton) {
        fullscreenButton.style.backgroundImage = 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp9Uvyf1t_DCNvQ_-qklxJ5QYnk_G2W843sQ&s")';
        fullscreenButton.style.backgroundPosition = "center center";
        fullscreenButton.style.backgroundSize = "cover";
        fullscreenButton.title = 'Full Screen';
      }
      map.on("fullscreenchange", () => {
        if (map.isFullscreen()) {
          fullscreenButton.style.backgroundImage =
            'url("https://png.pngtree.com/element_our/png/20181205/fullscreen-vector-icon-png_256716.jpg")';
        } else {
          fullscreenButton.style.backgroundImage =
            'url("https://png.pngtree.com/element_our/png/20181205/fullscreen-vector-icon-png_256716.jpg")';
        }
      });

      return () => map.removeControl(fullscreenControl);
    }, [map]);

    return null;
  };

 

  return (
    <>
       {/* style */} 
      <Style attributes={attributes}></Style>

           {/* Backend Map */}
      <div id={`osmHelloBlock-${cId}`}>
        <div className="maps">
          <MapContainer
            key={mapKey}
            center={position}
            zoom={style.zoom}
            scrollWheelZoom={scrollZoom}
            className="mapContainer"
          >
            {mapLayerType === "default" ? (
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
            <Marker position={locationSelection} icon={icon}>
              <Popup>
                {searchText ? searchText : 'Rangpur'}
              </Popup>
            </Marker>

            {/* Destination */}
            {isRoutingControl && <RoutingControl/>}

            {/* resetCenterView */}
            <ResetCenterView
              selectPosition={selectPosition}
              isViewLatLon={isViewLatLon}
            />
            {/* self location by map button */}
            {isViewMyLocation && <GeolocationControl />}

            {/* full screen button in map */}
            {isFullScreen && <FullscreenControl />}

            {/* map layer */}
            <div>
              {isMapLayer && (
                <MapViewSwitch
                  mapLayerType={mapLayerType}
                  setAttributes={setAttributes}
                  options={options}
                />
              )}
            </div>
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default OsmBack;
