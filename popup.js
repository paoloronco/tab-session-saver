// popup.js

// Translation object
const translations = {
  en: {
    title: "Tab Session Saver",
    save_button: "💾 Save tabs",
    settings_title: "Settings",
    language_label: "Language:",
    dark_mode_label: "Dark Mode",
    color_label: "Main color:",
    sessions_limit_label: "Saved sessions limit",
    color_blue: "Blue",
    color_green: "Green",
    color_yellow: "Yellow",
    color_red: "Red",
    color_purple: "Purple",
    delete_button: "Delete",
    rename_button: "Rename",
    preview_button: "Show preview",
    session_default_name: "Session",
    rename_prompt: "Enter a new name for this session:",
    chrome_store_link: "Chrome Web Store",
    developer_label: "Developer:",
    privacy_policy_link: "Privacy Policy",
    version_label: "Version:",
    rights_reserved: "All rights reserved"
  },
  es: {
    title: "Guardador de Pestañas",
    save_button: "💾 Guardar pestañas",
    settings_title: "Configuración",
    language_label: "Idioma:",
    dark_mode_label: "Modo Oscuro",
    color_label: "Color principal:",
    sessions_limit_label: "Límite de sesiones guardadas",
    color_blue: "Azul",
    color_green: "Verde",
    color_yellow: "Amarillo",
    color_red: "Rojo",
    color_purple: "Morado",
    delete_button: "Eliminar",
    rename_button: "Renombrar",
    preview_button: "Mostrar vista previa",
    session_default_name: "Sesión",
    rename_prompt: "Ingresa un nuevo nombre para esta sesión:",
    chrome_store_link: "Chrome Web Store",
    developer_label: "Desarrollador:",
    privacy_policy_link: "Política de Privacidad",
    version_label: "Versión:",
    rights_reserved: "Todos los derechos reservados"
  },
  it: {
    title: "Salva Schede",
    save_button: "💾 Salva schede",
    settings_title: "Impostazioni",
    language_label: "Lingua:",
    dark_mode_label: "Modalità Scura",
    color_label: "Colore principale:",
    sessions_limit_label: "Limite sessioni salvate",
    color_blue: "Blu",
    color_green: "Verde",
    color_yellow: "Giallo",
    color_red: "Rosso",
    color_purple: "Viola",
    delete_button: "Elimina",
    rename_button: "Rinomina",
    preview_button: "Mostra anteprima",
    session_default_name: "Sessione",
    rename_prompt: "Inserisci un nuovo nome per questa sessione:",
    chrome_store_link: "Chrome Web Store",
    developer_label: "Sviluppatore:",
    privacy_policy_link: "Informativa sulla Privacy",
    version_label: "Versione:",
    rights_reserved: "Tutti i diritti riservati"
  },
  fr: {
    title: "Sauvegarde d'Onglets",
    save_button: "💾 Sauvegarder les onglets",
    settings_title: "Paramètres",
    language_label: "Langue:",
    dark_mode_label: "Mode Sombre",
    color_label: "Couleur principale:",
    sessions_limit_label: "Limite de sessions sauvegardées",
    color_blue: "Bleu",
    color_green: "Vert",
    color_yellow: "Jaune",
    color_red: "Rouge",
    color_purple: "Violet",
    delete_button: "Supprimer",
    rename_button: "Renommer",
    preview_button: "Afficher l'aperçu",
    session_default_name: "Session",
    rename_prompt: "Entrez un nouveau nom pour cette session:",
    chrome_store_link: "Chrome Web Store",
    developer_label: "Développeur:",
    privacy_policy_link: "Politique de Confidentialité",
    version_label: "Version:",
    rights_reserved: "Tous droits réservés"
  },
  de: {
    title: "Tab-Speicher",
    save_button: "💾 Tabs speichern",
    settings_title: "Einstellungen",
    language_label: "Sprache:",
    dark_mode_label: "Dunkler Modus",
    color_label: "Hauptfarbe:",
    sessions_limit_label: "Limit für gespeicherte Sitzungen",
    color_blue: "Blau",
    color_green: "Grün",
    color_yellow: "Gelb",
    color_red: "Rot",
    color_purple: "Lila",
    delete_button: "Löschen",
    rename_button: "Umbenennen",
    preview_button: "Vorschau anzeigen",
    session_default_name: "Sitzung",
    rename_prompt: "Geben Sie einen neuen Namen für diese Sitzung ein:",
    chrome_store_link: "Chrome Web Store",
    developer_label: "Entwickler:",
    privacy_policy_link: "Datenschutzrichtlinie",
    version_label: "Version:",
    rights_reserved: "Alle Rechte vorbehalten"
  }
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
}

// Helper function to get translated text
function getTranslation(key) {
  return translations[currentLanguage] && translations[currentLanguage][key] 
    ? translations[currentLanguage][key] 
    : translations['en'][key] || key;
}

