import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { summarizeApf } from '../../functionPoints/compute'
import { FP_CATEGORY_LABELS, FP_COMPLEXITY_LABELS } from '../../functionPoints/categoryLabels'
import { GSC_LABELS_PT } from '../../functionPoints/gscLabels'
import type { FpCategory, FpComplexity, ProjectApfDocument } from '../../functionPoints/types'
import { FP_CATEGORIES, FP_COMPLEXITIES } from '../../functionPoints/types'
import { useModelingDiagramStats } from '../../hooks/useModelingDiagramStats'
import {
  architectureFlowStorageKey,
  loadArchitectureFlow,
} from '../../persistence/architectureFlowStorage'
import {
  defaultProjectApfDocument,
  loadProjectApfDocument,
  saveProjectApfDocument,
} from '../../persistence/projectApfStorage'
import { resolveProjectById } from '../../data/projects'
import { BackLink } from '../ProjectDetail.styles'
import {
  BtnSecondary,
  Card,
  CardTitle,
  CountCard,
  CountTable,
  Details,
  DetailsBody,
  Field,
  FieldInput,
  FieldLabel,
  GscGrid,
  GscInput,
  GscLabel,
  Grid2,
  HeaderLead,
  HintBox,
  Lead,
  NumInput,
  PageRoot,
  PriceRow,
  SimpleActions,
  SimpleHeader,
  SimpleTitle,
  Stat,
  StatGrid,
  StatLabel,
  StatValue,
  StatValueCurrency,
  ThMuted,
} from './ProjectApfPage.styles'

function formatBrl(n: number): string {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatNum(n: number, frac = 2): string {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
  })
}

