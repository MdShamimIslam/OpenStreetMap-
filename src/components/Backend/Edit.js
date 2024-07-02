import { InspectorControls } from "@wordpress/block-editor";
import { TabPanel } from "@wordpress/components";
import { withSelect } from '@wordpress/data';
import { useEffect, useState } from 'react';
import ContentSettings from '../Settings/ContentSettings/ContentSettings';
import StylesSettings from '../Settings/StylesSettings/StylesSettings';
import OsmBack from './OsmBack';

const NOM_URL = "https://nominatim.openstreetmap.org/search?";

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;
	const [searchText, setSearchText] = useState('');
	const [listPlace, setListPlace] = useState([]);
	const [mapView, setMapView] = useState('default');
	const [selectPosition, setSelectPosition] = useState(null);

	// Handle Search
	const handleSearch = (query) => {
		const params = {
			q: query,
			format: 'json',
			addressDetails: 1,
			polygon_geojson: 0
		}
		const queryString = new URLSearchParams(params).toString();
		const requestOptions = {
			method: "GET",
			redirect: "follow"
		};
		fetch(`${NOM_URL}${queryString}`, requestOptions)
			.then(res => res.text())
			.then(result => {
				const arrayResult = JSON.parse(result);
				const searchLocation = arrayResult[0];
				setSelectPosition(searchLocation);
				setListPlace(JSON.parse(result));
			})
			.catch(error => console.log("Error is :", error));
	}
	// Update handleSearch call on input change
	const handleInputChange = (event) => {
		setSearchText(event.target.value);
		handleSearch(event.target.value);
		
	}

	useEffect(() => {
		clientId && setAttributes({ cId: clientId.substring(0, 10) });
	}, [clientId]);

	return (

		<>
			<InspectorControls >
				<TabPanel
					className="my-tab-panel"
					activeClass="active-tab"
					tabs={[
						{
							name: 'tab1',
							title: 'General',
						},
						{
							name: 'tab2',
							title: 'Styles',
						},
					]}>
					{(tab) => (
						<>
							{tab.name === 'tab1' && <ContentSettings
								attributes={attributes} setAttributes={setAttributes}
								mapView={mapView} setMapView={setMapView}
								searchText={searchText} setSearchText={setSearchText}
								listPlace={listPlace} setListPlace={setListPlace}
								selectPosition={selectPosition} setSelectPosition={setSelectPosition}
								handleSearch={handleSearch}
								handleInputChange={handleInputChange}
								device={device} />}
							{tab.name === 'tab2' && <StylesSettings attributes={attributes} setAttributes={setAttributes} device={device}  />}
						</>
					)}
				</TabPanel>
			</InspectorControls>
			<OsmBack
				attributes={attributes} setAttributes={setAttributes}
				mapView={mapView} setMapView={setMapView}
				searchText={searchText} setSearchText={setSearchText}
				listPlace={listPlace} setListPlace={setListPlace}
				selectPosition={selectPosition} setSelectPosition={setSelectPosition}
				handleSearch={handleSearch}
				handleInputChange={handleInputChange}
				device={device} />
		</>
	)

	
};
export default withSelect((select) => {
	return {
		device: select('core/edit-post').__experimentalGetPreviewDeviceType()?.toLowerCase()
	}
})(Edit);