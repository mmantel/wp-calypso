/**
 * External dependencies
 */
import React from 'react';
import page from 'page';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import FormButton from 'components/forms/form-button';
import FormFooter from 'my-sites/domains/domain-management/components/form-footer';
import FormTextInputWithAffixes from 'components/forms/form-text-input-with-affixes';
import Card from 'components/card/compact';
import { cartItems } from 'lib/cart-values';
import notices from 'notices';
import { canRedirect } from 'lib/domains';
import DomainProductPrice from 'components/domains/domain-product-price';
import upgradesActions from 'lib/upgrades/actions';
import { recordGoogleEvent } from 'state/analytics/actions';

class SiteRedirectStep extends React.Component {
	static propTypes = {
		cart: React.PropTypes.object.isRequired,
		products: React.PropTypes.object.isRequired,
		selectedSite: React.PropTypes.object.isRequired
	};

	state = {
		searchQuery: ''
	};

	render() {
		const { translate } = this.props;
		const price = this.props.products.offsite_redirect ? this.props.products.offsite_redirect.cost_display : null;

		return (
			<div>
				<div className="domain-search__site-redirect-step">
					<Card>
						<form onSubmit={ this.handleFormSubmit }>

							<div className="domain-search__site-redirect-step-description">
								<p>
									{ translate( 'Redirect {{strong}}%(domain)s{{/strong}} to this domain', {
										components: { strong: <strong /> },
										args: { domain: this.props.selectedSite.slug }
									} ) }
								</p>
							</div>

							<DomainProductPrice
								price={ price }
								requiresPlan={ false } />

							<fieldset>
								<FormTextInputWithAffixes
									type="text"
									value={ this.state.searchQuery }
									prefix="http://"
									placeholder={ translate( 'Enter a domain', { textOnly: true } ) }
									onChange={ this.setSearchQuery }
									onClick={ this.recordInputFocus } />
							</fieldset>
							<FormFooter>
								<FormButton
									onClick={ this.recordGoButtonClick }>
									{ translate( 'Add Site Redirect', { context: 'button' } ) }
								</FormButton>
							</FormFooter>
						</form>
					</Card>
				</div>
			</div>
		);
	}

	recordInputFocus = () => {
		this.props.recordInputFocus( this.state.searchQuery );
	}

	recordGoButtonClick = () => {
		this.props.recordGoButtonClick( this.state.searchQuery );
	}

	setSearchQuery = ( event ) => {
		// Removes the protocol part
		const location = event.target.value.replace( /.*:\/\//, '' );
		this.setState( { searchQuery: location } );
	}

	handleFormSubmit = ( event ) => {
		event.preventDefault();
		this.props.recordFormSubmit( this.state.searchQuery );
		const domain = this.state.searchQuery;

		if ( cartItems.hasProduct( this.props.cart, 'offsite_redirect' ) ) {
			notices.error( this.getValidationErrorMessage( domain, { code: 'already_in_cart' } ) );
			return;
		}

		canRedirect( this.props.selectedSite.ID, domain, function( error ) {
			if ( error ) {
				notices.error( this.getValidationErrorMessage( domain, error ) );
				return;
			}

			this.addSiteRedirectToCart( domain );
		}.bind( this ) );
	}

	addSiteRedirectToCart = ( domain ) => {
		upgradesActions.addItem( cartItems.siteRedirect( { domain: domain } ) );

		page( '/checkout/' + this.props.selectedSite.slug );
	}

	getValidationErrorMessage( domain, error ) {
		const { translate } = this.props;
		switch ( error.code ) {
			case 'invalid_domain':
				return translate( 'Sorry, %(domain)s does not appear to be a valid domain name.', {
					args: { domain: domain }
				} );

			case 'invalid_tld':
				return translate( 'Sorry, %(domain)s does not end with a valid domain extension.', {
					args: { domain: domain }
				} );

			case 'empty_query':
				return translate( 'Please enter a domain name or keyword.' );

			case 'has_subscription':
				return translate( "You already have Site Redirect upgrade and can't add another one to the same site." );

			case 'already_in_cart':
				return translate( "You already have Site Redirect upgrade in the Shopping Cart and can't add another one" );

			default:
				return translate( 'There is a problem adding Site Redirect that points to %(domain)s.', {
					args: { domain: domain }
				} );
		}
	}
}

const recordFormSubmit = ( searchBoxValue ) => recordGoogleEvent(
	'Domain Search',
	'Submitted Form in Site Redirect',
	'Search Box Value',
	searchBoxValue
);

const recordInputFocus = ( searchBoxValue ) => recordGoogleEvent(
	'Domain Search',
	'Focused On Search Box Input in Site Redirect',
	'Search Box Value',
	searchBoxValue
);

const recordGoButtonClick = ( searchBoxValue ) => recordGoogleEvent(
	'Domain Search',
	'Clicked "Go" Button in Site Redirect',
	'Search Box Value',
	searchBoxValue
);

export default connect(
	null,
	{
		recordFormSubmit,
		recordInputFocus,
		recordGoButtonClick
	}
)( localize( SiteRedirectStep ) );
