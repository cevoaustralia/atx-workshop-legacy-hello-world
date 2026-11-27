import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GreetingsState {
  helloCount: number;
  favouriteGreetingId: number | null;
  incrementHelloCount: () => void;
  setFavouriteGreetingId: (id: number | null) => void;
}

export const useGreetingsStore = create<GreetingsState>()(
  persist(
    (set) => ({
      helloCount: 0,
      favouriteGreetingId: null,
      incrementHelloCount: () => set((state) => ({ helloCount: state.helloCount + 1 })),
      setFavouriteGreetingId: (id) => set({ favouriteGreetingId: id }),
    }),
    {
      name: 'greetings-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);

// Atomic selectors
export const useHelloCount = () => useGreetingsStore((state) => state.helloCount);
export const useFavouriteGreetingId = () => useGreetingsStore((state) => state.favouriteGreetingId);
export const useIncrementHelloCount = () => useGreetingsStore((state) => state.incrementHelloCount);
export const useSetFavouriteGreetingId = () => useGreetingsStore((state) => state.setFavouriteGreetingId);
