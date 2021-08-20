export default function() {
  return {
  app: {
    name: env("APP_NAME", "NODEJS"),
    env: env("APP_ENV", "production"),
    key: env("APP_KEY", "kXWzrAF1HIqUXHmJ8nXKp8OPKz2Y+sleV3mvcF+iufM="),
    debug: env("APP_DEBUG", false),
    url: env("APP_URL", "http://localhost.test"),

    host: env("APP_HOST", "http://localhost.test"),
    port: env("APP_PORT", 80),
    // timezone: env("APP_TIMEZONE", "Nigeria/Lagos"),
  },
  database: {
    uri: env('DB_URI', null),
    host: env("DB_HOST"),
    port: env("DB_PORT"),
    username: env("DB_USERNAME"),
    password: env("DB_PASSWORD"),
    database: env("DB_DATABASE"),
  },
};
}

