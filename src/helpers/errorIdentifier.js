export const errorIdentifier = (error) => {
	const status = error.response?.status
	switch (status) {
		case 400:
			console.log(`*--- ОШИБКА ${status}  ---*\n*--- в запросе содержаться ошибки ---*`)
			break
		case 401:
			console.log(`*--- ОШИБКА ${status} ---*\n*--- авторизационная строка сформирована некорректно ---*`)
			break
		case 500:
			console.log(`*--- ОШИБКА ${status} ---*\n*--- отсутствует подключение с сервером ---*`)
			return true
		default:
			console.log(`*--- ОШИБКА ${status} ---*`)
	}
}