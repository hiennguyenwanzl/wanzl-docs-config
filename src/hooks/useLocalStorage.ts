import { useState, useEffect, useCallback } from 'react';

// Types
export interface UseLocalStorageOptions<T> {
    defaultValue?: T;
    serializer?: {
        parse: (value: string) => T;
        stringify: (value: T) => string;
    };
}

export interface UseLocalStorageReturn<T> {
    value: T;
    setValue: (value: T | ((prevValue: T) => T)) => void;
    removeValue: () => void;
    isLoading: boolean;
    error: string | null;
}

// Default serializer
const defaultSerializer = {
    parse: JSON.parse,
    stringify: JSON.stringify
};

/**
 * Custom hook for managing localStorage with TypeScript support
 * Handles serialization, error handling, and SSR compatibility
 */
export function useLocalStorage<T>(
    key: string,
    options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
    const {
        defaultValue,
        serializer = defaultSerializer
    } = options;

    const [value, setValue] = useState<T>(() => {
        // Return default value during SSR or when localStorage is not available
        if (typeof window === 'undefined') {
            return defaultValue as T;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (item === null) {
                return defaultValue as T;
            }
            return serializer.parse(item);
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return defaultValue as T;
        }
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize after component mounts (for SSR compatibility)
    useEffect(() => {
        if (typeof window === 'undefined') {
            setIsLoading(false);
            return;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (item !== null) {
                const parsedValue = serializer.parse(item);
                setValue(parsedValue);
            }
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(`Failed to read from localStorage: ${errorMessage}`);
            console.warn(`Error reading localStorage key "${key}":`, err);
        } finally {
            setIsLoading(false);
        }
    }, [key, serializer]);

    // Update localStorage when value changes
    const updateValue = useCallback((newValue: T | ((prevValue: T) => T)) => {
        if (typeof window === 'undefined') {
            console.warn('localStorage is not available in this environment');
            return;
        }

        try {
            const valueToStore = typeof newValue === 'function'
                ? (newValue as (prevValue: T) => T)(value)
                : newValue;

            setValue(valueToStore);

            if (valueToStore === undefined || valueToStore === null) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, serializer.stringify(valueToStore));
            }

            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(`Failed to write to localStorage: ${errorMessage}`);
            console.error(`Error writing to localStorage key "${key}":`, err);
        }
    }, [key, value, serializer]);

    // Remove value from localStorage
    const removeValue = useCallback(() => {
        if (typeof window === 'undefined') {
            console.warn('localStorage is not available in this environment');
            return;
        }

        try {
            window.localStorage.removeItem(key);
            setValue(defaultValue as T);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(`Failed to remove from localStorage: ${errorMessage}`);
            console.error(`Error removing localStorage key "${key}":`, err);
        }
    }, [key, defaultValue]);

    return {
        value,
        setValue: updateValue,
        removeValue,
        isLoading,
        error
    };
}

/**
 * Hook for managing localStorage with automatic JSON serialization
 * Simplified version for common use cases
 */
export function useLocalStorageState<T>(
    key: string,
    defaultValue: T
): [T, (value: T | ((prevValue: T) => T)) => void, () => void] {
    const { value, setValue, removeValue } = useLocalStorage(key, { defaultValue });
    return [value, setValue, removeValue];
}

/**
 * Hook for managing localStorage as a simple key-value store
 * Returns string values without JSON parsing
 */
export function useLocalStorageString(
    key: string,
    defaultValue: string = ''
): UseLocalStorageReturn<string> {
    return useLocalStorage<string>(key, {
        defaultValue,
        serializer: {
            parse: (value: string) => value,
            stringify: (value: string) => value
        }
    });
}

/**
 * Hook for managing boolean values in localStorage
 */
export function useLocalStorageBoolean(
    key: string,
    defaultValue: boolean = false
): UseLocalStorageReturn<boolean> {
    return useLocalStorage<boolean>(key, {
        defaultValue,
        serializer: {
            parse: (value: string) => value === 'true',
            stringify: (value: boolean) => value.toString()
        }
    });
}

/**
 * Hook for managing arrays in localStorage
 */
export function useLocalStorageArray<T>(
    key: string,
    defaultValue: T[] = []
): UseLocalStorageReturn<T[]> {
    return useLocalStorage<T[]>(key, { defaultValue });
}

/**
 * Utility function to check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        const testKey = '__localStorage_test__';
        window.localStorage.setItem(testKey, 'test');
        window.localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

/**
 * Utility function to get all localStorage keys
 */
export function getAllLocalStorageKeys(): string[] {
    if (!isLocalStorageAvailable()) {
        return [];
    }

    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
            keys.push(key);
        }
    }
    return keys;
}

/**
 * Utility function to clear all localStorage data
 */
export function clearLocalStorage(): void {
    if (!isLocalStorageAvailable()) {
        console.warn('localStorage is not available');
        return;
    }

    try {
        window.localStorage.clear();
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
    }
}