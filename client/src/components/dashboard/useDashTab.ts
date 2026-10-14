import { useSearchParams } from 'react-router-dom';

/** Dashboard tab kept in the URL (?tab=) so the header links and back button work. */
export const useDashTab = <T extends string>(valid: readonly T[], fallback: T): [T, (t: T) => void] => {
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab') || '';
  const tab = ((valid as readonly string[]).includes(raw) ? raw : fallback) as T;
  const setTab = (t: T) =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        next.set('tab', t);
        return next;
      },
      { replace: true }
    );
  return [tab, setTab];
};

/** Reads and clears ?new=1 (header "List a pet" button). */
export const useConsumeNewParam = (onNew: () => void) => {
  const [params, setParams] = useSearchParams();
  const wants = params.get('new') === '1';
  return {
    wants,
    consume: () => {
      onNew();
      setParams(
        (p) => {
          const next = new URLSearchParams(p);
          next.delete('new');
          return next;
        },
        { replace: true }
      );
    },
  };
};
