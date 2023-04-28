export function SupplyReduction(str?: string, number?: number) {
	if (!str || !number) return ''

	let localStr = str.trim()

	if (localStr.length < number) return localStr

	const res = localStr.substring(0, number) + '...'

	return res
}
