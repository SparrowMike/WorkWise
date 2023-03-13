import { useState, useEffect } from "react";

interface ApiRequestProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: Record<string, any>;
  refetch?: boolean;
}

interface ApiError {
  message: string;
  status?: number;
}

interface ApiResponse<T> {
  data?: T | T[];
  error?: ApiError;
  isLoading: boolean;
}

function useApiRequest<T>({ url, method, headers, body, refetch = false }: ApiRequestProps): ApiResponse<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const error: ApiError = {
            message: response.statusText,
            status: response.status,
          };
          throw error;
        }

        const data = await response.json();
        setData(data);
      } catch (error: ApiError | any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    if (refetch) {
      fetchData(); // refetch data if refetch is true
    }
  }, [url, method, headers, body, refetch]);

  return { data, error, isLoading };
}

export default useApiRequest;