import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faFileExcel, faCircleInfo, faGear,
  faMagnifyingGlass,
  faSun, faMoon,
  faShareNodes, faArrowsRotate,
  faChevronLeft, faChevronRight, faClipboardList, faMapLocationDot,
  faBook
} from '@fortawesome/free-solid-svg-icons';
import DayView from './components/DayView';
import MapView from './components/MapView';
import SettingsModal from './components/SettingsModal';
import SkeletonDay from './components/SkeletonDay';
import DateNavigation from './components/DateNavigation';
import HelpModal from './components/HelpModal';
import StatsModal from './components/StatsModal';
import NotesModal from './components/NotesModal';
import { parseMatrixCSV, extractSheetId, parseSheetUrl } from './utils/csvParser';
import './App.css';

function App() {
  const [itinerary, setItinerary] = useState(() => {
    try {
      const saved = localStorage.getItem('tokyo-trip-itinerary');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse itinerary from local storage', e);
      return [];
    }
  });

  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem('tokyo-trip-sheet-url') || '';
  });

  const [manualTitle, setManualTitle] = useState(() => {
    return localStorage.getItem('tokyo-trip-manual-title') || '';
  });

  const [tripMetadata, setTripMetadata] = useState(() => {
    try {
      const saved = localStorage.getItem('tokyo-trip-metadata');
      return saved ? JSON.parse(saved) : { title: 'Trip Planner', startDate: '', endDate: '' };
    } catch (e) {
      console.error('Failed to parse metadata from local storage', e);
      return { title: 'Trip Planner', startDate: '', endDate: '' };
    }
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('tokyo-trip-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Scroll button visibility
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tokyo-trip-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Check for query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sheetId = params.get('sheet');
    if (sheetId) {
      // Construct a standard URL from ID to save
      const newUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
      const csvUrl = parseSheetUrl(newUrl); // Ensure we have the export URL
      if (csvUrl) {
        setSheetUrl(csvUrl);
        localStorage.setItem('tokyo-trip-sheet-url', csvUrl);
        // Clear query param to clean up URL (optional, but keeps it clean)
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    // If no URL, don't fetch. Show settings or empty state.
    if (!sheetUrl) {
      if (itinerary.length === 0) {
        // Only auto-open if we didn't just load from a query param (which sets sheetUrl)
        // But since query param sets sheetUrl immediately, this check is fine.
        // We might want to delay this slightly or check if we are already loading.
        // For now, let's keep it simple.
      }
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(sheetUrl);
        if (!response.ok) throw new Error('Failed to fetch Google Sheet data');
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const parsedEvents = results.data;
            const { itinerary: newItinerary, metadata } = parseMatrixCSV(parsedEvents);

            if (newItinerary.length > 0) {
              setItinerary(newItinerary);
              setTripMetadata(metadata);
              localStorage.setItem('tokyo-trip-itinerary', JSON.stringify(newItinerary));
              localStorage.setItem('tokyo-trip-metadata', JSON.stringify(metadata));
            } else {
              console.warn('Parsed itinerary is empty');
            }
            setIsLoading(false);
          },
          error: (err) => {
            console.error('CSV Parse Error:', err);
            setError('Failed to parse itinerary data');
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to load itinerary. Please check the URL.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sheetUrl]);

  useEffect(() => {
    localStorage.setItem('tokyo-trip-itinerary', JSON.stringify(itinerary));
  }, [itinerary]);

  const handleUpdateSettings = (newUrl, newTitle) => {
    setSheetUrl(newUrl);
    localStorage.setItem('tokyo-trip-sheet-url', newUrl);

    setManualTitle(newTitle);
    if (newTitle) {
      localStorage.setItem('tokyo-trip-manual-title', newTitle);
    } else {
      localStorage.removeItem('tokyo-trip-manual-title');
    }
  };

  const handleReset = () => {
    // Direct reload without confirmation
    if (sheetUrl) {
      setIsLoading(true);
      setError(null);

      // Trigger re-fetch by temporarily changing and restoring sheetUrl
      // Or we can clear and reload from localStorage
      const currentUrl = sheetUrl;
      setSheetUrl(''); // Clear to trigger useEffect
      setTimeout(() => {
        setSheetUrl(currentUrl); // Restore to trigger fetch
      }, 100);
    }
  };

  const handleShare = () => {
    if (!sheetUrl) {
      setToast({ show: true, message: '尚未載入 Google Sheet', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      return;
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}?sheet=${extractSheetId(sheetUrl)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setToast({ show: true, message: '✓ 分享連結已複製到剪貼簿', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    }).catch(() => {
      setToast({ show: true, message: '複製失敗，請手動複製', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    });
  };

  const handleOpenSheet = () => {
    if (!sheetUrl) {
      alert('No Google Sheet URL configured');
      return;
    }

    // Extract Sheet ID and construct viewing URL
    const sheetId = extractSheetId(sheetUrl);
    if (!sheetId) {
      alert('Invalid Google Sheet URL');
      return;
    }

    // Construct the viewing URL (not the export URL)
    const viewUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    window.open(viewUrl, '_blank');
  };

  // Monitor scroll position to show/hide buttons
  useEffect(() => {
    const container = document.getElementById('days-container');
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // Show left button if not at the start
      setShowLeftButton(scrollLeft > 10);

      // Show right button if not at the end
      setShowRightButton(scrollLeft < maxScroll - 10);
    };

    // Initial check
    handleScroll();

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [itinerary]); // Re-run when itinerary changes

  // Calculate trip statistics
  const calculateStats = () => {
    if (!itinerary || itinerary.length === 0) {
      return { totalDays: 0, totalEvents: 0, foodCount: 0, transportCount: 0 };
    }

    const totalDays = itinerary.length;
    let totalEvents = 0;
    let foodCount = 0;
    let transportCount = 0;

    itinerary.forEach(day => {
      totalEvents += day.events.length;
      day.events.forEach(event => {
        if (event.type === 'food') foodCount++;
        if (event.type === 'transport') transportCount++;
      });
    });

    return { totalDays, totalEvents, foodCount, transportCount };
  };

  const stats = calculateStats();

  // View mode state (list or map)
  const [viewMode, setViewMode] = useState('list');

  // Filter itinerary based on search query
  const filteredItinerary = useMemo(() => {
    if (!searchQuery) return itinerary;

    const query = searchQuery.toLowerCase();
    return itinerary.map(day => ({
      ...day,
      events: day.events.filter(event =>
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query)
      )
    })).filter(day => day.events.length > 0);
  }, [itinerary, searchQuery]);

  // Handle date click from navigation
  // Handle date click from navigation
  const handleDateClick = (index) => {
    const container = document.getElementById('days-container');
    const element = document.getElementById(`day-${index}`);

    if (container && element) {
      // Calculate the position to scroll to
      // We want to center the element or align it to the start, but only horizontally
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Calculate relative position
      const offsetLeft = elementRect.left - containerRect.left;

      // Scroll the container
      container.scrollBy({
        left: offsetLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="app-container">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="header"
      >
        {/* Top Bar - Left: Data/Content, Right: Actions/Settings */}
        <div className="top-bar">
          <div className="top-bar-left">
            {itinerary.length > 0 && (
              <>
                <button
                  onClick={() => setIsStatsOpen(true)}
                  className="icon-button"
                  title="查看行程統計"
                >
                  <FontAwesomeIcon icon={faChartLine} />
                </button>
                <div className="view-toggle">
                  <button
                    className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="列表檢視"
                  >
                    <FontAwesomeIcon icon={faClipboardList} />
                  </button>
                  <button
                    className={`toggle-button ${viewMode === 'map' ? 'active' : ''}`}
                    onClick={() => setViewMode('map')}
                    title="地圖檢視"
                  >
                    <FontAwesomeIcon icon={faMapLocationDot} />
                  </button>
                </div>
              </>
            )}
            {sheetUrl && (
              <div
                className="connection-status"
                title="已連結 Google Sheet - 點擊開啟"
                onClick={handleOpenSheet}
              >
                <FontAwesomeIcon icon={faFileExcel} className="connection-icon" />
              </div>
            )}
          </div>
          <div className="top-bar-right">
            {itinerary.length > 0 && (
              <>
                <button
                  onClick={handleReset}
                  className="icon-button"
                  title="重新載入 Google Sheet 資料"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-spinner"></div>
                  ) : (
                    <FontAwesomeIcon icon={faArrowsRotate} />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="icon-button"
                  title="複製分享連結到剪貼簿"
                >
                  <FontAwesomeIcon icon={faShareNodes} />
                </button>
              </>
            )}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="icon-button"
              title="使用說明"
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </button>

            <button
              onClick={toggleTheme}
              className="icon-button theme-toggle"
              title={theme === 'dark' ? '切換到淺色模式' : '切換到深色模式'}
              style={{ overflow: 'hidden', position: 'relative' }}
            >
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
              </motion.div>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="icon-button"
              title="設定 Google Sheet URL 和標題"
            >
              <FontAwesomeIcon icon={faGear} />
            </button>
          </div>
        </div>

        <h1>{manualTitle || tripMetadata?.title || 'Trip Planner'}</h1>
        <p>{tripMetadata?.startDate ? `${tripMetadata.startDate} - ${tripMetadata.endDate}` : 'Plan your journey'}</p>

        {/* Search Bar */}
        {itinerary.length > 0 && (
          <div className="search-bar-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', maxWidth: '600px', margin: '0.75rem auto 1rem' }}>
            <div className="search-bar" style={{ margin: 0, flex: 1 }}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="搜尋活動、地點..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsNotesOpen(true)}
              className="icon-button"
              title="隨身筆記本"
              style={{ width: '44px', height: '44px', background: 'var(--bg-secondary)', borderRadius: '50%', border: '1px solid var(--border-color)' }}
            >
              <FontAwesomeIcon icon={faBook} />
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </motion.header>

      {isLoading ? (
        /* Skeleton Loading State */
        <div className="days-container">
          <SkeletonDay />
          <SkeletonDay />
          <SkeletonDay />
          <SkeletonDay />
        </div>
      ) : itinerary.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FontAwesomeIcon icon={faClipboardList} />
          </div>
          <h2>歡迎使用旅程規劃工具</h2>
          <p>點擊右上角的 ⚙️ 設定 Google Sheet 連結開始使用</p>
          <p>或點擊 ℹ️ 查看詳細使用說明</p>
          <button onClick={() => setIsSettingsOpen(true)} className="primary get-started-btn">
            開始設定
          </button>
        </div>
      ) : (
        viewMode === 'list' ? (
          <>
            <DateNavigation itinerary={itinerary} onDateClick={handleDateClick} />

            <div className="days-container" id="days-container">
              {filteredItinerary.map((day, index) => (
                <DayView
                  key={day.date}
                  day={day}
                  index={index}
                  id={`day-${index}`}
                />
              ))}

              {/* Scroll Buttons (Desktop) */}
              <button
                className="scroll-button scroll-button-left"
                onClick={() => scrollContainer('left')}
                aria-label="Scroll Left"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                className="scroll-button scroll-button-right"
                onClick={() => scrollContainer('right')}
                aria-label="Scroll Right"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </>
        ) : (
          <div className="map-view-wrapper">
            <MapView itinerary={filteredItinerary} />
          </div>
        )
      )}

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUrl={sheetUrl}
        currentTitle={manualTitle}
        onSave={handleUpdateSettings}
      />

      {/* Toast Notification */}
      {
        toast.show && (
          <div className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        )
      }
    </div>
  );
}

export default App;
