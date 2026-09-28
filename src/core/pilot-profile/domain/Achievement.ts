export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconType: 'trophy' | 'fire' | 'medal' | 'star' | 'crown';
  unlocked: boolean;
  progressText?: string;
}

export class AchievementDomainService {
  static getAchievements(
    totalAnswered: number,
    currentStreak: number,
    levelXp: number,
    masteredQuestionsCount: number
  ): Achievement[] {
    return [
      {
        id: 'first_session',
        title: 'Primera Vuelta',
        description: 'Completaste tu primera sesión de estudio.',
        iconType: 'trophy',
        unlocked: totalAnswered >= 5,
        progressText: `${Math.min(totalAnswered, 5)} / 5`,
      },
      {
        id: 'streak_3',
        title: 'Racha Imparable',
        description: 'Mantuviste una racha de al menos 3 días consecutivos.',
        iconType: 'fire',
        unlocked: currentStreak >= 3,
        progressText: `${currentStreak} / 3 días`,
      },
      {
        id: 'xp_500',
        title: 'Piloto Destacado',
        description: 'Alcanzaste 500 XP en tu entrenamiento.',
        iconType: 'star',
        unlocked: levelXp >= 500,
        progressText: `${levelXp} / 500 XP`,
      },
      {
        id: 'master_100',
        title: 'Centurión del MTC',
        description: 'Dominas más de 100 preguntas del balotario oficial.',
        iconType: 'crown',
        unlocked: masteredQuestionsCount >= 100,
        progressText: `${masteredQuestionsCount} / 100 preguntas`,
      },
    ];
  }
}
