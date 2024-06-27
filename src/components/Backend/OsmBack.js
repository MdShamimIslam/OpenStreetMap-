import React,{useState} from 'react';
import Style from '../Style/Style';
import Maps from './Maps';
import Search from './Search';

const OsmBack = ({ attributes }) => {
  const { cId } = attributes;
  const [selectPosition, setSelectPosition] = useState(null);
 
  return (
    <>
      <Style attributes={attributes}></Style>
      <div id={`osmHelloBlock-${cId}`} className='mainOsm'>
        <div className='maps'>
          <Maps selectPosition={selectPosition}></Maps>
        </div>
        <div className='search'>
            <Search setSelectPosition={setSelectPosition}></Search>
        </div>
      </div>
    </>
  );
};

export default OsmBack;
