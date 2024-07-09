import React, { useEffect, useRef, useState } from "react";
import Style from "../Style/Style";
import L from "leaflet";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import useDeviceWidth from "../hooks/useDeviceWidth";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import 'leaflet-easyprint';




function MapPrint(props) {
  const map = useMap();
  useEffect(() => {
    const control = L.easyPrint({
      ...props
    });
    map.addControl(control)
    return () => {
      map.removeControl(control);
    }
  }, [map]);


  return null;
}

// set froma nd des location
function ResetCenterView(props) {
  const {
    selectPosition,
    selectFromPosition,
    selectDestinationPosition,
    isViewLatLon,
    selfMarkerColumns,
    othersMarkerColumns,
    pathMarkerColumns,
    device,
    marker,
    routingSystem,fromLocation
  } = props;

  const map = useMap();
  const routeControlRef = useRef(null);

  useEffect(() => {
    if (selectPosition) {
      console.log("Setting view to:", selectPosition);
      map.setView(
        L.latLng(selectPosition.lat, selectPosition.lon),
        map.getZoom(),
        { animate: true }
      );
    }

    if (isViewLatLon) {
      const handleClick = (e) => {
        L.popup()
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
      };
      map.on("click", handleClick);

      return () => {
        map.off("click", handleClick);
      };
    }
  }, [selectPosition, isViewLatLon, map]);

  useEffect(() => {
    if (
      routingSystem === "distance" &&
      selectFromPosition &&
      selectDestinationPosition
    ) {
      const waypoints = [
        {
          latLng: L.latLng(fromLocation.lat || selectFromPosition.lat, fromLocation.lon || selectFromPosition.lon),
          name: selectFromPosition.locationName,
        },
        {
          latLng: L.latLng(
            selectDestinationPosition.lat,
            selectDestinationPosition.lon
          ),
          name: selectDestinationPosition.display_name,
        },
      ];

      if (routeControlRef.current) {
        console.log("Removing existing routing control");
        map.removeControl(routeControlRef.current);
        routeControlRef.current = null;
      }

      routeControlRef.current = L.Routing.control({
        waypoints,
        position: "topright",
        createMarker: (i, waypoint, n) => {
          let markerOptions = {};

          if (i === 0) {
            if (!marker.fromUrl) {
              console.error("Start marker URL is not defined");
            } else {
              markerOptions.icon = L.icon({
                iconUrl: marker.fromUrl,
                iconSize: [
                  selfMarkerColumns.width[device],
                  selfMarkerColumns.height[device],
                ],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              });
            }
          } else if (i === n - 1) {
            if (!marker.toUrl) {
              console.error("End marker URL is not defined");
            } else {
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
            }
          } else {
            if (!marker.pathUrl) {
              console.error("Intermediate marker URL is not defined");
            } else {
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
          }

          if (markerOptions.icon) {
            return L.marker(waypoint.latLng, markerOptions);
          }
          return L.marker(waypoint.latLng);
        },
      }).addTo(map);
    }

    return () => {
      if (routeControlRef.current) {
        console.log("Cleaning up routing control");
        map.removeControl(routeControlRef.current);
        routeControlRef.current = null;
      }
    };
  }, [
    selectFromPosition,
    selectDestinationPosition,
    selfMarkerColumns,
    othersMarkerColumns,
    pathMarkerColumns,
    device,
    marker,
    map,
    routingSystem,fromLocation
  ]);

  return null;
}

// map type view
const MapViewSwitch = ({ layer, setLayer }) => {
  const map = useMap();

  useEffect(() => {
    const mapViewSwitchDiv = L.control({ position: "topleft" });
    mapViewSwitchDiv.onAdd = () => {
      const div = L.DomUtil.create("div", "leaflet-bar mapViewSwitch");
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
      L.DomEvent.on(div, "click", (e) => {
        if (e.target.closest("#defaultView")) {
          setLayer("default");
        } else if (e.target.closest("#satelliteView")) {
          setLayer("satellite");
        }
      });
      return div;
    };
    mapViewSwitchDiv.addTo(map);

    return () => mapViewSwitchDiv.remove();
  }, [map, layer, setLayer]);

  return null;
};

const OsmFront = ({ attributes }) => {
  const { cId, map, options, layout, style } = attributes;
  const {
    selectPosition,
    marker,
    selectFromPosition,
    selectDestinationPosition,
    routeDirection,
    searchQuery,
    routingSystem,
  } = map;
  const { fromLocation, toLocation } = routeDirection;
  const {
    isMapLayer,
    scrollZoom,
    mapLayerType,
    isFullScreen,
    isViewMyLocation,
    isViewLatLon,isDownloadPDF
  } = options;
  const {
    markerColumns,
    selfMarkerColumns,
    othersMarkerColumns,
    pathMarkerColumns,
  } = layout;
  const [mapKey, setMapKey] = useState(0);
  const [layer, setLayer] = useState(mapLayerType);
  const mapInstance = useRef(null);
  const { device } = useDeviceWidth();
  const locationSelection = [
    selectPosition?.lat || 25.7494,
    selectPosition?.lon || 89.2611,
  ];
  const routingControlRef = useRef(null);

  // position and icon info
  const position = [
    parseFloat(selectPosition.lat) || 25.7494,
    parseFloat(selectPosition.lon) || 89.2611,
  ];
  const icon = L.icon({
    iconUrl: marker.currentUrl,
    iconSize: [markerColumns.width[device], markerColumns.height[device]],
  });

  // for scrollWheelZoom etc...
  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1);
  }, [scrollZoom, marker, isViewMyLocation, isMapLayer, style, isViewLatLon,isDownloadPDF]);

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
          position: "topright",
          // routeWhileDragging: true,
          geocoder: L.Control.Geocoder.nominatim(),
          createMarker: (i, waypoint, n) => {
            let markerOptions = {};
            if (i === 0) {
              // Custom icon for the start point
              markerOptions.icon = L.icon({
                iconUrl: marker.fromUrl,
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
      }

      return () => {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
      };
    }, [map, fromLocation, toLocation, marker, device]);

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
        fullscreenButton.style.backgroundImage =
          'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp9Uvyf1t_DCNvQ_-qklxJ5QYnk_G2W843sQ&s")';
        fullscreenButton.style.backgroundPosition = "center center";
        fullscreenButton.style.backgroundSize = "cover";
        fullscreenButton.title = "Full Screen";
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
  // PDF
  const toggleVisibility = (selector, visible) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
        if (visible) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
};

