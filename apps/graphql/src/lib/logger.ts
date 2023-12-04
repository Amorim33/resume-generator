import { Logger, LoggerOptions, pino } from 'pino';
import { env } from './config';

/**
 * Which log level to use?
 * https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels
 *
 * - `trace`: Use this for tracing the execution of the application. This is the
 *   most verbose log level (e.g. "Entering function `foo`", "Setting value of
 *   `bar` to `2`").
 * - `debug`: Use this for debugging purposes. This is the second most verbose log
 *   level (e.g. "Authenticating user", "Sending email", "Token generated with
 *   value `xyz`").
 * - `info`: Use this for general information (e.g. "Server started on port 3000",
 *   "Connected to database").
 * - `warn`: Use this for potentially harmful situations (e.g. "User attempted to
 *   login with invalid password", "No value provided for `bar`", "Token
 *   expired").
 * - `error`: Use this for errors that are not fatal to the application (e.g.
 *   "Could not connect to API", "Could not parse request body").
 * - `fatal`: Use this for errors that are fatal to the application (e.g. "Unable
 *   to start server", "Unable to connect to database").
 */
const createLogger = (name: string, options: LoggerOptions = {}): Logger =>
  pino({
    level: env.LOG_LEVEL,
    transport: { target: 'pino-pretty' },
    name,
    ...options,
  });

export const logger = createLogger('graphql');
