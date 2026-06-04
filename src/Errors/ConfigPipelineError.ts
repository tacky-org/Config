export type ConfigPipelineStep = "load" | "validate" | "map";

/**
 * Thrown when any step of the ConfigLoader pipeline fails.
 * Inspect `step` to know where the failure occurred and `cause` for the original error.
 *
 * @example
 * try {
 *   await loader.load();
 * } catch (err) {
 *   if (err instanceof ConfigPipelineError) {
 *     console.error(`Failed at step "${err.step}":`, err.cause);
 *   }
 * }
 */
export class ConfigPipelineError extends Error {
  readonly step: ConfigPipelineStep;

  constructor(step: ConfigPipelineStep, cause: unknown) {
    super(
      `Config pipeline failed at step "${step}": ${cause instanceof Error ? cause.message : String(cause)}`,
      { cause },
    );
    this.name = "ConfigPipelineError";
    this.step = step;
  }
}
