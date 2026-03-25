// welcome.js (extracted from inline script to comply with MV3 CSP)

(function(){
  const i18n = {
    en: {
      lang_label: "Language",
      hero_title: "Welcome to Tab Session Saver",
      hero_lead: "Save, manage, restore, export and import tab groups. Everything stays <strong>on your device</strong>.",
      step1_title: "Make sure the extension is pinned",
      step1_caption: `<svg class="inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3l8 8-6 1-1 6-8-8 7-7z"></path></svg>
                      Click the <span class="pill">
                        <svg class="inline-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M13 3a2 2 0 00-2 2v1H9a2 2 0 000 4h2v2H9.5a2.5 2.5 0 100 5H11v2a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2h-1V9a2 2 0 00-2-2h-2V5a2 2 0 00-2-2h-1z"></path>
                        </svg>Extensions</span> icon, then pin <strong>Tab Session Saver</strong> so the button stays visible in the toolbar.`,
      step2_title: "Main page — all saved sessions",
      step2_caption: "Press <strong>Save tabs</strong> to store the current window. Each card is a session with name and timestamp. Open the session or use the ⋮ menu for quick actions.",
      step3_title: "Rename, restore, preview, delete",
      rename: "Rename",
      rename_caption: "Change the session name (e.g., “Study”, “Work”).",
      restore: "Restore",
      restore_caption: "Open all tabs in a new window in the original order.",
      preview: "Show preview",
      preview_caption: "See the list of URLs before restoring.",
      delete: "Delete",
      delete_caption: "Remove the session permanently.",
      step4_title: "Settings — language, color, limit & backup",
      language: "Language",
      language_caption: "Choose the UI language.",
      main_color: "Main color",
      main_color_caption: "Pick the popup accent color.",
      limit: "Saved sessions limit",
      limit_caption: "Set a maximum number of saved sessions (older ones are pruned).",
      export: "Export saved sessions (JSON)",
      export_caption: "Download a .json backup to move to another device.",
      import: "Import sessions (JSON)",
      import_caption: "Load a previously exported file. Sessions are safely added/updated.",
      tips: "Quick tips",
      tip1: "Sessions keep tab titles and URLs in the original order.",
      tip2: "Use the limit in Settings to avoid clutter.",
      tip3: "Moving to a new computer? <strong>Export → Import</strong>.",
      start_title: "Get started",
      start1: "Pin the extension and open the popup.",
      start2: "Press <strong>Save tabs</strong> to store the current window.",
      start3: "Use the ⋮ menu to rename, restore, preview or delete.",
      start4: "Open <strong>Settings</strong> to back up or restore via JSON.",
      open_cws: "Open on Chrome Web Store",
      close: "Close",
      privacy_title: "Privacy",
      privacy_text: "Session data is stored <strong>locally</strong> using <code class='inline'>chrome.storage.local</code>. No URLs or preferences are sent to external servers."
    },
    it: {
      lang_label: "Lingua",
      hero_title: "Benvenuto in Tab Session Saver",
      hero_lead: "Salva, gestisci, ripristina, esporta e importa gruppi di schede. Tutto resta <strong>solo sul tuo dispositivo</strong>.",
      step1_title: "Assicurati che l’estensione sia pinnata",
      step1_caption: `<svg class="inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3l8 8-6 1-1 6-8-8 7-7z"></path></svg>
                      Clicca sull’icona <span class="pill">
                        <svg class="inline-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M13 3a2 2 0 00-2 2v1H9a2 2 0 000 4h2v2H9.5a2.5 2.5 0 100 5H11v2a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2h-1V9a2 2 0 00-2-2h-2V5a2 2 0 00-2-2h-1z"></path>
                        </svg>Estensioni</span> e poi fissa <strong>Tab Session Saver</strong> per tenerla sempre in vista.`,
      step2_title: "Pagina principale — tutte le sessioni salvate",
      step2_caption: "Premi <strong>Save tabs</strong> per salvare la finestra corrente. Ogni riquadro è una sessione con nome e data/ora. Apri la sessione o usa il menu ⋮ per azioni rapide.",
      step3_title: "Rinomina, ripristina, anteprima, elimina",
      rename: "Rinomina",
      rename_caption: "Cambia il nome della sessione (es. “Studio”, “Lavoro”).",
      restore: "Ripristina",
      restore_caption: "Apre tutte le schede in una nuova finestra mantenendo l’ordine originale.",
      preview: "Mostra anteprima",
      preview_caption: "Vedi l’elenco degli URL prima del ripristino.",
      delete: "Elimina",
      delete_caption: "Rimuove la sessione in modo permanente.",
      step4_title: "Impostazioni — lingua, colore, limite e backup",
      language: "Lingua",
      language_caption: "Scegli la lingua dell’interfaccia.",
      main_color: "Colore principale",
      main_color_caption: "Scegli il colore di accento del popup.",
      limit: "Limite sessioni salvate",
      limit_caption: "Imposta il numero massimo di sessioni (le più vecchie vengono rimosse).",
      export: "Esporta sessioni (JSON)",
      export_caption: "Scarica un file .json per backup o migrazione.",
      import: "Importa sessioni (JSON)",
      import_caption: "Carica un file esportato in precedenza. Le sessioni vengono aggiunte/aggiornate.",
      tips: "Consigli rapidi",
      tip1: "Le sessioni mantengono titoli e URL nell’ordine originale.",
      tip2: "Usa il limite nelle Impostazioni per evitare disordine.",
      tip3: "Nuovo computer? <strong>Export → Import</strong>.",
      start_title: "Primi passi",
      start1: "Pinna l’estensione e apri il popup.",
      start2: "Premi <strong>Save tabs</strong> per salvare la finestra corrente.",
      start3: "Usa il menu ⋮ per rinominare, ripristinare, vedere l’anteprima o eliminare.",
      start4: "Apri <strong>Impostazioni</strong> per backup/ripristino via JSON.",
      open_cws: "Apri sul Chrome Web Store",
      close: "Chiudi",
      privacy_title: "Privacy",
      privacy_text: "I dati delle sessioni sono salvati <strong>in locale</strong> con <code class='inline'>chrome.storage.local</code>. Nessun dato viene inviato a server esterni."
    },
    es: {
      lang_label: "Idioma",
      hero_title: "Bienvenido a Tab Session Saver",
      hero_lead: "Guarda, gestiona, restaura, exporta e importa grupos de pestañas. Todo se queda <strong>en tu dispositivo</strong>.",
      step1_title: "Asegúrate de fijar la extensión",
      step2_title: "Página principal — sesiones guardadas",
      step2_caption: "Pulsa <strong>Save tabs</strong> para guardar la ventana actual. Cada tarjeta es una sesión con nombre y fecha. Abre la sesión o usa el menú ⋮.",
      step3_title: "Renombrar, restaurar, vista previa, eliminar",
      rename: "Renombrar",
      rename_caption: "Cambia el nombre de la sesión.",
      restore: "Restaurar",
      restore_caption: "Abre todas las pestañas en una nueva ventana.",
      preview: "Vista previa",
      preview_caption: "Mira los enlaces antes de restaurar.",
      delete: "Eliminar",
      delete_caption: "Quita la sesión permanentemente.",
      step4_title: "Ajustes — idioma, color, límite y copia",
      language: "Idioma",
      language_caption: "Elige el idioma de la interfaz.",
      main_color: "Color principal",
      main_color_caption: "Color de acento del popup.",
      limit: "Límite de sesiones",
      limit_caption: "Define el máximo de sesiones guardadas.",
      export: "Exportar sesiones (JSON)",
      export_caption: "Descarga una copia .json.",
      import: "Importar sesiones (JSON)",
      import_caption: "Carga un archivo exportado.",
      tips: "Consejos",
      tip1: "Las sesiones mantienen títulos y URLs.",
      tip2: "Usa el límite para evitar desorden.",
      tip3: "¿Nuevo equipo? <strong>Export → Import</strong>.",
      start_title: "Primeros pasos",
      start1: "Fija la extensión y abre el popup.",
      start2: "Pulsa <strong>Save tabs</strong>.",
      start3: "Usa el menú ⋮.",
      start4: "Abre <strong>Ajustes</strong> para copia/restore.",
      open_cws: "Abrir en Chrome Web Store",
      close: "Cerrar",
      privacy_title: "Privacidad",
      privacy_text: "Los datos se guardan <strong>localmente</strong> con <code class='inline'>chrome.storage.local</code>."
    },
    de: {
      lang_label: "Sprache",
      hero_title: "Willkommen bei Tab Session Saver",
      hero_lead: "Speichere, verwalte, stelle wieder her, exportiere und importiere Tab-Gruppen. Alles bleibt <strong>auf deinem Gerät</strong>.",
      step1_title: "Erweiterung an die Leiste anpinnen",
      step2_title: "Startseite — alle gespeicherten Sitzungen",
      step2_caption: "Mit <strong>Save tabs</strong> speicherst du das aktuelle Fenster. Jede Karte ist eine Sitzung mit Name und Zeitstempel.",
      step3_title: "Umbenennen, Wiederherstellen, Vorschau, Löschen",
      rename: "Umbenennen",
      rename_caption: "Name der Sitzung ändern.",
      restore: "Wiederherstellen",
      restore_caption: "Alle Tabs in neuem Fenster öffnen.",
      preview: "Vorschau",
      preview_caption: "Links vor dem Wiederherstellen ansehen.",
      delete: "Löschen",
      delete_caption: "Sitzung dauerhaft entfernen.",
      step4_title: "Einstellungen — Sprache, Farbe, Limit & Backup",
      language: "Sprache",
      language_caption: "UI-Sprache wählen.",
      main_color: "Hauptfarbe",
      main_color_caption: "Akzentfarbe des Popups.",
      limit: "Sitzungslimit",
      limit_caption: "Maximale Anzahl gespeicherter Sitzungen.",
      export: "Sitzungen exportieren (JSON)",
      export_caption: "JSON-Backup herunterladen.",
      import: "Sitzungen importieren (JSON)",
      import_caption: "Zuvor exportierte Datei laden.",
      tips: "Tipps",
      tip1: "Sitzungen behalten Titel & URLs.",
      tip2: "Limit nutzen, um Ordnung zu halten.",
      tip3: "Neuer Rechner? <strong>Export → Import</strong>.",
      start_title: "Erste Schritte",
      start1: "Erweiterung anpinnen und Popup öffnen.",
      start2: "Klicke <strong>Save tabs</strong>.",
      start3: "⋮-Menü verwenden.",
      start4: "<strong>Einstellungen</strong> für Backup/Restore.",
      open_cws: "Im Chrome Web Store öffnen",
      close: "Schließen",
      privacy_title: "Datenschutz",
      privacy_text: "Sitzungsdaten werden <strong>lokal</strong> in <code class='inline'>chrome.storage.local</code> gespeichert."
    },
    fr: {
      lang_label: "Langue",
      hero_title: "Bienvenue dans Tab Session Saver",
      hero_lead: "Enregistrez, gérez, restaurez, exportez et importez des groupes d’onglets. Tout reste <strong>sur votre appareil</strong>.",
      step1_title: "Pensez à épingler l’extension",
      step2_title: "Page d’accueil — toutes les sessions",
      step2_caption: "Appuyez sur <strong>Save tabs</strong> pour enregistrer la fenêtre actuelle. Chaque carte représente une session avec nom et date.",
      step3_title: "Renommer, restaurer, aperçu, supprimer",
      rename: "Renommer",
      rename_caption: "Modifier le nom de la session.",
      restore: "Restaurer",
      restore_caption: "Ouvre tous les onglets dans une nouvelle fenêtre.",
      preview: "Afficher l’aperçu",
      preview_caption: "Voir la liste des liens avant de restaurer.",
      delete: "Supprimer",
      delete_caption: "Retirer définitivement la session.",
      step4_title: "Paramètres — langue, couleur, limite & sauvegarde",
      language: "Langue",
      language_caption: "Choisir la langue de l’interface.",
      main_color: "Couleur principale",
      main_color_caption: "Couleur d’accent du popup.",
      limit: "Limite de sessions",
      limit_caption: "Nombre maximum de sessions enregistrées.",
      export: "Exporter les sessions (JSON)",
      export_caption: "Télécharger une sauvegarde .json.",
      import: "Importer des sessions (JSON)",
      import_caption: "Charger un fichier exporté.",
      tips: "Astuces",
      tip1: "Les sessions conservent titres et URL.",
      tip2: "Utilisez la limite pour éviter l’encombrement.",
      tip3: "Nouveau PC ? <strong>Export → Import</strong>.",
      start_title: "Commencer",
      start1: "Épinglez l’extension et ouvrez le popup.",
      start2: "Appuyez sur <strong>Save tabs</strong>.",
      start3: "Utilisez le menu ⋮.",
      start4: "Ouvrez <strong>Paramètres</strong> pour sauvegarder/restaurer.",
      open_cws: "Ouvrir dans le Chrome Web Store",
      close: "Fermer",
      privacy_title: "Confidentialité",
      privacy_text: "Les données sont stockées <strong>localement</strong> via <code class='inline'>chrome.storage.local</code>."
    }
  };

  function setLang(lang){
    const dict = i18n[lang] || i18n.en;
    document.documentElement.lang = lang;
    // Prefer textContent; fall back to innerHTML only when the string contains markup
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = dict[key];
      if (typeof val === 'string') {
        if (/[<>&]/.test(val)) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = dict[key];
      if (typeof val === 'string') {
        el.innerHTML = val;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('lang');
    if (select) {
      select.addEventListener('change', (e) => setLang(e.target.value));
    }
    setLang('en');

    const closeBtn = document.getElementById('btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => { e.preventDefault(); window.close(); });
    }
  });
})();
