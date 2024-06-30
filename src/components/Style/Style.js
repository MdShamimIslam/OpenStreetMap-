import React from 'react';
import { getBorderCSS, getColorsCSS, getTypoCSS } from '../../../../Components/utils/getCSS';
import { getBoxCss } from '../../utils/functions';

const Style = ({ attributes }) => {
  const { osmInfo, cId } = attributes;
  const { border,padding } = osmInfo;
  const { width, height, mapBorder} = osmInfo.map;
  const { input, srcBtn, location } = osmInfo.mapSearch;
  const { srcPadding, srcColors, srcHoverColors, srcText, srcRadius } = srcBtn;
  const { colors, hoverColor, locRadius, locTypo } = location;
  const mainWrapper = `#osmHelloBlock-${cId}`;
  const mapWrapper = `${mainWrapper} .maps`;
  const searchWrapper = `${mainWrapper} .search`;
  const locationWrapper = `${mainWrapper} .location`;

  return (
    <style>

      {`
        ${getTypoCSS('', srcText.typo)?.googleFontLink}
        ${getTypoCSS('', locTypo)?.googleFontLink}

        ${mainWrapper}{
          ${getBorderCSS(border)};
          display: flex;
          flex-direction: row;
          gap: 13px;
          width: ${osmInfo.width.desktop};
          height: ${osmInfo.height.desktop};
          ${getBoxCss(padding.desktop, "padding")};
          justify-content:center;
          
        } 
       
        ${mapWrapper} .mapContainer{
          ${getBorderCSS(mapBorder)};
          width: ${width.desktop};
          height: ${height.desktop};
        }

        ${searchWrapper}{
          width: ${osmInfo.mapSearch.width.desktop};
        }
        ${searchWrapper} .searchTxt input{
          width: ${input.width.desktop};
          height: ${input.height.desktop};
          box-sizing: border-box;
          ${getBoxCss(input.padding.desktop, "padding")}
          border-radius:${input.radius}px;
        }

        ${getTypoCSS(`${searchWrapper} .searchBtn button`, srcText.typo)?.styles}
        ${searchWrapper} .searchBtn button{
          ${getColorsCSS(srcColors)};
          ${getBoxCss(srcPadding.desktop, "padding")};
          border-radius:${srcRadius}px;
          border:none;
          cursor: pointer;
        }
        ${searchWrapper} .searchBtn button:hover{
          ${getColorsCSS(srcHoverColors)};
        }

        ${getTypoCSS(`${locationWrapper}`, locTypo)?.styles}
        ${locationWrapper}{
          ${getColorsCSS(colors)};
          margin-top:10px;
          border-radius:${locRadius}px;
        }
        ${locationWrapper} .placeDisName:hover{
          color:${hoverColor};
        }
      
      `}
      
    </style>
  );
};

export default Style;