import { useState, useEffect } from 'react';

export function useApiCall<T>(url: string): {
  data: T | null;
  isLoading: boolean;
  error: any;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, [url, shouldRefetch]);

  const refetch = () => {
    setShouldRefetch(!shouldRefetch);
  };

  return { data, isLoading, error, refetch };
}
