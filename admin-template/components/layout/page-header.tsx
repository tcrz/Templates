import type React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode // For buttons or other actions
  className?: string
  loading?: boolean
  avatar?: React.ReactNode
}

export const PageHeader = ({ title, description, children, className = '', loading = false, avatar }: PageHeaderProps) => {
  return (
      <div className={`items-center justify-between mb-8 block md:flex ${className}`}>
        <div className="flex-1 flex items-start gap-3">
          {loading ? (
            <>
              {avatar && <Skeleton className="size-12 rounded-lg shrink-0" />}
              <div className="flex-1">
                <Skeleton className="h-7 w-64 mb-2" />
                {description && <Skeleton className="h-4 w-96" />}
              </div>
            </>
          ) : (
            <>
              {avatar && <div className="shrink-0">{avatar}</div>}
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
                {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
              </div>
            </>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
  )
}
