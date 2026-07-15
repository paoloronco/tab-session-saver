// popup.js

// Translation object
const translations = {
  en: {
    title: "Tab Session Saver",
    subtitle: "Keep your workspaces ready in one click.",
    save_button: "Save current tabs",
    search_sessions_label: "Search saved sessions",
    search_sessions_placeholder: "Search sessions, tabs, or sites",
    close_search_label: "Close search",
    search_no_results_title: "No matching sessions",
    search_no_results_description: "Try a different session name, tab title, or website.",
    restore_button: "Restore",
    restore_session_button: "Restore entire session",
    restore_window_button: "Restore window",
    restore_in_progress: "Restoring...",
    restore_in_progress_message: "A session restore is already in progress.",
    reorder_session_label: "Drag to reorder session",
    create_folder_label: "Create folder",
    create_folder_prompt: "Folder name:",
    default_folder_name: "New folder",
    folder_empty: "Drop sessions here",
    delete_folder_label: "Delete folder",
    delete_folder_empty_confirm: "Delete folder \"{name}\"?",
    delete_folder_with_sessions_confirm: "Folder \"{name}\" contains {count} sessions. Delete those sessions too?",
    delete_folder_keep_sessions_confirm: "Keep the sessions and delete only folder \"{name}\"?",
    unfiled_sessions_title: "Other sessions",
    export_button: "Export saved sessions (JSON)",
    import_button: "Import sessions (JSON)",
    settings_title: "Settings",
    language_label: "Language",
    dark_mode_label: "Dark mode",
    color_label: "Accent color",
    appearance_title: "Appearance",
    popup_size_label: "Popup size",
    popup_size_small: "Small",
    popup_size_medium: "Medium",
    popup_size_large: "Large",
    popup_size_huge: "Huge (Full tab)",
    restore_behavior_title: "Restore behavior",
    restore_behavior_description: "Choose where the last window of a restored session opens.",
    restore_new_windows_label: "Restore in new windows",
    restore_new_windows_description: "Every saved window opens separately. Your current window stays unchanged.",
    restore_current_window_label: "Restore into the current window",
    restore_current_window_description: "The last saved window is added before your current tabs. Other saved windows still open separately.",
    backup_title: "Backup",
    backup_description: "Export a backup or import saved sessions.",
    newsletter_title: "Newsletter",
    newsletter_description: "Get updates about new Tab Session Saver features.",
    newsletter_email_label: "Email address",
    newsletter_email_placeholder: "you@example.com",
    newsletter_subscribe_button: "Subscribe",
    newsletter_subscribed_status: "Subscribed as {email}.",
    newsletter_duplicate_status: "This email is already subscribed.",
    newsletter_invalid_email: "Enter a valid email address.",
    newsletter_subscribe_loading: "Subscribing...",
    newsletter_configuration_error: "Newsletter service is not configured yet.",
    newsletter_request_error: "Unable to update newsletter subscription. Please try again.",
    cloud_sync_title: "Cloud Sync",
    cloud_sync_description: "Optional multi-device sync. Core sessions still work locally without an account.",
    cloud_sync_limits_note: "Current cloud storage limit: up to 10 synced sessions, 300 total URLs, and a 512 KB snapshot.",
    cloud_sync_auto_note: "After local changes, Cloud Sync pushes automatically after about 10 minutes and also tries to sync when the browser closes. Push writes are rate-limited by the cloud service.",
    cloud_sync_register_button: "Create sync account / Login",
    cloud_sync_push_button: "Push",
    cloud_sync_pull_button: "Pull",
    cloud_sync_disconnect_button: "Disable",
    cloud_sync_not_configured: "Sign in before using Cloud Sync.",
    cloud_sync_registered: "Cloud Sync is enabled.",
    cloud_sync_account_label: "Signed in as {email}.",
    cloud_sync_pushed: "Local sessions pushed to cloud.",
    cloud_sync_pulled: "Cloud sessions pulled.",
    cloud_sync_disconnected: "Cloud Sync disabled on this device.",
    cloud_sync_request_error: "Cloud Sync request failed. Sign in again and retry.",
    cloud_sync_quota_exceeded: "Cloud Sync limit reached. Keep up to {sessions} synced sessions and {urls} total URLs in cloud.",
    cloud_sync_rate_limited: "Push is temporarily limited. Try again in about {minutes} min.",
    cloud_sync_no_pending_changes: "No local changes to push.",
    cloud_sync_status_idle: "Not connected.",
    cloud_sync_status_pending: "Pending upload.",
    cloud_sync_status_synced: "Last synced {time}.",
    auto_save_title: "Auto Save",
    auto_save_description: "Automatically capture the current session on a schedule.",
    auto_save_toggle_label: "Enable Auto Save",
    auto_save_on_exit_toggle_label: "Save when Chrome closes",
    auto_save_interval_label: "Save every",
    auto_save_interval_unit: "minutes",
    auto_save_group_mode_label: "Auto Save grouping",
    auto_save_group_mode_smart: "Smart",
    auto_save_group_mode_day: "By day",
    auto_save_group_mode_session: "By browser session",
    auto_save_group_mode_none: "No grouping",
    auto_save_group_browser_title: "Browser session",
    auto_save_group_day_title: "Day",
    auto_save_group_topic_title: "Similar tabs",
    auto_save_group_count: "{count} sessions",
    add_url_button: "Add URL",
    add_session_item_button: "Add item",
    add_session_window_button: "Add as new window",
    add_url_prompt: "Enter a URL or search to add to this session:",
    add_url_invalid: "Enter a valid URL or search text.",
    add_url_failed: "Unable to add this item.",
    remove_window_button: "Delete window",
    remove_window_confirm: "Delete window {index} from this saved session?",
    remove_tab_confirm: "Remove this tab from the saved session?",
    auto_save_filter_group_label: "Auto saved session source",
    auto_save_filter_all: "All",
    auto_save_filter_scheduled: "Scheduled",
    auto_save_filter_exit: "On Exit",
    manual_sessions_tab: "Manually Saved",
    auto_sessions_tab: "Auto Saved",
    resources_title: "Get the extension",
    color_blue: "Blue",
    color_green: "Green",
    color_yellow: "Yellow",
    color_red: "Red",
    color_purple: "Purple",
    delete_button: "Delete",
    rename_button: "Rename",
    preview_button: "Show preview",
    preview_hide_button: "Hide preview",
    preview_title: "Tabs in session",
    preview_window_label: "Window {index}",
    preview_empty: "No tabs captured in this session",
    session_menu_label: "Session menu",
    session_default_name: "Session",
    rename_prompt: "Enter a new name for this session:",
    chrome_store_link: "Install from Chrome Web Store",
    github_link: "Source code on GitHub",
    developer_website_link: "Developer website",
    privacy_policy_link: "Privacy Policy",
    version_label: "Version:",
    rights_reserved: "All rights reserved",
    empty_state_title: "No sessions saved yet",
    empty_state_description: "Save your current window to build your collection and reopen everything instantly.",
    tab_count_one: "1 tab",
    tab_count_other: "{count} tabs",
    window_count_one: "1 window",
    window_count_other: "{count} windows",
    group_count_one: "1 group",
    group_count_other: "{count} groups",
    desktop_scope_workspace: "Current desktop",
    browser_support_label: "Browser Support",
    browser_support_loading: "Detecting browser…",
    browser_support_supported: "Supported",
    browser_support_not_supported: "Not officially supported",
    browser_support_unknown: "Unknown",
    browser_support_detected: "Detected browser",
    browser_support_official: "Official browser",
    browser_support_status: "Status",
    browser_support_description: "This extension is officially developed and tested for Google Chrome. Chromium-based browsers may behave differently, especially for session restore, tab groups, and multi-window behavior.",
    browser_warning_text: "Unsupported browser detected. Some restore features, tab groups, and multi-window behavior may differ from standard Google Chrome.",
    browser_warning_unknown_text: "Browser could not be reliably identified. Official support is provided for Google Chrome."
  },
  es: {
    title: "Guardador de pesta\u00F1as",
    subtitle: "Mant\u00E9n tus espacios de trabajo listos con un clic.",
    save_button: "Guardar pesta\u00F1as actuales",
    search_sessions_label: "Buscar sesiones guardadas",
    search_sessions_placeholder: "Buscar sesiones, pesta\u00F1as o sitios",
    close_search_label: "Cerrar b\u00FAsqueda",
    search_no_results_title: "No hay sesiones coincidentes",
    search_no_results_description: "Prueba con otro nombre de sesi\u00F3n, t\u00EDtulo de pesta\u00F1a o sitio web.",
    restore_button: "Restaurar",
    restore_session_button: "Restaurar toda la sesi\u00F3n",
    restore_window_button: "Restaurar ventana",
    restore_in_progress: "Restaurando...",
    restore_in_progress_message: "Ya hay una restauraci\u00F3n de sesi\u00F3n en curso.",
    reorder_session_label: "Arrastra para reordenar la sesi\u00F3n",
    create_folder_label: "Crear carpeta",
    create_folder_prompt: "Nombre de la carpeta:",
    default_folder_name: "Nueva carpeta",
    folder_empty: "Suelta sesiones aqu\u00ED",
    delete_folder_label: "Eliminar carpeta",
    delete_folder_empty_confirm: "\u00BFEliminar la carpeta \"{name}\"?",
    delete_folder_with_sessions_confirm: "La carpeta \"{name}\" contiene {count} sesiones. \u00BFEliminar tambi\u00E9n esas sesiones?",
    delete_folder_keep_sessions_confirm: "\u00BFConservar las sesiones y eliminar solo la carpeta \"{name}\"?",
    unfiled_sessions_title: "Otras sesiones",
    export_button: "Exportar sesiones guardadas (JSON)",
    import_button: "Importar sesiones (JSON)",
    settings_title: "Configuraci\u00F3n",
    language_label: "Idioma",
    dark_mode_label: "Modo oscuro",
    color_label: "Color de acento",
    appearance_title: "Apariencia",
    popup_size_label: "Tama\u00F1o del popup",
    popup_size_small: "Peque\u00F1o",
    popup_size_medium: "Mediano",
    popup_size_large: "Grande",
    popup_size_huge: "Enorme (pesta\u00F1a completa)",
    restore_behavior_title: "Comportamiento de restauraci\u00F3n",
    restore_behavior_description: "Elige d\u00F3nde se abre la \u00FAltima ventana de una sesi\u00F3n restaurada.",
    restore_new_windows_label: "Restaurar en ventanas nuevas",
    restore_new_windows_description: "Cada ventana guardada se abre por separado. La ventana actual no cambia.",
    restore_current_window_label: "Restaurar en la ventana actual",
    restore_current_window_description: "La \u00FAltima ventana guardada se a\u00F1ade antes de las pesta\u00F1as actuales. Las dem\u00E1s se abren por separado.",
    backup_title: "Copia de seguridad",
    backup_description: "Exporta una copia o importa sesiones guardadas.",
    newsletter_title: "Newsletter",
    newsletter_description: "Recibe novedades sobre las funciones de Tab Session Saver.",
    newsletter_email_label: "Correo electr\u00F3nico",
    newsletter_email_placeholder: "tu@email.com",
    newsletter_subscribe_button: "Suscribirse",
    newsletter_subscribed_status: "Suscrito como {email}.",
    newsletter_duplicate_status: "Este correo ya est\u00E1 suscrito.",
    newsletter_invalid_email: "Introduce un correo electr\u00F3nico v\u00E1lido.",
    newsletter_subscribe_loading: "Suscribiendo...",
    newsletter_configuration_error: "El servicio de newsletter a\u00FAn no est\u00E1 configurado.",
    newsletter_request_error: "No se pudo actualizar la suscripci\u00F3n. Int\u00E9ntalo de nuevo.",
    cloud_sync_title: "Cloud Sync",
    cloud_sync_description: "Sincronizaci\u00F3n opcional entre dispositivos. Las sesiones locales funcionan sin cuenta.",
    cloud_sync_limits_note: "L\u00EDmite actual en la nube: hasta 10 sesiones sincronizadas, 300 URL en total y una captura de 512 KB.",
    cloud_sync_auto_note: "Tras cambios locales, Cloud Sync sube los datos autom\u00E1ticamente en unos 10 minutos y tambi\u00E9n intenta sincronizar al cerrar el navegador. Las escrituras Push est\u00E1n limitadas por el servicio cloud.",
    cloud_sync_register_button: "Crear cuenta sync / Iniciar sesi\u00F3n",
    cloud_sync_push_button: "Subir",
    cloud_sync_pull_button: "Descargar",
    cloud_sync_disconnect_button: "Desactivar",
    cloud_sync_not_configured: "Inicia sesi\u00F3n antes de usar Cloud Sync.",
    cloud_sync_registered: "Cloud Sync est\u00E1 activado.",
    cloud_sync_account_label: "Sesi\u00F3n iniciada como {email}.",
    cloud_sync_pushed: "Sesiones locales subidas a la nube.",
    cloud_sync_pulled: "Sesiones de la nube descargadas.",
    cloud_sync_disconnected: "Cloud Sync desactivado en este dispositivo.",
    cloud_sync_request_error: "La solicitud de Cloud Sync fall\u00F3. Inicia sesi\u00F3n de nuevo e int\u00E9ntalo otra vez.",
    cloud_sync_quota_exceeded: "L\u00EDmite de Cloud Sync alcanzado. Mant\u00E9n hasta {sessions} sesiones sincronizadas y {urls} URL en total.",
    cloud_sync_rate_limited: "La subida est\u00E1 limitada temporalmente. Int\u00E9ntalo de nuevo en unos {minutes} min.",
    cloud_sync_no_pending_changes: "No hay cambios locales que subir.",
    cloud_sync_status_idle: "No conectado.",
    cloud_sync_status_pending: "Subida pendiente.",
    cloud_sync_status_synced: "\u00DAltima sincronizaci\u00F3n {time}.",
    auto_save_title: "Guardado autom\u00E1tico",
    auto_save_description: "Captura autom\u00E1ticamente la sesi\u00F3n actual seg\u00FAn un intervalo.",
    auto_save_toggle_label: "Activar guardado autom\u00E1tico",
    auto_save_on_exit_toggle_label: "Guardar al cerrar Chrome",
    auto_save_interval_label: "Guardar cada",
    auto_save_interval_unit: "minutos",
    auto_save_group_mode_label: "Agrupaci\u00F3n de guardado autom\u00E1tico",
    auto_save_group_mode_smart: "Inteligente",
    auto_save_group_mode_day: "Por d\u00EDa",
    auto_save_group_mode_session: "Por sesi\u00F3n del navegador",
    auto_save_group_mode_none: "Sin agrupaci\u00F3n",
    auto_save_group_browser_title: "Sesi\u00F3n del navegador",
    auto_save_group_day_title: "D\u00EDa",
    auto_save_group_topic_title: "Pesta\u00F1as similares",
    auto_save_group_count: "{count} sesiones",
    add_url_button: "A\u00F1adir URL",
    add_session_item_button: "A\u00F1adir elemento",
    add_session_window_button: "A\u00F1adir como ventana",
    add_url_prompt: "Introduce una URL o b\u00FAsqueda para a\u00F1adirla a esta sesi\u00F3n:",
    add_url_invalid: "Introduce una URL o b\u00FAsqueda v\u00E1lida.",
    add_url_failed: "No se pudo a\u00F1adir este elemento.",
    remove_window_button: "Eliminar ventana",
    remove_window_confirm: "\u00BFEliminar la ventana {index} de esta sesi\u00F3n guardada?",
    remove_tab_confirm: "\u00BFEliminar esta pesta\u00F1a de la sesi\u00F3n guardada?",
    auto_save_filter_group_label: "Origen de sesiones autom\u00E1ticas",
    auto_save_filter_all: "Todas",
    auto_save_filter_scheduled: "Programadas",
    auto_save_filter_exit: "Al salir",
    manual_sessions_tab: "Guardadas manualmente",
    auto_sessions_tab: "Guardadas autom\u00E1ticamente",
    resources_title: "Obtener la extensión",
    color_blue: "Azul",
    color_green: "Verde",
    color_yellow: "Amarillo",
    color_red: "Rojo",
    color_purple: "Morado",
    delete_button: "Eliminar",
    rename_button: "Renombrar",
    preview_button: "Mostrar vista previa",
    preview_hide_button: "Ocultar vista previa",
    preview_title: "Pesta\u00F1as guardadas",
    preview_window_label: "Ventana {index}",
    preview_empty: "No hay pesta\u00F1as en esta sesi\u00F3n",
    session_menu_label: "Men\u00FA de sesi\u00F3n",
    session_default_name: "Sesi\u00F3n",
    rename_prompt: "Introduce un nuevo nombre para esta sesi\u00F3n:",
    chrome_store_link: "Instalar desde Chrome Web Store",
    github_link: "Código fuente en GitHub",
    developer_website_link: "Sitio del desarrollador",
    privacy_policy_link: "Pol\u00EDtica de privacidad",
    version_label: "Versi\u00F3n:",
    rights_reserved: "Todos los derechos reservados",
    empty_state_title: "Todav\u00EDa no hay sesiones guardadas",
    empty_state_description: "Guarda la ventana actual para crear tu colecci\u00F3n y reabrir todo al instante.",
    tab_count_one: "1 pesta\u00F1a",
    tab_count_other: "{count} pesta\u00F1as",
    window_count_one: "1 ventana",
    window_count_other: "{count} ventanas",
    group_count_one: "1 grupo",
    group_count_other: "{count} grupos",
    desktop_scope_workspace: "Escritorio actual",
    browser_support_label: "Compatibilidad del navegador",
    browser_support_loading: "Detectando navegador…",
    browser_support_supported: "Compatible",
    browser_support_not_supported: "No compatible oficialmente",
    browser_support_unknown: "Desconocido",
    browser_support_detected: "Navegador detectado",
    browser_support_official: "Navegador oficial",
    browser_support_status: "Estado",
    browser_support_description: "Esta extensión está desarrollada y probada oficialmente para Google Chrome. Los navegadores basados en Chromium pueden comportarse de forma diferente, especialmente al restaurar sesiones, grupos de pestañas y múltiples ventanas.",
    browser_warning_text: "Navegador no compatible detectado. Algunas funciones de restauración, grupos de pestañas y ventanas múltiples pueden diferir de Google Chrome estándar.",
    browser_warning_unknown_text: "No se pudo identificar el navegador de forma fiable. El soporte oficial se proporciona para Google Chrome."
  },
  it: {
    title: "Salva schede",
    subtitle: "Tieni i tuoi spazi di lavoro pronti con un clic.",
    save_button: "Salva le schede correnti",
    search_sessions_label: "Cerca nelle sessioni salvate",
    search_sessions_placeholder: "Cerca sessioni, schede o siti",
    close_search_label: "Chiudi ricerca",
    search_no_results_title: "Nessuna sessione trovata",
    search_no_results_description: "Prova un altro nome sessione, titolo di scheda o sito web.",
    restore_button: "Ripristina",
    restore_session_button: "Ripristina l'intera sessione",
    restore_window_button: "Ripristina finestra",
    restore_in_progress: "Ripristino...",
    restore_in_progress_message: "Un ripristino sessione \u00E8 gi\u00E0 in corso.",
    reorder_session_label: "Trascina per riordinare la sessione",
    create_folder_label: "Crea cartella",
    create_folder_prompt: "Nome cartella:",
    default_folder_name: "Nuova cartella",
    folder_empty: "Trascina qui le sessioni",
    delete_folder_label: "Elimina cartella",
    delete_folder_empty_confirm: "Eliminare la cartella \"{name}\"?",
    delete_folder_with_sessions_confirm: "La cartella \"{name}\" contiene {count} sessioni. Eliminare anche queste sessioni?",
    delete_folder_keep_sessions_confirm: "Tenere le sessioni ed eliminare solo la cartella \"{name}\"?",
    unfiled_sessions_title: "Altre sessioni",
    export_button: "Esporta le sessioni salvate (JSON)",
    import_button: "Importa le sessioni (JSON)",
    settings_title: "Impostazioni",
    language_label: "Lingua",
    dark_mode_label: "Modalit\u00E0 scura",
    color_label: "Colore di accento",
    appearance_title: "Aspetto",
    popup_size_label: "Dimensione popup",
    popup_size_small: "Piccolo",
    popup_size_medium: "Medio",
    popup_size_large: "Grande",
    popup_size_huge: "Enorme (scheda completa)",
    restore_behavior_title: "Comportamento di ripristino",
    restore_behavior_description: "Scegli dove aprire l'ultima finestra di una sessione ripristinata.",
    restore_new_windows_label: "Ripristina in nuove finestre",
    restore_new_windows_description: "Ogni finestra salvata si apre separatamente. La finestra attuale resta invariata.",
    restore_current_window_label: "Ripristina nella finestra attuale",
    restore_current_window_description: "L'ultima finestra salvata viene aggiunta prima delle schede attuali. Le altre si aprono separatamente.",
    backup_title: "Backup",
    backup_description: "Esporta un backup o importa sessioni salvate.",
    newsletter_title: "Newsletter",
    newsletter_description: "Ricevi aggiornamenti su novit\u00E0 e nuove funzioni di Tab Session Saver.",
    newsletter_email_label: "Indirizzo email",
    newsletter_email_placeholder: "nome@email.com",
    newsletter_subscribe_button: "Iscriviti",
    newsletter_subscribed_status: "Iscritto come {email}.",
    newsletter_duplicate_status: "Questa email risulta gi\u00E0 iscritta.",
    newsletter_invalid_email: "Inserisci un indirizzo email valido.",
    newsletter_subscribe_loading: "Iscrizione in corso...",
    newsletter_configuration_error: "Il servizio newsletter non \u00E8 ancora configurato.",
    newsletter_request_error: "Impossibile aggiornare l'iscrizione. Riprova.",
    cloud_sync_title: "Cloud Sync",
    cloud_sync_description: "Sync opzionale tra dispositivi. Le sessioni locali funzionano anche senza account.",
    cloud_sync_limits_note: "Limite cloud attuale: fino a 10 sessioni sincronizzate, 300 URL totali e snapshot da 512 KB.",
    cloud_sync_auto_note: "Dopo modifiche locali, Cloud Sync invia automaticamente dopo circa 10 minuti e prova anche a sincronizzare alla chiusura del browser. Le scritture Push sono limitate dal servizio cloud.",
    cloud_sync_register_button: "Crea account sync / Login",
    cloud_sync_push_button: "Invia",
    cloud_sync_pull_button: "Scarica",
    cloud_sync_disconnect_button: "Disabilita",
    cloud_sync_not_configured: "Accedi prima di usare Cloud Sync.",
    cloud_sync_registered: "Cloud Sync \u00E8 abilitato.",
    cloud_sync_account_label: "Accesso effettuato come {email}.",
    cloud_sync_pushed: "Sessioni locali inviate al cloud.",
    cloud_sync_pulled: "Sessioni cloud scaricate.",
    cloud_sync_disconnected: "Cloud Sync disabilitato su questo dispositivo.",
    cloud_sync_request_error: "Richiesta Cloud Sync non riuscita. Accedi di nuovo e riprova.",
    cloud_sync_quota_exceeded: "Limite Cloud Sync raggiunto. Mantieni fino a {sessions} sessioni sincronizzate e {urls} URL totali nel cloud.",
    cloud_sync_rate_limited: "Push temporaneamente limitato. Riprova tra circa {minutes} min.",
    cloud_sync_no_pending_changes: "Nessuna modifica locale da inviare.",
    cloud_sync_status_idle: "Non connesso.",
    cloud_sync_status_pending: "Upload in attesa.",
    cloud_sync_status_synced: "Ultimo sync {time}.",
    auto_save_title: "Auto Save",
    auto_save_description: "Salva automaticamente la sessione corrente con un intervallo programmato.",
    auto_save_toggle_label: "Abilita Auto Save",
    auto_save_on_exit_toggle_label: "Salva alla chiusura di Chrome",
    auto_save_interval_label: "Salva ogni",
    auto_save_interval_unit: "minuti",
    auto_save_group_mode_label: "Raggruppamento Auto Save",
    auto_save_group_mode_smart: "Smart",
    auto_save_group_mode_day: "Per giorno",
    auto_save_group_mode_session: "Per sessione browser",
    auto_save_group_mode_none: "Nessun raggruppamento",
    auto_save_group_browser_title: "Sessione browser",
    auto_save_group_day_title: "Giorno",
    auto_save_group_topic_title: "Schede simili",
    auto_save_group_count: "{count} sessioni",
    add_url_button: "Aggiungi URL",
    add_session_item_button: "Aggiungi elemento",
    add_session_window_button: "Aggiungi come finestra",
    add_url_prompt: "Inserisci un URL o una ricerca da aggiungere a questa sessione:",
    add_url_invalid: "Inserisci un URL o una ricerca valida.",
    add_url_failed: "Impossibile aggiungere questo elemento.",
    remove_window_button: "Elimina finestra",
    remove_window_confirm: "Eliminare la finestra {index} da questa sessione salvata?",
    remove_tab_confirm: "Rimuovere questa scheda dalla sessione salvata?",
    auto_save_filter_group_label: "Origine sessioni automatiche",
    auto_save_filter_all: "Tutte",
    auto_save_filter_scheduled: "Programmate",
    auto_save_filter_exit: "Alla chiusura",
    manual_sessions_tab: "Salvate manualmente",
    auto_sessions_tab: "Salvate automaticamente",
    resources_title: "Ottieni l'estensione",
    color_blue: "Blu",
    color_green: "Verde",
    color_yellow: "Giallo",
    color_red: "Rosso",
    color_purple: "Viola",
    delete_button: "Elimina",
    rename_button: "Rinomina",
    preview_button: "Mostra anteprima",
    preview_hide_button: "Nascondi anteprima",
    preview_title: "Schede salvate",
    preview_window_label: "Finestra {index}",
    preview_empty: "Nessuna scheda in questa sessione",
    session_menu_label: "Menu sessione",
    session_default_name: "Sessione",
    rename_prompt: "Inserisci un nuovo nome per questa sessione:",
    chrome_store_link: "Installa dal Chrome Web Store",
    github_link: "Codice sorgente su GitHub",
    developer_website_link: "Sito dello sviluppatore",
    privacy_policy_link: "Informativa sulla privacy",
    version_label: "Versione:",
    rights_reserved: "Tutti i diritti riservati",
    empty_state_title: "Nessuna sessione ancora salvata",
    empty_state_description: "Salva la finestra attuale per creare la tua raccolta e riaprire tutto all'istante.",
    tab_count_one: "1 scheda",
    tab_count_other: "{count} schede",
    window_count_one: "1 finestra",
    window_count_other: "{count} finestre",
    group_count_one: "1 gruppo",
    group_count_other: "{count} gruppi",
    desktop_scope_workspace: "Desktop attuale",
    browser_support_label: "Supporto browser",
    browser_support_loading: "Rilevamento browser…",
    browser_support_supported: "Supportato",
    browser_support_not_supported: "Non ufficialmente supportato",
    browser_support_unknown: "Sconosciuto",
    browser_support_detected: "Browser rilevato",
    browser_support_official: "Browser ufficiale",
    browser_support_status: "Stato",
    browser_support_description: "Questa estensione è sviluppata e testata ufficialmente per Google Chrome. I browser basati su Chromium possono comportarsi diversamente, soprattutto per ripristino sessioni, gruppi di schede e finestre multiple.",
    browser_warning_text: "Browser non supportato rilevato. Alcune funzioni di ripristino, gruppi di schede e finestre multiple potrebbero comportarsi diversamente rispetto a Google Chrome standard.",
    browser_warning_unknown_text: "Impossibile identificare il browser in modo affidabile. Il supporto ufficiale è fornito per Google Chrome."
  },
  fr: {
    title: "Sauvegarde d'onglets",
    subtitle: "Gardez vos espaces de travail pr\u00EAts en un clic.",
    save_button: "Enregistrer les onglets en cours",
    search_sessions_label: "Rechercher dans les sessions enregistr\u00E9es",
    search_sessions_placeholder: "Rechercher sessions, onglets ou sites",
    close_search_label: "Fermer la recherche",
    search_no_results_title: "Aucune session correspondante",
    search_no_results_description: "Essayez un autre nom de session, titre d'onglet ou site web.",
    restore_button: "Restaurer",
    restore_session_button: "Restaurer toute la session",
    restore_window_button: "Restaurer la fen\u00EAtre",
    restore_in_progress: "Restauration...",
    restore_in_progress_message: "Une restauration de session est d\u00E9j\u00E0 en cours.",
    reorder_session_label: "Faites glisser pour r\u00E9organiser la session",
    create_folder_label: "Cr\u00E9er un dossier",
    create_folder_prompt: "Nom du dossier :",
    default_folder_name: "Nouveau dossier",
    folder_empty: "D\u00E9posez des sessions ici",
    delete_folder_label: "Supprimer le dossier",
    delete_folder_empty_confirm: "Supprimer le dossier \"{name}\" ?",
    delete_folder_with_sessions_confirm: "Le dossier \"{name}\" contient {count} sessions. Supprimer aussi ces sessions ?",
    delete_folder_keep_sessions_confirm: "Conserver les sessions et supprimer seulement le dossier \"{name}\" ?",
    unfiled_sessions_title: "Autres sessions",
    export_button: "Exporter les sessions enregistr\u00E9es (JSON)",
    import_button: "Importer des sessions (JSON)",
    settings_title: "Param\u00E8tres",
    language_label: "Langue",
    dark_mode_label: "Mode sombre",
    color_label: "Couleur d'accent",
    appearance_title: "Apparence",
    popup_size_label: "Taille du popup",
    popup_size_small: "Petite",
    popup_size_medium: "Moyenne",
    popup_size_large: "Grande",
    popup_size_huge: "Immense (onglet complet)",
    restore_behavior_title: "Comportement de restauration",
    restore_behavior_description: "Choisissez o\u00F9 ouvrir la derni\u00E8re fen\u00EAtre d'une session restaur\u00E9e.",
    restore_new_windows_label: "Restaurer dans de nouvelles fen\u00EAtres",
    restore_new_windows_description: "Chaque fen\u00EAtre enregistr\u00E9e s'ouvre s\u00E9par\u00E9ment. La fen\u00EAtre actuelle reste inchang\u00E9e.",
    restore_current_window_label: "Restaurer dans la fen\u00EAtre actuelle",
    restore_current_window_description: "La derni\u00E8re fen\u00EAtre enregistr\u00E9e est ajout\u00E9e avant les onglets actuels. Les autres s'ouvrent s\u00E9par\u00E9ment.",
    backup_title: "Sauvegarde",
    backup_description: "Exportez une sauvegarde ou importez des sessions.",
    newsletter_title: "Newsletter",
    newsletter_description: "Recevez les nouveaut\u00E9s de Tab Session Saver.",
    newsletter_email_label: "Adresse e-mail",
    newsletter_email_placeholder: "vous@example.com",
    newsletter_subscribe_button: "S'abonner",
    newsletter_subscribed_status: "Abonn\u00E9 avec {email}.",
    newsletter_duplicate_status: "Cette adresse est d\u00E9j\u00E0 abonn\u00E9e.",
    newsletter_invalid_email: "Saisissez une adresse e-mail valide.",
    newsletter_subscribe_loading: "Abonnement...",
    newsletter_configuration_error: "Le service newsletter n'est pas encore configur\u00E9.",
    newsletter_request_error: "Impossible de mettre \u00E0 jour l'abonnement. R\u00E9essayez.",
    cloud_sync_title: "Cloud Sync",
    cloud_sync_description: "Synchronisation optionnelle entre appareils. Les sessions locales fonctionnent sans compte.",
    cloud_sync_limits_note: "Limite cloud actuelle : jusqu'\u00E0 10 sessions synchronis\u00E9es, 300 URL au total et un instantan\u00E9 de 512 Ko.",
    cloud_sync_auto_note: "Apr\u00E8s des changements locaux, Cloud Sync envoie automatiquement dans environ 10 minutes et tente aussi une synchronisation \u00E0 la fermeture du navigateur. Les \u00E9critures Push sont limit\u00E9es par le service cloud.",
    cloud_sync_register_button: "Cr\u00E9er un compte sync / Connexion",
    cloud_sync_push_button: "Envoyer",
    cloud_sync_pull_button: "R\u00E9cup\u00E9rer",
    cloud_sync_disconnect_button: "D\u00E9sactiver",
    cloud_sync_not_configured: "Connectez-vous avant d'utiliser Cloud Sync.",
    cloud_sync_registered: "Cloud Sync est activ\u00E9.",
    cloud_sync_account_label: "Connect\u00E9 avec {email}.",
    cloud_sync_pushed: "Sessions locales envoy\u00E9es vers le cloud.",
    cloud_sync_pulled: "Sessions cloud r\u00E9cup\u00E9r\u00E9es.",
    cloud_sync_disconnected: "Cloud Sync d\u00E9sactiv\u00E9 sur cet appareil.",
    cloud_sync_request_error: "La requ\u00EAte Cloud Sync a \u00E9chou\u00E9. Reconnectez-vous puis r\u00E9essayez.",
    cloud_sync_quota_exceeded: "Limite Cloud Sync atteinte. Gardez jusqu'\u00E0 {sessions} sessions synchronis\u00E9es et {urls} URL au total.",
    cloud_sync_rate_limited: "L'envoi est temporairement limit\u00E9. R\u00E9essayez dans environ {minutes} min.",
    cloud_sync_no_pending_changes: "Aucun changement local \u00E0 envoyer.",
    cloud_sync_status_idle: "Non connect\u00E9.",
    cloud_sync_status_pending: "Envoi en attente.",
    cloud_sync_status_synced: "Derni\u00E8re synchronisation {time}.",
    auto_save_title: "Enregistrement automatique",
    auto_save_description: "Capture automatiquement la session actuelle selon un intervalle.",
    auto_save_toggle_label: "Activer l'enregistrement automatique",
    auto_save_on_exit_toggle_label: "Enregistrer \u00E0 la fermeture de Chrome",
    auto_save_interval_label: "Enregistrer toutes les",
    auto_save_interval_unit: "minutes",
    auto_save_group_mode_label: "Regroupement automatique",
    auto_save_group_mode_smart: "Intelligent",
    auto_save_group_mode_day: "Par jour",
    auto_save_group_mode_session: "Par session navigateur",
    auto_save_group_mode_none: "Aucun regroupement",
    auto_save_group_browser_title: "Session navigateur",
    auto_save_group_day_title: "Jour",
    auto_save_group_topic_title: "Onglets similaires",
    auto_save_group_count: "{count} sessions",
    add_url_button: "Ajouter une URL",
    add_session_item_button: "Ajouter un \u00E9l\u00E9ment",
    add_session_window_button: "Ajouter comme fen\u00EAtre",
    add_url_prompt: "Saisissez une URL ou recherche \u00E0 ajouter \u00E0 cette session :",
    add_url_invalid: "Saisissez une URL ou recherche valide.",
    add_url_failed: "Impossible d'ajouter cet \u00E9l\u00E9ment.",
    remove_window_button: "Supprimer la fen\u00EAtre",
    remove_window_confirm: "Supprimer la fen\u00EAtre {index} de cette session enregistr\u00E9e ?",
    remove_tab_confirm: "Supprimer cet onglet de la session enregistr\u00E9e ?",
    auto_save_filter_group_label: "Source des sessions automatiques",
    auto_save_filter_all: "Toutes",
    auto_save_filter_scheduled: "Planifi\u00E9es",
    auto_save_filter_exit: "\u00C0 la fermeture",
    manual_sessions_tab: "Enregistr\u00E9es manuellement",
    auto_sessions_tab: "Enregistr\u00E9es automatiquement",
    resources_title: "Obtenir l'extension",
    color_blue: "Bleu",
    color_green: "Vert",
    color_yellow: "Jaune",
    color_red: "Rouge",
    color_purple: "Violet",
    delete_button: "Supprimer",
    rename_button: "Renommer",
    preview_button: "Afficher l'aper\u00E7u",
    preview_hide_button: "Masquer l'aper\u00E7u",
    preview_title: "Onglets enregistr\u00E9s",
    preview_window_label: "Fen\u00EAtre {index}",
    preview_empty: "Aucun onglet dans cette session",
    session_menu_label: "Menu de session",
    session_default_name: "Session",
    rename_prompt: "Entrez un nouveau nom pour cette session :",
    chrome_store_link: "Installer depuis le Chrome Web Store",
    github_link: "Code source sur GitHub",
    developer_website_link: "Site du développeur",
    privacy_policy_link: "Politique de confidentialit\u00E9",
    version_label: "Version :",
    rights_reserved: "Tous droits r\u00E9serv\u00E9s",
    empty_state_title: "Aucune session enregistr\u00E9e pour le moment",
    empty_state_description: "Enregistrez la fen\u00EAtre actuelle pour constituer votre collection et tout rouvrir imm\u00E9diatement.",
    tab_count_one: "1 onglet",
    tab_count_other: "{count} onglets",
    window_count_one: "1 fen\u00EAtre",
    window_count_other: "{count} fen\u00EAtres",
    group_count_one: "1 groupe",
    group_count_other: "{count} groupes",
    desktop_scope_workspace: "Bureau actuel",
    browser_support_label: "Compatibilité navigateur",
    browser_support_loading: "Détection du navigateur…",
    browser_support_supported: "Pris en charge",
    browser_support_not_supported: "Non pris en charge officiellement",
    browser_support_unknown: "Inconnu",
    browser_support_detected: "Navigateur détecté",
    browser_support_official: "Navigateur officiel",
    browser_support_status: "Statut",
    browser_support_description: "Cette extension est officiellement développée et testée pour Google Chrome. Les navigateurs basés sur Chromium peuvent se comporter différemment, notamment pour la restauration de session, les groupes d'onglets et le multi-fenêtre.",
    browser_warning_text: "Navigateur non pris en charge détecté. Certaines fonctions de restauration, groupes d'onglets et comportements multi-fenêtres peuvent différer de Google Chrome standard.",
    browser_warning_unknown_text: "Le navigateur n'a pas pu être identifié de manière fiable. Le support officiel est fourni pour Google Chrome."
  },
  de: {
    title: "Tab-Sitzungsspeicher",
    subtitle: "Halte deine Arbeitsbereiche mit einem Klick bereit.",
    save_button: "Aktuelle Tabs speichern",
    search_sessions_label: "Gespeicherte Sitzungen durchsuchen",
    search_sessions_placeholder: "Sitzungen, Tabs oder Websites suchen",
    close_search_label: "Suche schlie\u00DFen",
    search_no_results_title: "Keine passenden Sitzungen",
    search_no_results_description: "Versuchen Sie einen anderen Sitzungsnamen, Tabtitel oder eine andere Website.",
    restore_button: "Wiederherstellen",
    restore_session_button: "Gesamte Sitzung wiederherstellen",
    restore_window_button: "Fenster wiederherstellen",
    restore_in_progress: "Wiederherstellung...",
    restore_in_progress_message: "Eine Sitzungswiederherstellung l\u00E4uft bereits.",
    reorder_session_label: "Ziehen, um die Sitzung neu zu sortieren",
    create_folder_label: "Ordner erstellen",
    create_folder_prompt: "Ordnername:",
    default_folder_name: "Neuer Ordner",
    folder_empty: "Sitzungen hier ablegen",
    delete_folder_label: "Ordner l\u00F6schen",
    delete_folder_empty_confirm: "Ordner \"{name}\" l\u00F6schen?",
    delete_folder_with_sessions_confirm: "Ordner \"{name}\" enth\u00E4lt {count} Sitzungen. Diese Sitzungen ebenfalls l\u00F6schen?",
    delete_folder_keep_sessions_confirm: "Sitzungen behalten und nur Ordner \"{name}\" l\u00F6schen?",
    unfiled_sessions_title: "Weitere Sitzungen",
    export_button: "Gespeicherte Sitzungen exportieren (JSON)",
    import_button: "Sitzungen importieren (JSON)",
    settings_title: "Einstellungen",
    language_label: "Sprache",
    dark_mode_label: "Dunkelmodus",
    color_label: "Akzentfarbe",
    appearance_title: "Darstellung",
    popup_size_label: "Popup-Gr\u00F6\u00DFe",
    popup_size_small: "Klein",
    popup_size_medium: "Mittel",
    popup_size_large: "Gro\u00DF",
    popup_size_huge: "Riesig (voller Tab)",
    restore_behavior_title: "Wiederherstellungsverhalten",
    restore_behavior_description: "W\u00E4hlen Sie, wo das letzte Fenster einer Sitzung ge\u00F6ffnet wird.",
    restore_new_windows_label: "In neuen Fenstern wiederherstellen",
    restore_new_windows_description: "Jedes gespeicherte Fenster wird separat ge\u00F6ffnet. Das aktuelle Fenster bleibt unver\u00E4ndert.",
    restore_current_window_label: "Im aktuellen Fenster wiederherstellen",
    restore_current_window_description: "Das letzte gespeicherte Fenster wird vor den aktuellen Tabs eingef\u00FCgt. Weitere Fenster werden separat ge\u00F6ffnet.",
    backup_title: "Sicherung",
    backup_description: "Sicherung exportieren oder Sitzungen importieren.",
    newsletter_title: "Newsletter",
    newsletter_description: "Erhalte Neuigkeiten zu Tab Session Saver-Funktionen.",
    newsletter_email_label: "E-Mail-Adresse",
    newsletter_email_placeholder: "du@example.com",
    newsletter_subscribe_button: "Abonnieren",
    newsletter_subscribed_status: "Abonniert als {email}.",
    newsletter_duplicate_status: "Diese E-Mail ist bereits abonniert.",
    newsletter_invalid_email: "Gib eine g\u00FCltige E-Mail-Adresse ein.",
    newsletter_subscribe_loading: "Wird abonniert...",
    newsletter_configuration_error: "Der Newsletter-Dienst ist noch nicht konfiguriert.",
    newsletter_request_error: "Newsletter-Abonnement konnte nicht aktualisiert werden. Bitte versuche es erneut.",
    cloud_sync_title: "Cloud Sync",
    cloud_sync_description: "Optionale Synchronisierung zwischen Ger\u00E4ten. Lokale Sitzungen funktionieren ohne Konto.",
    cloud_sync_limits_note: "Aktuelles Cloud-Limit: bis zu 10 synchronisierte Sitzungen, 300 URLs insgesamt und ein 512-KB-Snapshot.",
    cloud_sync_auto_note: "Nach lokalen \u00C4nderungen l\u00E4dt Cloud Sync nach etwa 10 Minuten automatisch hoch und versucht auch beim Schlie\u00DFen des Browsers zu synchronisieren. Push-Schreibvorg\u00E4nge werden vom Cloud-Dienst begrenzt.",
    cloud_sync_register_button: "Sync-Konto erstellen / Anmelden",
    cloud_sync_push_button: "Hochladen",
    cloud_sync_pull_button: "Herunterladen",
    cloud_sync_disconnect_button: "Deaktivieren",
    cloud_sync_not_configured: "Melde dich an, bevor du Cloud Sync verwendest.",
    cloud_sync_registered: "Cloud Sync ist aktiviert.",
    cloud_sync_account_label: "Angemeldet als {email}.",
    cloud_sync_pushed: "Lokale Sitzungen in die Cloud hochgeladen.",
    cloud_sync_pulled: "Cloud-Sitzungen heruntergeladen.",
    cloud_sync_disconnected: "Cloud Sync auf diesem Ger\u00E4t deaktiviert.",
    cloud_sync_request_error: "Cloud-Sync-Anfrage fehlgeschlagen. Melde dich erneut an und versuche es noch einmal.",
    cloud_sync_quota_exceeded: "Cloud-Sync-Limit erreicht. Behalte bis zu {sessions} synchronisierte Sitzungen und {urls} URLs insgesamt.",
    cloud_sync_rate_limited: "Push ist vor\u00FCbergehend begrenzt. Versuche es in etwa {minutes} Min. erneut.",
    cloud_sync_no_pending_changes: "Keine lokalen \u00C4nderungen zum Hochladen.",
    cloud_sync_status_idle: "Nicht verbunden.",
    cloud_sync_status_pending: "Upload ausstehend.",
    cloud_sync_status_synced: "Zuletzt synchronisiert {time}.",
    auto_save_title: "Automatisch speichern",
    auto_save_description: "Speichert die aktuelle Sitzung automatisch in einem festen Intervall.",
    auto_save_toggle_label: "Automatisches Speichern aktivieren",
    auto_save_on_exit_toggle_label: "Beim Schlie\u00DFen von Chrome speichern",
    auto_save_interval_label: "Speichern alle",
    auto_save_interval_unit: "Minuten",
    auto_save_group_mode_label: "Auto-Save-Gruppierung",
    auto_save_group_mode_smart: "Smart",
    auto_save_group_mode_day: "Nach Tag",
    auto_save_group_mode_session: "Nach Browsersitzung",
    auto_save_group_mode_none: "Keine Gruppierung",
    auto_save_group_browser_title: "Browsersitzung",
    auto_save_group_day_title: "Tag",
    auto_save_group_topic_title: "\u00C4hnliche Tabs",
    auto_save_group_count: "{count} Sitzungen",
    add_url_button: "URL hinzuf\u00FCgen",
    add_session_item_button: "Element hinzuf\u00FCgen",
    add_session_window_button: "Als Fenster hinzuf\u00FCgen",
    add_url_prompt: "Gib eine URL oder Suche ein, die zu dieser Sitzung hinzugef\u00FCgt werden soll:",
    add_url_invalid: "Gib eine g\u00FCltige URL oder Suche ein.",
    add_url_failed: "Dieses Element konnte nicht hinzugef\u00FCgt werden.",
    remove_window_button: "Fenster l\u00F6schen",
    remove_window_confirm: "Fenster {index} aus dieser gespeicherten Sitzung l\u00F6schen?",
    remove_tab_confirm: "Diesen Tab aus der gespeicherten Sitzung entfernen?",
    auto_save_filter_group_label: "Quelle automatisch gespeicherter Sitzungen",
    auto_save_filter_all: "Alle",
    auto_save_filter_scheduled: "Geplant",
    auto_save_filter_exit: "Beim Schlie\u00DFen",
    manual_sessions_tab: "Manuell gespeichert",
    auto_sessions_tab: "Automatisch gespeichert",
    resources_title: "Erweiterung beziehen",
    color_blue: "Blau",
    color_green: "Gr\u00FCn",
    color_yellow: "Gelb",
    color_red: "Rot",
    color_purple: "Lila",
    delete_button: "L\u00F6schen",
    rename_button: "Umbenennen",
    preview_button: "Vorschau anzeigen",
    preview_hide_button: "Vorschau ausblenden",
    preview_title: "Gespeicherte Tabs",
    preview_window_label: "Fenster {index}",
    preview_empty: "Keine Tabs in dieser Sitzung",
    session_menu_label: "Sitzungsmen\u00FC",
    session_default_name: "Sitzung",
    rename_prompt: "Gib einen neuen Namen f\u00FCr diese Sitzung ein:",
    chrome_store_link: "Aus dem Chrome Web Store installieren",
    github_link: "Quellcode auf GitHub",
    developer_website_link: "Entwickler-Website",
    privacy_policy_link: "Datenschutzerkl\u00E4rung",
    version_label: "Version:",
    rights_reserved: "Alle Rechte vorbehalten",
    empty_state_title: "Noch keine Sitzungen gespeichert",
    empty_state_description: "Speichere das aktuelle Fenster, um deine Sammlung aufzubauen und alles sofort erneut zu \u00F6ffnen.",
    tab_count_one: "1 Tab",
    tab_count_other: "{count} Tabs",
    window_count_one: "1 Fenster",
    window_count_other: "{count} Fenster",
    group_count_one: "1 Gruppe",
    group_count_other: "{count} Gruppen",
    desktop_scope_workspace: "Aktueller Desktop",
    browser_support_label: "Browser-Unterstützung",
    browser_support_loading: "Browser wird erkannt…",
    browser_support_supported: "Unterstützt",
    browser_support_not_supported: "Nicht offiziell unterstützt",
    browser_support_unknown: "Unbekannt",
    browser_support_detected: "Erkannter Browser",
    browser_support_official: "Offizieller Browser",
    browser_support_status: "Status",
    browser_support_description: "Diese Erweiterung wird offiziell für Google Chrome entwickelt und getestet. Chromium-basierte Browser können sich anders verhalten, besonders bei Sitzungswiederherstellung, Tab-Gruppen und mehreren Fenstern.",
    browser_warning_text: "Nicht unterstützter Browser erkannt. Einige Wiederherstellungsfunktionen, Tab-Gruppen und Multi-Fenster-Verhalten können sich von Standard-Google-Chrome unterscheiden.",
    browser_warning_unknown_text: "Der Browser konnte nicht zuverlässig identifiziert werden. Offizieller Support wird für Google Chrome bereitgestellt."
  }
};

