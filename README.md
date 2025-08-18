# @vdegenne/debouncer

## Debouncer main utility class

```ts
import {Debouncer} from '@vdegenne/debouncer';

function boom(v: string) {
	/* */
}

const d = new Debouncer(boom, 1000);

d.call('foo');
d.call('bar'); // boom

// d.cancel()
```

## debounce utility function

```ts
import {debounce} from '@vdegenne/debouncer';

function boom(v: string) {
	/* */
}

debounce(boom)('foo');
```
