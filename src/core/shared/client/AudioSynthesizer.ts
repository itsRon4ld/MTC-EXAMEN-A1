'use client';

class AudioSynthesizerService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.1) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context silently ignored if unavailable
    }
  }

  public playClick() {
    this.playTone(450, 0.03, 'sine', 0.05);
    this.triggerHaptic([15]);
  }

  public playSuccess() {
    this.playTone(523.25, 0.08, 'sine', 0.12); // C5
    setTimeout(() => this.playTone(659.25, 0.09, 'sine', 0.12), 70); // E5
    setTimeout(() => this.playTone(783.99, 0.22, 'triangle', 0.15), 140); // G5
    this.triggerHaptic([30, 20, 40]);
  }

  public playError() {
    this.playTone(240, 0.12, 'sawtooth', 0.12);
    setTimeout(() => this.playTone(170, 0.22, 'sawtooth', 0.12), 90);
    this.triggerHaptic([80, 40, 80]);
  }

  public playExamPass() {
    this.playTone(523.25, 0.1, 'sine', 0.15);
    setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.15), 100);
    setTimeout(() => this.playTone(783.99, 0.12, 'sine', 0.15), 200);
    setTimeout(() => this.playTone(1046.5, 0.35, 'triangle', 0.2), 300);
    this.triggerHaptic([50, 30, 50, 30, 100]);
  }

  private triggerHaptic(pattern: number[]) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }
}

export const soundFx = new AudioSynthesizerService();
