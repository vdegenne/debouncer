export class Debouncer {
	#timeout: number | undefined;

	constructor(
		protected callback: () => void,
		protected timeoutMs: number,
	) {}

	call() {
		this.cancel();
		this.#timeout = setTimeout(() => {
			this.callback();
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