export function ProjectApfPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const pid = projectId ?? ''
  const project = pid ? resolveProjectById(pid) : undefined
  const { tableCount, relationCount, refresh: refreshModeling } = useModelingDiagramStats(pid)

  const [archTick, setArchTick] = useState(0)
  useEffect(() => {
    if (!pid) return
    const key = architectureFlowStorageKey(pid)
    const bump = () => setArchTick((t) => t + 1)
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) bump()
    }
    const onArch = (e: Event) => {
      const d = (e as CustomEvent<{ projectId?: string }>).detail
      if (d?.projectId === pid) bump()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('flow-architecture-changed', onArch)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('flow-architecture-changed', onArch)
    }
  }, [pid])

  const archNodeCount = useMemo(() => {
    if (!pid) return 0
    const a = loadArchitectureFlow(pid)
    return a?.nodes?.length ?? 0
  }, [pid, archTick])

  const [doc, setDoc] = useState<ProjectApfDocument>(() =>
    pid ? loadProjectApfDocument(pid) : defaultProjectApfDocument(),
  )

  useEffect(() => {
    if (!pid) return
    setDoc(loadProjectApfDocument(pid))
  }, [pid])

  useEffect(() => {
    if (!pid) return
    const t = window.setTimeout(() => saveProjectApfDocument(pid, doc), 400)
    return () => window.clearTimeout(t)
  }, [pid, doc])

  const summary = useMemo(
    () => summarizeApf(doc.counts, doc.gsc, doc.valorHora, doc.horasPorPf),
    [doc],
  )

  const setCount = useCallback((cat: FpCategory, cx: FpComplexity, raw: string) => {
    const n = Math.max(0, Math.floor(Number.parseInt(raw, 10) || 0))
    setDoc((d) => ({
      ...d,
      counts: {
        ...d.counts,
        [cat]: { ...d.counts[cat], [cx]: n },
      },
    }))
  }, [])

  const setGsc = useCallback((index: number, raw: string) => {
    const v = Math.min(5, Math.max(0, Math.round(Number.parseFloat(raw) || 0)))
    setDoc((d) => {
      const next = [...d.gsc] as unknown as number[]
      next[index] = v
      return { ...d, gsc: next as unknown as ProjectApfDocument['gsc'] }
    })
  }, [])

  const aplicarSugestaoModelagem = useCallback(() => {
    setDoc((d) => ({
      ...d,
      counts: {
        ...d.counts,
        ILF: {
          ...d.counts.ILF,
          avg: Math.max(d.counts.ILF.avg, tableCount),
        },
      },
    }))
    refreshModeling()
  }, [tableCount, refreshModeling])

  if (!pid || !project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <PageRoot>
      <SimpleHeader>
        <SimpleActions>
          <BackLink to={`/projects/${pid}`}>← Projeto</BackLink>
        </SimpleActions>
        <SimpleTitle>Análise de Pontos de Função (APF)</SimpleTitle>
        <HeaderLead>
          <strong>{project.name}</strong> — estimativa IFPUG e projeção de esforço/custo. Dados
          salvos neste navegador por projeto.
        </HeaderLead>
      </SimpleHeader>

      <Lead>
        A APF mede o que o software <strong>oferece ao usuário</strong> (dados e transações), não
        linhas de código. A contagem detalhada usa DET/RET/FTR; aqui você informa funções já
        classificadas em <strong>baixa / média / alta</strong> complexidade — ideal para orçamentos
        e revisões com o cliente.
      </Lead>

      <Grid2>
        <Card>
          <CardTitle>Dados do Flow (referência)</CardTitle>
          <HintBox>
            <strong>Modelagem:</strong> {tableCount} tabela(s), {relationCount} relacionamento(s).
            <br />
            <strong>Arquitetura:</strong> {archNodeCount} nó(s) no mapa.
            <br />
            Isso <strong>não substitui</strong> a contagem APF: muitas tabelas podem mapear para um
            ALI, ou vários. Use como ponto de partida.
          </HintBox>
          <BtnSecondary type="button" onClick={aplicarSugestaoModelagem}>
            Definir ALI (média) ≥ tabelas da modelagem ({tableCount})
          </BtnSecondary>
        </Card>

        <Card>
          <CardTitle>Resultado</CardTitle>
          <StatGrid>
            <Stat>
              <StatLabel>UFP (não ajustados)</StatLabel>
              <StatValue>{formatNum(summary.ufp, 1)}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>TDI (soma GSC 0–70)</StatLabel>
              <StatValue>{summary.tdi}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>VAF</StatLabel>
              <StatValue>{formatNum(summary.vaf, 3)}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>AFP (ajustados)</StatLabel>
              <StatValue>{formatNum(summary.afp, 1)}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Horas estimadas</StatLabel>
              <StatValue>{formatNum(summary.horasEstimadas, 1)} h</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Custo estimado</StatLabel>
              <StatValueCurrency>{formatBrl(summary.custoEstimado)}</StatValueCurrency>
            </Stat>
          </StatGrid>
          <Details>
            <summary>O que é UFP, VAF e AFP?</summary>
            <DetailsBody>
              <strong>UFP</strong> soma os pontos das funções (pesos IFPUG por tipo e complexidade).
              O <strong>VAF</strong> (0,65 + 0,01 × TDI) reflete 14 características gerais do sistema.
              <strong> AFP = UFP × VAF</strong>. Multiplicando AFP pelas horas por PF e pelo valor
              hora obtém-se uma faixa de custo — ajuste os parâmetros ao seu contexto (equipe,
              risco, margem).
            </DetailsBody>
          </Details>
        </Card>
      </Grid2>

      <CountCard>
        <CardTitle>Contagem (quantidade de funções por tipo e complexidade)</CardTitle>
        <CountTable>
          <thead>
            <tr>
              <ThMuted>Tipo</ThMuted>
              {FP_COMPLEXITIES.map((cx) => (
                <ThMuted key={cx}>{FP_COMPLEXITY_LABELS[cx]}</ThMuted>
              ))}
            </tr>
          </thead>
          <tbody>
            {FP_CATEGORIES.map((cat) => (
              <tr key={cat}>
                <td>{FP_CATEGORY_LABELS[cat]}</td>
                {FP_COMPLEXITIES.map((cx) => (
                  <td key={cx}>
                    <NumInput
                      inputMode="numeric"
                      min={0}
                      step={1}
                      value={doc.counts[cat][cx]}
                      aria-label={`${FP_CATEGORY_LABELS[cat]} — ${FP_COMPLEXITY_LABELS[cx]}`}
                      onChange={(e) => setCount(cat, cx, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </CountTable>
      </CountCard>

      <Grid2>
        <Card>
          <CardTitle>Características gerais (0 a 5 cada)</CardTitle>
          <HintBox>
            Influenciam o VAF. Valores altos = mais complexidade global. Padrão neutro é 3 em todas
            (TDI = 42 → VAF ≈ 1,07).
          </HintBox>
          <GscGrid>
            {GSC_LABELS_PT.map((label, i) => (
              <Fragment key={label}>
                <GscLabel htmlFor={`gsc-${i}`}>{label}</GscLabel>
                <GscInput
                  id={`gsc-${i}`}
                  type="number"
                  min={0}
                  max={5}
                  step={1}
                  value={doc.gsc[i]}
                  onChange={(e) => setGsc(i, e.target.value)}
                />
              </Fragment>
            ))}
          </GscGrid>
        </Card>

        <Card>
          <CardTitle>Esforço e precificação</CardTitle>
          <HintBox>
            <strong>Horas por PF ajustado</strong> traduz tamanho funcional em esforço (ex.: 8 h/PF
            em manutenção, 12–20 h/PF em projeto novo, conforme maturidade da equipe).
          </HintBox>
          <PriceRow>
            <Field>
              <FieldLabel htmlFor="vh">Valor hora (R$)</FieldLabel>
              <FieldInput
                id="vh"
                type="number"
                min={0}
                step={1}
                value={doc.valorHora}
                onChange={(e) =>
                  setDoc((d) => ({ ...d, valorHora: Math.max(0, Number.parseFloat(e.target.value) || 0) }))
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="hpf">Horas por PF ajustado</FieldLabel>
              <FieldInput
                id="hpf"
                type="number"
                min={0}
                step={0.5}
                value={doc.horasPorPf}
                onChange={(e) =>
                  setDoc((d) => ({
                    ...d,
                    horasPorPf: Math.max(0, Number.parseFloat(e.target.value) || 0),
                  }))
                }
              />
            </Field>
          </PriceRow>
        </Card>
      </Grid2>
    </PageRoot>
  )
}
