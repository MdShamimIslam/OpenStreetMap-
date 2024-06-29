import { ColorPalette, PanelBody, PanelRow, RangeControl, TextControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { updateData } from '../../../utils/functions';
import { Device } from '../../../../../Components/Device/Device';
import { BorderControl, Typography, ColorsControl } from "../../../../../Components";
import { BBoxControl } from "../../../BBoxControl/BBoxControl";
import { Tab } from 'bpl-gutenberg-panel';

const StylesSettings = ({ attributes, setAttributes, device }) => {
  const { osmInfo } = attributes;
  const { border, padding } = osmInfo;
  const { width, height, mapBorder } = osmInfo.map;
  const { selectField, input, srcBtn, location } = osmInfo.mapSearch;
  const { srcPadding, srcColors, srcHoverColors, srcText, srcRadius } = srcBtn;
  const { text,typo } = srcText;
  const { colors, hoverColor, locRadius, locTypo } = location;

  return (
    <div>
      {/*  Full OSM */}
      <PanelBody title={__('Full OSM', 'open-street-map')} initialOpen={false}>
        {/* Width */}
        <div className='bPlPanelBody'>
          <div className='customWidth'>
            <p className='widthChild'>Width</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <UnitControl
            value={osmInfo.width[device]}
            onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "width", device) })}
          />
        </div>
        {/* height */}
        <div className='bPlPanelBody'>
          <div className='customWidth'>
            <p className='widthChild'>Height</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <UnitControl
            value={osmInfo.height[device]}
            onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "height", device) })}
          />
        </div>
        {/* border */}
        <div>
          <p className="widthChild" style={{ marginTop: "15px" }}>Border</p>
          <div style={{ marginTop: "-30px" }}>
            <BorderControl
              label=""
              value={border}
              onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "border") })}
            />
          </div>
        </div>
        {/* padding */}
        <div>
          <div className="padding">
            <p className="widthChild">Padding</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <BBoxControl
            label=""
            values={padding[device]}
            onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "padding", device) })}
          ></BBoxControl>
        </div>
      </PanelBody>
      {/* Map */}
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
            onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "map", "width", device) })}
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
            onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "map", "height", device) })}
          />
        </div>
        {/* border */}
        <div>
          <p className="widthChild" style={{ marginTop: "15px" }}>Border</p>
          <div style={{ marginTop: "-30px" }}>
            <BorderControl
              label=""
              value={mapBorder}
              onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "map", "mapBorder") })}
            />
          </div>
        </div>
      </PanelBody>
      {/* Search */}
      <PanelBody title={__('Search', 'open-street-map')} initialOpen={false}>
        {/* Width */}
        <div className='bPlPanelBody'>
          <div className='customWidth'>
            <p className='widthChild'>Width</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <UnitControl
            value={osmInfo.mapSearch.width[device]}
            onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "width", device) })}
          />
        </div>
        <div style={{ marginTop: "15px" }}>
          <Tab options={["Input", "Button", "Location"]}
            value={selectField}
            onChange={val => setAttributes({ osmInfo: updateData(osmInfo, val, "mapSearch", "selectField") })} />
        </div>
        {/* input */}
        <div>
          {
            selectField === 'input' && (
              <div>
                {/* Width */}
                <div className='bPlPanelBody'>
                  <div className='customWidth'>
                    <p className='widthChild'>Width</p>
                    <PanelRow>
                      <Device />
                    </PanelRow>
                  </div>
                  <UnitControl
                    value={input.width[device]}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "input", "width", device) })}
                  />
                </div>
                {/* height */}
                <div className='bPlPanelBody'>
                  <div className='customWidth'>
                    <p className='widthChild'>Height</p>
                    <PanelRow>
                      <Device />
                    </PanelRow>
                  </div>
                  <UnitControl
                    value={input.height[device]}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "input", "height", device) })}
                  />
                </div>
                {/* padding */}
                <div>
                  <div className="padding">
                    <p className="widthChild">Padding</p>
                    <PanelRow>
                      <Device />
                    </PanelRow>
                  </div>
                  <BBoxControl
                    label=""
                    values={input.padding[device]}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "input", "padding", device) })}
                  ></BBoxControl>
                </div>
                {/* Radius */}
                <div>
                  <p className='widthChild'>Radius</p>
                  <RangeControl
                    label=""
                    value={input.radius}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "input", "radius") })}
                    max={25}
                    min={0}
                    allowReset
                  />
                </div>
              </div>
            )
          }
        </div>
        {/* Button */}
        <div>
          {
            selectField === 'button' && (
              <div>
                {/* Text Control */}
                <div>
                  <p className='widthChild'>Text</p>
                  <TextControl
                    label=""
                    style={{ marginTop: "10px" }}
                    value={text}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "srcBtn", "srcText", "text") })}
                  />
                </div>
                {/* color and background */}
                <div className='colorsPar'>
                  <p className="widthChild">Normal Colors</p>
                  <ColorsControl
                    label=""
                    value={srcColors}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "srcBtn", "srcColors") })}
                    defaults={{ color: "white", bg: "#4527a4" }}
                  />
                </div>
                {/* hover color and background */}
                <div className='colorsPar'>
                  <p className="widthChild">Hover Colors</p>
                  <ColorsControl
                    label=""
                    value={srcHoverColors}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "srcBtn", "srcHoverColors") })}
                    defaults={{ color: "white", bg: "#167580" }}
                  />
                </div>
                {/* typography */}
                <div className="my typo">
                  <p className="widthChild">Typography</p>
                  <Typography
                    label=""
                    value={typo}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "srcBtn", "srcText", "typo") })}
                    defaults={{ fontSize: 13 }}
                  />
                </div>
                {/* padding */}
                <div>
                  <div className="padding">
                    <p className="widthChild">Padding</p>
                    <PanelRow>
                      <Device />
                    </PanelRow>
                  </div>
                  <BBoxControl
                    label=""
                    values={srcPadding[device]}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "srcBtn", "srcPadding", device) })}
                  ></BBoxControl>
                </div>
                {/* Radius */}
                <div>
                  <p className='widthChild'>Radius</p>
                  <RangeControl
                    label=""
                    value={srcRadius}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "srcBtn", "srcRadius") })}
                    max={25}
                    min={0}
                    allowReset
                  />
                </div>
              </div>
            )
          }
        </div>
        {/* Location */}
        <div>
          {
            selectField === 'location' && (
              <div>
                {/* color and background */}
                <div className='colorsPar'>
                  <p className="widthChild">Color & Background</p>
                  <ColorsControl
                    label=""
                    value={colors}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "location", "colors") })}
                    defaults={{ color: "", bg: "" }}
                  />
                </div>
                {/* Hover Color*/}
                <div style={{ marginTop: "10px" }}>
                  <p className="widthChild">Hover color</p>
                  <ColorPalette
                    style={{marginTop:"10px"}}
                    colors={[
                      {
                        color: '#f00',
                        name: 'Red'
                      },
                      {
                        color: '#fff',
                        name: 'White'
                      },
                      {
                        color: '#00f',
                        name: 'Blue'
                      },
                      {
                        color: 'black',
                        name: 'Black'
                      },
                      {
                        color: 'purple',
                        name: 'Purple'
                      }
                    ]}


                    value={hoverColor}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "location", "hoverColor") })}
                  />
                </div>
                {/* typography */}
                <div className="my typo">
                  <p className="widthChild">Typography</p>
                  <Typography
                    label=""
                    value={locTypo}
                    onChange={(v) => setAttributes({
                      osmInfo: updateData(osmInfo, v, "mapSearch", "location", "locTypo") })}
                    defaults={{ fontSize: 13 }}
                  />
                </div>
                {/* Radius */}
                <div style={{ marginTop: "10px" }}>
                  <p className='widthChild'>Radius</p>
                  <RangeControl
                    label=""
                    value={locRadius}
                    onChange={(v) => setAttributes({ osmInfo: updateData(osmInfo, v, "mapSearch", "location", "locRadius") })}
                    max={25}
                    min={0}
                    allowReset
                  />
                </div>
              </div>
            )
          }
        </div>
        <div>
          
        </div>
      </PanelBody>
    </div>
  );
};

export default StylesSettings;