import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface StatsCardProps {
  title: string
  value: number
  total?: number
  description?: string
  variant?: "default" | "success" | "warning" | "destructive"
  showProgress?: boolean
}

export function StatsCard({
  title,
  value,
  total,
  description,
  variant = "default",
  showProgress = false,
}: StatsCardProps) {
  const percentage = total && total > 0 ? Math.round((value / total) * 100) : 0

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
      case "destructive":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
      default:
        return ""
    }
  }

  return (
    <Card className={getVariantStyles()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {total && (
          <Badge variant="secondary" className="text-xs">
            {value}/{total}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {showProgress && total && (
          <div className="mt-3">
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{percentage}% complete</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
