import { createRoot } from 'react-dom/client';
import {useState } from 'react';
import './style.scss';
import OsmFront from './FrontEnd/OsmFront';
// Block Name
function FrontEnd({ attributes, setAttributes }) {
  const [mapView, setMapView] = useState('default');
  return (
    <>
      <OsmFront mapView={mapView} setMapView={setMapView} attributes={attributes} setAttributes={setAttributes}></OsmFront>
    </>
  );
}

const container = document.querySelectorAll('.wp-block-osm-hello');
container?.forEach(ele => {
  const attributes = JSON.parse(ele.dataset.attributes);
  const root = createRoot(ele);
  ele.removeAttribute("data-attributes");
  root.render(<FrontEnd attributes={attributes} />);
})