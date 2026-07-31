export type BaseUrlResolver = () => string;

let baseUrlResolver: BaseUrlResolver = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api/mock";

export function setBaseUrlResolver(resolver: BaseUrlResolver) {
  baseUrlResolver = resolver;
}

export function getBaseUrl(): string {
  return baseUrlResolver();
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed (${response.status}) for ${path}`);
  }

  return response.json() as Promise<T>;
}
