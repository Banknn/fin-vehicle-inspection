export const separateNumber = (n) => {
	const separate = n.split(/(\d+)/)
	const num = separate[1]
	const text = separate[2]
	return {
		num,
		text,
	}
}
