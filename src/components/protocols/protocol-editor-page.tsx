"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import {
  Eye,
  GripVertical,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

import { useProtocolActions, useProtocolById } from '@/hooks/use-protocols'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type {
  ProtocolBlock,
  ProtocolBlockType,
  ProtocolFormVersion,
  ProtocolStatus,
} from '@/types/protocol.types'
import { useProtocolStore } from '@/lib/protocol-store'

const protocolFormSchema = z.object({
  name: z.string().trim().min(1),
  notes: z.string().trim().optional(),
  status: z.enum(['active', 'inactive']),
  blocks: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['section-title', 'separator', 'text', 'textarea', 'number', 'single-select', 'checkbox']),
      label: z.string(),
      helperText: z.string(),
      required: z.boolean(),
      optionsText: z.string(),
    })
  ),
})

type ProtocolFormValues = z.infer<typeof protocolFormSchema>

interface EditorBlockForm {
  id: string
  type: ProtocolBlockType
  label: string
  helperText: string
  required: boolean
  optionsText: string
}

interface AvailableBlock {
  type: ProtocolBlockType
  titleKey: string
  descriptionKey: string
}

const AVAILABLE_BLOCKS: AvailableBlock[] = [
  { type: 'section-title', titleKey: 'availableBlocks.sectionTitle.title', descriptionKey: 'availableBlocks.sectionTitle.description' },
  { type: 'separator', titleKey: 'availableBlocks.separator.title', descriptionKey: 'availableBlocks.separator.description' },
  { type: 'text', titleKey: 'availableBlocks.text.title', descriptionKey: 'availableBlocks.text.description' },
  { type: 'textarea', titleKey: 'availableBlocks.textarea.title', descriptionKey: 'availableBlocks.textarea.description' },
  { type: 'number', titleKey: 'availableBlocks.number.title', descriptionKey: 'availableBlocks.number.description' },
  { type: 'single-select', titleKey: 'availableBlocks.singleSelect.title', descriptionKey: 'availableBlocks.singleSelect.description' },
  { type: 'checkbox', titleKey: 'availableBlocks.checkbox.title', descriptionKey: 'availableBlocks.checkbox.description' },
]

