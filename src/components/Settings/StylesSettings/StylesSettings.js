import {
  PanelBody,
  PanelRow,
  RangeControl,
  __experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { updateData } from "../../../utils/functions";
import { Device } from "../../../../../Components/Device/Device";
import {
  BorderControl,
  ColorsControl,
  Typography,
} from "../../../../../Components";
import { Tab } from "bpl-gutenberg-panel";
import { produce } from "immer";

const StylesSettings = ({ attributes, setAttributes, device }) => {
  const { layout, options, style } = attributes;
  const { selectMarker } = options;
  const { tooltipColors, tooltipTypo, border } = style;
  const { width, height } = layout.mapColumns;
  const { markerColumns,selfMarkerColumns, othersMarkerColumns, pathMarkerColumns } = layout;
  console.log(tooltipTypo);
  return (
    <div>
      {/* map */}
      <PanelBody title={__("Map", "open-street-map")} initialOpen={false}>
        {/* tooltip color and background */}
        <div className="customWidth">
          <p className="widthChild">Tooltip Colors</p>
          <ColorsControl
            label=""
            value={tooltipColors}
            onChange={(v) =>
              setAttributes({
                style: updateData(style, v, "tooltipColors"),
              })
            }
            defaults={{ color: "white", bg: "#4527a4" }}
          />
        </div>
        {/* typography */}
        <div className="customWidth">
          <p className="widthChild">Tooltip Typography</p>
          <Typography
            label=""
            value={tooltipTypo}
            onChange={(v) => setAttributes({style:produce(style,draft=>{
              draft.tooltipTypo=v
            })})  }
            defaults={{ fontSize: 13 }}
          />
        </div>
        {/* Width */}
        <div className="bPlPanelBody">
          <div className="customWidth">
            <p className="widthChild">Width</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <UnitControl
            value={width[device]}
            onChange={(v) =>
              setAttributes({
                layout: updateData(layout, v, "mapColumns", "width", device),
              })
            }
          />
        </div>
        {/* height */}
        <div className="bPlPanelBody">
          <div className="customWidth">
            <p className="widthChild">Height</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <UnitControl
            value={height[device]}
            onChange={(v) =>
              setAttributes({
                layout: updateData(layout, v, "mapColumns", "height", device),
              })
            }
          />
        </div>
        {/* border */}
        <div className="bPlPanelBody">
          <p className="widthChild" style={{ marginTop: "15px" }}>
            Border
          </p>
          <div style={{ marginTop: "-30px" }}>
            <BorderControl
              label=""
              value={border}
              onChange={(v) =>
                setAttributes({ style: updateData(style, v, "border") })
              }
            />
          </div>
        </div>
      </PanelBody>
      {/* marker */}
      <PanelBody
        className="bPlPanelBody"
        title={__("Marker", "open-street-map")}
        initialOpen={false}
      >
        {/* Width */}
        <div>
          <div className="customWidth">
            <p className="widthChild">Width</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <RangeControl
            allowReset
            value={markerColumns.width[device]}
            onChange={(v) =>
              setAttributes({
                layout: updateData(
                  layout,
                  v,
                  "markerColumns",
                  "width",
                  device
                ),
              })
            }
            min={1}
            max={100}
          />
        </div>
        {/* height */}
        <div>
          <div className="customWidth">
            <p className="widthChild">Height</p>
            <PanelRow>
              <Device />
            </PanelRow>
          </div>
          <RangeControl
            allowReset
            value={markerColumns.height[device]}
            onChange={(v) =>
              setAttributes({
                layout: updateData(
                  layout,
                  v,
                  "markerColumns",
                  "height",
                  device
                ),
              })
            }
            min={1}
            max={100}
          />
        </div>
        <div style={{ marginTop: "15px" }}>
          <p className="widthChild">From and Destination</p>
          <Tab
            style={{ marginTop: "10px" }}
            options={["Start", "End", "Intermediate"]}
            value={selectMarker}
            onChange={(val) =>
              setAttributes({
                options: updateData(options, val, "selectMarker"),
              })
            }
          />
        </div>
        {/* marker width and height */}
        <div>
          {/* self marker */}
          {selectMarker === "start" && (
            <div>
              {/* Width */}
              <div>
                <div className="customWidth">
                  <p className="widthChild">Width</p>
                  <PanelRow>
                    <Device />
                  </PanelRow>
                </div>
                <RangeControl
                  allowReset
                  value={selfMarkerColumns.width[device]}
                  onChange={(v) =>
                    setAttributes({
                      layout: updateData(
                        layout,
                        v,
                        "selfMarkerColumns",
                        "width",
                        device
                      ),
                    })
                  }
                  min={1}
                  max={100}
                />
              </div>
              {/* height */}
              <div>
                <div className="customWidth">
                  <p className="widthChild">Height</p>
                  <PanelRow>
                    <Device />
                  </PanelRow>
                </div>
                <RangeControl
                  allowReset
                  value={selfMarkerColumns.height[device]}
                  onChange={(v) =>
                    setAttributes({
                      layout: updateData(
                        layout,
                        v,
                        "selfMarkerColumns",
                        "height",
                        device
                      ),
                    })
                  }
                  min={1}
                  max={100}
                />
              </div>
            </div>
          )}
          {selectMarker === "end" && (
            <div>
              {/* Width */}
              <div>
                <div className="customWidth">
                  <p className="widthChild">Width</p>
                  <PanelRow>
                    <Device />
                  </PanelRow>
                </div>
                <RangeControl
                  allowReset
                  value={othersMarkerColumns.width[device]}
                  onChange={(v) =>
                    setAttributes({
                      layout: updateData(
                        layout,
                        v,
                        "othersMarkerColumns",
                        "width",
                        device
                      ),
                    })
                  }
                  min={1}
                  max={100}
                />
              </div>
              {/* height */}
              <div>
                <div className="customWidth">
                  <p className="widthChild">Height</p>
                  <PanelRow>
                    <Device />
                  </PanelRow>
                </div>
                <RangeControl
                  allowReset
                  value={othersMarkerColumns.height[device]}
                  onChange={(v) =>
                    setAttributes({
                      layout: updateData(
                        layout,
                        v,
                        "othersMarkerColumns",
                        "height",
                        device
                      ),
                    })
                  }
                  min={1}
                  max={100}
                />
              </div>
            </div>
          )}
          {selectMarker === "intermediate" && (
            <div>
              {/* Width */}
              <div>
                <div className="customWidth">
                  <p className="widthChild">Width</p>
                  <PanelRow>
                    <Device />
                  </PanelRow>
                </div>
                <RangeControl
                  allowReset
                  value={pathMarkerColumns.width[device]}
                  onChange={(v) =>
                    setAttributes({
                      layout: updateData(
                        layout,
                        v,
                        "pathMarkerColumns",
                        "width",
                        device
                      ),
                    })
                  }
                  min={1}
                  max={100}
                />
              </div>
              {/* height */}
              <div>
                <div className="customWidth">
                  <p className="widthChild">Height</p>
                  <PanelRow>
                    <Device />
                  </PanelRow>
                </div>
                <RangeControl
                  allowReset
                  value={pathMarkerColumns.height[device]}
                  onChange={(v) =>
                    setAttributes({
                      layout: updateData(
                        layout,
                        v,
                        "pathMarkerColumns",
                        "height",
                        device
                      ),
                    })
                  }
                  min={1}
                  max={100}
                />
              </div>
            </div>
          )}
        </div>
      </PanelBody>
    </div>
  );
};

export default StylesSettings;
