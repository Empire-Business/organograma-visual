'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import BpmnJS from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Processo {
  id: string
  nome: string
}

interface BpmnEditorModalProps {
  processo: Processo
  initialXml?: string
  onClose: () => void
  onSave: (xml: string) => void
}

const defaultXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Início">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Nova Tarefa">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="Fim">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="185" y="202" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="270" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="412" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="418" y="202" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="177" />
        <di:waypoint x="270" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="370" y="177" />
        <di:waypoint x="412" y="177" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`

export function BpmnEditorModal({ processo, initialXml, onClose, onSave }: BpmnEditorModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = useCallback(async () => {
    if (!modelerRef.current) return

    setSaving(true)
    try {
      const result = await modelerRef.current.saveXML({ format: true })
      onSave(result.xml)
    } catch (err: any) {
      console.error('Erro ao salvar:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }, [onSave])

  useEffect(() => {
    if (!containerRef.current) return

    // Limpar container anterior
    containerRef.current.innerHTML = ''

    try {
      const modeler = new BpmnJS({
        container: containerRef.current,
        keyboard: { bindTo: document }
      })

      modelerRef.current = modeler

      // Evento de mudança
      modeler.on('commandStack.changed', () => {
        setIsDirty(true)
      })

      // Carregar diagrama
      const xmlToLoad = initialXml || defaultXML

      modeler.importXML(xmlToLoad)
        .then(() => {
          const canvas = modeler.get('canvas') as any
          canvas.zoom('fit-viewport')
        })
        .catch((err: Error) => {
          console.error('Erro ao carregar BPMN:', err)
          setError(err.message)
        })
    } catch (err: any) {
      console.error('Erro ao inicializar BPMN editor:', err)
      setError(err.message)
    }

    // Cleanup
    return () => {
      if (modelerRef.current) {
        modelerRef.current.destroy()
      }
    }
  }, [initialXml])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (isDirty) {
          handleSave()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, isDirty, handleSave])

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col bg-[var(--card)] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--card)] border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-[var(--foreground)]">Editor BPMN</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{processo.nome}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                Não salvo
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                if (modelerRef.current) {
                  modelerRef.current.get('commandStack').clear()
                  setIsDirty(false)
                }
              }}
              disabled={!isDirty}
            >
              Desfazer
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Toolbar de ajuda */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-[var(--border)] text-xs text-[var(--muted-foreground)]">
          <span className="mr-4">💡 Dicas:</span>
          <span className="mr-4">Arraste elementos da paleta à esquerda</span>
          <span className="mr-4">Conecte elementos arrastando do ponto verde</span>
          <span>Ctrl+S para salvar</span>
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <p className="text-red-500 font-medium">Erro ao carregar editor</p>
                <p className="text-gray-500 text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="absolute inset-0"
            />
          )}
        </div>
      </div>
    </>
  )
}
