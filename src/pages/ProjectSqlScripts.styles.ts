import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ADMIN_MOBILE_MEDIA } from '../layouts/adminShellTokens'

/** Sem padding horizontal: o shell (`ContentInner`) já aplica `1.5rem` / gutter / `2.5rem`. */
export const SqlScriptsRoot = styled.div`
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  box-sizing: border-box;
`

/** Mesmo ritmo de `FlowPersistHint` na modelagem. */
export const SqlScriptsHint = styled.p`
  margin: 0 0 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.4;

  @media ${ADMIN_MOBILE_MEDIA} {
    margin-bottom: 0.65rem;
    font-size: 0.75rem;
  }
`

/** Alinhado a `DetailMain` / áreas do detalhe do projeto (`gap: 1.5rem`). */
export const SqlScriptsLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: stretch;
  min-height: min(70vh, 720px);
  flex: 1;
  min-width: 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: 0;
  }
`

export const SqlScriptsSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  padding: 1.2rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  max-height: min(70vh, 720px);

  @media (max-width: 900px) {
    max-height: 240px;
  }
`

export const SqlScriptsSidebarTitle = styled.h2`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.textMuted};
`

export const SqlScriptsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`

export const SqlScriptListItem = styled.li``

export const SqlScriptListButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 0.55rem 0.65rem;
  border-radius: 0.55rem;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.primary : theme.border};
  background: ${({ theme, $active }) =>
    $active ? theme.primaryMuted : 'transparent'};
  color: ${({ theme }) => theme.text};
  font-size: 0.86rem;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primaryMuted};
  }
`

export const SqlScriptListMeta = styled.span`
  display: block;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SqlScriptsToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const SqlScriptsPrimaryButton = styled.button<{ $color?: string }>`
  padding: 0.45rem 0.85rem;
  border-radius: 0.55rem;
  border: none;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  background: ${({ $color, theme }) => $color ?? theme.primary};
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const SqlScriptsGhostButton = styled.button`
  padding: 0.45rem 0.85rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 0.86rem;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.surface};
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primaryMuted};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const SqlScriptsDangerButton = styled.button`
  padding: 0.45rem 0.85rem;
  border-radius: 0.55rem;
  border: 1px solid color-mix(in srgb, #ef4444 45%, transparent);
  font-size: 0.86rem;
  font-weight: 500;
  cursor: pointer;
  color: #ef4444;
  background: transparent;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    background: color-mix(in srgb, #ef4444 12%, transparent);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const SqlScriptsEditorPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  min-height: 0;
  padding: 1.2rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const SqlScriptsField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
`

export const SqlScriptsLabel = styled.label`
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.textMuted};
`

export const SqlScriptsInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.55rem 0.65rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.92rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const SqlScriptsTextarea = styled.textarea`
  width: 100%;
  min-height: 4.5rem;
  box-sizing: border-box;
  padding: 0.55rem 0.65rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.88rem;
  line-height: 1.45;
  resize: vertical;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const SqlMonacoWrap = styled.div`
  flex: 1;
  min-height: 280px;
  border-radius: 0.55rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};

  @media ${ADMIN_MOBILE_MEDIA} {
    min-height: 220px;
  }
`

export const SqlScriptsEmpty = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.92rem;
  line-height: 1.5;
`

export const SqlScriptsFeedback = styled.p<{ $ok?: boolean }>`
  margin: 0;
  font-size: 0.84rem;
  color: ${({ $ok, theme }) => ($ok ? '#22c55e' : theme.textMuted)};
`

/** Mesmo encaixe vertical de `FlowSqlScriptsLink` na modelagem. */
export const SqlScriptsModelingLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: -0.5rem 0 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    margin-bottom: 0.65rem;
    font-size: 0.75rem;
  }
`
