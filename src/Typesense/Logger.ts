/**
 * Represents the log levels that can be used in the logger with their corresponding number values.
 */
type LogLevelMap = {
  Trace: "trace" | 0;
  Debug: "debug" | 1;
  Info: "info" | 2;
  Warn: "warn" | 3;
  Error: "error" | 4;
  Silent: "silent" | 5;
};

/**
 * Represents mapping of the number values of the log levels.
 */
type LogLevelNumberValuesMap = {
  [K in keyof LogLevelMap]: LogLevelMap[K] extends infer R
    ? R extends number
      ? R
      : never
    : never;
};

/**
 * Numeric representation of the possible log levels.
 */
type LogLevelNumberValues =
  LogLevelNumberValuesMap[keyof LogLevelNumberValuesMap];

/**
 * Represents the mapping of the string values to the number values of the log levels.
 */
type StringToNumberRepresentationLogLevelMap = {
  [K in keyof LogLevelMap as LogLevelMap[K] extends infer R
    ? R extends string
      ? R
      : never
    : never]: LogLevelMap[K] extends infer R
    ? R extends number
      ? R
      : never
    : never;
};

/**
 * Object that maps the log levels to their corresponding number values.
 * Used for always mapping the log level to number for comparison's sake.
 */
const LogLevelReverseMap = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  silent: 5,
} as const satisfies StringToNumberRepresentationLogLevelMap;

/**
 * Represents the log levels that can be used in the logger.
 */
type LogLevel = LogLevelMap[keyof LogLevelMap];

/**
 * Object that maps the log levels to their corresponding number values.
 */
const LogLevelNumber = {
  Trace: 0,
  Debug: 1,
  Info: 2,
  Warn: 3,
  Error: 4,
  Silent: 5,
} as const satisfies { [K in keyof LogLevelMap]: LogLevelMap[K] };

/**
 * Object that maps the log levels to their corresponding string values.
 */
const LogLevelNames = {
  Trace: "trace",
  Debug: "debug",
  Info: "info",
  Warn: "warn",
  Error: "error",
  Silent: "silent",
} as const satisfies { [K in keyof LogLevelMap]: LogLevelMap[K] };

/**
 * Object that maps the the console methods to the log levels.
 */
const logLevelToConsoleFunction = {
  Trace: (...args: any[]) => console.trace(...args),
  Debug: (...args: any[]) => console.debug(...args),
  Info: (...args: any[]) => console.info(...args),
  Warn: (...args: any[]) => console.warn(...args),
  Error: (...args: any[]) => console.error(...args),
  Silent: () => {},
} as const satisfies { [K in keyof LogLevelMap]: (message: string) => void };

/**
 * A simple logging class using a singleton pattern.
 * Only prints to stdout.
 */
class SimpleLogger {
  private static instance: SimpleLogger;
  /**
   * Numeric representation of the log level set.
   * Defaults to LogLevelNumber.Warn.
   * @private
   * @type {LogLevelNumberValues}
   */
  private logLevel: LogLevelNumberValues = LogLevelNumber.Warn;

  /**
   * Private constructor to prevent instantiation.
   * @private
   */
  private constructor() {}

  /**
   * Get the singleton instance of the SimpleLogger.
   * @returns {SimpleLogger} The singleton instance of the SimpleLogger.
   */
  static getInstance(): SimpleLogger {
    if (!SimpleLogger.instance) {
      SimpleLogger.instance = new SimpleLogger();
    }
    return SimpleLogger.instance;
  }

  /**
   * Formats the message to be logged.
   * @private
   * @param level The log level to be used.
   * @param message The message to be logged.
   * @returns The formatted message.
   */
  private formatMessage(
    level: keyof typeof LogLevelNames,
    message: string,
  ): string {
    return `[${level}] ${message}`;
  }

  /**
   * Logs the message with the appropriate console function
   * @param level The log level to be used.
   * @param message The message to be logged.
   */
  private logWith(level: keyof typeof LogLevelNames, message: string): void {
    const consoleFunction = this.mapLogLevelToConsoleFunction(level);
    consoleFunction(this.formatMessage(level, message));
  }

  /**
   * Maps the log level to the appropriate console function.
   * @param level The log level to be used.
   * @returns The console function to be used for the log level.
   */
  private mapLogLevelToConsoleFunction(
    level: keyof typeof LogLevelNames,
  ): (message: string, ...args: any[]) => void {
    return logLevelToConsoleFunction[level];
  }

  /**
   * Uses the `console.debug` method to log the message if the log level is set to debug or lower.
   * @param message The message to be logged.
   */
  debug(message: string): void {
    if (this.logLevel <= LogLevelNumber.Debug) {
      this.logWith("Debug", message);
    }
  }

  /**
   * Uses the `console.warn` method to log the message if the log level is set to warn or lower.
   * @param message The message to be logged.
   */
  warn(message: string): void {
    if (this.logLevel <= LogLevelNumber.Warn) {
      this.logWith("Warn", message);
    }
  }

  /**
   * Uses the `console.error` method to log the message if the log level is set to error or lower.
   * @param message The message to be logged.
   */
  error(message: string): void {
    if (this.logLevel <= LogLevelNumber.Error) {
      this.logWith("Error", message);
    }
  }

  /**
   * Uses the `console.trace` method to log the message if the log level is set to trace or lower.
   * @param message The message to be logged.
   */
  trace(message: string): void {
    if (this.logLevel <= LogLevelNumber.Trace) {
      this.logWith("Trace", message);
    }
  }

  /**
   * Uses the `console.info` method to log the message if the log level is set to info or lower.
   * @param message The message to be logged.
   */
  info(message: string): void {
    if (this.logLevel <= LogLevelNumber.Info) {
      this.logWith("Info", message);
    }
  }

  /**
   * Sets the log level to the specified level as a numeric representation of it, if given a string.
   * @param level The log level to be set.
   */
  setLogLevel(level: LogLevel): void {
    if (typeof level === "number") {
      this.logLevel = level;
    } else {
      this.logLevel = LogLevelReverseMap[level];
    }
  }
}

export const logger = SimpleLogger.getInstance();
export type { LogLevel };
