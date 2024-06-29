import React, { useState, useEffect } from 'react';
import Style from '../Style/Style';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

const NOM_URL = "https://nominatim.openstreetmap.org/search?";
const url = "https://png.pngtree.com/png-clipart/20230123/original/pngtree-flat-red-location-sign-png-image_8927579.png";

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

const OsmBack = ({ attributes}) => {
  const [selectPosition, setSelectPosition] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [listPlace, setListPlace] = useState([]);
  const locationSelection = [selectPosition?.lat, selectPosition?.lon];
  const { cId } = attributes;
  const { scrollZoom } = attributes.osmInfo;
  const { text } = attributes.osmInfo.mapSearch.srcBtn.srcText;
  // marker info
  const icon = L.icon({
    // iconUrl: `"${markUrl}"`,
    iconUrl: url,
    iconSize: [38, 38]
  });

  // Handle Search
  const handleSearch = () => {
    const params = {
      q: searchText,
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

  return (
    <>
      <Style attributes={attributes}></Style>
      <div id={`osmHelloBlock-${cId}`} className='mainOsm'>
        {/* map */}
        <div className='maps'>
          <MapContainer
            center={position}
            zoom={8}
            scrollWheelZoom={scrollZoom}
            className='mapContainer'
          >
            <TileLayer
              attribution='&copy; <a href="https://www.bplugins.com/">bPlugins</a> contributors'
              url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=YEI95Jvk57zAEnNOTx8u"
            />
            {
              selectPosition && (
                <Marker position={locationSelection} icon={icon}>
                  <Popup>
                    Your Perfect location here
                  </Popup>
                </Marker>
              )
            }
            <ResetCenterView selectPosition={selectPosition} />
          </MapContainer>

        </div>
        {/* Search */}
        <div className='search'>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              {/* input field */}
              <div className='searchTxt'>
                <input value={searchText} onChange={(event) => setSearchText(event.target.value)} type="text" placeholder='Search Your Location...'
                />
              </div>
              {/* button */}
              <div className='searchBtn'>
                <button onClick={handleSearch}>{text}</button>
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
