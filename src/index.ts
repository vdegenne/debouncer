export class Debouncer<R = any, Args extends any[] = any[]> {
	#timeout: ReturnType<typeof setTimeout> | undefined;
	#reject: ((reason?: any) => void) | undefined;

	constructor(
		protected callback: (...args: Args) => R | Promise<R>,
		protected timeoutMs = 100,
		protected options = {
			throwOnCancel: true,
		},
	) {}

	/**
	 * Schedule a debounced execution.
	 * Previous pending calls are cancelled.
	 */
	debounce(...args: Args): Promise<R> {
		this.cancel();

		return new Promise<R>((resolve, reject) => {
			this.#reject = reject;

			this.#timeout = setTimeout(async () => {
				try {
					resolve(await this.callback(...args));
				} catch (error) {
					reject(error);
				} finally {
					this.#clear();
				}
			}, this.timeoutMs);
		});
	}

	/**
	 * Execute immediately.
	 * Cancels any pending debounced execution first.
	 */
	async call(...args: Args): Promise<R> {
		this.cancel();

		return await this.callback(...args);
	}

	cancel() {
		if (this.#timeout !== undefined) {
			clearTimeout(this.#timeout);

			if (this.options.throwOnCancel) {
				this.#reject?.(new Error('Debounced call cancelled'));
			}

			this.#clear();
		}
	}

	#clear() {
		this.#timeout = undefined;
		this.#reject = undefined;
	}
}

const cache = new WeakMap<Function, Debouncer<any, any[]>>();

type DebouncedFunction<R, Args extends any[]> = {
	(...args: Args): Promise<R>;
	debouncer: Debouncer<R, Args>;
};

export function debounce<R, Args extends any[]>(
	fn: (...args: Args) => R | Promise<R>,
	delay = 100,
): DebouncedFunction<R, Args> {
	let debouncer = cache.get(fn) as Debouncer<R, Args> | undefined;

	if (!debouncer) {
		debouncer = new Debouncer<R, Args>(fn, delay);
		cache.set(fn, debouncer);
	}

	const wrapped = (...args: Args) => debouncer!.debounce(...args);

	wrapped.debouncer = debouncer;

	return wrapped;
}
