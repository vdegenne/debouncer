export class Debouncer<Args extends any[] = any[]> {
	#timeout: number | undefined;

	constructor(
		protected callback: (...args: Args) => void,
		protected timeoutMs = 100,
	) {}

	call(...args: Args) {
		this.cancel();
		this.#timeout = setTimeout(() => {
			this.callback(...args);
			this.#timeout = undefined;
		}, this.timeoutMs);
	}

	cancel() {
		if (this.#timeout !== undefined) {
			clearTimeout(this.#timeout);
			this.#timeout = undefined;
		}
	}
}

const cache = new WeakMap<Function, Debouncer>();

export function debounce<Args extends any[] = any[]>(
	fn: (...args: Args) => void,
	delay = 100,
): (...args: Args) => void {
	let debouncer = cache.get(fn) as Debouncer<Args> | undefined;
	if (!debouncer) {
		debouncer = new Debouncer<Args>(fn, delay);
		cache.set(fn, debouncer);
	}

	return (...args: Args) => debouncer!.call(...args);
}
