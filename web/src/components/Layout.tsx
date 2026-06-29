import { Link, NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <div className="app-window" role="application" aria-label="Library of Lies window">
        <header className="window-title-bar">
          <div className="window-title-left">
            <span className="window-app-dot" aria-hidden="true" />
            <p className="window-title">Library of Lies.exe</p>
          </div>
          <div className="window-actions" aria-hidden="true">
            <span className="window-action">_</span>
            <span className="window-action">[]</span>
            <span className="window-action">X</span>
          </div>
        </header>

        <div className="window-menu-bar" aria-label="Application menu">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'menu-link menu-link-active' : 'menu-link'
            }
          >
            Datasets
          </NavLink>
          <NavLink
            to="/terms"
            className={({ isActive }) =>
              isActive ? 'menu-link menu-link-active' : 'menu-link'
            }
          >
            Terms
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'menu-link menu-link-active' : 'menu-link'
            }
          >
            About Us
          </NavLink>
        </div>

        <div className="window-body">
          <header className="top-bar">
            <Link to="/" className="brand-home-link" aria-label="Go to homepage">
              <p className="eyebrow">Deception Data Archive</p>
              <h1 className="brand">Library of Lies</h1>
            </Link>
            <p className="toolbar-label">Dataset Explorer</p>
          </header>
          <main className="page-content">
            <Outlet />
          </main>
        </div>

        <footer className="window-status-bar" aria-label="Status bar">
          <span>Connected: archive.local</span>
          <span>Rendering mode: CRT</span>
        </footer>
      </div>
    </div>
  )
}
