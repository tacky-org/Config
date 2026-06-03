// ─── Zod ──────────────────────────────────────────────────────────────────────

/**
 * Duck-typed Zod schema interface.
 * Matches any library that exposes a `.parse()` method (Zod, Yup via .cast(), etc).
 * Keeps zod out of our dependency tree.
 */
interface ParseableSchema<T> {
  parse: (raw: unknown) => T;
}

/**
 * Creates a validate function from any Zod-compatible schema.
 * The schema's `.parse()` method is called directly — if validation fails
 * the schema throws, which propagates to TanStack as a query error.
 *
 * @example
 * import { z } from 'zod';
 *
 * const AppConfigSchema = z.object({ apiUrl: z.string(), timeout: z.number() });
 *
 * const loader = ConfigLoader.create({
 *   load: fromFetch('/api/config'),
 *   validate: withZod(AppConfigSchema),
 * });
 */
export function withZod<T>(schema: ParseableSchema<T>): (raw: unknown) => T {
  return (raw) => schema.parse(raw);
}

// ─── Yup ─────────────────────────────────────────────────────────────────────

/**
 * Duck-typed Yup schema interface.
 * Uses validateSync so the validate function stays synchronous.
 */
interface YupSchema<T> {
  validateSync: (value: unknown, options?: object) => T;
}

/**
 * Creates a validate function from a Yup schema.
 * Uses `validateSync` — throws a `ValidationError` if the data is invalid.
 *
 * @example
 * import { object, string, number } from 'yup';
 *
 * const AppConfigSchema = object({ apiUrl: string().required(), timeout: number().required() });
 *
 * const loader = ConfigLoader.create({
 *   load: fromFetch('/api/config'),
 *   validate: withYup(AppConfigSchema),
 * });
 */
export function withYup<T>(schema: YupSchema<T>): (raw: unknown) => T {
  return (raw) => schema.validateSync(raw);
}

// ─── Joi ─────────────────────────────────────────────────────────────────────

/**
 * Duck-typed Joi schema interface.
 * Joi's validate() returns { error?, value } rather than throwing directly.
 */
interface JoiSchema<T> {
  validate: (value: unknown, options?: object) => { error?: Error; value: T };
}

/**
 * Creates a validate function from a Joi schema.
 * Checks the returned `error` and throws it so failures surface to TanStack
 * as query errors, consistent with the other adapters.
 *
 * @example
 * import Joi from 'joi';
 *
 * const AppConfigSchema = Joi.object({ apiUrl: Joi.string().uri().required(), timeout: Joi.number().required() });
 *
 * const loader = ConfigLoader.create({
 *   load: fromFetch('/api/config'),
 *   validate: withJoi(AppConfigSchema),
 * });
 */
export function withJoi<T>(schema: JoiSchema<T>): (raw: unknown) => T {
  return (raw) => {
    const { error, value } = schema.validate(raw);
    if (error) throw error;
    return value;
  };
}

// ─── Valibot ──────────────────────────────────────────────────────────────────

/**
 * Duck-typed Valibot-compatible parse function.
 * Valibot's API is parse(schema, data) rather than schema.parse(data),
 * so we accept a bound function instead.
 */
type ValibotParser<T> = (data: unknown) => T;

/**
 * Creates a validate function from a Valibot schema.
 * Pass a pre-bound parse call: `withValibot((data) => v.parse(MySchema, data))`
 *
 * @example
 * import * as v from 'valibot';
 *
 * const AppConfigSchema = v.object({ apiUrl: v.string(), timeout: v.number() });
 *
 * const loader = ConfigLoader.create({
 *   load: fromFetch('/api/config'),
 *   validate: withValibot((data) => v.parse(AppConfigSchema, data)),
 * });
 */
export function withValibot<T>(parser: ValibotParser<T>): (raw: unknown) => T {
  return (raw) => parser(raw);
}
