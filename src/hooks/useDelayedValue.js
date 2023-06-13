import { useState, useEffect } from 'react';

export function useDelayedValue(srcValue, delay = 0) {
  const [value, setValue] = useState(srcValue);

  useEffect(() => {
    const timer = setTimeout(() => setValue(srcValue), delay);
    return () => clearTimeout(timer);
  }, [srcValue, delay]);

  return value;
}
