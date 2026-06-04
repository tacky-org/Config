import { CONFIG_KEY_PREFIX, ConfigLoaderOptions } from "../Types";
import { ConfigPipelineError } from "../Errors/ConfigPipelineError";

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export class ConfigLoader<TConfig, TRuntime = TConfig> {
  private readonly options: ConfigLoaderOptions<TConfig, TRuntime>;

  constructor(options: ConfigLoaderOptions<TConfig, TRuntime>) {
    this.options = options;
  }

  static create<TConfig, TRuntime = TConfig>(
    options: ConfigLoaderOptions<TConfig, TRuntime>,
  ): ConfigLoader<TConfig, TRuntime> {
    return new ConfigLoader(options);
  }

  async load(): Promise<TRuntime> {
    const maxRetries = this.options.retries ?? 0;
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let raw: unknown;

      try {
        raw = await this.options.load();
      } catch (cause) {
        lastError = new ConfigPipelineError("load", cause);
        if (attempt < maxRetries) {
          await wait(200 * 2 ** attempt);
        }
        continue;
      }

      // validate and map are deterministic — do not retry, throw immediately
      let config: TConfig;
      try {
        config = this.options.validate(raw);
      } catch (cause) {
        throw new ConfigPipelineError("validate", cause);
      }

      if (this.options.map) {
        try {
          return this.options.map(config);
        } catch (cause) {
          throw new ConfigPipelineError("map", cause);
        }
      }

      return config as unknown as TRuntime;
    }

    throw lastError;
  }

  /** The TanStack Query key for this loader: `config__<key>`. */
  get queryKey(): readonly [string] {
    return [`${CONFIG_KEY_PREFIX}${this.options.key}`] as const;
  }
}
