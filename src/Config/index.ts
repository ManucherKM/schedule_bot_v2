enum Commands {
	getRatings = '🎓 Оценки',
	getHelp = '🆘 Помощь',
	getProfile = '💼 Профиль',
	getPair = '📚 Пары',
	getTeacher = '👨‍🏫 Учитель',
	getBell = '⏰ Звонки',
	getCabinets = '🏢 Кабинеты',
	getStatistics = '📊 Статистика',
	generalMailing = '📢 Рассылка',
	start = '/start',
}

enum EDivision {
	SP1 = 'СП-1',
	SP2 = 'СП-2',
	SP3 = 'СП-3',
	SP4 = 'СП-4',
}

enum ERoles {
	admin = 'Администратор',
	teacher = 'Учитель',
	student = 'Студент',
}

enum EStage {
	first = '1',
	second = '2',
	third = '3',
	fourth = '4',
}

export { Commands, EDivision, ERoles, EStage }
