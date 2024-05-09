const extractTextBetweenERRORS = {
	ENCOUNTERED_ERROR_CHAR: "Encountered error char",
	NO_END_CHAR: "No end char",
} as const
type ExtractTextBetweenErrors = (typeof extractTextBetweenERRORS)[keyof typeof extractTextBetweenERRORS]

export function extractTextBetween(
	index: number,
	text: string,
	start: string,
	end: string,
	ignore: string[] = [],
	error: string[] = [],
): [number, boolean | ExtractTextBetweenErrors] {
	if (!text.startsWith(start, index)) return [0, true]
	let pos = index + start.length
	error = [...error]
	error.push("\u0003")
	while (pos < text.length) {
		for (const i of error) {
			if (text.startsWith(i, pos)) return [pos - index, extractTextBetweenERRORS.ENCOUNTERED_ERROR_CHAR]
		}
		for (const i of ignore) {
			if (text.startsWith(i, pos)) {
				pos += i.length
				continue
			}
		}
		if (text.startsWith(end, pos)) break
		pos++
	}
	if (pos >= text.length) return [pos - index, extractTextBetweenERRORS.NO_END_CHAR]
	return [pos + end.length - index, false]
}
export default extractTextBetween
