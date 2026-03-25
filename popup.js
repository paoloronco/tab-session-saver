// popup.js

// Translation object
const translations = {
  en: {
    title: "Tab Session Saver",
    subtitle: "Keep your workspaces ready in one click.",
    save_button: "Save current tabs",
    restore_button: "Restore",
    export_button: "Export saved sessions (JSON)",
    import_button: "Import sessions (JSON)",
    settings_title: "Settings",
    language_label: "Language",
    dark_mode_label: "Dark mode",
    color_label: "Accent color",
    sessions_limit_label: "Saved sessions limit",
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
    chrome_store_link: "Chrome Web Store",
    developer_label: "Developer:",
    privacy_policy_link: "Privacy Policy",
    version_label: "Version:",
    rights_reserved: "All rights reserved",
    empty_state_title: "No sessions saved yet",
    empty_state_description: "Save your current window to build your collection and reopen everything instantly.",
    tab_count_one: "1 tab",
    tab_count_other: "{count} tabs",
    window_count_one: "1 window",
    window_count_other: "{count} windows",
    desktop_scope_workspace: "Current desktop"
  },
  es: {
    title: "Guardador de pesta\u00F1as",
    subtitle: "Mant\u00E9n tus espacios de trabajo listos con un clic.",
    save_button: "Guardar pesta\u00F1as actuales",
    restore_button: "Restaurar",
    export_button: "Exportar sesiones guardadas (JSON)",
    import_button: "Importar sesiones (JSON)",
    settings_title: "Configuraci\u00F3n",
    language_label: "Idioma",
    dark_mode_label: "Modo oscuro",
    color_label: "Color de acento",
    sessions_limit_label: "L\u00EDmite de sesiones guardadas",
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
    chrome_store_link: "Chrome Web Store",
    developer_label: "Desarrollador:",
    privacy_policy_link: "Pol\u00EDtica de privacidad",
    version_label: "Versi\u00F3n:",
    rights_reserved: "Todos los derechos reservados",
    empty_state_title: "Todav\u00EDa no hay sesiones guardadas",
    empty_state_description: "Guarda la ventana actual para crear tu colecci\u00F3n y reabrir todo al instante.",
    tab_count_one: "1 pesta\u00F1a",
    tab_count_other: "{count} pesta\u00F1as",
    window_count_one: "1 ventana",
    window_count_other: "{count} ventanas",
    desktop_scope_workspace: "Escritorio actual"
  },
  it: {
    title: "Salva schede",
    subtitle: "Tieni i tuoi spazi di lavoro pronti con un clic.",
    save_button: "Salva le schede correnti",
    restore_button: "Ripristina",
    export_button: "Esporta le sessioni salvate (JSON)",
    import_button: "Importa le sessioni (JSON)",
    settings_title: "Impostazioni",
    language_label: "Lingua",
    dark_mode_label: "Modalit\u00E0 scura",
    color_label: "Colore di accento",
    sessions_limit_label: "Limite sessioni salvate",
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
    chrome_store_link: "Chrome Web Store",
    developer_label: "Sviluppatore:",
    privacy_policy_link: "Informativa sulla privacy",
    version_label: "Versione:",
    rights_reserved: "Tutti i diritti riservati",
    empty_state_title: "Nessuna sessione ancora salvata",
    empty_state_description: "Salva la finestra attuale per creare la tua raccolta e riaprire tutto all'istante.",
    tab_count_one: "1 scheda",
    tab_count_other: "{count} schede",
    window_count_one: "1 finestra",
    window_count_other: "{count} finestre",
    desktop_scope_workspace: "Desktop attuale"
  },
  fr: {
    title: "Sauvegarde d'onglets",
    subtitle: "Gardez vos espaces de travail pr\u00EAts en un clic.",
    save_button: "Enregistrer les onglets en cours",
    restore_button: "Restaurer",
    export_button: "Exporter les sessions enregistr\u00E9es (JSON)",
    import_button: "Importer des sessions (JSON)",
    settings_title: "Param\u00E8tres",
    language_label: "Langue",
    dark_mode_label: "Mode sombre",
    color_label: "Couleur d'accent",
    sessions_limit_label: "Limite de sessions enregistr\u00E9es",
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
    chrome_store_link: "Chrome Web Store",
    developer_label: "D\u00E9veloppeur :",
    privacy_policy_link: "Politique de confidentialit\u00E9",
    version_label: "Version :",
    rights_reserved: "Tous droits r\u00E9serv\u00E9s",
    empty_state_title: "Aucune session enregistr\u00E9e pour le moment",
    empty_state_description: "Enregistrez la fen\u00EAtre actuelle pour constituer votre collection et tout rouvrir imm\u00E9diatement.",
    tab_count_one: "1 onglet",
    tab_count_other: "{count} onglets",
    window_count_one: "1 fen\u00EAtre",
    window_count_other: "{count} fen\u00EAtres",
    desktop_scope_workspace: "Bureau actuel"
  },
  de: {
    title: "Tab-Sitzungsspeicher",
    subtitle: "Halte deine Arbeitsbereiche mit einem Klick bereit.",
    save_button: "Aktuelle Tabs speichern",
    restore_button: "Wiederherstellen",
    export_button: "Gespeicherte Sitzungen exportieren (JSON)",
    import_button: "Sitzungen importieren (JSON)",
    settings_title: "Einstellungen",
    language_label: "Sprache",
    dark_mode_label: "Dunkelmodus",
    color_label: "Akzentfarbe",
    sessions_limit_label: "Grenze gespeicherter Sitzungen",
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
    chrome_store_link: "Chrome Web Store",
    developer_label: "Entwickler:",
    privacy_policy_link: "Datenschutzerkl\u00E4rung",
    version_label: "Version:",
    rights_reserved: "Alle Rechte vorbehalten",
    empty_state_title: "Noch keine Sitzungen gespeichert",
    empty_state_description: "Speichere das aktuelle Fenster, um deine Sammlung aufzubauen und alles sofort erneut zu \u00F6ffnen.",
    tab_count_one: "1 Tab",
    tab_count_other: "{count} Tabs",
    window_count_one: "1 Fenster",
    window_count_other: "{count} Fenster",
    desktop_scope_workspace: "Aktueller Desktop"
  }
};

