// icons import
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";

import "./topbar.css";

const Topbar = () => {
  return (
    <div className="topbar-container">
      <div className="topbar-left">
        <div className="logo">Nakama</div>
      </div>
      <div className="topbar-center">
        <div className="searchbar">
          <SearchIcon />
          <input
            type="text"
            className="search-input"
            placeholder="Search for friend, post or video"
          />
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-links">
          <span className="topbar-link">Homepage</span>
          <span className="topbar-link">Timeline</span>
        </div>
        <div className="topbar-icons">
          <div className="topbar-icon-item">
            <PersonIcon />
            <span className="topbar-icon-badge">2</span>
          </div>
          <div className="topbar-icon-item">
            <ChatIcon />
            <span className="topbar-icon-badge">1</span>
          </div>
          <div className="topbar-icon-item">
            <NotificationsIcon />
            <span className="topbar-icon-badge">5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
