import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';

registerBlockType( 'block-course/team-member', {
	title: __( 'Team Member', metadata.textdomain ),
	description: __( 'A block to display a team member.', metadata.textdomain ),
	icon: 'admin-users',
	parent: [ 'block-course/team-members-block' ],
	edit: () => <p>Edit</p>,
	save: () => <p>Save</p>,
} )