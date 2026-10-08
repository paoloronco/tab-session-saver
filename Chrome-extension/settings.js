/* global translations */

// Reuse the extension's translation flow for copy specific to this page.
const settingsTranslations = {
  en: {
    settings_skip: 'Skip to settings', settings_navigation: 'Settings sections',
    settings_preferences: 'Preferences', settings_data: 'Your data', settings_more: 'More',
    settings_about: 'About & support',
    settings_appearance_description: 'A workspace that feels like yours. Choose your colors and layout.',
    settings_dark_description: 'Use a darker palette across the extension.',
    settings_size_description: 'Choose how much room your saved sessions have.',
    settings_accent_description: 'Personalize the highlights of the Classic theme.',
    settings_language_description: 'Choose the language used throughout the extension.',
    settings_language_note: 'Applies to settings and your session manager.',
    settings_export_title: 'Keep a copy', settings_export_description: 'Download all your saved sessions in one JSON file.',
    settings_import_title: 'Bring sessions back', settings_import_description: 'Choose a JSON backup to merge or replace your sessions. Maximum 5 MB.',
    settings_cloud_account: 'Your sync account', settings_cloud_scope: 'What gets synced', settings_cloud_snapshot: 'Snapshot',
    settings_about_description: 'Everything you need to find us, get help, and learn more.',
    settings_contact: 'Need a hand?', settings_website: 'Website', settings_legal: 'Legal', settings_terms: 'Terms', settings_delete_data: 'Data deletion'
  },
  it: {
    settings_skip: 'Vai alle impostazioni', settings_navigation: 'Sezioni delle impostazioni',
    settings_preferences: 'Preferenze', settings_data: 'I tuoi dati', settings_more: 'Altro',
    settings_about: 'Informazioni e supporto',
    settings_appearance_description: 'Uno spazio su misura per te. Scegli i colori e il layout.',
    settings_dark_description: 'Usa una palette scura in tutta l’estensione.',
    settings_size_description: 'Scegli lo spazio da dedicare alle sessioni salvate.',
    settings_accent_description: 'Personalizza gli accenti del tema Classico.',
    settings_language_description: 'Scegli la lingua da usare in tutta l’estensione.',
    settings_language_note: 'Si applica alle impostazioni e al gestore delle sessioni.',
    settings_export_title: 'Conserva una copia', settings_export_description: 'Scarica tutte le sessioni salvate in un unico file JSON.',
    settings_import_title: 'Recupera le sessioni', settings_import_description: 'Scegli un backup JSON per unire o sostituire le sessioni. Massimo 5 MB.',
    settings_cloud_account: 'Il tuo account di sincronizzazione', settings_cloud_scope: 'Cosa viene sincronizzato', settings_cloud_snapshot: 'Snapshot',
    settings_about_description: 'Tutti i riferimenti per contattarci, ricevere aiuto e saperne di più.',
    settings_contact: 'Serve una mano?', settings_website: 'Sito web', settings_legal: 'Note legali', settings_terms: 'Termini', settings_delete_data: 'Eliminazione dei dati'
  },
  es: {
    settings_skip: 'Ir a los ajustes', settings_navigation: 'Secciones de ajustes',
    settings_preferences: 'Preferencias', settings_data: 'Tus datos', settings_more: 'Más',
    settings_about: 'Información y soporte',
    settings_appearance_description: 'Un espacio a tu medida. Elige tus colores y diseño.',
    settings_dark_description: 'Usa una paleta oscura en toda la extensión.',
    settings_size_description: 'Elige el espacio para tus sesiones guardadas.',
    settings_accent_description: 'Personaliza los acentos del tema Clásico.',
    settings_language_description: 'Elige el idioma de toda la extensión.',
    settings_language_note: 'Se aplica a los ajustes y al gestor de sesiones.',
    settings_export_title: 'Guarda una copia', settings_export_description: 'Descarga todas tus sesiones guardadas en un archivo JSON.',
    settings_import_title: 'Recupera tus sesiones', settings_import_description: 'Elige una copia JSON para combinar o reemplazar tus sesiones. Máximo 5 MB.',
    settings_cloud_account: 'Tu cuenta de sincronización', settings_cloud_scope: 'Qué se sincroniza', settings_cloud_snapshot: 'Instantánea',
    settings_about_description: 'Todo lo necesario para encontrarnos, obtener ayuda y saber más.',
    settings_contact: '¿Necesitas ayuda?', settings_website: 'Sitio web', settings_legal: 'Aviso legal', settings_terms: 'Términos', settings_delete_data: 'Eliminación de datos'
  },
  fr: {
    settings_skip: 'Aller aux paramètres', settings_navigation: 'Sections des paramètres',
    settings_preferences: 'Préférences', settings_data: 'Vos données', settings_more: 'Plus',
    settings_about: 'À propos et assistance',
    settings_appearance_description: 'Un espace à votre image. Choisissez vos couleurs et votre disposition.',
    settings_dark_description: 'Utilisez une palette sombre dans toute l’extension.',
    settings_size_description: 'Choisissez l’espace pour vos sessions enregistrées.',
    settings_accent_description: 'Personnalisez les accents du thème Classique.',
    settings_language_description: 'Choisissez la langue de toute l’extension.',
    settings_language_note: 'S’applique aux paramètres et au gestionnaire de sessions.',
    settings_export_title: 'Gardez une copie', settings_export_description: 'Téléchargez toutes vos sessions dans un seul fichier JSON.',
    settings_import_title: 'Retrouvez vos sessions', settings_import_description: 'Choisissez une sauvegarde JSON pour fusionner ou remplacer vos sessions. Maximum 5 Mo.',
    settings_cloud_account: 'Votre compte de synchronisation', settings_cloud_scope: 'Ce qui est synchronisé', settings_cloud_snapshot: 'Instantané',
    settings_about_description: 'Tout pour nous retrouver, obtenir de l’aide et en savoir plus.',
    settings_contact: 'Besoin d’aide ?', settings_website: 'Site web', settings_legal: 'Mentions légales', settings_terms: 'Conditions', settings_delete_data: 'Suppression des données'
  },
  de: {
    settings_skip: 'Zu den Einstellungen', settings_navigation: 'Einstellungsbereiche',
    settings_preferences: 'Einstellungen', settings_data: 'Deine Daten', settings_more: 'Mehr',
    settings_about: 'Info und Support',
    settings_appearance_description: 'Ein Arbeitsbereich für dich. Wähle Farben und Layout.',
    settings_dark_description: 'Verwende eine dunkle Palette in der gesamten Erweiterung.',
    settings_size_description: 'Wähle den Platz für deine gespeicherten Sitzungen.',
    settings_accent_description: 'Passe die Akzente des klassischen Designs an.',
    settings_language_description: 'Wähle die Sprache der gesamten Erweiterung.',
    settings_language_note: 'Gilt für Einstellungen und Sitzungsverwaltung.',
    settings_export_title: 'Eine Kopie behalten', settings_export_description: 'Lade alle gespeicherten Sitzungen in einer JSON-Datei herunter.',
    settings_import_title: 'Sitzungen zurückholen', settings_import_description: 'Wähle ein JSON-Backup zum Zusammenführen oder Ersetzen deiner Sitzungen. Maximal 5 MB.',
    settings_cloud_account: 'Dein Synchronisierungskonto', settings_cloud_scope: 'Was synchronisiert wird', settings_cloud_snapshot: 'Momentaufnahme',
    settings_about_description: 'Alles, um uns zu finden, Hilfe zu erhalten und mehr zu erfahren.',
    settings_contact: 'Brauchst du Hilfe?', settings_website: 'Website', settings_legal: 'Rechtliches', settings_terms: 'Bedingungen', settings_delete_data: 'Daten löschen'
  }
};
Object.entries(settingsTranslations).forEach(([language, copy]) => Object.assign(translations[language], copy));

