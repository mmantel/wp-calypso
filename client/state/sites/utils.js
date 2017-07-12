/**
 * Internal dependencies
 */
import {
	getRawSite,
	getSiteOption,
	getSiteTitle,
	isSitePreviewable,
	getSiteDomain,
	getSiteSlug,
	isJetpackSite,
	isSiteConflicting
} from 'state/sites/selectors';
import { getSiteOptions, canCurrentUser } from 'state/selectors';
import { withoutHttp } from 'lib/url';

/**
 * Returns computed properties of the site object.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}    siteId   Site ID
 * @returns  {?Object}   options  Site computed computed properties or null
 */
export const getSiteComputedAttributes = ( state, siteId ) => {
	const site = getRawSite( state, siteId );
	if ( ! site ) {
		return null;
	}

	const computedAttributes = {
		hasConflict: isSiteConflicting( state, siteId ),
		options: getSiteOptions( state, siteId ),
		title: getSiteTitle( state, siteId ),
		is_previewable: !! isSitePreviewable( state, siteId ),
		is_customizable: !! canCurrentUser( state, siteId, 'edit_theme_options' ),
		domain: getSiteDomain( state, siteId ),
		slug: getSiteSlug( state, siteId )
	};

	if ( getSiteOption( state, siteId, 'is_mapped_domain' ) && ! isJetpackSite( state, siteId ) ) {
		computedAttributes.wpcom_url = withoutHttp( getSiteOption( state, siteId, 'unmapped_url' ) );
	}

	if ( getSiteOption( state, siteId, 'is_redirect' ) || isSiteConflicting( state, siteId ) ) {
		computedAttributes.URL = getSiteOption( state, siteId, 'unmapped_url' );
	}

	return computedAttributes;
};
