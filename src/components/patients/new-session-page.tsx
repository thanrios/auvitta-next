'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Eye, FilePlus2, PencilLine, Plus, Trash2 } from 'lucide-react'

import {
  formatElapsedTime,
  getCurrentElapsedSeconds,
  mapFileCategoryToLabel,
  mapProtocolTypeToLabel,
  useSessionDraftStore,
} from '@/lib/session-draft-store'
import { usePatient } from '@/hooks/use-api-patients'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type {
  SessionDraftProtocol,
  SessionEvolutionStatus,
  SessionFileCategory,
  SessionProtocolType,
  SessionType,
} from '@/types/session.types'

interface NewSessionPageProps {
  patientId: string
}

const SESSION_TYPES: SessionType[] = ['session', 'evolution', 'anamnesis']
const PROTOCOL_TYPES: SessionProtocolType[] = ['speech-assessment', 'motor-coordination', 'school-follow-up']
const FILE_CATEGORIES: SessionFileCategory[] = ['anamnesis', 'report', 'protocol', 'other']
const EVOLUTION_PROGRESS_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const EVOLUTION_STATUSES: SessionEvolutionStatus[] = ['not_started', 'in_progress', 'achieved']

export function NewSessionPage({ patientId }: NewSessionPageProps) {
  const t = useTranslations('pages.patients.newSession')
  const locale = useLocale()
  const router = useRouter()

  const draft = useSessionDraftStore((state) => state.drafts[patientId])
  const hasHydrated = useSessionDraftStore((state) => state.hasHydrated)
  const ensureDraft = useSessionDraftStore((state) => state.ensureDraft)
  const resetDraft = useSessionDraftStore((state) => state.resetDraft)
  const updateDraft = useSessionDraftStore((state) => state.updateDraft)
  const startSession = useSessionDraftStore((state) => state.startSession)
  const finishSession = useSessionDraftStore((state) => state.finishSession)
  const saveDraft = useSessionDraftStore((state) => state.saveDraft)
  const addProtocol = useSessionDraftStore((state) => state.addProtocol)
  const updateProtocol = useSessionDraftStore((state) => state.updateProtocol)
  const removeProtocol = useSessionDraftStore((state) => state.removeProtocol)
  const addFiles = useSessionDraftStore((state) => state.addFiles)
  const removeFile = useSessionDraftStore((state) => state.removeFile)
  const updateFileCategory = useSessionDraftStore((state) => state.updateFileCategory)
  const setEvolutionEnabled = useSessionDraftStore((state) => state.setEvolutionEnabled)
  const setEvolutionProgress = useSessionDraftStore((state) => state.setEvolutionProgress)
  const setEvolutionStatus = useSessionDraftStore((state) => state.setEvolutionStatus)

  const [selectedProtocolType, setSelectedProtocolType] = useState<SessionProtocolType>(PROTOCOL_TYPES[0])
  const [fileCategory, setFileCategory] = useState<SessionFileCategory>(FILE_CATEGORIES[0])
  const [editingProtocolId, setEditingProtocolId] = useState<string>('')
  const [viewingProtocol, setViewingProtocol] = useState<SessionDraftProtocol | null>(null)
  const [timerTick, setTimerTick] = useState<number>(0)
  const [isTogglingSession, setIsTogglingSession] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [hasCheckedResumeModal, setHasCheckedResumeModal] = useState(false)

  const { data: patient } = usePatient(patientId)

  useEffect(() => {
    ensureDraft(patientId)
  }, [ensureDraft, patientId])

  useEffect(() => {
    if (!draft || draft.sessionName) {
      return
    }

    const today = new Intl.DateTimeFormat(locale).format(new Date())
    updateDraft(patientId, {
      sessionName: t('sessionName.default', { date: today }),
    })
  }, [draft, locale, patientId, t, updateDraft])

  useEffect(() => {
    if (!hasHydrated || !draft || hasCheckedResumeModal) {
      return
    }

    if (draft.lastSavedAt && !draft.isCompleted) {
      setShowResumeModal(true)
    }

    setHasCheckedResumeModal(true)
  }, [draft, hasCheckedResumeModal, hasHydrated])

  useEffect(() => {
    if (!draft?.isSessionRunning) {
      return
    }

    const intervalId = window.setInterval(() => {
      setTimerTick(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [draft?.isSessionRunning])

  const sessionTypeLabels = useMemo<Record<SessionType, string>>(
    () => ({
      session: t('sessionType.options.session'),
      evolution: t('sessionType.options.evolution'),
      anamnesis: t('sessionType.options.anamnesis'),
    }),
    [t]
  )

  const protocolTypeLabels = useMemo<Record<SessionProtocolType, string>>(
    () => ({
      'speech-assessment': t('protocols.options.speech-assessment'),
      'motor-coordination': t('protocols.options.motor-coordination'),
      'school-follow-up': t('protocols.options.school-follow-up'),
    }),
    [t]
  )

  const fileCategoryLabels = useMemo<Record<SessionFileCategory, string>>(
    () => ({
      anamnesis: t('files.categories.anamnesis'),
      report: t('files.categories.report'),
      protocol: t('files.categories.protocol'),
      other: t('files.categories.other'),
    }),
    [t]
  )

  const evolutionStatusLabels = useMemo<Record<SessionEvolutionStatus, string>>(
    () => ({
      not_started: t('evolution.status.options.not_started'),
      in_progress: t('evolution.status.options.in_progress'),
      achieved: t('evolution.status.options.achieved'),
    }),
    [t]
  )

  const elapsedTimeLabel = useMemo(() => {
    if (!draft) {
      return '00:00:00'
    }

    return formatElapsedTime(getCurrentElapsedSeconds(draft))
  }, [draft, timerTick])

  if (!draft) {
    return (
      <div className="flex-1 space-y-4 p-4">
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      </div>
    )
  }

  function handleToggleSession(): void {
    if (isTogglingSession) {
      return
    }

    setIsTogglingSession(true)

    if (draft.isSessionRunning) {
      finishSession(patientId)
    } else {
      startSession(patientId)
    }

    window.setTimeout(() => {
      setIsTogglingSession(false)
    }, 350)
  }

  function handleSaveAndExit(): void {
    saveDraft(patientId)
    router.push(`/patients/${patientId}/summary?tab=sessions`)
  }

  function handleAddProtocol(): void {
    addProtocol(patientId, selectedProtocolType)
  }

  function handleStartNewSession(): void {
    resetDraft(patientId)
    setShowResumeModal(false)
  }

  function handleContinueSession(): void {
    setShowResumeModal(false)
  }

  function handleUploadFiles(filesToUpload: FileList | null): void {
    if (!filesToUpload || filesToUpload.length === 0) {
      return
    }

    const normalizedFiles = Array.from(filesToUpload).map((file) => ({
      fileName: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      category: fileCategory,
    }))

    addFiles(patientId, normalizedFiles)
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">{t('heading')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('subtitle', { patientName: patient?.full_name || t('fallbackPatientName') })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="rounded-md border px-3 py-2 text-sm font-semibold">{elapsedTimeLabel}</div>

          <Button type="button" variant="outline" onClick={handleSaveAndExit}>
            {t('actions.exitSession')}
          </Button>

          <Button
            type="button"
            variant={draft.isSessionRunning ? 'destructive' : 'default'}
            onClick={handleToggleSession}
            disabled={isTogglingSession}
          >
            {draft.isSessionRunning ? t('actions.finishSession') : t('actions.startSession')}
          </Button>
        </div>
      </div>

      <Card className="shadow-md gap-0">
        <CardContent className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="session-name">{t('sessionName.label')}</Label>
            <Input
              id="session-name"
              value={draft.sessionName}
              onChange={(event) => updateDraft(patientId, { sessionName: event.target.value })}
              placeholder={t('sessionName.placeholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-type">{t('sessionType.label')}</Label>
            <select
              id="session-type"
              value={draft.sessionType}
              onChange={(event) => updateDraft(patientId, { sessionType: event.target.value as SessionType })}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {SESSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {sessionTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>

          {draft.lastSavedAt && (
            <p className="text-xs text-muted-foreground lg:col-span-2">
              {t('lastSaved', {
                date: new Intl.DateTimeFormat(locale, {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(new Date(draft.lastSavedAt)),
              })}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md gap-0">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-base">{t('notes.title')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <textarea
            value={draft.notes}
            onChange={(event) => updateDraft(patientId, { notes: event.target.value })}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-36 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            placeholder={t('notes.placeholder')}
          />
        </CardContent>
      </Card>

      <Card className="shadow-md gap-0">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-base">{t('protocols.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
            <select
              value={selectedProtocolType}
              onChange={(event) => setSelectedProtocolType(event.target.value as SessionProtocolType)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {PROTOCOL_TYPES.map((protocolType) => (
                <option key={protocolType} value={protocolType}>
                  {protocolTypeLabels[protocolType]}
                </option>
              ))}
            </select>

            <Button type="button" onClick={handleAddProtocol}>
              <Plus className="size-4" />
              {t('protocols.actions.add')}
            </Button>
          </div>

          {draft.protocols.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('protocols.empty')}</p>
          ) : (
            <div className="space-y-2">
              {draft.protocols.map((protocol) => {
                const isEditing = editingProtocolId === protocol.id

                return (
                  <div key={protocol.id} className="space-y-2 rounded-md border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">
                        {mapProtocolTypeToLabel(protocol.protocolType, protocolTypeLabels)}
                      </p>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProtocolId(isEditing ? '' : protocol.id)}
                          aria-label={t('protocols.actions.edit')}
                        >
                          <PencilLine className="size-4" />
                          {t('protocols.actions.edit')}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingProtocol(protocol)}
                          aria-label={t('protocols.actions.view')}
                        >
                          <Eye className="size-4" />
                          {t('protocols.actions.view')}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeProtocol(patientId, protocol.id)}
                          aria-label={t('protocols.actions.remove')}
                        >
                          <Trash2 className="size-4" />
                          {t('protocols.actions.remove')}
                        </Button>
                      </div>
                    </div>

                    {isEditing ? (
                      <textarea
                        value={protocol.content}
                        onChange={(event) =>
                          updateProtocol(patientId, protocol.id, {
                            content: event.target.value,
                          })
                        }
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-24 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        placeholder={t('protocols.contentPlaceholder')}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {protocol.content || t('protocols.noContent')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md gap-0">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-base">{t('files.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr]">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium">
              <FilePlus2 className="size-4" />
              {t('files.actions.add')}
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={(event) => {
                  handleUploadFiles(event.target.files)
                  event.target.value = ''
                }}
              />
            </label>
          </div>

          {draft.files.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('files.empty')}</p>
          ) : (
            <div className="space-y-2">
              {draft.files.map((file) => (
                <div key={file.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.fileName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <select
                        value={file.category}
                        onChange={(event) =>
                          updateFileCategory(patientId, file.id, event.target.value as SessionFileCategory)
                        }
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 rounded-md border px-2 text-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        {FILE_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {fileCategoryLabels[category]}
                          </option>
                        ))}
                      </select>

                      <p className="text-xs text-muted-foreground">{t('files.size', { size: file.sizeKb })}</p>
                      <p className="text-xs text-muted-foreground">
                        {mapFileCategoryToLabel(file.category, fileCategoryLabels)}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeFile(patientId, file.id)}
                    aria-label={t('files.actions.remove')}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md gap-0">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-base">{t('evolution.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {!draft.hasEvolution && (
            <Button type="button" variant="outline" onClick={() => setEvolutionEnabled(patientId, true)}>
              {t('evolution.actions.add')}
            </Button>
          )}

          {draft.hasEvolution && (
            <>
              <div className="space-y-2">
                <Label>{t('evolution.progress.label')}</Label>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {EVOLUTION_PROGRESS_STEPS.map((progress) => (
                    <Button
                      key={progress}
                      type="button"
                      variant={draft.evolutionProgress === progress ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEvolutionProgress(patientId, progress)}
                    >
                      {progress}%
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evolution-status">{t('evolution.status.label')}</Label>
                <select
                  id="evolution-status"
                  value={draft.evolutionStatus}
                  onChange={(event) => setEvolutionStatus(patientId, event.target.value as SessionEvolutionStatus)}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {EVOLUTION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {evolutionStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!viewingProtocol} onOpenChange={(open) => !open && setViewingProtocol(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('protocols.viewModal.title')}</SheetTitle>
            <SheetDescription>
              {viewingProtocol
                ? mapProtocolTypeToLabel(viewingProtocol.protocolType, protocolTypeLabels)
                : t('protocols.viewModal.description')}
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-4 text-sm text-muted-foreground">
            {viewingProtocol?.content || t('protocols.noContent')}
          </div>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => setViewingProtocol(null)}>
              {t('protocols.viewModal.close')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md gap-0">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-lg">{t('resumeModal.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <p className="text-sm text-muted-foreground">{t('resumeModal.description')}</p>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={handleStartNewSession}>
                  {t('resumeModal.actions.newSession')}
                </Button>
                <Button type="button" onClick={handleContinueSession}>
                  {t('resumeModal.actions.continue')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
