import { createBlock, registerBlockType } from '@wordpress/blocks';
import './team-member';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( 'block-course/team-members-block', {
	edit: Edit,
	save,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( { images = [], columns } ) => {
					const innerBlocks = images.map( ( { url, id, alt } ) => {
						return createBlock( 'block-course/team-member', {
							alt,
							id,
							url,
						} );
					} );
					return createBlock(
						metadata.name,
						{
							columns: columns || 2,
						},
						innerBlocks
					);
				},
			},
			{
				type: 'block',
				blocks: [ 'core/image' ],
				isMultiBlock: true,
				transform: ( attributes ) => {
					const innerBlocks = attributes.map(
						( { url, id, alt } ) => {
							return createBlock( 'block-course/team-member', {
								alt,
								id,
								url,
							} );
						}
					);
					return createBlock(
						metadata.name,
						{
							columns:
								attributes.length > 3 ? 3 : attributes.length,
						},
						innerBlocks
					);
				},
			},
		],
	},
} );
