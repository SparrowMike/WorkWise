import { useState, useEffect } from "react";
import { interactiveBlob } from "../content/helpers/interactiveBlob";

function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const container = document.getElementById('work-wise__content') as HTMLElement;

      if (container) {
        interactiveBlob(container);
      }
    }
  }, [isMounted]);
}

export default useIsMounted