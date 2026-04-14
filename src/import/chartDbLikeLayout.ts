/**
 * Posicionamento inspirado no ChartDB (`adjustTablePositionsWithoutAreas` em
 * `chartdb/src/lib/domain/db-table.ts`): tabelas ligadas por FK em grade inicial,
 * expansão em espiral para evitar sobreposição e recursão em círculo para vizinhos;
 * tabelas sem relações ficam abaixo do bloco principal.
 */

const DEFAULT_TABLE_WIDTH = 200
const DEFAULT_TABLE_HEIGHT = 300
const GAP_X = 100
const GAP_Y = 100
const START_X = 100
const START_Y = 100

/** Mesma ideia de `calcTableHeight` do ChartDB (header + linhas + “ver mais”). */
const TABLE_HEADER_HEIGHT = 42
const FIELD_HEIGHT = 32
const TABLE_MINIMIZED_FIELDS = 10
const TABLE_FOOTER_HEIGHT = 32

function estimateTableSize(fieldCount: number): { width: number; height: number } {
  const width = 224
  const visible = Math.min(Math.max(fieldCount, 1), TABLE_MINIMIZED_FIELDS)
  const showMore = fieldCount > TABLE_MINIMIZED_FIELDS ? TABLE_FOOTER_HEIGHT : 0
  const height = TABLE_HEADER_HEIGHT + visible * FIELD_HEIGHT + showMore
  return {
    width,
    height: Math.max(height, DEFAULT_TABLE_HEIGHT),
  }
}

export type UndirectedLink = { a: string; b: string }

/**
 * @param tableIds — ids dos nós (ex.: nome da tabela)
 * @param fieldCountById — número de campos por tabela (para estimar caixa)
 * @param links — arestas undirecionais (ex.: par tabela referenciada ↔ tabela com FK)
 */
