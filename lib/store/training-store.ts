import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word } from '@/types';

interface TrainingState {
  words: Word[];
  currentIndex: number;
  phase: 'start' | 'flashcards' | 'matching' | 'completed';
  
  // Actions
  initSession: (words: Word[]) => void;
  setNextIndex: () => void;
  setPhase: (phase: 'start' | 'flashcards' | 'matching' | 'completed') => void;
  resetSession: () => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set) => ({
      words: [],
      currentIndex: 0,
      phase: 'start',

      initSession: (incomingWords) => set((state) => {
        // Only initialize if the current session is empty
        // This prevents overwriting an ongoing OR completed session during фоновий re-renders/RSC refreshes
        if (state.words.length > 0) {
          return state;
        }
        return { 
          words: incomingWords, 
          currentIndex: 0, 
          phase: incomingWords.length === 0 
            ? 'completed' 
            : (state.phase === 'flashcards' ? 'flashcards' : 'start')
        };
      }),

      setNextIndex: () => set((state) => ({ 
        currentIndex: state.currentIndex + 1 
      })),

      setPhase: (newPhase) => set({ phase: newPhase }),

      resetSession: () => set({ 
        words: [], 
        currentIndex: 0, 
        phase: 'start' 
      }),
    }),
    {
      name: 'training-session-storage', // key in localStorage
    }
  )
);
