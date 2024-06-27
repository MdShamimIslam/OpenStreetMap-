import { registerBlockType } from '@wordpress/blocks';
import metadata from '../inc/block.json';
import Edit from './components/Backend/Edit';
import './editor.scss';
import { blockIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: blockIcon,

	// Build in Functions
	edit:Edit,

	save: () =>null,
});
