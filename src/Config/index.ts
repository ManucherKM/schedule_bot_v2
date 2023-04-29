enum Commands {
	getRatings = '🎓 Оценки',
	getHelp = '🆘 Помощь',
	getProfile = '💼 Профиль',
	getPair = '📚 Пары',
	getTeacher = '🚪 Учитель',
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

const Bells = [
	{
		start: '8:30',
		end: '9:50',
	},
	{
		start: '10:00',
		end: '11:50',
	},
	{
		start: '12:00',
		end: '13:20',
	},
	{
		start: '13:30',
		end: '14:50',
	},
	{
		start: '15:00',
		end: '16:20',
	},
	{
		start: '16:30',
		end: '17:50',
	},
	{
		start: '18:00',
		end: '19:20',
	},
	{
		start: '19:30',
		end: '20:50',
	},
]

export { Commands, EDivision, ERoles, EStage, Bells }
