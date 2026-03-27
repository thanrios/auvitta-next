/**
 * Patient suggestions panel component.
 * Displays and manages person lookup suggestions during patient registration.
 */

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { PersonLookupResult } from '@/types/patient.types'

interface PatientSuggestionsPanelProps {
  suggestions: PersonLookupResult[]
  isLoading: boolean
  selectedPerson: PersonLookupResult | null
  fullNameLength: number
  onSelectPerson: (person: PersonLookupResult) => void
  onClearSelection: () => void
}

/**
 * Renders a panel with person suggestions during patient form entry.
 * Shows: loading state, suggestions list, selected confirmation, or help text.
 */
export function PatientSuggestionsPanel({
  suggestions,
  isLoading,
  selectedPerson,
  fullNameLength,
  onSelectPerson,
  onClearSelection,
}: PatientSuggestionsPanelProps) {
  const t = useTranslations('pages.patients.newForm')

  return (
    <div className="rounded-md border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{t('suggestions.title')}</p>
        {isLoading && (
          <p className="text-xs text-muted-foreground">
            {t('suggestions.loading')}
          </p>
        )}
      </div>

      {selectedPerson ? (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-md border border-primary/40 bg-primary/5 p-3">
          <div>
            <p className="text-sm font-medium">{selectedPerson.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {t('suggestions.selectedHelper', {
                personId: selectedPerson.person_id,
              })}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onClearSelection}
          >
            {t('suggestions.clearSelection')}
          </Button>
        </div>
      ) : (
        <>
          {fullNameLength >= 3 && suggestions.length === 0 && !isLoading ? (
            <p className="mt-3 text-xs text-muted-foreground">
              {t('suggestions.noResults')}
            </p>
          ) : null}

          {suggestions.length > 0 ? (
            <div className="mt-3 space-y-2">
              {suggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion.person_id}
                  type="button"
                  className="w-full rounded-md border p-3 text-left transition hover:bg-muted/60"
                  onClick={() => onSelectPerson(suggestion)}
                >
                  <p className="text-sm font-medium">{suggestion.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('suggestions.matchScore', {
                      score: suggestion.match_score.toFixed(2),
                    })}
                  </p>
                </button>
              ))}
            </div>
          ) : null}

          {fullNameLength < 3 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              {t('suggestions.typeToSearch')}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
