import { TableUserConfig, table } from 'table'

export function CreateTable(data: unknown[][], config?: TableUserConfig) {
	const defaultConfig = {
		border: {
			topBody: `-`,
			topJoin: `+`,
			topLeft: `+`,
			topRight: `+`,

			bottomBody: `-`,
			bottomJoin: `+`,
			bottomLeft: `+`,
			bottomRight: `+`,

			bodyLeft: `|`,
			bodyRight: `|`,
			bodyJoin: `|`,

			joinBody: `-`,
			joinLeft: `+`,
			joinRight: `+`,
			joinJoin: `+`,
		},
	}

	return table(data, config || defaultConfig)
}
