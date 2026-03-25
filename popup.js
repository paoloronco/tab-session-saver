// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const accentSelect = document.getElementById('accentColor');
  const darkToggle = document.getElementById('darkMode');
  const maxSessionsInput = document.getElementById('maxSessions');

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

      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const session = tabs.map(tab => ({ title: tab.title, url: tab.url }));
        const timestamp = new Date().toISOString();
        sessions.push({ timestamp, session });

        // Limita il numero di sessioni salvate
        const trimmed = sessions.slice(-max);
        chrome.storage.local.set({ sessions: trimmed }, () => loadSessions());
      });
    });
  });

  function loadSessions() {
    chrome.runtime.sendMessage({ action: 'get_sessions' }, (sessions) => {
      const container = document.getElementById('sessions');
      container.innerHTML = '';
      sessions.forEach((s, i) => {
        const entry = document.createElement('div');
        entry.className = 'session-entry';

        const label = document.createElement('span');
        label.className = 'session-label';
        label.innerHTML = `📂 <strong>Session ${i + 1}</strong><br>${new Date(s.timestamp).toLocaleDateString()}<br>${new Date(s.timestamp).toLocaleTimeString()}`;

        const menuBtn = document.createElement('button');
        menuBtn.className = 'menu-button';
        menuBtn.textContent = '⋮';

        const menu = document.createElement('div');
        menu.className = 'menu-content';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
          chrome.runtime.sendMessage({ action: 'delete_session', index: i }, (res) => {
            if (res.success) loadSessions();
          });
        });

        const previewBtn = document.createElement('button');
        previewBtn.textContent = 'Show preview';

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
  }

  restoreSettings();
  loadSessions();
});