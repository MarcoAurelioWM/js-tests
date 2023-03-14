/**
 * Añade dos pestañas en las páginas especiales de contribuciones y de
 * contribuciones borradas que permite a los usuarios con los permisos
 * adecuados bloquear tanto local como globalmente a una cuenta como
 * "Spambot". El script no se muestra en la página de contribuciones de
 * direcciones IP ni tampoco en la página de contribuciones del propio
 * usuario, para evitar accidentes. Antes de ejecutar cualquiera de las
 * acciones, el usuario debe aceptar un diálogo de confirmación.
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
		if (!confirm ('Confirm LOCAL BLOCK?')) {
			return false;
		} else {
		doBlockSpambot( true );
		doGlobalLockSpambot ( false );
		console.log("block button works");
		}
	} );
	
	$( sb_glock ).click( function () {
		if (!confirm ('Confirm GLOBAL LOCK?')) {
			return false;
		} else {
		doBlockSpambot( false );
		doGlobalLockSpambot ( true );
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
			location.reload();
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
			location.reload();
		});
	}
});
