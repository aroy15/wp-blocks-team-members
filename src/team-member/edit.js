import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';
import { isBlobURL } from '@wordpress/blob';
import { Spinner, withNotices } from '@wordpress/components';

function Edit( { attributes, setAttributes, noticeOperations, noticeUI } ) {
	const { name, bio, url, alt } = attributes;
	const onChangeName = ( newName ) => setAttributes( { name: newName } );
	const onChangeBio = ( newBio ) => setAttributes( { bio: newBio } );

	const onSelectImage = ( image ) => {
		if ( ! image || ! image.url ) {
			setAttributes( {
				url: undefined,
				id: undefined,
				alt: '',
			} );
			return;
		}
		setAttributes( {
			url: image?.url,
			id: image?.id,
			alt: image?.alt,
		} );
	};

	const onSelectURL = ( newURL ) => {
		setAttributes( {
			url: newURL,
			id: undefined,
			alt: '',
		} );
	};

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices(); // it will remove all prevoius notices except current one.
		noticeOperations.createErrorNotice( message );
	};

	return (
		<div { ...useBlockProps() }>
			{ url && (
				<div
					className={ `wp-block-blocks-course-team-member-img${
						isBlobURL( url ) ? ' is-loading' : ''
					}` }
				>
					<img src={ url } alt={ alt } />
					{ isBlobURL( url ) && <Spinner /> }
				</div>
			) }
			<MediaPlaceholder
				icon="admin-users"
				onSelect={ onSelectImage }
				onSelectURL={ onSelectURL }
				onError={ onUploadError }
				// accept="image/*"
				allowedTypes={ [ 'image' ] }
				disableMediaButtons={ url }
				notices={ noticeUI }
			/>
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

export default withNotices( Edit );
