import { InspectorControls } from "@wordpress/block-editor";
import { TabPanel } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { produce } from "immer";
import React, { useEffect, useState } from "react";
import ContentSettings from "../Settings/ContentSettings/ContentSettings";
import StylesSettings from "../Settings/StylesSettings/StylesSettings";
import OsmBack from "./OsmBack";
// url of Nominatim
const NOM_URL = "https://nominatim.openStreetMap.org/search?";

const Edit = (props) => {
  const { attributes, setAttributes, clientId, device } = props;
  const { map } = attributes;
  const [searchText, setSearchText] = useState(map.searchQuery);
  // from search state
  const [fromSearchText, setFromSearchText] = useState(map.fromSearchQuery);
  // destination search state
  const [desSearchText, setDesSearchText] = useState(map.DesSearchQuery);
  // Handle Search
  const handleSearch = (query) => {
    const params = {
      q: query,
      format: "json",
      addressDetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${NOM_URL}${queryString}`, requestOptions)
      .then((res) => res.text())
      .then((result) => {
        const arrayResult = JSON.parse(result);
        const searchLocation = arrayResult[0];
        setAttributes({
          map: produce(map, (draft) => {
            draft.selectPosition = searchLocation;
            draft.listPlace = [];
            draft.latitude = "";
            draft.longitude = "";
            draft.searchQuery = query;
          }),
        });
      })
      .catch((error) => console.log("Error is :", error));
  };
  // Handle from Search
  const handleFromSearch = async (query) => {
    const params = {
      q: query,
      format: "json",
      addressDetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
   const response = await fetch(`${NOM_URL}${queryString}`, requestOptions)
   return await response.json();
  };
  // Handle destination Search
  const handleDesSearch = async (query) => {
    const params = {
      q: query,
      format: "json",
      addressDetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(`${NOM_URL}${queryString}`, requestOptions)
    return await response.json();
  };

  // Search handle input change
  const handleInputChange = (value) => {
    setSearchText(value);
    const params = {
      q: value,
      format: "json",
      addressDetails: 1,
      polygon_geojson: 0,
    };
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${NOM_URL}${queryString}`, requestOptions)
      .then((res) => res.text())
      .then((result) => {
        setAttributes({
          map: produce(map, (draft) => {
            draft.listPlace = JSON.parse(result);
          }),
        });
      })
      .catch((error) => console.log("Error is :", error));
  };
    // From handle Input change
    const handleFromInputChange =(value)=>{
      setFromSearchText(value);
      const params = {
        q: value,
        format: "json",
        addressDetails: 1,
        polygon_geojson: 0,
      };
      const queryString = new URLSearchParams(params).toString();
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      fetch(`${NOM_URL}${queryString}`, requestOptions)
        .then((res) => res.text())
        .then((result) => {
          setAttributes({
            map: produce(map, (draft) => {
              draft.fromListPlace = JSON.parse(result);
              draft.desListPlace = "";
            }),
          });
        })
        .catch((error) => console.log("Error is :", error));
    }
    // destination handle Input change
    const handleDesInputChange =(value)=>{
      setDesSearchText(value);
      const params = {
        q: value,
        format: "json",
        addressDetails: 1,
        polygon_geojson: 0,
      };
      const queryString = new URLSearchParams(params).toString();
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      fetch(`${NOM_URL}${queryString}`, requestOptions)
        .then((res) => res.text())
        .then((result) => {
          setAttributes({
            map: produce(map, (draft) => {
              draft.desListPlace = JSON.parse(result);
              draft.fromListPlace = "";
            }),
          });
        })
        .catch((error) => console.log("Error is :", error));
    }

  useEffect(() => {
    clientId && setAttributes({ cId: clientId.substring(0, 10) });
  }, [clientId]);

  return (
    <>
      <InspectorControls>
        <TabPanel
          className="my-tab-panel"
          activeClass="active-tab"
          tabs={[
            {
              name: "tab1",
              title: "General",
            },
            {
              name: "tab2",
              title: "Styles",
            },
          ]}
        >
          {(tab) => (
            <>
              {tab.name === "tab1" && (
                <ContentSettings
                  attributes={attributes}
                  setAttributes={setAttributes}
                  device={device}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  handleSearch={handleSearch}
                  handleFromSearch={handleFromSearch}
                  handleDesSearch={handleDesSearch}
                  handleInputChange={handleInputChange}
                  fromSearchText={fromSearchText}
                  setFromSearchText={setFromSearchText}
                  handleFromInputChange={handleFromInputChange}
                  desSearchText={desSearchText}
                  setDesSearchText={setDesSearchText}
                  handleDesInputChange={handleDesInputChange}
                />
              )}
              {tab.name === "tab2" && (
                <StylesSettings
                  attributes={attributes}
                  setAttributes={setAttributes}
                  device={device}
                />
              )}
            </>
          )}
        </TabPanel>
      </InspectorControls>
      <OsmBack
        attributes={attributes}
        setAttributes={setAttributes}
        device={device}
      />
    </>
  );
};
export default withSelect((select) => {
  return {
    device: select("core/edit-post")
      .__experimentalGetPreviewDeviceType()
      ?.toLowerCase(),
  };
})(Edit);
