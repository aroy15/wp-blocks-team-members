import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import {
	Spinner,
	withNotices,
	ToolbarButton,
	PanelBody,
	TextareaControl,
	SelectControl,
} from '@wordpress/components';

function Edit( { attributes, setAttributes, noticeOperations, noticeUI } ) {
	const { name, bio, url, alt, id } = attributes;
	const [ blobURL, setBlobURL ] = useState();
	const imageObject = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return id ? getMedia( id ) : null; //returning an object.
		},
		[ id ]
	);
	const imageSizes = useSelect( ( select ) => {
		return select( blockEditorStore ).getSettings().imageSizes; //returning an array. also can apply select( 'core/block-editor' );
	}, [] );

	const getImageSizeOptions = () => {
		if ( ! imageObject ) {
			return [];
		}
		const options = [];
		const sizes = imageObject.media_details.sizes;
		for ( const key in sizes ) {
			const size = sizes[ key ];
			const imageSize = imageSizes?.find( ( s ) => s.slug === key );
			if ( imageSize ) {
				options.push( {
					label: imageSize?.name,
					value: size.source_url,
				} );
			}
		}
		return options;
	};

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

	const onChangeImageAlt = ( newAlt ) => {
		setAttributes( { alt: newAlt } );
	};

	const onGetBackMainAltText = () =>
		setAttributes( { alt: imageObject?.alt_text } );

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices(); // it will remove all prevoius notices except current one.
		noticeOperations.createErrorNotice( message );
	};

	const removeImage = () => {
		setAttributes( {
			id: undefined,
			url: undefined,
			alt: '',
		} );
	};

	const onChangeImageSize = ( newSizeURL ) => {
		setAttributes( { url: newSizeURL } );
	};

	// When page load it will check any url is Blob. if yes then it will remove that
	useEffect( () => {
		if ( ! id && isBlobURL( url ) ) {
			setAttributes( {
				url: undefined,
				alt: '',
			} );
		}
	}, [] );

	// If images are uploaded successfuly then browser still save the blob url which is removing using this pice of code.
	useEffect( () => {
		if ( isBlobURL( url ) ) {
			setBlobURL( url );
		} else {
			revokeBlobURL( blobURL );
			setBlobURL();
		}
	}, [ url ] );

	return (
		<>
			{ url && (
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={ __( 'Replace Image', metadata.textdomain ) }
						onSelect={ onSelectImage }
						onSelectURL={ onSelectURL }
						onError={ onUploadError }
						accept="image/*"
						allowedTypes={ [ 'image' ] }
						mediaId={ id }
						mediaURL={ url }
					/>
					<ToolbarButton onClick={ removeImage }>
						{ __( 'Remove Image', metadata.textdomain ) }
					</ToolbarButton>
				</BlockControls>
			) }

			<InspectorControls>
				<PanelBody
					title={ __( 'Image Settings', metadata.textdomain ) }
				>
					{ id && (
						<SelectControl
							__nextHasNoMarginBottom
							label={ __( 'Image Size', metadata.textdomain ) }
							options={ getImageSizeOptions() }
							value={ url }
							onChange={ onChangeImageSize }
						/>
					) }
					{ url && ! isBlobURL( url ) && (
						<>
							<button
								className="block-course-setting-btn"
								onClick={ onGetBackMainAltText }
								disabled={
									! imageObject?.alt_text ? true : false
								}
								title={
									! imageObject?.alt_text
										? __(
												'Main alt text not found',
												metadata.textdomain
										  )
										: ''
								}
							>
								Get Back Main Alt Text
							</button>
							<TextareaControl
								__nextHasNoMarginBottom
								label={ __( 'Image Alt', metadata.textdomain ) }
								value={ alt }
								onChange={ onChangeImageAlt }
								help={ __(
									"Alternative text describes your image to people can't see Item. Add a short description with its key details.",
									metadata.textdomain
								) }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>

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
					accept="image/*"
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
		</>
	);
}

export default withNotices( Edit );
