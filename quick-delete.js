/**
 * quickdelete.js - Adds a quick delete portlet link to
 * immediately delete a wiki page with one click.
 * 
 * Deletion is instantly performed via a POST API request.
 * 
 * This script is deactivated in the main page.
 * 
 * @todo deactivate the script as well on pages with more than a
 * number of revisions.
 * 
 * Copyright (c) 2023 MarcoAurelio, All Rights Reserved.
 */

$.when( mw.loader.using( [ 'mediawiki.api', 'mediawiki.util' ] ), $.ready ).then(
	function init() {
		var mainPage = mw.config.get('wgIsMainPage');
		var page = mw.config.get( 'wgArticleId' );
		var qd_reason = '';
		if ( mainPage !== true || page !== 0 ) {
			qdel_button = mw.util.addPortletLink( 'p-cactions', '#', 'quick delete', 'id-qdel' );
		} else { return false; }
	
	$(qdel_button).click ( function () {
		doQuickDelete();
	});
	
	function doQuickDelete() {
		var api = new mw.Api();
		api.postWithToken( 'csrf', {
			action: 'delete',
			pageid: page,
			reason: qd_reason,
			deletetalk: '1'
		}).done (function () {
			console.log ('`${page}` was quickly deleted; reloading...');
			window.location.reload();
		});
	}

});
