/* global downloadSessions, formatTranslation, getTranslation, reportOperationError */
document.addEventListener('DOMContentLoaded', () => {
  const usage = document.getElementById('diagnostics-usage');
  const meter = document.getElementById('diagnostics-meter');
  const summary = document.getElementById('diagnostics-summary');
  const status = document.getElementById('diagnostics-status');
  const refresh = document.getElementById('diagnostics-refresh');
  const anonymous = document.getElementById('diagnostics-export-anonymous');
  const full = document.getElementById('diagnostics-export-full');
  const buttons = [refresh, anonymous, full];
  let busy = false;
  let lastReport;

  function render(report) {
    lastReport = report;
    usage.textContent = formatTranslation('diagnostics_usage', {
      used: (report.storage.usedBytes / 1024 / 1024).toFixed(2),
      limit: (report.storage.quotaBytes / 1024 / 1024).toFixed(2),
      percent: report.storage.percentUsed.toFixed(1)
    });
    meter.value = report.storage.percentUsed;
    meter.classList.toggle('is-near-limit', meter.value >= 90);
    summary.textContent = formatTranslation('diagnostics_summary', {
      manual: report.sessions.manual, auto: report.sessions.total - report.sessions.manual,
      logs: report.logs.length
    });
  }

  async function loadReport(exportFile = false, anonymized = true) {
    if (busy) return;
    busy = true;
    buttons.forEach(button => { button.disabled = true; });
    status.textContent = '';
    status.classList.remove('is-error');
    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'get_diagnostics', anonymized }, result => {
          if (chrome.runtime.lastError || !result?.success) reject(chrome.runtime.lastError || result);
          else resolve(result);
        });
      });
      render(response.report);
      if (exportFile) {
        downloadSessions(response.report, `tab-session-saver-diagnostics-${anonymized ? 'anonymous' : 'full'}-${new Date().toISOString().slice(0, 10)}.json`);
        status.textContent = getTranslation('diagnostics_exported');
      }
    } catch (error) {
      status.textContent = reportOperationError(error, 'load');
      status.classList.add('is-error');
    } finally {
      busy = false;
      buttons.forEach(button => { button.disabled = false; });
    }
  }

  refresh.addEventListener('click', () => loadReport());
  anonymous.addEventListener('click', () => loadReport(true, true));
  full.addEventListener('click', () => loadReport(true, false));
  document.getElementById('language').addEventListener('change', () => { if (lastReport) render(lastReport); });
  window.addEventListener('hashchange', () => { if (window.location.hash === '#diagnostics') void loadReport(); });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && window.location.hash === '#diagnostics' && changes.sessions) void loadReport();
  });
  void loadReport();
});
