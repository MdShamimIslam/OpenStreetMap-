
import { PanelBody, PanelRow, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { updateData } from '../../../utils/functions';
import { Device } from '../../../../../Components/Device/Device';

const ContentSettings = ({ attributes, setAttributes,device }) => {
  
  const { osmInfo } = attributes;
  const { width,height } = osmInfo;
 
  return (
    <>
      <PanelBody title={__('Map Marker', 'open-street-map')} initialOpen={true}>
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
            onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "width", device) })}
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
            onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "height", device) })}
          />
        </div>
      </PanelBody>
    </>
  );
};

export default ContentSettings;