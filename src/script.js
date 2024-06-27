import { createRoot } from 'react-dom/client';
import './style.scss';
import OsmFront from './FrontEnd/OsmFront';
// Block Name
function FrontEnd({ attributes }) {
  return (
    <>
     <OsmFront attributes={attributes}></OsmFront>
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