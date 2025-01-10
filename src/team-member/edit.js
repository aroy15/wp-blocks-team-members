import { useEffect, useState, useRef } from '@wordpress/element';
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
import { usePrevious } from '@wordpress/compose';
import {
	Spinner,
	withNotices,
	ToolbarButton,
	PanelBody,
	TextareaControl,
	SelectControl,
	Icon,
	Tooltip,
	Button,
	TextControl,
} from '@wordpress/components';

function Edit( props ) {
	const {
		attributes,
		setAttributes,
		noticeOperations,
		noticeUI,
		isSelected,
	} = props;
	const { name, bio, url, alt, id, socialLinks } = attributes;
	const [ blobURL, setBlobURL ] = useState();
	const [ selectedLink, setSelectedLink ] = useState();

	const prevURL = usePrevious( url );
	const prevIsSelected = usePrevious( isSelected );

	const titleRef = useRef();

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

	const addNewSocialItem = () => {
		setAttributes( {
			socialLinks: [ ...socialLinks, { icon: 'wordpress', link: '' } ],
		} );

		// Here last item's length will be counted in next render. Imagine currently we have 2 items in the array by default and we are adding another one. So, length will be 2 not 3 becuase just currently added item will be availbe in next render respectively.
		setSelectedLink( socialLinks.length );
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

	// prevURL dependancy is applied to prevent focusing on the title after replaceing or removing the image. So the tittle will be focused only after uploading/inserting the image.
	useEffect( () => {
		if ( url && ! prevURL ) {
			titleRef.current.focus();
		}
	}, [ url, prevURL ] );

	useEffect( () => {
		if ( prevIsSelected && ! isSelected ) {
			setSelectedLink();
		}
	}, [ isSelected, prevIsSelected ] );

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
					ref={ titleRef }
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
				<div className="wp-block-block-course-team-member-social-links">
					<ul>
						{ socialLinks.map( ( item, index ) => (
							<li
								key={ index }
								className={
									selectedLink === index
										? 'is-selected'
										: null
								}
							>
								<button
									aria-label={ __(
										'Edit Social Link',
										metadata.textdomain
									) }
									onClick={ () => setSelectedLink( index ) }
								>
									<Icon icon={ item.icon } />
								</button>
							</li>
						) ) }

						{ isSelected && (
							<li className="wp-block-block-course-team-member-add-icon-li">
								<Tooltip
									text={ __(
										'Add Social Link',
										metadata.textdomain
									) }
								>
									<button
										aria-label={ __(
											'Add Social Link',
											metadata.textdomain
										) }
										onClick={ addNewSocialItem }
									>
										<Icon icon="plus" />
									</button>
								</Tooltip>
							</li>
						) }
					</ul>

					{ /* Here if "selectedLink !== undefined &&" applied becuase the first icon index will be zero that make the condition false for the first icon. Means if we set just "selectedLink &&", the form will not show for the first selcted icon.   */ }
					{ selectedLink !== undefined && (
						<div className="wp-block-block-course-team-member-link-form">
							<TextControl
								label={ __( 'Icon', metadata.textdomain ) }
							/>
							<TextControl
								label={ __( 'URL', metadata.textdomain ) }
							/>
							<Button isDestructive>
								{ __( 'Remove Link', metadata.textdomain ) }
							</Button>
						</div>
					) }
				</div>
			</div>
		</>
	);
}

export default withNotices( Edit );