const diagnosticsTranslations = {
  en: {
    diagnostics_title: 'Diagnostics', diagnostics_description: 'Check local storage and download a report to help troubleshoot problems.',
    diagnostics_storage: 'Local storage', diagnostics_usage: '{used} / {limit} MB ({percent}%)',
    diagnostics_summary: '{manual} manual sessions · {auto} automatic sessions · {logs} log events',
    diagnostics_cleanup: 'At 90% of the storage limit, older or identical automatic saves are removed until usage is below 85%, where possible. Manual sessions and the latest scheduled and exit saves are kept.',
    diagnostics_refresh: 'Refresh usage', diagnostics_export_title: 'Logs and diagnostic report',
    diagnostics_logs_note: 'Includes the latest 200 events, session counts and sizes, extension and browser versions, storage usage, and Auto Save and Cloud Sync status. Logs start with this update and stay on this device.',
    diagnostics_anonymous_note: 'The anonymized report excludes URLs, account details and tokens. Session names and free-text error messages are replaced with placeholders.',
    diagnostics_export_anonymous: 'Export anonymized logs (JSON)', diagnostics_export_full: 'Export full logs (JSON)',
    diagnostics_full_note: 'Full logs can contain session names and URLs from technical errors. Review the file before sharing it. This report is not a session backup.',
    diagnostics_exported: 'Diagnostic report downloaded.'
  },
  it: {
    diagnostics_title: 'Diagnostica', diagnostics_description: 'Controlla lo spazio locale e scarica un report per individuare i problemi.',
    diagnostics_storage: 'Spazio locale', diagnostics_usage: '{used} / {limit} MB ({percent}%)',
    diagnostics_summary: '{manual} sessioni manuali · {auto} sessioni automatiche · {logs} eventi nei log',
    diagnostics_cleanup: 'Al 90% del limite, le copie automatiche identiche o più vecchie vengono eliminate per scendere sotto l’85%, quando possibile. Le sessioni manuali e gli ultimi salvataggi periodici e alla chiusura vengono conservati.',
    diagnostics_refresh: 'Aggiorna utilizzo', diagnostics_export_title: 'Log e report diagnostico',
    diagnostics_logs_note: 'Include gli ultimi 200 eventi, numero e dimensioni delle sessioni, versioni di estensione e browser, spazio occupato e stato di Auto Save e Cloud Sync. I log iniziano con questo aggiornamento e restano sul dispositivo.',
    diagnostics_anonymous_note: 'Il report anonimizzato esclude URL, dati dell’account e token. Nomi delle sessioni e messaggi tecnici liberi vengono sostituiti con placeholder.',
    diagnostics_export_anonymous: 'Esporta log anonimizzati (JSON)', diagnostics_export_full: 'Esporta log completi (JSON)',
    diagnostics_full_note: 'I log completi possono contenere nomi delle sessioni e URL presenti negli errori tecnici. Controlla il file prima di condividerlo. Questo report non è un backup delle sessioni.',
    diagnostics_exported: 'Report diagnostico scaricato.'
  },
  es: {
    diagnostics_title: 'Diagnóstico', diagnostics_description: 'Comprueba el espacio local y descarga un informe para investigar problemas.',
    diagnostics_storage: 'Almacenamiento local', diagnostics_usage: '{used} / {limit} MB ({percent}%)',
    diagnostics_summary: '{manual} sesiones manuales · {auto} sesiones automáticas · {logs} eventos',
    diagnostics_cleanup: 'Al 90% del límite se eliminan copias automáticas idénticas o antiguas para bajar del 85%, cuando sea posible. Se conservan las sesiones manuales y las últimas copias programadas y al cerrar.',
    diagnostics_refresh: 'Actualizar uso', diagnostics_export_title: 'Registros e informe de diagnóstico',
    diagnostics_logs_note: 'Incluye los últimos 200 eventos, número y tamaño de sesiones, versiones de extensión y navegador, uso del espacio y estado de Auto Save y Cloud Sync. Los registros comienzan con esta actualización y permanecen en el dispositivo.',
    diagnostics_anonymous_note: 'El informe anónimo excluye URL, datos de cuenta y tokens. Los nombres y mensajes de error libres se sustituyen por marcadores.',
    diagnostics_export_anonymous: 'Exportar registros anónimos (JSON)', diagnostics_export_full: 'Exportar registros completos (JSON)',
    diagnostics_full_note: 'Los registros completos pueden contener nombres y URL de errores técnicos. Revisa el archivo antes de compartirlo. Este informe no es una copia de seguridad de las sesiones.',
    diagnostics_exported: 'Informe de diagnóstico descargado.'
  },
  fr: {
    diagnostics_title: 'Diagnostic', diagnostics_description: 'Vérifiez l’espace local et téléchargez un rapport pour identifier les problèmes.',
    diagnostics_storage: 'Stockage local', diagnostics_usage: '{used} / {limit} Mo ({percent}%)',
    diagnostics_summary: '{manual} sessions manuelles · {auto} sessions automatiques · {logs} événements',
    diagnostics_cleanup: 'À 90% de la limite, les copies automatiques identiques ou anciennes sont supprimées pour revenir sous 85%, si possible. Les sessions manuelles et les dernières copies programmées et de fermeture sont conservées.',
    diagnostics_refresh: 'Actualiser l’utilisation', diagnostics_export_title: 'Journaux et rapport de diagnostic',
    diagnostics_logs_note: 'Inclut les 200 derniers événements, le nombre et la taille des sessions, les versions, l’espace utilisé et l’état d’Auto Save et de Cloud Sync. Les journaux commencent avec cette mise à jour et restent sur cet appareil.',
    diagnostics_anonymous_note: 'Le rapport anonymisé exclut les URL, les données du compte et les jetons. Les noms et messages libres sont remplacés par des espaces réservés.',
    diagnostics_export_anonymous: 'Exporter les journaux anonymisés (JSON)', diagnostics_export_full: 'Exporter les journaux complets (JSON)',
    diagnostics_full_note: 'Les journaux complets peuvent contenir des noms et URL provenant d’erreurs techniques. Vérifiez le fichier avant de le partager. Ce rapport ne sauvegarde pas les sessions.',
    diagnostics_exported: 'Rapport de diagnostic téléchargé.'
  },
  de: {
    diagnostics_title: 'Diagnose', diagnostics_description: 'Prüfe den lokalen Speicher und lade einen Bericht zur Fehlersuche herunter.',
    diagnostics_storage: 'Lokaler Speicher', diagnostics_usage: '{used} / {limit} MB ({percent}%)',
    diagnostics_summary: '{manual} manuelle Sitzungen · {auto} automatische Sitzungen · {logs} Ereignisse',
    diagnostics_cleanup: 'Bei 90% der Grenze werden identische oder alte automatische Sicherungen entfernt, bis die Nutzung möglichst unter 85% liegt. Manuelle Sitzungen und die letzten geplanten und Schließ-Sicherungen bleiben erhalten.',
    diagnostics_refresh: 'Nutzung aktualisieren', diagnostics_export_title: 'Protokolle und Diagnosebericht',
    diagnostics_logs_note: 'Enthält die letzten 200 Ereignisse, Anzahl und Größe der Sitzungen, Versionsinformationen, Speichernutzung und Status von Auto Save und Cloud Sync. Protokolle beginnen mit diesem Update und bleiben auf dem Gerät.',
    diagnostics_anonymous_note: 'Der anonymisierte Bericht enthält keine URLs, Kontodaten oder Tokens. Namen und freie Fehlermeldungen werden durch Platzhalter ersetzt.',
    diagnostics_export_anonymous: 'Anonymisierte Protokolle exportieren (JSON)', diagnostics_export_full: 'Vollständige Protokolle exportieren (JSON)',
    diagnostics_full_note: 'Vollständige Protokolle können Namen und URLs aus technischen Fehlern enthalten. Prüfe die Datei vor dem Teilen. Dieser Bericht ist kein Sitzungs-Backup.',
    diagnostics_exported: 'Diagnosebericht heruntergeladen.'
  }
};
Object.entries(diagnosticsTranslations).forEach(([language, copy]) => Object.assign(translations[language], copy));

