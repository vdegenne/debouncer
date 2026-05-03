// class DebounceCancelledError extends Error {
// 	constructor() {
// 		super('Debounced call cancelled');
// 	}
// }

export class Debouncer<R = any, Args extends any[] = any[]> {
	#timeout: ReturnType<typeof setTimeout> | undefined;
	#reject: ((reason?: any) => void) | undefined;

	constructor(
		protected callback: (...args: Args) => R | Promise<R>,
		protected timeoutMs = 100,
	) {}

	call(...args: Args): Promise<R> {
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

	cancel() {
		if (this.#timeout !== undefined) {
			clearTimeout(this.#timeout);
			this.#reject?.(new Error('Debounced call cancelled'));
			this.#clear();
		}
	}

	#clear() {
		this.#timeout = undefined;
		this.#reject = undefined;
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
