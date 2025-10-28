export class Debouncer<R = void, Args extends any[] = any[]> {
	#timeout: number | undefined;
	#resolve: ((value: R | PromiseLike<R>) => void) | undefined;

	constructor(
		protected callback: (...args: Args) => R | Promise<R>,
		protected timeoutMs = 100,
	) {}

	call(...args: Args): Promise<R> {
		this.cancel();

		return new Promise<R>((resolve) => {
			this.#resolve = resolve;

			this.#timeout = setTimeout(async () => {
				try {
					const result = await this.callback(...args);
					resolve(result);
				} finally {
					this.#timeout = undefined;
					this.#resolve = undefined;
				}
			}, this.timeoutMs);
		});
	}

	cancel() {
		if (this.#timeout !== undefined) {
			clearTimeout(this.#timeout);
			this.#timeout = undefined;

			if (this.#resolve) {
				this.#resolve(undefined as unknown as R);
				this.#resolve = undefined;
			}
		}
	}
}

const cache = new WeakMap<Function, Debouncer<any, []>>();

export function debounce<R, Args extends []>(
	fn: (...args: Args) => R | Promise<R>,
	delay = 100,
): (...args: Args) => Promise<R> {
	let debouncer = cache.get(fn) as Debouncer<R, Args> | undefined;
	if (!debouncer) {
		debouncer = new Debouncer<R, Args>(fn, delay);
		cache.set(fn, debouncer);
	}

	return (...args: Args) => debouncer!.call(...args);
}
