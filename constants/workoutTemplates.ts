import { WorkoutTemplate } from '@/types/workout';

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'template-a',
    name: 'A — Pernas + Core',
    description: 'Treino focado em pernas e fortalecimento do core',
    category: 'legs',
    exercises: [
      { name: 'Agachamento livre', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_A/agachamento-com-barra.gif') },
      { name: 'Leg press ou Hack', sets: 3, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_A/leg-press.gif') },
      { name: 'Afundo / avanço (halter ou barra)', sets: 3, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_A/avanco-com-halteras.gif') },
      { name: 'Mesa flexora', sets: 3, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_A/mesa-flexora.gif') },
      { name: 'Cadeira extensora', sets: 3, reps: 12, weight: 0, image: require('@/assets/images/exercicios/treino_A/cadeira-extensora-extensora.gif') },
      { name: 'Panturrilha em pé', sets: 4, reps: 13, weight: 0, image: require('@/assets/images/exercicios/treino_A/panturrilha-pe.gif') },
      { name: 'Panturrilha sentado', sets: 2, reps: 13, weight: 0, image: require('@/assets/images/exercicios/treino_A/panturrilha-sentado.gif') },
      { name: 'Prancha', sets: 3, reps: 1, weight: 0, notes: '30-60s', image: require('@/assets/images/exercicios/treino_A/core-prancha.jpg') },
      { name: 'Abdominal no cabo', sets: 2, reps: 15, weight: 0, image: require('@/assets/images/exercicios/treino_A/abdominal-cabo.gif') },
    ],
  },
  {
    id: 'template-b',
    name: 'B — Peito + Tríceps',
    description: 'Treino focado em músculos de empurrar - peito e tríceps',
    category: 'push',
    exercises: [
      { name: 'Supino reto', sets: 4, reps: 8, weight: 0, image: require('@/assets/images/exercicios/treino_B/supino-reto.gif') },
      { name: 'Supino inclinado', sets: 3, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_B/supino-inclinado.gif') },
      { name: 'Crucifixo (máquina ou halteres)', sets: 3, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_B/crucifixo.gif') },
      { name: 'Cross-over', sets: 3, reps: 13, weight: 0, image: require('@/assets/images/exercicios/treino_B/cross-over.gif') },
      { name: 'Tríceps pulley (barra ou corda)', sets: 3, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_B/tricep-pulley.gif') },
      { name: 'Tríceps francês / testa', sets: 2, reps: 9, weight: 0, image: require('@/assets/images/exercicios/treino_B/triceps-frances-unilateral.gif') },
      { name: 'Dips/paralelas', sets: 2, reps: 1, weight: 0, notes: 'até a falha técnica', image: require('@/assets/images/exercicios/treino_B/dips-paralelas.gif') },
    ],
  },
  {
    id: 'template-c',
    name: 'C — Costas + Bíceps',
    description: 'Treino focado em músculos de puxar - costas e bíceps',
    category: 'pull',
    exercises: [
      { name: 'Puxada frontal pronada', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_C/puxada-frontal.gif') },
      { name: 'Remada baixa ou curvada', sets: 3, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_C/remada-baixa.gif') },
      { name: 'Puxada supinada', sets: 3, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_C/puxada-supinada.gif') },
      { name: 'Remada unilateral (halter)', sets: 2, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_C/remada-unilateral.gif') },
      { name: 'Face pull / crucifixo invertido', sets: 2, reps: 13, weight: 0, image: require('@/assets/images/exercicios/treino_C/face-pull.gif') },
      { name: 'Bíceps rosca direta', sets: 3, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_C/biceps-rosca-direta.gif') },
      { name: 'Rosca martelo', sets: 2, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_C/rosca-martelo.gif') },
    ],
  },
  {
    id: 'template-d',
    name: 'D — Ombro + Trapézio + Core',
    description: 'Treino focado em ombros, trapézio e core',
    category: 'upper',
    exercises: [
      { name: 'Desenvolvimento militar ou Arnold', sets: 4, reps: 8, weight: 0, image: require('@/assets/images/exercicios/treino_D/desenvolvimento-militar.gif') },
      { name: 'Elevação lateral', sets: 3, reps: 13, weight: 0, image: require('@/assets/images/exercicios/treino_D/elevacao-lateral.gif') },
      { name: 'Elevação frontal', sets: 2, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_D/elevacao-frontal.gif') },
      { name: 'Elevação posterior (peck deck invertido ou halter)', sets: 2, reps: 13, weight: 0, image: require('@/assets/images/exercicios/treino_D/elevacao-posterior.gif') },
      { name: 'Encolhimento (barra ou halteres)', sets: 3, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_D/encolhimento.gif') },
      { name: 'Remada alta (barra ou polia)', sets: 2, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_D/remada-alta.gif') },
      { name: 'Prancha lateral', sets: 3, reps: 1, weight: 0, notes: '30s', image: require('@/assets/images/exercicios/treino_D/prancha-lateral.gif') },
      { name: 'Rotação no cabo', sets: 2, reps: 17, weight: 0, image: require('@/assets/images/exercicios/treino_D/rotacao-cabo.gif') },
    ],
  },
  {
    id: 'template-e',
    name: 'E — Pernas (variação)',
    description: 'Variação do treino de pernas com exercícios diferentes',
    category: 'legs',
    exercises: [
      { name: 'Front squat ou agachamento com halteres', sets: 3, reps: 9, weight: 0, image: require('@/assets/images/exercicios/treino_E/front-squat.gif') },
      { name: 'Stiff / levantamento terra romeno', sets: 3, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_E/stiff.gif') },
      { name: 'Leg press (variação do ângulo)', sets: 3, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_E/leg-press.gif') },
      { name: 'Mesa flexora', sets: 3, reps: 11, weight: 0, image: require('@/assets/images/exercicios/treino_E/mesa-flexora.gif') },
      { name: 'Cadeira abdutora/adutora', sets: 3, reps: 13, weight: 0, image: require('@/assets/images/exercicios/treino_E/abdutora.gif') },
      { name: 'Panturrilha em pé ou no leg press', sets: 4, reps: 13, weight: 0, image: require('@/assets/images/exercicios/treino_E/panturrilha-pe.gif') },
      { name: 'Panturrilha sentado', sets: 2, reps: 13, weight: 0, image: require('@/assets/images/exercicios/treino_E/panturrilha-sentado.gif') },
    ],
  },
  // Templates da Georgia
  {
    id: 'georgia-template-a',
    name: 'Georgia A — Pernas Completo',
    description: 'Treino completo de pernas da Georgia',
    category: 'legs',
    exercises: [
      { name: 'Agachamento livre', sets: 4, reps: 12, weight: 0, image: require('@/assets/images/exercicios/treino_A/agachamento-com-barra.gif') },
      { name: 'Agachamento Hack', sets: 4, reps: 12, weight: 0, image: require('@/assets/images/exercicios/treino_A/leg-press.gif') },
      { name: 'Cadeira extensora', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_A/cadeira-extensora-extensora.gif') },
      { name: 'Leg press 45', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_A/leg-press.gif') },
      { name: 'Cadeira adutora', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_E/abdutora.gif') },
    ],
  },
  {
    id: 'georgia-template-b',
    name: 'Georgia B — Ombro/Bíceps/Peito',
    description: 'Treino de ombro, bíceps e peito da Georgia',
    category: 'push',
    exercises: [
      { name: 'Elevação frontal e lateral', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_D/elevacao-frontal.gif') },
      { name: 'Bíceps alternado', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_C/biceps-rosca-direta.gif') },
      { name: 'Desenvolvimento militar alter', sets: 4, reps: 12, weight: 0, image: require('@/assets/images/exercicios/treino_D/desenvolvimento-militar.gif') },
      { name: 'Supino reto', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_B/supino-reto.gif') },
      { name: 'Crucifixo', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_B/crucifixo.gif') },
      { name: 'Pack deck', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_B/crucifixo.gif') },
      { name: 'Bíceps na polia', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_C/biceps-rosca-direta.gif') },
    ],
  },
  {
    id: 'georgia-template-c',
    name: 'Georgia C — Posteriores e Glúteo',
    description: 'Treino de posteriores e glúteo da Georgia',
    category: 'legs',
    exercises: [
      { name: 'Stiff com barra', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_E/stiff.gif') },
      { name: 'Terra sumô', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_E/stiff.gif') },
      { name: 'Cadeira flexora', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_A/mesa-flexora.gif') },
      { name: 'Coice na polia', sets: 4, reps: 10, weight: 0 },
      { name: 'Cadeira abdutora', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_E/abdutora.gif') },
      { name: 'Elevação pélvica', sets: 4, reps: 10, weight: 0 },
    ],
  },
  {
    id: 'georgia-template-d',
    name: 'Georgia D — Costas/Tríceps',
    description: 'Treino de costas e tríceps da Georgia',
    category: 'pull',
    exercises: [
      { name: 'Puxador frontal p.pronado', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_C/puxada-frontal.gif') },
      { name: 'Puxador frontal p.supinado', sets: 4, reps: 12, weight: 0, image: require('@/assets/images/exercicios/treino_C/puxada-supinada.gif') },
      { name: 'Remada baixa', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_C/remada-baixa.gif') },
      { name: 'Remada articulada', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_C/remada-baixa.gif') },
      { name: 'Remada unilateral', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_C/remada-unilateral.gif') },
      { name: 'Tríceps com halter', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_B/triceps-frances-unilateral.gif') },
      { name: 'Tríceps polia barra reta', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_B/tricep-pulley.gif') },
      { name: 'Tríceps polia corda', sets: 4, reps: 10, weight: 0, image: require('@/assets/images/exercicios/treino_B/tricep-pulley.gif') },
    ],
  },
];

export const getTemplateByCategory = (category: string) => {
  return workoutTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return workoutTemplates.find(template => template.id === id);
};
