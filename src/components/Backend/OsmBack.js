import React, { useState, useEffect } from 'react';
import Style from '../Style/Style';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

const NOM_URL = "https://nominatim.openstreetmap.org/search?";
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

const OsmBack = ({ attributes, mapView, setMapView }) => {
  const [selectPosition, setSelectPosition] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [listPlace, setListPlace] = useState([]);
  const locationSelection = [selectPosition?.lat, selectPosition?.lon];
  const { cId, osmInfo } = attributes;
  const { scrollZoom,marker } = osmInfo;
  const { markUrl } = marker;
  const { text } = attributes.osmInfo.mapSearch.srcBtn.srcText;
 
  // marker info
  const icon = L.icon({
    iconUrl: markUrl,
    iconSize: [38, 38]
  });

  // Handle Search
  const handleSearch = (query) => {
    const params = {
      q: query,
      format: 'json',
      addressDetails: 1,
      polygon_geojson: 0
    }
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`${NOM_URL}${queryString}`, requestOptions)
      .then(res => res.text())
      .then(result => {
        setListPlace(JSON.parse(result));
      })
      .catch(error => console.log("Error is :", error));
  }

  // Update handleSearch call on input change
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
    handleSearch(event.target.value);
  }

  return (
    <>
      <Style attributes={attributes}></Style>
      <div  id={`osmHelloBlock-${cId}`}>
        {/* map */}
        <div className='maps'>
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
                <Marker position={locationSelection} icon={icon}>
                  <Popup>
                   {searchText}
                  </Popup>
                </Marker>
              )
            }
            <ResetCenterView selectPosition={selectPosition} />
            <MapViewSwitch defaultView="default" setMapView={setMapView} />

          </MapContainer>
        </div>
        {/* Search */}
        <div className='search'>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              {/* input field */}
              <div className='searchTxt'>
                <input
                  value={searchText}
                  onChange={handleInputChange}
                  type="text" placeholder='Search Your Location...'
                />
              </div>
              {/* button */}
              <div className='searchBtn'>
                <button onClick={() => handleSearch(searchText)}>{text}</button>
              </div>
            </div>
            {/* show location */}
            <div className='location'>
              {
                listPlace.map(item => (
                  <div
                    onClick={() => setSelectPosition(item)}
                    key={item.place_id}
                    style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}
                  >
                    <img style={{ width: "25px" }} src="https://toppng.com//public/uploads/preview/location-vector-symbol-google-maps-marker-blue-115632628665jan8tcjlz.png" alt="placeholder" />
                    <p className='placeDisName'>{item.display_name}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OsmBack;
