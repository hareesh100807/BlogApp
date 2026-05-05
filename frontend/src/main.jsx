import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Disable analytics (Mixpanel) network calls unless explicitly enabled via VITE_ENABLE_ANALYTICS
if (import.meta.env.VITE_ENABLE_ANALYTICS !== 'true' && typeof window !== 'undefined') {
  try {
    // No-op mixpanel object
    window.mixpanel = window.mixpanel || {
      track: () => {},
      identify: () => {},
      people: { set: () => {} },
      init: () => {},
    };

    // Block fetch to mixpanel endpoints
    const _fetch = window.fetch;
    window.fetch = function (resource, init) {
      try {
        const url = typeof resource === 'string' ? resource : resource?.url;
        if (url && url.includes('mixpanel.com')) {
          console.warn('Blocked analytics fetch to', url);
          return Promise.resolve(new Response(null, { status: 204 }));
        }
      } catch (e) {
        // ignore
      }
      return _fetch.apply(this, arguments);
    };

    // Block XHR to mixpanel
    const _XMLHttpRequest = window.XMLHttpRequest;
    function XHRProxy() {
      const xhr = new _XMLHttpRequest();
      const _open = xhr.open;
      xhr.open = function (method, url) {
        this._url = url;
        return _open.apply(this, arguments);
      };
      const _send = xhr.send;
      xhr.send = function () {
        try {
          if (this._url && this._url.includes('mixpanel.com')) {
            console.warn('Blocked analytics XHR to', this._url);
            // abort the request silently
            if (typeof this.abort === 'function') this.abort();
            return;
          }
        } catch (e) {
          // ignore
        }
        return _send.apply(this, arguments);
      };
      return xhr;
    }
    window.XMLHttpRequest = XHRProxy;
  } catch (e) {
    console.warn('Analytics guard setup failed', e);
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