function generateId(prefix: string): string {
  const randomPart = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now()}-${randomPart}`
}

function toEditorBlocks(protocol: ProtocolFormVersion | null): EditorBlockForm[] {
  if (!protocol) {
    return []
  }

  return protocol.blocks.map((block) => ({
    id: block.id,
    type: block.type,
    label: block.label,
    helperText: block.helperText ?? '',
    required: block.required ?? false,
    optionsText: block.options?.map((option) => option.label).join('\n') ?? '',
  }))
}

function normalizeBlocks(blocks: EditorBlockForm[]): ProtocolBlock[] {
  return blocks.map((block) => ({
    id: block.id,
    type: block.type,
    label: block.label,
    helperText: block.helperText || undefined,
    required: block.required,
    options:
      block.type === 'single-select' || block.type === 'checkbox'
        ? block.optionsText
            .split('\n')
            .map((option) => option.trim())
            .filter(Boolean)
            .map((option) => ({
              id: generateId('option'),
              label: option,
            }))
        : undefined,
  }))
}

function defaultBlockByType(type: ProtocolBlockType): EditorBlockForm {
  const baseBlock = {
    id: generateId('block'),
    helperText: '',
    required: false,
    optionsText: '',
  }

  switch (type) {
    case 'section-title':
      return { ...baseBlock, type, label: 'Section title' }
    case 'separator':
      return { ...baseBlock, type, label: '' }
    case 'text':
      return { ...baseBlock, type, label: 'Text field' }
    case 'textarea':
      return { ...baseBlock, type, label: 'Textarea field' }
    case 'number':
      return { ...baseBlock, type, label: 'Number field' }
    case 'single-select':
      return { ...baseBlock, type, label: 'Single select', optionsText: 'Option 1\nOption 2' }
    case 'checkbox':
      return { ...baseBlock, type, label: 'Checkbox field' }
    default:
      return { ...baseBlock, type: 'text', label: 'Text field' }
  }
}

export function ProtocolEditorPage() {
  const t = useTranslations('pages.protocolsForm')
  const router = useRouter()
  const searchParams = useSearchParams()

  const editId = searchParams.get('editId')
  const viewId = searchParams.get('viewId')
  const modeId = viewId || editId

  const isViewMode = Boolean(viewId)
  const isEditMode = Boolean(editId)

  const sourceProtocol = useProtocolById(modeId)
  const hasHydrated = useProtocolStore((state) => state.hasHydrated)
  const { createProtocol, createVersionFromProtocol } = useProtocolActions()

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [confirmVersionOpen, setConfirmVersionOpen] = useState(false)

  const initialValues = useMemo<ProtocolFormValues>(
    () => ({
      name: sourceProtocol?.name ?? '',
      notes: sourceProtocol?.notes ?? '',
      status: sourceProtocol?.status ?? 'active',
      blocks: toEditorBlocks(sourceProtocol),
    }),
    [sourceProtocol]
  )

  const form = useForm<ProtocolFormValues>({
    resolver: zodResolver(protocolFormSchema),
    values: initialValues,
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'blocks',
  })

  const watchedBlocks = useWatch({
    control: form.control,
    name: 'blocks',
  })

  const blocks = useMemo(() => watchedBlocks ?? [], [watchedBlocks])

  const heading = isViewMode
    ? t('headingView')
    : isEditMode
      ? t('headingEdit')
      : t('headingCreate')

  const cardTitle = isViewMode
    ? t('cardTitleView')
    : isEditMode
      ? t('cardTitleEdit')
      : t('cardTitleCreate')

  const canSubmit = !isViewMode && blocks.length > 0
  const selectedBlock =
    selectedBlockIndex !== null && selectedBlockIndex >= 0 && selectedBlockIndex < blocks.length
      ? blocks[selectedBlockIndex]
      : null

  const previewProtocol = useMemo(() => {
    const values = form.getValues()
    return {
      name: values.name,
      notes: values.notes,
      status: values.status,
      blocks,
    }
  }, [blocks, form])

  function addBlock(type: ProtocolBlockType) {
    if (isViewMode) return
    append(defaultBlockByType(type))
  }

  function removeBlock(index: number) {
    if (isViewMode) return

    if (selectedBlockIndex === index) {
      setSelectedBlockIndex(null)
    }

    if (selectedBlockIndex !== null && selectedBlockIndex > index) {
      setSelectedBlockIndex(selectedBlockIndex - 1)
    }

    remove(index)
  }

  function updateBlock(index: number, updates: Partial<EditorBlockForm>) {
    if (isViewMode) return

    Object.entries(updates).forEach(([key, value]) => {
      form.setValue(`blocks.${index}.${key as keyof EditorBlockForm}`, value as never, {
        shouldDirty: true,
      })
    })
  }

  function moveBlock(index: number, direction: -1 | 1) {
    if (isViewMode) return

    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= fields.length) {
      return
    }

    move(index, targetIndex)
  }

  function reorderBlocks(fromIndex: number, toIndex: number) {
    if (isViewMode || fromIndex === toIndex) return

    move(fromIndex, toIndex)

    if (selectedBlockIndex === fromIndex) {
      setSelectedBlockIndex(toIndex)
      return
    }

    if (selectedBlockIndex === null) {
      return
    }

    if (fromIndex < selectedBlockIndex && toIndex >= selectedBlockIndex) {
      setSelectedBlockIndex(selectedBlockIndex - 1)
      return
    }

    if (fromIndex > selectedBlockIndex && toIndex <= selectedBlockIndex) {
      setSelectedBlockIndex(selectedBlockIndex + 1)
    }
  }

  function getBlockSummary(block: EditorBlockForm): string {
    if (block.type === 'separator') {
      return t('fields.separatorSummary')
    }

    if (block.type === 'single-select') {
      const optionsCount = block.optionsText
        .split('\n')
        .map((option) => option.trim())
        .filter(Boolean).length

      return t('fields.singleSelectSummary', { count: optionsCount })
    }

    if (block.type === 'checkbox') {
      const optionsCount = block.optionsText
        .split('\n')
        .map((option) => option.trim())
        .filter(Boolean).length

      if (optionsCount > 0) {
        return t('fields.checkboxOptionsSummary', { count: optionsCount })
      }
    }

    return t('fields.clickToEdit')
  }

  function getOptionItems(optionsText: string): string[] {
    if (!optionsText) {
      return ['']
    }

    return optionsText.split('\n')
  }

  function setOptionItems(index: number, options: string[]) {
    const normalized = options.join('\n')

    updateBlock(index, {
      optionsText: normalized,
    })
  }

  function handleBlockClick(index: number) {
    setSelectedBlockIndex(index)
  }

  function renderCanvasPreview(block: EditorBlockForm) {
    if (block.type === 'separator') {
      return <div className="my-2 h-px w-full bg-border" />
    }

    const blockLabel = (
      <>
        {block.label || t(`blockType.${block.type}`)}
        {block.required && <span className="ml-1 text-destructive">*</span>}
      </>
    )

    if (block.type === 'section-title') {
      return (
        <div className="space-y-1">
          <p className="text-lg font-semibold text-foreground">{blockLabel}</p>
          {block.helperText && <p className="text-sm text-muted-foreground">{block.helperText}</p>}
        </div>
      )
    }

    if (block.type === 'text') {
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium">{blockLabel}</p>
          <input
            disabled
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            placeholder={block.helperText || undefined}
          />
        </div>
      )
    }

    if (block.type === 'textarea') {
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium">{blockLabel}</p>
          <textarea
            disabled
            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder={block.helperText || undefined}
          />
        </div>
      )
    }

    if (block.type === 'number') {
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium">{blockLabel}</p>
          <input
            disabled
            type="number"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            placeholder={block.helperText || undefined}
          />
        </div>
      )
    }

    if (block.type === 'single-select') {
      const options = block.optionsText
        .split('\n')
        .map((option) => option.trim())
        .filter(Boolean)

      return (
        <div className="space-y-2">
          <p className="text-sm font-medium">{blockLabel}</p>
          <div className="flex flex-wrap gap-4">
            {options.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t('fields.singleSelectSummary', { count: 0 })}</p>
            ) : (
              options.map((option) => (
                <label key={option} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" disabled />
                  {option}
                </label>
              ))
            )}
          </div>
        </div>
      )
    }

    if (block.type === 'checkbox') {
      const options = block.optionsText
        .split('\n')
        .map((option) => option.trim())
        .filter(Boolean)

      if (options.length > 0) {
        return (
          <div className="space-y-2">
            <p className="text-sm font-medium">{blockLabel}</p>
            <div className="flex flex-wrap gap-4">
              {options.map((option) => (
                <label key={option} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" disabled />
                  {option}
                </label>
              ))}
            </div>
          </div>
        )
      }

      return (
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" disabled />
          {blockLabel}
        </label>
      )
    }

    return null
  }

  function handleSubmit(values: ProtocolFormValues) {
    if (isViewMode) return

    const normalizedBlocks = normalizeBlocks(values.blocks)

    if (normalizedBlocks.length === 0) {
      return
    }

    if (isEditMode && editId) {
      setConfirmVersionOpen(true)
      return
    }

    createProtocol({
      name: values.name,
      notes: values.notes,
      status: values.status,
      blocks: normalizedBlocks,
    })

    router.push('/protocols')
  }

  function confirmVersion(nextStatus: ProtocolStatus) {
    if (!editId) return

    const values = form.getValues()
    const normalizedBlocks = normalizeBlocks(values.blocks)

    createVersionFromProtocol(
      editId,
      {
        name: values.name,
        notes: values.notes,
        blocks: normalizedBlocks,
      },
      nextStatus
    )

    setConfirmVersionOpen(false)
    router.push('/protocols')
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <h1 className="text-3xl font-bold tracking-tight text-primary">{heading}</h1>

      {!hasHydrated ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {t('loading')}
          </CardContent>
        </Card>
      ) : (isEditMode || isViewMode) && !sourceProtocol ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {t('notFound')}
          </CardContent>
        </Card>
      ) : (
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid gap-4 xl:grid-cols-[320px_1fr]"
        >
          <Card className="h-fit self-start xl:sticky xl:top-20">
            <CardHeader>
              <CardTitle>{t('availableBlocksTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {AVAILABLE_BLOCKS.map((block) => (
                <button
                  type="button"
                  key={block.type}
                  onClick={() => addBlock(block.type)}
                  disabled={isViewMode}
                  className="w-full rounded-md border border-primary/40 px-3 py-2 text-left transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <p className="font-medium text-primary">{t(block.titleKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(block.descriptionKey)}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="protocol-name">{t('fields.name')}</Label>
                    <Input
                      id="protocol-name"
                      placeholder={t('placeholders.name')}
                      disabled={isViewMode}
                      {...form.register('name')}
                    />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive">{t('validation.nameRequired')}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="protocol-notes">{t('fields.notes')}</Label>
                    <textarea
                      id="protocol-notes"
                      className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder={t('placeholders.notes')}
                      disabled={isViewMode}
                      {...form.register('notes')}
                    />
                  </div>

                  {!isEditMode && !isViewMode && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="protocol-status">{t('fields.initialStatus')}</Label>
                      <select
                        id="protocol-status"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        {...form.register('status')}
                      >
                        <option value="active">{t('status.active')}</option>
                        <option value="inactive">{t('status.inactive')}</option>
                      </select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('canvasTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('fields.clickToEdit')}</span>
                  <span className="text-xs text-muted-foreground">
                    {t('canvasCount', { count: blocks.length })}
                  </span>
                </div>

                {blocks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('canvasEmpty')}</p>
                ) : (
                  <div className="space-y-2">
                    {fields.map((fieldBlock, index) => {
                      const block = blocks[index] ?? fieldBlock

                      return (
                      <div
                        key={fieldBlock.id}
                        draggable={!isViewMode}
                        onDragStart={() => setDraggedIndex(index)}
                        onDragOver={(event) => {
                          if (isViewMode) return
                          event.preventDefault()
                        }}
                        onDrop={() => {
                          if (draggedIndex === null) return
                          reorderBlocks(draggedIndex, index)
                          setDraggedIndex(null)
                        }}
                        className="rounded-md border border-border bg-card p-3 transition-colors hover:bg-surface-hover/70"
                        onClick={() => handleBlockClick(index)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            handleBlockClick(index)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <GripVertical className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-primary">{t(`blockType.${block.type}`)}</span>
                          </div>
                          {!isViewMode && (
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                aria-label={t('actions.moveUp')}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  moveBlock(index, -1)
                                }}
                                disabled={index === 0}
                              >
                                <ArrowUp className="size-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                aria-label={t('actions.moveDown')}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  moveBlock(index, 1)
                                }}
                                disabled={index === fields.length - 1}
                              >
                                <ArrowDown className="size-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                aria-label={t('actions.removeBlock')}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  removeBlock(index)
                                }}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          {renderCanvasPreview(block)}
                          {block.type !== 'section-title' && (
                            <p className="text-xs text-muted-foreground">{getBlockSummary(block)}</p>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
                  <Button variant="outline" asChild>
                    <Link href="/protocols">{t('actions.cancel')}</Link>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Eye className="size-4" />
                    {t('actions.preview')}
                  </Button>

                  {!isViewMode && (
                    <Button type="submit" disabled={!canSubmit}>
                      <Plus className="size-4" />
                      {isEditMode ? t('actions.saveVersion') : t('actions.create')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      )}

      {selectedBlock && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/70 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{t('actions.editBlock')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>{t('fields.blockType')}</Label>
                <p className="text-sm font-medium text-primary">{t(`blockType.${selectedBlock.type}`)}</p>
              </div>

              {selectedBlock.type !== 'separator' && (
                <>
                  <div className="space-y-1">
                    <Label>{t('fields.blockLabel')}</Label>
                    <Input
                      value={selectedBlock.label}
                      disabled={isViewMode}
                      onChange={(event) =>
                        updateBlock(selectedBlockIndex!, {
                          label: event.target.value,
                        })
                      }
                    />
                  </div>

                  {selectedBlock.type === 'section-title' ? (
                    <div className="space-y-1">
                      <Label>{t('fields.sectionDescription')}</Label>
                      <textarea
                        className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={selectedBlock.helperText}
                        disabled={isViewMode}
                        onChange={(event) =>
                          updateBlock(selectedBlockIndex!, {
                            helperText: event.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Label>{t('fields.blockHelper')}</Label>
                      <Input
                        value={selectedBlock.helperText}
                        disabled={isViewMode}
                        onChange={(event) =>
                          updateBlock(selectedBlockIndex!, {
                            helperText: event.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  {(selectedBlock.type === 'single-select' || selectedBlock.type === 'checkbox') && (
                    <div className="space-y-2">
                      <Label>{t('fields.options')}</Label>
                      <div className="space-y-2">
                        {getOptionItems(selectedBlock.optionsText).map((option, optionIndex, array) => (
                          <div key={`${selectedBlock.id}-option-${optionIndex}`} className="flex items-center gap-2">
                            <Input
                              value={option}
                              disabled={isViewMode}
                              onChange={(event) => {
                                const nextOptions = [...array]
                                nextOptions[optionIndex] = event.target.value
                                setOptionItems(selectedBlockIndex!, nextOptions)
                              }}
                              placeholder={t('placeholders.optionValue', { index: optionIndex + 1 })}
                            />
                            {!isViewMode && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon-xs"
                                aria-label={t('actions.removeOption')}
                                onClick={() => {
                                  const nextOptions = array.filter((_, idx) => idx !== optionIndex)
                                  setOptionItems(selectedBlockIndex!, nextOptions)
                                }}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            )}
                          </div>
                        ))}

                        {!isViewMode && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const nextOptions = [...getOptionItems(selectedBlock.optionsText), '']
                              setOptionItems(selectedBlockIndex!, nextOptions)
                            }}
                          >
                            {t('actions.addOption')}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedBlock.type !== 'section-title' && (
                    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={selectedBlock.required}
                        disabled={isViewMode}
                        onChange={(event) =>
                          updateBlock(selectedBlockIndex!, {
                            required: event.target.checked,
                          })
                        }
                      />
                      {t('fields.required')}
                    </label>
                  )}
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedBlockIndex(null)}>
                  {t('actions.close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {previewOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/70 p-4">
          <Card className="max-h-[80vh] w-full max-w-3xl overflow-y-auto">
            <CardHeader>
              <CardTitle>{t('preview.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">{t('fields.name')}</p>
                <p className="font-medium">{previewProtocol.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('fields.notes')}</p>
                <p>{previewProtocol.notes || '-'}</p>
              </div>

              <div className="space-y-3 rounded-md border border-border p-3">
                {previewProtocol.blocks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('preview.empty')}</p>
                ) : (
                  previewProtocol.blocks.map((block) => (
                    <div key={block.id} className="py-1">
                      {renderCanvasPreview(block)}
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  {t('preview.close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {confirmVersionOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/70 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t('versioning.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{t('versioning.description')}</p>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmVersionOpen(false)}>
                  {t('actions.cancel')}
                </Button>
                <Button variant="outline" onClick={() => confirmVersion('inactive')}>
                  {t('versioning.saveInactive')}
                </Button>
                <Button onClick={() => confirmVersion('active')}>
                  {t('versioning.saveActive')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
