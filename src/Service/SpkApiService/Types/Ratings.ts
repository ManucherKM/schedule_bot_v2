interface IStageList {
	Наименование: string
	Код: string
	Текущий: boolean
}

interface IResponseStageList {
	error: string
	data: IStageList[]
}

interface IResponseKeyPermissions {
	Обучение: boolean
	Библиотека: boolean
	Сообщения: boolean
	Форум: boolean
	Новости: boolean
	ДобавлениеНовостей: boolean
	ЭлектронныеРесурсы: boolean
	СвоиУчебныеГруппы: boolean
	КаталогПользователей: boolean
	Пользователи: boolean
	Преподавание: boolean
}

interface IResponseKeyData {
	session: string
	user: string
	date: number
	permissions: IResponseKeyPermissions
	login: string
	typeSession: string
	notification: string
	eduOrganization: boolean
	clientID: string
	event: null
	passwordHash: string
}

interface IResponseKey {
	error: string
	data: IResponseKeyData
}

interface IResponseRatingsItemRating {
	Оценка: string
	Дата: number
	Явка: boolean
	Опоздание: boolean
	Цвет: string
}

interface IResponseRatingsItem {
	Дисциплина: string
	Оценка: IResponseRatingsItemRating[]
	СреднийБалл: number
}

interface IResponseRatings {
	error: string
	data: IResponseRatingsItem[]
}

export { IResponseStageList, IResponseKey, IResponseRatings }
