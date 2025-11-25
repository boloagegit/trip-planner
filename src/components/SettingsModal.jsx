import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            setError('無效的 Google Sheet 連結。請確認連結是否公開。');
            return;
        }

        onSave(csvUrl, title);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-backdrop"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="modal-content"
                        >
                            <h2 className="modal-title">
                                設定
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label
                                        htmlFor="tripTitle"
                                        className="form-label"
                                    >
                                        行程標題 (選填)
                                    </label>
                                    <input
                                        id="tripTitle"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="例如：2026 東京之旅"
                                        className="form-input"
                                    />

                                    <label
                                        htmlFor="sheetUrl"
                                        className="form-label"
                                    >
                                        Google Sheet 連結
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
                                        請貼上您的 Google Sheet 完整連結。請確保試算表已開啟「知道連結的人均可檢視」權限 (檔案 &gt; 共用 &gt; 發布到網路 或 共用)。
                                    </p>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="btn-cancel"
                                    >
                                        取消
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-save"
                                    >
                                        儲存並重新載入
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
