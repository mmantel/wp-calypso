/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import page from 'page';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import HeaderCake from 'components/header-cake';
import Upload from 'my-sites/themes/theme-upload';
import { uploadPlugin } from 'state/plugins/upload/actions';

class PluginUpload extends React.Component {
	back = () => {
		page.back();
	}

	render() {
		const { translate } = this.props;

		return (
			<Main>
				<HeaderCake onClick={ this.back }>{ translate( 'Upload plugin' ) }</HeaderCake>
				<Upload upload={ this.props.uploadPlugin } />
			</Main>
		);
	}
}

export default connect(
	null,
	{ uploadPlugin }
)( localize( PluginUpload ) );

