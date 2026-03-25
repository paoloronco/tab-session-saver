chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "save_tabs") {
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const session = tabs.map(tab => ({ title: tab.title, url: tab.url }));
        const timestamp = new Date().toISOString();
        chrome.storage.local.get({ sessions: [] }, (data) => {
          const sessions = data.sessions;
          sessions.push({ timestamp, session, name: `Session ${sessions.length + 1}` });
          chrome.storage.local.set({ sessions });
          sendResponse({ success: true });
        });
      });
      return true;
    }
  
    if (request.action === "get_sessions") {
      chrome.storage.local.get({ sessions: [] }, (data) => {
        sendResponse(data.sessions);
      });
      return true;
    }
  
    if (request.action === "open_session") {
      const tabs = request.session;
      chrome.windows.create({ url: tabs.map(t => t.url) });
      sendResponse({ success: true });
    }
  
    if (request.action === "delete_session") {
      chrome.storage.local.get({ sessions: [] }, (data) => {
        data.sessions.splice(request.index, 1);
        chrome.storage.local.set({ sessions: data.sessions }, () => {
          sendResponse({ success: true });
        });
      });
      return true;
    }

    // Aggiunta della funzionalità di rinomina
    if (request.action === "rename_session") {
      chrome.storage.local.get({ sessions: [] }, (data) => {
        // Controlla se l'indice è valido
        if (request.index >= 0 && request.index < data.sessions.length) {
          // Aggiorna il nome della sessione
          data.sessions[request.index].name = request.newName;
          // Salva le modifiche
          chrome.storage.local.set({ sessions: data.sessions }, () => {
            sendResponse({ success: true });
          });
        } else {
          sendResponse({ success: false, error: "Invalid index" });
        }
      });
      return true;
    }
  });