const localeMap = {
  en: 'en-US',
  es: 'es-ES',
  it: 'it-IT',
  fr: 'fr-FR',
  de: 'de-DE'
};

let currentLanguage = 'en';

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

function sanitizeTabForClient(tab) {
  if (!tab || typeof tab.url !== 'string') return null;
  return {
    title: typeof tab.title === 'string' && tab.title ? tab.title : tab.url,
    url: tab.url,
    pinned: Boolean(tab.pinned),
    active: Boolean(tab.active),
    muted: typeof tab.muted === 'boolean' ? tab.muted : Boolean(tab.mutedInfo?.muted),
    favIconUrl: typeof tab.favIconUrl === 'string' ? tab.favIconUrl : null,
    audible: Boolean(tab.audible),
    discarded: Boolean(tab.discarded)
  };
}

function sanitizeWindowForClient(win) {
  const tabs = Array.isArray(win?.tabs) ? win.tabs : [];
  return {
    state: win?.state || 'normal',
    focused: Boolean(win?.focused),
    left: Number.isFinite(win?.left) ? win.left : null,
    top: Number.isFinite(win?.top) ? win.top : null,
    width: Number.isFinite(win?.width) ? win.width : null,
    height: Number.isFinite(win?.height) ? win.height : null,
    incognito: Boolean(win?.incognito),
    alwaysOnTop: Boolean(win?.alwaysOnTop),
    tabs: tabs.map((tab) => sanitizeTabForClient(tab)).filter(Boolean)
  };
}

