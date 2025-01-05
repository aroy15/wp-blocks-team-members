import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { name, bio, url, alt } = attributes;
	return (
		<div { ...useBlockProps.save() }>
			{ url && <img src={ url } alt={ alt } /> }
			<RichText.Content tagName="h4" value={ name } />
			<RichText.Content tagName="p" value={ bio } />
		</div>
	);
}
