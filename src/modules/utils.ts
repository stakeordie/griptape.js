export function toQueryString(params: any): string {
  return Object.keys(params)
    .map(
      (key: string) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join('&');
}

export function handleResponse(res: any) {
  return res.data;
}
