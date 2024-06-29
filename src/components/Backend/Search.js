
import React,{useState} from 'react'

const NOM_URL = "https://nominatim.openstreetmap.org/search?";

const Search = ({ setSelectPosition }) => {
  const [searchText, setSearchText] = useState('');
  const [listPlace, setListPlace] = useState([]);

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
    <div style={{display:"flex",flexDirection:"column"}}>
      <div style={{ display: "flex" }}>
        {/* input field */}
        <div className='searchTxt'>
          <input value={searchText} onChange={(event)=>setSearchText(event.target.value)} type="text" placeholder='Search Your Location...'
          />
        </div>
        {/* button */}
        <div className='searchBtn'>
          <button onClick={handleSearch}>Search Here</button>
        </div>
      </div>
      {/* show location */}
      <div>
        {
          listPlace.map(item => (
            <div
              onClick={()=>setSelectPosition(item)}
              key={item.place_id}
              style={{ display: "flex", alignItems: "center", gap: "5px",cursor:"pointer" }}
            >
              <img style={{ width: "30px" }} src="https://image.similarpng.com/very-thumbnail/2021/09/Gps-icon-on-center-of-the-city-map-with-pin-location-on-transparent-background-PNG.png" alt="placeholder" />
              <p className='placeDisName'>{item.display_name}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Search