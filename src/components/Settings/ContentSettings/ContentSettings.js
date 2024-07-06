import { MediaUpload } from "@wordpress/block-editor";
import {
  Button,
  __experimentalNumberControl as NumberControl,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { produce } from "immer";
import { updateData } from "../../../utils/functions";
import { mapTypeOptions, searchIcon } from "../../../utils/options";

const ContentSettings = ({
  attributes,
  setAttributes,
  searchText,
  setSearchText,
  handleSearch,
  handleInputChange,
}) => {
  const { map, options, style } = attributes;
  const { marker, listPlace, latitude, longitude } = map;
  const { url, toUrl, pathUrl } = marker;
  const {
    scrollZoom,
    mapLayerType,
    isFullScreen,
    isViewOtherAddress,
    isViewMyLocation,
    isMapLayer,
  } = options;

  // set lat and lon in selectionPosition attributes
  const handleLatAndLonBtn = () => {
    if (latitude && longitude) {
      setAttributes({
        map: produce(map, (draft) => {
          draft.selectPosition = {
            lat: parseFloat(latitude),
            lon: parseFloat(longitude),
          };
          draft.listPlace = [];
        }),
      });
      setSearchText("");
    }
  };

  return (
    <>
      {/* map */}
      <PanelBody title={__("Map", "open-street-map")} initialOpen={true}>
        {/* location search  Control */}
        <div>
          <p className="widthChild">Search Location</p>
          <div style={{ display: "flex", gap: "3px", marginBottom: "-15px" }}>
            <div className="inputField">
              <input
                value={searchText}
                onChange={(e) => handleInputChange(e.target.value)}
                type="text"
                placeholder="Search Your Location..."
              />
            </div>
            <button className="sBtn" onClick={() => handleSearch(searchText)}>
            {searchIcon}
           </button>
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
        <p style={{ textAlign: "center" }} className="widthChild">
          OR
        </p>
        <div className="latAndLon" style={{ marginTop: "5px" }}>
          <div className="latLanPar">
            <div className="lat">
              <p>Latitude</p>
              <NumberControl
                className="nmbr"
                placeholder={__("Type Latitude...", "open-street-map")}
                label=""
                value={latitude}
                onChange={(v) =>
                  setAttributes({
                    map: updateData(map, parseFloat(v), "latitude"),
                  })
                }
              />
            </div>
            <div className="lon">
              <p>Longitude</p>
              <NumberControl
                className="nmbr"
                placeholder={__("Type Longitude...", "open-street-map")}
                label=""
                value={longitude}
                onChange={(v) => {
                  setAttributes({
                    map: updateData(map, parseFloat(v), "longitude"),
                  });
                }}
              />
            </div>
          </div>
          <div className="latAndLonBtn">
            <button onClick={handleLatAndLonBtn}>Search Now</button>
          </div>
        </div>
        {/* map type */}
        <div style={{ marginTop: "10px" }}>
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
        {/* zoom */}
        <div className="bPlPanelBody">
        <p className="widthChild">Zoom</p>
          <RangeControl
            value={style.zoom}
            onChange={(v) =>
              setAttributes({ style: updateData(style, v, "zoom") })
            }
            min={0}
            max={25}
          />
        </div>
        {/* map layer toggle  */}
        <div style={{ marginTop: "15px" }}>
          <ToggleControl
            checked={isMapLayer}
            label="Show Layer"
            onChange={(v) =>
              setAttributes({ options: updateData(options, v, "isMapLayer") })
            }
          />
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
        {/*  full screen */}
        <div style={{ marginTop: "15px" }}>
          <ToggleControl
            checked={isFullScreen}
            label="Full Screen"
            onChange={(v) =>
              setAttributes({ options: updateData(options, v, "isFullScreen") })
            }
          />
        </div>
      </PanelBody>
      {/* marker */}
      <PanelBody title={__("Marker", "open-street-map")} initialOpen={false}>
        {/* Upload self/start point marker */}
        <div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            {/*  self marker url control */}
            <div>
              <p className="widthChild">Start Point Location</p>
              <TextControl
                style={{ width: "215px", marginTop: "10px" }}
                placeholder={__(" Upload self Marker...", "open-street-map")}
                label=""
                value={url}
                onChange={(v) =>
                  setAttributes({ map: updateData(map, v, "marker", "url") })
                }
              ></TextControl>
            </div>
            {/* self marker upload button */}
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
          {/*  View self Location */}
          <div style={{ marginTop: "5px" }}>
            <ToggleControl
              checked={isViewMyLocation}
              label="View Start Location"
              onChange={(v) =>
                setAttributes({
                  options: updateData(options, v, "isViewMyLocation"),
                })
              }
            />
          </div>
        </div>
        {/* Upload others/end point marker */}
        <div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            {/*  Others/To marker url control */}
            <div>
              <p className="widthChild">End Point Location</p>
              <TextControl
                style={{ width: "215px", marginTop: "10px" }}
                placeholder={__(" Upload others Marker...", "open-street-map")}
                label=""
                value={toUrl}
                onChange={(v) =>
                  setAttributes({ map: updateData(map, v, "marker", "toUrl") })
                }
              ></TextControl>
            </div>
            {/* self marker upload button */}
            <MediaUpload
              onSelect={(v) =>
                setAttributes({
                  map: updateData(map, v.url, "marker", "toUrl"),
                })
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
          {/*  View other/to address */}
          <div style={{ marginTop: "5px" }}>
            <ToggleControl
              checked={isViewOtherAddress}
              label="View End Location"
              onChange={(v) =>
                setAttributes({
                  options: updateData(options, v, "isViewOtherAddress"),
                })
              }
            />
          </div>
        </div>
        {/* Upload path/intermediate point marker */}
        <div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            {/*  path marker url control */}
            <div>
              <p className="widthChild">Intermediate Point Location</p>
              <TextControl
                style={{ width: "215px", marginTop: "10px" }}
                placeholder={__("Upload Path Marker...", "open-street-map")}
                label=""
                value={pathUrl}
                onChange={(v) =>
                  setAttributes({
                    map: updateData(map, v, "marker", "pathUrl"),
                  })
                }
              ></TextControl>
            </div>
            {/* path marker upload button */}
            <MediaUpload
              onSelect={(v) =>
                setAttributes({
                  map: updateData(map, v.url, "marker", "pathUrl"),
                })
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
        </div>
      </PanelBody>
    </>
  );
};

export default ContentSettings;
