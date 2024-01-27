export const env = {
    facebookApi: {
        clientId: process.env.FACEBOOK_CLIENT_ID || 'FACEBOOK_CLIENT_ID',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'FACEBOOK_CLIENT_SECRET',
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'postgres',
    },
    appPort: process.env.PORT || 3333,
    jwtSecret: process.env.JWT_SECRET || 'JWT_SECRET'
}