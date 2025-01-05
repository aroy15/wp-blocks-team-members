import {
	useBlockProps,
	useInnerBlocksProps,
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

	const blockProps = useBlockProps( {
		className: `has-${ columns }-columns`,
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'block-course/team-member' ],
		orientation: 'horizontal',
		template: [
			[ 'block-course/team-member' ],
			[ 'block-course/team-member' ],
			[ 'block-course/team-member' ],
		],
	} );

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
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
