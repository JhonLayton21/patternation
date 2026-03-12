# Infinite Re-render Issues - Analysis & Fixes

## Summary
Found and fixed **4 critical infinite re-render issues** caused by unstable object/array references in dependency arrays and memoization problems.

---

## Issue 1: page.tsx - Unstable `config` Object Dependency ⚠️ CRITICAL

### Location
[src/app/page.tsx](src/app/page.tsx#L236) - useEffect hook

### Problematic Code (BEFORE)
```typescript
// Function called on every render - creates NEW object reference each time
const getCurrentFullState = (): PatternState => ({...});

// Direct dependency on config object (unstable reference)
useEffect(() => {
  const newState = getCurrentFullState();
  const timer = setTimeout(() => {
    history.pushState(newState, 'Pattern modified');
  }, 300);
  return () => clearTimeout(timer);
}, [activeType, config, exportWidth, exportHeight]); 
// ❌ config is a new object every render!
```

### Why It Causes Infinite Re-renders
1. Each time ANY state update occurs (from event handlers), component re-renders
2. `config` state value gets a new object reference (even if values are identical)
3. useEffect dependency array detects the new reference
4. Effect runs → calls `history.pushState()` → may trigger re-render or side effects
5. Re-render creates NEW `config` object → dependency changes again → effect runs again
6. **Cascading infinite loop**

### Fixed Code (AFTER)
```typescript
// Memoized - returns SAME reference when dependencies don't change
const getCurrentFullState = useCallback((): PatternState => ({
  patternType: activeType,
  geometry: { cellSize: config.cellSize ?? 20, gap: config.gap ?? 0, ... },
  style: { strokeColor: config.strokeColor, ... },
  zoom,
  checkerboard: showCheckerboard,
}), [activeType, config.cellSize, config.gap, config.strokeColor, /* all primitives */]);

// Memoize the returned object to avoid creating new reference
const currentFullState = useMemo(() => getCurrentFullState(), [getCurrentFullState]);

// Use memoized state - stable reference breaks the cycle
useEffect(() => {
  const timer = setTimeout(() => {
    history.pushState(currentFullState, 'Pattern modified');
  }, 300);
  return () => clearTimeout(timer);
}, [currentFullState, history]);
// ✅ currentFullState now stays stable until actual values change
```

### Key Changes
- ✅ Converted `getCurrentFullState` from regular function to `useCallback`
- ✅ Changed dependencies to **primitive values** (cellSize, gap, strokeColor) instead of config object
- ✅ Used `useMemo` to memoize the returned object
- ✅ Updated useEffect to depend on memoized `currentFullState` and `history`

---

## Issue 2: usePresetManager.ts - Unstable `allPresets` Array in useCallback ⚠️ CRITICAL

### Location
[src/hooks/usePresetManager.ts](src/hooks/usePresetManager.ts#L73) - loadPreset callback

### Problematic Code (BEFORE)
```typescript
// NEW array created on every render (spread operator = new reference)
const allPresets = [...DEFAULT_PRESETS, ...customPresets];

// useCallback depends on unstable array reference
const loadPreset = useCallback((presetId: string): PatternState | null => {
  const preset = allPresets.find(p => p.id === presetId);
  return preset ? preset.config : null;
}, [allPresets]); 
// ❌ allPresets is a new array every render!
```

### Why It Causes Issues
1. `allPresets` spreads two arrays on every render → creates new array reference
2. Even though underlying data hasn't changed, reference is different
3. `loadPreset` callback dependency detects change → creates NEW callback
4. If `loadPreset` is used in child component props or another useEffect dependency → cascading re-renders
5. Breaks memoization chain and context stability

### Fixed Code (AFTER)
```typescript
// Memoize the array - stable reference, only recreates when customPresets changes
const allPresets = useMemo(() => 
  [...DEFAULT_PRESETS, ...customPresets],
  [customPresets]
);

// Now loadPreset callback only changes when actual data changes, not reference
const loadPreset = useCallback((presetId: string): PatternState | null => {
  const preset = allPresets.find(p => p.id === presetId);
  return preset ? preset.config : null;
}, [allPresets]);
// ✅ Callback stays stable longer, preventing unnecessary propagation
```

### Key Changes
- ✅ Added `useMemo` import
- ✅ Wrapped array spread in `useMemo` with `[customPresets]` dependency
- ✅ Now only recreates when actual custom presets change

---

## Issue 3: usePatternHistory.ts - Unstable Return Object ⚠️ CRITICAL

### Location
[src/hooks/usePatternHistory.ts](src/hooks/usePatternHistory.ts#L115) - return statement

### Problematic Code (BEFORE)
```typescript
// Hook returns NEW object literal every render!
return {
  canUndo: past.length > 1,
  canRedo: future.length > 0,
  historyLength: past.length,
  undo,
  redo,
  pushState,
  clearHistory,
};
// ❌ This is a new object every time!
```

### Why It Causes Issues
1. In page.tsx: `const history = usePatternHistory(...)` → gets new object every render
2. page.tsx useEffect has `[..., history]` as dependency
3. Even though methods are the same, object reference is different
4. **useEffect runs every render** because `history` object changed
5. This effect calls history.pushState which triggers preventDefault and side effects
6. Can cause cascading re-renders and performance issues

### Fixed Code (AFTER)
```typescript
// Memoize the returned object - stable reference across renders
return useMemo(() => ({
  canUndo: past.length > 1,
  canRedo: future.length > 0,
  historyLength: past.length,
  undo,
  redo,
  pushState,
  clearHistory,
}), [past, future, undo, redo, pushState, clearHistory]);
// ✅ Object reference stays same until dependencies change
```

### Key Changes
- ✅ Added `useMemo` import
- ✅ Wrapped return object in `useMemo`
- ✅ Dependencies track all methods and state flags

---

## Issue 4: useShareURL.ts - Unstable `state` Object in Callbacks

### Location
[src/hooks/useShareURL.ts](src/hooks/useShareURL.ts#L41) - getShareURL callback

### Context
```typescript
// In page.tsx: passing memoized state
useShareURL(getCurrentFullState(), useCallback((state) => {...}, []));

// In useShareURL:
const getShareURL = useCallback(() => {
  return generateShareURL(state);
}, [state]);
// state might be unstable if not memoized at call site
```

### Fix Applied
- ✅ page.tsx now passes `currentFullState` (memoized via useMemo)
- ✅ page.tsx wraps onStateLoaded callback in `useCallback` with empty deps
- ✅ Added comment documenting that state must be stable when passed

### Why This Matters
The fix in page.tsx properly memoizes the state object before passing to useShareURL, ensuring stable references throughout the call chain.

---

## Changes Summary by File

### src/app/page.tsx
| Change | Impact |
|--------|--------|
| Added `useMemo`, `useCallback` imports | Enables proper memoization |
| Converted getCurrentFullState to useCallback | Stable function reference |
| Added currentFullState memo | Stable object for dependencies |
| Wrapped history callback in useCallback | Stable callback reference |
| Wrapped share callback in useCallback | Stable callback reference |
| Updated useEffect dependencies | Now uses stable memoized values |

### src/hooks/usePresetManager.ts
| Change | Impact |
|--------|--------|
| Added `useMemo` import | Enables array memoization |
| Wrapped allPresets in useMemo | Stable array reference |
| Updated loadPreset dependencies | Callback only changes when data changes |

### src/hooks/usePatternHistory.ts
| Change | Impact |
|--------|--------|
| Added `useMemo` import | Enables object memoization |
| Wrapped return object in useMemo | Stable return object reference |
| Added all callback dependencies | Proper tracking of changes |

### src/hooks/useShareURL.ts
| Change | Impact |
|--------|--------|
| Added useMemo import (future-proofing) | Available if needed |
| Added comments for stability requirements | Documents expectations |

---

## Testing Recommendations

### After These Fixes
1. ✅ **No more "Maximum update depth exceeded" errors**
2. ✅ **Fewer unnecessary re-renders** - check React DevTools Profiler
3. ✅ **Smoother pattern generation** - less jank during interactions
4. ✅ **Stable undo/redo** - history callbacks don't trigger extra renders
5. ✅ **URL sharing works smoothly** - no cascading effects from state passing

### Manual Testing
```
1. Open the app
2. Change pattern type → should not spam re-renders in DevTools
3. Adjust sliders → smooth updates without lag
4. Use undo/redo → stable state transitions
5. Copy share URL → no infinite loops
6. Open DevTools "Highlight updates" → should see controlled updates only
```

### DevTools Profiler Check
- Record timeline in React DevTools Profiler
- Watch for components that only render when you interact
- Should NOT see renders happening without user interaction
- history.pushState should only trigger when state actually changes

---

## Root Cause Analysis

All four issues followed the same pattern:

```
Unstable Reference → Used in Dependency Array → Runs Every Render
                        ↓
                  Triggers Side Effect
                        ↓
                  Causes State Update
                        ↓
                  New Render
                        ↓
                  Unstable Reference Created Again ← Loop!
```

**The Fix**: Break the cycle with **memoization** at each level:
- Objects → wrapped in `useMemo`
- Callbacks → wrapped in `useCallback`
- Functions → wrapped in `useCallback`
- Arrays → wrapped in `useMemo`

---

## Prevention Guide for Future Code

✅ **DO:**
- Use `useMemo` when creating complex objects to pass to child components
- Use `useCallback` when passing callbacks to dependency arrays
- Depend on **primitive values** (strings, numbers) not objects/arrays
- Memoize return objects from custom hooks

❌ **DON'T:**
- Pass object literals directly to useEffect dependencies
- Create new arrays/objects in render with dependencies on them
- Return new object literals from custom hooks
- Depend on unstable references in effect arrays

---

## Related Documentation
- React Hooks Documentation: https://react.dev/reference/react
- useCallback: https://react.dev/reference/react/useCallback
- useMemo: https://react.dev/reference/react/useMemo
- useEffect: https://react.dev/reference/react/useEffect
