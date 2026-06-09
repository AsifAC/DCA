import { useEffect, useState } from "react";

export function useVis() {
  const [v, setV] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setV(true), 60);
    return () => clearTimeout(t);
  }, []);

  return v;
}
