import { cn } from '@/lib/utils'
import React from 'react'

interface TabContentLayoutProps {
    title?: string
    description?: string
    action?: React.ReactNode
    children?: React.ReactNode
    includePadding?: React.ReactNode
}

const TabContentLayout = ({ title, description, action, children, includePadding }: TabContentLayoutProps) => {
    return (
        <div className={cn("space-y-4 bg-white", includePadding && "px-4")}>
            <div className="flex items-center justify-between">
                {title && <div>
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{description}</p>
                </div>}
                {action}
            </div>
            {children}
        </div>
    )
}

export default TabContentLayout