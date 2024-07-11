export const setLocalStorage = (name, data) => {
	return localStorage.setItem(name, JSON.stringify(data))
}

export const getLocalStorage = (name) => {
	return JSON.parse(localStorage.getItem(name))
}

export const removeLocalStorage = (name) => {
	return localStorage.removeItem(name)
}