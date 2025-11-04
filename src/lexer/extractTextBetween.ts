const extractTextBetweenERRORS = {
	ENCOUNTERED_ERROR_CHAR: "Encountered error char",
	NO_END_CHAR: "No end char",
} as const
type ExtractTextBetweenErrors = (typeof extractTextBetweenERRORS)[keyof typeof extractTextBetweenERRORS]

export function extractTextBetween(
	text: string,
	start: string | RegExp,
	end: string | RegExp,
	ignore: string[] = [],
	error: string[] = [],
): [length: number, error: boolean | ExtractTextBetweenErrors] {
	if (typeof start === "string") {
		if (!text.startsWith(start)) return [0, true]
	} else {
		const match = text.match(start)
		if (!match || match.index !== 0) return [0, true]
		start = match[0]
	}
	let pos = start.length
	error = [...error]
	error.push("\u0003")
	while (pos < text.length) {
		for (const i of error) {
			if (text.startsWith(i, pos)) return [pos, extractTextBetweenERRORS.ENCOUNTERED_ERROR_CHAR]
		}
		for (const i of ignore) {
			if (text.startsWith(i, pos)) pos += i.length
		}
		if (typeof end === "string") {
			if (text.startsWith(end, pos)) {
				pos += end.length
				break
			}
		} else {
			const match = text.slice(pos).match(end)
			if (match && match.index === 0) {
				pos += match[0].length
				break
			}
		}
		pos++
	}
	if (pos >= text.length) return [pos, extractTextBetweenERRORS.NO_END_CHAR]
	return [pos, false]
}
export default extractTextBetween
