import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem('userData'))

  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a className="brand-link d-flex justify-content-between">
          <div>
            <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
            <span className="brand-text font-weight-light">AdminLTE 3</span>
          </div>
          <span data-widget="pushmenu" href="#" className="pr-2" style={{cursor: 'pointer'}}><i className="fas fa-bars" /></span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">         
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">         
              <li className="nav-item">
                <span className={`${window.location.href.includes('tracker') && 'active'} nav-link `} onClick={() => navigate(`/tracker`)}>
                  <i className="nav-icon fas fa-columns" />
                  <p>Tracker</p>
                </span>
              </li> 
              {userData?.role?.permissions?.view_calendar &&
                <li className="nav-item">
                  <span className={`${window.location.href.includes('calendar') && 'active'} nav-link `} onClick={() => navigate(`/calendar`)}>
                    <i className="nav-icon far fa-calendar-alt" />
                    <p>Calendar</p>
                  </span>
                </li>
              }    
              {userData?.role?.permissions?.view_employee &&
                <li className="nav-item">
                  <span className={`${window.location.href.includes('employee') && 'active'} nav-link `} onClick={() => navigate(`/employee`)}>
                    <i className="nav-icon far fa-image" />
                    <p>Employee</p>
                  </span>
                </li>
              }
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
