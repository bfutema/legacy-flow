import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ConfirmDialogProvider } from '../contexts/ConfirmDialogContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import {
  Content,
  ContentInner,
  Main,
  MobileNavBackdrop,
  Shell,
} from './AdminLayout.styles'
import { ADMIN_MOBILE_MEDIA } from './adminShellTokens'

const STORAGE_KEY = 'flow-sidebar-collapsed'

function readCollapsed(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1'
}

export function AdminLayout() {
  const { pathname } = useLocation()
  const isMobileLayout = useMediaQuery(ADMIN_MOBILE_MEDIA)
  const normalizedPath = pathname.replace(/\/$/, '') || '/'
  const contentFlush =
    normalizedPath === '/allocations' ||
    normalizedPath === '/tasks' ||
    normalizedPath === '/organogram' ||
    normalizedPath.startsWith('/tools/')
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMobileLayout || !mobileNavOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isMobileLayout, mobileNavOpen])

  useEffect(() => {
    if (!isMobileLayout || !mobileNavOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileNav()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobileLayout, mobileNavOpen, closeMobileNav])

  const toggleSidebar = useCallback(() => {
    setCollapsed((c) => {
      const next = !c
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  const onMenuButtonClick = useCallback(() => {
    if (isMobileLayout) {
      setMobileNavOpen((v) => !v)
    } else {
      toggleSidebar()
    }
  }, [isMobileLayout, toggleSidebar])

  return (
    <ConfirmDialogProvider>
      <Shell>
        {isMobileLayout && mobileNavOpen ? (
          <MobileNavBackdrop aria-label="Fechar menu" onClick={closeMobileNav} />
        ) : null}
        <Sidebar
          collapsed={collapsed}
          mobileDrawer={isMobileLayout}
          mobileOpen={mobileNavOpen}
          onNavigate={closeMobileNav}
        />
        <Main>
          <Header
            onToggleSidebar={onMenuButtonClick}
            mobileNav={isMobileLayout}
            mobileNavOpen={mobileNavOpen}
          />
          <Content>
            <ContentInner $flush={contentFlush}>
              <Outlet />
            </ContentInner>
          </Content>
        </Main>
      </Shell>
    </ConfirmDialogProvider>
  )
}
