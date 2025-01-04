import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl } from '@wordpress/components';
import metadata from './block.json';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { columns } = attributes;
	const onChangeColumns = ( newColumns ) =>
		setAttributes( { columns: newColumns } );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Members Settings', metadata.textdomain ) }
				>
					<RangeControl
						label={ __( 'Number of Columns', metadata.textdomain ) }
						value={ columns }
						onChange={ onChangeColumns }
						min={ 1 }
						max={ 6 }
					/>
				</PanelBody>
			</InspectorControls>
			<div
				{ ...useBlockProps( {
					className: `has-${ columns }-columns`,
				} ) }
			>
				<InnerBlocks
					allowedBlocks={ [ 'block-course/team-member' ] }
					template={ [
						[ 'block-course/team-member' ], // can be passed default value as well like { name: 'John Doe', bio: 'Lorem ipsum' } as second argument of the each block
						[ 'block-course/team-member' ],
						[ 'block-course/team-member' ],
					] }
					//templateLock="all" // using "all" can't add, remove and sorting blocks and using "insert" can't add and remove blocks just sorting is allowed
				/>
			</div>
		</>
	);
}
