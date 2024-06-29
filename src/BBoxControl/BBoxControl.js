import { __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { useEffect, useState } from 'react';

export const BBoxControl = ({ label, values, onChange = () => { }, resetValues, defaultValues, units, sides, style, className,disableUnits=false }) => {
  const [link, setLink] = useState(true);
  // const [value, setValue] = useState(values || {});

  const unitSides = sides || ["top", "right", "bottom", "left"];

  const resetOption = resetValues && Object.keys(resetValues).map((key) => {
    let isReset = false;
    if (Object.keys(values) && resetValues[key] !== values[key]) {
      isReset = false;
    } else {
      isReset = true;
    }
    return isReset
  })
  const isReset = resetValues && resetOption.includes(false) && Object.keys(values)?.length>0;
  const defaultUnits = [
    { label: "px", value: "px" },
    { label: "%", value: "%" },
    { label: "em", value: "em" },
    { label: "rem", value: "rem" },
    { label: "vw", value: "vw" },
    { label: "vh", value: "vh" },
  ];

  const handleChange = (val, dimension) => {
    if (!link) {
      onChange({ top: val, right: val, bottom: val, left: val });
    } else {
      if (sides) {
        dimension === "horizontal" ? onChange({ ...values, right: val, left: val }) : dimension === "vertical" && onChange({ ...values, top: val, bottom: val })
      } else {
        onChange({ ...values, [dimension]: val });
      }
    }
  };

  useEffect(() => {
    onChange(values);
  }, [values])

  return (
    <div style={{ marginBottom: "8px", ...style }} className={className}>
      <style>
        {`


.bplUnitControlWrapper .components-base-control.components-input-control.components-number-control{
  margin-bottom:0px !important;
}
.bplUnitControlWrapper .components-base-control.components-input-control.components-number-control .components-base-control__field .components-input-base .components-input-control__container .components-input-control__input{
  font-size: 13px !important;
  padding-right: 0px !important;
}
.bplUnitControlWrapper .components-base-control.components-input-control.components-number-control .components-base-control__field .components-input-base .components-input-control__container .components-input-control__suffix .components-unit-control__select{
  padding:0px 0px;
  background:#4527a4;
  color:white;
}
.bplUnitControlWrapper .components-base-control.components-input-control.components-number-control .components-base-control__field .components-input-base .components-input-control__container .components-input-control__suffix{
  width:17px !important;
}
.bplPanel-link-button{
  background: transparent;
  border: none;
  padding: 0;
  margin-top: -13px;
  cursor: pointer;
  .dashicons{
    font-size:16px;
  }
}
.bplPanel-link-button .dashicons.dashicons-image-rotate{
  color:#666;
}
.bplPanel-link-button .dashicons.dashicons-image-rotate:hover{
    color:black;
  }
        `}
      </style>
      <div>
        <div style={{ marginBottom: "5px" }}>
          {label && <label>{label}</label>}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: sides
              ? sides.includes("horizontal", "vertical")
                ? "5px"
                : "0px"
              : "0px",
          }}
        >
          {unitSides.map((val, i) => {
            return (
              <div className="bplUnitControlWrapper" key={i}>
                <UnitControl
                  onChange={(v) => handleChange(v, val)} // Pass dimension
                  value={
                    sides
                      ? val === "horizontal"
                        ? values?.right
                        : val === "vertical" && values?.top
                      : values?.[val]
                  }
                  defaultValue={defaultValues || null}
                  units={units || defaultUnits}
                  disableUnits={disableUnits}
                />
                <div style={{ textAlign: "center", marginTop: "-4px" }}>
                  <small style={{ textTransform: "capitalize" }}>{val}</small>
                </div>
              </div>
            );
          })}
          {!sides && (
            <button
              className="bplPanel-link-button"
              onClick={() => setLink(!link)}
            >
              {link ? (
                <span className="dashicons dashicons-admin-links"></span>
              ) : (
                <span className="dashicons dashicons-editor-unlink"></span>
              )}
            </button>
          )}
          {isReset && (
            <button
              onClick={() => onChange(resetValues)}
              className="bplPanel-link-button"
            >
              <span className="dashicons dashicons-image-rotate"></span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};