const TAB_GROUP_COLORS = new Set(['grey', 'blue', 'red', 'yellow', 'green', 'cyan', 'orange', 'pink', 'purple']);
const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;
const MAX_CLIENT_STRING_LENGTH = 4096;
const SAFE_RESTORE_PROTOCOLS = new Set([
  'http:',
  'https:',
  'file:',
  'chrome:',
  'chrome-extension:',
  'edge:',
  'brave:',
  'opera:',
  'vivaldi:'
]);
const SAFE_FAVICON_PROTOCOLS = new Set(['http:', 'https:', 'chrome:', 'chrome-extension:']);

const localeMap = {
  en: 'en-US',
  es: 'es-ES',
  it: 'it-IT',
  fr: 'fr-FR',
  de: 'de-DE'
};

const AUTO_SAVE_MIN_INTERVAL_MINUTES = 10;
const SAVE_TYPE_AUTO = 'auto';
const SAVE_TYPE_MANUAL = 'manual';
const AUTO_SAVE_TRIGGER_ALL = 'all';
const AUTO_SAVE_TRIGGER_SCHEDULED = 'scheduled';
const AUTO_SAVE_TRIGGER_EXIT = 'exit';
const AUTO_SAVE_GROUP_MODE_SMART = 'smart';
const AUTO_SAVE_GROUP_MODE_DAY = 'day';
const AUTO_SAVE_GROUP_MODE_SESSION = 'session';
const AUTO_SAVE_GROUP_MODE_NONE = 'none';
const SESSION_FOLDERS_KEY = 'sessionFolders';

