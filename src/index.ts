export class Debouncer<Args extends any[] = any[]> {
	#timeout: number | undefined;
	#resolve: ((value?: any) => void) | undefined;

	constructor(
		protected callback: (...args: Args) => void | Promise<any>,
		protected timeoutMs = 100,
	) {}

	call(...args: Args): Promise<any> {
		this.cancel();

		return new Promise((resolve) => {
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

			// Reject or resolve the pending promise if needed
			if (this.#resolve) {
				this.#resolve(undefined);
				this.#resolve = undefined;
			}
		}
	}
}

const cache = new WeakMap<Function, Debouncer>();

export function debounce<Args extends any[] = any[]>(
	fn: (...args: Args) => void | Promise<any>,
	delay = 100,
): (...args: Args) => Promise<any> {
	let debouncer = cache.get(fn) as Debouncer<Args> | undefined;
	if (!debouncer) {
		debouncer = new Debouncer<Args>(fn, delay);
		cache.set(fn, debouncer);
	}

	return (...args: Args) => debouncer!.call(...args);
}
