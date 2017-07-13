import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import config from 'config';
import { getSelectedSiteId } from 'state/ui/selectors';

import {
	isJetpackSite,
	siteHasMinimumJetpackVersion,
	getSiteAdminUrl,
} from 'state/sites/selectors';
import { warningNotice } from 'state/notices/actions';

class MinimumJetpackVersion extends Component {

	static propTypes = {
		translate: PropTypes.func.isRequired,
		minimumJetpackVersionFailed: PropTypes.bool.isRequired,
		adminUrl: PropTypes.string,
	};

	showWarning() {
		const { minimumJetpackVersionFailed, adminUrl, translate } = this.props;
		if ( minimumJetpackVersionFailed ) {
			this.props.warningNotice(
				translate( 'Jetpack %(version)s is required to take full advantage of all post editing features.', {
					args: { version: config( 'jetpack_min_version' ) }
				} ),
				{
					button: translate( 'Update now' ),
					href: adminUrl,
					displayOnNextPage: true
				}
			);
		}
	}

	componentDidMount() {
		this.showWarning();
	}

	componentDidUpdate( ) {
		this.showWarning();
	}

	render() {
		return null;
	}
}

export default connect(
	state => {
		const selectedSiteId = getSelectedSiteId( state );
		return {
			adminUrl: getSiteAdminUrl( state, selectedSiteId, 'plugins.php?plugin_status=upgrade' ),
			minimumJetpackVersionFailed: !! isJetpackSite( state, selectedSiteId ) &&
				! siteHasMinimumJetpackVersion( state, selectedSiteId ),
			siteId: selectedSiteId,
		};
	},
	{
		warningNotice,
	},
)( localize( MinimumJetpackVersion ) );