let currentLanguage = 'en';
let reloadSessions = () => {};
let restoreRequestInFlight = false;

function normalizePopupSize(value) {
  return ['small', 'medium', 'large', 'huge'].includes(value) ? value : 'medium';
}

// Translation function
function translatePage(lang) {
  currentLanguage = lang;
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-translate-placeholder]').forEach((element) => {
    const key = element.getAttribute('data-translate-placeholder');
    if (translations[lang] && translations[lang][key]) {
      element.setAttribute('placeholder', translations[lang][key]);
    }
  });

  document.querySelectorAll('[data-translate-aria-label]').forEach((element) => {
    const key = element.getAttribute('data-translate-aria-label');
    if (translations[lang] && translations[lang][key]) {
      element.setAttribute('aria-label', translations[lang][key]);
    }
  });
  
  // Update color options
  const colorOptions = document.querySelectorAll('#accentColor option');
  colorOptions.forEach(option => {
    const key = option.getAttribute('data-translate');
    if (key && translations[lang] && translations[lang][key]) {
      option.textContent = translations[lang][key];
    }
  });

  resetPreviewStates();
}

// Helper function to get translated text
function getTranslation(key) {
  return translations[currentLanguage] && translations[currentLanguage][key] 
    ? translations[currentLanguage][key] 
    : translations['en'][key] || key;
}

function formatTranslation(key, replacements = {}) {
  return getTranslation(key).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(replacements, name) ? String(replacements[name]) : match
  );
}

function combineSessionCollections(existing, additions) {
  const currentSessions = Array.isArray(existing) ? existing : [];
  const newSessions = Array.isArray(additions) ? additions : [];
  return currentSessions.concat(newSessions);
}

function reorderSessionCollection(sessions, fromIndex, toIndex, placement = 'before') {
  const source = Array.isArray(sessions) ? sessions.slice() : [];
  if (
    !Number.isInteger(fromIndex) ||
    !Number.isInteger(toIndex) ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= source.length ||
    toIndex >= source.length ||
    fromIndex === toIndex
  ) {
    return source;
  }

  const [movedSession] = source.splice(fromIndex, 1);
  let insertIndex = toIndex;
  if (fromIndex < toIndex) {
    insertIndex -= 1;
  }
  if (placement === 'after') {
    insertIndex += 1;
  }
  insertIndex = Math.max(0, Math.min(insertIndex, source.length));
  source.splice(insertIndex, 0, movedSession);
  return source;
}

function createRandomId(prefix = '') {
  const bytes = new Uint8Array(12);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return prefix ? `${prefix}_${value}` : value;
}

function normalizeSessionFolderName(value) {
  return typeof value === 'string' && value.trim()
    ? clampString(value.trim(), 80)
    : '';
}

function normalizeSessionFolder(rawFolder) {
  const folder = rawFolder && typeof rawFolder === 'object' ? rawFolder : {};
  const id = typeof folder.id === 'string' && folder.id.trim() ? folder.id.trim() : '';
  const name = normalizeSessionFolderName(folder.name);
  if (!id || !name) return null;
  return {
    id,
    name,
    createdAt: typeof folder.createdAt === 'string' ? folder.createdAt : new Date().toISOString()
  };
}

function getSessionFolderId(session) {
  const id = session?.metadata?.folderId ?? session?.folderId;
  return typeof id === 'string' && id.trim() ? id.trim() : '';
}

function getSessionFolderName(session) {
  return normalizeSessionFolderName(session?.metadata?.folderName ?? session?.folderName);
}

