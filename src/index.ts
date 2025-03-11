export class Debouncer {
	#timeout: number | undefined;

	constructor(
		protected callback: (...args: any[]) => void,
		protected timeoutMs: number,
	) {}

	call(...args: any[]) {
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

export default Debouncer;
