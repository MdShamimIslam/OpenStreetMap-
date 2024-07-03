import React from 'react';
import { getBorderCSS} from '../../../../Components/utils/getCSS';

const Style = ({ attributes }) => {
  const { cId, layout, style } = attributes;
  const { width, height } = layout.mapColumns;
  const { border } = style;
  const mainWrapper = `#osmHelloBlock-${cId}`;
  const mapWrapper = `${mainWrapper} .maps .mapContainer`;

  return (
    <style>

      {`
        
        ${mapWrapper}{
          ${getBorderCSS(border)};
          width: ${width.desktop};
          height: ${height.desktop};
        }

        @media only screen and (min-width:641px) and (max-width: 1024px){
         ${mapWrapper}{
          width: ${width.tablet};
          height: ${height.tablet};
        }
        }

        @media only screen and (max-width:640px){
         ${mapWrapper}{
          width: ${width.mobile};
          height: ${height.mobile};
        }
        }

      `}
      
    </style>
  );
};

export default Style;