const downloadPDF = async () => {
  toggleVisibility('.leaflet-control-container, .mapViewSwitch, .leaflet-popup-pane', false);

  const mapElement = document.querySelector('.leaflet-container');
  
  mapElement.style.width = `${mapElement.offsetWidth}px`;
  mapElement.style.height = `${mapElement.offsetHeight}px`;

  const canvas = await html2canvas(mapElement, {
      useCORS: true,
      logging: true,
      backgroundColor: null,
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save('map.pdf');

  toggleVisibility('.leaflet-control-container, .mapViewSwitch, .leaflet-popup-pane', true);
};

  return (
    <>
      {/* style */}
      <Style attributes={attributes}></Style>

      {/* Frontend Map */}
      <div id={`osmHelloBlock-${cId}`}>
      {isDownloadPDF && <button onClick={downloadPDF}>Download Location</button>}
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

            <Marker position={locationSelection} icon={icon}>
              <Popup>{searchQuery ? searchQuery : "Rangpur"}</Popup>
            </Marker>

            {/* Destination */}
            {routingSystem === "routingControl" && <RoutingControl />}

            {/* resetCenterView */}
            <ResetCenterView
              selectPosition={selectPosition}
              selectFromPosition={selectFromPosition}
              selectDestinationPosition={selectDestinationPosition}
              isViewLatLon={isViewLatLon}
              selfMarkerColumns={selfMarkerColumns}
              othersMarkerColumns={othersMarkerColumns}
              pathMarkerColumns={pathMarkerColumns}
              device={device}
              marker={marker}
              routingSystem={routingSystem}
              fromLocation={fromLocation}
            />

            {/* self location by map button */}
            {isViewMyLocation && <GeolocationControl />}

            {/* full screen button in map */}
            {isFullScreen && <FullscreenControl />}

            {/* map layer */}
            <div>
              {isMapLayer && (
                <MapViewSwitch layer={layer} setLayer={setLayer} />
              )}
            </div>
            {/* pdf */}
            {
              isDownloadPDF && (
                <div>
                    <MapPrint position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Print" />
                    <MapPrint position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />
                </div>
              )
            }
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default OsmFront;
