import { produce } from "immer";
import L from "leaflet";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import Style from "../Style/Style";

// set location direction
function ResetCenterView(props) {
  const {
    selectPosition,
    routeDirection,
    selfMarkerColumns,
    othersMarkerColumns,
    pathMarkerColumns,
    marker,
    device,
  } = props;
  const { myLocation } = routeDirection;
  const routeControlRef = useRef(null);
  const map = useMap();
  // from and to location set
  const waypoints = [
    {
      latLng: L.latLng(myLocation.lat, myLocation.lon),
      name: myLocation.locationName,
    },
    {
      latLng: L.latLng(selectPosition.lat, selectPosition.lon),
      name: selectPosition.display_name,
    },
  ];
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
    // show lat and lon when click in the map
    map.on("click", (e) => {
      L.popup()
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    });
    // Set Routing Control start
    if (routeControlRef.current) {
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
            iconSize: [
              selfMarkerColumns.width[device],
              selfMarkerColumns.height[device],
            ],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
        } else if (i === n - 1) {
          // Custom icon for the end point
          markerOptions.icon = L.icon({
            iconUrl: marker.toUrl,
            iconSize: [
              othersMarkerColumns.width[device],
              othersMarkerColumns.height[device],
            ],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
        } else {
          // Custom icon for the intermediate points
          markerOptions.icon = L.icon({
            iconUrl: marker.pathUrl,
            iconSize: [
              pathMarkerColumns.width[device],
              pathMarkerColumns.height[device],
            ],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
        }
        return L.marker(waypoint.latLng, markerOptions);
      },
    }).addTo(map);

    return () => {
      if (routeControlRef.current) {
        map.removeControl(routeControlRef.current);
        routeControlRef.current = null;
      }
    };
    // Set Routing Control end
  }, [
    selectPosition,
    routeDirection,
    marker,
    selfMarkerColumns,
    othersMarkerColumns,
    pathMarkerColumns,
    device,
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

const OsmBack = ({ attributes, setAttributes, device }) => {
  const { cId, map, options, layout, style } = attributes;
  const { selectPosition, marker, latitude, longitude,routeDirection } = map;
  const {
    isMapLayer,
    scrollZoom,
    mapLayerType,
    isFullScreen,
    isViewMyLocation,
    isViewOtherAddress,
  } = options;
  const { selfMarkerColumns, othersMarkerColumns, pathMarkerColumns } = layout;
  const [mapKey, setMapKey] = useState(0);
  const mapInstance = useRef(null);

  // position info
  const position = [
    parseFloat(selectPosition.lat) || latitude || 23.8693275,
    parseFloat(selectPosition.lon) || longitude || 90.3926893,
  ];

  // for scrollWheelZoom etc...
  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1);
  }, [
    scrollZoom,
    marker,
    isViewMyLocation,
    isViewOtherAddress,
    isMapLayer,
    style,
  ]);

  // self location by search
  useEffect(() => {
    if (!routeDirection.myLocation.lat || !routeDirection.myLocation.lon) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetch(
          `https://nominatim.openStreetMap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            setAttributes({
              map: produce(map, (draft) => {
                draft.routeDirection.myLocation.lat = data.lat;
                draft.routeDirection.myLocation.lon = data.lon;
                draft.routeDirection.myLocation.locationName = data.display_name;
              }),
            });
          })
          .catch((error) =>
            console.log("Error to fetching current Location: ", error)
          );
      });
    }
  }, [routeDirection]);

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
          title: "View Fullscreen",
          titleCancel: "Exit Fullscreen",
        })
        .addTo(map);

      // Change the icon using CSS
      const fullscreenButton = document.querySelector(
        ".leaflet-control-fullscreen-button"
      );
      if (fullscreenButton) {
        fullscreenButton.style.backgroundImage =
          'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp9Uvyf1t_DCNvQ_-qklxJ5QYnk_G2W843sQ&s")';
        fullscreenButton.style.backgroundSize = "cover";
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

            {/* resetCenterView */}
            <ResetCenterView
              selfMarkerColumns={selfMarkerColumns}
              othersMarkerColumns={othersMarkerColumns}
              pathMarkerColumns={pathMarkerColumns}
              marker={marker}
              device={device}
              selectPosition={selectPosition}
              routeDirection={routeDirection}
              isViewOtherAddress={isViewOtherAddress}
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
