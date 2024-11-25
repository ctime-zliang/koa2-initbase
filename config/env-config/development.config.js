module.exports = {
	port: 12001,
	host: '127.0.0.1',
	database: {
		mainDB: {
			host: 'localhost',
			port: 3306,
			password: '123456',
			user: 'admin',
			database: 'admins',
			insecureAuth: true,
		},
	},
}
