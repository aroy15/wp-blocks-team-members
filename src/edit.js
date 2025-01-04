import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	return (
		<div { ...useBlockProps() }>
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
	);
}