function normalizeSessionSnapshot(raw) {
  const base = raw && typeof raw === 'object' ? { ...raw } : {};
  const windowsSource = Array.isArray(base.windows)
    ? base.windows
    : Array.isArray(base.session)
    ? [{ tabs: base.session }]
    : Array.isArray(base.tabs)
    ? [{ tabs: base.tabs }]
    : [];

  const sanitizedWindows = windowsSource.map((win) => sanitizeWindowForClient(win));
  const metadata =
    base.metadata && typeof base.metadata === 'object' ? { ...base.metadata } : {};
  let desktopStrategy = base.desktopStrategy || metadata.desktopStrategy || null;
  if (desktopStrategy === 'unknown' || desktopStrategy === 'best-effort' || desktopStrategy === 'global') {
    desktopStrategy = null;
  }
  if (metadata.desktopStrategy === 'unknown' || metadata.desktopStrategy === 'best-effort' || metadata.desktopStrategy === 'global') {
    delete metadata.desktopStrategy;
  }
  const desktopKey = base.desktopKey || metadata.desktopKey || null;

  const metadataForClient = { ...metadata, desktopKey };
  if (desktopStrategy) {
    metadataForClient.desktopStrategy = desktopStrategy;
  } else {
    delete metadataForClient.desktopStrategy;
  }

  return {
    ...base,
    timestamp:
      typeof base.timestamp === 'string' && base.timestamp
        ? base.timestamp
        : new Date().toISOString(),
    windows: sanitizedWindows,
    metadata: metadataForClient,
    desktopKey,
    ...(desktopStrategy ? { desktopStrategy } : {})
  };

}

