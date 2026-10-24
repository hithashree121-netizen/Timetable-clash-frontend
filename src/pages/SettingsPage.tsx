import React, { useState } from 'react';
import { Settings, Server, RefreshCw, Save } from 'lucide-react';
import { getDemoMode, setDemoMode, API_BASE_URL } from '../api/config';

interface SettingsPageProps {
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onResetData }) => {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [isDemo, setIsDemo] = useState(getDemoMode());
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoMode(isDemo);
    setSavedMsg('Settings saved successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '720px' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          System Settings & API Configuration
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Configure REST API connection, environment variables, default graph coloring algorithms, and demonstration modes.
        </p>
      </div>

      <form onSubmit={handleSave} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {savedMsg && (
          <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
            {savedMsg}
          </div>
        )}

        <div>
          <label className="form-label">REST API Base URL (VITE_API_URL)</label>
          <input
            type="text"
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            className="input-field"
            placeholder="http://localhost:5000/api"
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
            Base endpoint for Python / Flask / Node REST backend services.
          </div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--space-hover)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              Standalone Demo Mode
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Uses client-side Graph Coloring algorithm engine when backend server is offline.
            </div>
          </div>

          <input
            type="checkbox"
            checked={isDemo}
            onChange={e => setIsDemo(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button type="button" onClick={onResetData} className="btn btn-danger btn-sm">
            <RefreshCw size={14} /> Reset Mock Data
          </button>

          <button type="submit" className="btn btn-primary">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
