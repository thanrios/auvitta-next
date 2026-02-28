import type { MockDocumentItem, MockTimelineItem } from './types'

export const mockAnamnesis: MockTimelineItem[] = [
  {
    id: 'anamnesis-1',
    date: '2025-02-10',
    professional: 'Aline Silva (Fonoaudióloga)',
    observations:
      'Paciente chegou agitado e apresentou dificuldade inicial para manter foco nas atividades propostas.',
    evolution:
      'Trabalhamos consciência fonológica com boa resposta aos estímulos visuais e melhora progressiva na participação.',
  },
  {
    id: 'anamnesis-2',
    date: '2025-02-03',
    professional: 'Carla Mendes (Psicopedagoga)',
    observations:
      'Família relata avanço na organização da rotina escolar e redução de episódios de frustração.',
    evolution:
      'Foram aplicadas estratégias de autorregulação e planejamento, com adesão satisfatória durante a sessão.',
  },
]

export const mockSessions: MockTimelineItem[] = [
  {
    id: 'session-1',
    date: '2025-02-12',
    professional: 'Aline Silva (Fonoaudióloga)',
    observations:
      'Sessão iniciada com exercício de aquecimento articulatório e revisão das atividades propostas na semana anterior.',
    evolution:
      'Paciente apresentou boa adesão às tarefas, com melhora em organização de fala espontânea e manutenção de atenção.',
  },
  {
    id: 'session-2',
    date: '2025-02-05',
    professional: 'Carla Mendes (Psicopedagoga)',
    observations:
      'Foram trabalhadas estratégias de leitura e compreensão textual com apoio visual e instruções graduais.',
    evolution:
      'Evoluiu com menor necessidade de mediação ao final da sessão e maior autonomia na execução das atividades.',
  },
]

export const mockDocuments: MockDocumentItem[] = [
  {
    id: 'document-1',
    fileName: 'Encaminhamento escolar.pdf',
    category: 'Outro',
    date: '2026-01-30',
  },
  {
    id: 'document-2',
    fileName: 'Audiometria.pdf',
    category: 'Laudo',
    date: '2026-02-01',
  },
]
