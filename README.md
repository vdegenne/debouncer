# @vdegenne/debouncer

## Debouncer main utility class

```ts
import {Debouncer} from '@vdegenne/debouncer';

/* Target function */
function boom(arg: string) {
	// do something
	console.log(arg);
}

/* Definition */
const boomDebouncer = new Debouncer(boom, 1000); // 1s

boomDebouncer.debounce('foo');
boomDebouncer.debounce('bar'); // cancels previous, and prints "bar" after 1s

// d.cancel()
```

Use `boomDebouncer.cancel()` to cancel any previous debounce.  
Use `boomDebouncer.call()` to cancel any previous debounce and call the target function.

## debounce utility function

```ts
import {debounce} from '@vdegenne/debouncer';

function boom(v: string) {
	console.log(v);
}

debounce(boom, 1000)('foo');
debounce(boom, 2000)('bar'); // cancels previous and prints "bar" after 2s
```

_note: Only the function reference is used for distinct debounce, changing the timeout will not create a new debouncer._
