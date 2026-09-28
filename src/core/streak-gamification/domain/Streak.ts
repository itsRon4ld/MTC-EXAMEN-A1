export interface UserTelemetry {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  dailyGoalTarget: number;
  dailyAnsweredCount: number;
  levelXp: number;
  totalAnswered: number;
}

export class StreakDomainService {
  static getTodayString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getYesterdayString(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static calculateStreak(currentStreak: number, bestStreak: number, lastActiveDate: string | null): { newStreak: number; newBest: number; isNewDay: boolean } {
    const today = this.getTodayString();
    const yesterday = this.getYesterdayString();

    if (!lastActiveDate) {
      return { newStreak: 1, newBest: Math.max(1, bestStreak), isNewDay: true };
    }

    if (lastActiveDate === today) {
      return { newStreak: currentStreak, newBest: bestStreak, isNewDay: false };
    }

    if (lastActiveDate === yesterday) {
      const updatedStreak = currentStreak + 1;
      return { newStreak: updatedStreak, newBest: Math.max(updatedStreak, bestStreak), isNewDay: true };
    }

    // Missed a day -> reset to 1
    return { newStreak: 1, newBest: Math.max(1, bestStreak), isNewDay: true };
  }

  static calculateLevel(xp: number): { level: number; title: string; progressPct: number } {
    // 0 - 99: Nivel 1 (Peatón Principiante)
    // 100 - 299: Nivel 2 (Alumno de Escuela)
    // 300 - 599: Nivel 3 (Piloto en Práctica)
    // 600 - 999: Nivel 4 (Conductor Calificado)
    // 1000+: Nivel 5 (As del Volante / Maestro MTC)
    if (xp < 100) {
      return { level: 1, title: 'Peatón Principiante', progressPct: Math.min(100, Math.round((xp / 100) * 100)) };
    }
    if (xp < 300) {
      return { level: 2, title: 'Alumno de Escuela', progressPct: Math.min(100, Math.round(((xp - 100) / 200) * 100)) };
    }
    if (xp < 600) {
      return { level: 3, title: 'Piloto en Práctica', progressPct: Math.min(100, Math.round(((xp - 300) / 300) * 100)) };
    }
    if (xp < 1000) {
      return { level: 4, title: 'Conductor Calificado', progressPct: Math.min(100, Math.round(((xp - 600) / 400) * 100)) };
    }
    return { level: 5, title: 'As del Volante', progressPct: 100 };
  }
}
