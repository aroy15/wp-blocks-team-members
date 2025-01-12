import { useSortable } from '@dnd-kit/sortable';
// eslint-disable-next-line
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';

export default function SortableItem( props ) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable( { id: props.id } );
	const style = {
		transform: CSS.Transform.toString( transform ),
		transition,
	};
	return (
		<li
			ref={ setNodeRef }
			style={ style }
			{ ...attributes }
			{ ...listeners }
			className={
				props.selectedLink === props.index ? 'is-selected' : null
			}
		>
			<button
				aria-label={ __( 'Edit Social Link', metadata.textdomain ) }
				onClick={ () => props.setSelectedLink( props.index ) }
			>
				<Icon icon={ props.icon } />
			</button>
		</li>
	);
}
