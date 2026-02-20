'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import BpmnJS from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface BPMNEditorProps {
  xml?: string | null
  onSave?: (xml: string) => void
  onChange?: (xml: string) => void
  className?: string
  height?: number
  readOnly?: boolean
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

export function BPMNEditor({
  xml,
  onSave,
  onChange,
  className,
  height = 500,
  readOnly = false
}: BPMNEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [savedXml, setSavedXml] = useState<string | null>(xml || null)
  const [isDirty, setIsDirty] = useState(false)

  const handleSave = useCallback(async () => {
    if (!modelerRef.current) return

    try {
      const result = await modelerRef.current.saveXML({ format: true })
      setSavedXml(result.xml)
      setIsDirty(false)

      if (onSave) {
        onSave(result.xml)
      }
    } catch (err: any) {
      console.error('Erro ao salvar:', err)
      setError(err.message)
    }
  }, [onSave])

  useEffect(() => {
    if (!containerRef.current || readOnly) return

    // Limpar container anterior
    containerRef.current.innerHTML = ''

    try {
      // Criar modeler
      const modeler = new BpmnJS({
        container: containerRef.current,
        keyboard: { bindTo: document }
      })

      modelerRef.current = modeler

      // Evento de mudança
      modeler.on('commandStack.changed', () => {
        setIsDirty(true)
        if (onChange) {
          modeler.saveXML().then((result: any) => {
            onChange(result.xml)
          })
        }
      })

      // Carregar diagrama
      const xmlToLoad = xml || defaultXML

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
  }, [readOnly])

  if (error) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 rounded-lg', className)} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-red-500 font-medium">Erro ao carregar editor</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col rounded-lg border border-gray-200 overflow-hidden', className)}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Editor BPMN
            </span>
            {isDirty && (
              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                Não salvo
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                if (modelerRef.current) {
                  const result = await modelerRef.current.saveXML({ format: true })
                  setSavedXml(result.xml)
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
              disabled={!isDirty}
            >
              Salvar
            </Button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={containerRef}
        className="flex-1"
        style={{ height: readOnly ? height : height - 48 }}
      />
    </div>
  )
}
