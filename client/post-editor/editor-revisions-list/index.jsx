/**
 * External dependencies
 */
import { map } from 'lodash';
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import EditorRevisionsListHeader from './header';
import EditorRevisionsListItem from './item';
import QueryPostRevisions from 'components/data/query-post-revisions';
import QueryUsers from 'components/data/query-users';
import { getEditedPostValue } from 'state/posts/selectors';
import getPostRevision from 'state/selectors/get-post-revision';
import getPostRevisions from 'state/selectors/get-post-revisions';
import getPostRevisionsAuthorsId from 'state/selectors/get-post-revisions-authors-id';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getEditorPostId } from 'state/ui/editor/selectors';
import viewport from 'lib/viewport';

class EditorRevisionsList extends PureComponent {
	static propTypes = {
		authorsId: PropTypes.array.isRequired,
		loadRevision: PropTypes.func.isRequired,
		postId: PropTypes.number,
		revisions: PropTypes.array.isRequired,
		selectedRevision: PropTypes.object,
		selectedRevisionId: PropTypes.number,
		selectRevision: PropTypes.func.isRequired,
		siteId: PropTypes.number,
		type: PropTypes.string,
	}

	loadRevision = () => {
		this.props.loadRevision( this.props.selectedRevision );
	}

	trySelectingRevision() {
		if (
			this.props.selectedRevisionId === null &&
			this.props.revisions.length > 0 &&
			viewport.isWithinBreakpoint( '>660px' )
		) {
			this.props.selectRevision( this.props.revisions[ 0 ].id );
		}
	}

	componentWillMount() {
		this.trySelectingRevision();
	}

	componentDidMount() {
		// Make sure that scroll position in the editor is not preserved.
		window.scrollTo( 0, 0 );
	}

	componentDidUpdate() {
		this.trySelectingRevision();
	}

	render() {
		return (
			<div>
				<QueryPostRevisions
					postId={ this.props.postId }
					postType={ this.props.type }
					siteId={ this.props.siteId }
				/>
				<QueryUsers
					siteId={ this.props.siteId }
					usersId={ this.props.authorsId }
				/>
				<EditorRevisionsListHeader
					loadRevision={ this.loadRevision }
					selectedRevisionId={ this.props.selectedRevisionId }
				/>
				<ul className="editor-revisions-list__list">
					{ map( this.props.revisions, revision => {
						const itemClasses = classNames(
							'editor-revisions-list__revision',
							{ 'is-selected': revision.id === this.props.selectedRevisionId }
						);
						return (
							<li className={ itemClasses } key={ revision.id }>
								<EditorRevisionsListItem
									revision={ revision }
									selectRevision={ this.props.selectRevision }
								/>
							</li>
						);
					} ) }
				</ul>
			</div>
		);
	}
}

export default connect(
	( state, ownProps ) => {
		const siteId = getSelectedSiteId( state );
		const postId = getEditorPostId( state );
		const type = getEditedPostValue( state, siteId, postId, 'type' );
		return {
			authorsId: getPostRevisionsAuthorsId( state, siteId, postId ),
			postId,
			revisions: getPostRevisions( state, siteId, postId, 'display' ),
			selectedRevision: getPostRevision(
				state, siteId, postId, ownProps.selectedRevisionId, 'editing'
			),
			siteId,
			type,
		};
	},
)( EditorRevisionsList );
