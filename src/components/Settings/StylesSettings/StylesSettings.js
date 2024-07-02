import { PanelBody, PanelRow,__experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { updateData } from '../../../utils/functions';
import { Device } from '../../../../../Components/Device/Device';
import { BorderControl} from "../../../../../Components";

const StylesSettings = ({ attributes, setAttributes, device }) => {
  const { layout, style } = attributes;
  const { border } = style;
  const { width, height } = layout.columns;

  return (
    <div>
      <PanelBody className='bPlPanelBody' title={__('Map', 'open-street-map')} initialOpen={true}>
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
            onChange={(v) => setAttributes({ layout: updateData(layout, v, "columns", "width", device) })}
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
            onChange={(v) => setAttributes({ layout: updateData(layout, v, "columns", "height", device) })}
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
    </div>
  );
};

export default StylesSettings;