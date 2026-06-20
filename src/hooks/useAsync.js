import { useEffect, useState } from 'react';

// Minimal async-data hook with loading/error state and cancellation safety.
// `deps` controls re-fetching. `fn` should return a promise.
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let active = true;
    setState({ loading: true, data: null, error: null });
    Promise.resolve()
      .then(fn)
      .then((data) => {
        if (active) setState({ loading: false, data, error: null });
      })
      .catch((error) => {
        if (active) setState({ loading: false, data: null, error });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
