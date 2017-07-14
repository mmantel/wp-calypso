/**
 * External dependencies
 */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import config from 'config';
import { warningNotice } from 'state/notices/actions';
import { getSelectedSiteId } from 'state/ui/selectors';

import {
	isJetpackSite,
	siteHasMinimumJetpackVersion,
	getSiteAdminUrl,
	getSiteDomain
} from 'state/sites/selectors';

class MinimumJetpackVersionNotice extends Component {

	static propTypes = {
		translate: PropTypes.func.isRequired,
		minimumJetpackVersionFailed: PropTypes.bool.isRequired,
		adminUrl: PropTypes.string,
		domain: PropTypes.string,
	};

	showWarning( { minimumJetpackVersionFailed, domain, adminUrl, triggerNotice, translate, siteId } ) {
		if ( minimumJetpackVersionFailed ) {
			triggerNotice(
				translate(
					'Jetpack %(version)s is required to take full advantage of plugin management in %(site)s.',
					{
						args: {
							version: config( 'jetpack_min_version' ),
							site: domain
						}
					}
				), {
					button: translate( 'Update now' ),
					href: adminUrl,
					id: 'allSitesNotOnMinJetpackVersion' + config( 'jetpack_min_version' ) + '-' + siteId,
					displayOnNextPage: true
				}
			);
		}
	}

	componentWillMount() {
		this.showWarning( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.showWarning( nextProps );
	}

	render() {
		return null;
	}
}

export default connect(
	state => {
		const selectedSiteId = getSelectedSiteId( state );
		return {
			siteId: selectedSiteId,
			adminUrl: getSiteAdminUrl( state, selectedSiteId, 'plugins.php?plugin_status=upgrade' ),
			domain: getSiteDomain( state, selectedSiteId ),
			minimumJetpackVersionFailed: !! isJetpackSite( state, selectedSiteId ) &&
				! siteHasMinimumJetpackVersion( state, selectedSiteId )
		};
	},
	{
		triggerNotice: warningNotice
	}
)( localize( MinimumJetpackVersionNotice ) );
