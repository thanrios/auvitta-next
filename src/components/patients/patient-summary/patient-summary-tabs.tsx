import type { SummaryTab, SummaryTabItem } from './types'

interface PatientSummaryTabsProps {
  tabs: SummaryTabItem[]
  activeTab: SummaryTab
  onTabChange: (tab: SummaryTab) => void
}

export function PatientSummaryTabs({ tabs, activeTab, onTabChange }: PatientSummaryTabsProps) {
  return (
    <div className="border-b">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
