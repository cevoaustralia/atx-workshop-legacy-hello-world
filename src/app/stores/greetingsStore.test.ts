/**
 * Unit tests for Zustand greetings store
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useGreetingsStore,
  useHelloCount,
  useFavouriteGreetingId,
  useIncrementHelloCount,
  useSetFavouriteGreetingId,
} from './greetingsStore';

describe('greetingsStore', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  afterEach(() => {
    // Reset store state after each test
    act(() => {
      useGreetingsStore.setState({
        helloCount: 0,
        favouriteGreetingId: null,
      });
    });
  });

  describe('initial state', () => {
    it('should have initial helloCount of 0', () => {
      const { result } = renderHook(() => useHelloCount());
      expect(result.current).toBe(0);
    });

    it('should have initial favouriteGreetingId of null', () => {
      const { result } = renderHook(() => useFavouriteGreetingId());
      expect(result.current).toBeNull();
    });
  });

  describe('incrementHelloCount', () => {
    it('should increment hello count by 1', () => {
      const { result: countResult } = renderHook(() => useHelloCount());
      const { result: incrementResult } = renderHook(() => useIncrementHelloCount());

      expect(countResult.current).toBe(0);

      act(() => {
        incrementResult.current();
      });

      expect(countResult.current).toBe(1);
    });

    it('should increment multiple times', () => {
      const { result: countResult } = renderHook(() => useHelloCount());
      const { result: incrementResult } = renderHook(() => useIncrementHelloCount());

      act(() => {
        incrementResult.current();
        incrementResult.current();
        incrementResult.current();
      });

      expect(countResult.current).toBe(3);
    });
  });

  describe('setFavouriteGreetingId', () => {
    it('should set favourite greeting ID', () => {
      const { result: favouriteResult } = renderHook(() => useFavouriteGreetingId());
      const { result: setFavouriteResult } = renderHook(() => useSetFavouriteGreetingId());

      expect(favouriteResult.current).toBeNull();

      act(() => {
        setFavouriteResult.current(5);
      });

      expect(favouriteResult.current).toBe(5);
    });

    it('should update favourite greeting ID', () => {
      const { result: favouriteResult } = renderHook(() => useFavouriteGreetingId());
      const { result: setFavouriteResult } = renderHook(() => useSetFavouriteGreetingId());

      act(() => {
        setFavouriteResult.current(5);
      });

      expect(favouriteResult.current).toBe(5);

      act(() => {
        setFavouriteResult.current(10);
      });

      expect(favouriteResult.current).toBe(10);
    });

    it('should clear favourite greeting ID', () => {
      const { result: favouriteResult } = renderHook(() => useFavouriteGreetingId());
      const { result: setFavouriteResult } = renderHook(() => useSetFavouriteGreetingId());

      act(() => {
        setFavouriteResult.current(5);
      });

      expect(favouriteResult.current).toBe(5);

      act(() => {
        setFavouriteResult.current(null);
      });

      expect(favouriteResult.current).toBeNull();
    });
  });

  describe('persistence', () => {
    it('should persist state to sessionStorage', () => {
      const { result: incrementResult } = renderHook(() => useIncrementHelloCount());
      const { result: setFavouriteResult } = renderHook(() => useSetFavouriteGreetingId());

      act(() => {
        incrementResult.current();
        setFavouriteResult.current(42);
      });

      // Check sessionStorage
      const stored = sessionStorage.getItem('greetings-storage');
      expect(stored).toBeTruthy();
      
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.helloCount).toBe(1);
        expect(parsed.state.favouriteGreetingId).toBe(42);
      }
    });
  });

  describe('atomic selectors', () => {
    it('should select helloCount independently', () => {
      const { result } = renderHook(() => useHelloCount());
      expect(typeof result.current).toBe('number');
    });

    it('should select favouriteGreetingId independently', () => {
      const { result } = renderHook(() => useFavouriteGreetingId());
      expect(result.current === null || typeof result.current === 'number').toBe(true);
    });

    it('should select incrementHelloCount function', () => {
      const { result } = renderHook(() => useIncrementHelloCount());
      expect(typeof result.current).toBe('function');
    });

    it('should select setFavouriteGreetingId function', () => {
      const { result } = renderHook(() => useSetFavouriteGreetingId());
      expect(typeof result.current).toBe('function');
    });
  });
});
