export function getBaseUrl() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/$/, "");
  }

  const port = process.env.PORT || 4000;
  return `http://localhost:${port}`;
}

export function getUploadUrl(filename) {
  return `${getBaseUrl()}/uploads/${filename}`;
}
