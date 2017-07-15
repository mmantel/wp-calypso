/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import analytics from 'lib/analytics';
import Button from 'components/button';
import DisconnectJetpackButton from 'my-sites/plugins/disconnect-jetpack/disconnect-jetpack-button';
import { getJetpackSiteRemoteManagementUrl } from 'state/sites/selectors';

const PluginSiteDisabledManage = ( { isNetwork, site, remoteManagementUrl, plugin, translate } ) => {
	const url = remoteManagementUrl + '&section=plugins';
	const message = isNetwork
		? translate( 'Network management disabled' )
		: translate( 'Management disabled' );
	const onClickEnableManageButton = () => {
		analytics.ga.recordEvent( 'Jetpack Manage', 'Clicked Enable Jetpack Manage Link' );
	};

	if ( plugin.slug === 'jetpack' ) {
		return (
			<span className="plugin-site-disabled-manage">
				<span className="plugin-site-disabled-manage__label">{ message }</span>
				<DisconnectJetpackButton disabled={ ! plugin } site={ site } redirect="/plugins/jetpack" />
			</span>
		);
	}

	return (
		<span className="plugin-site-disabled-manage">
			<span className="plugin-site-disabled-manage__label">{ message }</span>
			<Button
				compact={ true }
				className="plugin-site-disabled-manage__link"
				href={ url }
				onClick={ onClickEnableManageButton }
			>
				{ translate( 'Enable' ) }
			</Button>
		</span>
	);
};

export default connect(
	( state, ownProps ) => ( {
		remoteManagementUrl: getJetpackSiteRemoteManagementUrl( state, ownProps.site.ID )
	} )
)( localize( PluginSiteDisabledManage ) );
