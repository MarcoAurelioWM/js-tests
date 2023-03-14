/**
 * Añade una pestaña en Especial:Contribuciones y Especial:ContribucionesBorradas
 * que nos permite bloquear local o globalmente a un usuario como spambot.
 *
 * Copyright (c) 2023 MarcoAurelioWM. All Rights Reserved
 */ 

$.when( mw.loader.using( [ 'mediawiki.api', 'mediawiki.util', 'mediawiki.ForeignApi' ] ), $.ready ).then(
	function showTab () {
	if ( mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Contributions' || mw.config.get( 'wgCanonicalSpecialPageName' ) === 'DeletedContributions') {
		var target1 = mw.config.get('wgRelevantUserName');
		var myUsername = mw.config.get('wgUserName');
		if (!mw.util.isIPAddress(target1) && myUsername !== target1) {
			var sb_block = mw.util.addPortletLink( 'p-cactions', '#', 'Spambot (bloquear)', 'id-spambot-bl');
			var sb_glock = mw.util.addPortletLink( 'p-cactions', '#', 'Spambot (CentralAuth)', 'id-spambot-ca');
		}
	}
	
	$( sb_block ).click( function () {
		if (!confirm ("¿Quieres bloquear localmente a " + target1 +" como spambot?")) {
			return false;
		} else {
		doBlockSpambot();
		console.log("block button works");
		}
	} );
	
	$( sb_glock ).click( function () {
		if (!confirm ("¿Quieres bloquear globalmente a "+ target1 +" como spambot?")) {
			return false;
		} else {
		doGlobalLockSpambot ();
		console.log("global lock button works");
		}
	} );
	
	function doBlockSpambot () {
		var target2 = mw.config.get('wgRelevantUserName');
		new mw.Api().postWithToken( 'csrf', {
			action: 'block',
			user: target2,
			expiry: 'never',
			reason: 'Spambot',
			nocreate: '1',
			autoblock: '1',
			noemail: '1',
		}).done( function () {
			mw.notify($("<span><b>" + target2 + " ha sido bloqueado.</b>\nLa página se recargará en 10 segundos.</span>"));
		}).done ( function () {
			setTimeout(window.location.reload.bind(window.location), 10000);
		});
	}
	
	function doGlobalLockSpambot () {
		var api2 = new mw.ForeignApi( 'https://meta.wikimedia.org/w/api.php' );
		var target3 = mw.config.get('wgRelevantUserName');
		api2.postWithToken( 'setglobalaccountstatus', {
			action: 'setglobalaccountstatus',
			user: target3,
			locked: 'lock',
			hidden: '',
			reason: 'Spam-only account: spambot'
		}).done( function () {
			mw.notify($("<span><b>" + target3 + " ha sido bloqueado globalmente.</b>\nLa página se recargará en 10 segundos.</span>"));
		}).done ( function () {
			setTimeout(window.location.reload.bind(window.location), 10000);
		});
	}
});
