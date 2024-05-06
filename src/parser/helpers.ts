

export function getDefault(value: number, def: number, check:number = -1): number {
	if (value === check) {
		return def;
	}
	return value;
}


