import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';
import Edit from './edit';
import Save from './save';

registerBlockType( 'block-course/team-member', {
	title: __( 'Team Member', metadata.textdomain ),
	description: __( 'A block to display a team member.', metadata.textdomain ),
	icon: 'admin-users',
	parent: [ 'block-course/team-members-block' ],
	supports: {
		html: false,
		reusable: false,
	},
	attributes: {
		name: {
			type: 'string',
			source: 'html',
			selector: 'h4',
		},
		bio: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
		image: {
			type: 'string',
			default: '',
		},
	},
	edit: Edit,
	save: Save,
} );
