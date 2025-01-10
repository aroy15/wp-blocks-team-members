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
		id: {
			type: 'number',
		},
		alt: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'alt',
			default: '',
		},
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
		socialLinks: {
			type: 'array',
			default: [
				{
					link: 'https://facebook.com',
					icon: 'facebook',
				},
				{
					link: 'https://instagram.com',
					icon: 'instagram',
				},
			],
			source: 'query',
			selector: '.wp-block-block-course-team-member-social-links ul li',
			query: {
				icon: {
					source: 'attribute',
					attribute: 'data-icon',
				},
				link: {
					selector: 'a',
					source: 'attribute',
					attribute: 'href',
				},
			},
		},
	},
	edit: Edit,
	save: Save,
} );
