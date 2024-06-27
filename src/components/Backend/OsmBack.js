import React from 'react';
import Style from '../Style/Style';
import Maps from './Maps';
import Search from './Search';

const OsmBack = ({ attributes }) => {
  const { cId } = attributes;
  return (
    <>
      <Style attributes={attributes}></Style>
      <div id={`osmHelloBlock-${cId}`} className='mainOsm'>
        <div className='maps'>
            <Maps></Maps>
        </div>
        <div className='search'>
            <Search></Search>
        </div>
      </div>
    </>
  );
};

export default OsmBack;


{/* <div className="map">
          <iframe
            frameBorder="0"
            height={osmInfo.height[device]}
            marginHeight="0"
            marginWidth="0"
            scrolling="no"
            src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&t=&z=14&ie=UTF8&iwloc=B&output=embed"
            width={osmInfo.width[device]}
          >
            {`<a href="https://www.gps.ie/">gps systems</a>`}
          </iframe>
   </div> */}