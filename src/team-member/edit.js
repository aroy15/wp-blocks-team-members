import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';

export default function Edit( { attributes, setAttributes } ) {
	const { name, bio } = attributes;
	const onChangeName = ( newName ) => setAttributes( { name: newName } );
	const onChangeBio = ( newBio ) => setAttributes( { bio: newBio } );

	return (
		<div { ...useBlockProps() }>
			<RichText
				tagName="h4"
				placeholder={ __( 'Member Name', metadata.textdomain ) }
				value={ name }
				onChange={ onChangeName }
				allowedFormats={ [] }
			/>
			<RichText
				tagName="p"
				placeholder={ __( 'Member Bio', metadata.textdomain ) }
				value={ bio }
				onChange={ onChangeBio }
				allowedFormats={ [] }
			/>
		</div>
	);
}
