import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList, faMapLocationDot, faChartLine, faCalendarDays,
  faUtensils, faBus, faShareNodes, faArrowsRotate, faCircleInfo, faGear, faBook
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Stats = ({ stats }) => (
  <div className="stats-container">
    <h3 className="sidebar-subtitle"><FontAwesomeIcon icon={faChartLine} /> 行程統計</h3>
    <div className="stats-grid">
      <div className="stat-item">
        <FontAwesomeIcon icon={faCalendarDays} className="stat-icon" />
        <div>
          <span className="stat-value">{stats.totalDays}</span>
          <span className="stat-label">天</span>
        </div>
      </div>
      <div className="stat-item">
        <FontAwesomeIcon icon={faClipboardList} className="stat-icon" />
        <div>
          <span className="stat-value">{stats.totalEvents}</span>
          <span className="stat-label">活動</span>
        </div>
      </div>
      <div className="stat-item">
        <FontAwesomeIcon icon={faUtensils} className="stat-icon" />
        <div>
          <span className="stat-value">{stats.foodCount}</span>
          <span className="stat-label">美食</span>
        </div>
      </div>
      <div className="stat-item">
        <FontAwesomeIcon icon={faBus} className="stat-icon" />
        <div>
          <span className="stat-value">{stats.transportCount}</span>
          <span className="stat-label">交通</span>
        </div>
      </div>
    </div>
  </div>
);

const Sidebar = ({
  viewMode, setViewMode, itinerary, activeDate, setActiveDate, handleDateClick, isOpen,
  stats, handleReset, handleShare, setIsHelpOpen, setIsSettingsOpen, isLoading
}) => {
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { weekday: 'long' });
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Trip Planner</h2>
      </div>

      <div className="view-toggle-container">
        <div className="view-toggle">
          <button
            className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="列表檢視"
          >
            <FontAwesomeIcon icon={faClipboardList} />
            <span>列表</span>
          </button>
          <button
            className={`toggle-button ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
            title="地圖檢視"
          >
            <FontAwesomeIcon icon={faMapLocationDot} />
            <span>地圖</span>
          </button>
          <button
            className={`toggle-button ${viewMode === 'notes' ? 'active' : ''}`}
            onClick={() => setViewMode('notes')}
            title="筆記"
          >
            <FontAwesomeIcon icon={faBook} />
            <span>筆記</span>
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        <h3 className="sidebar-subtitle">行程日期</h3>
        <ul className="date-list">
          {itinerary.map((day, index) => (
            <li
              key={day.date}
              className={`date-item ${day.date === activeDate ? 'active' : ''}`}
              onClick={() => {
                setActiveDate(day.date);
                handleDateClick(index);
              }}
            >
              <span className="date-text">{day.date}</span>
              <span className="day-of-week">{getDayOfWeek(day.date)}</span>
            </li>
          ))}
        </ul>
        {itinerary.length > 0 && <Stats stats={stats} />}
      </nav>

      <div className="sidebar-footer">
        <div className="action-buttons">
          <button onClick={handleReset} className="action-button" title="重新載入" disabled={isLoading}>
            {isLoading ? <div className="button-spinner"></div> : <FontAwesomeIcon icon={faArrowsRotate} />}
          </button>
          <button onClick={handleShare} className="action-button" title="分享">
            <FontAwesomeIcon icon={faShareNodes} />
          </button>
          <button onClick={() => setIsHelpOpen(true)} className="action-button" title="說明">
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="action-button" title="設定">
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