function normalizeSessionFolders(rawFolders = [], sessions = []) {
  const folders = [];
  const seen = new Set();

  (Array.isArray(rawFolders) ? rawFolders : []).forEach((rawFolder) => {
    const folder = normalizeSessionFolder(rawFolder);
    if (!folder || seen.has(folder.id)) return;
    seen.add(folder.id);
    folders.push(folder);
  });

  (Array.isArray(sessions) ? sessions : []).forEach((session) => {
    const id = getSessionFolderId(session);
    const name = getSessionFolderName(session);
    if (!id || !name || seen.has(id)) return;
    seen.add(id);
    folders.push({ id, name, createdAt: new Date().toISOString() });
  });

  return folders;
}

function setSessionFolder(session, folder = null) {
  const next = normalizeSessionSnapshot(session);
  const metadata = { ...(next.metadata || {}) };
  if (folder?.id && folder?.name) {
    metadata.folderId = folder.id;
    metadata.folderName = folder.name;
  } else {
    delete metadata.folderId;
    delete metadata.folderName;
  }
  return { ...next, metadata };
}

function moveSessionToFolderCollection(sessions, fromIndex, folder = null, toIndex = null, placement = 'after') {
  const source = Array.isArray(sessions)
    ? sessions.map((session) => normalizeSessionSnapshot(session))
    : [];
  if (!Number.isInteger(fromIndex) || fromIndex < 0 || fromIndex >= source.length) return source;

  source[fromIndex] = setSessionFolder(source[fromIndex], folder);
  if (Number.isInteger(toIndex) && toIndex >= 0 && toIndex < source.length && toIndex !== fromIndex) {
    return reorderSessionCollection(source, fromIndex, toIndex, placement);
  }

  const [movedSession] = source.splice(fromIndex, 1);
  const targetFolderId = folder?.id || '';
  let insertIndex = source.length;
  for (let index = source.length - 1; index >= 0; index -= 1) {
    if (getSessionFolderId(source[index]) === targetFolderId) {
      insertIndex = index + 1;
      break;
    }
  }
  source.splice(insertIndex, 0, movedSession);
  return source;
}

function normalizeAutoSaveSettings(rawSettings = {}) {
  const settings = rawSettings && typeof rawSettings === 'object' ? rawSettings : {};
  const parsedInterval = Number.parseInt(settings.intervalMinutes, 10);
  const intervalMinutes = Number.isFinite(parsedInterval)
    ? Math.max(AUTO_SAVE_MIN_INTERVAL_MINUTES, parsedInterval)
    : AUTO_SAVE_MIN_INTERVAL_MINUTES;

  return {
    enabled: settings.enabled === true,
    intervalMinutes,
    exitEnabled: settings.exitEnabled === true
  };
}

function normalizeNewsletterEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function normalizeNewsletterSubscription(rawState = {}) {
  const state = rawState && typeof rawState === 'object' ? rawState : {};
  const email = normalizeNewsletterEmail(state.email);
  const subscribed = state.subscribed === true && Boolean(email);
  return {
    subscribed,
    email: subscribed ? email : '',
    subscribedAt: subscribed && typeof state.subscribedAt === 'string' ? state.subscribedAt : null
  };
}

function getSessionSaveType(session) {
  const metadataType = session?.metadata?.saveType;
  const topLevelType = session?.saveType;
  return topLevelType === SAVE_TYPE_AUTO || metadataType === SAVE_TYPE_AUTO
    ? SAVE_TYPE_AUTO
    : SAVE_TYPE_MANUAL;
}

function getSessionsBySaveType(sessions, saveType) {
  const targetType = saveType === SAVE_TYPE_AUTO ? SAVE_TYPE_AUTO : SAVE_TYPE_MANUAL;
  return (Array.isArray(sessions) ? sessions : []).filter((session) =>
    getSessionSaveType(session) === targetType
  );
}

function getSessionSaveTrigger(session) {
  if (getSessionSaveType(session) !== SAVE_TYPE_AUTO) {
    return SAVE_TYPE_MANUAL;
  }
  const trigger = session?.saveTrigger ?? session?.metadata?.saveTrigger;
  return trigger === AUTO_SAVE_TRIGGER_EXIT ? AUTO_SAVE_TRIGGER_EXIT : AUTO_SAVE_TRIGGER_SCHEDULED;
}

function getSessionsByAutoSaveTrigger(sessions, trigger) {
  const autoSessions = getSessionsBySaveType(sessions, SAVE_TYPE_AUTO);
  if (trigger !== AUTO_SAVE_TRIGGER_SCHEDULED && trigger !== AUTO_SAVE_TRIGGER_EXIT) {
    return autoSessions;
  }
  return autoSessions.filter((session) => getSessionSaveTrigger(session) === trigger);
}

function getAutoSaveGroupMode() {
  const value = localStorage.getItem('autoSaveGroupMode');
  return [
    AUTO_SAVE_GROUP_MODE_SMART,
    AUTO_SAVE_GROUP_MODE_DAY,
    AUTO_SAVE_GROUP_MODE_SESSION,
    AUTO_SAVE_GROUP_MODE_NONE
  ].includes(value)
    ? value
    : AUTO_SAVE_GROUP_MODE_SMART;
}

function getAutoSaveBaseDomain(url) {
  if (typeof url !== 'string') return '';
  try {
    const hostname = new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
    if (!hostname) return '';
    if (hostname === 'localhost' || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
      return hostname;
    }
    const parts = hostname.split('.').filter(Boolean);
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  } catch (_) {
    return '';
  }
}

function getAutoSaveTopicSignature(session) {
  const counts = new Map();
  const windows = Array.isArray(session?.windows) ? session.windows : [];
  windows.forEach((browserWindow) => {
    const tabs = Array.isArray(browserWindow?.tabs) ? browserWindow.tabs : [];
    tabs.forEach((tab) => {
      const domain = getAutoSaveBaseDomain(tab?.url);
      if (!domain) return;
      counts.set(domain, (counts.get(domain) || 0) + 1);
    });
  });

  if (!counts.size) return null;
  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0][0];
}

function getAutoSaveGroupKey(match, mode) {
  const session = match?.sessionData || {};
  if (mode === AUTO_SAVE_GROUP_MODE_DAY) {
    const timestamp = typeof session.timestamp === 'string' ? session.timestamp : '';
    return timestamp.slice(0, 10) || `single:${match.originalIndex}`;
  }
  if (mode === AUTO_SAVE_GROUP_MODE_SESSION) {
    return session?.metadata?.autoSaveRunId || `single:${match.originalIndex}`;
  }
  if (mode === AUTO_SAVE_GROUP_MODE_SMART) {
    return session?.metadata?.autoSaveRunId || getAutoSaveTopicSignature(session) || `single:${match.originalIndex}`;
  }
  return `single:${match.originalIndex}`;
}

function getAutoSaveGroupReason(match, mode) {
  const session = match?.sessionData || {};
  if (mode === AUTO_SAVE_GROUP_MODE_DAY) return 'day';
  if (mode === AUTO_SAVE_GROUP_MODE_SESSION) return session?.metadata?.autoSaveRunId ? 'browser' : 'single';
  if (mode === AUTO_SAVE_GROUP_MODE_SMART) {
    if (session?.metadata?.autoSaveRunId) return 'browser';
    return getAutoSaveTopicSignature(session) ? 'topic' : 'single';
  }
  return 'single';
}

function getSessionSortTime(match) {
  const timestamp = match?.sessionData?.timestamp;
  const parsed = typeof timestamp === 'string' ? Date.parse(timestamp) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

function groupAutoSavedSessionsForDisplay(matches, requestedMode = null) {
  const mode = requestedMode || getAutoSaveGroupMode();
  const sorted = (Array.isArray(matches) ? matches : [])
    .slice()
    .sort((left, right) => getSessionSortTime(right) - getSessionSortTime(left));

  if (mode === AUTO_SAVE_GROUP_MODE_NONE) {
    return sorted.map((match) => ({
      key: `single:${match.originalIndex}`,
      reason: 'single',
      sessions: [match]
    }));
  }

  const groups = new Map();
  sorted.forEach((match) => {
    const key = getAutoSaveGroupKey(match, mode);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        reason: getAutoSaveGroupReason(match, mode),
        sessions: []
      });
    }
    groups.get(key).sessions.push(match);
  });

  return Array.from(groups.values()).sort((left, right) =>
    getSessionSortTime(right.sessions[0]) - getSessionSortTime(left.sessions[0])
  );
}

function getCustomUrlTabFromInput(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  const hasWhitespace = /\s/.test(trimmed);
  const looksLikeUrl =
    /^www\./i.test(trimmed) ||
    /^localhost(?::|\/|$)/i.test(trimmed) ||
    /^\d{1,3}(?:\.\d{1,3}){3}(?::|\/|$)/.test(trimmed) ||
    /^[^/?#\s]+\.[^/?#\s]+/.test(trimmed);

  let url = '';
  if (hasScheme || (!hasWhitespace && looksLikeUrl)) {
    const candidate = hasScheme ? trimmed : `https://${trimmed}`;
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
      url = parsed.href;
    } catch (_) {
      return null;
    }
  } else {
    url = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  }

  return {
    title: trimmed,
    url,
    pinned: false,
    active: false,
    muted: false,
    favIconUrl: null,
    audible: false,
    discarded: false,
    index: null,
    groupId: -1
  };
}

function addCustomUrlToSession(session, urlValue, options = {}) {
  const tab = getCustomUrlTabFromInput(urlValue);
  if (!tab) return null;
  const next = normalizeSessionSnapshot(session);
  if (!Array.isArray(next.windows) || next.windows.length === 0) {
    next.windows = [{ tabs: [], groups: [] }];
  }
  if (options.newWindow === true) {
    next.windows.push({
      state: 'normal',
      focused: false,
      left: null,
      top: null,
      width: null,
      height: null,
      incognito: false,
      alwaysOnTop: false,
      tabs: [{ ...tab, index: 0 }],
      groups: []
    });
    return next;
  }
  const targetWindow = next.windows[next.windows.length - 1];
  if (!Array.isArray(targetWindow.tabs)) targetWindow.tabs = [];
  targetWindow.tabs.push({ ...tab, index: targetWindow.tabs.length });
  return next;
}

function renderMetaSegments(container, segments) {
  if (!container) return;
  container.textContent = '';
  segments.forEach((segment) => {
    const chip = document.createElement('span');
    chip.textContent = segment;
    container.appendChild(chip);
  });
}

function createMenuIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  [5, 12, 19].forEach((cy) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', String(cy));
    circle.setAttribute('r', '1.5');
    circle.setAttribute('fill', 'currentColor');
    svg.appendChild(circle);
  });
  return svg;
}


function configureRestoreButton(button, idleText) {
  button.dataset.restoreControl = 'true';
  button.dataset.restoreIdleLabel = idleText;
  button.textContent = idleText;
}

function bindSessionPreviewToggle(entry, label, previewButton, togglePreview) {
  entry.addEventListener('click', (event) => {
    if (event.target?.closest?.('.session-actions, .preview-container, .session-drag-handle')) return;
    event.stopPropagation?.();
    togglePreview();
  });

  label.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation?.();
      togglePreview();
    }
  });

  previewButton.addEventListener('click', (event) => {
    event.stopPropagation?.();
    togglePreview();
  });
}

function setRestoreControlsBusy(isBusy) {
  document.querySelectorAll('button[data-restore-control="true"]').forEach((button) => {
    button.disabled = isBusy;
    button.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    button.textContent = isBusy
      ? getTranslation('restore_in_progress')
      : button.dataset.restoreIdleLabel || getTranslation('restore_button');
  });
}

function getRestoreMode() {
  const restoreMode = localStorage.getItem('restoreMode');
  return restoreMode === 'current_window' ? 'current_window' : 'new_windows';
}

function triggerConfiguredRestore(message, options = {}) {
  if (restoreRequestInFlight) return;
  const restoreMode = getRestoreMode();

  chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
    if (chrome.runtime.lastError) {
      console.error('Unable to determine the current window', chrome.runtime.lastError);
      alert('Unable to determine the current browser window.');
      return;
    }

    const targetWindowId = activeTabs?.[0]?.windowId;
    if (restoreMode === 'current_window' && !Number.isInteger(targetWindowId)) {
      alert('Unable to determine the current browser window.');
      return;
    }

    triggerRestoreMessage({ ...message, restoreMode, targetWindowId }, options);
  });

}

function triggerRestoreMessage(message, options = {}) {
  const {
    emptyMessage = 'This session has no windows to restore.',
    closeOnFailure = true
  } = options;

  closeAllMenus();
  if (restoreRequestInFlight) {
    return;
  }
  if (!message) {
    alert(emptyMessage);
    return;
  }

  restoreRequestInFlight = true;
  setRestoreControlsBusy(true);
  chrome.runtime.sendMessage(message, (res) => {
    try {
      const resetRestoreRequest = () => {
        restoreRequestInFlight = false;
        setRestoreControlsBusy(false);
      };
      if (chrome.runtime.lastError) {
        resetRestoreRequest();
        console.error('Restore error', chrome.runtime.lastError);
        alert('Unable to restore this session: ' + String(chrome.runtime.lastError.message));
        return;
      }
      if (!res || !res.success) {
        resetRestoreRequest();
        console.error('Restore failed', res && res.error);
        if (res && res.code === 'RESTORE_IN_PROGRESS') {
          alert(getTranslation('restore_in_progress_message'));
          return;
        }
        alert('Unable to restore this session: ' + (res && res.error ? String(res.error) : 'Unknown error'));
        if (closeOnFailure) {
          window.close();
        }
        return;
      }
      window.close();
    } catch (e) {
      restoreRequestInFlight = false;
      setRestoreControlsBusy(false);
      console.error('Error in restore callback', e);
    }
  });
}

function formatTimestamp(value) {
  const locale = localeMap[currentLanguage] || localeMap.en;
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return { date: '--', time: '--' };
  }
  return {
    date: date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  };
}

function extractHostname(url) {
  if (!url) return '';
  try {
    const hostname = new URL(url).hostname || '';
    return hostname.replace(/^www\./i, '');
  } catch (err) {
    return '';
  }
}

function clampString(value, maxLength = MAX_CLIENT_STRING_LENGTH) {
  if (typeof value !== 'string') return '';
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function normalizeRestorableUrl(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_CLIENT_STRING_LENGTH) return null;

  const lower = trimmed.toLowerCase();
  if (lower === 'about:blank' || lower === 'about:newtab') {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    return SAFE_RESTORE_PROTOCOLS.has(parsed.protocol) ? trimmed : null;
  } catch (_) {
    return null;
  }
}

