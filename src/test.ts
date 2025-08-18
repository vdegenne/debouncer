import {debounce, Debouncer} from './index.js';

class Test {
	c = (s: string) => {
		console.log(this, s);
	};
}

const t = new Test();

const d = new Debouncer(t.c, 10);

d.call('yo');
d.call('yo');
d.call('yo');

// debounce(t.c)('yo')
