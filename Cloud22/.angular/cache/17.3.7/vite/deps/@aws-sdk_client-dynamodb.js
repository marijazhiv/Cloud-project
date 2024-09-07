import {
  AwsSdkSigV4Signer,
  Client,
  Command,
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_RETRY_MODE,
  DEFAULT_USE_DUALSTACK_ENDPOINT,
  DEFAULT_USE_FIPS_ENDPOINT,
  DefaultIdentityProviderConfig,
  FetchHttpHandler,
  HttpRequest,
  NoOpLogger,
  ServiceException,
  Sha256,
  WaiterState,
  _json,
  awsEndpointFunctions,
  awsExpectUnion,
  calculateBodyLength,
  checkExceptions,
  collectBody,
  createAggregatedClient,
  createPaginator,
  createWaiter,
  customEndpointFunctions,
  decorateServiceException,
  defaultUserAgent,
  expectBoolean,
  expectInt32,
  expectLong,
  expectNonNull,
  expectNumber,
  expectString,
  fromBase64,
  fromUtf8,
  getAwsRegionExtensionConfiguration,
  getContentLengthPlugin,
  getDefaultExtensionConfiguration,
  getEndpointPlugin,
  getHostHeaderPlugin,
  getHttpAuthSchemeEndpointRuleSetPlugin,
  getHttpHandlerExtensionConfiguration,
  getHttpSigningPlugin,
  getLoggerPlugin,
  getRecursionDetectionPlugin,
  getRetryPlugin,
  getSerdePlugin,
  getSmithyContext,
  getUserAgentPlugin,
  invalidProvider,
  limitedParseDouble,
  loadConfigsForDefaultMode,
  loadRestJsonErrorCode,
  normalizeProvider,
  parseEpochTimestamp,
  parseJsonBody,
  parseJsonErrorBody,
  parseUrl,
  resolveAwsRegionExtensionConfiguration,
  resolveAwsSdkSigV4Config,
  resolveDefaultRuntimeConfig,
  resolveDefaultsModeConfig,
  resolveEndpoint,
  resolveEndpointConfig,
  resolveHostHeaderConfig,
  resolveHttpHandlerRuntimeConfig,
  resolveRegionConfig,
  resolveRetryConfig,
  resolveUserAgentConfig,
  serializeFloat,
  streamCollector,
  take,
  toBase64,
  toUtf8,
  withBaseException
} from "./chunk-ERNNZMPU.js";
import "./chunk-7VQPY5UX.js";
import {
  __async,
  __commonJS,
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-CDW57LCT.js";

// node_modules/obliterator/iterator.js
var require_iterator = __commonJS({
  "node_modules/obliterator/iterator.js"(exports, module) {
    function Iterator(next) {
      Object.defineProperty(this, "_next", {
        writable: false,
        enumerable: false,
        value: next
      });
      this.done = false;
    }
    Iterator.prototype.next = function() {
      if (this.done)
        return { done: true };
      var step = this._next();
      if (step.done)
        this.done = true;
      return step;
    };
    if (typeof Symbol !== "undefined")
      Iterator.prototype[Symbol.iterator] = function() {
        return this;
      };
    Iterator.of = function() {
      var args = arguments, l2 = args.length, i2 = 0;
      return new Iterator(function() {
        if (i2 >= l2)
          return { done: true };
        return { done: false, value: args[i2++] };
      });
    };
    Iterator.empty = function() {
      var iterator = new Iterator(null);
      iterator.done = true;
      return iterator;
    };
    Iterator.is = function(value) {
      if (value instanceof Iterator)
        return true;
      return typeof value === "object" && value !== null && typeof value.next === "function";
    };
    module.exports = Iterator;
  }
});

// node_modules/obliterator/foreach.js
var require_foreach = __commonJS({
  "node_modules/obliterator/foreach.js"(exports, module) {
    var ARRAY_BUFFER_SUPPORT = typeof ArrayBuffer !== "undefined";
    var SYMBOL_SUPPORT = typeof Symbol !== "undefined";
    function forEach(iterable, callback) {
      var iterator, k2, i2, l2, s2;
      if (!iterable)
        throw new Error("obliterator/forEach: invalid iterable.");
      if (typeof callback !== "function")
        throw new Error("obliterator/forEach: expecting a callback.");
      if (Array.isArray(iterable) || ARRAY_BUFFER_SUPPORT && ArrayBuffer.isView(iterable) || typeof iterable === "string" || iterable.toString() === "[object Arguments]") {
        for (i2 = 0, l2 = iterable.length; i2 < l2; i2++)
          callback(iterable[i2], i2);
        return;
      }
      if (typeof iterable.forEach === "function") {
        iterable.forEach(callback);
        return;
      }
      if (SYMBOL_SUPPORT && Symbol.iterator in iterable && typeof iterable.next !== "function") {
        iterable = iterable[Symbol.iterator]();
      }
      if (typeof iterable.next === "function") {
        iterator = iterable;
        i2 = 0;
        while (s2 = iterator.next(), s2.done !== true) {
          callback(s2.value, i2);
          i2++;
        }
        return;
      }
      for (k2 in iterable) {
        if (iterable.hasOwnProperty(k2)) {
          callback(iterable[k2], k2);
        }
      }
      return;
    }
    forEach.forEachWithNullKeys = function(iterable, callback) {
      var iterator, k2, i2, l2, s2;
      if (!iterable)
        throw new Error("obliterator/forEachWithNullKeys: invalid iterable.");
      if (typeof callback !== "function")
        throw new Error("obliterator/forEachWithNullKeys: expecting a callback.");
      if (Array.isArray(iterable) || ARRAY_BUFFER_SUPPORT && ArrayBuffer.isView(iterable) || typeof iterable === "string" || iterable.toString() === "[object Arguments]") {
        for (i2 = 0, l2 = iterable.length; i2 < l2; i2++)
          callback(iterable[i2], null);
        return;
      }
      if (iterable instanceof Set) {
        iterable.forEach(function(value) {
          callback(value, null);
        });
        return;
      }
      if (typeof iterable.forEach === "function") {
        iterable.forEach(callback);
        return;
      }
      if (SYMBOL_SUPPORT && Symbol.iterator in iterable && typeof iterable.next !== "function") {
        iterable = iterable[Symbol.iterator]();
      }
      if (typeof iterable.next === "function") {
        iterator = iterable;
        i2 = 0;
        while (s2 = iterator.next(), s2.done !== true) {
          callback(s2.value, null);
          i2++;
        }
        return;
      }
      for (k2 in iterable) {
        if (iterable.hasOwnProperty(k2)) {
          callback(iterable[k2], k2);
        }
      }
      return;
    };
    module.exports = forEach;
  }
});

// node_modules/mnemonist/utils/typed-arrays.js
var require_typed_arrays = __commonJS({
  "node_modules/mnemonist/utils/typed-arrays.js"(exports) {
    var MAX_8BIT_INTEGER = Math.pow(2, 8) - 1;
    var MAX_16BIT_INTEGER = Math.pow(2, 16) - 1;
    var MAX_32BIT_INTEGER = Math.pow(2, 32) - 1;
    var MAX_SIGNED_8BIT_INTEGER = Math.pow(2, 7) - 1;
    var MAX_SIGNED_16BIT_INTEGER = Math.pow(2, 15) - 1;
    var MAX_SIGNED_32BIT_INTEGER = Math.pow(2, 31) - 1;
    exports.getPointerArray = function(size) {
      var maxIndex = size - 1;
      if (maxIndex <= MAX_8BIT_INTEGER)
        return Uint8Array;
      if (maxIndex <= MAX_16BIT_INTEGER)
        return Uint16Array;
      if (maxIndex <= MAX_32BIT_INTEGER)
        return Uint32Array;
      return Float64Array;
    };
    exports.getSignedPointerArray = function(size) {
      var maxIndex = size - 1;
      if (maxIndex <= MAX_SIGNED_8BIT_INTEGER)
        return Int8Array;
      if (maxIndex <= MAX_SIGNED_16BIT_INTEGER)
        return Int16Array;
      if (maxIndex <= MAX_SIGNED_32BIT_INTEGER)
        return Int32Array;
      return Float64Array;
    };
    exports.getNumberType = function(value) {
      if (value === (value | 0)) {
        if (Math.sign(value) === -1) {
          if (value <= 127 && value >= -128)
            return Int8Array;
          if (value <= 32767 && value >= -32768)
            return Int16Array;
          return Int32Array;
        } else {
          if (value <= 255)
            return Uint8Array;
          if (value <= 65535)
            return Uint16Array;
          return Uint32Array;
        }
      }
      return Float64Array;
    };
    var TYPE_PRIORITY = {
      Uint8Array: 1,
      Int8Array: 2,
      Uint16Array: 3,
      Int16Array: 4,
      Uint32Array: 5,
      Int32Array: 6,
      Float32Array: 7,
      Float64Array: 8
    };
    exports.getMinimalRepresentation = function(array, getter) {
      var maxType = null, maxPriority = 0, p2, t2, v2, i2, l2;
      for (i2 = 0, l2 = array.length; i2 < l2; i2++) {
        v2 = getter ? getter(array[i2]) : array[i2];
        t2 = exports.getNumberType(v2);
        p2 = TYPE_PRIORITY[t2.name];
        if (p2 > maxPriority) {
          maxPriority = p2;
          maxType = t2;
        }
      }
      return maxType;
    };
    exports.isTypedArray = function(value) {
      return typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(value);
    };
    exports.concat = function() {
      var length = 0, i2, o2, l2;
      for (i2 = 0, l2 = arguments.length; i2 < l2; i2++)
        length += arguments[i2].length;
      var array = new arguments[0].constructor(length);
      for (i2 = 0, o2 = 0; i2 < l2; i2++) {
        array.set(arguments[i2], o2);
        o2 += arguments[i2].length;
      }
      return array;
    };
    exports.indices = function(length) {
      var PointerArray = exports.getPointerArray(length);
      var array = new PointerArray(length);
      for (var i2 = 0; i2 < length; i2++)
        array[i2] = i2;
      return array;
    };
  }
});

// node_modules/mnemonist/utils/iterables.js
var require_iterables = __commonJS({
  "node_modules/mnemonist/utils/iterables.js"(exports) {
    var forEach = require_foreach();
    var typed = require_typed_arrays();
    function isArrayLike(target) {
      return Array.isArray(target) || typed.isTypedArray(target);
    }
    function guessLength(target) {
      if (typeof target.length === "number")
        return target.length;
      if (typeof target.size === "number")
        return target.size;
      return;
    }
    function toArray(target) {
      var l2 = guessLength(target);
      var array = typeof l2 === "number" ? new Array(l2) : [];
      var i2 = 0;
      forEach(target, function(value) {
        array[i2++] = value;
      });
      return array;
    }
    function toArrayWithIndices(target) {
      var l2 = guessLength(target);
      var IndexArray = typeof l2 === "number" ? typed.getPointerArray(l2) : Array;
      var array = typeof l2 === "number" ? new Array(l2) : [];
      var indices = typeof l2 === "number" ? new IndexArray(l2) : [];
      var i2 = 0;
      forEach(target, function(value) {
        array[i2] = value;
        indices[i2] = i2++;
      });
      return [array, indices];
    }
    exports.isArrayLike = isArrayLike;
    exports.guessLength = guessLength;
    exports.toArray = toArray;
    exports.toArrayWithIndices = toArrayWithIndices;
  }
});

// node_modules/mnemonist/lru-cache.js
var require_lru_cache = __commonJS({
  "node_modules/mnemonist/lru-cache.js"(exports, module) {
    var Iterator = require_iterator();
    var forEach = require_foreach();
    var typed = require_typed_arrays();
    var iterables = require_iterables();
    function LRUCache2(Keys, Values, capacity) {
      if (arguments.length < 2) {
        capacity = Keys;
        Keys = null;
        Values = null;
      }
      this.capacity = capacity;
      if (typeof this.capacity !== "number" || this.capacity <= 0)
        throw new Error("mnemonist/lru-cache: capacity should be positive number.");
      var PointerArray = typed.getPointerArray(capacity);
      this.forward = new PointerArray(capacity);
      this.backward = new PointerArray(capacity);
      this.K = typeof Keys === "function" ? new Keys(capacity) : new Array(capacity);
      this.V = typeof Values === "function" ? new Values(capacity) : new Array(capacity);
      this.size = 0;
      this.head = 0;
      this.tail = 0;
      this.items = {};
    }
    LRUCache2.prototype.clear = function() {
      this.size = 0;
      this.head = 0;
      this.tail = 0;
      this.items = {};
    };
    LRUCache2.prototype.splayOnTop = function(pointer) {
      var oldHead = this.head;
      if (this.head === pointer)
        return this;
      var previous = this.backward[pointer], next = this.forward[pointer];
      if (this.tail === pointer) {
        this.tail = previous;
      } else {
        this.backward[next] = previous;
      }
      this.forward[previous] = next;
      this.backward[oldHead] = pointer;
      this.head = pointer;
      this.forward[pointer] = oldHead;
      return this;
    };
    LRUCache2.prototype.set = function(key, value) {
      var pointer = this.items[key];
      if (typeof pointer !== "undefined") {
        this.splayOnTop(pointer);
        this.V[pointer] = value;
        return;
      }
      if (this.size < this.capacity) {
        pointer = this.size++;
      } else {
        pointer = this.tail;
        this.tail = this.backward[pointer];
        delete this.items[this.K[pointer]];
      }
      this.items[key] = pointer;
      this.K[pointer] = key;
      this.V[pointer] = value;
      this.forward[pointer] = this.head;
      this.backward[this.head] = pointer;
      this.head = pointer;
    };
    LRUCache2.prototype.setpop = function(key, value) {
      var oldValue = null;
      var oldKey = null;
      var pointer = this.items[key];
      if (typeof pointer !== "undefined") {
        this.splayOnTop(pointer);
        oldValue = this.V[pointer];
        this.V[pointer] = value;
        return { evicted: false, key, value: oldValue };
      }
      if (this.size < this.capacity) {
        pointer = this.size++;
      } else {
        pointer = this.tail;
        this.tail = this.backward[pointer];
        oldValue = this.V[pointer];
        oldKey = this.K[pointer];
        delete this.items[this.K[pointer]];
      }
      this.items[key] = pointer;
      this.K[pointer] = key;
      this.V[pointer] = value;
      this.forward[pointer] = this.head;
      this.backward[this.head] = pointer;
      this.head = pointer;
      if (oldKey) {
        return { evicted: true, key: oldKey, value: oldValue };
      } else {
        return null;
      }
    };
    LRUCache2.prototype.has = function(key) {
      return key in this.items;
    };
    LRUCache2.prototype.get = function(key) {
      var pointer = this.items[key];
      if (typeof pointer === "undefined")
        return;
      this.splayOnTop(pointer);
      return this.V[pointer];
    };
    LRUCache2.prototype.peek = function(key) {
      var pointer = this.items[key];
      if (typeof pointer === "undefined")
        return;
      return this.V[pointer];
    };
    LRUCache2.prototype.forEach = function(callback, scope) {
      scope = arguments.length > 1 ? scope : this;
      var i2 = 0, l2 = this.size;
      var pointer = this.head, keys = this.K, values = this.V, forward = this.forward;
      while (i2 < l2) {
        callback.call(scope, values[pointer], keys[pointer], this);
        pointer = forward[pointer];
        i2++;
      }
    };
    LRUCache2.prototype.keys = function() {
      var i2 = 0, l2 = this.size;
      var pointer = this.head, keys = this.K, forward = this.forward;
      return new Iterator(function() {
        if (i2 >= l2)
          return { done: true };
        var key = keys[pointer];
        i2++;
        if (i2 < l2)
          pointer = forward[pointer];
        return {
          done: false,
          value: key
        };
      });
    };
    LRUCache2.prototype.values = function() {
      var i2 = 0, l2 = this.size;
      var pointer = this.head, values = this.V, forward = this.forward;
      return new Iterator(function() {
        if (i2 >= l2)
          return { done: true };
        var value = values[pointer];
        i2++;
        if (i2 < l2)
          pointer = forward[pointer];
        return {
          done: false,
          value
        };
      });
    };
    LRUCache2.prototype.entries = function() {
      var i2 = 0, l2 = this.size;
      var pointer = this.head, keys = this.K, values = this.V, forward = this.forward;
      return new Iterator(function() {
        if (i2 >= l2)
          return { done: true };
        var key = keys[pointer], value = values[pointer];
        i2++;
        if (i2 < l2)
          pointer = forward[pointer];
        return {
          done: false,
          value: [key, value]
        };
      });
    };
    if (typeof Symbol !== "undefined")
      LRUCache2.prototype[Symbol.iterator] = LRUCache2.prototype.entries;
    LRUCache2.prototype.inspect = function() {
      var proxy = /* @__PURE__ */ new Map();
      var iterator = this.entries(), step;
      while (step = iterator.next(), !step.done)
        proxy.set(step.value[0], step.value[1]);
      Object.defineProperty(proxy, "constructor", {
        value: LRUCache2,
        enumerable: false
      });
      return proxy;
    };
    if (typeof Symbol !== "undefined")
      LRUCache2.prototype[Symbol.for("nodejs.util.inspect.custom")] = LRUCache2.prototype.inspect;
    LRUCache2.from = function(iterable, Keys, Values, capacity) {
      if (arguments.length < 2) {
        capacity = iterables.guessLength(iterable);
        if (typeof capacity !== "number")
          throw new Error("mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.");
      } else if (arguments.length === 2) {
        capacity = Keys;
        Keys = null;
        Values = null;
      }
      var cache = new LRUCache2(Keys, Values, capacity);
      forEach(iterable, function(value, key) {
        cache.set(key, value);
      });
      return cache;
    };
    module.exports = LRUCache2;
  }
});

// node_modules/@aws-sdk/endpoint-cache/dist-es/EndpointCache.js
var import_lru_cache = __toESM(require_lru_cache());
var EndpointCache = class {
  constructor(capacity) {
    this.cache = new import_lru_cache.default(capacity);
  }
  getEndpoint(key) {
    const endpointsWithExpiry = this.get(key);
    if (!endpointsWithExpiry || endpointsWithExpiry.length === 0) {
      return void 0;
    }
    const endpoints = endpointsWithExpiry.map((endpoint) => endpoint.Address);
    return endpoints[Math.floor(Math.random() * endpoints.length)];
  }
  get(key) {
    if (!this.has(key)) {
      return;
    }
    const value = this.cache.get(key);
    if (!value) {
      return;
    }
    const now = Date.now();
    const endpointsWithExpiry = value.filter((endpoint) => now < endpoint.Expires);
    if (endpointsWithExpiry.length === 0) {
      this.delete(key);
      return void 0;
    }
    return endpointsWithExpiry;
  }
  set(key, endpoints) {
    const now = Date.now();
    this.cache.set(key, endpoints.map(({ Address, CachePeriodInMinutes }) => ({
      Address,
      Expires: now + CachePeriodInMinutes * 60 * 1e3
    })));
  }
  delete(key) {
    this.cache.set(key, []);
  }
  has(key) {
    if (!this.cache.has(key)) {
      return false;
    }
    const endpoints = this.cache.peek(key);
    if (!endpoints) {
      return false;
    }
    return endpoints.length > 0;
  }
  clear() {
    this.cache.clear();
  }
};

// node_modules/@aws-sdk/middleware-endpoint-discovery/dist-es/resolveEndpointDiscoveryConfig.js
var resolveEndpointDiscoveryConfig = (input, { endpointDiscoveryCommandCtor }) => __spreadProps(__spreadValues({}, input), {
  endpointDiscoveryCommandCtor,
  endpointCache: new EndpointCache(input.endpointCacheSize ?? 1e3),
  endpointDiscoveryEnabled: input.endpointDiscoveryEnabled !== void 0 ? () => Promise.resolve(input.endpointDiscoveryEnabled) : input.endpointDiscoveryEnabledProvider,
  isClientEndpointDiscoveryEnabled: input.endpointDiscoveryEnabled !== void 0
});

// node_modules/@aws-sdk/client-dynamodb/dist-es/auth/httpAuthSchemeProvider.js
var defaultDynamoDBHttpAuthSchemeParametersProvider = (config, context, input) => __async(void 0, null, function* () {
  return {
    operation: getSmithyContext(context).operation,
    region: (yield normalizeProvider(config.region)()) || (() => {
      throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
});
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "dynamodb",
      region: authParameters.region
    },
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
        context
      }
    })
  };
}
var defaultDynamoDBHttpAuthSchemeProvider = (authParameters) => {
  const options = [];
  switch (authParameters.operation) {
    default: {
      options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
    }
  }
  return options;
};
var resolveHttpAuthSchemeConfig = (config) => {
  const config_0 = resolveAwsSdkSigV4Config(config);
  return __spreadValues({}, config_0);
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters = (options) => {
  return __spreadProps(__spreadValues({}, options), {
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "dynamodb"
  });
};
var commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (let i2 = 0; i2 < 256; ++i2) {
  byteToHex.push((i2 + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/parse.js
function parse(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v2;
  const arr = new Uint8Array(16);
  arr[0] = (v2 = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v2 >>> 16 & 255;
  arr[2] = v2 >>> 8 & 255;
  arr[3] = v2 & 255;
  arr[4] = (v2 = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v2 & 255;
  arr[6] = (v2 = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v2 & 255;
  arr[8] = (v2 = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v2 & 255;
  arr[10] = (v2 = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
  arr[11] = v2 / 4294967296 & 255;
  arr[12] = v2 >>> 24 & 255;
  arr[13] = v2 >>> 16 & 255;
  arr[14] = v2 >>> 8 & 255;
  arr[15] = v2 & 255;
  return arr;
}
var parse_default = parse;

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/v35.js
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str));
  const bytes = [];
  for (let i2 = 0; i2 < str.length; ++i2) {
    bytes.push(str.charCodeAt(i2));
  }
  return bytes;
}
var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;
    if (typeof value === "string") {
      value = stringToBytes(value);
    }
    if (typeof namespace === "string") {
      namespace = parse_default(namespace);
    }
    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    }
    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 15 | version;
    bytes[8] = bytes[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i2 = 0; i2 < 16; ++i2) {
        buf[offset + i2] = bytes[i2];
      }
      return buf;
    }
    return unsafeStringify(bytes);
  }
  try {
    generateUUID.name = name;
  } catch (err) {
  }
  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/md5.js
function md5(bytes) {
  if (typeof bytes === "string") {
    const msg = unescape(encodeURIComponent(bytes));
    bytes = new Uint8Array(msg.length);
    for (let i2 = 0; i2 < msg.length; ++i2) {
      bytes[i2] = msg.charCodeAt(i2);
    }
  }
  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = "0123456789abcdef";
  for (let i2 = 0; i2 < length32; i2 += 8) {
    const x2 = input[i2 >> 5] >>> i2 % 32 & 255;
    const hex = parseInt(hexTab.charAt(x2 >>> 4 & 15) + hexTab.charAt(x2 & 15), 16);
    output.push(hex);
  }
  return output;
}
function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
function wordsToMd5(x2, len) {
  x2[len >> 5] |= 128 << len % 32;
  x2[getOutputLength(len) - 1] = len;
  let a2 = 1732584193;
  let b2 = -271733879;
  let c2 = -1732584194;
  let d2 = 271733878;
  for (let i2 = 0; i2 < x2.length; i2 += 16) {
    const olda = a2;
    const oldb = b2;
    const oldc = c2;
    const oldd = d2;
    a2 = md5ff(a2, b2, c2, d2, x2[i2], 7, -680876936);
    d2 = md5ff(d2, a2, b2, c2, x2[i2 + 1], 12, -389564586);
    c2 = md5ff(c2, d2, a2, b2, x2[i2 + 2], 17, 606105819);
    b2 = md5ff(b2, c2, d2, a2, x2[i2 + 3], 22, -1044525330);
    a2 = md5ff(a2, b2, c2, d2, x2[i2 + 4], 7, -176418897);
    d2 = md5ff(d2, a2, b2, c2, x2[i2 + 5], 12, 1200080426);
    c2 = md5ff(c2, d2, a2, b2, x2[i2 + 6], 17, -1473231341);
    b2 = md5ff(b2, c2, d2, a2, x2[i2 + 7], 22, -45705983);
    a2 = md5ff(a2, b2, c2, d2, x2[i2 + 8], 7, 1770035416);
    d2 = md5ff(d2, a2, b2, c2, x2[i2 + 9], 12, -1958414417);
    c2 = md5ff(c2, d2, a2, b2, x2[i2 + 10], 17, -42063);
    b2 = md5ff(b2, c2, d2, a2, x2[i2 + 11], 22, -1990404162);
    a2 = md5ff(a2, b2, c2, d2, x2[i2 + 12], 7, 1804603682);
    d2 = md5ff(d2, a2, b2, c2, x2[i2 + 13], 12, -40341101);
    c2 = md5ff(c2, d2, a2, b2, x2[i2 + 14], 17, -1502002290);
    b2 = md5ff(b2, c2, d2, a2, x2[i2 + 15], 22, 1236535329);
    a2 = md5gg(a2, b2, c2, d2, x2[i2 + 1], 5, -165796510);
    d2 = md5gg(d2, a2, b2, c2, x2[i2 + 6], 9, -1069501632);
    c2 = md5gg(c2, d2, a2, b2, x2[i2 + 11], 14, 643717713);
    b2 = md5gg(b2, c2, d2, a2, x2[i2], 20, -373897302);
    a2 = md5gg(a2, b2, c2, d2, x2[i2 + 5], 5, -701558691);
    d2 = md5gg(d2, a2, b2, c2, x2[i2 + 10], 9, 38016083);
    c2 = md5gg(c2, d2, a2, b2, x2[i2 + 15], 14, -660478335);
    b2 = md5gg(b2, c2, d2, a2, x2[i2 + 4], 20, -405537848);
    a2 = md5gg(a2, b2, c2, d2, x2[i2 + 9], 5, 568446438);
    d2 = md5gg(d2, a2, b2, c2, x2[i2 + 14], 9, -1019803690);
    c2 = md5gg(c2, d2, a2, b2, x2[i2 + 3], 14, -187363961);
    b2 = md5gg(b2, c2, d2, a2, x2[i2 + 8], 20, 1163531501);
    a2 = md5gg(a2, b2, c2, d2, x2[i2 + 13], 5, -1444681467);
    d2 = md5gg(d2, a2, b2, c2, x2[i2 + 2], 9, -51403784);
    c2 = md5gg(c2, d2, a2, b2, x2[i2 + 7], 14, 1735328473);
    b2 = md5gg(b2, c2, d2, a2, x2[i2 + 12], 20, -1926607734);
    a2 = md5hh(a2, b2, c2, d2, x2[i2 + 5], 4, -378558);
    d2 = md5hh(d2, a2, b2, c2, x2[i2 + 8], 11, -2022574463);
    c2 = md5hh(c2, d2, a2, b2, x2[i2 + 11], 16, 1839030562);
    b2 = md5hh(b2, c2, d2, a2, x2[i2 + 14], 23, -35309556);
    a2 = md5hh(a2, b2, c2, d2, x2[i2 + 1], 4, -1530992060);
    d2 = md5hh(d2, a2, b2, c2, x2[i2 + 4], 11, 1272893353);
    c2 = md5hh(c2, d2, a2, b2, x2[i2 + 7], 16, -155497632);
    b2 = md5hh(b2, c2, d2, a2, x2[i2 + 10], 23, -1094730640);
    a2 = md5hh(a2, b2, c2, d2, x2[i2 + 13], 4, 681279174);
    d2 = md5hh(d2, a2, b2, c2, x2[i2], 11, -358537222);
    c2 = md5hh(c2, d2, a2, b2, x2[i2 + 3], 16, -722521979);
    b2 = md5hh(b2, c2, d2, a2, x2[i2 + 6], 23, 76029189);
    a2 = md5hh(a2, b2, c2, d2, x2[i2 + 9], 4, -640364487);
    d2 = md5hh(d2, a2, b2, c2, x2[i2 + 12], 11, -421815835);
    c2 = md5hh(c2, d2, a2, b2, x2[i2 + 15], 16, 530742520);
    b2 = md5hh(b2, c2, d2, a2, x2[i2 + 2], 23, -995338651);
    a2 = md5ii(a2, b2, c2, d2, x2[i2], 6, -198630844);
    d2 = md5ii(d2, a2, b2, c2, x2[i2 + 7], 10, 1126891415);
    c2 = md5ii(c2, d2, a2, b2, x2[i2 + 14], 15, -1416354905);
    b2 = md5ii(b2, c2, d2, a2, x2[i2 + 5], 21, -57434055);
    a2 = md5ii(a2, b2, c2, d2, x2[i2 + 12], 6, 1700485571);
    d2 = md5ii(d2, a2, b2, c2, x2[i2 + 3], 10, -1894986606);
    c2 = md5ii(c2, d2, a2, b2, x2[i2 + 10], 15, -1051523);
    b2 = md5ii(b2, c2, d2, a2, x2[i2 + 1], 21, -2054922799);
    a2 = md5ii(a2, b2, c2, d2, x2[i2 + 8], 6, 1873313359);
    d2 = md5ii(d2, a2, b2, c2, x2[i2 + 15], 10, -30611744);
    c2 = md5ii(c2, d2, a2, b2, x2[i2 + 6], 15, -1560198380);
    b2 = md5ii(b2, c2, d2, a2, x2[i2 + 13], 21, 1309151649);
    a2 = md5ii(a2, b2, c2, d2, x2[i2 + 4], 6, -145523070);
    d2 = md5ii(d2, a2, b2, c2, x2[i2 + 11], 10, -1120210379);
    c2 = md5ii(c2, d2, a2, b2, x2[i2 + 2], 15, 718787259);
    b2 = md5ii(b2, c2, d2, a2, x2[i2 + 9], 21, -343485551);
    a2 = safeAdd(a2, olda);
    b2 = safeAdd(b2, oldb);
    c2 = safeAdd(c2, oldc);
    d2 = safeAdd(d2, oldd);
  }
  return [a2, b2, c2, d2];
}
function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }
  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));
  for (let i2 = 0; i2 < length8; i2 += 8) {
    output[i2 >> 5] |= (input[i2 / 8] & 255) << i2 % 32;
  }
  return output;
}
function safeAdd(x2, y2) {
  const lsw = (x2 & 65535) + (y2 & 65535);
  const msw = (x2 >> 16) + (y2 >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function md5cmn(q2, a2, b2, x2, s2, t2) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a2, q2), safeAdd(x2, t2)), s2), b2);
}
function md5ff(a2, b2, c2, d2, x2, s2, t2) {
  return md5cmn(b2 & c2 | ~b2 & d2, a2, b2, x2, s2, t2);
}
function md5gg(a2, b2, c2, d2, x2, s2, t2) {
  return md5cmn(b2 & d2 | c2 & ~d2, a2, b2, x2, s2, t2);
}
function md5hh(a2, b2, c2, d2, x2, s2, t2) {
  return md5cmn(b2 ^ c2 ^ d2, a2, b2, x2, s2, t2);
}
function md5ii(a2, b2, c2, d2, x2, s2, t2) {
  return md5cmn(c2 ^ (b2 | ~d2), a2, b2, x2, s2, t2);
}
var md5_default = md5;

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/v3.js
var v3 = v35("v3", 48, md5_default);

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i2 = 0; i2 < 16; ++i2) {
      buf[offset + i2] = rnds[i2];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/sha1.js
function f(s2, x2, y2, z2) {
  switch (s2) {
    case 0:
      return x2 & y2 ^ ~x2 & z2;
    case 1:
      return x2 ^ y2 ^ z2;
    case 2:
      return x2 & y2 ^ x2 & z2 ^ y2 & z2;
    case 3:
      return x2 ^ y2 ^ z2;
  }
}
function ROTL(x2, n2) {
  return x2 << n2 | x2 >>> 32 - n2;
}
function sha1(bytes) {
  const K = [1518500249, 1859775393, 2400959708, 3395469782];
  const H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  if (typeof bytes === "string") {
    const msg = unescape(encodeURIComponent(bytes));
    bytes = [];
    for (let i2 = 0; i2 < msg.length; ++i2) {
      bytes.push(msg.charCodeAt(i2));
    }
  } else if (!Array.isArray(bytes)) {
    bytes = Array.prototype.slice.call(bytes);
  }
  bytes.push(128);
  const l2 = bytes.length / 4 + 2;
  const N = Math.ceil(l2 / 16);
  const M = new Array(N);
  for (let i2 = 0; i2 < N; ++i2) {
    const arr = new Uint32Array(16);
    for (let j2 = 0; j2 < 16; ++j2) {
      arr[j2] = bytes[i2 * 64 + j2 * 4] << 24 | bytes[i2 * 64 + j2 * 4 + 1] << 16 | bytes[i2 * 64 + j2 * 4 + 2] << 8 | bytes[i2 * 64 + j2 * 4 + 3];
    }
    M[i2] = arr;
  }
  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 4294967295;
  for (let i2 = 0; i2 < N; ++i2) {
    const W = new Uint32Array(80);
    for (let t2 = 0; t2 < 16; ++t2) {
      W[t2] = M[i2][t2];
    }
    for (let t2 = 16; t2 < 80; ++t2) {
      W[t2] = ROTL(W[t2 - 3] ^ W[t2 - 8] ^ W[t2 - 14] ^ W[t2 - 16], 1);
    }
    let a2 = H[0];
    let b2 = H[1];
    let c2 = H[2];
    let d2 = H[3];
    let e2 = H[4];
    for (let t2 = 0; t2 < 80; ++t2) {
      const s2 = Math.floor(t2 / 20);
      const T = ROTL(a2, 5) + f(s2, b2, c2, d2) + e2 + K[s2] + W[t2] >>> 0;
      e2 = d2;
      d2 = c2;
      c2 = ROTL(b2, 30) >>> 0;
      b2 = a2;
      a2 = T;
    }
    H[0] = H[0] + a2 >>> 0;
    H[1] = H[1] + b2 >>> 0;
    H[2] = H[2] + c2 >>> 0;
    H[3] = H[3] + d2 >>> 0;
    H[4] = H[4] + e2 >>> 0;
  }
  return [H[0] >> 24 & 255, H[0] >> 16 & 255, H[0] >> 8 & 255, H[0] & 255, H[1] >> 24 & 255, H[1] >> 16 & 255, H[1] >> 8 & 255, H[1] & 255, H[2] >> 24 & 255, H[2] >> 16 & 255, H[2] >> 8 & 255, H[2] & 255, H[3] >> 24 & 255, H[3] >> 16 & 255, H[3] >> 8 & 255, H[3] & 255, H[4] >> 24 & 255, H[4] >> 16 & 255, H[4] >> 8 & 255, H[4] & 255];
}
var sha1_default = sha1;

// node_modules/@aws-sdk/client-dynamodb/node_modules/uuid/dist/esm-browser/v5.js
var v5 = v35("v5", 80, sha1_default);

// node_modules/@aws-sdk/client-dynamodb/dist-es/models/DynamoDBServiceException.js
var DynamoDBServiceException = class _DynamoDBServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _DynamoDBServiceException.prototype);
  }
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/models/models_0.js
var ApproximateCreationDateTimePrecision = {
  MICROSECOND: "MICROSECOND",
  MILLISECOND: "MILLISECOND"
};
var AttributeAction = {
  ADD: "ADD",
  DELETE: "DELETE",
  PUT: "PUT"
};
var ScalarAttributeType = {
  B: "B",
  N: "N",
  S: "S"
};
var BackupStatus = {
  AVAILABLE: "AVAILABLE",
  CREATING: "CREATING",
  DELETED: "DELETED"
};
var BackupType = {
  AWS_BACKUP: "AWS_BACKUP",
  SYSTEM: "SYSTEM",
  USER: "USER"
};
var BillingMode = {
  PAY_PER_REQUEST: "PAY_PER_REQUEST",
  PROVISIONED: "PROVISIONED"
};
var KeyType = {
  HASH: "HASH",
  RANGE: "RANGE"
};
var ProjectionType = {
  ALL: "ALL",
  INCLUDE: "INCLUDE",
  KEYS_ONLY: "KEYS_ONLY"
};
var SSEType = {
  AES256: "AES256",
  KMS: "KMS"
};
var SSEStatus = {
  DISABLED: "DISABLED",
  DISABLING: "DISABLING",
  ENABLED: "ENABLED",
  ENABLING: "ENABLING",
  UPDATING: "UPDATING"
};
var StreamViewType = {
  KEYS_ONLY: "KEYS_ONLY",
  NEW_AND_OLD_IMAGES: "NEW_AND_OLD_IMAGES",
  NEW_IMAGE: "NEW_IMAGE",
  OLD_IMAGE: "OLD_IMAGE"
};
var TimeToLiveStatus = {
  DISABLED: "DISABLED",
  DISABLING: "DISABLING",
  ENABLED: "ENABLED",
  ENABLING: "ENABLING"
};
var BackupInUseException = class _BackupInUseException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "BackupInUseException",
      $fault: "client"
    }, opts));
    this.name = "BackupInUseException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _BackupInUseException.prototype);
  }
};
var BackupNotFoundException = class _BackupNotFoundException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "BackupNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "BackupNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _BackupNotFoundException.prototype);
  }
};
var BackupTypeFilter = {
  ALL: "ALL",
  AWS_BACKUP: "AWS_BACKUP",
  SYSTEM: "SYSTEM",
  USER: "USER"
};
var ReturnConsumedCapacity = {
  INDEXES: "INDEXES",
  NONE: "NONE",
  TOTAL: "TOTAL"
};
var ReturnValuesOnConditionCheckFailure = {
  ALL_OLD: "ALL_OLD",
  NONE: "NONE"
};
var BatchStatementErrorCodeEnum = {
  AccessDenied: "AccessDenied",
  ConditionalCheckFailed: "ConditionalCheckFailed",
  DuplicateItem: "DuplicateItem",
  InternalServerError: "InternalServerError",
  ItemCollectionSizeLimitExceeded: "ItemCollectionSizeLimitExceeded",
  ProvisionedThroughputExceeded: "ProvisionedThroughputExceeded",
  RequestLimitExceeded: "RequestLimitExceeded",
  ResourceNotFound: "ResourceNotFound",
  ThrottlingError: "ThrottlingError",
  TransactionConflict: "TransactionConflict",
  ValidationError: "ValidationError"
};
var InternalServerError = class _InternalServerError extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InternalServerError",
      $fault: "server"
    }, opts));
    this.name = "InternalServerError";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InternalServerError.prototype);
  }
};
var RequestLimitExceeded = class _RequestLimitExceeded extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "RequestLimitExceeded",
      $fault: "client"
    }, opts));
    this.name = "RequestLimitExceeded";
    this.$fault = "client";
    Object.setPrototypeOf(this, _RequestLimitExceeded.prototype);
  }
};
var InvalidEndpointException = class _InvalidEndpointException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidEndpointException",
      $fault: "client"
    }, opts));
    this.name = "InvalidEndpointException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidEndpointException.prototype);
    this.Message = opts.Message;
  }
};
var ProvisionedThroughputExceededException = class _ProvisionedThroughputExceededException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ProvisionedThroughputExceededException",
      $fault: "client"
    }, opts));
    this.name = "ProvisionedThroughputExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ProvisionedThroughputExceededException.prototype);
  }
};
var ResourceNotFoundException = class _ResourceNotFoundException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "ResourceNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceNotFoundException.prototype);
  }
};
var ReturnItemCollectionMetrics = {
  NONE: "NONE",
  SIZE: "SIZE"
};
var ItemCollectionSizeLimitExceededException = class _ItemCollectionSizeLimitExceededException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ItemCollectionSizeLimitExceededException",
      $fault: "client"
    }, opts));
    this.name = "ItemCollectionSizeLimitExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ItemCollectionSizeLimitExceededException.prototype);
  }
};
var ComparisonOperator = {
  BEGINS_WITH: "BEGINS_WITH",
  BETWEEN: "BETWEEN",
  CONTAINS: "CONTAINS",
  EQ: "EQ",
  GE: "GE",
  GT: "GT",
  IN: "IN",
  LE: "LE",
  LT: "LT",
  NE: "NE",
  NOT_CONTAINS: "NOT_CONTAINS",
  NOT_NULL: "NOT_NULL",
  NULL: "NULL"
};
var ConditionalOperator = {
  AND: "AND",
  OR: "OR"
};
var ContinuousBackupsStatus = {
  DISABLED: "DISABLED",
  ENABLED: "ENABLED"
};
var PointInTimeRecoveryStatus = {
  DISABLED: "DISABLED",
  ENABLED: "ENABLED"
};
var ContinuousBackupsUnavailableException = class _ContinuousBackupsUnavailableException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ContinuousBackupsUnavailableException",
      $fault: "client"
    }, opts));
    this.name = "ContinuousBackupsUnavailableException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ContinuousBackupsUnavailableException.prototype);
  }
};
var ContributorInsightsAction = {
  DISABLE: "DISABLE",
  ENABLE: "ENABLE"
};
var ContributorInsightsStatus = {
  DISABLED: "DISABLED",
  DISABLING: "DISABLING",
  ENABLED: "ENABLED",
  ENABLING: "ENABLING",
  FAILED: "FAILED"
};
var LimitExceededException = class _LimitExceededException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "LimitExceededException",
      $fault: "client"
    }, opts));
    this.name = "LimitExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _LimitExceededException.prototype);
  }
};
var TableInUseException = class _TableInUseException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TableInUseException",
      $fault: "client"
    }, opts));
    this.name = "TableInUseException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TableInUseException.prototype);
  }
};
var TableNotFoundException = class _TableNotFoundException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TableNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "TableNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TableNotFoundException.prototype);
  }
};
var GlobalTableStatus = {
  ACTIVE: "ACTIVE",
  CREATING: "CREATING",
  DELETING: "DELETING",
  UPDATING: "UPDATING"
};
var ReplicaStatus = {
  ACTIVE: "ACTIVE",
  CREATING: "CREATING",
  CREATION_FAILED: "CREATION_FAILED",
  DELETING: "DELETING",
  INACCESSIBLE_ENCRYPTION_CREDENTIALS: "INACCESSIBLE_ENCRYPTION_CREDENTIALS",
  REGION_DISABLED: "REGION_DISABLED",
  UPDATING: "UPDATING"
};
var TableClass = {
  STANDARD: "STANDARD",
  STANDARD_INFREQUENT_ACCESS: "STANDARD_INFREQUENT_ACCESS"
};
var GlobalTableAlreadyExistsException = class _GlobalTableAlreadyExistsException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "GlobalTableAlreadyExistsException",
      $fault: "client"
    }, opts));
    this.name = "GlobalTableAlreadyExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _GlobalTableAlreadyExistsException.prototype);
  }
};
var IndexStatus = {
  ACTIVE: "ACTIVE",
  CREATING: "CREATING",
  DELETING: "DELETING",
  UPDATING: "UPDATING"
};
var TableStatus = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
  ARCHIVING: "ARCHIVING",
  CREATING: "CREATING",
  DELETING: "DELETING",
  INACCESSIBLE_ENCRYPTION_CREDENTIALS: "INACCESSIBLE_ENCRYPTION_CREDENTIALS",
  UPDATING: "UPDATING"
};
var ResourceInUseException = class _ResourceInUseException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceInUseException",
      $fault: "client"
    }, opts));
    this.name = "ResourceInUseException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceInUseException.prototype);
  }
};
var ReturnValue = {
  ALL_NEW: "ALL_NEW",
  ALL_OLD: "ALL_OLD",
  NONE: "NONE",
  UPDATED_NEW: "UPDATED_NEW",
  UPDATED_OLD: "UPDATED_OLD"
};
var TransactionConflictException = class _TransactionConflictException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TransactionConflictException",
      $fault: "client"
    }, opts));
    this.name = "TransactionConflictException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TransactionConflictException.prototype);
  }
};
var PolicyNotFoundException = class _PolicyNotFoundException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PolicyNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "PolicyNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PolicyNotFoundException.prototype);
  }
};
var ExportFormat = {
  DYNAMODB_JSON: "DYNAMODB_JSON",
  ION: "ION"
};
var ExportStatus = {
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  IN_PROGRESS: "IN_PROGRESS"
};
var ExportType = {
  FULL_EXPORT: "FULL_EXPORT",
  INCREMENTAL_EXPORT: "INCREMENTAL_EXPORT"
};
var ExportViewType = {
  NEW_AND_OLD_IMAGES: "NEW_AND_OLD_IMAGES",
  NEW_IMAGE: "NEW_IMAGE"
};
var S3SseAlgorithm = {
  AES256: "AES256",
  KMS: "KMS"
};
var ExportNotFoundException = class _ExportNotFoundException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ExportNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "ExportNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ExportNotFoundException.prototype);
  }
};
var GlobalTableNotFoundException = class _GlobalTableNotFoundException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "GlobalTableNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "GlobalTableNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _GlobalTableNotFoundException.prototype);
  }
};
var ImportStatus = {
  CANCELLED: "CANCELLED",
  CANCELLING: "CANCELLING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  IN_PROGRESS: "IN_PROGRESS"
};
var InputCompressionType = {
  GZIP: "GZIP",
  NONE: "NONE",
  ZSTD: "ZSTD"
};
var InputFormat = {
  CSV: "CSV",
  DYNAMODB_JSON: "DYNAMODB_JSON",
  ION: "ION"
};
var ImportNotFoundException = class _ImportNotFoundException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ImportNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "ImportNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ImportNotFoundException.prototype);
  }
};
var DestinationStatus = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
  DISABLING: "DISABLING",
  ENABLE_FAILED: "ENABLE_FAILED",
  ENABLING: "ENABLING",
  UPDATING: "UPDATING"
};
var DuplicateItemException = class _DuplicateItemException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "DuplicateItemException",
      $fault: "client"
    }, opts));
    this.name = "DuplicateItemException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _DuplicateItemException.prototype);
  }
};
var IdempotentParameterMismatchException = class _IdempotentParameterMismatchException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "IdempotentParameterMismatchException",
      $fault: "client"
    }, opts));
    this.name = "IdempotentParameterMismatchException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _IdempotentParameterMismatchException.prototype);
    this.Message = opts.Message;
  }
};
var TransactionInProgressException = class _TransactionInProgressException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TransactionInProgressException",
      $fault: "client"
    }, opts));
    this.name = "TransactionInProgressException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TransactionInProgressException.prototype);
    this.Message = opts.Message;
  }
};
var ExportConflictException = class _ExportConflictException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ExportConflictException",
      $fault: "client"
    }, opts));
    this.name = "ExportConflictException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ExportConflictException.prototype);
  }
};
var InvalidExportTimeException = class _InvalidExportTimeException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidExportTimeException",
      $fault: "client"
    }, opts));
    this.name = "InvalidExportTimeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidExportTimeException.prototype);
  }
};
var PointInTimeRecoveryUnavailableException = class _PointInTimeRecoveryUnavailableException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PointInTimeRecoveryUnavailableException",
      $fault: "client"
    }, opts));
    this.name = "PointInTimeRecoveryUnavailableException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PointInTimeRecoveryUnavailableException.prototype);
  }
};
var ImportConflictException = class _ImportConflictException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ImportConflictException",
      $fault: "client"
    }, opts));
    this.name = "ImportConflictException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ImportConflictException.prototype);
  }
};
var Select = {
  ALL_ATTRIBUTES: "ALL_ATTRIBUTES",
  ALL_PROJECTED_ATTRIBUTES: "ALL_PROJECTED_ATTRIBUTES",
  COUNT: "COUNT",
  SPECIFIC_ATTRIBUTES: "SPECIFIC_ATTRIBUTES"
};
var TableAlreadyExistsException = class _TableAlreadyExistsException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TableAlreadyExistsException",
      $fault: "client"
    }, opts));
    this.name = "TableAlreadyExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TableAlreadyExistsException.prototype);
  }
};
var InvalidRestoreTimeException = class _InvalidRestoreTimeException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidRestoreTimeException",
      $fault: "client"
    }, opts));
    this.name = "InvalidRestoreTimeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidRestoreTimeException.prototype);
  }
};
var ReplicaAlreadyExistsException = class _ReplicaAlreadyExistsException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ReplicaAlreadyExistsException",
      $fault: "client"
    }, opts));
    this.name = "ReplicaAlreadyExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ReplicaAlreadyExistsException.prototype);
  }
};
var ReplicaNotFoundException = class _ReplicaNotFoundException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ReplicaNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "ReplicaNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ReplicaNotFoundException.prototype);
  }
};
var IndexNotFoundException = class _IndexNotFoundException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "IndexNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "IndexNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _IndexNotFoundException.prototype);
  }
};
var AttributeValue;
(function(AttributeValue2) {
  AttributeValue2.visit = (value, visitor) => {
    if (value.S !== void 0)
      return visitor.S(value.S);
    if (value.N !== void 0)
      return visitor.N(value.N);
    if (value.B !== void 0)
      return visitor.B(value.B);
    if (value.SS !== void 0)
      return visitor.SS(value.SS);
    if (value.NS !== void 0)
      return visitor.NS(value.NS);
    if (value.BS !== void 0)
      return visitor.BS(value.BS);
    if (value.M !== void 0)
      return visitor.M(value.M);
    if (value.L !== void 0)
      return visitor.L(value.L);
    if (value.NULL !== void 0)
      return visitor.NULL(value.NULL);
    if (value.BOOL !== void 0)
      return visitor.BOOL(value.BOOL);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(AttributeValue || (AttributeValue = {}));
var ConditionalCheckFailedException = class _ConditionalCheckFailedException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ConditionalCheckFailedException",
      $fault: "client"
    }, opts));
    this.name = "ConditionalCheckFailedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ConditionalCheckFailedException.prototype);
    this.Item = opts.Item;
  }
};
var TransactionCanceledException = class _TransactionCanceledException extends DynamoDBServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TransactionCanceledException",
      $fault: "client"
    }, opts));
    this.name = "TransactionCanceledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TransactionCanceledException.prototype);
    this.Message = opts.Message;
    this.CancellationReasons = opts.CancellationReasons;
  }
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/protocols/Aws_json1_0.js
var se_BatchExecuteStatementCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("BatchExecuteStatement");
  let body;
  body = JSON.stringify(se_BatchExecuteStatementInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_BatchGetItemCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("BatchGetItem");
  let body;
  body = JSON.stringify(se_BatchGetItemInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_BatchWriteItemCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("BatchWriteItem");
  let body;
  body = JSON.stringify(se_BatchWriteItemInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateBackupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateBackup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateGlobalTableCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateGlobalTable");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateTableCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateTable");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteBackupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteBackup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteItemCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteItem");
  let body;
  body = JSON.stringify(se_DeleteItemInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteResourcePolicyCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteResourcePolicy");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteTableCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteTable");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeBackupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeBackup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeContinuousBackupsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeContinuousBackups");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeContributorInsightsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeContributorInsights");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeEndpointsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeEndpoints");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeExportCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeExport");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeGlobalTableCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeGlobalTable");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeGlobalTableSettingsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeGlobalTableSettings");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeImportCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeImport");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeKinesisStreamingDestinationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeKinesisStreamingDestination");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeLimitsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeLimits");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeTableCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeTable");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeTableReplicaAutoScalingCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeTableReplicaAutoScaling");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeTimeToLiveCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeTimeToLive");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DisableKinesisStreamingDestinationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DisableKinesisStreamingDestination");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_EnableKinesisStreamingDestinationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("EnableKinesisStreamingDestination");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ExecuteStatementCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ExecuteStatement");
  let body;
  body = JSON.stringify(se_ExecuteStatementInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ExecuteTransactionCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ExecuteTransaction");
  let body;
  body = JSON.stringify(se_ExecuteTransactionInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ExportTableToPointInTimeCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ExportTableToPointInTime");
  let body;
  body = JSON.stringify(se_ExportTableToPointInTimeInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetItemCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetItem");
  let body;
  body = JSON.stringify(se_GetItemInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetResourcePolicyCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetResourcePolicy");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ImportTableCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ImportTable");
  let body;
  body = JSON.stringify(se_ImportTableInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListBackupsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListBackups");
  let body;
  body = JSON.stringify(se_ListBackupsInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListContributorInsightsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListContributorInsights");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListExportsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListExports");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListGlobalTablesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListGlobalTables");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListImportsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListImports");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListTablesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListTables");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListTagsOfResourceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListTagsOfResource");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_PutItemCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("PutItem");
  let body;
  body = JSON.stringify(se_PutItemInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_PutResourcePolicyCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("PutResourcePolicy");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_QueryCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("Query");
  let body;
  body = JSON.stringify(se_QueryInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_RestoreTableFromBackupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("RestoreTableFromBackup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_RestoreTableToPointInTimeCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("RestoreTableToPointInTime");
  let body;
  body = JSON.stringify(se_RestoreTableToPointInTimeInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ScanCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("Scan");
  let body;
  body = JSON.stringify(se_ScanInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_TagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("TagResource");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_TransactGetItemsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("TransactGetItems");
  let body;
  body = JSON.stringify(se_TransactGetItemsInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_TransactWriteItemsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("TransactWriteItems");
  let body;
  body = JSON.stringify(se_TransactWriteItemsInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UntagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UntagResource");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateContinuousBackupsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateContinuousBackups");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateContributorInsightsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateContributorInsights");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateGlobalTableCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateGlobalTable");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateGlobalTableSettingsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateGlobalTableSettings");
  let body;
  body = JSON.stringify(se_UpdateGlobalTableSettingsInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateItemCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateItem");
  let body;
  body = JSON.stringify(se_UpdateItemInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateKinesisStreamingDestinationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateKinesisStreamingDestination");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateTableCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateTable");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateTableReplicaAutoScalingCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateTableReplicaAutoScaling");
  let body;
  body = JSON.stringify(se_UpdateTableReplicaAutoScalingInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateTimeToLiveCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateTimeToLive");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var de_BatchExecuteStatementCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_BatchExecuteStatementOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_BatchGetItemCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_BatchGetItemOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_BatchWriteItemCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_BatchWriteItemOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateBackupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_CreateBackupOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateGlobalTableCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_CreateGlobalTableOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateTableCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_CreateTableOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteBackupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DeleteBackupOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteItemCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DeleteItemOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteResourcePolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteTableCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DeleteTableOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeBackupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeBackupOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeContinuousBackupsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeContinuousBackupsOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeContributorInsightsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeContributorInsightsOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeEndpointsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeExportCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeExportOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeGlobalTableCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeGlobalTableOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeGlobalTableSettingsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeGlobalTableSettingsOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeImportCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeImportOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeKinesisStreamingDestinationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeLimitsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeTableCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeTableOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeTableReplicaAutoScalingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeTableReplicaAutoScalingOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeTimeToLiveCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DisableKinesisStreamingDestinationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_EnableKinesisStreamingDestinationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ExecuteStatementCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ExecuteStatementOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ExecuteTransactionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ExecuteTransactionOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ExportTableToPointInTimeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ExportTableToPointInTimeOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetItemCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_GetItemOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetResourcePolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ImportTableCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ImportTableOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListBackupsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ListBackupsOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListContributorInsightsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListExportsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListGlobalTablesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListImportsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ListImportsOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListTablesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListTagsOfResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_PutItemCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_PutItemOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_PutResourcePolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_QueryCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_QueryOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_RestoreTableFromBackupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_RestoreTableFromBackupOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_RestoreTableToPointInTimeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_RestoreTableToPointInTimeOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ScanCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ScanOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_TagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_TransactGetItemsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_TransactGetItemsOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_TransactWriteItemsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_TransactWriteItemsOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UntagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_UpdateContinuousBackupsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_UpdateContinuousBackupsOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateContributorInsightsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateGlobalTableCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_UpdateGlobalTableOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateGlobalTableSettingsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_UpdateGlobalTableSettingsOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateItemCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_UpdateItemOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateKinesisStreamingDestinationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateTableCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_UpdateTableOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateTableReplicaAutoScalingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_UpdateTableReplicaAutoScalingOutput(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateTimeToLiveCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CommandError = (output, context) => __async(void 0, null, function* () {
  const parsedOutput = __spreadProps(__spreadValues({}, output), {
    body: yield parseJsonErrorBody(output.body, context)
  });
  const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "InternalServerError":
    case "com.amazonaws.dynamodb#InternalServerError":
      throw yield de_InternalServerErrorRes(parsedOutput, context);
    case "RequestLimitExceeded":
    case "com.amazonaws.dynamodb#RequestLimitExceeded":
      throw yield de_RequestLimitExceededRes(parsedOutput, context);
    case "InvalidEndpointException":
    case "com.amazonaws.dynamodb#InvalidEndpointException":
      throw yield de_InvalidEndpointExceptionRes(parsedOutput, context);
    case "ProvisionedThroughputExceededException":
    case "com.amazonaws.dynamodb#ProvisionedThroughputExceededException":
      throw yield de_ProvisionedThroughputExceededExceptionRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.dynamodb#ResourceNotFoundException":
      throw yield de_ResourceNotFoundExceptionRes(parsedOutput, context);
    case "ItemCollectionSizeLimitExceededException":
    case "com.amazonaws.dynamodb#ItemCollectionSizeLimitExceededException":
      throw yield de_ItemCollectionSizeLimitExceededExceptionRes(parsedOutput, context);
    case "BackupInUseException":
    case "com.amazonaws.dynamodb#BackupInUseException":
      throw yield de_BackupInUseExceptionRes(parsedOutput, context);
    case "ContinuousBackupsUnavailableException":
    case "com.amazonaws.dynamodb#ContinuousBackupsUnavailableException":
      throw yield de_ContinuousBackupsUnavailableExceptionRes(parsedOutput, context);
    case "LimitExceededException":
    case "com.amazonaws.dynamodb#LimitExceededException":
      throw yield de_LimitExceededExceptionRes(parsedOutput, context);
    case "TableInUseException":
    case "com.amazonaws.dynamodb#TableInUseException":
      throw yield de_TableInUseExceptionRes(parsedOutput, context);
    case "TableNotFoundException":
    case "com.amazonaws.dynamodb#TableNotFoundException":
      throw yield de_TableNotFoundExceptionRes(parsedOutput, context);
    case "GlobalTableAlreadyExistsException":
    case "com.amazonaws.dynamodb#GlobalTableAlreadyExistsException":
      throw yield de_GlobalTableAlreadyExistsExceptionRes(parsedOutput, context);
    case "ResourceInUseException":
    case "com.amazonaws.dynamodb#ResourceInUseException":
      throw yield de_ResourceInUseExceptionRes(parsedOutput, context);
    case "BackupNotFoundException":
    case "com.amazonaws.dynamodb#BackupNotFoundException":
      throw yield de_BackupNotFoundExceptionRes(parsedOutput, context);
    case "ConditionalCheckFailedException":
    case "com.amazonaws.dynamodb#ConditionalCheckFailedException":
      throw yield de_ConditionalCheckFailedExceptionRes(parsedOutput, context);
    case "TransactionConflictException":
    case "com.amazonaws.dynamodb#TransactionConflictException":
      throw yield de_TransactionConflictExceptionRes(parsedOutput, context);
    case "PolicyNotFoundException":
    case "com.amazonaws.dynamodb#PolicyNotFoundException":
      throw yield de_PolicyNotFoundExceptionRes(parsedOutput, context);
    case "ExportNotFoundException":
    case "com.amazonaws.dynamodb#ExportNotFoundException":
      throw yield de_ExportNotFoundExceptionRes(parsedOutput, context);
    case "GlobalTableNotFoundException":
    case "com.amazonaws.dynamodb#GlobalTableNotFoundException":
      throw yield de_GlobalTableNotFoundExceptionRes(parsedOutput, context);
    case "ImportNotFoundException":
    case "com.amazonaws.dynamodb#ImportNotFoundException":
      throw yield de_ImportNotFoundExceptionRes(parsedOutput, context);
    case "DuplicateItemException":
    case "com.amazonaws.dynamodb#DuplicateItemException":
      throw yield de_DuplicateItemExceptionRes(parsedOutput, context);
    case "IdempotentParameterMismatchException":
    case "com.amazonaws.dynamodb#IdempotentParameterMismatchException":
      throw yield de_IdempotentParameterMismatchExceptionRes(parsedOutput, context);
    case "TransactionCanceledException":
    case "com.amazonaws.dynamodb#TransactionCanceledException":
      throw yield de_TransactionCanceledExceptionRes(parsedOutput, context);
    case "TransactionInProgressException":
    case "com.amazonaws.dynamodb#TransactionInProgressException":
      throw yield de_TransactionInProgressExceptionRes(parsedOutput, context);
    case "ExportConflictException":
    case "com.amazonaws.dynamodb#ExportConflictException":
      throw yield de_ExportConflictExceptionRes(parsedOutput, context);
    case "InvalidExportTimeException":
    case "com.amazonaws.dynamodb#InvalidExportTimeException":
      throw yield de_InvalidExportTimeExceptionRes(parsedOutput, context);
    case "PointInTimeRecoveryUnavailableException":
    case "com.amazonaws.dynamodb#PointInTimeRecoveryUnavailableException":
      throw yield de_PointInTimeRecoveryUnavailableExceptionRes(parsedOutput, context);
    case "ImportConflictException":
    case "com.amazonaws.dynamodb#ImportConflictException":
      throw yield de_ImportConflictExceptionRes(parsedOutput, context);
    case "TableAlreadyExistsException":
    case "com.amazonaws.dynamodb#TableAlreadyExistsException":
      throw yield de_TableAlreadyExistsExceptionRes(parsedOutput, context);
    case "InvalidRestoreTimeException":
    case "com.amazonaws.dynamodb#InvalidRestoreTimeException":
      throw yield de_InvalidRestoreTimeExceptionRes(parsedOutput, context);
    case "ReplicaAlreadyExistsException":
    case "com.amazonaws.dynamodb#ReplicaAlreadyExistsException":
      throw yield de_ReplicaAlreadyExistsExceptionRes(parsedOutput, context);
    case "ReplicaNotFoundException":
    case "com.amazonaws.dynamodb#ReplicaNotFoundException":
      throw yield de_ReplicaNotFoundExceptionRes(parsedOutput, context);
    case "IndexNotFoundException":
    case "com.amazonaws.dynamodb#IndexNotFoundException":
      throw yield de_IndexNotFoundExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError({
        output,
        parsedBody,
        errorCode
      });
  }
});
var de_BackupInUseExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new BackupInUseException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_BackupNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new BackupNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ConditionalCheckFailedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ConditionalCheckFailedException(body, context);
  const exception = new ConditionalCheckFailedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ContinuousBackupsUnavailableExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ContinuousBackupsUnavailableException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_DuplicateItemExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new DuplicateItemException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ExportConflictExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ExportConflictException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ExportNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ExportNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_GlobalTableAlreadyExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new GlobalTableAlreadyExistsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_GlobalTableNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new GlobalTableNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_IdempotentParameterMismatchExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new IdempotentParameterMismatchException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ImportConflictExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ImportConflictException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ImportNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ImportNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_IndexNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new IndexNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InternalServerErrorRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InternalServerError(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidEndpointExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidEndpointException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidExportTimeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidExportTimeException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidRestoreTimeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidRestoreTimeException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ItemCollectionSizeLimitExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ItemCollectionSizeLimitExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_LimitExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new LimitExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_PointInTimeRecoveryUnavailableExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new PointInTimeRecoveryUnavailableException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_PolicyNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new PolicyNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ProvisionedThroughputExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ProvisionedThroughputExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ReplicaAlreadyExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ReplicaAlreadyExistsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ReplicaNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ReplicaNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_RequestLimitExceededRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new RequestLimitExceeded(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ResourceInUseExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ResourceInUseException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ResourceNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ResourceNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TableAlreadyExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new TableAlreadyExistsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TableInUseExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new TableInUseException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TableNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new TableNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TransactionCanceledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_TransactionCanceledException(body, context);
  const exception = new TransactionCanceledException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TransactionConflictExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new TransactionConflictException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TransactionInProgressExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new TransactionInProgressException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var se_AttributeUpdates = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_AttributeValueUpdate(value, context);
    return acc;
  }, {});
};
var se_AttributeValue = (input, context) => {
  return AttributeValue.visit(input, {
    B: (value) => ({ B: context.base64Encoder(value) }),
    BOOL: (value) => ({ BOOL: value }),
    BS: (value) => ({ BS: se_BinarySetAttributeValue(value, context) }),
    L: (value) => ({ L: se_ListAttributeValue(value, context) }),
    M: (value) => ({ M: se_MapAttributeValue(value, context) }),
    N: (value) => ({ N: value }),
    NS: (value) => ({ NS: _json(value) }),
    NULL: (value) => ({ NULL: value }),
    S: (value) => ({ S: value }),
    SS: (value) => ({ SS: _json(value) }),
    _: (name, value) => ({ name: value })
  });
};
var se_AttributeValueList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_AttributeValue(entry, context);
  });
};
var se_AttributeValueUpdate = (input, context) => {
  return take(input, {
    Action: [],
    Value: (_) => se_AttributeValue(_, context)
  });
};
var se_AutoScalingPolicyUpdate = (input, context) => {
  return take(input, {
    PolicyName: [],
    TargetTrackingScalingPolicyConfiguration: (_) => se_AutoScalingTargetTrackingScalingPolicyConfigurationUpdate(_, context)
  });
};
var se_AutoScalingSettingsUpdate = (input, context) => {
  return take(input, {
    AutoScalingDisabled: [],
    AutoScalingRoleArn: [],
    MaximumUnits: [],
    MinimumUnits: [],
    ScalingPolicyUpdate: (_) => se_AutoScalingPolicyUpdate(_, context)
  });
};
var se_AutoScalingTargetTrackingScalingPolicyConfigurationUpdate = (input, context) => {
  return take(input, {
    DisableScaleIn: [],
    ScaleInCooldown: [],
    ScaleOutCooldown: [],
    TargetValue: serializeFloat
  });
};
var se_BatchExecuteStatementInput = (input, context) => {
  return take(input, {
    ReturnConsumedCapacity: [],
    Statements: (_) => se_PartiQLBatchRequest(_, context)
  });
};
var se_BatchGetItemInput = (input, context) => {
  return take(input, {
    RequestItems: (_) => se_BatchGetRequestMap(_, context),
    ReturnConsumedCapacity: []
  });
};
var se_BatchGetRequestMap = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_KeysAndAttributes(value, context);
    return acc;
  }, {});
};
var se_BatchStatementRequest = (input, context) => {
  return take(input, {
    ConsistentRead: [],
    Parameters: (_) => se_PreparedStatementParameters(_, context),
    ReturnValuesOnConditionCheckFailure: [],
    Statement: []
  });
};
var se_BatchWriteItemInput = (input, context) => {
  return take(input, {
    RequestItems: (_) => se_BatchWriteItemRequestMap(_, context),
    ReturnConsumedCapacity: [],
    ReturnItemCollectionMetrics: []
  });
};
var se_BatchWriteItemRequestMap = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_WriteRequests(value, context);
    return acc;
  }, {});
};
var se_BinarySetAttributeValue = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return context.base64Encoder(entry);
  });
};
var se_Condition = (input, context) => {
  return take(input, {
    AttributeValueList: (_) => se_AttributeValueList(_, context),
    ComparisonOperator: []
  });
};
var se_ConditionCheck = (input, context) => {
  return take(input, {
    ConditionExpression: [],
    ExpressionAttributeNames: _json,
    ExpressionAttributeValues: (_) => se_ExpressionAttributeValueMap(_, context),
    Key: (_) => se_Key(_, context),
    ReturnValuesOnConditionCheckFailure: [],
    TableName: []
  });
};
var se_Delete = (input, context) => {
  return take(input, {
    ConditionExpression: [],
    ExpressionAttributeNames: _json,
    ExpressionAttributeValues: (_) => se_ExpressionAttributeValueMap(_, context),
    Key: (_) => se_Key(_, context),
    ReturnValuesOnConditionCheckFailure: [],
    TableName: []
  });
};
var se_DeleteItemInput = (input, context) => {
  return take(input, {
    ConditionExpression: [],
    ConditionalOperator: [],
    Expected: (_) => se_ExpectedAttributeMap(_, context),
    ExpressionAttributeNames: _json,
    ExpressionAttributeValues: (_) => se_ExpressionAttributeValueMap(_, context),
    Key: (_) => se_Key(_, context),
    ReturnConsumedCapacity: [],
    ReturnItemCollectionMetrics: [],
    ReturnValues: [],
    ReturnValuesOnConditionCheckFailure: [],
    TableName: []
  });
};
var se_DeleteRequest = (input, context) => {
  return take(input, {
    Key: (_) => se_Key(_, context)
  });
};
var se_ExecuteStatementInput = (input, context) => {
  return take(input, {
    ConsistentRead: [],
    Limit: [],
    NextToken: [],
    Parameters: (_) => se_PreparedStatementParameters(_, context),
    ReturnConsumedCapacity: [],
    ReturnValuesOnConditionCheckFailure: [],
    Statement: []
  });
};
var se_ExecuteTransactionInput = (input, context) => {
  return take(input, {
    ClientRequestToken: [true, (_) => _ ?? v4_default()],
    ReturnConsumedCapacity: [],
    TransactStatements: (_) => se_ParameterizedStatements(_, context)
  });
};
var se_ExpectedAttributeMap = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_ExpectedAttributeValue(value, context);
    return acc;
  }, {});
};
var se_ExpectedAttributeValue = (input, context) => {
  return take(input, {
    AttributeValueList: (_) => se_AttributeValueList(_, context),
    ComparisonOperator: [],
    Exists: [],
    Value: (_) => se_AttributeValue(_, context)
  });
};
var se_ExportTableToPointInTimeInput = (input, context) => {
  return take(input, {
    ClientToken: [true, (_) => _ ?? v4_default()],
    ExportFormat: [],
    ExportTime: (_) => _.getTime() / 1e3,
    ExportType: [],
    IncrementalExportSpecification: (_) => se_IncrementalExportSpecification(_, context),
    S3Bucket: [],
    S3BucketOwner: [],
    S3Prefix: [],
    S3SseAlgorithm: [],
    S3SseKmsKeyId: [],
    TableArn: []
  });
};
var se_ExpressionAttributeValueMap = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_AttributeValue(value, context);
    return acc;
  }, {});
};
var se_FilterConditionMap = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_Condition(value, context);
    return acc;
  }, {});
};
var se_Get = (input, context) => {
  return take(input, {
    ExpressionAttributeNames: _json,
    Key: (_) => se_Key(_, context),
    ProjectionExpression: [],
    TableName: []
  });
};
var se_GetItemInput = (input, context) => {
  return take(input, {
    AttributesToGet: _json,
    ConsistentRead: [],
    ExpressionAttributeNames: _json,
    Key: (_) => se_Key(_, context),
    ProjectionExpression: [],
    ReturnConsumedCapacity: [],
    TableName: []
  });
};
var se_GlobalSecondaryIndexAutoScalingUpdate = (input, context) => {
  return take(input, {
    IndexName: [],
    ProvisionedWriteCapacityAutoScalingUpdate: (_) => se_AutoScalingSettingsUpdate(_, context)
  });
};
var se_GlobalSecondaryIndexAutoScalingUpdateList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_GlobalSecondaryIndexAutoScalingUpdate(entry, context);
  });
};
var se_GlobalTableGlobalSecondaryIndexSettingsUpdate = (input, context) => {
  return take(input, {
    IndexName: [],
    ProvisionedWriteCapacityAutoScalingSettingsUpdate: (_) => se_AutoScalingSettingsUpdate(_, context),
    ProvisionedWriteCapacityUnits: []
  });
};
var se_GlobalTableGlobalSecondaryIndexSettingsUpdateList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_GlobalTableGlobalSecondaryIndexSettingsUpdate(entry, context);
  });
};
var se_ImportTableInput = (input, context) => {
  return take(input, {
    ClientToken: [true, (_) => _ ?? v4_default()],
    InputCompressionType: [],
    InputFormat: [],
    InputFormatOptions: _json,
    S3BucketSource: _json,
    TableCreationParameters: _json
  });
};
var se_IncrementalExportSpecification = (input, context) => {
  return take(input, {
    ExportFromTime: (_) => _.getTime() / 1e3,
    ExportToTime: (_) => _.getTime() / 1e3,
    ExportViewType: []
  });
};
var se_Key = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_AttributeValue(value, context);
    return acc;
  }, {});
};
var se_KeyConditions = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_Condition(value, context);
    return acc;
  }, {});
};
var se_KeyList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_Key(entry, context);
  });
};
var se_KeysAndAttributes = (input, context) => {
  return take(input, {
    AttributesToGet: _json,
    ConsistentRead: [],
    ExpressionAttributeNames: _json,
    Keys: (_) => se_KeyList(_, context),
    ProjectionExpression: []
  });
};
var se_ListAttributeValue = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_AttributeValue(entry, context);
  });
};
var se_ListBackupsInput = (input, context) => {
  return take(input, {
    BackupType: [],
    ExclusiveStartBackupArn: [],
    Limit: [],
    TableName: [],
    TimeRangeLowerBound: (_) => _.getTime() / 1e3,
    TimeRangeUpperBound: (_) => _.getTime() / 1e3
  });
};
var se_MapAttributeValue = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_AttributeValue(value, context);
    return acc;
  }, {});
};
var se_ParameterizedStatement = (input, context) => {
  return take(input, {
    Parameters: (_) => se_PreparedStatementParameters(_, context),
    ReturnValuesOnConditionCheckFailure: [],
    Statement: []
  });
};
var se_ParameterizedStatements = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_ParameterizedStatement(entry, context);
  });
};
var se_PartiQLBatchRequest = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_BatchStatementRequest(entry, context);
  });
};
var se_PreparedStatementParameters = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_AttributeValue(entry, context);
  });
};
var se_Put = (input, context) => {
  return take(input, {
    ConditionExpression: [],
    ExpressionAttributeNames: _json,
    ExpressionAttributeValues: (_) => se_ExpressionAttributeValueMap(_, context),
    Item: (_) => se_PutItemInputAttributeMap(_, context),
    ReturnValuesOnConditionCheckFailure: [],
    TableName: []
  });
};
var se_PutItemInput = (input, context) => {
  return take(input, {
    ConditionExpression: [],
    ConditionalOperator: [],
    Expected: (_) => se_ExpectedAttributeMap(_, context),
    ExpressionAttributeNames: _json,
    ExpressionAttributeValues: (_) => se_ExpressionAttributeValueMap(_, context),
    Item: (_) => se_PutItemInputAttributeMap(_, context),
    ReturnConsumedCapacity: [],
    ReturnItemCollectionMetrics: [],
    ReturnValues: [],
    ReturnValuesOnConditionCheckFailure: [],
    TableName: []
  });
};
var se_PutItemInputAttributeMap = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = se_AttributeValue(value, context);
    return acc;
  }, {});
};
var se_PutRequest = (input, context) => {
  return take(input, {
    Item: (_) => se_PutItemInputAttributeMap(_, context)
  });
};
var se_QueryInput = (input, context) => {
  return take(input, {
    AttributesToGet: _json,
    ConditionalOperator: [],
    ConsistentRead: [],
    ExclusiveStartKey: (_) => se_Key(_, context),
    ExpressionAttributeNames: _json,
    ExpressionAttributeValues: (_) => se_ExpressionAttributeValueMap(_, context),
    FilterExpression: [],
    IndexName: [],
    KeyConditionExpression: [],
    KeyConditions: (_) => se_KeyConditions(_, context),
    Limit: [],
    ProjectionExpression: [],
    QueryFilter: (_) => se_FilterConditionMap(_, context),
    ReturnConsumedCapacity: [],
    ScanIndexForward: [],
    Select: [],
    TableName: []
  });
};
var se_ReplicaAutoScalingUpdate = (input, context) => {
  return take(input, {
    RegionName: [],
    ReplicaGlobalSecondaryIndexUpdates: (_) => se_ReplicaGlobalSecondaryIndexAutoScalingUpdateList(_, context),
    ReplicaProvisionedReadCapacityAutoScalingUpdate: (_) => se_AutoScalingSettingsUpdate(_, context)
  });
};
var se_ReplicaAutoScalingUpdateList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_ReplicaAutoScalingUpdate(entry, context);
  });
};
var se_ReplicaGlobalSecondaryIndexAutoScalingUpdate = (input, context) => {
  return take(input, {
    IndexName: [],
    ProvisionedReadCapacityAutoScalingUpdate: (_) => se_AutoScalingSettingsUpdate(_, context)
  });
};
var se_ReplicaGlobalSecondaryIndexAutoScalingUpdateList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_ReplicaGlobalSecondaryIndexAutoScalingUpdate(entry, context);
  });
};
var se_ReplicaGlobalSecondaryIndexSettingsUpdate = (input, context) => {
  return take(input, {
    IndexName: [],
    ProvisionedReadCapacityAutoScalingSettingsUpdate: (_) => se_AutoScalingSettingsUpdate(_, context),
    ProvisionedReadCapacityUnits: []
  });
};
var se_ReplicaGlobalSecondaryIndexSettingsUpdateList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_ReplicaGlobalSecondaryIndexSettingsUpdate(entry, context);
  });
};
var se_ReplicaSettingsUpdate = (input, context) => {
  return take(input, {
    RegionName: [],
    ReplicaGlobalSecondaryIndexSettingsUpdate: (_) => se_ReplicaGlobalSecondaryIndexSettingsUpdateList(_, context),
    ReplicaProvisionedReadCapacityAutoScalingSettingsUpdate: (_) => se_AutoScalingSettingsUpdate(_, context),
    ReplicaProvisionedReadCapacityUnits: [],
    ReplicaTableClass: []
  });
};
var se_ReplicaSettingsUpdateList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_ReplicaSettingsUpdate(entry, context);
  });
};
var se_RestoreTableToPointInTimeInput = (input, context) => {
  return take(input, {
    BillingModeOverride: [],
    GlobalSecondaryIndexOverride: _json,
    LocalSecondaryIndexOverride: _json,
    OnDemandThroughputOverride: _json,
    ProvisionedThroughputOverride: _json,
    RestoreDateTime: (_) => _.getTime() / 1e3,
    SSESpecificationOverride: _json,
    SourceTableArn: [],
    SourceTableName: [],
    TargetTableName: [],
    UseLatestRestorableTime: []
  });
};
var se_ScanInput = (input, context) => {
  return take(input, {
    AttributesToGet: _json,
    ConditionalOperator: [],
    ConsistentRead: [],
    ExclusiveStartKey: (_) => se_Key(_, context),
    ExpressionAttributeNames: _json,
    ExpressionAttributeValues: (_) => se_ExpressionAttributeValueMap(_, context),
    FilterExpression: [],
    IndexName: [],
    Limit: [],
    ProjectionExpression: [],
    ReturnConsumedCapacity: [],
    ScanFilter: (_) => se_FilterConditionMap(_, context),
    Segment: [],
    Select: [],
    TableName: [],
    TotalSegments: []
  });
};
var se_TransactGetItem = (input, context) => {
  return take(input, {
    Get: (_) => se_Get(_, context)
  });
};
var se_TransactGetItemList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_TransactGetItem(entry, context);
  });
};
var se_TransactGetItemsInput = (input, context) => {
  return take(input, {
    ReturnConsumedCapacity: [],
    TransactItems: (_) => se_TransactGetItemList(_, context)
  });
};
var se_TransactWriteItem = (input, context) => {
  return take(input, {
    ConditionCheck: (_) => se_ConditionCheck(_, context),
    Delete: (_) => se_Delete(_, context),
    Put: (_) => se_Put(_, context),
    Update: (_) => se_Update(_, context)
  });
};
var se_TransactWriteItemList = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_TransactWriteItem(entry, context);
  });
};
var se_TransactWriteItemsInput = (input, context) => {
  return take(input, {
    ClientRequestToken: [true, (_) => _ ?? v4_default()],
    ReturnConsumedCapacity: [],
    ReturnItemCollectionMetrics: [],
    TransactItems: (_) => se_TransactWriteItemList(_, context)
  });
};
var se_Update = (input, context) => {
  return take(input, {
    ConditionExpression: [],
    ExpressionAttributeNames: _json,
    ExpressionAttributeValues: (_) => se_ExpressionAttributeValueMap(_, context),
    Key: (_) => se_Key(_, context),
    ReturnValuesOnConditionCheckFailure: [],
    TableName: [],
    UpdateExpression: []
  });
};
var se_UpdateGlobalTableSettingsInput = (input, context) => {
  return take(input, {
    GlobalTableBillingMode: [],
    GlobalTableGlobalSecondaryIndexSettingsUpdate: (_) => se_GlobalTableGlobalSecondaryIndexSettingsUpdateList(_, context),
    GlobalTableName: [],
    GlobalTableProvisionedWriteCapacityAutoScalingSettingsUpdate: (_) => se_AutoScalingSettingsUpdate(_, context),
    GlobalTableProvisionedWriteCapacityUnits: [],
    ReplicaSettingsUpdate: (_) => se_ReplicaSettingsUpdateList(_, context)
  });
};
var se_UpdateItemInput = (input, context) => {
  return take(input, {
    AttributeUpdates: (_) => se_AttributeUpdates(_, context),
    ConditionExpression: [],
    ConditionalOperator: [],
    Expected: (_) => se_ExpectedAttributeMap(_, context),
    ExpressionAttributeNames: _json,
    ExpressionAttributeValues: (_) => se_ExpressionAttributeValueMap(_, context),
    Key: (_) => se_Key(_, context),
    ReturnConsumedCapacity: [],
    ReturnItemCollectionMetrics: [],
    ReturnValues: [],
    ReturnValuesOnConditionCheckFailure: [],
    TableName: [],
    UpdateExpression: []
  });
};
var se_UpdateTableReplicaAutoScalingInput = (input, context) => {
  return take(input, {
    GlobalSecondaryIndexUpdates: (_) => se_GlobalSecondaryIndexAutoScalingUpdateList(_, context),
    ProvisionedWriteCapacityAutoScalingUpdate: (_) => se_AutoScalingSettingsUpdate(_, context),
    ReplicaUpdates: (_) => se_ReplicaAutoScalingUpdateList(_, context),
    TableName: []
  });
};
var se_WriteRequest = (input, context) => {
  return take(input, {
    DeleteRequest: (_) => se_DeleteRequest(_, context),
    PutRequest: (_) => se_PutRequest(_, context)
  });
};
var se_WriteRequests = (input, context) => {
  return input.filter((e2) => e2 != null).map((entry) => {
    return se_WriteRequest(entry, context);
  });
};
var de_ArchivalSummary = (output, context) => {
  return take(output, {
    ArchivalBackupArn: expectString,
    ArchivalDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ArchivalReason: expectString
  });
};
var de_AttributeMap = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_AttributeValue(awsExpectUnion(value), context);
    return acc;
  }, {});
};
var de_AttributeValue = (output, context) => {
  if (output.B != null) {
    return {
      B: context.base64Decoder(output.B)
    };
  }
  if (expectBoolean(output.BOOL) !== void 0) {
    return { BOOL: expectBoolean(output.BOOL) };
  }
  if (output.BS != null) {
    return {
      BS: de_BinarySetAttributeValue(output.BS, context)
    };
  }
  if (output.L != null) {
    return {
      L: de_ListAttributeValue(output.L, context)
    };
  }
  if (output.M != null) {
    return {
      M: de_MapAttributeValue(output.M, context)
    };
  }
  if (expectString(output.N) !== void 0) {
    return { N: expectString(output.N) };
  }
  if (output.NS != null) {
    return {
      NS: _json(output.NS)
    };
  }
  if (expectBoolean(output.NULL) !== void 0) {
    return { NULL: expectBoolean(output.NULL) };
  }
  if (expectString(output.S) !== void 0) {
    return { S: expectString(output.S) };
  }
  if (output.SS != null) {
    return {
      SS: _json(output.SS)
    };
  }
  return { $unknown: Object.entries(output)[0] };
};
var de_AutoScalingPolicyDescription = (output, context) => {
  return take(output, {
    PolicyName: expectString,
    TargetTrackingScalingPolicyConfiguration: (_) => de_AutoScalingTargetTrackingScalingPolicyConfigurationDescription(_, context)
  });
};
var de_AutoScalingPolicyDescriptionList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_AutoScalingPolicyDescription(entry, context);
  });
  return retVal;
};
var de_AutoScalingSettingsDescription = (output, context) => {
  return take(output, {
    AutoScalingDisabled: expectBoolean,
    AutoScalingRoleArn: expectString,
    MaximumUnits: expectLong,
    MinimumUnits: expectLong,
    ScalingPolicies: (_) => de_AutoScalingPolicyDescriptionList(_, context)
  });
};
var de_AutoScalingTargetTrackingScalingPolicyConfigurationDescription = (output, context) => {
  return take(output, {
    DisableScaleIn: expectBoolean,
    ScaleInCooldown: expectInt32,
    ScaleOutCooldown: expectInt32,
    TargetValue: limitedParseDouble
  });
};
var de_BackupDescription = (output, context) => {
  return take(output, {
    BackupDetails: (_) => de_BackupDetails(_, context),
    SourceTableDetails: (_) => de_SourceTableDetails(_, context),
    SourceTableFeatureDetails: (_) => de_SourceTableFeatureDetails(_, context)
  });
};
var de_BackupDetails = (output, context) => {
  return take(output, {
    BackupArn: expectString,
    BackupCreationDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    BackupExpiryDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    BackupName: expectString,
    BackupSizeBytes: expectLong,
    BackupStatus: expectString,
    BackupType: expectString
  });
};
var de_BackupSummaries = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_BackupSummary(entry, context);
  });
  return retVal;
};
var de_BackupSummary = (output, context) => {
  return take(output, {
    BackupArn: expectString,
    BackupCreationDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    BackupExpiryDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    BackupName: expectString,
    BackupSizeBytes: expectLong,
    BackupStatus: expectString,
    BackupType: expectString,
    TableArn: expectString,
    TableId: expectString,
    TableName: expectString
  });
};
var de_BatchExecuteStatementOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacityMultiple(_, context),
    Responses: (_) => de_PartiQLBatchResponse(_, context)
  });
};
var de_BatchGetItemOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacityMultiple(_, context),
    Responses: (_) => de_BatchGetResponseMap(_, context),
    UnprocessedKeys: (_) => de_BatchGetRequestMap(_, context)
  });
};
var de_BatchGetRequestMap = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_KeysAndAttributes(value, context);
    return acc;
  }, {});
};
var de_BatchGetResponseMap = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_ItemList(value, context);
    return acc;
  }, {});
};
var de_BatchStatementError = (output, context) => {
  return take(output, {
    Code: expectString,
    Item: (_) => de_AttributeMap(_, context),
    Message: expectString
  });
};
var de_BatchStatementResponse = (output, context) => {
  return take(output, {
    Error: (_) => de_BatchStatementError(_, context),
    Item: (_) => de_AttributeMap(_, context),
    TableName: expectString
  });
};
var de_BatchWriteItemOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacityMultiple(_, context),
    ItemCollectionMetrics: (_) => de_ItemCollectionMetricsPerTable(_, context),
    UnprocessedItems: (_) => de_BatchWriteItemRequestMap(_, context)
  });
};
var de_BatchWriteItemRequestMap = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_WriteRequests(value, context);
    return acc;
  }, {});
};
var de_BillingModeSummary = (output, context) => {
  return take(output, {
    BillingMode: expectString,
    LastUpdateToPayPerRequestDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_)))
  });
};
var de_BinarySetAttributeValue = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return context.base64Decoder(entry);
  });
  return retVal;
};
var de_CancellationReason = (output, context) => {
  return take(output, {
    Code: expectString,
    Item: (_) => de_AttributeMap(_, context),
    Message: expectString
  });
};
var de_CancellationReasonList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_CancellationReason(entry, context);
  });
  return retVal;
};
var de_Capacity = (output, context) => {
  return take(output, {
    CapacityUnits: limitedParseDouble,
    ReadCapacityUnits: limitedParseDouble,
    WriteCapacityUnits: limitedParseDouble
  });
};
var de_ConditionalCheckFailedException = (output, context) => {
  return take(output, {
    Item: (_) => de_AttributeMap(_, context),
    message: expectString
  });
};
var de_ConsumedCapacity = (output, context) => {
  return take(output, {
    CapacityUnits: limitedParseDouble,
    GlobalSecondaryIndexes: (_) => de_SecondaryIndexesCapacityMap(_, context),
    LocalSecondaryIndexes: (_) => de_SecondaryIndexesCapacityMap(_, context),
    ReadCapacityUnits: limitedParseDouble,
    Table: (_) => de_Capacity(_, context),
    TableName: expectString,
    WriteCapacityUnits: limitedParseDouble
  });
};
var de_ConsumedCapacityMultiple = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ConsumedCapacity(entry, context);
  });
  return retVal;
};
var de_ContinuousBackupsDescription = (output, context) => {
  return take(output, {
    ContinuousBackupsStatus: expectString,
    PointInTimeRecoveryDescription: (_) => de_PointInTimeRecoveryDescription(_, context)
  });
};
var de_CreateBackupOutput = (output, context) => {
  return take(output, {
    BackupDetails: (_) => de_BackupDetails(_, context)
  });
};
var de_CreateGlobalTableOutput = (output, context) => {
  return take(output, {
    GlobalTableDescription: (_) => de_GlobalTableDescription(_, context)
  });
};
var de_CreateTableOutput = (output, context) => {
  return take(output, {
    TableDescription: (_) => de_TableDescription(_, context)
  });
};
var de_DeleteBackupOutput = (output, context) => {
  return take(output, {
    BackupDescription: (_) => de_BackupDescription(_, context)
  });
};
var de_DeleteItemOutput = (output, context) => {
  return take(output, {
    Attributes: (_) => de_AttributeMap(_, context),
    ConsumedCapacity: (_) => de_ConsumedCapacity(_, context),
    ItemCollectionMetrics: (_) => de_ItemCollectionMetrics(_, context)
  });
};
var de_DeleteRequest = (output, context) => {
  return take(output, {
    Key: (_) => de_Key(_, context)
  });
};
var de_DeleteTableOutput = (output, context) => {
  return take(output, {
    TableDescription: (_) => de_TableDescription(_, context)
  });
};
var de_DescribeBackupOutput = (output, context) => {
  return take(output, {
    BackupDescription: (_) => de_BackupDescription(_, context)
  });
};
var de_DescribeContinuousBackupsOutput = (output, context) => {
  return take(output, {
    ContinuousBackupsDescription: (_) => de_ContinuousBackupsDescription(_, context)
  });
};
var de_DescribeContributorInsightsOutput = (output, context) => {
  return take(output, {
    ContributorInsightsRuleList: _json,
    ContributorInsightsStatus: expectString,
    FailureException: _json,
    IndexName: expectString,
    LastUpdateDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    TableName: expectString
  });
};
var de_DescribeExportOutput = (output, context) => {
  return take(output, {
    ExportDescription: (_) => de_ExportDescription(_, context)
  });
};
var de_DescribeGlobalTableOutput = (output, context) => {
  return take(output, {
    GlobalTableDescription: (_) => de_GlobalTableDescription(_, context)
  });
};
var de_DescribeGlobalTableSettingsOutput = (output, context) => {
  return take(output, {
    GlobalTableName: expectString,
    ReplicaSettings: (_) => de_ReplicaSettingsDescriptionList(_, context)
  });
};
var de_DescribeImportOutput = (output, context) => {
  return take(output, {
    ImportTableDescription: (_) => de_ImportTableDescription(_, context)
  });
};
var de_DescribeTableOutput = (output, context) => {
  return take(output, {
    Table: (_) => de_TableDescription(_, context)
  });
};
var de_DescribeTableReplicaAutoScalingOutput = (output, context) => {
  return take(output, {
    TableAutoScalingDescription: (_) => de_TableAutoScalingDescription(_, context)
  });
};
var de_ExecuteStatementOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacity(_, context),
    Items: (_) => de_ItemList(_, context),
    LastEvaluatedKey: (_) => de_Key(_, context),
    NextToken: expectString
  });
};
var de_ExecuteTransactionOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacityMultiple(_, context),
    Responses: (_) => de_ItemResponseList(_, context)
  });
};
var de_ExportDescription = (output, context) => {
  return take(output, {
    BilledSizeBytes: expectLong,
    ClientToken: expectString,
    EndTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ExportArn: expectString,
    ExportFormat: expectString,
    ExportManifest: expectString,
    ExportStatus: expectString,
    ExportTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ExportType: expectString,
    FailureCode: expectString,
    FailureMessage: expectString,
    IncrementalExportSpecification: (_) => de_IncrementalExportSpecification(_, context),
    ItemCount: expectLong,
    S3Bucket: expectString,
    S3BucketOwner: expectString,
    S3Prefix: expectString,
    S3SseAlgorithm: expectString,
    S3SseKmsKeyId: expectString,
    StartTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    TableArn: expectString,
    TableId: expectString
  });
};
var de_ExportTableToPointInTimeOutput = (output, context) => {
  return take(output, {
    ExportDescription: (_) => de_ExportDescription(_, context)
  });
};
var de_GetItemOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacity(_, context),
    Item: (_) => de_AttributeMap(_, context)
  });
};
var de_GlobalSecondaryIndexDescription = (output, context) => {
  return take(output, {
    Backfilling: expectBoolean,
    IndexArn: expectString,
    IndexName: expectString,
    IndexSizeBytes: expectLong,
    IndexStatus: expectString,
    ItemCount: expectLong,
    KeySchema: _json,
    OnDemandThroughput: _json,
    Projection: _json,
    ProvisionedThroughput: (_) => de_ProvisionedThroughputDescription(_, context)
  });
};
var de_GlobalSecondaryIndexDescriptionList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_GlobalSecondaryIndexDescription(entry, context);
  });
  return retVal;
};
var de_GlobalTableDescription = (output, context) => {
  return take(output, {
    CreationDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    GlobalTableArn: expectString,
    GlobalTableName: expectString,
    GlobalTableStatus: expectString,
    ReplicationGroup: (_) => de_ReplicaDescriptionList(_, context)
  });
};
var de_ImportSummary = (output, context) => {
  return take(output, {
    CloudWatchLogGroupArn: expectString,
    EndTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ImportArn: expectString,
    ImportStatus: expectString,
    InputFormat: expectString,
    S3BucketSource: _json,
    StartTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    TableArn: expectString
  });
};
var de_ImportSummaryList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ImportSummary(entry, context);
  });
  return retVal;
};
var de_ImportTableDescription = (output, context) => {
  return take(output, {
    ClientToken: expectString,
    CloudWatchLogGroupArn: expectString,
    EndTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ErrorCount: expectLong,
    FailureCode: expectString,
    FailureMessage: expectString,
    ImportArn: expectString,
    ImportStatus: expectString,
    ImportedItemCount: expectLong,
    InputCompressionType: expectString,
    InputFormat: expectString,
    InputFormatOptions: _json,
    ProcessedItemCount: expectLong,
    ProcessedSizeBytes: expectLong,
    S3BucketSource: _json,
    StartTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    TableArn: expectString,
    TableCreationParameters: _json,
    TableId: expectString
  });
};
var de_ImportTableOutput = (output, context) => {
  return take(output, {
    ImportTableDescription: (_) => de_ImportTableDescription(_, context)
  });
};
var de_IncrementalExportSpecification = (output, context) => {
  return take(output, {
    ExportFromTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ExportToTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ExportViewType: expectString
  });
};
var de_ItemCollectionKeyAttributeMap = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_AttributeValue(awsExpectUnion(value), context);
    return acc;
  }, {});
};
var de_ItemCollectionMetrics = (output, context) => {
  return take(output, {
    ItemCollectionKey: (_) => de_ItemCollectionKeyAttributeMap(_, context),
    SizeEstimateRangeGB: (_) => de_ItemCollectionSizeEstimateRange(_, context)
  });
};
var de_ItemCollectionMetricsMultiple = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ItemCollectionMetrics(entry, context);
  });
  return retVal;
};
var de_ItemCollectionMetricsPerTable = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_ItemCollectionMetricsMultiple(value, context);
    return acc;
  }, {});
};
var de_ItemCollectionSizeEstimateRange = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return limitedParseDouble(entry);
  });
  return retVal;
};
var de_ItemList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_AttributeMap(entry, context);
  });
  return retVal;
};
var de_ItemResponse = (output, context) => {
  return take(output, {
    Item: (_) => de_AttributeMap(_, context)
  });
};
var de_ItemResponseList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ItemResponse(entry, context);
  });
  return retVal;
};
var de_Key = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_AttributeValue(awsExpectUnion(value), context);
    return acc;
  }, {});
};
var de_KeyList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_Key(entry, context);
  });
  return retVal;
};
var de_KeysAndAttributes = (output, context) => {
  return take(output, {
    AttributesToGet: _json,
    ConsistentRead: expectBoolean,
    ExpressionAttributeNames: _json,
    Keys: (_) => de_KeyList(_, context),
    ProjectionExpression: expectString
  });
};
var de_ListAttributeValue = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_AttributeValue(awsExpectUnion(entry), context);
  });
  return retVal;
};
var de_ListBackupsOutput = (output, context) => {
  return take(output, {
    BackupSummaries: (_) => de_BackupSummaries(_, context),
    LastEvaluatedBackupArn: expectString
  });
};
var de_ListImportsOutput = (output, context) => {
  return take(output, {
    ImportSummaryList: (_) => de_ImportSummaryList(_, context),
    NextToken: expectString
  });
};
var de_MapAttributeValue = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_AttributeValue(awsExpectUnion(value), context);
    return acc;
  }, {});
};
var de_PartiQLBatchResponse = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_BatchStatementResponse(entry, context);
  });
  return retVal;
};
var de_PointInTimeRecoveryDescription = (output, context) => {
  return take(output, {
    EarliestRestorableDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LatestRestorableDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    PointInTimeRecoveryStatus: expectString
  });
};
var de_ProvisionedThroughputDescription = (output, context) => {
  return take(output, {
    LastDecreaseDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastIncreaseDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    NumberOfDecreasesToday: expectLong,
    ReadCapacityUnits: expectLong,
    WriteCapacityUnits: expectLong
  });
};
var de_PutItemInputAttributeMap = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_AttributeValue(awsExpectUnion(value), context);
    return acc;
  }, {});
};
var de_PutItemOutput = (output, context) => {
  return take(output, {
    Attributes: (_) => de_AttributeMap(_, context),
    ConsumedCapacity: (_) => de_ConsumedCapacity(_, context),
    ItemCollectionMetrics: (_) => de_ItemCollectionMetrics(_, context)
  });
};
var de_PutRequest = (output, context) => {
  return take(output, {
    Item: (_) => de_PutItemInputAttributeMap(_, context)
  });
};
var de_QueryOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacity(_, context),
    Count: expectInt32,
    Items: (_) => de_ItemList(_, context),
    LastEvaluatedKey: (_) => de_Key(_, context),
    ScannedCount: expectInt32
  });
};
var de_ReplicaAutoScalingDescription = (output, context) => {
  return take(output, {
    GlobalSecondaryIndexes: (_) => de_ReplicaGlobalSecondaryIndexAutoScalingDescriptionList(_, context),
    RegionName: expectString,
    ReplicaProvisionedReadCapacityAutoScalingSettings: (_) => de_AutoScalingSettingsDescription(_, context),
    ReplicaProvisionedWriteCapacityAutoScalingSettings: (_) => de_AutoScalingSettingsDescription(_, context),
    ReplicaStatus: expectString
  });
};
var de_ReplicaAutoScalingDescriptionList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ReplicaAutoScalingDescription(entry, context);
  });
  return retVal;
};
var de_ReplicaDescription = (output, context) => {
  return take(output, {
    GlobalSecondaryIndexes: _json,
    KMSMasterKeyId: expectString,
    OnDemandThroughputOverride: _json,
    ProvisionedThroughputOverride: _json,
    RegionName: expectString,
    ReplicaInaccessibleDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ReplicaStatus: expectString,
    ReplicaStatusDescription: expectString,
    ReplicaStatusPercentProgress: expectString,
    ReplicaTableClassSummary: (_) => de_TableClassSummary(_, context)
  });
};
var de_ReplicaDescriptionList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ReplicaDescription(entry, context);
  });
  return retVal;
};
var de_ReplicaGlobalSecondaryIndexAutoScalingDescription = (output, context) => {
  return take(output, {
    IndexName: expectString,
    IndexStatus: expectString,
    ProvisionedReadCapacityAutoScalingSettings: (_) => de_AutoScalingSettingsDescription(_, context),
    ProvisionedWriteCapacityAutoScalingSettings: (_) => de_AutoScalingSettingsDescription(_, context)
  });
};
var de_ReplicaGlobalSecondaryIndexAutoScalingDescriptionList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ReplicaGlobalSecondaryIndexAutoScalingDescription(entry, context);
  });
  return retVal;
};
var de_ReplicaGlobalSecondaryIndexSettingsDescription = (output, context) => {
  return take(output, {
    IndexName: expectString,
    IndexStatus: expectString,
    ProvisionedReadCapacityAutoScalingSettings: (_) => de_AutoScalingSettingsDescription(_, context),
    ProvisionedReadCapacityUnits: expectLong,
    ProvisionedWriteCapacityAutoScalingSettings: (_) => de_AutoScalingSettingsDescription(_, context),
    ProvisionedWriteCapacityUnits: expectLong
  });
};
var de_ReplicaGlobalSecondaryIndexSettingsDescriptionList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ReplicaGlobalSecondaryIndexSettingsDescription(entry, context);
  });
  return retVal;
};
var de_ReplicaSettingsDescription = (output, context) => {
  return take(output, {
    RegionName: expectString,
    ReplicaBillingModeSummary: (_) => de_BillingModeSummary(_, context),
    ReplicaGlobalSecondaryIndexSettings: (_) => de_ReplicaGlobalSecondaryIndexSettingsDescriptionList(_, context),
    ReplicaProvisionedReadCapacityAutoScalingSettings: (_) => de_AutoScalingSettingsDescription(_, context),
    ReplicaProvisionedReadCapacityUnits: expectLong,
    ReplicaProvisionedWriteCapacityAutoScalingSettings: (_) => de_AutoScalingSettingsDescription(_, context),
    ReplicaProvisionedWriteCapacityUnits: expectLong,
    ReplicaStatus: expectString,
    ReplicaTableClassSummary: (_) => de_TableClassSummary(_, context)
  });
};
var de_ReplicaSettingsDescriptionList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ReplicaSettingsDescription(entry, context);
  });
  return retVal;
};
var de_RestoreSummary = (output, context) => {
  return take(output, {
    RestoreDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    RestoreInProgress: expectBoolean,
    SourceBackupArn: expectString,
    SourceTableArn: expectString
  });
};
var de_RestoreTableFromBackupOutput = (output, context) => {
  return take(output, {
    TableDescription: (_) => de_TableDescription(_, context)
  });
};
var de_RestoreTableToPointInTimeOutput = (output, context) => {
  return take(output, {
    TableDescription: (_) => de_TableDescription(_, context)
  });
};
var de_ScanOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacity(_, context),
    Count: expectInt32,
    Items: (_) => de_ItemList(_, context),
    LastEvaluatedKey: (_) => de_Key(_, context),
    ScannedCount: expectInt32
  });
};
var de_SecondaryIndexesCapacityMap = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = de_Capacity(value, context);
    return acc;
  }, {});
};
var de_SourceTableDetails = (output, context) => {
  return take(output, {
    BillingMode: expectString,
    ItemCount: expectLong,
    KeySchema: _json,
    OnDemandThroughput: _json,
    ProvisionedThroughput: _json,
    TableArn: expectString,
    TableCreationDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    TableId: expectString,
    TableName: expectString,
    TableSizeBytes: expectLong
  });
};
var de_SourceTableFeatureDetails = (output, context) => {
  return take(output, {
    GlobalSecondaryIndexes: _json,
    LocalSecondaryIndexes: _json,
    SSEDescription: (_) => de_SSEDescription(_, context),
    StreamDescription: _json,
    TimeToLiveDescription: _json
  });
};
var de_SSEDescription = (output, context) => {
  return take(output, {
    InaccessibleEncryptionDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    KMSMasterKeyArn: expectString,
    SSEType: expectString,
    Status: expectString
  });
};
var de_TableAutoScalingDescription = (output, context) => {
  return take(output, {
    Replicas: (_) => de_ReplicaAutoScalingDescriptionList(_, context),
    TableName: expectString,
    TableStatus: expectString
  });
};
var de_TableClassSummary = (output, context) => {
  return take(output, {
    LastUpdateDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    TableClass: expectString
  });
};
var de_TableDescription = (output, context) => {
  return take(output, {
    ArchivalSummary: (_) => de_ArchivalSummary(_, context),
    AttributeDefinitions: _json,
    BillingModeSummary: (_) => de_BillingModeSummary(_, context),
    CreationDateTime: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    DeletionProtectionEnabled: expectBoolean,
    GlobalSecondaryIndexes: (_) => de_GlobalSecondaryIndexDescriptionList(_, context),
    GlobalTableVersion: expectString,
    ItemCount: expectLong,
    KeySchema: _json,
    LatestStreamArn: expectString,
    LatestStreamLabel: expectString,
    LocalSecondaryIndexes: _json,
    OnDemandThroughput: _json,
    ProvisionedThroughput: (_) => de_ProvisionedThroughputDescription(_, context),
    Replicas: (_) => de_ReplicaDescriptionList(_, context),
    RestoreSummary: (_) => de_RestoreSummary(_, context),
    SSEDescription: (_) => de_SSEDescription(_, context),
    StreamSpecification: _json,
    TableArn: expectString,
    TableClassSummary: (_) => de_TableClassSummary(_, context),
    TableId: expectString,
    TableName: expectString,
    TableSizeBytes: expectLong,
    TableStatus: expectString
  });
};
var de_TransactGetItemsOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacityMultiple(_, context),
    Responses: (_) => de_ItemResponseList(_, context)
  });
};
var de_TransactionCanceledException = (output, context) => {
  return take(output, {
    CancellationReasons: (_) => de_CancellationReasonList(_, context),
    Message: expectString
  });
};
var de_TransactWriteItemsOutput = (output, context) => {
  return take(output, {
    ConsumedCapacity: (_) => de_ConsumedCapacityMultiple(_, context),
    ItemCollectionMetrics: (_) => de_ItemCollectionMetricsPerTable(_, context)
  });
};
var de_UpdateContinuousBackupsOutput = (output, context) => {
  return take(output, {
    ContinuousBackupsDescription: (_) => de_ContinuousBackupsDescription(_, context)
  });
};
var de_UpdateGlobalTableOutput = (output, context) => {
  return take(output, {
    GlobalTableDescription: (_) => de_GlobalTableDescription(_, context)
  });
};
var de_UpdateGlobalTableSettingsOutput = (output, context) => {
  return take(output, {
    GlobalTableName: expectString,
    ReplicaSettings: (_) => de_ReplicaSettingsDescriptionList(_, context)
  });
};
var de_UpdateItemOutput = (output, context) => {
  return take(output, {
    Attributes: (_) => de_AttributeMap(_, context),
    ConsumedCapacity: (_) => de_ConsumedCapacity(_, context),
    ItemCollectionMetrics: (_) => de_ItemCollectionMetrics(_, context)
  });
};
var de_UpdateTableOutput = (output, context) => {
  return take(output, {
    TableDescription: (_) => de_TableDescription(_, context)
  });
};
var de_UpdateTableReplicaAutoScalingOutput = (output, context) => {
  return take(output, {
    TableAutoScalingDescription: (_) => de_TableAutoScalingDescription(_, context)
  });
};
var de_WriteRequest = (output, context) => {
  return take(output, {
    DeleteRequest: (_) => de_DeleteRequest(_, context),
    PutRequest: (_) => de_PutRequest(_, context)
  });
};
var de_WriteRequests = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_WriteRequest(entry, context);
  });
  return retVal;
};
var deserializeMetadata = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var throwDefaultError = withBaseException(DynamoDBServiceException);
var buildHttpRpcRequest = (context, headers, path, resolvedHostname, body) => __async(void 0, null, function* () {
  const { hostname, protocol = "https", port, path: basePath } = yield context.endpoint();
  const contents = {
    protocol,
    hostname,
    port,
    method: "POST",
    path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
    headers
  };
  if (resolvedHostname !== void 0) {
    contents.hostname = resolvedHostname;
  }
  if (body !== void 0) {
    contents.body = body;
  }
  return new HttpRequest(contents);
});
function sharedHeaders(operation) {
  return {
    "content-type": "application/x-amz-json-1.0",
    "x-amz-target": `DynamoDB_20120810.${operation}`
  };
}

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeEndpointsCommand.js
var DescribeEndpointsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeEndpoints", {}).n("DynamoDBClient", "DescribeEndpointsCommand").f(void 0, void 0).ser(se_DescribeEndpointsCommand).de(de_DescribeEndpointsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/package.json
var package_default = {
  name: "@aws-sdk/client-dynamodb",
  description: "AWS SDK for JavaScript Dynamodb Client for Node.js, Browser and React Native",
  version: "3.645.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "node ../../scripts/compilation/inline client-dynamodb",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo dynamodb"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "5.2.0",
    "@aws-crypto/sha256-js": "5.2.0",
    "@aws-sdk/client-sso-oidc": "3.645.0",
    "@aws-sdk/client-sts": "3.645.0",
    "@aws-sdk/core": "3.635.0",
    "@aws-sdk/credential-provider-node": "3.645.0",
    "@aws-sdk/middleware-endpoint-discovery": "3.620.0",
    "@aws-sdk/middleware-host-header": "3.620.0",
    "@aws-sdk/middleware-logger": "3.609.0",
    "@aws-sdk/middleware-recursion-detection": "3.620.0",
    "@aws-sdk/middleware-user-agent": "3.645.0",
    "@aws-sdk/region-config-resolver": "3.614.0",
    "@aws-sdk/types": "3.609.0",
    "@aws-sdk/util-endpoints": "3.645.0",
    "@aws-sdk/util-user-agent-browser": "3.609.0",
    "@aws-sdk/util-user-agent-node": "3.614.0",
    "@smithy/config-resolver": "^3.0.5",
    "@smithy/core": "^2.4.0",
    "@smithy/fetch-http-handler": "^3.2.4",
    "@smithy/hash-node": "^3.0.3",
    "@smithy/invalid-dependency": "^3.0.3",
    "@smithy/middleware-content-length": "^3.0.5",
    "@smithy/middleware-endpoint": "^3.1.0",
    "@smithy/middleware-retry": "^3.0.15",
    "@smithy/middleware-serde": "^3.0.3",
    "@smithy/middleware-stack": "^3.0.3",
    "@smithy/node-config-provider": "^3.1.4",
    "@smithy/node-http-handler": "^3.1.4",
    "@smithy/protocol-http": "^4.1.0",
    "@smithy/smithy-client": "^3.2.0",
    "@smithy/types": "^3.3.0",
    "@smithy/url-parser": "^3.0.3",
    "@smithy/util-base64": "^3.0.0",
    "@smithy/util-body-length-browser": "^3.0.0",
    "@smithy/util-body-length-node": "^3.0.0",
    "@smithy/util-defaults-mode-browser": "^3.0.15",
    "@smithy/util-defaults-mode-node": "^3.0.15",
    "@smithy/util-endpoints": "^2.0.5",
    "@smithy/util-middleware": "^3.0.3",
    "@smithy/util-retry": "^3.0.3",
    "@smithy/util-utf8": "^3.0.0",
    "@smithy/util-waiter": "^3.1.2",
    tslib: "^2.6.2",
    uuid: "^9.0.1"
  },
  devDependencies: {
    "@tsconfig/node16": "16.1.3",
    "@types/node": "^16.18.96",
    "@types/uuid": "^9.0.4",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=16.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-dynamodb",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-dynamodb"
  }
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/ruleset.js
var w = "required";
var x = "fn";
var y = "argv";
var z = "ref";
var a = true;
var b = "isSet";
var c = "booleanEquals";
var d = "error";
var e = "endpoint";
var f2 = "tree";
var g = "PartitionResult";
var h = "getAttr";
var i = "stringEquals";
var j = { [w]: false, "type": "String" };
var k = { [w]: true, "default": false, "type": "Boolean" };
var l = { [z]: "Endpoint" };
var m = { [x]: c, [y]: [{ [z]: "UseFIPS" }, true] };
var n = { [x]: c, [y]: [{ [z]: "UseDualStack" }, true] };
var o = {};
var p = { [z]: "Region" };
var q = { [x]: h, [y]: [{ [z]: g }, "supportsFIPS"] };
var r = { [z]: g };
var s = { [x]: c, [y]: [true, { [x]: h, [y]: [r, "supportsDualStack"] }] };
var t = [m];
var u = [n];
var v = [p];
var _data = { version: "1.0", parameters: { Region: j, UseDualStack: k, UseFIPS: k, Endpoint: j }, rules: [{ conditions: [{ [x]: b, [y]: [l] }], rules: [{ conditions: t, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: u, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: l, properties: o, headers: o }, type: e }], type: f2 }, { conditions: [{ [x]: b, [y]: v }], rules: [{ conditions: [{ [x]: "aws.partition", [y]: v, assign: g }], rules: [{ conditions: [m, n], rules: [{ conditions: [{ [x]: c, [y]: [a, q] }, s], rules: [{ endpoint: { url: "https://dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: o, headers: o }, type: e }], type: f2 }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f2 }, { conditions: t, rules: [{ conditions: [{ [x]: c, [y]: [q, a] }], rules: [{ conditions: [{ [x]: i, [y]: [{ [x]: h, [y]: [r, "name"] }, "aws-us-gov"] }], endpoint: { url: "https://dynamodb.{Region}.amazonaws.com", properties: o, headers: o }, type: e }, { endpoint: { url: "https://dynamodb-fips.{Region}.{PartitionResult#dnsSuffix}", properties: o, headers: o }, type: e }], type: f2 }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f2 }, { conditions: u, rules: [{ conditions: [s], rules: [{ endpoint: { url: "https://dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: o, headers: o }, type: e }], type: f2 }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f2 }, { conditions: [{ [x]: i, [y]: [p, "local"] }], endpoint: { url: "http://localhost:8000", properties: { authSchemes: [{ name: "sigv4", signingName: "dynamodb", signingRegion: "us-east-1" }] }, headers: o }, type: e }, { endpoint: { url: "https://dynamodb.{Region}.{PartitionResult#dnsSuffix}", properties: o, headers: o }, type: e }], type: f2 }], type: f2 }, { error: "Invalid Configuration: Missing Region", type: d }] };
var ruleSet = _data;

// node_modules/@aws-sdk/client-dynamodb/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  });
};
customEndpointFunctions.aws = awsEndpointFunctions;

// node_modules/@aws-sdk/client-dynamodb/dist-es/runtimeConfig.shared.js
var getRuntimeConfig = (config) => {
  return {
    apiVersion: "2012-08-10",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultDynamoDBHttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new AwsSdkSigV4Signer()
      }
    ],
    logger: config?.logger ?? new NoOpLogger(),
    serviceId: config?.serviceId ?? "DynamoDB",
    urlParser: config?.urlParser ?? parseUrl,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/runtimeConfig.browser.js
var getRuntimeConfig2 = (config) => {
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig(config);
  return __spreadProps(__spreadValues(__spreadValues({}, clientSharedValues), config), {
    runtime: "browser",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? ((_) => () => Promise.reject(new Error("Credential is missing"))),
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default.version }),
    endpointDiscoveryEnabledProvider: config?.endpointDiscoveryEnabledProvider ?? (() => Promise.resolve(void 0)),
    maxAttempts: config?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
    region: config?.region ?? invalidProvider("Region is missing"),
    requestHandler: FetchHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
    retryMode: config?.retryMode ?? (() => __async(void 0, null, function* () {
      return (yield defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE;
    })),
    sha256: config?.sha256 ?? Sha256,
    streamCollector: config?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? (() => Promise.resolve(DEFAULT_USE_DUALSTACK_ENDPOINT)),
    useFipsEndpoint: config?.useFipsEndpoint ?? (() => Promise.resolve(DEFAULT_USE_FIPS_ENDPOINT))
  });
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/auth/httpAuthExtensionConfiguration.js
var getHttpAuthExtensionConfiguration = (runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      }
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    }
  };
};
var resolveHttpAuthRuntimeConfig = (config) => {
  return {
    httpAuthSchemes: config.httpAuthSchemes(),
    httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
    credentials: config.credentials()
  };
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/runtimeExtensions.js
var asPartial = (t2) => t2;
var resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, asPartial(getAwsRegionExtensionConfiguration(runtimeConfig))), asPartial(getDefaultExtensionConfiguration(runtimeConfig))), asPartial(getHttpHandlerExtensionConfiguration(runtimeConfig))), asPartial(getHttpAuthExtensionConfiguration(runtimeConfig)));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, runtimeConfig), resolveAwsRegionExtensionConfiguration(extensionConfiguration)), resolveDefaultRuntimeConfig(extensionConfiguration)), resolveHttpHandlerRuntimeConfig(extensionConfiguration)), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/DynamoDBClient.js
var DynamoDBClient = class extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig2(configuration || {});
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveRetryConfig(_config_2);
    const _config_4 = resolveRegionConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveEndpointConfig(_config_5);
    const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
    const _config_8 = resolveEndpointDiscoveryConfig(_config_7, {
      endpointDiscoveryCommandCtor: DescribeEndpointsCommand
    });
    const _config_9 = resolveRuntimeExtensions(_config_8, configuration?.extensions || []);
    super(_config_9);
    this.config = _config_9;
    this.middlewareStack.use(getUserAgentPlugin(this.config));
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
      httpAuthSchemeParametersProvider: defaultDynamoDBHttpAuthSchemeParametersProvider,
      identityProviderConfigProvider: (config) => __async(this, null, function* () {
        return new DefaultIdentityProviderConfig({
          "aws.auth#sigv4": config.credentials
        });
      })
    }));
    this.middlewareStack.use(getHttpSigningPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/BatchExecuteStatementCommand.js
var BatchExecuteStatementCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "BatchExecuteStatement", {}).n("DynamoDBClient", "BatchExecuteStatementCommand").f(void 0, void 0).ser(se_BatchExecuteStatementCommand).de(de_BatchExecuteStatementCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/BatchGetItemCommand.js
var BatchGetItemCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "BatchGetItem", {}).n("DynamoDBClient", "BatchGetItemCommand").f(void 0, void 0).ser(se_BatchGetItemCommand).de(de_BatchGetItemCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/BatchWriteItemCommand.js
var BatchWriteItemCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "BatchWriteItem", {}).n("DynamoDBClient", "BatchWriteItemCommand").f(void 0, void 0).ser(se_BatchWriteItemCommand).de(de_BatchWriteItemCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/CreateBackupCommand.js
var CreateBackupCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "CreateBackup", {}).n("DynamoDBClient", "CreateBackupCommand").f(void 0, void 0).ser(se_CreateBackupCommand).de(de_CreateBackupCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/CreateGlobalTableCommand.js
var CreateGlobalTableCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "CreateGlobalTable", {}).n("DynamoDBClient", "CreateGlobalTableCommand").f(void 0, void 0).ser(se_CreateGlobalTableCommand).de(de_CreateGlobalTableCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/CreateTableCommand.js
var CreateTableCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "CreateTable", {}).n("DynamoDBClient", "CreateTableCommand").f(void 0, void 0).ser(se_CreateTableCommand).de(de_CreateTableCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DeleteBackupCommand.js
var DeleteBackupCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DeleteBackup", {}).n("DynamoDBClient", "DeleteBackupCommand").f(void 0, void 0).ser(se_DeleteBackupCommand).de(de_DeleteBackupCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DeleteItemCommand.js
var DeleteItemCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DeleteItem", {}).n("DynamoDBClient", "DeleteItemCommand").f(void 0, void 0).ser(se_DeleteItemCommand).de(de_DeleteItemCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DeleteResourcePolicyCommand.js
var DeleteResourcePolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DeleteResourcePolicy", {}).n("DynamoDBClient", "DeleteResourcePolicyCommand").f(void 0, void 0).ser(se_DeleteResourcePolicyCommand).de(de_DeleteResourcePolicyCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DeleteTableCommand.js
var DeleteTableCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DeleteTable", {}).n("DynamoDBClient", "DeleteTableCommand").f(void 0, void 0).ser(se_DeleteTableCommand).de(de_DeleteTableCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeBackupCommand.js
var DescribeBackupCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeBackup", {}).n("DynamoDBClient", "DescribeBackupCommand").f(void 0, void 0).ser(se_DescribeBackupCommand).de(de_DescribeBackupCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeContinuousBackupsCommand.js
var DescribeContinuousBackupsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeContinuousBackups", {}).n("DynamoDBClient", "DescribeContinuousBackupsCommand").f(void 0, void 0).ser(se_DescribeContinuousBackupsCommand).de(de_DescribeContinuousBackupsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeContributorInsightsCommand.js
var DescribeContributorInsightsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeContributorInsights", {}).n("DynamoDBClient", "DescribeContributorInsightsCommand").f(void 0, void 0).ser(se_DescribeContributorInsightsCommand).de(de_DescribeContributorInsightsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeExportCommand.js
var DescribeExportCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeExport", {}).n("DynamoDBClient", "DescribeExportCommand").f(void 0, void 0).ser(se_DescribeExportCommand).de(de_DescribeExportCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeGlobalTableCommand.js
var DescribeGlobalTableCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeGlobalTable", {}).n("DynamoDBClient", "DescribeGlobalTableCommand").f(void 0, void 0).ser(se_DescribeGlobalTableCommand).de(de_DescribeGlobalTableCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeGlobalTableSettingsCommand.js
var DescribeGlobalTableSettingsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeGlobalTableSettings", {}).n("DynamoDBClient", "DescribeGlobalTableSettingsCommand").f(void 0, void 0).ser(se_DescribeGlobalTableSettingsCommand).de(de_DescribeGlobalTableSettingsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeImportCommand.js
var DescribeImportCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeImport", {}).n("DynamoDBClient", "DescribeImportCommand").f(void 0, void 0).ser(se_DescribeImportCommand).de(de_DescribeImportCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeKinesisStreamingDestinationCommand.js
var DescribeKinesisStreamingDestinationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeKinesisStreamingDestination", {}).n("DynamoDBClient", "DescribeKinesisStreamingDestinationCommand").f(void 0, void 0).ser(se_DescribeKinesisStreamingDestinationCommand).de(de_DescribeKinesisStreamingDestinationCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeLimitsCommand.js
var DescribeLimitsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeLimits", {}).n("DynamoDBClient", "DescribeLimitsCommand").f(void 0, void 0).ser(se_DescribeLimitsCommand).de(de_DescribeLimitsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeTableCommand.js
var DescribeTableCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeTable", {}).n("DynamoDBClient", "DescribeTableCommand").f(void 0, void 0).ser(se_DescribeTableCommand).de(de_DescribeTableCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeTableReplicaAutoScalingCommand.js
var DescribeTableReplicaAutoScalingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeTableReplicaAutoScaling", {}).n("DynamoDBClient", "DescribeTableReplicaAutoScalingCommand").f(void 0, void 0).ser(se_DescribeTableReplicaAutoScalingCommand).de(de_DescribeTableReplicaAutoScalingCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DescribeTimeToLiveCommand.js
var DescribeTimeToLiveCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DescribeTimeToLive", {}).n("DynamoDBClient", "DescribeTimeToLiveCommand").f(void 0, void 0).ser(se_DescribeTimeToLiveCommand).de(de_DescribeTimeToLiveCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/DisableKinesisStreamingDestinationCommand.js
var DisableKinesisStreamingDestinationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "DisableKinesisStreamingDestination", {}).n("DynamoDBClient", "DisableKinesisStreamingDestinationCommand").f(void 0, void 0).ser(se_DisableKinesisStreamingDestinationCommand).de(de_DisableKinesisStreamingDestinationCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/EnableKinesisStreamingDestinationCommand.js
var EnableKinesisStreamingDestinationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "EnableKinesisStreamingDestination", {}).n("DynamoDBClient", "EnableKinesisStreamingDestinationCommand").f(void 0, void 0).ser(se_EnableKinesisStreamingDestinationCommand).de(de_EnableKinesisStreamingDestinationCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ExecuteStatementCommand.js
var ExecuteStatementCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ExecuteStatement", {}).n("DynamoDBClient", "ExecuteStatementCommand").f(void 0, void 0).ser(se_ExecuteStatementCommand).de(de_ExecuteStatementCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ExecuteTransactionCommand.js
var ExecuteTransactionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ExecuteTransaction", {}).n("DynamoDBClient", "ExecuteTransactionCommand").f(void 0, void 0).ser(se_ExecuteTransactionCommand).de(de_ExecuteTransactionCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ExportTableToPointInTimeCommand.js
var ExportTableToPointInTimeCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ExportTableToPointInTime", {}).n("DynamoDBClient", "ExportTableToPointInTimeCommand").f(void 0, void 0).ser(se_ExportTableToPointInTimeCommand).de(de_ExportTableToPointInTimeCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/GetItemCommand.js
var GetItemCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "GetItem", {}).n("DynamoDBClient", "GetItemCommand").f(void 0, void 0).ser(se_GetItemCommand).de(de_GetItemCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/GetResourcePolicyCommand.js
var GetResourcePolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "GetResourcePolicy", {}).n("DynamoDBClient", "GetResourcePolicyCommand").f(void 0, void 0).ser(se_GetResourcePolicyCommand).de(de_GetResourcePolicyCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ImportTableCommand.js
var ImportTableCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ImportTable", {}).n("DynamoDBClient", "ImportTableCommand").f(void 0, void 0).ser(se_ImportTableCommand).de(de_ImportTableCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ListBackupsCommand.js
var ListBackupsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ListBackups", {}).n("DynamoDBClient", "ListBackupsCommand").f(void 0, void 0).ser(se_ListBackupsCommand).de(de_ListBackupsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ListContributorInsightsCommand.js
var ListContributorInsightsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ListContributorInsights", {}).n("DynamoDBClient", "ListContributorInsightsCommand").f(void 0, void 0).ser(se_ListContributorInsightsCommand).de(de_ListContributorInsightsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ListExportsCommand.js
var ListExportsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ListExports", {}).n("DynamoDBClient", "ListExportsCommand").f(void 0, void 0).ser(se_ListExportsCommand).de(de_ListExportsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ListGlobalTablesCommand.js
var ListGlobalTablesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ListGlobalTables", {}).n("DynamoDBClient", "ListGlobalTablesCommand").f(void 0, void 0).ser(se_ListGlobalTablesCommand).de(de_ListGlobalTablesCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ListImportsCommand.js
var ListImportsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ListImports", {}).n("DynamoDBClient", "ListImportsCommand").f(void 0, void 0).ser(se_ListImportsCommand).de(de_ListImportsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ListTablesCommand.js
var ListTablesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ListTables", {}).n("DynamoDBClient", "ListTablesCommand").f(void 0, void 0).ser(se_ListTablesCommand).de(de_ListTablesCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ListTagsOfResourceCommand.js
var ListTagsOfResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "ListTagsOfResource", {}).n("DynamoDBClient", "ListTagsOfResourceCommand").f(void 0, void 0).ser(se_ListTagsOfResourceCommand).de(de_ListTagsOfResourceCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/PutItemCommand.js
var PutItemCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "PutItem", {}).n("DynamoDBClient", "PutItemCommand").f(void 0, void 0).ser(se_PutItemCommand).de(de_PutItemCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/PutResourcePolicyCommand.js
var PutResourcePolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "PutResourcePolicy", {}).n("DynamoDBClient", "PutResourcePolicyCommand").f(void 0, void 0).ser(se_PutResourcePolicyCommand).de(de_PutResourcePolicyCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/QueryCommand.js
var QueryCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "Query", {}).n("DynamoDBClient", "QueryCommand").f(void 0, void 0).ser(se_QueryCommand).de(de_QueryCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/RestoreTableFromBackupCommand.js
var RestoreTableFromBackupCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "RestoreTableFromBackup", {}).n("DynamoDBClient", "RestoreTableFromBackupCommand").f(void 0, void 0).ser(se_RestoreTableFromBackupCommand).de(de_RestoreTableFromBackupCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/RestoreTableToPointInTimeCommand.js
var RestoreTableToPointInTimeCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "RestoreTableToPointInTime", {}).n("DynamoDBClient", "RestoreTableToPointInTimeCommand").f(void 0, void 0).ser(se_RestoreTableToPointInTimeCommand).de(de_RestoreTableToPointInTimeCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/ScanCommand.js
var ScanCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "Scan", {}).n("DynamoDBClient", "ScanCommand").f(void 0, void 0).ser(se_ScanCommand).de(de_ScanCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/TagResourceCommand.js
var TagResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "TagResource", {}).n("DynamoDBClient", "TagResourceCommand").f(void 0, void 0).ser(se_TagResourceCommand).de(de_TagResourceCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/TransactGetItemsCommand.js
var TransactGetItemsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "TransactGetItems", {}).n("DynamoDBClient", "TransactGetItemsCommand").f(void 0, void 0).ser(se_TransactGetItemsCommand).de(de_TransactGetItemsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/TransactWriteItemsCommand.js
var TransactWriteItemsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "TransactWriteItems", {}).n("DynamoDBClient", "TransactWriteItemsCommand").f(void 0, void 0).ser(se_TransactWriteItemsCommand).de(de_TransactWriteItemsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UntagResourceCommand.js
var UntagResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UntagResource", {}).n("DynamoDBClient", "UntagResourceCommand").f(void 0, void 0).ser(se_UntagResourceCommand).de(de_UntagResourceCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UpdateContinuousBackupsCommand.js
var UpdateContinuousBackupsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UpdateContinuousBackups", {}).n("DynamoDBClient", "UpdateContinuousBackupsCommand").f(void 0, void 0).ser(se_UpdateContinuousBackupsCommand).de(de_UpdateContinuousBackupsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UpdateContributorInsightsCommand.js
var UpdateContributorInsightsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UpdateContributorInsights", {}).n("DynamoDBClient", "UpdateContributorInsightsCommand").f(void 0, void 0).ser(se_UpdateContributorInsightsCommand).de(de_UpdateContributorInsightsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UpdateGlobalTableCommand.js
var UpdateGlobalTableCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UpdateGlobalTable", {}).n("DynamoDBClient", "UpdateGlobalTableCommand").f(void 0, void 0).ser(se_UpdateGlobalTableCommand).de(de_UpdateGlobalTableCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UpdateGlobalTableSettingsCommand.js
var UpdateGlobalTableSettingsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UpdateGlobalTableSettings", {}).n("DynamoDBClient", "UpdateGlobalTableSettingsCommand").f(void 0, void 0).ser(se_UpdateGlobalTableSettingsCommand).de(de_UpdateGlobalTableSettingsCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UpdateItemCommand.js
var UpdateItemCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UpdateItem", {}).n("DynamoDBClient", "UpdateItemCommand").f(void 0, void 0).ser(se_UpdateItemCommand).de(de_UpdateItemCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UpdateKinesisStreamingDestinationCommand.js
var UpdateKinesisStreamingDestinationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UpdateKinesisStreamingDestination", {}).n("DynamoDBClient", "UpdateKinesisStreamingDestinationCommand").f(void 0, void 0).ser(se_UpdateKinesisStreamingDestinationCommand).de(de_UpdateKinesisStreamingDestinationCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UpdateTableCommand.js
var UpdateTableCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UpdateTable", {}).n("DynamoDBClient", "UpdateTableCommand").f(void 0, void 0).ser(se_UpdateTableCommand).de(de_UpdateTableCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UpdateTableReplicaAutoScalingCommand.js
var UpdateTableReplicaAutoScalingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UpdateTableReplicaAutoScaling", {}).n("DynamoDBClient", "UpdateTableReplicaAutoScalingCommand").f(void 0, void 0).ser(se_UpdateTableReplicaAutoScalingCommand).de(de_UpdateTableReplicaAutoScalingCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/commands/UpdateTimeToLiveCommand.js
var UpdateTimeToLiveCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("DynamoDB_20120810", "UpdateTimeToLive", {}).n("DynamoDBClient", "UpdateTimeToLiveCommand").f(void 0, void 0).ser(se_UpdateTimeToLiveCommand).de(de_UpdateTimeToLiveCommand).build() {
};

// node_modules/@aws-sdk/client-dynamodb/dist-es/DynamoDB.js
var commands = {
  BatchExecuteStatementCommand,
  BatchGetItemCommand,
  BatchWriteItemCommand,
  CreateBackupCommand,
  CreateGlobalTableCommand,
  CreateTableCommand,
  DeleteBackupCommand,
  DeleteItemCommand,
  DeleteResourcePolicyCommand,
  DeleteTableCommand,
  DescribeBackupCommand,
  DescribeContinuousBackupsCommand,
  DescribeContributorInsightsCommand,
  DescribeEndpointsCommand,
  DescribeExportCommand,
  DescribeGlobalTableCommand,
  DescribeGlobalTableSettingsCommand,
  DescribeImportCommand,
  DescribeKinesisStreamingDestinationCommand,
  DescribeLimitsCommand,
  DescribeTableCommand,
  DescribeTableReplicaAutoScalingCommand,
  DescribeTimeToLiveCommand,
  DisableKinesisStreamingDestinationCommand,
  EnableKinesisStreamingDestinationCommand,
  ExecuteStatementCommand,
  ExecuteTransactionCommand,
  ExportTableToPointInTimeCommand,
  GetItemCommand,
  GetResourcePolicyCommand,
  ImportTableCommand,
  ListBackupsCommand,
  ListContributorInsightsCommand,
  ListExportsCommand,
  ListGlobalTablesCommand,
  ListImportsCommand,
  ListTablesCommand,
  ListTagsOfResourceCommand,
  PutItemCommand,
  PutResourcePolicyCommand,
  QueryCommand,
  RestoreTableFromBackupCommand,
  RestoreTableToPointInTimeCommand,
  ScanCommand,
  TagResourceCommand,
  TransactGetItemsCommand,
  TransactWriteItemsCommand,
  UntagResourceCommand,
  UpdateContinuousBackupsCommand,
  UpdateContributorInsightsCommand,
  UpdateGlobalTableCommand,
  UpdateGlobalTableSettingsCommand,
  UpdateItemCommand,
  UpdateKinesisStreamingDestinationCommand,
  UpdateTableCommand,
  UpdateTableReplicaAutoScalingCommand,
  UpdateTimeToLiveCommand
};
var DynamoDB = class extends DynamoDBClient {
};
createAggregatedClient(commands, DynamoDB);

// node_modules/@aws-sdk/client-dynamodb/dist-es/pagination/ListContributorInsightsPaginator.js
var paginateListContributorInsights = createPaginator(DynamoDBClient, ListContributorInsightsCommand, "NextToken", "NextToken", "MaxResults");

// node_modules/@aws-sdk/client-dynamodb/dist-es/pagination/ListExportsPaginator.js
var paginateListExports = createPaginator(DynamoDBClient, ListExportsCommand, "NextToken", "NextToken", "MaxResults");

// node_modules/@aws-sdk/client-dynamodb/dist-es/pagination/ListImportsPaginator.js
var paginateListImports = createPaginator(DynamoDBClient, ListImportsCommand, "NextToken", "NextToken", "PageSize");

// node_modules/@aws-sdk/client-dynamodb/dist-es/pagination/ListTablesPaginator.js
var paginateListTables = createPaginator(DynamoDBClient, ListTablesCommand, "ExclusiveStartTableName", "LastEvaluatedTableName", "Limit");

// node_modules/@aws-sdk/client-dynamodb/dist-es/pagination/QueryPaginator.js
var paginateQuery = createPaginator(DynamoDBClient, QueryCommand, "ExclusiveStartKey", "LastEvaluatedKey", "Limit");

// node_modules/@aws-sdk/client-dynamodb/dist-es/pagination/ScanPaginator.js
var paginateScan = createPaginator(DynamoDBClient, ScanCommand, "ExclusiveStartKey", "LastEvaluatedKey", "Limit");

// node_modules/@aws-sdk/client-dynamodb/dist-es/waiters/waitForTableExists.js
var checkState = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new DescribeTableCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.Table.TableStatus;
      };
      if (returnComparator() === "ACTIVE") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
    if (exception.name && exception.name == "ResourceNotFoundException") {
      return { state: WaiterState.RETRY, reason };
    }
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForTableExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 20, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState);
});
var waitUntilTableExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 20, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-dynamodb/dist-es/waiters/waitForTableNotExists.js
var checkState2 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new DescribeTableCommand(input));
    reason = result;
  } catch (exception) {
    reason = exception;
    if (exception.name && exception.name == "ResourceNotFoundException") {
      return { state: WaiterState.SUCCESS, reason };
    }
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForTableNotExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 20, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState2);
});
var waitUntilTableNotExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 20, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState2);
  return checkExceptions(result);
});
export {
  Command as $Command,
  ApproximateCreationDateTimePrecision,
  AttributeAction,
  AttributeValue,
  BackupInUseException,
  BackupNotFoundException,
  BackupStatus,
  BackupType,
  BackupTypeFilter,
  BatchExecuteStatementCommand,
  BatchGetItemCommand,
  BatchStatementErrorCodeEnum,
  BatchWriteItemCommand,
  BillingMode,
  ComparisonOperator,
  ConditionalCheckFailedException,
  ConditionalOperator,
  ContinuousBackupsStatus,
  ContinuousBackupsUnavailableException,
  ContributorInsightsAction,
  ContributorInsightsStatus,
  CreateBackupCommand,
  CreateGlobalTableCommand,
  CreateTableCommand,
  DeleteBackupCommand,
  DeleteItemCommand,
  DeleteResourcePolicyCommand,
  DeleteTableCommand,
  DescribeBackupCommand,
  DescribeContinuousBackupsCommand,
  DescribeContributorInsightsCommand,
  DescribeEndpointsCommand,
  DescribeExportCommand,
  DescribeGlobalTableCommand,
  DescribeGlobalTableSettingsCommand,
  DescribeImportCommand,
  DescribeKinesisStreamingDestinationCommand,
  DescribeLimitsCommand,
  DescribeTableCommand,
  DescribeTableReplicaAutoScalingCommand,
  DescribeTimeToLiveCommand,
  DestinationStatus,
  DisableKinesisStreamingDestinationCommand,
  DuplicateItemException,
  DynamoDB,
  DynamoDBClient,
  DynamoDBServiceException,
  EnableKinesisStreamingDestinationCommand,
  ExecuteStatementCommand,
  ExecuteTransactionCommand,
  ExportConflictException,
  ExportFormat,
  ExportNotFoundException,
  ExportStatus,
  ExportTableToPointInTimeCommand,
  ExportType,
  ExportViewType,
  GetItemCommand,
  GetResourcePolicyCommand,
  GlobalTableAlreadyExistsException,
  GlobalTableNotFoundException,
  GlobalTableStatus,
  IdempotentParameterMismatchException,
  ImportConflictException,
  ImportNotFoundException,
  ImportStatus,
  ImportTableCommand,
  IndexNotFoundException,
  IndexStatus,
  InputCompressionType,
  InputFormat,
  InternalServerError,
  InvalidEndpointException,
  InvalidExportTimeException,
  InvalidRestoreTimeException,
  ItemCollectionSizeLimitExceededException,
  KeyType,
  LimitExceededException,
  ListBackupsCommand,
  ListContributorInsightsCommand,
  ListExportsCommand,
  ListGlobalTablesCommand,
  ListImportsCommand,
  ListTablesCommand,
  ListTagsOfResourceCommand,
  PointInTimeRecoveryStatus,
  PointInTimeRecoveryUnavailableException,
  PolicyNotFoundException,
  ProjectionType,
  ProvisionedThroughputExceededException,
  PutItemCommand,
  PutResourcePolicyCommand,
  QueryCommand,
  ReplicaAlreadyExistsException,
  ReplicaNotFoundException,
  ReplicaStatus,
  RequestLimitExceeded,
  ResourceInUseException,
  ResourceNotFoundException,
  RestoreTableFromBackupCommand,
  RestoreTableToPointInTimeCommand,
  ReturnConsumedCapacity,
  ReturnItemCollectionMetrics,
  ReturnValue,
  ReturnValuesOnConditionCheckFailure,
  S3SseAlgorithm,
  SSEStatus,
  SSEType,
  ScalarAttributeType,
  ScanCommand,
  Select,
  StreamViewType,
  TableAlreadyExistsException,
  TableClass,
  TableInUseException,
  TableNotFoundException,
  TableStatus,
  TagResourceCommand,
  TimeToLiveStatus,
  TransactGetItemsCommand,
  TransactWriteItemsCommand,
  TransactionCanceledException,
  TransactionConflictException,
  TransactionInProgressException,
  UntagResourceCommand,
  UpdateContinuousBackupsCommand,
  UpdateContributorInsightsCommand,
  UpdateGlobalTableCommand,
  UpdateGlobalTableSettingsCommand,
  UpdateItemCommand,
  UpdateKinesisStreamingDestinationCommand,
  UpdateTableCommand,
  UpdateTableReplicaAutoScalingCommand,
  UpdateTimeToLiveCommand,
  Client as __Client,
  paginateListContributorInsights,
  paginateListExports,
  paginateListImports,
  paginateListTables,
  paginateQuery,
  paginateScan,
  waitForTableExists,
  waitForTableNotExists,
  waitUntilTableExists,
  waitUntilTableNotExists
};
//# sourceMappingURL=@aws-sdk_client-dynamodb.js.map
