import { Transform } from 'class-transformer';

/**
 * Transforms string query parameter to boolean
 * Handles: 'true' -> true, 'false' -> false, undefined/null -> undefined
 */
export function TransformBoolean() {
  return Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  });
}

