

import { Button, PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { updateData } from '../../../utils/functions';
import { MediaUpload } from "@wordpress/block-editor";


const ContentSettings = ({ attributes, setAttributes }) => {
  const { osmInfo } = attributes;
  const { scrollZoom, marker } = osmInfo;
  const { markUrl } = marker;
  

  return (
    <>
      <PanelBody title={__('Map Marker', 'open-street-map')} initialOpen={false}>
        {/* Upload marker */}

        <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }} >
          {/* marker url control */}
          <div>
            <p className='widthChild'>Upload Marker</p>
            <TextControl
              style={{ width: "215px", marginTop: "10px" }}
              placeholder={__("Type or Upload  Marker link...", 'open-street-map')}
              label=""
              value={markUrl}
              onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "marker", "markUrl") })}
            ></TextControl>
          </div>
          {/* marker upload button */}
          <MediaUpload
            onSelect={(v) => setAttributes({ osmInfo: updateData(osmInfo, v.url, "marker", "markUrl") })}
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
            onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "scrollZoom") })}
          />
        </div>
      </PanelBody>
    </>
  );
};

export default ContentSettings;