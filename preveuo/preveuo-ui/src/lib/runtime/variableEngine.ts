/**
 * Resolves templated variables such as {{viewer.name}} from a context dictionary safely.
 */
export function interpolateVariables(
  text: string,
  variables: Record<string, unknown>
): string {
  if (!text || typeof text !== 'string') return text || '';

  return text.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, path) => {
    const segments = path.split('.');
    let current: unknown = variables;

    for (const key of segments) {
      if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        current = undefined;
        break;
      }
    }

    if (current !== undefined && current !== null) {
      return String(current);
    }
    return `{{${path}}}`;
  });
}
