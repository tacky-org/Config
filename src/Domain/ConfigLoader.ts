import { ConfigLoaderOptions } from "../Types";

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
      try {
        const raw = await this.options.load();
        const config = this.options.validate(raw);
        return this.options.map
          ? this.options.map(config)
          : (config as unknown as TRuntime);
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          await wait(200 * 2 ** attempt);
        }
      }
    }

    throw lastError;
  }
}
