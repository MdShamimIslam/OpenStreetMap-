import {
  Button,
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { updateData} from "../../../utils/functions";
import { MediaUpload } from "@wordpress/block-editor";
import { mapTypeOptions } from "../../../utils/options";
import { produce } from "immer";

const ContentSettings = ({
  attributes,
  setAttributes,
  searchText,
  setSearchText,
  handleSearch,
  handleInputChange
}) => {
  const { map, options } = attributes;
  const { marker,listPlace,latitude,longitude } = map;
  const { scrollZoom, mapLayerType } = options;
  
  // set lat and lon in selectionPosition attributes
  const handleLatAndLonBtn = () => {
    if (latitude && longitude) {
      setAttributes({
        map: produce(map, (draft) => {
          draft.selectPosition = { lat: parseFloat(latitude), lon: parseFloat(longitude)};
          draft.listPlace = [];
        }),
      });
      setSearchText("");
    }
   
  };

  return (
    <>
      <PanelBody title={__("Map", "open-street-map")} initialOpen={true}>
        {/* location search  Control */}
        <div>
          <p className="widthChild">Search Location</p>
          <div style={{ display: "flex", gap: "3px", marginBottom: "-15px" }}>
            <div className="inputField">
              <input
                value={searchText}
                onChange={(e)=>handleInputChange(e.target.value)}
                type="text"
                placeholder="Search Your Location..."
              />
            </div>
            <div className="sBtn">
              <button onClick={() => handleSearch(searchText)}>Search</button>
            </div>
          </div>
          {/* show location */}
          <div className="location">
            {listPlace.length > 0 &&
              listPlace.map((item) => (
                <div
                  onClick={() => {
                    setAttributes({
                      map: produce(map, (draft) => {
                        draft.selectPosition = item;
                        draft.searchQuery = item.display_name;
                        draft.listPlace = [];
                        draft.latitude = "";
                        draft.longitude = "";
                      }),
                    });
                    setSearchText(item.display_name);
                  }}
                  key={item.place_id}
                  className="listPlace"
                >
                  <img
                    style={{ width: "20px", height: "25px" }}
                    src={marker.url}
                    alt="placeholder"
                  />
                  <p className="placeDisName">{item.display_name}</p>
                </div>
              ))}
          </div>
        </div>
        <p style={{textAlign:"center"}} className="widthChild">
          OR
        </p>
        <div className="latAndLon" style={{marginTop:"10px"}}>
          <div className="latLanPar">
            <div className="lat">
              <p>Latitude</p>
              <NumberControl
                className="nmbr"
                placeholder={__("Type Latitude...", "open-street-map")}
                label=""
                value={latitude}
                onChange={(v) => setAttributes({ map: updateData(map, parseFloat(v), "latitude") })}
              />
            </div>
            <div className="lon">
              <p>Longitude</p>
              <NumberControl
                className="nmbr"
                placeholder={__("Type Longitude...", "open-street-map")}
                label=""
                value={longitude}
                onChange={(v) => {setAttributes({ map: updateData(map, parseFloat(v), "longitude") })}}
              />
            </div>
          </div>
          <div className="latAndLonBtn">
              <button onClick={handleLatAndLonBtn}>Search Now</button>
            </div>
        </div>
        {/* map type */}
        <div style={{marginTop:"10px"}}>
          <p className="widthChild" style={{ marginBottom: "8px" }}>
            Type
          </p>
          <SelectControl
            value={mapLayerType}
            options={mapTypeOptions}
            onChange={(v) =>
              setAttributes({ options: updateData(options, v, "mapLayerType") })
            }
          />
        </div>
        {/* Upload marker */}
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          {/* marker url control */}
          <div>
            <p className="widthChild">Upload Marker</p>
            <TextControl
              style={{ width: "215px", marginTop: "10px" }}
              placeholder={__(
                "Type or Upload  Marker link...",
                "open-street-map"
              )}
              label=""
              value={marker.url}
              onChange={(v) =>
                setAttributes({ map: updateData(map, v, "marker", "url") })
              }
            ></TextControl>
          </div>
          {/* marker upload button */}
          <MediaUpload
            onSelect={(v) =>
              setAttributes({ map: updateData(map, v.url, "marker", "url") })
            }
            render={({ open }) => (
              <Button
                onClick={open}
                className="mediaBtn"
                icon={"upload f317"}
              ></Button>
            )}
          ></MediaUpload>
        </div>
        {/* scrollZoom toggle  */}
        <div style={{ marginTop: "15px" }}>
          <ToggleControl
            checked={scrollZoom}
            label="Scroll Wheel Zoom"
            onChange={(v) =>
              setAttributes({ options: updateData(options, v, "scrollZoom") })
            }
          />
        </div>
      </PanelBody>
    </>
  );
};

export default ContentSettings;