document.addEventListener('DOMContentLoaded', () => {
  const accentSelect = document.getElementById('accentColor');
  const darkToggle = document.getElementById('darkMode');
  const maxSessionsInput = document.getElementById('maxSessions');
  const languageSelect = document.getElementById('language');

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

  // ICONA IMPOSTAZIONI
  const settingsBtn = document.getElementById('settings-icon');
  settingsBtn.addEventListener('click', () => {
    const main = document.getElementById('main-section');
    const settings = document.getElementById('settings-section');
    const isSettingsVisible = settings.style.display === 'block';
    settings.style.display = isSettingsVisible ? 'none' : 'block';
    main.style.display = isSettingsVisible ? 'block' : 'none';
  });

  // SALVATAGGIO TABS
  document.getElementById('save').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'get_sessions' }, (sessions) => {
      const max = parseInt(localStorage.getItem('maxSessions') || '10', 10);

      chrome.tabs.query({}, (tabs) => {
        const session = tabs.map(tab => ({ title: tab.title, url: tab.url }));
        const timestamp = new Date().toISOString();
        // Aggiungiamo un nome predefinito per la sessione
        const sessionName = `${getTranslation('session_default_name')} ${sessions.length + 1}`;
        sessions.push({ timestamp, session, name: sessionName });

        // Limita il numero di sessioni salvate
        const trimmed = sessions.slice(-max);
        chrome.storage.local.set({ sessions: trimmed }, () => loadSessions());
      });
    });
  });

  // Funzione per rinominare una sessione
  function renameSession(index, newName) {
    chrome.runtime.sendMessage({ 
      action: 'rename_session', 
      index: index, 
      newName: newName 
    }, (res) => {
      if (res.success) loadSessions();
    });
  }

  function loadSessions() {
    chrome.runtime.sendMessage({ action: 'get_sessions' }, (sessions) => {
      const container = document.getElementById('sessions');
      container.innerHTML = '';
      sessions.forEach((s, i) => {
        const entry = document.createElement('div');
        entry.className = 'session-entry';

        const label = document.createElement('span');
        label.className = 'session-label';
        // Visualizza il nome personalizzato o quello predefinito
        const sessionName = s.name || `Session ${i + 1}`;
        label.innerHTML = `📂 <strong>${sessionName}</strong><br>${new Date(s.timestamp).toLocaleDateString()}<br>${new Date(s.timestamp).toLocaleTimeString()}`;

        const menuBtn = document.createElement('button');
        menuBtn.className = 'menu-button';
        menuBtn.textContent = '⋮';

        const menu = document.createElement('div');
        menu.className = 'menu-content';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = getTranslation('delete_button');
        deleteBtn.addEventListener('click', () => {
          chrome.runtime.sendMessage({ action: 'delete_session', index: i }, (res) => {
            if (res.success) loadSessions();
          });
        });

        const renameBtn = document.createElement('button');
        renameBtn.textContent = getTranslation('rename_button');
        renameBtn.addEventListener('click', () => {
          // Nascondi il menu
          menu.style.display = 'none';
          
          // Chiedi il nuovo nome
          const newName = prompt(getTranslation('rename_prompt'), sessionName);
          
          // Se l'utente ha inserito un nome e ha premuto OK
          if (newName !== null && newName.trim() !== '') {
            renameSession(i, newName.trim());
          }
        });

        const previewBtn = document.createElement('button');
        previewBtn.textContent = getTranslation('preview_button');

        const preview = document.createElement('ul');
        preview.className = 'preview-list';
        preview.style.marginLeft = '1.5rem';
        preview.style.paddingLeft = '1.2rem';
        preview.style.listStyle = 'disc';
        s.session.forEach(tab => {
          const item = document.createElement('li');
          const title = tab.title || tab.url;
          const shortTitle = title.split(' - ')[0].trim();
          item.textContent = shortTitle;
          preview.appendChild(item);
        });

        preview.style.display = 'none';
        previewBtn.addEventListener('click', () => {
          preview.style.display = preview.style.display === 'block' ? 'none' : 'block';
        });

        menu.appendChild(renameBtn); // Aggiungi il bottone Rename
        menu.appendChild(deleteBtn);
        menu.appendChild(previewBtn);
        entry.appendChild(label);
        entry.appendChild(menuBtn);
        entry.appendChild(menu);
        entry.appendChild(preview);
        container.appendChild(entry);

        let open = false;
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.menu-content').forEach(m => m.style.display = 'none');
          menu.style.display = open ? 'none' : 'block';
          open = !open;
        });

        window.addEventListener('click', () => {
          menu.style.display = 'none';
          open = false;
        });

        label.addEventListener('click', () => {
          chrome.runtime.sendMessage({ action: 'open_session', session: s.session });
        });
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
      // Default to English if no language is saved
      translatePage('en');
    }
  }

  restoreSettings();
  loadSessions();
});
