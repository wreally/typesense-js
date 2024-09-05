// logger.spec.js
import chai, { expect } from "chai";
import { logger } from "../../src/Typesense/Logger";

import spies from "chai-spies";
import { beforeEach, afterEach, describe, it } from "mocha";

chai.use(spies);

describe("SimpleLogger", function () {
  let messages = [];
  let warnSpy, debugSpy, errorSpy, infoSpy, traceSpy;

  const spyImplementation = (msg) => {
    messages.push(msg);
  };

  beforeEach(function () {
    warnSpy = chai.spy.on(console, "warn", spyImplementation);
    debugSpy = chai.spy.on(console, "debug", spyImplementation);
    infoSpy = chai.spy.on(console, "info", spyImplementation);
    errorSpy = chai.spy.on(console, "error", spyImplementation);
    traceSpy = chai.spy.on(console, "trace", spyImplementation);
  });

  afterEach(function () {
    chai.spy.restore(console);
    messages.length = 0;
  });

  it("should use warn as a default log level", function () {
    // Assert
    expect(logger.logLevel).to.equal(3); // Warn level
  });

  it("should set log level correctly", function () {
    // Act
    logger.setLogLevel("debug");

    // Assert
    expect(logger.logLevel).to.equal(1); // Debug level

    // Act
    logger.setLogLevel(4);

    // Assert
    expect(logger.logLevel).to.equal(4); // Error level
  });

  it("should log everything in trace level", function () {
    // Arrange
    logger.setLogLevel("trace");

    // Act
    logger.trace("trace message");
    logger.info("info message");
    logger.warn("warn message");
    logger.debug("debug message");
    logger.error("error message");

    // Assert
    expect(messages).to.have.lengthOf(5);
    expect(warnSpy).to.have.been.called.once;
    expect(errorSpy).to.have.been.called.once;
    expect(traceSpy).to.have.been.called.once;
    expect(infoSpy).to.have.been.called.once;
    expect(debugSpy).to.have.been.called.once;
  });

  it("should log messages based on log level", function () {
    // Arrange
    logger.setLogLevel("warn");

    // Act
    logger.trace("trace message");
    logger.debug("debug message");
    logger.info("info message");
    logger.warn("warn message");
    logger.error("error message");

    // Assert
    expect(messages).to.have.lengthOf(2);

    expect(warnSpy).to.have.been.called.once;
    expect(errorSpy).to.have.been.called.once;
    expect(debugSpy).to.not.have.been.called();
    expect(infoSpy).to.not.have.been.called();
    expect(traceSpy).to.not.have.been.called();
  });
});
