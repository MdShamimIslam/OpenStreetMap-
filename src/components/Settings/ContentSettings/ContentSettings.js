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
import { mapTypeOptions, routingSytemOptions, searchIcon } from "../../../utils/options";

const ContentSettings = ({
  attributes,
  setAttributes,
  searchText,
  setSearchText,
  handleSearch,
  handleFromSearch,
  handleDesSearch,
  handleInputChange,
  fromSearchText,
  setFromSearchText,
  handleFromInputChange,
  desSearchText,
  setDesSearchText,
  handleDesInputChange,
}) => {
  const { map, options, style } = attributes;
  const {
    marker,
    listPlace,
    fromListPlace,
    desListPlace,
    latitude,
    longitude,
    from,
    destination,
    routingSystem
  } = map;
  const { currentUrl, fromUrl, toUrl, pathUrl } = marker;
  const {
    scrollZoom,
    isViewLatLon,
    mapLayerType,
    isFullScreen,
    isViewMyLocation,
    isMapLayer,
    isDownloadPDF,
  } = options;


  // Function calling both(from and des) search handlers
  const handleFromAndDesBtn = async () => {
    const fromInfo = await handleFromSearch(fromSearchText);
    const destinationInfo = await handleDesSearch(desSearchText);
    // set from and destination data in attributes
    setAttributes({
      map: produce(map, (draft) => {
        // from
        draft.selectFromPosition = fromInfo[0];
        draft.fromListPlace = [];
        draft.fromSearchQuery = fromSearchText;
        // destination
        draft.selectDestinationPosition = destinationInfo[0];
        draft.desListPlace = [];
        draft.destination.lat = "";
        draft.destination.lon = "";
        draft.from.lat = "";
        draft.from.lon = "";
        draft.DesSearchQuery = desSearchText;
      }),
    });
  };

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
          draft.searchQuery ="";
        }),
      });
      setSearchText("");
    }
  };

  // handle from and des latlon btn
  const handleFromAndDesLatLonBtn = () => {
    if (from.lat && from.lon && destination.lat && destination.lon) {
      setAttributes({
        map: produce(map, (draft) => {
          draft.selectFromPosition = {
            lat: parseFloat(from.lat),
            lon: parseFloat(from.lon),
          };
          draft.selectDestinationPosition = {
            lat: parseFloat(destination.lat),
            lon: parseFloat(destination.lon),
          };
          draft.fromListPlace = [];
          draft.desListPlace = [];
          draft.fromSearchQuery = "";
          draft.DesSearchQuery = "";
        }),
      });
      setFromSearchText("");
      setDesSearchText("");
    }
  };

  
  return (
    <>
      {/* map */}
      <PanelBody title={__("Map", "open-street-map")} initialOpen={true}>
        {/* Single Input field and search when routingSystem isn't distance  */}
        <div>
          {
            routingSystem !== 'distance' && (
              <div>
              {/* location search  Control */}
              <div>
                <p className="widthChild">Search Location</p>
                <div
                  style={{ display: "flex", gap: "3px", marginBottom: "-15px" }}
                >
                  <div className="inputField">
                    <input
                      value={searchText}
                      onChange={(e) => handleInputChange(e.target.value)}
                      type="text"
                      placeholder="Search Your Location..."
                    />
                  </div>
                  <button
                    className="sBtn"
                    onClick={() => handleSearch(searchText)}
                  >
                    {searchIcon}
                  </button>
                </div>
                {/* show search location */}
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
                          style={{ width: "15px", height: "20px" }}
                          src={marker.toUrl}
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
            </div>
            )
          }
            
        </div>
        {/* From and  Destination Input field and search if routingSystem is distance */}
        <div>
          {
            routingSystem === 'distance' && (
            <div>
              {/* Query Search */}
              <div>
                {/* from start */}
                <div className="fInput">
                  <p className="widthChild">From</p>
                  <input
                    value={fromSearchText}
                    onChange={(e) => handleFromInputChange(e.target.value)}
                    type="text"
                    placeholder="Type From Location..."
                    className="fromInput"
                  />
                </div>
                {/* show from search location  */}
                <div className="location">
                  {fromListPlace.length > 0 &&
                    fromListPlace.map((item) => (
                      <div
                        onClick={() => {
                          setAttributes({
                            map: produce(map, (draft) => {
                              draft.selectFromPosition = item;
                              draft.fromSearchQuery = item.display_name;
                              draft.fromListPlace = [];
                              draft.from.lat = "";
                              draft.from.lon = "";
                            }),
                          });
                          setFromSearchText(item.display_name);
                        }}
                        key={item.place_id}
                        className="listPlace"
                      >
                        <img
                          style={{ width: "15px", height: "20px" }}
                          src={marker.fromUrl}
                          alt="placeholder"
                        />
                        <p className="placeDisName">{item.display_name}</p>
                      </div>
                    ))}
                </div>
                {/* from end */}

                {/* destination start */}
                <div className="fInput">
                  <p className="widthChild">Destination</p>
                  <input
                    value={desSearchText}
                    onChange={(e) => handleDesInputChange(e.target.value)}
                    type="text"
                    placeholder="Type Destination Location..."
                    className="fromInput"
                  />
                </div>
                {/* show destination search location */}
                <div className="location">
                  {desListPlace.length > 0 &&
                    desListPlace.map((item) => (
                      <div
                        onClick={() => {
                          setAttributes({
                            map: produce(map, (draft) => {
                              draft.selectDestinationPosition = item;
                              draft.DesSearchQuery = item.display_name;
                              draft.desListPlace = [];
                              draft.destination.lat = "";
                              draft.destination.lon = "";
                            }),
                          });
                          setDesSearchText(item.display_name);
                        }}
                        key={item.place_id}
                        className="listPlace"
                      >
                        <img
                          style={{ width: "15px", height: "20px" }}
                          src={marker.toUrl}
                          alt="placeholder"
                        />
                        <p className="placeDisName">{item.display_name}</p>
                      </div>
                    ))}
                </div>
                {/* destination end */}

                {/* From and des button handle */}
                <div className="desBtn">
                  <button onClick={() => handleFromAndDesBtn()}>
                    Search Here
                  </button>
                </div>
              </div>
              <p style={{ textAlign: "center" }} className="widthChild">
                {" "}
                OR{" "}
              </p>
              {/* Lat-lon Search */}
              <div>
                {/* from lat and lon */}
                <div>
                  <p className="widthChild"> From </p>
                  <div className="fromLatLon">
                    <div>
                      {" "}
                      <NumberControl
                        className=""
                        placeholder={__("Type Latitude...", "open-street-map")}
                        label=""
                        value={from.lat}
                        onChange={(v) =>
                          setAttributes({
                            map: updateData(map, parseFloat(v), "from", "lat"),
                          })
                        }
                      />
                    </div>

                    <div>
                      {" "}
                      <NumberControl
                        className=""
                        placeholder={__("Type Longitude...", "open-street-map")}
                        label=""
                        value={from.lon}
                        onChange={(v) => {
                          setAttributes({
                            map: updateData(map, parseFloat(v), "from", "lon"),
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* destination lat and lon */}
                <div>
                  <p className="widthChild"> Destination </p>
                  <div className="fromLatLon">
                    <div>
                      {" "}
                      <NumberControl
                        className=""
                        placeholder={__("Type Latitude...", "open-street-map")}
                        label=""
                        value={destination.lat}
                        onChange={(v) => {
                          setAttributes({
                            map: updateData(
                              map,
                              parseFloat(v),
                              "destination",
                              "lat"
                            ),
                          });
                        }}
                      />
                    </div>

                    <div>
                      {" "}
                      <NumberControl
                        className=""
                        placeholder={__("Type Longitude...", "open-street-map")}
                        label=""
                        value={destination.lon}
                        onChange={(v) => {
                          setAttributes({
                            map: updateData(
                              map,
                              parseFloat(v),
                              "destination",
                              "lon"
                            ),
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="latAndLonBtn">
                  <button onClick={handleFromAndDesLatLonBtn}>
                    Search Now
                  </button>
                </div>
              </div>
            </div>
            )
          }
            
        </div>
        {/* Routing System */}
        <div style={{ marginTop:"15px" }}>
          <p className="widthChild" style={{ marginBottom: "5px" }}>
            Routing System
          </p>
          <SelectControl
            value={routingSystem}
            options={routingSytemOptions}
            onChange={(v) =>
              setAttributes({ map: updateData(map, v, "routingSystem") })
            }
          />
        </div>
        {/* map type */}
        <div style={{ marginTop:"5px" }}>
          <p className="widthChild" style={{ marginBottom: "5px" }}>
            Layer Type
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
        <div className="bPlPanelBody" style={{ marginTop: "15px" }}>
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
        {/*  View self Location */}
        <div style={{ marginTop: "5px" }}>
          <ToggleControl
            checked={isViewMyLocation}
            label="View My Location"
            onChange={(v) =>
              setAttributes({
                options: updateData(options, v, "isViewMyLocation"),
              })
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
        {/* view lat lon toggle  */}
        <div style={{ marginTop: "15px" }}>
          <ToggleControl
            checked={isViewLatLon}
            label="View Selected lat-lon"
            onChange={(v) =>
              setAttributes({ options: updateData(options, v, "isViewLatLon") })
            }
          />
        </div>
        {/* Download PDF toggle  */}
        <div style={{ marginTop: "15px" }}>
          <ToggleControl
            checked={isDownloadPDF}
            label="Download Location of Map"
            onChange={(v) =>
              setAttributes({
                options: updateData(options, v, "isDownloadPDF"),
              })
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
            {/*  Current marker url control */}
            <div>
              <p className="widthChild">Current Point Location</p>
              <TextControl
                style={{ width: "215px", marginTop: "10px" }}
                placeholder={__(" Upload self Marker...", "open-street-map")}
                label=""
                value={currentUrl}
                onChange={(v) =>
                  setAttributes({
                    map: updateData(map, v, "marker", "currentUrl"),
                  })
                }
              ></TextControl>
            </div>
            {/* self marker upload button */}
            <MediaUpload
              onSelect={(v) =>
                setAttributes({
                  map: updateData(map, v.url, "marker", "currentUrl"),
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
                value={fromUrl}
                onChange={(v) =>
                  setAttributes({
                    map: updateData(map, v, "marker", "fromUrl"),
                  })
                }
              ></TextControl>
            </div>
            {/* self marker upload button */}
            <MediaUpload
              onSelect={(v) =>
                setAttributes({
                  map: updateData(map, v.url, "marker", "fromUrl"),
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
