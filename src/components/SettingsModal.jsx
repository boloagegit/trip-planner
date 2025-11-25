import React, { useState } from 'react';
import { parseSheetUrl } from '../utils/csvParser';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, currentUrl, currentTitle, onSave }) => {
    const [url, setUrl] = useState(currentUrl || '');
    const [title, setTitle] = useState(currentTitle || '');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const csvUrl = parseSheetUrl(url);

        if (!csvUrl) {
            setError('Invalid Google Sheet URL. Please make sure it is a public Google Sheet link.');
            return;
        }

        onSave(csvUrl, title);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div onClick={e => e.stopPropagation()} className="modal-content">
                <h2 className="modal-title">
                    Settings
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label
                            htmlFor="tripTitle"
                            className="form-label"
                        >
                            Trip Title (Optional)
                        </label>
                        <input
                            id="tripTitle"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 2026 Tokyo Trip"
                            className="form-input"
                        />

                        <label
                            htmlFor="sheetUrl"
                            className="form-label"
                        >
                            Google Sheet URL
                        </label>
                        <input
                            id="sheetUrl"
                            type="text"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setError('');
                            }}
                            placeholder="https://docs.google.com/spreadsheets/d/..."
                            className="form-input"
                        />
                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}
                        <p className="helper-text">
                            Paste the full URL of your Google Sheet. Make sure the sheet is visible to anyone with the link (File &gt; Share &gt; Publish to web or Share with anyone).
                        </p>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                        >
                            Save & Reload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
