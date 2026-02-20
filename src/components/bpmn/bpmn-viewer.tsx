'use client'

import { useEffect, useRef, useState } from 'react'
import BpmnJS from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import { cn } from '@/lib/utils'

interface BPMNViewerProps {
  xml?: string | null
  className?: string
  height?: number
  onLoad?: (canvas: any) => void
}

const defaultXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Início">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Atividade">
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

export function BPMNViewer({ xml, className, height = 400, onLoad }: BPMNViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Limpar container anterior
    containerRef.current.innerHTML = ''

    try {
      // Criar visualizador
      const viewer = new BpmnJS({
        container: containerRef.current,
        keyboard: { bindTo: document }
      })

      viewerRef.current = viewer

      // Carregar diagrama
      const xmlToLoad = xml || defaultXML

      viewer.importXML(xmlToLoad)
        .then(() => {
          const canvas = viewer.get('canvas') as any
          canvas.zoom('fit-viewport')

          if (onLoad) {
            onLoad(canvas)
          }
        })
        .catch((err: Error) => {
          console.error('Erro ao carregar BPMN:', err)
          setError(err.message)
        })
    } catch (err: any) {
      console.error('Erro ao inicializar BPMN viewer:', err)
      setError(err.message)
    }

    // Cleanup
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy()
      }
    }
  }, [xml])

  if (error) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 rounded-lg', className)} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-red-500 font-medium">Erro ao carregar diagrama</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'bpmn-container rounded-lg overflow-hidden',
        'bg-white border border-gray-200',
        className
      )}
      style={{ height }}
    />
  )
}

// ============================================
// BPMN VIEWER COMPACT (para cards)
// ============================================

interface BPMNViewerCompactProps {
  xml?: string | null
  className?: string
}

export function BPMNViewerCompact({ xml, className }: BPMNViewerCompactProps) {
  return (
    <BPMNViewer
      xml={xml}
      className={cn('h-32', className)}
      height={128}
    />
  )
}
