import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ConfirmDialogProvider } from '../contexts/ConfirmDialogContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Content, ContentInner, Main, Shell } from './AdminLayout.styles'

const STORAGE_KEY = 'flow-sidebar-collapsed'

function readCollapsed(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1'
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed)

  const toggleSidebar = useCallback(() => {
    setCollapsed((c) => {
      const next = !c
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  return (
    <ConfirmDialogProvider>
      <Shell>
        <Sidebar collapsed={collapsed} />
        <Main>
          <Header onToggleSidebar={toggleSidebar} />
          <Content>
            <ContentInner>
              <Outlet />
            </ContentInner>
          </Content>
        </Main>
      </Shell>
    </ConfirmDialogProvider>
  )
}