function computeSessionCounts(session) {
  const windows = Array.isArray(session?.windows) ? session.windows : [];
  const windowsCount = windows.length;
  const tabsCount = windows.reduce((total, win) => {
    const tabTotal = Array.isArray(win.tabs) ? win.tabs.length : 0;
    return total + tabTotal;
  }, 0);
  return { windowsCount, tabsCount };
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
  const maxSessionsInput = document.getElementById('maxSessions');
  const languageSelect = document.getElementById('language');

  document.addEventListener('click', closeAllMenus);

  // ACCENT COLOR
  accentSelect.addEventListener('change', e => {
    document.documentElement.style.setProperty('--accent-color', e.target.value);
    localStorage.setItem('accentColor', e.target.value);
  });

  // DARK MODE
  darkToggle.addEventListener('change', e => {
    document.body.classList.toggle('dark-mode', e.target.checked);
    document.body.classList.toggle('light-mode', !e.target.checked);
    localStorage.setItem('darkMode', e.target.checked);
  });

  // LANGUAGE SELECTION
  languageSelect.addEventListener('change', e => {
    const selectedLang = e.target.value;
    translatePage(selectedLang);
    localStorage.setItem('language', selectedLang);
    loadSessions(); // Reload sessions to update button text
  });

  // LIMITO NUMERO DI SESSIONI
  maxSessionsInput.addEventListener('change', e => {
    localStorage.setItem('maxSessions', e.target.value);
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
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (!Array.isArray(parsed)) throw new Error('Invalid format: expected an array');

          const valid = parsed.every(item =>
            item &&
            typeof item === 'object' &&
            typeof item.timestamp === 'string' &&
            (Array.isArray(item.windows) || Array.isArray(item.session) || Array.isArray(item.tabs))
          );
          if (!valid) throw new Error('Invalid session objects');

          const replace = confirm('Replace existing sessions with imported ones? Click OK to replace, Cancel to merge.');

          chrome.runtime.sendMessage({ action: 'get_sessions' }, (existingRaw) => {
            const existing = Array.isArray(existingRaw) ? existingRaw : [];
            let resultSessions = replace ? [] : existing.slice();
            const baseCount = resultSessions.length;

            const importedSessions = parsed.map((item, idx) => {
              const normalized = normalizeSessionSnapshot(item);
              if (!normalized.name || !normalized.name.trim()) {
                normalized.name = `${getTranslation('session_default_name')} ${baseCount + idx + 1}`;
              }
              return normalized;
            });

            resultSessions = replace ? importedSessions : resultSessions.concat(importedSessions);

            const max = parseInt(localStorage.getItem('maxSessions') || '10', 10);
            if (resultSessions.length > max) {
              resultSessions = resultSessions.slice(-max);
            }

            chrome.storage.local.set({ sessions: resultSessions }, () => {
              if (chrome.runtime.lastError) {
                console.error('Import persist error', chrome.runtime.lastError);
                alert('Failed to import sessions: ' + chrome.runtime.lastError.message);
                return;
              }
              loadSessions();
              alert('Import successful');
            });
          });
        } catch (err) {
          console.error('Import error', err);
          alert('Failed to import sessions: ' + (err.message || err));
        }
      };
      reader.readAsText(file);
    });
  }

  // ICONA IMPOSTAZIONI
  const settingsBtn = document.getElementById('settings-icon');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      closeAllMenus();
      const main = document.getElementById('main-section');
      const settings = document.getElementById('settings-section');
      const isSettingsVisible = settings && settings.style.display === 'block';
      const showSettings = !isSettingsVisible;
      if (settings) settings.style.display = showSettings ? 'block' : 'none';
      if (main) main.style.display = showSettings ? 'none' : 'block';
      settingsBtn.setAttribute('aria-expanded', showSettings.toString());
    });
  }

  // SALVATAGGIO TABS
  const saveButtonEl = document.getElementById('save');
  if (saveButtonEl) {
    saveButtonEl.addEventListener('click', () => {
      if (saveButtonEl.disabled) return;
      saveButtonEl.disabled = true;

      chrome.runtime.sendMessage({ action: 'get_sessions' }, (existingRaw) => {
        if (chrome.runtime.lastError) {
          console.error('Load sessions error', chrome.runtime.lastError);
          alert('Unable to load existing sessions. Please try again.');
          saveButtonEl.disabled = false;
          return;
        }
        const existing = Array.isArray(existingRaw) ? existingRaw : [];

        chrome.runtime.sendMessage({ action: 'capture_current_desktop' }, (snapshot) => {
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

          const sessionObject = normalizeSessionSnapshot({
            name: defaultName,
            timestamp,
            windows: snapshot.windows,
            metadata: {
              desktopKey: snapshot.desktopKey ?? null,
              ...(snapshot.desktopStrategy ? { desktopStrategy: snapshot.desktopStrategy } : {}),
              ...(snapshot.platform ? { platform: snapshot.platform } : {}),
              ...(snapshot.heuristics ? { heuristics: snapshot.heuristics } : {})
            },
            desktopKey: snapshot.desktopKey ?? null,
            ...(snapshot.desktopStrategy ? { desktopStrategy: snapshot.desktopStrategy } : {}),
            platform: snapshot.platform ?? null
          });

          if (!sessionObject.windows.length) {
            alert('No browser windows were detected to save on this desktop.');
            saveButtonEl.disabled = false;
            return;
          }

          const max = parseInt(localStorage.getItem('maxSessions') || '10', 10);
          const merged = existing.concat(sessionObject);
          const trimmed = merged.slice(-max);

          chrome.storage.local.set({ sessions: trimmed }, () => {
            saveButtonEl.disabled = false;
            if (chrome.runtime.lastError) {
              console.error('Session save error', chrome.runtime.lastError);
              alert('Unable to save this session. Please try again.');
              return;
            }
            loadSessions();
          });
        });
      });
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

  function loadSessions() {
    chrome.runtime.sendMessage({ action: 'get_sessions' }, (sessionsRaw) => {
      const container = document.getElementById('sessions');
      const emptyState = document.getElementById('empty-state');

      if (!container || !emptyState) {
        return;
      }

      container.innerHTML = '';
      resetPreviewStates();

      const sessions = Array.isArray(sessionsRaw) ? sessionsRaw : [];
      if (sessions.length === 0) {
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';

      sessions.forEach((sessionData, index) => {
        const normalized = normalizeSessionSnapshot(sessionData);
        const entry = document.createElement('div');
        entry.className = 'session-entry';
        entry.setAttribute('role', 'listitem');

        const sessionPayload = normalized;
        const sessionName =
          normalized.name && normalized.name.trim()
            ? normalized.name.trim()
            : `${getTranslation('session_default_name')} ${index + 1}`;

        const { date, time } = formatTimestamp(normalized.timestamp);
        const { windowsCount, tabsCount } = computeSessionCounts(normalized);
        const tabsLabel =
          tabsCount === 1
            ? getTranslation('tab_count_one')
            : getTranslation('tab_count_other').replace('{count}', tabsCount);
        const windowsLabel =
          windowsCount === 1
            ? getTranslation('window_count_one')
            : getTranslation('window_count_other').replace('{count}', windowsCount);
        const strategy = normalized.desktopStrategy || normalized.metadata?.desktopStrategy;
        const metaSegments = [date, time, windowsLabel, tabsLabel];
        if (strategy === 'workspace') {
          metaSegments.push(getTranslation('desktop_scope_workspace'));
        }

        const label = document.createElement('span');
        label.className = 'session-label';
        label.setAttribute('role', 'button');
        label.setAttribute('tabindex', '0');
        label.innerHTML = `
          <strong>${sessionName}</strong>
          <div class="session-meta">
            ${metaSegments.map(segment => `<span>${segment}</span>`).join('')}
          </div>
        `;

        const menuBtn = document.createElement('button');
        menuBtn.className = 'menu-button';
        menuBtn.setAttribute('aria-label', getTranslation('session_menu_label'));
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor"></circle>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"></circle>
          </svg>
        `;

        const menu = document.createElement('div');
        menu.className = 'menu-content';

        const previewBtn = document.createElement('button');
        previewBtn.textContent = getTranslation('preview_button');
        previewBtn.setAttribute('data-role', 'preview-toggle');

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
        menu.appendChild(renameBtn);
        menu.appendChild(deleteBtn);

        const menuWrapper = document.createElement('div');
        menuWrapper.className = 'menu-wrapper';
        menuWrapper.appendChild(menuBtn);
        menuWrapper.appendChild(menu);

        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'restore-btn';
        restoreBtn.type = 'button';
        restoreBtn.textContent = getTranslation('restore_button');

        const actions = document.createElement('div');
        actions.className = 'session-actions';
        actions.appendChild(restoreBtn);
        actions.appendChild(menuWrapper);

        const topRow = document.createElement('div');
        topRow.className = 'session-top';
        topRow.appendChild(label);
        topRow.appendChild(actions);

        const previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container';
        previewContainer.style.display = 'none';

        const previewHeader = document.createElement('div');
        previewHeader.className = 'preview-header';
        previewHeader.innerHTML = `<span>${getTranslation('preview_title')}</span><span class="preview-count">${tabsLabel} &bull; ${windowsLabel}</span>`;

        const previewWindowsWrapper = document.createElement('div');
        previewWindowsWrapper.className = 'preview-windows';

        if (!normalized.windows.length) {
          const emptyPreview = document.createElement('div');
          emptyPreview.className = 'preview-empty';
          emptyPreview.textContent = getTranslation('preview_empty');
          previewWindowsWrapper.appendChild(emptyPreview);
        } else {
          normalized.windows.forEach((winSnapshot, wIndex) => {
            const windowBlock = document.createElement('div');
            windowBlock.className = 'preview-window';

            const windowHeader = document.createElement('div');
            windowHeader.className = 'preview-window-header';

            const windowTabs = Array.isArray(winSnapshot.tabs) ? winSnapshot.tabs : [];
            const windowTabsLabel =
              windowTabs.length === 1
                ? getTranslation('tab_count_one')
                : getTranslation('tab_count_other').replace('{count}', windowTabs.length);

            windowHeader.innerHTML = `<span>${getTranslation('preview_window_label').replace('{index}', wIndex + 1)}</span><span class="preview-count">${windowTabsLabel}</span>`;

            const items = document.createElement('div');
            items.className = 'preview-items';

            if (!windowTabs.length) {
              const emptyTab = document.createElement('div');
              emptyTab.className = 'preview-empty';
              emptyTab.textContent = getTranslation('preview_empty');
              items.appendChild(emptyTab);
            } else {
              windowTabs.forEach((tab, tabIndex) => {
                const item = document.createElement('div');
                item.className = 'preview-item';

                const indexBadge = document.createElement('span');
                indexBadge.className = 'preview-index';
                indexBadge.textContent = String(tabIndex + 1);

                const iconWrapper = document.createElement('span');
                iconWrapper.className = 'preview-favicon';
                if (tab.favIconUrl) {
                  const iconImg = document.createElement('img');
                  iconImg.src = tab.favIconUrl;
                  iconImg.alt = '';
                  iconWrapper.appendChild(iconImg);
                } else {
                  iconWrapper.classList.add('is-placeholder');
                  iconWrapper.innerHTML = '&bull;';
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
                item.appendChild(indexBadge);
                item.appendChild(iconWrapper);
                item.appendChild(content);
                items.appendChild(item);
              });
            }

            windowBlock.appendChild(windowHeader);
            windowBlock.appendChild(items);
            previewWindowsWrapper.appendChild(windowBlock);
          });
        }

        previewContainer.appendChild(previewHeader);
        previewContainer.appendChild(previewWindowsWrapper);
        previewContainer.addEventListener('click', (event) => event.stopPropagation());

        const triggerRestore = () => {
          closeAllMenus();
          chrome.runtime.sendMessage(
            { action: 'open_session', session: sessionPayload },
            (res) => {
              if (chrome.runtime.lastError) {
                console.error('Restore error', chrome.runtime.lastError);
                alert('Unable to restore this session: ' + chrome.runtime.lastError.message);
                return;
              }
              if (!res || !res.success) {
                console.error('Restore failed', res && res.error);
                alert('Unable to restore this session: ' + (res && res.error ? res.error : 'Unknown error'));
                return;
              }
              window.close();
            }
          );
        };

        restoreBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          triggerRestore();
        });

        label.addEventListener('click', triggerRestore);
        label.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            triggerRestore();
          }
        });

        menu.addEventListener('click', (event) => event.stopPropagation());

        menuBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          const wasOpen = menu.style.display === 'block';
          closeAllMenus();
          if (!wasOpen) {
            menu.style.display = 'block';
            const spacer = menu.offsetHeight + 12;
            entry.classList.add('menu-open');
            entry.style.marginBottom = `${spacer}px`;
            menuBtn.setAttribute('aria-expanded', 'true');
          }
        });

        previewBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          const isOpen = previewContainer.classList.contains('is-open');
          closeAllMenus({ preservePreviews: true });
          if (isOpen) {
            previewContainer.classList.remove('is-open');
            previewContainer.style.display = 'none';
            previewBtn.textContent = getTranslation('preview_button');
          } else {
            resetPreviewStates();
            previewContainer.classList.add('is-open');
            previewContainer.style.display = 'block';
            previewBtn.textContent = getTranslation('preview_hide_button');
          }
        });

        entry.appendChild(topRow);
        entry.appendChild(previewContainer);
        container.appendChild(entry);
      });
    });
  }

  // Carica impostazioni salvate
  function restoreSettings() {
    const savedAccent = localStorage.getItem('accentColor');
    const savedDark = localStorage.getItem('darkMode');
    const savedLimit = localStorage.getItem('maxSessions');
    const savedLanguage = localStorage.getItem('language');

    if (savedAccent) {
      const hasOption = Array.from(accentSelect.options).some(option => option.value === savedAccent);
      if (!hasOption) {
        const customOption = document.createElement('option');
        customOption.value = savedAccent;
        customOption.textContent = savedAccent;
        accentSelect.appendChild(customOption);
      }
      accentSelect.value = savedAccent;
      document.documentElement.style.setProperty('--accent-color', savedAccent);
    }
    if (savedDark === 'true') {
      darkToggle.checked = true;
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
    if (savedLimit) {
      maxSessionsInput.value = savedLimit;
    }
    if (savedLanguage) {
      languageSelect.value = savedLanguage;
      translatePage(savedLanguage);
    } else {
      translatePage('en');
    }
  }

  restoreSettings();
  loadSessions();
});






