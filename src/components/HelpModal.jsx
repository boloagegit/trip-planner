import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="help-modal-backdrop"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="help-modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="help-modal-close" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>

                    <h2>📖 新手指南</h2>
                    <p className="help-subtitle">5 分鐘快速上手旅程規劃工具</p>

                    <div className="help-section">
                        <h3>📋 步驟 1：準備 Google Sheet</h3>
                        <div className="help-step-content">
                            <p><strong>選項 A：使用範本（推薦）</strong></p>
                            <p>點擊下方按鈕複製範本到你的 Google Drive：</p>
                            <a
                                href="https://docs.google.com/spreadsheets/d/1NXqFVzx1TAqxwq_Z4OGAJzn7x2qd5YqPXhC0I3J5Oko/copy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="template-button"
                            >
                                📄 複製範本 Google Sheet
                            </a>

                            <p style={{ marginTop: '1rem' }}><strong>選項 B：自己建立</strong></p>
                            <p>建立一個新的 Google Sheet，格式如下：</p>
                            <ul>
                                <li><strong>第一列</strong>：日期（例如：12/28、12/29、12/30）</li>
                                <li><strong>第一欄</strong>：時間（例如：8:00、12:00-13:00、14:00）</li>
                                <li><strong>內容儲存格</strong>：填入活動名稱和描述</li>
                            </ul>
                        </div>
                    </div>

                    <div className="help-section">
                        <h3>🌐 步驟 2：設定為公開</h3>
                        <div className="help-step-content">
                            <ol>
                                <li>在 Google Sheet 中點擊右上角的「共用」按鈕</li>
                                <li>點擊「取得連結」</li>
                                <li>將權限改為「知道連結的任何人」</li>
                                <li>權限設定為「檢視者」（唯讀）</li>
                                <li>點擊「複製連結」</li>
                            </ol>
                        </div>
                    </div>

                    <div className="help-section">
                        <h3>⚙️ 步驟 3：貼上連結</h3>
                        <div className="help-step-content">
                            <ol>
                                <li>點擊本頁面右上角的 ⚙️ 設定按鈕</li>
                                <li>將剛才複製的 Google Sheet 連結貼到「Sheet URL」欄位</li>
                                <li>（選填）輸入行程標題，例如「2026 東京跨年之旅」</li>
                                <li>點擊「儲存」</li>
                            </ol>
                        </div>
                    </div>

                    <div className="help-tips">
                        <h4>✨ 進階功能</h4>
                        <ul>
                            <li><strong>🗺️ 地圖定位：</strong>在活動名稱前加 🗺️ emoji，例如「🗺️東京鐵塔」，會自動產生 Google Maps 連結</li>
                            <li><strong>🍜 活動類型：</strong>系統會自動識別用餐、交通、住宿等類型並顯示對應圖示</li>
                            <li><strong>🔗 分享行程：</strong>點擊右上角的分享按鈕，複製連結給朋友</li>
                            <li><strong>↻ 即時更新：</strong>修改 Google Sheet 後，點擊 Reload 按鈕即可更新</li>
                            <li><strong>🌙 深色模式：</strong>點擊月亮圖示切換淺色/深色主題</li>
                        </ul>
                    </div>

                    <div className="help-note">
                        <strong>💡 小提醒：</strong>
                        <p>• 你的 Google Sheet 必須設為「知道連結的任何人」才能載入</p>
                        <p>• 所有資料都儲存在你自己的 Google Sheet 中，非常安全</p>
                        <p>• 此應用程式不會儲存或上傳你的任何資料</p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default HelpModal;