function sanitizeFaviconUrl(value) {
  if (typeof value !== 'string' || value.length > MAX_CLIENT_STRING_LENGTH) return null;
  if (/^data:image\//i.test(value) && value.length <= 4096) return value;
  try {
    const parsed = new URL(value);
    return SAFE_FAVICON_PROTOCOLS.has(parsed.protocol) ? value : null;
  } catch (_) {
    return null;
  }
}

function sanitizeTabForClient(tab) {
  const url = normalizeRestorableUrl(tab?.url);
  if (!url) return null;
  return {
    title: clampString(typeof tab.title === 'string' && tab.title ? tab.title : url),
    url,
    pinned: Boolean(tab.pinned),
    active: Boolean(tab.active),
    muted: typeof tab.muted === 'boolean' ? tab.muted : Boolean(tab.mutedInfo?.muted),
    favIconUrl: sanitizeFaviconUrl(tab.favIconUrl),
    audible: Boolean(tab.audible),
    discarded: Boolean(tab.discarded),
    index: Number.isInteger(tab.index) ? tab.index : null,
    groupId: Number.isInteger(tab.groupId) ? tab.groupId : -1
  };
}

function sanitizeGroupForClient(group) {
  if (!group || typeof group !== 'object') return null;

  const candidateIds = [group.id, group.groupId];
  let normalizedId = null;
  for (const value of candidateIds) {
    if (Number.isInteger(value)) {
      normalizedId = value;
      break;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number.parseInt(value, 10);
      if (Number.isInteger(parsed)) {
        normalizedId = parsed;
        break;
      }
    }
  }

  if (normalizedId === null) return null;

  const color = typeof group.color === 'string' ? group.color.toLowerCase() : 'grey';

  return {
    id: normalizedId,
    title: clampString(typeof group.title === 'string' ? group.title : '', 256),
    color: TAB_GROUP_COLORS.has(color) ? color : 'grey',
    collapsed: Boolean(group.collapsed)
  };
}

function sanitizeWindowForClient(win) {
  const tabs = Array.isArray(win?.tabs) ? win.tabs : [];
  const groups = Array.isArray(win?.groups) ? win.groups : [];
  const sanitizedGroups = groups.map((group) => sanitizeGroupForClient(group)).filter(Boolean);
  let sanitizedTabs = tabs.map((tab) => sanitizeTabForClient(tab)).filter(Boolean);
  if (sanitizedTabs.some((tab) => Number.isInteger(tab.index))) {
    sanitizedTabs = sanitizedTabs.sort((a, b) => {
      const leftIndex = Number.isInteger(a.index) ? a.index : Number.MAX_SAFE_INTEGER;
      const rightIndex = Number.isInteger(b.index) ? b.index : Number.MAX_SAFE_INTEGER;
      return leftIndex - rightIndex;
    });
  }
  return {
    state: win?.state || 'normal',
    focused: Boolean(win?.focused),
    left: Number.isFinite(win?.left) ? win.left : null,
    top: Number.isFinite(win?.top) ? win.top : null,
    width: Number.isFinite(win?.width) ? win.width : null,
    height: Number.isFinite(win?.height) ? win.height : null,
    incognito: Boolean(win?.incognito),
    alwaysOnTop: Boolean(win?.alwaysOnTop),
    tabs: sanitizedTabs,
    groups: sanitizedGroups
  };
}

function updateSessionLabelMeta(sessionPayload, label) {
  const countInfo = describeSessionCounts(sessionPayload);
  const { date: d, time: t } = formatTimestamp(sessionPayload.timestamp);
  const strategy = sessionPayload.desktopStrategy || sessionPayload.metadata?.desktopStrategy;
  const metaSegments = [d, t, countInfo.windowsLabel, countInfo.tabsLabel];
  if (countInfo.groupsLabel) metaSegments.splice(3, 0, countInfo.groupsLabel);
  if (strategy === 'workspace') metaSegments.push(getTranslation('desktop_scope_workspace'));
  const metaEl = label?.querySelector?.('.session-meta');
  renderMetaSegments(metaEl, metaSegments);
  return countInfo;
}

function createPreviewItem(tab, displayIndex, winSnapshot, sessionPayload, index, label, previewContainer) {
  const item = document.createElement('div');
  item.className = 'preview-item';

  const indexBadge = document.createElement('span');
  indexBadge.className = 'preview-index';
  indexBadge.textContent = String(displayIndex + 1);

  const iconWrapper = document.createElement('span');
  iconWrapper.className = 'preview-favicon';
  if (tab.favIconUrl) {
    const iconImg = document.createElement('img');
    iconImg.src = tab.favIconUrl;
    iconImg.alt = '';
    iconImg.loading = 'lazy';
    iconImg.decoding = 'async';
    iconImg.referrerPolicy = 'no-referrer';
    iconWrapper.appendChild(iconImg);
  } else {
    iconWrapper.classList.add('is-placeholder');
    iconWrapper.textContent = '\u2022';
  }

  const content = document.createElement('div');
  content.className = 'preview-content';

  const rawTitle = (tab.title || tab.url || '').trim();
  const displayTitle = rawTitle.length > 0 ? rawTitle : (tab.url || '');
  const truncatedTitle =
    displayTitle.length > 70 ? `${displayTitle.slice(0, 67)}...` : displayTitle;

  const titleEl = document.createElement('span');
  titleEl.className = 'preview-title';
  titleEl.textContent = truncatedTitle;

  const domain = extractHostname(tab.url);
  if (domain) {
    const domainEl = document.createElement('span');
    domainEl.className = 'preview-domain';
    domainEl.textContent = domain;
    content.appendChild(domainEl);
  }

  content.insertBefore(titleEl, content.firstChild);
  // Remove button for this tab in preview
  const removeBtn = document.createElement('button');
  removeBtn.className = 'preview-remove-btn';
  removeBtn.type = 'button';
  removeBtn.setAttribute('aria-label', 'Remove tab from session');
  removeBtn.textContent = '✕';

  // Handler to remove this tab from session data and UI
  removeBtn.addEventListener('click', (ev) => {
    try {
      ev.stopPropagation();
      const confirmed = confirm(getTranslation('remove_tab_confirm'));
      if (!confirmed) return;

      const currentWindowIndex = Array.isArray(sessionPayload.windows)
        ? sessionPayload.windows.indexOf(winSnapshot)
        : -1;
      if (currentWindowIndex === -1) return;

      const windowTabsArr = Array.isArray(winSnapshot.tabs) ? winSnapshot.tabs : [];
      const currentTabIndex = windowTabsArr.indexOf(tab);
      if (currentTabIndex === -1) return;

      const removedTab = windowTabsArr[currentTabIndex];
      windowTabsArr.splice(currentTabIndex, 1);

      if (removedTab && removedTab.groupId !== -1) {
        const windowGroupsArr = Array.isArray(winSnapshot.groups) ? winSnapshot.groups : [];
        const groupIndex = windowGroupsArr.findIndex(g => g.id === removedTab.groupId);
        if (groupIndex !== -1) {
          const remainingTabsInGroup = windowTabsArr.filter(t => t.groupId === removedTab.groupId);
          if (remainingTabsInGroup.length === 0) {
            windowGroupsArr.splice(groupIndex, 1);
          }
        }
      }

      if (windowTabsArr.length === 0) {
        sessionPayload.windows.splice(currentWindowIndex, 1);
      }

      const countInfo = updateSessionLabelMeta(sessionPayload, label);

      // Persist changes: if no tabs left, delete session; else update session
      if (countInfo.tabsCount === 0) {
        chrome.runtime.sendMessage({ action: 'delete_session', index }, (res) => {
          if (res && res.success) reloadSessions();
        });
      } else {
        chrome.runtime.sendMessage({ action: 'update_session', index, session: sessionPayload }, (res) => {
          if (!res || !res.success) {
            console.error('Failed to update session after tab removal', res && res.error);
            return;
          }
          renderPreview(sessionPayload, previewContainer, index, label);
        });
      }
    } catch (e) {
      console.error('Error in removeBtn click', e);
    }
  });

  item.appendChild(indexBadge);
  item.appendChild(iconWrapper);
  item.appendChild(content);
  item.appendChild(removeBtn);

  return item;
}

function removeWindowFromSavedSession(sessionPayload, windowIndex, index, label, previewContainer) {
  if (!Array.isArray(sessionPayload?.windows)) return;
  if (!Number.isInteger(windowIndex) || windowIndex < 0 || windowIndex >= sessionPayload.windows.length) return;
  if (sessionPayload.windows.length <= 1) return;

  const confirmed = confirm(formatTranslation('remove_window_confirm', { index: windowIndex + 1 }));
  if (!confirmed) return;

  sessionPayload.windows.splice(windowIndex, 1);
  const countInfo = updateSessionLabelMeta(sessionPayload, label);

  if (countInfo.tabsCount === 0) {
    chrome.runtime.sendMessage({ action: 'delete_session', index }, (res) => {
      if (res && res.success) reloadSessions();
    });
    return;
  }

  chrome.runtime.sendMessage({ action: 'update_session', index, session: sessionPayload }, (res) => {
    if (!res || !res.success) {
      console.error('Failed to update session after window removal', res && res.error);
      return;
    }
    renderPreview(sessionPayload, previewContainer, index, label);
  });
}

function renderPreview(sessionPayload, previewContainer, index, label) {
  previewContainer.replaceChildren();
  const countInfo = describeSessionCounts(sessionPayload);

  const previewHeader = document.createElement('div');
  previewHeader.className = 'preview-header';

  const previewTitleWrap = document.createElement('div');
  previewTitleWrap.className = 'preview-header-title';

  const previewTitle = document.createElement('span');
  previewTitle.textContent = getTranslation('preview_title');

  const previewCount = document.createElement('span');
  previewCount.className = 'preview-count preview-count-summary';
  previewCount.textContent = formatCountSummary(countInfo);

  previewTitleWrap.appendChild(previewTitle);
  previewTitleWrap.appendChild(previewCount);
  previewHeader.appendChild(previewTitleWrap);
  previewContainer.appendChild(previewHeader);

  const previewWindowsWrapper = document.createElement('div');
  previewWindowsWrapper.className = 'preview-windows';
  previewContainer.appendChild(previewWindowsWrapper);

  if (!sessionPayload.windows.length) {
    const emptyPreview = document.createElement('div');
    emptyPreview.className = 'preview-empty';
    emptyPreview.textContent = getTranslation('preview_empty');
    previewWindowsWrapper.appendChild(emptyPreview);
    previewContainer.dataset.rendered = 'true';
    return;
  }

  sessionPayload.windows.forEach((winSnapshot, wIndex) => {
    const windowBlock = document.createElement('div');
    windowBlock.className = 'preview-window';

    const windowHeader = document.createElement('div');
    windowHeader.className = 'preview-window-header';

    const windowTabs = Array.isArray(winSnapshot.tabs) ? winSnapshot.tabs : [];
    const windowGroups = Array.isArray(winSnapshot.groups) ? winSnapshot.groups : [];
    const windowTabsLabel =
      windowTabs.length === 1
        ? getTranslation('tab_count_one')
        : getTranslation('tab_count_other').replace('{count}', windowTabs.length);

    const windowHeaderText = document.createElement('div');
    windowHeaderText.className = 'preview-window-title';

    const windowLabel = document.createElement('span');
    windowLabel.textContent = getTranslation('preview_window_label').replace('{index}', wIndex + 1);

    const windowCount = document.createElement('span');
    windowCount.className = 'preview-count';
    windowCount.textContent = windowTabsLabel;

    windowHeaderText.appendChild(windowLabel);
    windowHeaderText.appendChild(windowCount);

    const restoreWindowBtn = document.createElement('button');
    restoreWindowBtn.className = 'restore-window-btn';
    restoreWindowBtn.type = 'button';
    configureRestoreButton(restoreWindowBtn, getTranslation('restore_window_button'));
    restoreWindowBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      triggerConfiguredRestore(
        { action: 'restore_window', windowSnapshot: winSnapshot },
        {
          emptyMessage: 'This window cannot be restored.',
          closeOnFailure: false
        }
      );
    });

    const windowActions = document.createElement('div');
    windowActions.className = 'preview-window-actions';
    windowActions.appendChild(restoreWindowBtn);

    if (sessionPayload.windows.length > 1) {
      const removeWindowBtn = document.createElement('button');
      removeWindowBtn.className = 'preview-window-remove-btn';
      removeWindowBtn.type = 'button';
      removeWindowBtn.setAttribute('aria-label', getTranslation('remove_window_button'));
      removeWindowBtn.setAttribute('title', getTranslation('remove_window_button'));
      removeWindowBtn.textContent = '\u00D7';
      removeWindowBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        removeWindowFromSavedSession(sessionPayload, wIndex, index, label, previewContainer);
      });
      windowActions.appendChild(removeWindowBtn);
    }

    windowHeader.appendChild(windowHeaderText);
    windowHeader.appendChild(windowActions);

    const items = document.createElement('div');
    items.className = 'preview-items';

    if (!windowTabs.length) {
      const emptyTab = document.createElement('div');
      emptyTab.className = 'preview-empty';
      emptyTab.textContent = getTranslation('preview_empty');
      items.appendChild(emptyTab);
    } else {
      const groupedTabs = new Map();
      const ungroupedTabs = [];
      windowTabs.forEach((tab, tabIndex) => {
        if (tab.groupId !== -1 && windowGroups.some(g => g && g.id === tab.groupId)) {
          if (!groupedTabs.has(tab.groupId)) {
            groupedTabs.set(tab.groupId, []);
          }
          groupedTabs.get(tab.groupId).push({ tab, originalIndex: tabIndex });
        } else {
          ungroupedTabs.push({ tab, originalIndex: tabIndex });
        }
      });

      let globalTabIndex = 0;

      ungroupedTabs.forEach(({ tab }) => {
        const item = createPreviewItem(tab, globalTabIndex, winSnapshot, sessionPayload, index, label, previewContainer);
        items.appendChild(item);
        globalTabIndex++;
      });

      windowGroups.forEach(group => {
        const groupTabs = groupedTabs.get(group.id) || [];
        if (groupTabs.length > 0) {
          const groupHeader = document.createElement('div');
          groupHeader.className = 'preview-group-header';
          const groupTitle = document.createElement('span');
          groupTitle.className = 'group-title';
          groupTitle.textContent = group.title || 'Group';
          const groupColor = document.createElement('span');
          groupColor.className = 'group-color';
          groupColor.style.backgroundColor = group.color;
          groupHeader.appendChild(groupTitle);
          groupHeader.appendChild(groupColor);
          items.appendChild(groupHeader);

          const groupContainer = document.createElement('div');
          groupContainer.className = 'preview-group';
          groupTabs.forEach(({ tab }) => {
            const item = createPreviewItem(tab, globalTabIndex, winSnapshot, sessionPayload, index, label, previewContainer);
            groupContainer.appendChild(item);
            globalTabIndex++;
          });
          items.appendChild(groupContainer);
        }
      });
    }

    windowBlock.appendChild(windowHeader);
    windowBlock.appendChild(items);
    previewWindowsWrapper.appendChild(windowBlock);
  });

  previewContainer.dataset.rendered = 'true';
}

function normalizeSessionSnapshot(raw) {
  const base = raw && typeof raw === 'object' ? raw : {};
  const windowsSource = Array.isArray(raw)
    ? [{ tabs: raw }]
    : Array.isArray(base.windows)
    ? base.windows
    : Array.isArray(base.session)
    ? [{ tabs: base.session }]
    : Array.isArray(base.tabs)
    ? [{ tabs: base.tabs }]
    : [];

  const sanitizedWindows = windowsSource.map((win) => sanitizeWindowForClient(win));
  const metadata =
    base.metadata && typeof base.metadata === 'object' ? { ...base.metadata } : {};
  const saveType = getSessionSaveType(base);
  let desktopStrategy = base.desktopStrategy ?? metadata.desktopStrategy ?? null;
  if (desktopStrategy === 'unknown' || desktopStrategy === 'best-effort' || desktopStrategy === 'global') {
    desktopStrategy = null;
  }
  if (metadata.desktopStrategy === 'unknown' || metadata.desktopStrategy === 'best-effort' || metadata.desktopStrategy === 'global') {
    delete metadata.desktopStrategy;
  }
  const desktopKey = base.desktopKey ?? metadata.desktopKey ?? null;
  const platform =
    typeof base.platform === 'string' && base.platform.trim()
      ? base.platform
      : typeof metadata.platform === 'string' && metadata.platform.trim()
      ? metadata.platform.trim()
      : null;

  const metadataForClient = { ...metadata };
  const saveTrigger = getSessionSaveTrigger({ ...base, metadata: metadataForClient, saveType });
  if (typeof desktopKey !== 'undefined') {
    metadataForClient.desktopKey = desktopKey;
  }
  metadataForClient.saveType = saveType;
  if (saveType === SAVE_TYPE_AUTO) {
    metadataForClient.saveTrigger = saveTrigger;
  } else {
    delete metadataForClient.saveTrigger;
  }
  if (platform) {
    metadataForClient.platform = platform;
  } else {
    delete metadataForClient.platform;
  }
  if (desktopStrategy) {
    metadataForClient.desktopStrategy = desktopStrategy;
  } else {
    delete metadataForClient.desktopStrategy;
  }

  const timestamp =
    typeof base.timestamp === 'string' && base.timestamp
      ? base.timestamp
      : new Date().toISOString();
  const name =
    typeof base.name === 'string' && base.name.trim() ? clampString(base.name.trim(), 160) : '';

  const normalized = {
    name,
    timestamp,
    windows: sanitizedWindows,
    metadata: metadataForClient,
    desktopKey,
    platform,
    saveType
  };

  if (desktopStrategy) {
    normalized.desktopStrategy = desktopStrategy;
  }

  return normalized;

}

function normalizeSearchValue(value) {
  return typeof value === 'string' ? value.trim().toLocaleLowerCase() : '';
}

function sessionMatchesQuery(session, query) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return true;

  const searchableValues = [session?.name];
  const windows = Array.isArray(session?.windows) ? session.windows : [];
  windows.forEach((browserWindow) => {
    const tabs = Array.isArray(browserWindow?.tabs) ? browserWindow.tabs : [];
    tabs.forEach((tab) => searchableValues.push(tab?.title, tab?.url));
  });

  return searchableValues.some((value) => normalizeSearchValue(value).includes(normalizedQuery));
}

function getMatchingSessions(sessions, query) {
  const source = Array.isArray(sessions) ? sessions : [];
  return source
    .map((sessionData, originalIndex) => ({ sessionData, originalIndex }))
    .filter(({ sessionData }) => sessionMatchesQuery(sessionData, query));
}

function computeSessionCounts(session) {
  const windows = Array.isArray(session?.windows) ? session.windows : [];
  const windowsCount = windows.length;
  const tabsCount = windows.reduce((total, win) => {
    const tabTotal = Array.isArray(win.tabs) ? win.tabs.length : 0;
    return total + tabTotal;
  }, 0);
  const groupsCount = windows.reduce((total, win) => {
    const groupTotal = Array.isArray(win.groups) ? win.groups.length : 0;
    return total + groupTotal;
  }, 0);
  return { windowsCount, tabsCount, groupsCount };
}

function describeSessionCounts(session) {
  const { windowsCount, tabsCount, groupsCount } = computeSessionCounts(session);
  const tabsLabel =
    tabsCount === 1
      ? getTranslation('tab_count_one')
      : getTranslation('tab_count_other').replace('{count}', tabsCount);
  const windowsLabel =
    windowsCount === 1
      ? getTranslation('window_count_one')
      : getTranslation('window_count_other').replace('{count}', windowsCount);
  const groupsLabel =
    groupsCount > 0
      ? groupsCount === 1
        ? getTranslation('group_count_one')
        : getTranslation('group_count_other').replace('{count}', groupsCount)
      : null;
  return { windowsCount, tabsCount, groupsCount, tabsLabel, windowsLabel, groupsLabel };
}

function formatCountSummary(countInfo) {
  let summary = `${countInfo.tabsLabel} \u2022 ${countInfo.windowsLabel}`;
  if (countInfo.groupsLabel) summary += ` \u2022 ${countInfo.groupsLabel}`;
  return summary;
}

function resetPreviewStates() {
  document.querySelectorAll('.preview-container').forEach(container => {
    container.classList.remove('is-open');
    container.style.display = 'none';
  });
  document.querySelectorAll('button[data-role="preview-toggle"]').forEach(button => {
    button.textContent = getTranslation('preview_button');
  });
}

