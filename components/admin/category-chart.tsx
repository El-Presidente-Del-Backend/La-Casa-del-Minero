"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { BarChart3 } from "lucide-react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import type { CategoryDistribution } from "@/lib/admin-queries"

const MAX_BARS = 8

const chartConfig = {
  count: { label: "Productos", color: "var(--color-chart-2)" },
} satisfies ChartConfig

function prepareBars(distribution: CategoryDistribution[]) {
  const withoutCategory = distribution.find((d) => d.categoryId === null)
  let bars = distribution.filter((d) => d.categoryId !== null)

  if (bars.length > MAX_BARS) {
    const top = bars.slice(0, MAX_BARS - 1)
    const rest = bars.slice(MAX_BARS - 1)
    bars = [
      ...top,
      {
        categoryId: "__other__",
        label: "Otras",
        count: rest.reduce((sum, d) => sum + d.count, 0),
        value: rest.reduce((sum, d) => sum + d.value, 0),
      },
    ]
  }

  return withoutCategory ? [...bars, withoutCategory] : bars
}

export function CategoryChart({ distribution }: { distribution: CategoryDistribution[] }) {
  if (distribution.length === 0) {
    return (
      <Empty className="h-full rounded-lg border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BarChart3 />
          </EmptyMedia>
          <EmptyTitle>Sin datos todavía</EmptyTitle>
          <EmptyDescription>El gráfico aparecerá cuando haya productos con categoría.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const bars = prepareBars(distribution)
  const height = Math.max(200, bars.length * 36 + 40)

  return (
    <ChartContainer config={chartConfig} className="aspect-auto w-full" style={{ height }}>
      <BarChart data={bars} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 4 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={140}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, _name, item) => (
                <div className="flex w-full items-center justify-between gap-4">
                  <span className="text-muted-foreground">{item.payload.label}</span>
                  <span className="font-mono font-medium text-foreground">
                    {value} · ${item.payload.value.toLocaleString("es-CL")}
                  </span>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="count" name="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} maxBarSize={24}>
          <LabelList
            dataKey="count"
            position="right"
            className="fill-muted-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