document.addEventListener('DOMContentLoaded', () => {
  const panels = Array.from(document.querySelectorAll('.settings-panel'));
  const links = document.querySelectorAll('.settings-nav a');
  const breadcrumb = document.getElementById('settings-current-section');
  const language = document.getElementById('language');
  const revealActiveLink = () => document.querySelector('.settings-nav a[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

  function showSection(focus = false) {
    const requested = window.location.hash.slice(1);
    const section = panels.find(panel => panel.id === (requested === 'browser-support-group' ? 'resources' : requested)) || panels[0];
    panels.forEach(panel => { panel.hidden = panel !== section; });
    links.forEach(link => {
      if (link.getAttribute('href') === `#${section.id}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const heading = section.querySelector('h1');
    breadcrumb.dataset.translate = heading.dataset.translate;
    breadcrumb.textContent = heading.textContent;
    document.documentElement.lang = language.value;
    document.title = `${heading.textContent} · Tabs Session Saver`;
    if (focus) {
      heading.focus({ preventScroll: true });
      window.scrollTo(0, 0);
      revealActiveLink();
    }
  }

  window.addEventListener('hashchange', () => showSection(true));
  window.addEventListener('resize', revealActiveLink);
  links.forEach(link => link.addEventListener('click', event => {
    if (link.getAttribute('href') !== window.location.hash) return;
    event.preventDefault();
    showSection(true);
  }));
  language.addEventListener('change', () => showSection());
  showSection();
});
