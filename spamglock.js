/**
 * 
 * Añade unas pestañas en Especial:Contribuciones y Especial:ContribucionesBorradas
 * que nos permiten bloquear con un solo clic de ratón a cualquier usuario de forma
 * local o global por ser un spambot.
 *
 * Los botones no aparecerán en la página de contribuciones de direcciones IP ni
 * tampoco de nuestra propia cuenta, en este último caso por motivos de seguridad.
 * Además, antes de ejecutar cualquier bloqueo hay que confirmarlo expresamente.
 * 
 * Añade igualmente un botón para bloquear globalmente a cualquier usuario desde
 * una entrada del filtro antiabusos concreta, previa confirmación.
 *
 * Proyecto personal y en desarrollo; no para su distribución o uso general debido a
 * posibles defectos y/o errores que pueden provocar fallos o acciones no deseadas.
 *
 * Copyright (c) 2023 MarcoAurelioWM. All Rights Reserved.
 * 
 */

$.when( mw.loader.using( [ 'mediawiki.api', 'mediawiki.util', 'mediawiki.ForeignApi' ] ), $.ready ).then(
	function showTab () {
	if ( mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Contributions' || mw.config.get( 'wgCanonicalSpecialPageName' ) === 'DeletedContributions' ) {
		var target = mw.config.get('wgRelevantUserName');
		var myUsername = mw.config.get('wgUserName');
		if (!mw.util.isIPAddress(target) && myUsername !== target) {
			var sb_block = mw.util.addPortletLink( 'p-cactions', '#', 'Spambot (bloquear)', 'id-spambot-bl');
			var sb_glock = mw.util.addPortletLink( 'p-cactions', '#', 'Spambot (CentralAuth)', 'id-spambot-ca');
		}
	}
	else if ( mw.config.get ('wgCanonicalSpecialPageName') === 'AbuseLog' && mw.config.get ('wgAbuseFilterVariables') !== null ) {
		var target_afl = mw.config.get('wgAbuseFilterVariables').user_name;
		if (myUsername !== target_afl) {
			var sb_afl = mw.util.addPortletLink( 'p-cactions', '#', 'CA: Spambot', 'id-spambot-afl');
		}
	}
	
	$( sb_block ).click( function () {
		if (!confirm ("¿Quieres bloquear localmente a " + target +" como spambot?")) {
			return false;
		} else {
		doBlockSpambot();
		console.log("block button works");
		}
	} );
	
	$( sb_glock ).click( function () {
		if (!confirm ("¿Quieres bloquear globalmente a "+ target +" como spambot?")) {
			return false;
		} else {
		doGlobalLockSpambot ();
		console.log("global lock button works");
		}
	} );
	
	$( sb_afl ).click( function () {
		if (!confirm ("¿Quieres bloquear globalmente a "+ target_afl +" como spambot?")) {
			return false;
		} else {
		doCaAfl();
		console.log("quick CA from AFL button works");
		}
	} );
	
	function doBlockSpambot () {
		new mw.Api().postWithToken( 'csrf', {
			action: 'block',
			user: target,
			expiry: 'never',
			reason: 'Spambot',
			nocreate: '1',
			autoblock: '1',
			noemail: '1',
		}).done( function () {
			mw.notify($("<span><b>" + target + " ha sido bloqueado.</b> La página se recargará en 5 segundos.</span>"));
		}).done ( function () {
			setTimeout(window.location.reload.bind(window.location), 5000);
		});
	}
	
	function doGlobalLockSpambot () {
		var api = new mw.ForeignApi( 'https://meta.wikimedia.org/w/api.php' );
		api.postWithToken( 'setglobalaccountstatus', {
			action: 'setglobalaccountstatus',
			user: target,
			locked: 'lock',
			hidden: '',
			reason: 'Spam-only account: spambot'
		}).done( function () {
			mw.notify($("<span><b>" + target + " ha sido bloqueado globalmente.</b> La página se recargará en 5 segundos.</span>"));
		}).done ( function () {
			setTimeout(window.location.reload.bind(window.location), 5000);
		});
	}
	
	function doCaAfl () {
		new mw.Api().postWithToken( 'setglobalaccountstatus', {
			action: 'setglobalaccountstatus',
			user: target_afl,
			locked: 'lock',
			hidden: '',
			reason: 'Spam-only account: spambot'
		}).done( function () {
			mw.notify($("<span><b>" + target_afl + " ha sido bloqueado globalmente.</b> La página se recargará en 5 segundos.</span>"));
		}).done ( function () {
			setTimeout(window.location.reload.bind(window.location), 5000);
		});
	}
});
