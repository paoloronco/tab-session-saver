(function () {
  async function detectBrowserType() {
    try {
      const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
      const brands = typeof navigator !== 'undefined' && navigator.userAgentData
        ? (navigator.userAgentData.brands || []).map(b => (b.brand || '').toLowerCase())
        : [];

      if (typeof navigator !== 'undefined' && navigator.brave && typeof navigator.brave.isBrave === 'function') {
        try {
          if (await navigator.brave.isBrave()) {
            return { id: 'brave', name: 'Brave', supported: false, confidence: 'high' };
          }
        } catch (_) {}
      }

      if (brands.some(b => b === 'microsoft edge') || /Edg\//.test(ua) || /Edge\//.test(ua)) {
        return { id: 'edge', name: 'Microsoft Edge', supported: false, confidence: brands.length ? 'high' : 'medium' };
      }
      if (brands.some(b => b === 'opera') || /OPR\//.test(ua)) {
        return { id: 'opera', name: 'Opera', supported: false, confidence: brands.length ? 'high' : 'medium' };
      }
      if (brands.some(b => b === 'vivaldi') || /Vivaldi\//.test(ua)) {
        return { id: 'vivaldi', name: 'Vivaldi', supported: false, confidence: brands.length ? 'high' : 'medium' };
      }
      if (brands.some(b => b === 'ulaa') || /Ulaa\//i.test(ua)) {
        return { id: 'ulaa', name: 'Ulaa', supported: false, confidence: brands.length ? 'high' : 'medium' };
      }
      if (brands.some(b => b === 'google chrome')) {
        return { id: 'chrome', name: 'Google Chrome', supported: true, confidence: 'high' };
      }
      if (brands.some(b => b === 'chromium')) {
        return { id: 'chromium', name: 'Chromium', supported: false, confidence: 'medium' };
      }
      if (/Chrome\//.test(ua)) {
        return { id: 'unknown', name: null, supported: null, confidence: 'low' };
      }

      return { id: 'unknown', name: null, supported: null, confidence: 'low' };
    } catch (_) {
      return { id: 'unknown', name: null, supported: null, confidence: 'low' };
    }
  }

  window.browserSupport = {
    detectBrowserType
  };
})();
