/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import EmptyContent from 'components/empty-content';
import DocumentHead from 'components/data/document-head';
import SidebarNavigation from 'my-sites/sidebar-navigation';

function NoPermissionsError( { translate } ) {
	return (
			<Main>
				<DocumentHead title={ translate( 'Plugins' ) } />
				<SidebarNavigation />
				<EmptyContent
					title={ translate( 'Oops! You don\'t have permission to manage plugins.' ) }
					line= { translate( 'If you think you should, contact this site\'s administrator.' ) }
					illustration="/calypso/images/illustrations/illustration-500.svg" />
			</Main>
	);
}

NoPermissionsError.propTypes = {
	translate: PropTypes.func.isRequired
};

export default localize( NoPermissionsError );
