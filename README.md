# @vdegenne/debouncer

```js
import {Debouncer} from '@vdegenne/debouncer';

function boom() {
	/* */
}

const d = new Debouncer(boom, 1000);

d.call();
d.call(); // boom

// d.cancel()
```

If the debouncer function needs parameters, you can pass them through the `call` method.
