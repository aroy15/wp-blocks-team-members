import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';

export default function Save( { attributes } ) {
	const { name, bio, url, alt, id, socialLinks } = attributes;

	return (
		<div { ...useBlockProps.save() }>
			{ url && (
				<img src={ url } alt={ alt } className={ `wp-image-${ id }` } />
			) }
			{ name && <RichText.Content tagName="h4" value={ name } /> }
			{ bio && <RichText.Content tagName="p" value={ bio } /> }
			{ socialLinks.length > 0 && (
				<div className="wp-block-block-course-team-member-social-links">
					<ul>
						{ socialLinks.map( ( item, index ) => (
							<li key={ index } data-icon={ item.icon }>
								<a
									href={ item.link }
									target="_blank"
									rel="noreferrer"
								>
									<Icon icon={ item.icon } />
								</a>
							</li>
						) ) }
					</ul>
				</div>
			) }
		</div>
	);
}
