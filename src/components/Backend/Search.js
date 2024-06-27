
import React,{useState} from 'react'

const NOM_URL = "https://nominatim.openstreetmap.org/search?";

const Search = () => {
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
        console.log(JSON.parse(result));
        setListPlace(JSON.parse(result));
      })
      .catch(error => console.log("Error is :", error));
  }
  
  return (
    <div style={{display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex"}}>
        <div className='SearchTxt'>
          <input value={searchText} onChange={(event)=>setSearchText(event.target.value)} type="text" placeholder='Search Your Location...'
          />
        </div>
        <div className='SearchBtn'>
          <button onClick={handleSearch}>Search Here</button>
        </div>
      </div>
      <div>
        {
          listPlace.map(item => (
            <div key={item.osm_id} style={{display:"flex",alignItems:"center",gap:"5px"}}>
              <img style={{ width: "30px" }} src="https://image.similarpng.com/very-thumbnail/2021/09/Gps-icon-on-center-of-the-city-map-with-pin-location-on-transparent-background-PNG.png" alt="placeholder" />
              <p>{item.display_name}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Search