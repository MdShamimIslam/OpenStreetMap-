import React from 'react';
import { getBorderCSS} from '../../../../Components/utils/getCSS';

const Style = ({ attributes }) => {
  const { cId, layout, style } = attributes;
  const { width, height } = layout.columns;
  const { border } = style;
  const mainWrapper = `#osmHelloBlock-${cId}`;
  const mapWrapper = `${mainWrapper} .maps .mapContainer`;

  return (
    <style>

      {`

        ${mainWrapper}{
          width:800px;
          height:600px;
        }
        ${mapWrapper}{
          ${getBorderCSS(border)};
          width: ${width.desktop};
          height: ${height.desktop};
        }

      `}
      
    </style>
  );
};

export default Style;