function closeAllMenus(options = {}) {
  const { preservePreviews = false } = options;
  document.querySelectorAll('.menu-content').forEach(menu => {
    menu.style.display = 'none';
    menu.style.removeProperty('top');
    menu.style.removeProperty('left');
      // Restore menu to original parent if it was moved to body
      if (menu._originalParent && document.body.contains(menu)) {
        menu._originalParent.appendChild(menu);
      }
  });
  document.querySelectorAll('.menu-button[aria-expanded]').forEach(button => {
    button.setAttribute('aria-expanded', 'false');
  });
  if (!preservePreviews) {
    resetPreviewStates();
  }
  document.querySelectorAll('.session-entry.menu-open').forEach(entry => {
    entry.classList.remove('menu-open');
    entry.style.removeProperty('margin-bottom');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const accentSelect = document.getElementById('accentColor');
  const darkToggle = document.getElementById('darkMode');
  const languageSelect = document.getElementById('language');
  const popupSizeSelect = document.getElementById('popupSize');
  const restoreModeInputs = document.querySelectorAll('input[name="restoreMode"]');
  const autoSaveEnabledToggle = document.getElementById('autoSaveEnabled');
  const autoSaveOnExitEnabledToggle = document.getElementById('autoSaveOnExitEnabled');
  const autoSaveIntervalInput = document.getElementById('autoSaveInterval');
  const autoSaveIntervalGroup = document.getElementById('autoSaveIntervalGroup');
  const autoSaveGroupModeSelect = document.getElementById('autoSaveGroupMode');
  const sessionCategoryTabs = document.querySelectorAll('[data-session-category]');
  const autoSaveTriggerFilters = document.getElementById('auto-save-trigger-filters');
  const autoSaveTriggerButtons = document.querySelectorAll('[data-auto-save-trigger]');
  const searchToolbar = document.querySelector('.session-toolbar');
  const createFolderBtn = document.getElementById('create-folder');
  const searchToggle = document.getElementById('session-search-toggle');
  const searchInput = document.getElementById('session-search-input');
  const searchClose = document.getElementById('session-search-close');
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmailInput = document.getElementById('newsletterEmail');
  const newsletterSubmitBtn = document.getElementById('newsletterSubmit');
  const newsletterStatus = document.getElementById('newsletterStatus');
  const cloudSyncForm = document.getElementById('cloud-sync-form');
  const cloudSyncAccount = document.getElementById('cloudSyncAccount');
  const cloudSyncLoginBtn = document.getElementById('cloudSyncLogin');
  const cloudSyncPushBtn = document.getElementById('cloudSyncPush');
  const cloudSyncPullBtn = document.getElementById('cloudSyncPull');
  const cloudSyncDisconnectBtn = document.getElementById('cloudSyncDisconnect');
  const cloudSyncStatus = document.getElementById('cloudSyncStatus');
  let latestSessions = [];
  let sessionFolders = [];
  let activeSessionCategory = SAVE_TYPE_MANUAL;
  let activeAutoSaveTrigger = AUTO_SAVE_TRIGGER_ALL;
  let newsletterState = normalizeNewsletterSubscription();
  let cloudSyncSettingsState = null;
  let activeDragSessionIndex = null;
  let activeDropPlacement = 'before';
  const isPopupPage = window.location.pathname.endsWith('/popup.html');
  const isFullTabPopupView = new URLSearchParams(window.location.search).get('view') === 'tab';

  document.addEventListener('click', closeAllMenus);

  function applyPopupSize(size) {
    const selectedSize = normalizePopupSize(size);
    const effectiveSize = selectedSize === 'huge' && isPopupPage && !isFullTabPopupView
      ? 'large'
      : selectedSize;
    if (!isPopupPage) return selectedSize;

    ['small', 'medium', 'large', 'huge'].forEach((candidate) => {
      document.documentElement.classList.toggle(`size-${candidate}`, candidate === effectiveSize && candidate !== 'medium');
      document.body.classList.toggle(`size-${candidate}`, candidate === effectiveSize && candidate !== 'medium');
    });
    return selectedSize;
  }

  const savedPopupSize = applyPopupSize(localStorage.getItem('popupSize') || 'medium');
  chrome.storage?.local?.get('popupSize', (stored) => {
    const storedSize = normalizePopupSize(stored?.popupSize || savedPopupSize);
    localStorage.setItem('popupSize', storedSize);
    applyPopupSize(storedSize);
    if (popupSizeSelect) popupSizeSelect.value = storedSize;
    if (!stored?.popupSize) {
      chrome.storage.local.set({ popupSize: storedSize });
    }
    chrome.runtime?.sendMessage?.({ action: 'set_popup_size', size: storedSize }, () => {});
  });
  if (popupSizeSelect) {
    popupSizeSelect.value = savedPopupSize;
    popupSizeSelect.addEventListener('change', (event) => {
      const nextSize = normalizePopupSize(event.target.value);
      applyPopupSize(nextSize);
      localStorage.setItem('popupSize', nextSize);
      chrome.storage?.local?.set({ popupSize: nextSize });
      chrome.runtime?.sendMessage?.({ action: 'set_popup_size', size: nextSize }, () => {});
    });
  }

  function setSessionSearchOpen(isOpen) {
    searchToolbar?.classList.toggle('search-open', isOpen);
    searchToggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      searchInput?.focus();
      return;
    }
    if (searchInput) searchInput.value = '';
    renderSessionList(latestSessions, '');
    searchToggle?.focus();
  }

  searchToggle?.addEventListener('click', () => setSessionSearchOpen(true));
  searchClose?.addEventListener('click', () => setSessionSearchOpen(false));
  searchInput?.addEventListener('input', (event) => {
    renderSessionList(latestSessions, event.target.value);
  });
  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setSessionSearchOpen(false);
    }
  });

  function setActiveSessionCategory(category) {
    activeSessionCategory = category === SAVE_TYPE_AUTO ? SAVE_TYPE_AUTO : SAVE_TYPE_MANUAL;
    sessionCategoryTabs.forEach((tab) => {
      const isActive = tab.getAttribute('data-session-category') === activeSessionCategory;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    updateAutoSaveTriggerVisibility();
    renderSessionList(latestSessions, searchInput?.value || '');
  }

  function updateAutoSaveTriggerVisibility() {
    if (!autoSaveTriggerFilters) return;
    const isVisible = activeSessionCategory === SAVE_TYPE_AUTO;
    autoSaveTriggerFilters.hidden = !isVisible;
  }

  function setAutoSaveTriggerFilter(trigger) {
    activeAutoSaveTrigger =
      trigger === AUTO_SAVE_TRIGGER_SCHEDULED || trigger === AUTO_SAVE_TRIGGER_EXIT
        ? trigger
        : AUTO_SAVE_TRIGGER_ALL;
    autoSaveTriggerButtons.forEach((button) => {
      const isActive = button.getAttribute('data-auto-save-trigger') === activeAutoSaveTrigger;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    renderSessionList(latestSessions, searchInput?.value || '');
  }

  sessionCategoryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setActiveSessionCategory(tab.getAttribute('data-session-category'));
    });
  });

  autoSaveTriggerButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setAutoSaveTriggerFilter(button.getAttribute('data-auto-save-trigger'));
    });
  });

  function updateAutoSaveIntervalVisibility(settings) {
    const normalized = normalizeAutoSaveSettings(settings);
    if (autoSaveEnabledToggle) autoSaveEnabledToggle.checked = normalized.enabled;
    if (autoSaveOnExitEnabledToggle) autoSaveOnExitEnabledToggle.checked = normalized.exitEnabled;
    if (autoSaveIntervalInput) autoSaveIntervalInput.value = String(normalized.intervalMinutes);
    autoSaveIntervalGroup?.classList.toggle('is-visible', normalized.enabled);
  }

  function persistAutoSaveSettings() {
    const settings = normalizeAutoSaveSettings({
      enabled: autoSaveEnabledToggle?.checked === true,
      intervalMinutes: autoSaveIntervalInput?.value,
      exitEnabled: autoSaveOnExitEnabledToggle?.checked === true
    });
    updateAutoSaveIntervalVisibility(settings);

    chrome.runtime.sendMessage(
      { action: 'update_auto_save_settings', settings },
      (response) => {
        if (chrome.runtime.lastError || !response?.success) {
          console.error('Unable to update Auto Save settings', chrome.runtime.lastError || response?.error);
        }
      }
    );
  }

  autoSaveEnabledToggle?.addEventListener('change', persistAutoSaveSettings);
  autoSaveOnExitEnabledToggle?.addEventListener('change', persistAutoSaveSettings);
  autoSaveIntervalInput?.addEventListener('change', persistAutoSaveSettings);
  autoSaveIntervalInput?.addEventListener('blur', persistAutoSaveSettings);
  autoSaveGroupModeSelect?.addEventListener('change', (event) => {
    localStorage.setItem('autoSaveGroupMode', event.target.value);
    renderSessionList(latestSessions, searchInput?.value || '');
  });

  function setNewsletterStatus(key, options = {}) {
    if (!newsletterStatus) return;
    const { type = '', replacements = {} } = options;
    newsletterStatus.textContent = key ? formatTranslation(key, replacements) : '';
    newsletterStatus.classList.toggle('is-success', type === 'success');
    newsletterStatus.classList.toggle('is-error', type === 'error');
  }

  function setNewsletterBusy(isBusy) {
    if (newsletterSubmitBtn) {
      newsletterSubmitBtn.disabled = isBusy || newsletterState.subscribed;
      newsletterSubmitBtn.textContent = isBusy
        ? getTranslation('newsletter_subscribe_loading')
        : getTranslation('newsletter_subscribe_button');
    }
    if (newsletterEmailInput) {
      newsletterEmailInput.disabled = isBusy || newsletterState.subscribed;
    }
  }

  function renderNewsletterState(nextState, statusKey = '') {
    newsletterState = normalizeNewsletterSubscription(nextState);
    if (newsletterEmailInput) {
      newsletterEmailInput.value = newsletterState.email;
      newsletterEmailInput.disabled = newsletterState.subscribed;
    }
    if (newsletterSubmitBtn) {
      newsletterSubmitBtn.disabled = newsletterState.subscribed;
    }
    if (statusKey) {
      setNewsletterStatus(statusKey, {
        type: statusKey === 'newsletter_request_error' || statusKey === 'newsletter_configuration_error' ? 'error' : 'success',
        replacements: { email: newsletterState.email }
      });
    } else if (newsletterState.subscribed) {
      setNewsletterStatus('newsletter_subscribed_status', {
        type: 'success',
        replacements: { email: newsletterState.email }
      });
    } else {
      setNewsletterStatus('');
    }
    setNewsletterBusy(false);
  }

  function getNewsletterErrorKey(response) {
    return response?.code === 'NEWSLETTER_NOT_CONFIGURED'
      ? 'newsletter_configuration_error'
      : 'newsletter_request_error';
  }

  function loadNewsletterSubscription() {
    chrome.runtime.sendMessage({ action: 'get_newsletter_subscription' }, (response) => {
      if (chrome.runtime.lastError || !response?.success) {
        setNewsletterStatus('newsletter_request_error', { type: 'error' });
        setNewsletterBusy(false);
        return;
      }
      renderNewsletterState(response.state);
    });
  }

  newsletterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (newsletterState.subscribed) {
      setNewsletterStatus('newsletter_duplicate_status', { type: 'success' });
      return;
    }
    const email = normalizeNewsletterEmail(newsletterEmailInput?.value || '');
    if (!email) {
      setNewsletterStatus('newsletter_invalid_email', { type: 'error' });
      newsletterEmailInput?.focus();
      return;
    }
    setNewsletterBusy(true);
    chrome.runtime.sendMessage({ action: 'newsletter_subscribe', email }, (response) => {
      if (chrome.runtime.lastError || !response?.success) {
        setNewsletterStatus(getNewsletterErrorKey(response), { type: 'error' });
        setNewsletterBusy(false);
        return;
      }
      renderNewsletterState(
        response.state,
        response.alreadySubscribed ? 'newsletter_duplicate_status' : 'newsletter_subscribed_status'
      );
    });
  });

  function setCloudSyncStatus(key, options = {}) {
    if (!cloudSyncStatus) return;
    const { type = '', replacements = {} } = options;
    cloudSyncStatus.textContent = key ? formatTranslation(key, replacements) : '';
    cloudSyncStatus.classList.toggle('is-success', type === 'success');
    cloudSyncStatus.classList.toggle('is-error', type === 'error');
  }

  function getCloudSyncErrorStatus(response) {
    if (response?.code === 'quota_exceeded') {
      const limits = response.details?.limits || {};
      return {
        key: 'cloud_sync_quota_exceeded',
        replacements: {
          sessions: Number.isInteger(limits['max' + 'Sessions']) ? limits['max' + 'Sessions'] : 10,
          urls: Number.isInteger(limits.maxUrls) ? limits.maxUrls : 300
        }
      };
    }

    if (response?.code === 'rate_limited') {
      const retryAfterSeconds =
        Number.isInteger(response.retryAfterSeconds)
          ? response.retryAfterSeconds
          : Number.isInteger(response.details?.retryAfterSeconds)
          ? response.details.retryAfterSeconds
          : 120;
      return {
        key: 'cloud_sync_rate_limited',
        replacements: {
          minutes: Math.max(1, Math.ceil(retryAfterSeconds / 60))
        }
      };
    }

    return { key: 'cloud_sync_request_error', replacements: {} };
  }

  function setCloudSyncErrorStatus(response) {
    const status = getCloudSyncErrorStatus(response);
    setCloudSyncStatus(status.key, { type: 'error', replacements: status.replacements });
  }

  function setCloudSyncBusy(isBusy) {
    [
      cloudSyncLoginBtn,
      cloudSyncPushBtn,
      cloudSyncPullBtn,
      cloudSyncDisconnectBtn
    ].forEach((button) => {
      if (button) button.disabled = isBusy;
    });
  }

  function renderCloudSyncState(response, statusKey = '') {
    if (!response?.success) {
      setCloudSyncErrorStatus(response);
      return;
    }

    cloudSyncSettingsState = response.settings || cloudSyncSettingsState || {};
    const settings = cloudSyncSettingsState;
    const state = response.state || {};
    const email = settings.profile?.email || '';

    if (cloudSyncAccount) {
      cloudSyncAccount.textContent = email
        ? formatTranslation('cloud_sync_account_label', { email })
        : '';
    }
    if (cloudSyncPushBtn) cloudSyncPushBtn.disabled = !settings.configured;
    if (cloudSyncPullBtn) cloudSyncPullBtn.disabled = !settings.configured;
    if (cloudSyncDisconnectBtn) cloudSyncDisconnectBtn.disabled = !settings.configured;

    if (statusKey) {
      setCloudSyncStatus(statusKey, { type: statusKey === 'cloud_sync_request_error' ? 'error' : 'success' });
      return;
    }
    if (!settings.configured) {
      setCloudSyncStatus('cloud_sync_status_idle');
      return;
    }
    if (state.pending) {
      setCloudSyncStatus('cloud_sync_status_pending');
      return;
    }
    if (state.lastSyncedAt) {
      setCloudSyncStatus('cloud_sync_status_synced', {
        type: 'success',
        replacements: { time: formatTimestamp(state.lastSyncedAt).time }
      });
      return;
    }
    setCloudSyncStatus('');
  }

  function loadCloudSyncSettings() {
    chrome.runtime.sendMessage({ action: 'get_cloud_sync_settings' }, (response) => {
      if (chrome.runtime.lastError || !response?.success) {
        setCloudSyncErrorStatus(response);
        return;
      }
      renderCloudSyncState(response);
    });
  }

  cloudSyncForm?.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  cloudSyncLoginBtn?.addEventListener('click', () => {
    setCloudSyncBusy(true);
    chrome.runtime.sendMessage({ action: 'cloud_sync_login' }, (response) => {
      setCloudSyncBusy(false);
      if (chrome.runtime.lastError || !response?.success) {
        setCloudSyncErrorStatus(response);
        return;
      }
      renderCloudSyncState(response, 'cloud_sync_registered');
    });
  });

  cloudSyncPushBtn?.addEventListener('click', () => {
    setCloudSyncBusy(true);
    chrome.runtime.sendMessage({ action: 'cloud_sync_push' }, (response) => {
      setCloudSyncBusy(false);
      if (chrome.runtime.lastError || !response?.success) {
        setCloudSyncErrorStatus(response);
        return;
      }
      if (response.skipped && response.reason === 'no_pending_changes') {
        renderCloudSyncState({ success: true, settings: cloudSyncSettingsState, state: response.state }, 'cloud_sync_no_pending_changes');
        return;
      }
      renderCloudSyncState({ success: true, settings: cloudSyncSettingsState, state: response.state }, 'cloud_sync_pushed');
    });
  });

  createFolderBtn?.addEventListener('click', () => {
    const folderName = prompt(getTranslation('create_folder_prompt'), getTranslation('default_folder_name'));
    const normalizedName = normalizeSessionFolderName(folderName);
    if (!normalizedName) return;
    const folder = {
      id: createRandomId('folder'),
      name: normalizedName,
      createdAt: new Date().toISOString()
    };
    persistFolderCollection([...sessionFolders, folder], 'create_session_folder');
  });

  cloudSyncPullBtn?.addEventListener('click', () => {
    setCloudSyncBusy(true);
    chrome.runtime.sendMessage({ action: 'cloud_sync_pull' }, (response) => {
      setCloudSyncBusy(false);
      if (chrome.runtime.lastError || !response?.success) {
        setCloudSyncErrorStatus(response);
        return;
      }
      renderCloudSyncState({ success: true, settings: cloudSyncSettingsState, state: response.state }, 'cloud_sync_pulled');
      loadSessions();
    });
  });

  cloudSyncDisconnectBtn?.addEventListener('click', () => {
    setCloudSyncBusy(true);
    chrome.runtime.sendMessage({ action: 'disconnect_cloud_sync' }, (response) => {
      setCloudSyncBusy(false);
      if (chrome.runtime.lastError || !response?.success) {
        setCloudSyncErrorStatus(response);
        return;
      }
      cloudSyncSettingsState = null;
      renderCloudSyncState(
        {
          success: true,
          settings: { enabled: false, configured: false, profile: {} },
          state: {}
        },
        'cloud_sync_disconnected'
      );
    });
  });

  // ACCENT COLOR
  accentSelect?.addEventListener('change', e => {
    document.documentElement.style.setProperty('--accent-color', e.target.value);
    localStorage.setItem('accentColor', e.target.value);
  });

  // DARK MODE
  darkToggle?.addEventListener('change', e => {
    document.body.classList.toggle('dark-mode', e.target.checked);
    document.body.classList.toggle('light-mode', !e.target.checked);
    localStorage.setItem('darkMode', e.target.checked);
  });

  // LANGUAGE SELECTION
  languageSelect?.addEventListener('change', e => {
    const selectedLang = e.target.value;
    translatePage(selectedLang);
    localStorage.setItem('language', selectedLang);
    renderNewsletterState(newsletterState);
    if (document.getElementById('sessions')) {
      loadSessions(); // Reload sessions to update button text
    }
  });

  restoreModeInputs.forEach((input) => {
    input.addEventListener('change', (event) => {
      if (event.target.checked) {
        localStorage.setItem('restoreMode', event.target.value);
      }
    });
  });

  // EXPORT SESSIONS
  const exportBtn = document.getElementById('exportSessions');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'get_sessions' }, (sessions) => {
        try {
          const dataStr = JSON.stringify(sessions, null, 2);
          const blob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const a = document.createElement('a');
          a.href = url;
          a.download = `tabs-sessions-${timestamp}.json`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error('Export error', err);
        }
      });
    });
  }

  // IMPORT SESSIONS
  const importBtn = document.getElementById('importSessions');
  const importInput = document.getElementById('importFileInput');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => {
      importInput.value = null;
      importInput.click();
    });

    importInput.addEventListener('change', (e) => {
      try {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.size > MAX_IMPORT_FILE_BYTES) {
          throw new Error('Import file is too large');
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const parsed = JSON.parse(ev.target.result);
            if (!Array.isArray(parsed)) throw new Error('Invalid format: expected an array');

            const valid = parsed.every(item => item && typeof item === 'object');
            if (!valid) throw new Error('Invalid session objects');

            const replace = confirm('Replace existing sessions with imported ones? Click OK to replace, Cancel to merge.');

            chrome.runtime.sendMessage({ action: 'get_sessions' }, (existingRaw) => {
              try {
                const existing = Array.isArray(existingRaw) ? existingRaw : [];
                let resultSessions = replace ? [] : existing.slice();
                const baseCount = resultSessions.length;

                const importedSessions = parsed.map((item, idx) => {
                  const normalized = normalizeSessionSnapshot(item);
                  if (!normalized.name || !normalized.name.trim()) {
                    normalized.name = `${getTranslation('session_default_name')} ${baseCount + idx + 1}`;
                  }
                  return normalized;
                }).filter((session) => describeSessionCounts(session).tabsCount > 0);
                if (!importedSessions.length) {
                  throw new Error('No restorable tabs were found in the import file');
                }

                resultSessions = replace
                  ? importedSessions
                  : combineSessionCollections(resultSessions, importedSessions);

                chrome.runtime.sendMessage({ action: 'replace_sessions', sessions: resultSessions, reason: 'import_sessions' }, (response) => {
                  try {
                    if (chrome.runtime.lastError || !response?.success) {
                      const message = chrome.runtime.lastError?.message || response?.error || 'Unknown error';
                      console.error('Import persist error', chrome.runtime.lastError || response);
                      alert('Failed to import sessions: ' + message);
                      return;
                    }
                    loadSessions();
                    alert('Import successful');
                  } catch (e) {
                    console.error('Error in import set callback', e);
                  }
                });
              } catch (e) {
                console.error('Error in import get_sessions callback', e);
                alert('Failed to import sessions: ' + (e.message || e));
              }
            });
          } catch (err) {
            console.error('Import error', err);
            alert('Failed to import sessions: ' + (err.message || err));
          }
        };
        reader.readAsText(file);
      } catch (e) {
        console.error('Error in import change', e);
      }
    });
  }

  // SETTINGS PAGE
  const settingsBtn = document.getElementById('settings-icon');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      closeAllMenus();
      chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
      window.close();
    });
  }

  // SALVATAGGIO TABS
  const saveButtonEl = document.getElementById('save');
  if (saveButtonEl) {
    saveButtonEl.addEventListener('click', () => {
      try {
        if (saveButtonEl.disabled) return;
        saveButtonEl.disabled = true;

        chrome.runtime.sendMessage({ action: 'get_sessions' }, (existingRaw) => {
          try {
            if (chrome.runtime.lastError) {
              console.error('Load sessions error', chrome.runtime.lastError);
              alert('Unable to load existing sessions. Please try again.');
              saveButtonEl.disabled = false;
              return;
            }
            const existing = Array.isArray(existingRaw) ? existingRaw : [];

            chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
              try {
                if (chrome.runtime.lastError) {
                  console.error('Active tab lookup error', chrome.runtime.lastError);
                  alert('Unable to identify the active browser window. Please try again.');
                  saveButtonEl.disabled = false;
                  return;
                }

                const sourceWindowId = Array.isArray(activeTabs) && activeTabs[0] && Number.isInteger(activeTabs[0].windowId)
                  ? activeTabs[0].windowId
                  : null;

                chrome.runtime.sendMessage({ action: 'capture_current_desktop', sourceWindowId }, (snapshot) => {
                  try {
                    if (chrome.runtime.lastError) {
                      console.error('Capture message error', chrome.runtime.lastError);
                      alert('Unable to capture the current session. Please try again.');
                      saveButtonEl.disabled = false;
                      return;
                    }
                    if (!snapshot || !snapshot.success) {
                      console.error('Capture error', snapshot?.error);
                      alert('Unable to capture the current session. Please try again.');
                      saveButtonEl.disabled = false;
                      return;
                    }

                    const timestamp = new Date().toISOString();
                    const defaultName = `${getTranslation('session_default_name')} ${existing.length + 1}`;

                    const metadata = {
                      desktopKey: snapshot.desktopKey ?? null,
                      saveType: SAVE_TYPE_MANUAL,
                      ...(snapshot.desktopStrategy ? { desktopStrategy: snapshot.desktopStrategy } : {}),
                      ...(snapshot.heuristics ? { heuristics: snapshot.heuristics } : {})
                    };
                    const sessionObject = normalizeSessionSnapshot({
                      name: defaultName,
                      timestamp,
                      windows: snapshot.windows,
                      metadata,
                      platform: snapshot.platform ?? null,
                      saveType: SAVE_TYPE_MANUAL
                    });

                    if (!sessionObject.windows.length) {
                      alert('No browser windows were detected to save on this desktop.');
                      saveButtonEl.disabled = false;
                      return;
                    }

                    const sessionsToStore = combineSessionCollections(existing, [sessionObject]);

                    chrome.runtime.sendMessage({ action: 'replace_sessions', sessions: sessionsToStore, reason: 'manual_save' }, (response) => {
                      try {
                        saveButtonEl.disabled = false;
                        if (chrome.runtime.lastError || !response?.success) {
                          console.error('Session save error', chrome.runtime.lastError || response);
                          alert('Unable to save this session. Please try again.');
                          return;
                        }
                        loadSessions();
                      } catch (e) {
                        console.error('Error in save set callback', e);
                        saveButtonEl.disabled = false;
                      }
                    });
                  } catch (e) {
                    console.error('Error in capture callback', e);
                    saveButtonEl.disabled = false;
                  }
                });
              } catch (e) {
                console.error('Error while resolving active tab window', e);
                saveButtonEl.disabled = false;
              }
            });
          } catch (e) {
            console.error('Error in get_sessions callback', e);
            saveButtonEl.disabled = false;
          }
        });
      } catch (e) {
        console.error('Error in save click', e);
        saveButtonEl.disabled = false;
      }
    });
  }

  function renameSession(index, newName) {
    chrome.runtime.sendMessage(
      {
        action: 'rename_session',
        index,
        newName
      },
      (res) => {
        if (res && res.success) loadSessions();
      }
    );
  }

  function clearSessionDropTargets() {
    document.querySelectorAll('.session-entry.drag-over-before, .session-entry.drag-over-after, .session-entry.is-dragging')
      .forEach((entry) => {
        entry.classList.remove('drag-over-before', 'drag-over-after', 'is-dragging');
      });
    document.querySelectorAll('.session-folder.is-folder-drop-target')
      .forEach((folderEl) => folderEl.classList.remove('is-folder-drop-target'));
  }

  function getSessionDropPlacement(entry, event) {
    const rect = entry.getBoundingClientRect();
    return event.clientY > rect.top + rect.height / 2 ? 'after' : 'before';
  }

  function getFolderById(folderId) {
    return sessionFolders.find((folder) => folder.id === folderId) || null;
  }

  function persistSessionCollection(nextSessions, reason) {
    latestSessions = nextSessions;
    renderSessionList(latestSessions, searchInput?.value || '');
    chrome.runtime.sendMessage(
      { action: 'replace_sessions', sessions: nextSessions, reason },
      (response) => {
        if (chrome.runtime.lastError || !response?.success) {
          console.error('[popup] Session update failed:', chrome.runtime.lastError || response);
          loadSessions();
        }
      }
    );
  }

  function sendRuntimeMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError || !response?.success) {
          reject(chrome.runtime.lastError || response || new Error('Request failed'));
          return;
        }
        resolve(response);
      });
    });
  }

  function persistFolderCollection(nextFolders, reason) {
    sessionFolders = normalizeSessionFolders(nextFolders, latestSessions);
    renderSessionList(latestSessions, searchInput?.value || '');
    chrome.runtime.sendMessage(
      { action: 'replace_session_folders', folders: sessionFolders, reason },
      (response) => {
        if (chrome.runtime.lastError || !response?.success) {
          console.error('[popup] Folder update failed:', chrome.runtime.lastError || response);
          loadSessions();
          return;
        }
        sessionFolders = normalizeSessionFolders(response.folders, latestSessions);
        renderSessionList(latestSessions, searchInput?.value || '');
      }
    );
  }

  async function persistFolderAndSessionChanges(nextFolders, nextSessions, reason) {
    const previousFolders = sessionFolders;
    const previousSessions = latestSessions;
    sessionFolders = normalizeSessionFolders(nextFolders, nextSessions);
    latestSessions = nextSessions;
    renderSessionList(latestSessions, searchInput?.value || '');

    try {
      const [folderResponse, sessionResponse] = await Promise.all([
        sendRuntimeMessage({ action: 'replace_session_folders', folders: sessionFolders, reason }),
        sendRuntimeMessage({ action: 'replace_sessions', sessions: nextSessions, reason })
      ]);
      sessionFolders = normalizeSessionFolders(folderResponse.folders, sessionResponse.sessions || nextSessions);
      latestSessions = Array.isArray(sessionResponse.sessions) ? sessionResponse.sessions : nextSessions;
      renderSessionList(latestSessions, searchInput?.value || '');
    } catch (error) {
      console.error('[popup] Folder/session update failed:', error);
      sessionFolders = previousFolders;
      latestSessions = previousSessions;
      loadSessions();
    }
  }

  function persistSessionReorder(fromIndex, toIndex, placement, targetFolderId = '') {
    if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex === toIndex) return;
    const sourceFolderId = getSessionFolderId(latestSessions[fromIndex]);
    const targetFolder = targetFolderId ? getFolderById(targetFolderId) : null;
    const shouldMoveFolder = sourceFolderId !== targetFolderId;
    const reordered = shouldMoveFolder
      ? moveSessionToFolderCollection(latestSessions, fromIndex, targetFolder, toIndex, placement)
      : reorderSessionCollection(latestSessions, fromIndex, toIndex, placement);
    if (reordered === latestSessions || reordered.length !== latestSessions.length) return;
    persistSessionCollection(
      reordered,
      shouldMoveFolder
        ? (targetFolderId ? 'move_session_to_folder' : 'move_session_to_unfiled')
        : 'reorder_sessions'
    );
  }

  function persistSessionFolderMove(fromIndex, folderId = '') {
    if (!Number.isInteger(fromIndex)) return;
    const folder = folderId ? getFolderById(folderId) : null;
    const moved = moveSessionToFolderCollection(latestSessions, fromIndex, folder);
    if (moved.length !== latestSessions.length) return;
    persistSessionCollection(moved, folderId ? 'move_session_to_folder' : 'move_session_to_unfiled');
  }

  function setFolderDropTargetState(folderEl, isActive) {
    folderEl.classList.toggle('is-folder-drop-target', isActive);
  }

  function createFolderIconElement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('session-folder-icon');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('d', 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z');
    svg.appendChild(path);

    return svg;
  }

  function createFolderDeleteIconElement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('d', 'M3 6h18M8 6V4h8v2m-7 4v8m6-8v8M5 6l1 15h12l1-15');
    svg.appendChild(path);

    return svg;
  }

  function bindFolderDropTarget(folderEl, folderId = '') {
    folderEl.addEventListener('dragover', (event) => {
      if (!Number.isInteger(activeDragSessionIndex)) return;
      event.preventDefault();
      setFolderDropTargetState(folderEl, true);
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    });

    folderEl.addEventListener('dragleave', (event) => {
      if (folderEl.contains(event.relatedTarget)) return;
      setFolderDropTargetState(folderEl, false);
    });

    folderEl.addEventListener('drop', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const transferredIndex = Number.parseInt(event.dataTransfer?.getData('text/plain') || '', 10);
      const fromIndex = Number.isInteger(transferredIndex) ? transferredIndex : activeDragSessionIndex;
      activeDragSessionIndex = null;
      clearSessionDropTargets();
      persistSessionFolderMove(fromIndex, folderId);
    });
  }

  function createSessionFolderElement(folder, count, { unfiled = false } = {}) {
    const details = document.createElement('details');
    details.className = unfiled ? 'session-folder session-folder-unfiled' : 'session-folder';
    details.open = true;
    details.dataset.folderId = folder?.id || '';
    bindFolderDropTarget(details, folder?.id || '');

    const summary = document.createElement('summary');
    summary.className = 'session-folder-summary';

    const title = document.createElement('span');
    title.className = 'session-folder-title';
    title.textContent = unfiled ? getTranslation('unfiled_sessions_title') : folder.name;

    const countBadge = document.createElement('span');
    countBadge.className = 'session-folder-count';
    countBadge.textContent = String(count);

    summary.appendChild(createFolderIconElement());
    summary.appendChild(title);
    summary.appendChild(countBadge);

    if (!unfiled) {
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'session-folder-delete';
      deleteBtn.type = 'button';
      deleteBtn.setAttribute('aria-label', getTranslation('delete_folder_label'));
      deleteBtn.setAttribute('title', getTranslation('delete_folder_label'));
      deleteBtn.appendChild(createFolderDeleteIconElement());
      deleteBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleDeleteFolder(folder.id);
      });
      summary.appendChild(deleteBtn);
    }

    const sessionsEl = document.createElement('div');
    sessionsEl.className = 'session-folder-sessions';

    details.appendChild(summary);
    details.appendChild(sessionsEl);

    return { folderEl: details, sessionsEl };
  }

  function getFolderSessionCount(folderId) {
    return latestSessions.filter((session) => getSessionFolderId(session) === folderId).length;
  }

  function handleDeleteFolder(folderId) {
    const folder = getFolderById(folderId);
    if (!folder) return;

    const folderSessionCount = getFolderSessionCount(folder.id);
    if (folderSessionCount === 0) {
      const confirmed = confirm(formatTranslation('delete_folder_empty_confirm', { name: folder.name }));
      if (!confirmed) return;
      persistFolderCollection(
        sessionFolders.filter((candidate) => candidate.id !== folder.id),
        'delete_session_folder'
      );
      return;
    }

    const deleteSessions = confirm(formatTranslation('delete_folder_with_sessions_confirm', {
      name: folder.name,
      count: folderSessionCount
    }));
    let nextSessions = [];

    if (deleteSessions) {
      nextSessions = latestSessions.filter((session) => getSessionFolderId(session) !== folder.id);
    } else {
      const keepSessions = confirm(formatTranslation('delete_folder_keep_sessions_confirm', { name: folder.name }));
      if (!keepSessions) return;
      nextSessions = latestSessions.map((session) =>
        getSessionFolderId(session) === folder.id ? setSessionFolder(session, null) : session
      );
    }

    persistFolderAndSessionChanges(
      sessionFolders.filter((candidate) => candidate.id !== folder.id),
      nextSessions,
      deleteSessions ? 'delete_session_folder_with_sessions' : 'delete_session_folder_keep_sessions'
    );
  }

  function createFolderEmptyState() {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'session-folder-empty';
    emptyEl.textContent = getTranslation('folder_empty');
    return emptyEl;
  }

  async function loadSessionFoldersFromStorage(sessions = []) {
    return new Promise((resolve) => {
      chrome.storage.local.get({ [SESSION_FOLDERS_KEY]: [] }, (result) => {
        if (chrome.runtime.lastError) {
          console.warn('[popup] Failed to load session folders:', chrome.runtime.lastError);
          resolve(normalizeSessionFolders([], sessions));
          return;
        }
        resolve(normalizeSessionFolders(result?.[SESSION_FOLDERS_KEY], sessions));
      });
    });
  }

  async function loadSessionsFromStorageWithRetry(retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        return await new Promise((resolve, reject) => {
          chrome.storage.local.get('sessions', (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(result.sessions || []);
            }
          });
        });
      } catch (err) {
        console.warn(`[popup] Storage read attempt ${i + 1} failed:`, err);
        if (i < retries) {
          await new Promise(r => setTimeout(r, 50 * Math.pow(2, i))); // exponential backoff
        } else {
          console.error('[popup] All storage read attempts failed, returning empty array');
          return [];
        }
      }
    }
  }

  function renderSessionList(sessionsRaw, query = '') {
      const container = document.getElementById('sessions');
      const emptyState = document.getElementById('empty-state');
      const searchEmptyState = document.getElementById('search-empty-state');

      if (!container || !emptyState || !searchEmptyState) {
        return;
      }

      container.replaceChildren();
      resetPreviewStates();

      const sessions = Array.isArray(sessionsRaw) ? sessionsRaw : [];
      const normalizedSessions = sessions.map((session) => normalizeSessionSnapshot(session));
      if (sessions.length === 0) {
        emptyState.style.display = 'block';
        searchEmptyState.style.display = 'none';
        return;
      }

      emptyState.style.display = 'none';
      const activeSessions = new Set(getSessionsBySaveType(normalizedSessions, activeSessionCategory));
      let categorizedSessions = normalizedSessions
        .map((sessionData, originalIndex) => ({ sessionData, originalIndex }))
        .filter(({ sessionData }) => activeSessions.has(sessionData));
      if (activeSessionCategory === SAVE_TYPE_AUTO && activeAutoSaveTrigger !== AUTO_SAVE_TRIGGER_ALL) {
        const triggerSessions = new Set(getSessionsByAutoSaveTrigger(
          categorizedSessions.map(({ sessionData }) => sessionData),
          activeAutoSaveTrigger
        ));
        categorizedSessions = categorizedSessions.filter(({ sessionData }) => triggerSessions.has(sessionData));
      }
      const matchingSessions = getMatchingSessions(
        categorizedSessions.map(({ sessionData }) => sessionData),
        query
      ).map(({ sessionData, originalIndex }) => ({
        sessionData,
        originalIndex: categorizedSessions[originalIndex].originalIndex
      }));
      searchEmptyState.style.display = matchingSessions.length === 0 ? 'block' : 'none';

      const queryText = typeof query === 'string' ? query.trim() : '';
      const folderMatches = new Map();
      const unfiledMatches = [];
      matchingSessions.forEach((match) => {
        const folderId = getSessionFolderId(match.sessionData);
        if (!folderId) {
          unfiledMatches.push(match);
          return;
        }
        if (!folderMatches.has(folderId)) folderMatches.set(folderId, []);
        folderMatches.get(folderId).push(match);
      });

      const folderTargets = new Map();
      const visibleFolders = sessionFolders.filter((folder) => folderMatches.has(folder.id) || !queryText);
      visibleFolders.forEach((folder) => {
        const matchCount = folderMatches.get(folder.id)?.length || 0;
        const { folderEl, sessionsEl } = createSessionFolderElement(folder, matchCount);
        if (matchCount === 0) sessionsEl.appendChild(createFolderEmptyState());
        folderTargets.set(folder.id, sessionsEl);
        container.appendChild(folderEl);
      });

      let unfiledSessionsTarget = container;
      const shouldRenderUnfiledBucket = visibleFolders.length > 0 || sessionFolders.length > 0;
      if (shouldRenderUnfiledBucket && (unfiledMatches.length > 0 || !queryText)) {
        const { folderEl, sessionsEl } = createSessionFolderElement(
          { id: '', name: getTranslation('unfiled_sessions_title') },
          unfiledMatches.length,
          { unfiled: true }
        );
        unfiledSessionsTarget = sessionsEl;
        if (unfiledMatches.length === 0) sessionsEl.appendChild(createFolderEmptyState());
        container.appendChild(folderEl);
      }

      matchingSessions.forEach(({ sessionData: normalized, originalIndex: index }) => {
        const entry = document.createElement('div');
        entry.className = 'session-entry';
        entry.setAttribute('role', 'listitem');
        entry.dataset.sessionIndex = String(index);
        entry.dataset.folderId = getSessionFolderId(normalized);

        let sessionPayload = normalized;
        const sessionName =
          normalized.name && normalized.name.trim()
            ? normalized.name.trim()
            : `${getTranslation('session_default_name')} ${index + 1}`;

        const { date, time } = formatTimestamp(normalized.timestamp);
        const countInfo = describeSessionCounts(normalized);
        if (countInfo.tabsCount === 0 && countInfo.windowsCount === 0) return;
        const strategy = normalized.desktopStrategy || normalized.metadata?.desktopStrategy;
        const metaSegments = [date, time, countInfo.windowsLabel, countInfo.tabsLabel];
        if (countInfo.groupsLabel) metaSegments.splice(3, 0, countInfo.groupsLabel);
        if (strategy === 'workspace') {
          metaSegments.push(getTranslation('desktop_scope_workspace'));
        }

        const dragHandle = document.createElement('button');
        dragHandle.className = 'session-drag-handle';
        dragHandle.type = 'button';
        dragHandle.draggable = true;
        dragHandle.setAttribute('aria-label', getTranslation('reorder_session_label'));
        dragHandle.setAttribute('title', getTranslation('reorder_session_label'));
        for (let dotIndex = 0; dotIndex < 6; dotIndex += 1) {
          dragHandle.appendChild(document.createElement('span'));
        }

        const label = document.createElement('span');
        label.className = 'session-label';
        label.setAttribute('role', 'button');
        label.setAttribute('tabindex', '0');
        const labelTitle = document.createElement('strong');
        labelTitle.textContent = sessionName;
        const labelMeta = document.createElement('div');
        labelMeta.className = 'session-meta';
        renderMetaSegments(labelMeta, metaSegments);
        label.appendChild(labelTitle);
        label.appendChild(labelMeta);

        const menuBtn = document.createElement('button');
        menuBtn.className = 'menu-button';
        menuBtn.setAttribute('aria-label', getTranslation('session_menu_label'));
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.appendChild(createMenuIcon());

        const menu = document.createElement('div');
        menu.className = 'menu-content';

        const previewBtn = document.createElement('button');
        previewBtn.textContent = getTranslation('preview_button');
        previewBtn.setAttribute('data-role', 'preview-toggle');

        const addItemBtn = document.createElement('button');
        addItemBtn.textContent = getTranslation('add_session_item_button');
        addItemBtn.addEventListener('click', () => {
          closeAllMenus();
          const itemInput = prompt(getTranslation('add_url_prompt'));
          if (itemInput === null) return;
          const updatedSession = addCustomUrlToSession(sessionPayload, itemInput, { newWindow: false });
          if (!updatedSession) {
            alert(getTranslation('add_url_invalid'));
            return;
          }
          chrome.runtime.sendMessage({ action: 'update_session', index, session: updatedSession }, (res) => {
            if (!res || !res.success) {
              console.error('Failed to add item to session', res && res.error);
              alert(getTranslation('add_url_failed'));
              return;
            }
            sessionPayload = updatedSession;
            latestSessions[index] = updatedSession;
            updateSessionLabelMeta(sessionPayload, label);
            if (previewContainer.classList.contains('is-open')) {
              renderPreview(sessionPayload, previewContainer, index, label);
            }
          });
        });

        const addWindowBtn = document.createElement('button');
        addWindowBtn.textContent = getTranslation('add_session_window_button');
        addWindowBtn.addEventListener('click', () => {
          closeAllMenus();
          const itemInput = prompt(getTranslation('add_url_prompt'));
          if (itemInput === null) return;
          const updatedSession = addCustomUrlToSession(sessionPayload, itemInput, { newWindow: true });
          if (!updatedSession) {
            alert(getTranslation('add_url_invalid'));
            return;
          }
          chrome.runtime.sendMessage({ action: 'update_session', index, session: updatedSession }, (res) => {
            if (!res || !res.success) {
              console.error('Failed to add window to session', res && res.error);
              alert(getTranslation('add_url_failed'));
              return;
            }
            sessionPayload = updatedSession;
            latestSessions[index] = updatedSession;
            updateSessionLabelMeta(sessionPayload, label);
            if (previewContainer.classList.contains('is-open')) {
              renderPreview(sessionPayload, previewContainer, index, label);
            }
          });
        });

        const renameBtn = document.createElement('button');
        renameBtn.textContent = getTranslation('rename_button');
        renameBtn.addEventListener('click', () => {
          closeAllMenus();
          const newName = prompt(getTranslation('rename_prompt'), sessionName);
          if (newName && newName.trim()) {
            renameSession(index, newName.trim());
          }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = getTranslation('delete_button');
        deleteBtn.addEventListener('click', () => {
          closeAllMenus();
          chrome.runtime.sendMessage({ action: 'delete_session', index }, (res) => {
            if (res && res.success) loadSessions();
          });
        });

        menu.appendChild(previewBtn);
        menu.appendChild(addItemBtn);
        menu.appendChild(addWindowBtn);
        menu.appendChild(renameBtn);
        menu.appendChild(deleteBtn);

        const menuWrapper = document.createElement('div');
        menuWrapper.className = 'menu-wrapper';
        menuWrapper.appendChild(menuBtn);
        menuWrapper.appendChild(menu);
  // Store reference to original parent for cleanup
  menu._originalParent = menuWrapper;

        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'restore-btn';
        restoreBtn.type = 'button';
        configureRestoreButton(restoreBtn, getTranslation('restore_button'));

        const actions = document.createElement('div');
        actions.className = 'session-actions';
        actions.appendChild(restoreBtn);
        actions.appendChild(menuWrapper);

        const topRow = document.createElement('div');
        topRow.className = 'session-top';
        topRow.appendChild(dragHandle);
        topRow.appendChild(label);
        topRow.appendChild(actions);

        const previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container';
        previewContainer.style.display = 'none';
        previewContainer.dataset.rendered = 'false';
        previewContainer.addEventListener('click', (event) => event.stopPropagation());

        const triggerRestore = () => {
          if (!sessionPayload.windows || sessionPayload.windows.length === 0) {
            alert('This session has no windows to restore.');
            return;
          }
          // Guard before dispatch so repeated card actions cannot queue another restore.
          if (restoreRequestInFlight) return;
          triggerConfiguredRestore(
            { action: 'open_session', session: sessionPayload },
            { emptyMessage: 'This session has no windows to restore.' }
          );
        };

        restoreBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          triggerRestore();
        });

        menu.addEventListener('click', (event) => event.stopPropagation());

        dragHandle.addEventListener('click', (event) => event.stopPropagation());
        dragHandle.addEventListener('dragstart', (event) => {
          activeDragSessionIndex = index;
          activeDropPlacement = 'before';
          entry.classList.add('is-dragging');
          closeAllMenus();
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', String(index));
          }
        });
        dragHandle.addEventListener('dragend', () => {
          activeDragSessionIndex = null;
          clearSessionDropTargets();
        });

        entry.addEventListener('dragover', (event) => {
          if (!Number.isInteger(activeDragSessionIndex) || activeDragSessionIndex === index) return;
          event.preventDefault();
          activeDropPlacement = getSessionDropPlacement(entry, event);
          document.querySelectorAll('.session-entry.drag-over-before, .session-entry.drag-over-after')
            .forEach((target) => {
              if (target !== entry) target.classList.remove('drag-over-before', 'drag-over-after');
            });
          entry.classList.toggle('drag-over-before', activeDropPlacement === 'before');
          entry.classList.toggle('drag-over-after', activeDropPlacement === 'after');
          if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
        });

        entry.addEventListener('dragleave', (event) => {
          if (entry.contains(event.relatedTarget)) return;
          entry.classList.remove('drag-over-before', 'drag-over-after');
        });

        entry.addEventListener('drop', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const transferredIndex = Number.parseInt(event.dataTransfer?.getData('text/plain') || '', 10);
          const fromIndex = Number.isInteger(transferredIndex) ? transferredIndex : activeDragSessionIndex;
          const placement = activeDropPlacement;
          activeDragSessionIndex = null;
          clearSessionDropTargets();
          persistSessionReorder(fromIndex, index, placement, entry.dataset.folderId || '');
        });

        menuBtn.addEventListener('click', (event) => {
          try {
            event.stopPropagation();
            const wasOpen = menu.style.display === 'block';
            closeAllMenus();
            if (!wasOpen) {
              // Position menu as fixed overlay using viewport coordinates
              const btnRect = menuBtn.getBoundingClientRect();
              const menuHeight = 220; // Estimated height for flipping logic
              
              // Position menu below button
              let top = btnRect.bottom + 6;
              let left = btnRect.right - 160; // Align right edge, accounting for min-width: 150px
              
              // Flip menu above button if insufficient space below
              // (account for viewport height - typically 600-800px for Chrome popup)
              if (top + menuHeight > window.innerHeight - 10) {
                top = btnRect.top - menuHeight - 6;
              }
              
              // Clamp left within viewport with padding
              const minLeft = 8;
              const maxLeft = window.innerWidth - 160 - 8;
              left = Math.max(minLeft, Math.min(left, maxLeft));
              
              menu.style.display = 'block';
              menu.style.top = `${Math.max(0, top)}px`;
              menu.style.left = `${left}px`;
              // Move menu to body to escape popup's scroll container
              if (menu.parentNode !== document.body) {
                document.body.appendChild(menu);
              }
              entry.classList.add('menu-open');
              menuBtn.setAttribute('aria-expanded', 'true');
            }
          } catch (e) {
            console.error('Error in menuBtn click', e);
          }
        });

        const togglePreview = () => {
          try {
            const isOpen = previewContainer.classList.contains('is-open');
            closeAllMenus({ preservePreviews: true });
            if (isOpen) {
              previewContainer.classList.remove('is-open');
              previewContainer.style.display = 'none';
              previewBtn.textContent = getTranslation('preview_button');
            } else {
              resetPreviewStates();
              if (previewContainer.dataset.rendered !== 'true') {
                renderPreview(sessionPayload, previewContainer, index, label);
              }
              previewContainer.classList.add('is-open');
              previewContainer.style.display = 'block';
              previewBtn.textContent = getTranslation('preview_hide_button');
            }
          } catch (e) {
            console.error('Error in previewBtn click', e);
          }
        };

        bindSessionPreviewToggle(entry, label, previewBtn, togglePreview);

        entry.appendChild(topRow);
        entry.appendChild(previewContainer);
        const folderId = getSessionFolderId(normalized);
        const target = folderId ? (folderTargets.get(folderId) || container) : unfiledSessionsTarget;
        target.appendChild(entry);
      });
  }

  function loadSessions() {
    loadSessionsFromStorageWithRetry().then(async (sessionsRaw) => {
      latestSessions = Array.isArray(sessionsRaw) ? sessionsRaw : [];
      sessionFolders = await loadSessionFoldersFromStorage(latestSessions);
      renderSessionList(latestSessions, searchInput?.value || '');
    }).catch((err) => {
      console.error('[popup] Failed to load sessions:', err);
      const container = document.getElementById('sessions');
      const emptyState = document.getElementById('empty-state');
      const searchEmptyState = document.getElementById('search-empty-state');
      if (container && emptyState && searchEmptyState) {
        container.replaceChildren();
        emptyState.style.display = 'block';
        searchEmptyState.style.display = 'none';
      }
    });
  }

  reloadSessions = loadSessions;

  // Carica impostazioni salvate
  function restoreSettings() {
    const savedAccent = localStorage.getItem('accentColor');
    const savedDark = localStorage.getItem('darkMode');
    const savedLanguage = localStorage.getItem('language');
    const restoreMode = getRestoreMode();
    const autoSaveGroupMode = getAutoSaveGroupMode();

    if (savedAccent) {
      if (accentSelect) {
        const hasOption = Array.from(accentSelect.options).some(option => option.value === savedAccent);
        if (!hasOption) {
          const customOption = document.createElement('option');
          customOption.value = savedAccent;
          customOption.textContent = savedAccent;
          accentSelect.appendChild(customOption);
        }
        accentSelect.value = savedAccent;
      }
      document.documentElement.style.setProperty('--accent-color', savedAccent);
    }
    if (savedDark === 'true') {
      if (darkToggle) darkToggle.checked = true;
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
    if (savedLanguage) {
      if (languageSelect) languageSelect.value = savedLanguage;
      translatePage(savedLanguage);
    } else {
      translatePage('en');
    }
    restoreModeInputs.forEach((input) => {
      input.checked = input.value === restoreMode;
    });
    if (autoSaveGroupModeSelect) {
      autoSaveGroupModeSelect.value = autoSaveGroupMode;
    }
    if (autoSaveEnabledToggle || autoSaveOnExitEnabledToggle || autoSaveIntervalInput) {
      chrome.runtime.sendMessage({ action: 'get_auto_save_settings' }, (response) => {
        if (chrome.runtime.lastError || !response?.success) {
          updateAutoSaveIntervalVisibility(normalizeAutoSaveSettings());
          return;
        }
        updateAutoSaveIntervalVisibility(response.settings);
      });
    }
    if (newsletterForm || newsletterStatus) {
      loadNewsletterSubscription();
    }
    if (cloudSyncForm || cloudSyncStatus) {
      loadCloudSyncSettings();
    }
  }

  restoreSettings();
  if (document.getElementById('sessions')) {
    loadSessions();
  }

  // Browser detection: supported Chrome stays silent; unsupported/unknown environments get details.
  window.browserSupport?.detectBrowserType().then((browserInfo) => {
    const supportGroupEl = document.getElementById('browser-support-group');
    const supportInfoEl = document.getElementById('browser-support-info');
    if (browserInfo.supported === true) {
      if (supportGroupEl) supportGroupEl.style.display = 'none';
      if (supportInfoEl) supportInfoEl.textContent = '';
      return;
    }

    if (supportGroupEl) {
      supportGroupEl.style.display = 'flex';
    }

    if (supportInfoEl) {
      supportInfoEl.textContent = '';

      const officialRow = document.createElement('span');
      const officialLabel = document.createTextNode(getTranslation('browser_support_official') + ': ');
      const officialValue = document.createElement('strong');
      officialValue.textContent = 'Google Chrome';
      officialRow.appendChild(officialLabel);
      officialRow.appendChild(officialValue);

      const detectedRow = document.createElement('span');
      const detectedLabel = document.createTextNode(getTranslation('browser_support_detected') + ': ');
      const detectedValue = document.createElement('strong');
      detectedValue.textContent = browserInfo.name || getTranslation('browser_support_unknown');
      detectedRow.appendChild(detectedLabel);
      detectedRow.appendChild(detectedValue);

      const statusRow = document.createElement('span');
      const statusLabel = document.createTextNode(getTranslation('browser_support_status') + ': ');
      const statusValue = document.createElement('strong');
      statusValue.textContent = browserInfo.supported === false
        ? getTranslation('browser_support_not_supported')
        : getTranslation('browser_support_unknown');
      if (browserInfo.supported === false) statusValue.className = 'browser-support-status-warn';
      statusRow.appendChild(statusLabel);
      statusRow.appendChild(statusValue);

      supportInfoEl.appendChild(officialRow);
      supportInfoEl.appendChild(detectedRow);
      supportInfoEl.appendChild(statusRow);

      const descriptionRow = document.createElement('span');
      descriptionRow.textContent = getTranslation('browser_support_description');
      supportInfoEl.appendChild(descriptionRow);
    }

    const warningEl = document.getElementById('browser-warning');
    const warningTextEl = document.getElementById('browser-warning-text');
    const dismissedKey = 'browserWarningDismissed_' + (browserInfo.id || 'unknown');
    if (warningEl && warningTextEl && !localStorage.getItem(dismissedKey)) {
      warningTextEl.textContent = browserInfo.supported === false
        ? getTranslation('browser_warning_text')
        : getTranslation('browser_warning_unknown_text');
      warningEl.style.display = 'flex';
      const closeBtn = document.getElementById('browser-warning-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          warningEl.style.display = 'none';
          localStorage.setItem(dismissedKey, '1');
        });
      }
    }
  });
});

// Note: loadSessions is now called inside DOMContentLoaded handler above
