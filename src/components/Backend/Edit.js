import { useEffect } from 'react';
import { InspectorControls } from "@wordpress/block-editor";
import { TabPanel } from "@wordpress/components";
import ContentSettings from '../Settings/ContentSettings/ContentSettings';
import StylesSettings from '../Settings/StylesSettings/StylesSettings';
import OsmBack from './OsmBack';
import { withSelect } from '@wordpress/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;
	
	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]);
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
							{tab.name === 'tab1' && <ContentSettings attributes={attributes} setAttributes={setAttributes} device={device} />}
							{tab.name === 'tab2' && <StylesSettings attributes={attributes} setAttributes={setAttributes} />}
						</>
					)}
				</TabPanel>
			</InspectorControls>
			<OsmBack attributes={attributes} setAttributes={setAttributes} device={device} />
		</>
	)

	
};
export default withSelect((select) => {
	return {
		device: select('core/edit-post').__experimentalGetPreviewDeviceType()?.toLowerCase()
	}
})(Edit);