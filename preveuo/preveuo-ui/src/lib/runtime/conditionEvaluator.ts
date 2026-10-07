import { InteractionCondition } from '@/types/demo';

export function evaluateCondition(
  condition: InteractionCondition,
  context: Record<string, unknown>
): boolean {
  const { field, operator, value } = condition;

  // Resolve nested dot path, e.g. "viewer.role"
  const actualValue = field.split('.').reduce<unknown>((obj, key) => {
    if (obj && typeof obj === 'object') {
      return (obj as Record<string, unknown>)[key];
    }
    return undefined;
  }, context);

  switch (operator) {
    case 'equals':
      return actualValue === value;
    case 'notEquals':
      return actualValue !== value;
    case 'contains':
      if (typeof actualValue === 'string' && typeof value === 'string') {
        return actualValue.toLowerCase().includes(value.toLowerCase());
      }
      if (Array.isArray(actualValue)) {
        return actualValue.includes(value);
      }
      return false;
    case 'notContains':
      if (typeof actualValue === 'string' && typeof value === 'string') {
        return !actualValue.toLowerCase().includes(value.toLowerCase());
      }
      if (Array.isArray(actualValue)) {
        return !actualValue.includes(value);
      }
      return true;
    case 'greaterThan':
      return Number(actualValue) > Number(value);
    case 'lessThan':
      return Number(actualValue) < Number(value);
    case 'exists':
      return actualValue !== undefined && actualValue !== null && actualValue !== '';
    case 'notExists':
      return actualValue === undefined || actualValue === null || actualValue === '';
    default:
      return true;
  }
}

export function evaluateAllConditions(
  conditions: InteractionCondition[] | undefined,
  context: Record<string, unknown>
): boolean {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((cond) => evaluateCondition(cond, context));
}
