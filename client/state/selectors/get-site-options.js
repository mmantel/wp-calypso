/**
 * Internal dependencies
 */
import { getRawSite, getSiteOption } from 'state/sites/selectors';

/**
 * Returns the site options
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}    siteId   Site ID
 * @returns  {?Object}   options  Site options or null
 */
export default ( state, siteId ) => {
	const site = getRawSite( state, siteId );
	if ( ! site ) {
		return null;
	}
	const options = site.options || {};
	const defaultPostFormat = getSiteOption( state, siteId, 'default_post_format' );
		// The 'standard' post format is saved as an option of '0'
	if ( ! defaultPostFormat || defaultPostFormat === '0' ) {
		options.default_post_format = 'standard';
	}
	return options;
};
