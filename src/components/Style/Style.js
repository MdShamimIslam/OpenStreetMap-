import React from 'react';
import { getBorderCSS,getColorsCSS, getTypoCSS} from '../../../../Components/utils/getCSS';

const Style = ({ attributes }) => {
  const { cId, layout, style } = attributes;
  const { width, height } = layout.mapColumns;
  const { tooltipColors,border,tooltipTypo,tipColor } = style;
  const mainWrapper = `#osmHelloBlock-${cId}`;
  const mapWrapper = `${mainWrapper} .maps .mapContainer`;
  const leafletWrapper = `${mainWrapper} .leaflet-popup-content-wrapper`;
  const caret = `${mainWrapper} .leaflet-popup-tip-container .leaflet-popup-tip`;
  return (
    <style>

      {`
        ${getTypoCSS('', tooltipTypo)?.googleFontLink}
        ${mapWrapper}{
          ${getBorderCSS(border)};
          width: ${width.desktop};
          height: ${height.desktop};
        }

        ${getTypoCSS(`${leafletWrapper}`, tooltipTypo)?.styles}
        ${leafletWrapper}{
        ${getColorsCSS(tooltipColors)};
        font-size : ${tooltipTypo.desktop};
        }

        ${caret}{
          background : ${tipColor}
        }
       

        @media only screen and (min-width:641px) and (max-width: 1024px){
         ${mapWrapper}{
          width: ${width.tablet};
          height: ${height.tablet};
        }

        ${getTypoCSS(`${leafletWrapper}`, tooltipTypo)?.styles}
          ${leafletWrapper}{
          ${getColorsCSS(tooltipColors)};
          font-size : ${tooltipTypo.tablet};
        }
        }

        @media only screen and (max-width:640px){
         ${mapWrapper}{
          width: ${width.mobile};
          height: ${height.mobile};
        }

        ${getTypoCSS(`${leafletWrapper}`, tooltipTypo)?.styles}
          ${leafletWrapper}{
          ${getColorsCSS(tooltipColors)};
          font-size : ${tooltipTypo.mobile};
        }
        }

      `}
      
    </style>
  );
};

export default Style;