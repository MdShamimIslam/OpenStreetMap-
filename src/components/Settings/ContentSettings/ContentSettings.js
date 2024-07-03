

import { Button, PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { updateData } from '../../../utils/functions';
import { MediaUpload } from "@wordpress/block-editor";
import { mapTypeOptions } from '../../../utils/options';
import { produce } from 'immer';


const ContentSettings = ({ attributes, setAttributes, searchText,handleSearch, handleInputChange }) => {
  const { map, options } = attributes;
  const { marker, listPlace } = map;
  const { scrollZoom, mapLayerType } = options;


  return (
    <>
      <PanelBody title={__('Map', 'open-street-map')} initialOpen={true}>
        {/* location search  Control */}
        <div>
          <p className='widthChild'>Search Location</p>
          <div style={{display:"flex",gap:"3px",marginBottom:"-15px"}}>
            <div
            className='inputField'
            >
              <input
                value={searchText}
                onChange={handleInputChange}
                type="text" placeholder='Search Your Location...'
              />
            </div>
            <div
            className='sBtn'
            >
              <button onClick={() => handleSearch(searchText)}>Search</button>
            </div>
         </div>
          {/* show location */}
          <div className='location'>
            {
              listPlace.length > 0 && listPlace.map(item => (
                <div
                  onClick={() => {
                    setAttributes({
                      map: produce(map, draft => {
                        draft.selectPosition = item;
                        draft.listPlace = [];
                    })})
                  }}
                  key={item.place_id}
                  className='listPlace'
                  
                >
                  <img style={{ width: "20px",height:"25px" }} src={marker.url} alt="placeholder" />
                  <p className='placeDisName'>{item.display_name}</p>
                </div>
              ))
            }
          </div>
        </div>
        {/* map type */}
        <div>
          <p className='widthChild' style={{ marginBottom: "8px" }}>Type</p>
          <SelectControl
            value={mapLayerType}
            options={mapTypeOptions}
            onChange={(v) => setAttributes({ options: updateData(options, v,"mapLayerType")})}
          />
        </div>
        {/* Upload marker */}
        <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }} >
          {/* marker url control */}
          <div>
            <p className='widthChild'>Upload Marker</p>
            <TextControl
              style={{ width: "215px", marginTop: "10px" }}
              placeholder={__("Type or Upload  Marker link...", 'open-street-map')}
              label=""
              value={marker.url}
              onChange={(v) => setAttributes({ map: updateData(map, v, "marker", "url") })}
            ></TextControl>
          </div>
          {/* marker upload button */}
          <MediaUpload
            onSelect={(v) => setAttributes({ map: updateData(map, v.url, "marker", "url") })}
            render={({ open }) => (
              <Button
                onClick={open}
                className='mediaBtn'
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
            onChange={(v) => setAttributes({ options: updateData(options, v, "scrollZoom") })}
          />
        </div>
      </PanelBody>
    </>
  );
};

export default ContentSettings;