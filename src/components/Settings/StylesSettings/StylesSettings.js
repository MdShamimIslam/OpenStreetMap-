import { PanelBody, PanelRow,RangeControl,__experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { updateData } from '../../../utils/functions';
import { Device } from '../../../../../Components/Device/Device';
import { BorderControl} from "../../../../../Components";

const StylesSettings = ({ attributes, setAttributes, device }) => {
  const { layout, style } = attributes;
  const { border } = style;
  const { width, height } = layout.mapColumns;
  const { markerColumns } = layout;

  return (
    <div>
      <PanelBody className='bPlPanelBody' title={__('Map', 'open-street-map')} initialOpen={false}>
        {/* Width */}
        <div>
          <div className='customWidth'>
            <p className='widthChild'>Width</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <UnitControl
            value={width[device]}
            onChange={(v) => setAttributes({ layout: updateData(layout, v, "mapColumns", "width", device) })}
          />
        </div>
        {/* height */}
        <div>
          <div className='customWidth'>
            <p className='widthChild'>Height</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <UnitControl
            value={height[device]}
            onChange={(v) => setAttributes({ layout: updateData(layout, v, "mapColumns", "height", device) })}
          />
        </div>
        {/* border */}
        <div>
          <p className="widthChild" style={{ marginTop: "15px" }}>Border</p>
          <div style={{ marginTop: "-30px" }}>
            <BorderControl
              label=""
              value={border}
              onChange={(v) => setAttributes({ style: updateData(style, v, "border")})}
            />
          </div>
        </div>
      </PanelBody>
      <PanelBody className='bPlPanelBody' title={__('Marker', 'open-street-map')} initialOpen={false}>
        {/* Width */}
        <div>
          <div className='customWidth'>
            <p className='widthChild'>Width</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <RangeControl
            allowReset
            value={markerColumns.width[device]}
            onChange={(v) => setAttributes({ layout: updateData(layout, v, "markerColumns", "width", device) })}
            min={1}
            max={100}
          />
        </div>
        {/* height */}
        <div>
          <div className='customWidth'>
            <p className='widthChild'>Height</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <RangeControl
            allowReset
            value={markerColumns.height[device]}
            onChange={(v) => setAttributes({ layout: updateData(layout, v, "markerColumns", "height", device) })}
            min={1}
            max={100}
          />
        </div>
      </PanelBody>
    </div>
  );
};

export default StylesSettings;