export function computeChartDbLikePositions(
  tableIds: string[],
  fieldCountById: Map<string, number>,
  links: UndirectedLink[],
): Map<string, { x: number; y: number }> {
  const result = new Map<string, { x: number; y: number }>()
  if (tableIds.length === 0) return result

  const idSet = new Set(tableIds)

  const getDims = (tableId: string): { width: number; height: number } => {
    const n = fieldCountById.get(tableId) ?? 1
    return estimateTableSize(n)
  }

  const tableConnections = new Map<string, Set<string>>()
  for (const id of tableIds) {
    tableConnections.set(id, new Set())
  }
  for (const { a, b } of links) {
    if (!idSet.has(a) || !idSet.has(b) || a === b) continue
    tableConnections.get(a)!.add(b)
    tableConnections.get(b)!.add(a)
  }

  const adjustPositionsForTables = (ids: string[]) => {
    const connectedTables: string[] = []
    const isolatedTables: string[] = []

    for (const id of ids) {
      const conn = tableConnections.get(id)
      if (conn && conn.size > 0) connectedTables.push(id)
      else isolatedTables.push(id)
    }

    connectedTables.sort(
      (a, b) =>
        (tableConnections.get(b)?.size ?? 0) - (tableConnections.get(a)?.size ?? 0),
    )

    const positionedTables = new Set<string>()
    const tablePositions = new Map<string, { x: number; y: number }>()

    const getTableWidthAndHeight = (tableId: string): { width: number; height: number } => {
      if (!idSet.has(tableId)) {
        return { width: DEFAULT_TABLE_WIDTH, height: DEFAULT_TABLE_HEIGHT }
      }
      return getDims(tableId)
    }

    const isOverlapping = (x: number, y: number, currentTableId: string): boolean => {
      for (const [tableId, pos] of tablePositions) {
        if (tableId === currentTableId) continue
        const { width, height } = getTableWidthAndHeight(tableId)
        if (
          Math.abs(x - pos.x) < width + GAP_X &&
          Math.abs(y - pos.y) < height + GAP_Y
        ) {
          return true
        }
      }
      return false
    }

    const findNonOverlappingPosition = (
      baseX: number,
      baseY: number,
      tableId: string,
    ): { x: number; y: number } => {
      const { width, height } = getTableWidthAndHeight(tableId)
      const spiralStep = Math.max(width, height) / 2
      let angle = 0
      let radius = 0
      let iterations = 0
      const maxIterations = 1000

      while (iterations < maxIterations) {
        const x = baseX + radius * Math.cos(angle)
        const y = baseY + radius * Math.sin(angle)
        if (!isOverlapping(x, y, tableId)) {
          return { x, y }
        }
        angle += Math.PI / 4
        if (angle >= 2 * Math.PI) {
          angle = 0
          radius += spiralStep
        }
        iterations++
      }

      return {
        x: baseX + radius * Math.cos(angle),
        y: baseY + radius * Math.sin(angle),
      }
    }

    const positionTable = (tableId: string, baseX: number, baseY: number): void => {
      if (positionedTables.has(tableId)) return

      const { x, y } = findNonOverlappingPosition(baseX, baseY, tableId)
      tablePositions.set(tableId, { x, y })
      positionedTables.add(tableId)

      const connected = tableConnections.get(tableId) ?? new Set()
      let angle = 0
      const angleStep = (2 * Math.PI) / Math.max(connected.size, 1)

      for (const connectedTableId of connected) {
        if (!positionedTables.has(connectedTableId)) {
          const { width: tableWidth, height: tableHeight } = getTableWidthAndHeight(tableId)
          const { width: cw, height: ch } = getTableWidthAndHeight(connectedTableId)
          const avgWidth = (tableWidth + cw) / 2
          const avgHeight = (tableHeight + ch) / 2
          const newX = x + Math.cos(angle) * (avgWidth + GAP_X * 2)
          const newY = y + Math.sin(angle) * (avgHeight + GAP_Y * 2)
          positionTable(connectedTableId, newX, newY)
          angle += angleStep
        }
      }
    }

    if (connectedTables.length < 100) {
      connectedTables.forEach((tableId, index) => {
        if (!positionedTables.has(tableId)) {
          const row = Math.floor(index / 6)
          const col = index % 6
          const { width: tableWidth, height: tableHeight } = getTableWidthAndHeight(tableId)
          const x = START_X + col * (tableWidth + GAP_X * 2)
          const y = START_Y + row * (tableHeight + GAP_Y * 2)
          positionTable(tableId, x, y)
        }
      })
    } else {
      connectedTables.forEach((tableId, index) => {
        if (!positionedTables.has(tableId)) {
          const row = Math.floor(index / 10)
          const col = index % 10
          const { width: tableWidth, height: tableHeight } = getTableWidthAndHeight(tableId)
          const x = START_X + col * (tableWidth + GAP_X)
          const y = START_Y + row * (tableHeight + GAP_Y)
          const finalPos = findNonOverlappingPosition(x, y, tableId)
          tablePositions.set(tableId, { x: finalPos.x, y: finalPos.y })
          positionedTables.add(tableId)
        }
      })
    }

    let maxY = START_Y
    for (const [tableId, pos] of tablePositions) {
      const { height } = getTableWidthAndHeight(tableId)
      maxY = Math.max(maxY, pos.y + height)
    }

    if (isolatedTables.length > 0) {
      const isolatedStartY = maxY + GAP_Y * 2
      const isolatedStartX = START_X

      isolatedTables.forEach((tableId, index) => {
        if (!positionedTables.has(tableId)) {
          const row = Math.floor(index / 8)
          const col = index % 8
          const { width: tableWidth, height: tableHeight } = getTableWidthAndHeight(tableId)
          const x = isolatedStartX + col * (tableWidth + GAP_X)
          const y = isolatedStartY + row * (tableHeight + GAP_Y)
          const finalPos = findNonOverlappingPosition(x, y, tableId)
          tablePositions.set(tableId, { x: finalPos.x, y: finalPos.y })
          positionedTables.add(tableId)
        }
      })
    }

    for (const id of ids) {
      const position = tablePositions.get(id)
      if (position) {
        result.set(id, position)
      }
    }
  }

  adjustPositionsForTables(tableIds)
  return result
}
