import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-CDW57LCT.js";

// node_modules/@smithy/util-waiter/dist-es/waiter.js
var waiterServiceDefaults = {
  minDelay: 2,
  maxDelay: 120
};
var WaiterState;
(function(WaiterState2) {
  WaiterState2["ABORTED"] = "ABORTED";
  WaiterState2["FAILURE"] = "FAILURE";
  WaiterState2["SUCCESS"] = "SUCCESS";
  WaiterState2["RETRY"] = "RETRY";
  WaiterState2["TIMEOUT"] = "TIMEOUT";
})(WaiterState || (WaiterState = {}));
var checkExceptions = (result) => {
  if (result.state === WaiterState.ABORTED) {
    const abortError = new Error(`${JSON.stringify(__spreadProps(__spreadValues({}, result), {
      reason: "Request was aborted"
    }))}`);
    abortError.name = "AbortError";
    throw abortError;
  } else if (result.state === WaiterState.TIMEOUT) {
    const timeoutError = new Error(`${JSON.stringify(__spreadProps(__spreadValues({}, result), {
      reason: "Waiter has timed out"
    }))}`);
    timeoutError.name = "TimeoutError";
    throw timeoutError;
  } else if (result.state !== WaiterState.SUCCESS) {
    throw new Error(`${JSON.stringify(result)}`);
  }
  return result;
};

// node_modules/@smithy/util-waiter/dist-es/utils/sleep.js
var sleep = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
};

// node_modules/@smithy/util-waiter/dist-es/poller.js
var exponentialBackoffWithJitter = (minDelay, maxDelay, attemptCeiling, attempt) => {
  if (attempt > attemptCeiling)
    return maxDelay;
  const delay = minDelay * 2 ** (attempt - 1);
  return randomInRange(minDelay, delay);
};
var randomInRange = (min, max) => min + Math.random() * (max - min);
var runPolling = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* ({ minDelay, maxDelay, maxWaitTime, abortController, client, abortSignal }, input, acceptorChecks) {
  const { state, reason } = yield acceptorChecks(client, input);
  if (state !== WaiterState.RETRY) {
    return { state, reason };
  }
  let currentAttempt = 1;
  const waitUntil = Date.now() + maxWaitTime * 1e3;
  const attemptCeiling = Math.log(maxDelay / minDelay) / Math.log(2) + 1;
  while (true) {
    if (abortController?.signal?.aborted || abortSignal?.aborted) {
      return { state: WaiterState.ABORTED };
    }
    const delay = exponentialBackoffWithJitter(minDelay, maxDelay, attemptCeiling, currentAttempt);
    if (Date.now() + delay * 1e3 > waitUntil) {
      return { state: WaiterState.TIMEOUT };
    }
    yield sleep(delay);
    const { state: state2, reason: reason2 } = yield acceptorChecks(client, input);
    if (state2 !== WaiterState.RETRY) {
      return { state: state2, reason: reason2 };
    }
    currentAttempt += 1;
  }
});

// node_modules/@smithy/util-waiter/dist-es/utils/validate.js
var validateWaiterOptions = (options) => {
  if (options.maxWaitTime < 1) {
    throw new Error(`WaiterConfiguration.maxWaitTime must be greater than 0`);
  } else if (options.minDelay < 1) {
    throw new Error(`WaiterConfiguration.minDelay must be greater than 0`);
  } else if (options.maxDelay < 1) {
    throw new Error(`WaiterConfiguration.maxDelay must be greater than 0`);
  } else if (options.maxWaitTime <= options.minDelay) {
    throw new Error(`WaiterConfiguration.maxWaitTime [${options.maxWaitTime}] must be greater than WaiterConfiguration.minDelay [${options.minDelay}] for this waiter`);
  } else if (options.maxDelay < options.minDelay) {
    throw new Error(`WaiterConfiguration.maxDelay [${options.maxDelay}] must be greater than WaiterConfiguration.minDelay [${options.minDelay}] for this waiter`);
  }
};

// node_modules/@smithy/util-waiter/dist-es/createWaiter.js
var abortTimeout = (abortSignal) => __async(void 0, null, function* () {
  return new Promise((resolve) => {
    const onAbort = () => resolve({ state: WaiterState.ABORTED });
    if (typeof abortSignal.addEventListener === "function") {
      abortSignal.addEventListener("abort", onAbort);
    } else {
      abortSignal.onabort = onAbort;
    }
  });
});
var createWaiter = (options, input, acceptorChecks) => __async(void 0, null, function* () {
  const params = __spreadValues(__spreadValues({}, waiterServiceDefaults), options);
  validateWaiterOptions(params);
  const exitConditions = [runPolling(params, input, acceptorChecks)];
  if (options.abortController) {
    exitConditions.push(abortTimeout(options.abortController.signal));
  }
  if (options.abortSignal) {
    exitConditions.push(abortTimeout(options.abortSignal));
  }
  return Promise.race(exitConditions);
});

export {
  WaiterState,
  checkExceptions,
  createWaiter
};
//# sourceMappingURL=chunk-2FE76ZDM.js.map
