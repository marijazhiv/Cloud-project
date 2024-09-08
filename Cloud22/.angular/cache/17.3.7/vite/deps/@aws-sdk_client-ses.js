import {
  WaiterState,
  checkExceptions,
  createWaiter
} from "./chunk-2FE76ZDM.js";
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
  awsEndpointFunctions,
  calculateBodyLength,
  collectBody,
  createAggregatedClient,
  createPaginator,
  customEndpointFunctions,
  decorateServiceException,
  defaultUserAgent,
  expectNonNull,
  expectString,
  extendedEncodeURIComponent,
  fromBase64,
  fromUtf8,
  getArrayIfSingleItem,
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
  loadConfigsForDefaultMode,
  normalizeProvider,
  parseBoolean,
  parseRfc3339DateTimeWithOffset,
  parseUrl,
  parseXmlBody,
  parseXmlErrorBody,
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
  serializeDateTime,
  streamCollector,
  strictParseFloat,
  strictParseLong,
  toBase64,
  toUtf8,
  withBaseException
} from "./chunk-TC2ZGZ7K.js";
import "./chunk-7VQPY5UX.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-CDW57LCT.js";

// node_modules/@aws-sdk/client-ses/dist-es/auth/httpAuthSchemeProvider.js
var defaultSESHttpAuthSchemeParametersProvider = (config, context, input) => __async(void 0, null, function* () {
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
      name: "ses",
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
var defaultSESHttpAuthSchemeProvider = (authParameters) => {
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

// node_modules/@aws-sdk/client-ses/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters = (options) => {
  return __spreadProps(__spreadValues({}, options), {
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "ses"
  });
};
var commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};

// node_modules/@aws-sdk/client-ses/package.json
var package_default = {
  name: "@aws-sdk/client-ses",
  description: "AWS SDK for JavaScript Ses Client for Node.js, Browser and React Native",
  version: "3.645.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "node ../../scripts/compilation/inline client-ses",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo ses"
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
    tslib: "^2.6.2"
  },
  devDependencies: {
    "@tsconfig/node16": "16.1.3",
    "@types/node": "^16.18.96",
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
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-ses",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-ses"
  }
};

// node_modules/@aws-sdk/client-ses/dist-es/endpoint/ruleset.js
var s = "required";
var t = "fn";
var u = "argv";
var v = "ref";
var a = true;
var b = "isSet";
var c = "booleanEquals";
var d = "error";
var e = "endpoint";
var f = "tree";
var g = "PartitionResult";
var h = { [s]: false, "type": "String" };
var i = { [s]: true, "default": false, "type": "Boolean" };
var j = { [v]: "Endpoint" };
var k = { [t]: c, [u]: [{ [v]: "UseFIPS" }, true] };
var l = { [t]: c, [u]: [{ [v]: "UseDualStack" }, true] };
var m = {};
var n = { [t]: "getAttr", [u]: [{ [v]: g }, "supportsFIPS"] };
var o = { [t]: c, [u]: [true, { [t]: "getAttr", [u]: [{ [v]: g }, "supportsDualStack"] }] };
var p = [k];
var q = [l];
var r = [{ [v]: "Region" }];
var _data = { version: "1.0", parameters: { Region: h, UseDualStack: i, UseFIPS: i, Endpoint: h }, rules: [{ conditions: [{ [t]: b, [u]: [j] }], rules: [{ conditions: p, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: q, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: j, properties: m, headers: m }, type: e }], type: f }, { conditions: [{ [t]: b, [u]: r }], rules: [{ conditions: [{ [t]: "aws.partition", [u]: r, assign: g }], rules: [{ conditions: [k, l], rules: [{ conditions: [{ [t]: c, [u]: [a, n] }, o], rules: [{ endpoint: { url: "https://email-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m, headers: m }, type: e }], type: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f }, { conditions: p, rules: [{ conditions: [{ [t]: c, [u]: [n, a] }], rules: [{ endpoint: { url: "https://email-fips.{Region}.{PartitionResult#dnsSuffix}", properties: m, headers: m }, type: e }], type: f }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f }, { conditions: q, rules: [{ conditions: [o], rules: [{ endpoint: { url: "https://email.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m, headers: m }, type: e }], type: f }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f }, { endpoint: { url: "https://email.{Region}.{PartitionResult#dnsSuffix}", properties: m, headers: m }, type: e }], type: f }], type: f }, { error: "Invalid Configuration: Missing Region", type: d }] };
var ruleSet = _data;

// node_modules/@aws-sdk/client-ses/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  });
};
customEndpointFunctions.aws = awsEndpointFunctions;

// node_modules/@aws-sdk/client-ses/dist-es/runtimeConfig.shared.js
var getRuntimeConfig = (config) => {
  return {
    apiVersion: "2010-12-01",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSESHttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new AwsSdkSigV4Signer()
      }
    ],
    logger: config?.logger ?? new NoOpLogger(),
    serviceId: config?.serviceId ?? "SES",
    urlParser: config?.urlParser ?? parseUrl,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
};

// node_modules/@aws-sdk/client-ses/dist-es/runtimeConfig.browser.js
var getRuntimeConfig2 = (config) => {
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig(config);
  return __spreadProps(__spreadValues(__spreadValues({}, clientSharedValues), config), {
    runtime: "browser",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? ((_2) => () => Promise.reject(new Error("Credential is missing"))),
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default.version }),
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

// node_modules/@aws-sdk/client-ses/dist-es/auth/httpAuthExtensionConfiguration.js
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

// node_modules/@aws-sdk/client-ses/dist-es/runtimeExtensions.js
var asPartial = (t2) => t2;
var resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, asPartial(getAwsRegionExtensionConfiguration(runtimeConfig))), asPartial(getDefaultExtensionConfiguration(runtimeConfig))), asPartial(getHttpHandlerExtensionConfiguration(runtimeConfig))), asPartial(getHttpAuthExtensionConfiguration(runtimeConfig)));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, runtimeConfig), resolveAwsRegionExtensionConfiguration(extensionConfiguration)), resolveDefaultRuntimeConfig(extensionConfiguration)), resolveHttpHandlerRuntimeConfig(extensionConfiguration)), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

// node_modules/@aws-sdk/client-ses/dist-es/SESClient.js
var SESClient = class extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig2(configuration || {});
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveRetryConfig(_config_2);
    const _config_4 = resolveRegionConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveEndpointConfig(_config_5);
    const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
    const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
    super(_config_8);
    this.config = _config_8;
    this.middlewareStack.use(getUserAgentPlugin(this.config));
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
      httpAuthSchemeParametersProvider: defaultSESHttpAuthSchemeParametersProvider,
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

// node_modules/@aws-sdk/client-ses/dist-es/models/SESServiceException.js
var SESServiceException = class _SESServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _SESServiceException.prototype);
  }
};

// node_modules/@aws-sdk/client-ses/dist-es/models/models_0.js
var AccountSendingPausedException = class _AccountSendingPausedException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "AccountSendingPausedException",
      $fault: "client"
    }, opts));
    this.name = "AccountSendingPausedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _AccountSendingPausedException.prototype);
  }
};
var AlreadyExistsException = class _AlreadyExistsException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "AlreadyExistsException",
      $fault: "client"
    }, opts));
    this.name = "AlreadyExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _AlreadyExistsException.prototype);
    this.Name = opts.Name;
  }
};
var BehaviorOnMXFailure = {
  RejectMessage: "RejectMessage",
  UseDefaultValue: "UseDefaultValue"
};
var BounceType = {
  ContentRejected: "ContentRejected",
  DoesNotExist: "DoesNotExist",
  ExceededQuota: "ExceededQuota",
  MessageTooLarge: "MessageTooLarge",
  TemporaryFailure: "TemporaryFailure",
  Undefined: "Undefined"
};
var DsnAction = {
  DELAYED: "delayed",
  DELIVERED: "delivered",
  EXPANDED: "expanded",
  FAILED: "failed",
  RELAYED: "relayed"
};
var BulkEmailStatus = {
  AccountDailyQuotaExceeded: "AccountDailyQuotaExceeded",
  AccountSendingPaused: "AccountSendingPaused",
  AccountSuspended: "AccountSuspended",
  AccountThrottled: "AccountThrottled",
  ConfigurationSetDoesNotExist: "ConfigurationSetDoesNotExist",
  ConfigurationSetSendingPaused: "ConfigurationSetSendingPaused",
  Failed: "Failed",
  InvalidParameterValue: "InvalidParameterValue",
  InvalidSendingPoolName: "InvalidSendingPoolName",
  MailFromDomainNotVerified: "MailFromDomainNotVerified",
  MessageRejected: "MessageRejected",
  Success: "Success",
  TemplateDoesNotExist: "TemplateDoesNotExist",
  TransientFailure: "TransientFailure"
};
var CannotDeleteException = class _CannotDeleteException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CannotDeleteException",
      $fault: "client"
    }, opts));
    this.name = "CannotDeleteException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CannotDeleteException.prototype);
    this.Name = opts.Name;
  }
};
var LimitExceededException = class _LimitExceededException extends SESServiceException {
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
var RuleSetDoesNotExistException = class _RuleSetDoesNotExistException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "RuleSetDoesNotExistException",
      $fault: "client"
    }, opts));
    this.name = "RuleSetDoesNotExistException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _RuleSetDoesNotExistException.prototype);
    this.Name = opts.Name;
  }
};
var DimensionValueSource = {
  EMAIL_HEADER: "emailHeader",
  LINK_TAG: "linkTag",
  MESSAGE_TAG: "messageTag"
};
var ConfigurationSetAlreadyExistsException = class _ConfigurationSetAlreadyExistsException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ConfigurationSetAlreadyExistsException",
      $fault: "client"
    }, opts));
    this.name = "ConfigurationSetAlreadyExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ConfigurationSetAlreadyExistsException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
  }
};
var ConfigurationSetAttribute = {
  DELIVERY_OPTIONS: "deliveryOptions",
  EVENT_DESTINATIONS: "eventDestinations",
  REPUTATION_OPTIONS: "reputationOptions",
  TRACKING_OPTIONS: "trackingOptions"
};
var ConfigurationSetDoesNotExistException = class _ConfigurationSetDoesNotExistException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ConfigurationSetDoesNotExistException",
      $fault: "client"
    }, opts));
    this.name = "ConfigurationSetDoesNotExistException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ConfigurationSetDoesNotExistException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
  }
};
var ConfigurationSetSendingPausedException = class _ConfigurationSetSendingPausedException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ConfigurationSetSendingPausedException",
      $fault: "client"
    }, opts));
    this.name = "ConfigurationSetSendingPausedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ConfigurationSetSendingPausedException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
  }
};
var InvalidConfigurationSetException = class _InvalidConfigurationSetException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidConfigurationSetException",
      $fault: "client"
    }, opts));
    this.name = "InvalidConfigurationSetException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidConfigurationSetException.prototype);
  }
};
var EventType = {
  BOUNCE: "bounce",
  CLICK: "click",
  COMPLAINT: "complaint",
  DELIVERY: "delivery",
  OPEN: "open",
  REJECT: "reject",
  RENDERING_FAILURE: "renderingFailure",
  SEND: "send"
};
var EventDestinationAlreadyExistsException = class _EventDestinationAlreadyExistsException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EventDestinationAlreadyExistsException",
      $fault: "client"
    }, opts));
    this.name = "EventDestinationAlreadyExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EventDestinationAlreadyExistsException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
    this.EventDestinationName = opts.EventDestinationName;
  }
};
var InvalidCloudWatchDestinationException = class _InvalidCloudWatchDestinationException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidCloudWatchDestinationException",
      $fault: "client"
    }, opts));
    this.name = "InvalidCloudWatchDestinationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidCloudWatchDestinationException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
    this.EventDestinationName = opts.EventDestinationName;
  }
};
var InvalidFirehoseDestinationException = class _InvalidFirehoseDestinationException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidFirehoseDestinationException",
      $fault: "client"
    }, opts));
    this.name = "InvalidFirehoseDestinationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidFirehoseDestinationException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
    this.EventDestinationName = opts.EventDestinationName;
  }
};
var InvalidSNSDestinationException = class _InvalidSNSDestinationException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidSNSDestinationException",
      $fault: "client"
    }, opts));
    this.name = "InvalidSNSDestinationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidSNSDestinationException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
    this.EventDestinationName = opts.EventDestinationName;
  }
};
var InvalidTrackingOptionsException = class _InvalidTrackingOptionsException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidTrackingOptionsException",
      $fault: "client"
    }, opts));
    this.name = "InvalidTrackingOptionsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidTrackingOptionsException.prototype);
  }
};
var TrackingOptionsAlreadyExistsException = class _TrackingOptionsAlreadyExistsException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TrackingOptionsAlreadyExistsException",
      $fault: "client"
    }, opts));
    this.name = "TrackingOptionsAlreadyExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TrackingOptionsAlreadyExistsException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
  }
};
var CustomVerificationEmailInvalidContentException = class _CustomVerificationEmailInvalidContentException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CustomVerificationEmailInvalidContentException",
      $fault: "client"
    }, opts));
    this.name = "CustomVerificationEmailInvalidContentException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CustomVerificationEmailInvalidContentException.prototype);
  }
};
var CustomVerificationEmailTemplateAlreadyExistsException = class _CustomVerificationEmailTemplateAlreadyExistsException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CustomVerificationEmailTemplateAlreadyExistsException",
      $fault: "client"
    }, opts));
    this.name = "CustomVerificationEmailTemplateAlreadyExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CustomVerificationEmailTemplateAlreadyExistsException.prototype);
    this.CustomVerificationEmailTemplateName = opts.CustomVerificationEmailTemplateName;
  }
};
var FromEmailAddressNotVerifiedException = class _FromEmailAddressNotVerifiedException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "FromEmailAddressNotVerifiedException",
      $fault: "client"
    }, opts));
    this.name = "FromEmailAddressNotVerifiedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _FromEmailAddressNotVerifiedException.prototype);
    this.FromEmailAddress = opts.FromEmailAddress;
  }
};
var ReceiptFilterPolicy = {
  Allow: "Allow",
  Block: "Block"
};
var InvocationType = {
  Event: "Event",
  RequestResponse: "RequestResponse"
};
var SNSActionEncoding = {
  Base64: "Base64",
  UTF8: "UTF-8"
};
var StopScope = {
  RULE_SET: "RuleSet"
};
var TlsPolicy = {
  Optional: "Optional",
  Require: "Require"
};
var InvalidLambdaFunctionException = class _InvalidLambdaFunctionException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidLambdaFunctionException",
      $fault: "client"
    }, opts));
    this.name = "InvalidLambdaFunctionException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidLambdaFunctionException.prototype);
    this.FunctionArn = opts.FunctionArn;
  }
};
var InvalidS3ConfigurationException = class _InvalidS3ConfigurationException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidS3ConfigurationException",
      $fault: "client"
    }, opts));
    this.name = "InvalidS3ConfigurationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidS3ConfigurationException.prototype);
    this.Bucket = opts.Bucket;
  }
};
var InvalidSnsTopicException = class _InvalidSnsTopicException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidSnsTopicException",
      $fault: "client"
    }, opts));
    this.name = "InvalidSnsTopicException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidSnsTopicException.prototype);
    this.Topic = opts.Topic;
  }
};
var RuleDoesNotExistException = class _RuleDoesNotExistException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "RuleDoesNotExistException",
      $fault: "client"
    }, opts));
    this.name = "RuleDoesNotExistException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _RuleDoesNotExistException.prototype);
    this.Name = opts.Name;
  }
};
var InvalidTemplateException = class _InvalidTemplateException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidTemplateException",
      $fault: "client"
    }, opts));
    this.name = "InvalidTemplateException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidTemplateException.prototype);
    this.TemplateName = opts.TemplateName;
  }
};
var CustomMailFromStatus = {
  Failed: "Failed",
  Pending: "Pending",
  Success: "Success",
  TemporaryFailure: "TemporaryFailure"
};
var CustomVerificationEmailTemplateDoesNotExistException = class _CustomVerificationEmailTemplateDoesNotExistException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CustomVerificationEmailTemplateDoesNotExistException",
      $fault: "client"
    }, opts));
    this.name = "CustomVerificationEmailTemplateDoesNotExistException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CustomVerificationEmailTemplateDoesNotExistException.prototype);
    this.CustomVerificationEmailTemplateName = opts.CustomVerificationEmailTemplateName;
  }
};
var EventDestinationDoesNotExistException = class _EventDestinationDoesNotExistException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EventDestinationDoesNotExistException",
      $fault: "client"
    }, opts));
    this.name = "EventDestinationDoesNotExistException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EventDestinationDoesNotExistException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
    this.EventDestinationName = opts.EventDestinationName;
  }
};
var TrackingOptionsDoesNotExistException = class _TrackingOptionsDoesNotExistException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TrackingOptionsDoesNotExistException",
      $fault: "client"
    }, opts));
    this.name = "TrackingOptionsDoesNotExistException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TrackingOptionsDoesNotExistException.prototype);
    this.ConfigurationSetName = opts.ConfigurationSetName;
  }
};
var VerificationStatus = {
  Failed: "Failed",
  NotStarted: "NotStarted",
  Pending: "Pending",
  Success: "Success",
  TemporaryFailure: "TemporaryFailure"
};
var TemplateDoesNotExistException = class _TemplateDoesNotExistException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TemplateDoesNotExistException",
      $fault: "client"
    }, opts));
    this.name = "TemplateDoesNotExistException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TemplateDoesNotExistException.prototype);
    this.TemplateName = opts.TemplateName;
  }
};
var IdentityType = {
  Domain: "Domain",
  EmailAddress: "EmailAddress"
};
var InvalidDeliveryOptionsException = class _InvalidDeliveryOptionsException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidDeliveryOptionsException",
      $fault: "client"
    }, opts));
    this.name = "InvalidDeliveryOptionsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidDeliveryOptionsException.prototype);
  }
};
var InvalidPolicyException = class _InvalidPolicyException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidPolicyException",
      $fault: "client"
    }, opts));
    this.name = "InvalidPolicyException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidPolicyException.prototype);
  }
};
var InvalidRenderingParameterException = class _InvalidRenderingParameterException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidRenderingParameterException",
      $fault: "client"
    }, opts));
    this.name = "InvalidRenderingParameterException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidRenderingParameterException.prototype);
    this.TemplateName = opts.TemplateName;
  }
};
var MailFromDomainNotVerifiedException = class _MailFromDomainNotVerifiedException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "MailFromDomainNotVerifiedException",
      $fault: "client"
    }, opts));
    this.name = "MailFromDomainNotVerifiedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _MailFromDomainNotVerifiedException.prototype);
  }
};
var MessageRejected = class _MessageRejected extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "MessageRejected",
      $fault: "client"
    }, opts));
    this.name = "MessageRejected";
    this.$fault = "client";
    Object.setPrototypeOf(this, _MessageRejected.prototype);
  }
};
var MissingRenderingAttributeException = class _MissingRenderingAttributeException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "MissingRenderingAttributeException",
      $fault: "client"
    }, opts));
    this.name = "MissingRenderingAttributeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _MissingRenderingAttributeException.prototype);
    this.TemplateName = opts.TemplateName;
  }
};
var NotificationType = {
  Bounce: "Bounce",
  Complaint: "Complaint",
  Delivery: "Delivery"
};
var ProductionAccessNotGrantedException = class _ProductionAccessNotGrantedException extends SESServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ProductionAccessNotGrantedException",
      $fault: "client"
    }, opts));
    this.name = "ProductionAccessNotGrantedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ProductionAccessNotGrantedException.prototype);
  }
};

// node_modules/@aws-sdk/client-ses/dist-es/protocols/Aws_query.js
var se_CloneReceiptRuleSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CloneReceiptRuleSetRequest(input, context)), {
    [_A]: _CRRS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateConfigurationSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateConfigurationSetRequest(input, context)), {
    [_A]: _CCS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateConfigurationSetEventDestinationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateConfigurationSetEventDestinationRequest(input, context)), {
    [_A]: _CCSED,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateConfigurationSetTrackingOptionsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateConfigurationSetTrackingOptionsRequest(input, context)), {
    [_A]: _CCSTO,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateCustomVerificationEmailTemplateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateCustomVerificationEmailTemplateRequest(input, context)), {
    [_A]: _CCVET,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateReceiptFilterCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateReceiptFilterRequest(input, context)), {
    [_A]: _CRF,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateReceiptRuleCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateReceiptRuleRequest(input, context)), {
    [_A]: _CRR,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateReceiptRuleSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateReceiptRuleSetRequest(input, context)), {
    [_A]: _CRRSr,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateTemplateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateTemplateRequest(input, context)), {
    [_A]: _CT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteConfigurationSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteConfigurationSetRequest(input, context)), {
    [_A]: _DCS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteConfigurationSetEventDestinationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteConfigurationSetEventDestinationRequest(input, context)), {
    [_A]: _DCSED,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteConfigurationSetTrackingOptionsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteConfigurationSetTrackingOptionsRequest(input, context)), {
    [_A]: _DCSTO,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteCustomVerificationEmailTemplateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteCustomVerificationEmailTemplateRequest(input, context)), {
    [_A]: _DCVET,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteIdentityCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteIdentityRequest(input, context)), {
    [_A]: _DI,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteIdentityPolicyCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteIdentityPolicyRequest(input, context)), {
    [_A]: _DIP,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteReceiptFilterCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteReceiptFilterRequest(input, context)), {
    [_A]: _DRF,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteReceiptRuleCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteReceiptRuleRequest(input, context)), {
    [_A]: _DRR,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteReceiptRuleSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteReceiptRuleSetRequest(input, context)), {
    [_A]: _DRRS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteTemplateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteTemplateRequest(input, context)), {
    [_A]: _DT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteVerifiedEmailAddressCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteVerifiedEmailAddressRequest(input, context)), {
    [_A]: _DVEA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeActiveReceiptRuleSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DescribeActiveReceiptRuleSetRequest(input, context)), {
    [_A]: _DARRS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeConfigurationSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DescribeConfigurationSetRequest(input, context)), {
    [_A]: _DCSe,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeReceiptRuleCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DescribeReceiptRuleRequest(input, context)), {
    [_A]: _DRRe,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeReceiptRuleSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DescribeReceiptRuleSetRequest(input, context)), {
    [_A]: _DRRSe,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetAccountSendingEnabledCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  const body = buildFormUrlencodedString({
    [_A]: _GASE,
    [_V]: _
  });
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetCustomVerificationEmailTemplateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetCustomVerificationEmailTemplateRequest(input, context)), {
    [_A]: _GCVET,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetIdentityDkimAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetIdentityDkimAttributesRequest(input, context)), {
    [_A]: _GIDA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetIdentityMailFromDomainAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetIdentityMailFromDomainAttributesRequest(input, context)), {
    [_A]: _GIMFDA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetIdentityNotificationAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetIdentityNotificationAttributesRequest(input, context)), {
    [_A]: _GINA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetIdentityPoliciesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetIdentityPoliciesRequest(input, context)), {
    [_A]: _GIP,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetIdentityVerificationAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetIdentityVerificationAttributesRequest(input, context)), {
    [_A]: _GIVA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetSendQuotaCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  const body = buildFormUrlencodedString({
    [_A]: _GSQ,
    [_V]: _
  });
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetSendStatisticsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  const body = buildFormUrlencodedString({
    [_A]: _GSS,
    [_V]: _
  });
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetTemplateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetTemplateRequest(input, context)), {
    [_A]: _GT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListConfigurationSetsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListConfigurationSetsRequest(input, context)), {
    [_A]: _LCS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListCustomVerificationEmailTemplatesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListCustomVerificationEmailTemplatesRequest(input, context)), {
    [_A]: _LCVET,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListIdentitiesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListIdentitiesRequest(input, context)), {
    [_A]: _LI,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListIdentityPoliciesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListIdentityPoliciesRequest(input, context)), {
    [_A]: _LIP,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListReceiptFiltersCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListReceiptFiltersRequest(input, context)), {
    [_A]: _LRF,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListReceiptRuleSetsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListReceiptRuleSetsRequest(input, context)), {
    [_A]: _LRRS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListTemplatesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListTemplatesRequest(input, context)), {
    [_A]: _LT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListVerifiedEmailAddressesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  const body = buildFormUrlencodedString({
    [_A]: _LVEA,
    [_V]: _
  });
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_PutConfigurationSetDeliveryOptionsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_PutConfigurationSetDeliveryOptionsRequest(input, context)), {
    [_A]: _PCSDO,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_PutIdentityPolicyCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_PutIdentityPolicyRequest(input, context)), {
    [_A]: _PIP,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ReorderReceiptRuleSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ReorderReceiptRuleSetRequest(input, context)), {
    [_A]: _RRRS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SendBounceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SendBounceRequest(input, context)), {
    [_A]: _SB,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SendBulkTemplatedEmailCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SendBulkTemplatedEmailRequest(input, context)), {
    [_A]: _SBTE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SendCustomVerificationEmailCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SendCustomVerificationEmailRequest(input, context)), {
    [_A]: _SCVE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SendEmailCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SendEmailRequest(input, context)), {
    [_A]: _SE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SendRawEmailCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SendRawEmailRequest(input, context)), {
    [_A]: _SRE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SendTemplatedEmailCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SendTemplatedEmailRequest(input, context)), {
    [_A]: _STE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetActiveReceiptRuleSetCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetActiveReceiptRuleSetRequest(input, context)), {
    [_A]: _SARRS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetIdentityDkimEnabledCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetIdentityDkimEnabledRequest(input, context)), {
    [_A]: _SIDE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetIdentityFeedbackForwardingEnabledCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetIdentityFeedbackForwardingEnabledRequest(input, context)), {
    [_A]: _SIFFE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetIdentityHeadersInNotificationsEnabledCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetIdentityHeadersInNotificationsEnabledRequest(input, context)), {
    [_A]: _SIHINE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetIdentityMailFromDomainCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetIdentityMailFromDomainRequest(input, context)), {
    [_A]: _SIMFD,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetIdentityNotificationTopicCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetIdentityNotificationTopicRequest(input, context)), {
    [_A]: _SINT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetReceiptRulePositionCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetReceiptRulePositionRequest(input, context)), {
    [_A]: _SRRP,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_TestRenderTemplateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_TestRenderTemplateRequest(input, context)), {
    [_A]: _TRT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateAccountSendingEnabledCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UpdateAccountSendingEnabledRequest(input, context)), {
    [_A]: _UASE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateConfigurationSetEventDestinationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UpdateConfigurationSetEventDestinationRequest(input, context)), {
    [_A]: _UCSED,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateConfigurationSetReputationMetricsEnabledCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UpdateConfigurationSetReputationMetricsEnabledRequest(input, context)), {
    [_A]: _UCSRME,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateConfigurationSetSendingEnabledCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UpdateConfigurationSetSendingEnabledRequest(input, context)), {
    [_A]: _UCSSE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateConfigurationSetTrackingOptionsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UpdateConfigurationSetTrackingOptionsRequest(input, context)), {
    [_A]: _UCSTO,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateCustomVerificationEmailTemplateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UpdateCustomVerificationEmailTemplateRequest(input, context)), {
    [_A]: _UCVET,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateReceiptRuleCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UpdateReceiptRuleRequest(input, context)), {
    [_A]: _URR,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateTemplateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UpdateTemplateRequest(input, context)), {
    [_A]: _UT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_VerifyDomainDkimCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_VerifyDomainDkimRequest(input, context)), {
    [_A]: _VDD,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_VerifyDomainIdentityCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_VerifyDomainIdentityRequest(input, context)), {
    [_A]: _VDI,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_VerifyEmailAddressCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_VerifyEmailAddressRequest(input, context)), {
    [_A]: _VEA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_VerifyEmailIdentityCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_VerifyEmailIdentityRequest(input, context)), {
    [_A]: _VEI,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var de_CloneReceiptRuleSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CloneReceiptRuleSetResponse(data.CloneReceiptRuleSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateConfigurationSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateConfigurationSetResponse(data.CreateConfigurationSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateConfigurationSetEventDestinationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateConfigurationSetEventDestinationResponse(data.CreateConfigurationSetEventDestinationResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateConfigurationSetTrackingOptionsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateConfigurationSetTrackingOptionsResponse(data.CreateConfigurationSetTrackingOptionsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateCustomVerificationEmailTemplateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_CreateReceiptFilterCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateReceiptFilterResponse(data.CreateReceiptFilterResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateReceiptRuleCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateReceiptRuleResponse(data.CreateReceiptRuleResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateReceiptRuleSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateReceiptRuleSetResponse(data.CreateReceiptRuleSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateTemplateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateTemplateResponse(data.CreateTemplateResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteConfigurationSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteConfigurationSetResponse(data.DeleteConfigurationSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteConfigurationSetEventDestinationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteConfigurationSetEventDestinationResponse(data.DeleteConfigurationSetEventDestinationResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteConfigurationSetTrackingOptionsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteConfigurationSetTrackingOptionsResponse(data.DeleteConfigurationSetTrackingOptionsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteCustomVerificationEmailTemplateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_DeleteIdentityCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteIdentityResponse(data.DeleteIdentityResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteIdentityPolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteIdentityPolicyResponse(data.DeleteIdentityPolicyResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteReceiptFilterCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteReceiptFilterResponse(data.DeleteReceiptFilterResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteReceiptRuleCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteReceiptRuleResponse(data.DeleteReceiptRuleResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteReceiptRuleSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteReceiptRuleSetResponse(data.DeleteReceiptRuleSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteTemplateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteTemplateResponse(data.DeleteTemplateResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteVerifiedEmailAddressCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_DescribeActiveReceiptRuleSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DescribeActiveReceiptRuleSetResponse(data.DescribeActiveReceiptRuleSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeConfigurationSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DescribeConfigurationSetResponse(data.DescribeConfigurationSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeReceiptRuleCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DescribeReceiptRuleResponse(data.DescribeReceiptRuleResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DescribeReceiptRuleSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DescribeReceiptRuleSetResponse(data.DescribeReceiptRuleSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetAccountSendingEnabledCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetAccountSendingEnabledResponse(data.GetAccountSendingEnabledResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetCustomVerificationEmailTemplateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetCustomVerificationEmailTemplateResponse(data.GetCustomVerificationEmailTemplateResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetIdentityDkimAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetIdentityDkimAttributesResponse(data.GetIdentityDkimAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetIdentityMailFromDomainAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetIdentityMailFromDomainAttributesResponse(data.GetIdentityMailFromDomainAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetIdentityNotificationAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetIdentityNotificationAttributesResponse(data.GetIdentityNotificationAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetIdentityPoliciesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetIdentityPoliciesResponse(data.GetIdentityPoliciesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetIdentityVerificationAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetIdentityVerificationAttributesResponse(data.GetIdentityVerificationAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetSendQuotaCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetSendQuotaResponse(data.GetSendQuotaResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetSendStatisticsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetSendStatisticsResponse(data.GetSendStatisticsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetTemplateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetTemplateResponse(data.GetTemplateResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListConfigurationSetsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListConfigurationSetsResponse(data.ListConfigurationSetsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListCustomVerificationEmailTemplatesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListCustomVerificationEmailTemplatesResponse(data.ListCustomVerificationEmailTemplatesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListIdentitiesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListIdentitiesResponse(data.ListIdentitiesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListIdentityPoliciesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListIdentityPoliciesResponse(data.ListIdentityPoliciesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListReceiptFiltersCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListReceiptFiltersResponse(data.ListReceiptFiltersResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListReceiptRuleSetsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListReceiptRuleSetsResponse(data.ListReceiptRuleSetsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListTemplatesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListTemplatesResponse(data.ListTemplatesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListVerifiedEmailAddressesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListVerifiedEmailAddressesResponse(data.ListVerifiedEmailAddressesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_PutConfigurationSetDeliveryOptionsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_PutConfigurationSetDeliveryOptionsResponse(data.PutConfigurationSetDeliveryOptionsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_PutIdentityPolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_PutIdentityPolicyResponse(data.PutIdentityPolicyResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ReorderReceiptRuleSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ReorderReceiptRuleSetResponse(data.ReorderReceiptRuleSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SendBounceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SendBounceResponse(data.SendBounceResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SendBulkTemplatedEmailCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SendBulkTemplatedEmailResponse(data.SendBulkTemplatedEmailResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SendCustomVerificationEmailCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SendCustomVerificationEmailResponse(data.SendCustomVerificationEmailResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SendEmailCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SendEmailResponse(data.SendEmailResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SendRawEmailCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SendRawEmailResponse(data.SendRawEmailResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SendTemplatedEmailCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SendTemplatedEmailResponse(data.SendTemplatedEmailResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SetActiveReceiptRuleSetCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SetActiveReceiptRuleSetResponse(data.SetActiveReceiptRuleSetResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SetIdentityDkimEnabledCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SetIdentityDkimEnabledResponse(data.SetIdentityDkimEnabledResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SetIdentityFeedbackForwardingEnabledCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SetIdentityFeedbackForwardingEnabledResponse(data.SetIdentityFeedbackForwardingEnabledResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SetIdentityHeadersInNotificationsEnabledCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SetIdentityHeadersInNotificationsEnabledResponse(data.SetIdentityHeadersInNotificationsEnabledResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SetIdentityMailFromDomainCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SetIdentityMailFromDomainResponse(data.SetIdentityMailFromDomainResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SetIdentityNotificationTopicCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SetIdentityNotificationTopicResponse(data.SetIdentityNotificationTopicResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SetReceiptRulePositionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SetReceiptRulePositionResponse(data.SetReceiptRulePositionResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_TestRenderTemplateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_TestRenderTemplateResponse(data.TestRenderTemplateResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateAccountSendingEnabledCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_UpdateConfigurationSetEventDestinationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_UpdateConfigurationSetEventDestinationResponse(data.UpdateConfigurationSetEventDestinationResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateConfigurationSetReputationMetricsEnabledCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_UpdateConfigurationSetSendingEnabledCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_UpdateConfigurationSetTrackingOptionsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_UpdateConfigurationSetTrackingOptionsResponse(data.UpdateConfigurationSetTrackingOptionsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateCustomVerificationEmailTemplateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_UpdateReceiptRuleCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_UpdateReceiptRuleResponse(data.UpdateReceiptRuleResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UpdateTemplateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_UpdateTemplateResponse(data.UpdateTemplateResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_VerifyDomainDkimCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_VerifyDomainDkimResponse(data.VerifyDomainDkimResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_VerifyDomainIdentityCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_VerifyDomainIdentityResponse(data.VerifyDomainIdentityResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_VerifyEmailAddressCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_VerifyEmailIdentityCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_VerifyEmailIdentityResponse(data.VerifyEmailIdentityResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CommandError = (output, context) => __async(void 0, null, function* () {
  const parsedOutput = __spreadProps(__spreadValues({}, output), {
    body: yield parseXmlErrorBody(output.body, context)
  });
  const errorCode = loadQueryErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "AlreadyExists":
    case "com.amazonaws.ses#AlreadyExistsException":
      throw yield de_AlreadyExistsExceptionRes(parsedOutput, context);
    case "LimitExceeded":
    case "com.amazonaws.ses#LimitExceededException":
      throw yield de_LimitExceededExceptionRes(parsedOutput, context);
    case "RuleSetDoesNotExist":
    case "com.amazonaws.ses#RuleSetDoesNotExistException":
      throw yield de_RuleSetDoesNotExistExceptionRes(parsedOutput, context);
    case "ConfigurationSetAlreadyExists":
    case "com.amazonaws.ses#ConfigurationSetAlreadyExistsException":
      throw yield de_ConfigurationSetAlreadyExistsExceptionRes(parsedOutput, context);
    case "InvalidConfigurationSet":
    case "com.amazonaws.ses#InvalidConfigurationSetException":
      throw yield de_InvalidConfigurationSetExceptionRes(parsedOutput, context);
    case "ConfigurationSetDoesNotExist":
    case "com.amazonaws.ses#ConfigurationSetDoesNotExistException":
      throw yield de_ConfigurationSetDoesNotExistExceptionRes(parsedOutput, context);
    case "EventDestinationAlreadyExists":
    case "com.amazonaws.ses#EventDestinationAlreadyExistsException":
      throw yield de_EventDestinationAlreadyExistsExceptionRes(parsedOutput, context);
    case "InvalidCloudWatchDestination":
    case "com.amazonaws.ses#InvalidCloudWatchDestinationException":
      throw yield de_InvalidCloudWatchDestinationExceptionRes(parsedOutput, context);
    case "InvalidFirehoseDestination":
    case "com.amazonaws.ses#InvalidFirehoseDestinationException":
      throw yield de_InvalidFirehoseDestinationExceptionRes(parsedOutput, context);
    case "InvalidSNSDestination":
    case "com.amazonaws.ses#InvalidSNSDestinationException":
      throw yield de_InvalidSNSDestinationExceptionRes(parsedOutput, context);
    case "InvalidTrackingOptions":
    case "com.amazonaws.ses#InvalidTrackingOptionsException":
      throw yield de_InvalidTrackingOptionsExceptionRes(parsedOutput, context);
    case "TrackingOptionsAlreadyExistsException":
    case "com.amazonaws.ses#TrackingOptionsAlreadyExistsException":
      throw yield de_TrackingOptionsAlreadyExistsExceptionRes(parsedOutput, context);
    case "CustomVerificationEmailInvalidContent":
    case "com.amazonaws.ses#CustomVerificationEmailInvalidContentException":
      throw yield de_CustomVerificationEmailInvalidContentExceptionRes(parsedOutput, context);
    case "CustomVerificationEmailTemplateAlreadyExists":
    case "com.amazonaws.ses#CustomVerificationEmailTemplateAlreadyExistsException":
      throw yield de_CustomVerificationEmailTemplateAlreadyExistsExceptionRes(parsedOutput, context);
    case "FromEmailAddressNotVerified":
    case "com.amazonaws.ses#FromEmailAddressNotVerifiedException":
      throw yield de_FromEmailAddressNotVerifiedExceptionRes(parsedOutput, context);
    case "InvalidLambdaFunction":
    case "com.amazonaws.ses#InvalidLambdaFunctionException":
      throw yield de_InvalidLambdaFunctionExceptionRes(parsedOutput, context);
    case "InvalidS3Configuration":
    case "com.amazonaws.ses#InvalidS3ConfigurationException":
      throw yield de_InvalidS3ConfigurationExceptionRes(parsedOutput, context);
    case "InvalidSnsTopic":
    case "com.amazonaws.ses#InvalidSnsTopicException":
      throw yield de_InvalidSnsTopicExceptionRes(parsedOutput, context);
    case "RuleDoesNotExist":
    case "com.amazonaws.ses#RuleDoesNotExistException":
      throw yield de_RuleDoesNotExistExceptionRes(parsedOutput, context);
    case "InvalidTemplate":
    case "com.amazonaws.ses#InvalidTemplateException":
      throw yield de_InvalidTemplateExceptionRes(parsedOutput, context);
    case "EventDestinationDoesNotExist":
    case "com.amazonaws.ses#EventDestinationDoesNotExistException":
      throw yield de_EventDestinationDoesNotExistExceptionRes(parsedOutput, context);
    case "TrackingOptionsDoesNotExistException":
    case "com.amazonaws.ses#TrackingOptionsDoesNotExistException":
      throw yield de_TrackingOptionsDoesNotExistExceptionRes(parsedOutput, context);
    case "CannotDelete":
    case "com.amazonaws.ses#CannotDeleteException":
      throw yield de_CannotDeleteExceptionRes(parsedOutput, context);
    case "CustomVerificationEmailTemplateDoesNotExist":
    case "com.amazonaws.ses#CustomVerificationEmailTemplateDoesNotExistException":
      throw yield de_CustomVerificationEmailTemplateDoesNotExistExceptionRes(parsedOutput, context);
    case "TemplateDoesNotExist":
    case "com.amazonaws.ses#TemplateDoesNotExistException":
      throw yield de_TemplateDoesNotExistExceptionRes(parsedOutput, context);
    case "InvalidDeliveryOptions":
    case "com.amazonaws.ses#InvalidDeliveryOptionsException":
      throw yield de_InvalidDeliveryOptionsExceptionRes(parsedOutput, context);
    case "InvalidPolicy":
    case "com.amazonaws.ses#InvalidPolicyException":
      throw yield de_InvalidPolicyExceptionRes(parsedOutput, context);
    case "MessageRejected":
    case "com.amazonaws.ses#MessageRejected":
      throw yield de_MessageRejectedRes(parsedOutput, context);
    case "AccountSendingPausedException":
    case "com.amazonaws.ses#AccountSendingPausedException":
      throw yield de_AccountSendingPausedExceptionRes(parsedOutput, context);
    case "ConfigurationSetSendingPausedException":
    case "com.amazonaws.ses#ConfigurationSetSendingPausedException":
      throw yield de_ConfigurationSetSendingPausedExceptionRes(parsedOutput, context);
    case "MailFromDomainNotVerifiedException":
    case "com.amazonaws.ses#MailFromDomainNotVerifiedException":
      throw yield de_MailFromDomainNotVerifiedExceptionRes(parsedOutput, context);
    case "ProductionAccessNotGranted":
    case "com.amazonaws.ses#ProductionAccessNotGrantedException":
      throw yield de_ProductionAccessNotGrantedExceptionRes(parsedOutput, context);
    case "InvalidRenderingParameter":
    case "com.amazonaws.ses#InvalidRenderingParameterException":
      throw yield de_InvalidRenderingParameterExceptionRes(parsedOutput, context);
    case "MissingRenderingAttribute":
    case "com.amazonaws.ses#MissingRenderingAttributeException":
      throw yield de_MissingRenderingAttributeExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError({
        output,
        parsedBody: parsedBody.Error,
        errorCode
      });
  }
});
var de_AccountSendingPausedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_AccountSendingPausedException(body.Error, context);
  const exception = new AccountSendingPausedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_AlreadyExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_AlreadyExistsException(body.Error, context);
  const exception = new AlreadyExistsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_CannotDeleteExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_CannotDeleteException(body.Error, context);
  const exception = new CannotDeleteException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ConfigurationSetAlreadyExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ConfigurationSetAlreadyExistsException(body.Error, context);
  const exception = new ConfigurationSetAlreadyExistsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ConfigurationSetDoesNotExistExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ConfigurationSetDoesNotExistException(body.Error, context);
  const exception = new ConfigurationSetDoesNotExistException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ConfigurationSetSendingPausedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ConfigurationSetSendingPausedException(body.Error, context);
  const exception = new ConfigurationSetSendingPausedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_CustomVerificationEmailInvalidContentExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_CustomVerificationEmailInvalidContentException(body.Error, context);
  const exception = new CustomVerificationEmailInvalidContentException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_CustomVerificationEmailTemplateAlreadyExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_CustomVerificationEmailTemplateAlreadyExistsException(body.Error, context);
  const exception = new CustomVerificationEmailTemplateAlreadyExistsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_CustomVerificationEmailTemplateDoesNotExistExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_CustomVerificationEmailTemplateDoesNotExistException(body.Error, context);
  const exception = new CustomVerificationEmailTemplateDoesNotExistException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_EventDestinationAlreadyExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_EventDestinationAlreadyExistsException(body.Error, context);
  const exception = new EventDestinationAlreadyExistsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_EventDestinationDoesNotExistExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_EventDestinationDoesNotExistException(body.Error, context);
  const exception = new EventDestinationDoesNotExistException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_FromEmailAddressNotVerifiedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_FromEmailAddressNotVerifiedException(body.Error, context);
  const exception = new FromEmailAddressNotVerifiedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidCloudWatchDestinationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidCloudWatchDestinationException(body.Error, context);
  const exception = new InvalidCloudWatchDestinationException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidConfigurationSetExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidConfigurationSetException(body.Error, context);
  const exception = new InvalidConfigurationSetException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidDeliveryOptionsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidDeliveryOptionsException(body.Error, context);
  const exception = new InvalidDeliveryOptionsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidFirehoseDestinationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidFirehoseDestinationException(body.Error, context);
  const exception = new InvalidFirehoseDestinationException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidLambdaFunctionExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidLambdaFunctionException(body.Error, context);
  const exception = new InvalidLambdaFunctionException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidPolicyExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidPolicyException(body.Error, context);
  const exception = new InvalidPolicyException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidRenderingParameterExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidRenderingParameterException(body.Error, context);
  const exception = new InvalidRenderingParameterException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidS3ConfigurationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidS3ConfigurationException(body.Error, context);
  const exception = new InvalidS3ConfigurationException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidSNSDestinationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidSNSDestinationException(body.Error, context);
  const exception = new InvalidSNSDestinationException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidSnsTopicExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidSnsTopicException(body.Error, context);
  const exception = new InvalidSnsTopicException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidTemplateExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidTemplateException(body.Error, context);
  const exception = new InvalidTemplateException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidTrackingOptionsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidTrackingOptionsException(body.Error, context);
  const exception = new InvalidTrackingOptionsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_LimitExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_LimitExceededException(body.Error, context);
  const exception = new LimitExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_MailFromDomainNotVerifiedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_MailFromDomainNotVerifiedException(body.Error, context);
  const exception = new MailFromDomainNotVerifiedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_MessageRejectedRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_MessageRejected(body.Error, context);
  const exception = new MessageRejected(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_MissingRenderingAttributeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_MissingRenderingAttributeException(body.Error, context);
  const exception = new MissingRenderingAttributeException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ProductionAccessNotGrantedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ProductionAccessNotGrantedException(body.Error, context);
  const exception = new ProductionAccessNotGrantedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_RuleDoesNotExistExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_RuleDoesNotExistException(body.Error, context);
  const exception = new RuleDoesNotExistException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_RuleSetDoesNotExistExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_RuleSetDoesNotExistException(body.Error, context);
  const exception = new RuleSetDoesNotExistException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TemplateDoesNotExistExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_TemplateDoesNotExistException(body.Error, context);
  const exception = new TemplateDoesNotExistException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TrackingOptionsAlreadyExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_TrackingOptionsAlreadyExistsException(body.Error, context);
  const exception = new TrackingOptionsAlreadyExistsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TrackingOptionsDoesNotExistExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_TrackingOptionsDoesNotExistException(body.Error, context);
  const exception = new TrackingOptionsDoesNotExistException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var se_AddHeaderAction = (input, context) => {
  const entries = {};
  if (input[_HN] != null) {
    entries[_HN] = input[_HN];
  }
  if (input[_HV] != null) {
    entries[_HV] = input[_HV];
  }
  return entries;
};
var se_AddressList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    entries[`member.${counter}`] = entry;
    counter++;
  }
  return entries;
};
var se_Body = (input, context) => {
  const entries = {};
  if (input[_T] != null) {
    const memberEntries = se_Content(input[_T], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Text.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_H] != null) {
    const memberEntries = se_Content(input[_H], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Html.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_BounceAction = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_SRC] != null) {
    entries[_SRC] = input[_SRC];
  }
  if (input[_SC] != null) {
    entries[_SC] = input[_SC];
  }
  if (input[_M] != null) {
    entries[_M] = input[_M];
  }
  if (input[_S] != null) {
    entries[_S] = input[_S];
  }
  return entries;
};
var se_BouncedRecipientInfo = (input, context) => {
  const entries = {};
  if (input[_R] != null) {
    entries[_R] = input[_R];
  }
  if (input[_RA] != null) {
    entries[_RA] = input[_RA];
  }
  if (input[_BT] != null) {
    entries[_BT] = input[_BT];
  }
  if (input[_RDF] != null) {
    const memberEntries = se_RecipientDsnFields(input[_RDF], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `RecipientDsnFields.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_BouncedRecipientInfoList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_BouncedRecipientInfo(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_BulkEmailDestination = (input, context) => {
  const entries = {};
  if (input[_D] != null) {
    const memberEntries = se_Destination(input[_D], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Destination.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_RT] != null) {
    const memberEntries = se_MessageTagList(input[_RT], context);
    if (input[_RT]?.length === 0) {
      entries.ReplacementTags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ReplacementTags.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_RTD] != null) {
    entries[_RTD] = input[_RTD];
  }
  return entries;
};
var se_BulkEmailDestinationList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_BulkEmailDestination(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_CloneReceiptRuleSetRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  if (input[_ORSN] != null) {
    entries[_ORSN] = input[_ORSN];
  }
  return entries;
};
var se_CloudWatchDestination = (input, context) => {
  const entries = {};
  if (input[_DC] != null) {
    const memberEntries = se_CloudWatchDimensionConfigurations(input[_DC], context);
    if (input[_DC]?.length === 0) {
      entries.DimensionConfigurations = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `DimensionConfigurations.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_CloudWatchDimensionConfiguration = (input, context) => {
  const entries = {};
  if (input[_DN] != null) {
    entries[_DN] = input[_DN];
  }
  if (input[_DVS] != null) {
    entries[_DVS] = input[_DVS];
  }
  if (input[_DDV] != null) {
    entries[_DDV] = input[_DDV];
  }
  return entries;
};
var se_CloudWatchDimensionConfigurations = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_CloudWatchDimensionConfiguration(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_ConfigurationSet = (input, context) => {
  const entries = {};
  if (input[_N] != null) {
    entries[_N] = input[_N];
  }
  return entries;
};
var se_ConfigurationSetAttributeList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    entries[`member.${counter}`] = entry;
    counter++;
  }
  return entries;
};
var se_Content = (input, context) => {
  const entries = {};
  if (input[_Da] != null) {
    entries[_Da] = input[_Da];
  }
  if (input[_C] != null) {
    entries[_C] = input[_C];
  }
  return entries;
};
var se_CreateConfigurationSetEventDestinationRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_ED] != null) {
    const memberEntries = se_EventDestination(input[_ED], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `EventDestination.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_CreateConfigurationSetRequest = (input, context) => {
  const entries = {};
  if (input[_CS] != null) {
    const memberEntries = se_ConfigurationSet(input[_CS], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ConfigurationSet.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_CreateConfigurationSetTrackingOptionsRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_TO] != null) {
    const memberEntries = se_TrackingOptions(input[_TO], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `TrackingOptions.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_CreateCustomVerificationEmailTemplateRequest = (input, context) => {
  const entries = {};
  if (input[_TN] != null) {
    entries[_TN] = input[_TN];
  }
  if (input[_FEA] != null) {
    entries[_FEA] = input[_FEA];
  }
  if (input[_TS] != null) {
    entries[_TS] = input[_TS];
  }
  if (input[_TC] != null) {
    entries[_TC] = input[_TC];
  }
  if (input[_SRURL] != null) {
    entries[_SRURL] = input[_SRURL];
  }
  if (input[_FRURL] != null) {
    entries[_FRURL] = input[_FRURL];
  }
  return entries;
};
var se_CreateReceiptFilterRequest = (input, context) => {
  const entries = {};
  if (input[_F] != null) {
    const memberEntries = se_ReceiptFilter(input[_F], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Filter.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_CreateReceiptRuleRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  if (input[_Af] != null) {
    entries[_Af] = input[_Af];
  }
  if (input[_Ru] != null) {
    const memberEntries = se_ReceiptRule(input[_Ru], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Rule.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_CreateReceiptRuleSetRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  return entries;
};
var se_CreateTemplateRequest = (input, context) => {
  const entries = {};
  if (input[_Te] != null) {
    const memberEntries = se_Template(input[_Te], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Template.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_DeleteConfigurationSetEventDestinationRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_EDN] != null) {
    entries[_EDN] = input[_EDN];
  }
  return entries;
};
var se_DeleteConfigurationSetRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  return entries;
};
var se_DeleteConfigurationSetTrackingOptionsRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  return entries;
};
var se_DeleteCustomVerificationEmailTemplateRequest = (input, context) => {
  const entries = {};
  if (input[_TN] != null) {
    entries[_TN] = input[_TN];
  }
  return entries;
};
var se_DeleteIdentityPolicyRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  if (input[_PN] != null) {
    entries[_PN] = input[_PN];
  }
  return entries;
};
var se_DeleteIdentityRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  return entries;
};
var se_DeleteReceiptFilterRequest = (input, context) => {
  const entries = {};
  if (input[_FN] != null) {
    entries[_FN] = input[_FN];
  }
  return entries;
};
var se_DeleteReceiptRuleRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  if (input[_RN] != null) {
    entries[_RN] = input[_RN];
  }
  return entries;
};
var se_DeleteReceiptRuleSetRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  return entries;
};
var se_DeleteTemplateRequest = (input, context) => {
  const entries = {};
  if (input[_TN] != null) {
    entries[_TN] = input[_TN];
  }
  return entries;
};
var se_DeleteVerifiedEmailAddressRequest = (input, context) => {
  const entries = {};
  if (input[_EA] != null) {
    entries[_EA] = input[_EA];
  }
  return entries;
};
var se_DeliveryOptions = (input, context) => {
  const entries = {};
  if (input[_TP] != null) {
    entries[_TP] = input[_TP];
  }
  return entries;
};
var se_DescribeActiveReceiptRuleSetRequest = (input, context) => {
  const entries = {};
  return entries;
};
var se_DescribeConfigurationSetRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_CSAN] != null) {
    const memberEntries = se_ConfigurationSetAttributeList(input[_CSAN], context);
    if (input[_CSAN]?.length === 0) {
      entries.ConfigurationSetAttributeNames = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ConfigurationSetAttributeNames.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_DescribeReceiptRuleRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  if (input[_RN] != null) {
    entries[_RN] = input[_RN];
  }
  return entries;
};
var se_DescribeReceiptRuleSetRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  return entries;
};
var se_Destination = (input, context) => {
  const entries = {};
  if (input[_TAo] != null) {
    const memberEntries = se_AddressList(input[_TAo], context);
    if (input[_TAo]?.length === 0) {
      entries.ToAddresses = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ToAddresses.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_CA] != null) {
    const memberEntries = se_AddressList(input[_CA], context);
    if (input[_CA]?.length === 0) {
      entries.CcAddresses = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `CcAddresses.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_BA] != null) {
    const memberEntries = se_AddressList(input[_BA], context);
    if (input[_BA]?.length === 0) {
      entries.BccAddresses = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `BccAddresses.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_EventDestination = (input, context) => {
  const entries = {};
  if (input[_N] != null) {
    entries[_N] = input[_N];
  }
  if (input[_E] != null) {
    entries[_E] = input[_E];
  }
  if (input[_MET] != null) {
    const memberEntries = se_EventTypes(input[_MET], context);
    if (input[_MET]?.length === 0) {
      entries.MatchingEventTypes = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `MatchingEventTypes.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_KFD] != null) {
    const memberEntries = se_KinesisFirehoseDestination(input[_KFD], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `KinesisFirehoseDestination.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_CWD] != null) {
    const memberEntries = se_CloudWatchDestination(input[_CWD], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `CloudWatchDestination.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_SNSD] != null) {
    const memberEntries = se_SNSDestination(input[_SNSD], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `SNSDestination.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_EventTypes = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    entries[`member.${counter}`] = entry;
    counter++;
  }
  return entries;
};
var se_ExtensionField = (input, context) => {
  const entries = {};
  if (input[_N] != null) {
    entries[_N] = input[_N];
  }
  if (input[_Va] != null) {
    entries[_Va] = input[_Va];
  }
  return entries;
};
var se_ExtensionFieldList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_ExtensionField(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_GetCustomVerificationEmailTemplateRequest = (input, context) => {
  const entries = {};
  if (input[_TN] != null) {
    entries[_TN] = input[_TN];
  }
  return entries;
};
var se_GetIdentityDkimAttributesRequest = (input, context) => {
  const entries = {};
  if (input[_Id] != null) {
    const memberEntries = se_IdentityList(input[_Id], context);
    if (input[_Id]?.length === 0) {
      entries.Identities = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Identities.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_GetIdentityMailFromDomainAttributesRequest = (input, context) => {
  const entries = {};
  if (input[_Id] != null) {
    const memberEntries = se_IdentityList(input[_Id], context);
    if (input[_Id]?.length === 0) {
      entries.Identities = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Identities.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_GetIdentityNotificationAttributesRequest = (input, context) => {
  const entries = {};
  if (input[_Id] != null) {
    const memberEntries = se_IdentityList(input[_Id], context);
    if (input[_Id]?.length === 0) {
      entries.Identities = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Identities.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_GetIdentityPoliciesRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  if (input[_PNo] != null) {
    const memberEntries = se_PolicyNameList(input[_PNo], context);
    if (input[_PNo]?.length === 0) {
      entries.PolicyNames = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `PolicyNames.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_GetIdentityVerificationAttributesRequest = (input, context) => {
  const entries = {};
  if (input[_Id] != null) {
    const memberEntries = se_IdentityList(input[_Id], context);
    if (input[_Id]?.length === 0) {
      entries.Identities = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Identities.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_GetTemplateRequest = (input, context) => {
  const entries = {};
  if (input[_TN] != null) {
    entries[_TN] = input[_TN];
  }
  return entries;
};
var se_IdentityList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    entries[`member.${counter}`] = entry;
    counter++;
  }
  return entries;
};
var se_KinesisFirehoseDestination = (input, context) => {
  const entries = {};
  if (input[_IAMRARN] != null) {
    entries[_IAMRARN] = input[_IAMRARN];
  }
  if (input[_DSARN] != null) {
    entries[_DSARN] = input[_DSARN];
  }
  return entries;
};
var se_LambdaAction = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_FA] != null) {
    entries[_FA] = input[_FA];
  }
  if (input[_IT] != null) {
    entries[_IT] = input[_IT];
  }
  return entries;
};
var se_ListConfigurationSetsRequest = (input, context) => {
  const entries = {};
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  if (input[_MI] != null) {
    entries[_MI] = input[_MI];
  }
  return entries;
};
var se_ListCustomVerificationEmailTemplatesRequest = (input, context) => {
  const entries = {};
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  if (input[_MR] != null) {
    entries[_MR] = input[_MR];
  }
  return entries;
};
var se_ListIdentitiesRequest = (input, context) => {
  const entries = {};
  if (input[_ITd] != null) {
    entries[_ITd] = input[_ITd];
  }
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  if (input[_MI] != null) {
    entries[_MI] = input[_MI];
  }
  return entries;
};
var se_ListIdentityPoliciesRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  return entries;
};
var se_ListReceiptFiltersRequest = (input, context) => {
  const entries = {};
  return entries;
};
var se_ListReceiptRuleSetsRequest = (input, context) => {
  const entries = {};
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  return entries;
};
var se_ListTemplatesRequest = (input, context) => {
  const entries = {};
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  if (input[_MI] != null) {
    entries[_MI] = input[_MI];
  }
  return entries;
};
var se_Message = (input, context) => {
  const entries = {};
  if (input[_Su] != null) {
    const memberEntries = se_Content(input[_Su], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Subject.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_B] != null) {
    const memberEntries = se_Body(input[_B], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Body.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_MessageDsn = (input, context) => {
  const entries = {};
  if (input[_RM] != null) {
    entries[_RM] = input[_RM];
  }
  if (input[_AD] != null) {
    entries[_AD] = serializeDateTime(input[_AD]);
  }
  if (input[_EF] != null) {
    const memberEntries = se_ExtensionFieldList(input[_EF], context);
    if (input[_EF]?.length === 0) {
      entries.ExtensionFields = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ExtensionFields.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_MessageTag = (input, context) => {
  const entries = {};
  if (input[_N] != null) {
    entries[_N] = input[_N];
  }
  if (input[_Va] != null) {
    entries[_Va] = input[_Va];
  }
  return entries;
};
var se_MessageTagList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_MessageTag(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_PolicyNameList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    entries[`member.${counter}`] = entry;
    counter++;
  }
  return entries;
};
var se_PutConfigurationSetDeliveryOptionsRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_DO] != null) {
    const memberEntries = se_DeliveryOptions(input[_DO], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `DeliveryOptions.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_PutIdentityPolicyRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  if (input[_PN] != null) {
    entries[_PN] = input[_PN];
  }
  if (input[_P] != null) {
    entries[_P] = input[_P];
  }
  return entries;
};
var se_RawMessage = (input, context) => {
  const entries = {};
  if (input[_Da] != null) {
    entries[_Da] = context.base64Encoder(input[_Da]);
  }
  return entries;
};
var se_ReceiptAction = (input, context) => {
  const entries = {};
  if (input[_SA] != null) {
    const memberEntries = se_S3Action(input[_SA], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `S3Action.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_BAo] != null) {
    const memberEntries = se_BounceAction(input[_BAo], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `BounceAction.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_WA] != null) {
    const memberEntries = se_WorkmailAction(input[_WA], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `WorkmailAction.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_LA] != null) {
    const memberEntries = se_LambdaAction(input[_LA], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `LambdaAction.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_SAt] != null) {
    const memberEntries = se_StopAction(input[_SAt], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `StopAction.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_AHA] != null) {
    const memberEntries = se_AddHeaderAction(input[_AHA], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `AddHeaderAction.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_SNSA] != null) {
    const memberEntries = se_SNSAction(input[_SNSA], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `SNSAction.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_ReceiptActionsList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_ReceiptAction(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_ReceiptFilter = (input, context) => {
  const entries = {};
  if (input[_N] != null) {
    entries[_N] = input[_N];
  }
  if (input[_IF] != null) {
    const memberEntries = se_ReceiptIpFilter(input[_IF], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `IpFilter.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_ReceiptIpFilter = (input, context) => {
  const entries = {};
  if (input[_P] != null) {
    entries[_P] = input[_P];
  }
  if (input[_Ci] != null) {
    entries[_Ci] = input[_Ci];
  }
  return entries;
};
var se_ReceiptRule = (input, context) => {
  const entries = {};
  if (input[_N] != null) {
    entries[_N] = input[_N];
  }
  if (input[_E] != null) {
    entries[_E] = input[_E];
  }
  if (input[_TP] != null) {
    entries[_TP] = input[_TP];
  }
  if (input[_Re] != null) {
    const memberEntries = se_RecipientsList(input[_Re], context);
    if (input[_Re]?.length === 0) {
      entries.Recipients = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Recipients.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_Ac] != null) {
    const memberEntries = se_ReceiptActionsList(input[_Ac], context);
    if (input[_Ac]?.length === 0) {
      entries.Actions = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Actions.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_SEc] != null) {
    entries[_SEc] = input[_SEc];
  }
  return entries;
};
var se_ReceiptRuleNamesList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    entries[`member.${counter}`] = entry;
    counter++;
  }
  return entries;
};
var se_RecipientDsnFields = (input, context) => {
  const entries = {};
  if (input[_FR] != null) {
    entries[_FR] = input[_FR];
  }
  if (input[_A] != null) {
    entries[_A] = input[_A];
  }
  if (input[_RMe] != null) {
    entries[_RMe] = input[_RMe];
  }
  if (input[_St] != null) {
    entries[_St] = input[_St];
  }
  if (input[_DCi] != null) {
    entries[_DCi] = input[_DCi];
  }
  if (input[_LAD] != null) {
    entries[_LAD] = serializeDateTime(input[_LAD]);
  }
  if (input[_EF] != null) {
    const memberEntries = se_ExtensionFieldList(input[_EF], context);
    if (input[_EF]?.length === 0) {
      entries.ExtensionFields = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ExtensionFields.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_RecipientsList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    entries[`member.${counter}`] = entry;
    counter++;
  }
  return entries;
};
var se_ReorderReceiptRuleSetRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  if (input[_RNu] != null) {
    const memberEntries = se_ReceiptRuleNamesList(input[_RNu], context);
    if (input[_RNu]?.length === 0) {
      entries.RuleNames = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `RuleNames.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_S3Action = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_BN] != null) {
    entries[_BN] = input[_BN];
  }
  if (input[_OKP] != null) {
    entries[_OKP] = input[_OKP];
  }
  if (input[_KKA] != null) {
    entries[_KKA] = input[_KKA];
  }
  if (input[_IRA] != null) {
    entries[_IRA] = input[_IRA];
  }
  return entries;
};
var se_SendBounceRequest = (input, context) => {
  const entries = {};
  if (input[_OMI] != null) {
    entries[_OMI] = input[_OMI];
  }
  if (input[_BS] != null) {
    entries[_BS] = input[_BS];
  }
  if (input[_Ex] != null) {
    entries[_Ex] = input[_Ex];
  }
  if (input[_MD] != null) {
    const memberEntries = se_MessageDsn(input[_MD], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `MessageDsn.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_BRIL] != null) {
    const memberEntries = se_BouncedRecipientInfoList(input[_BRIL], context);
    if (input[_BRIL]?.length === 0) {
      entries.BouncedRecipientInfoList = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `BouncedRecipientInfoList.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_BSA] != null) {
    entries[_BSA] = input[_BSA];
  }
  return entries;
};
var se_SendBulkTemplatedEmailRequest = (input, context) => {
  const entries = {};
  if (input[_So] != null) {
    entries[_So] = input[_So];
  }
  if (input[_SAo] != null) {
    entries[_SAo] = input[_SAo];
  }
  if (input[_RTA] != null) {
    const memberEntries = se_AddressList(input[_RTA], context);
    if (input[_RTA]?.length === 0) {
      entries.ReplyToAddresses = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ReplyToAddresses.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_RP] != null) {
    entries[_RP] = input[_RP];
  }
  if (input[_RPA] != null) {
    entries[_RPA] = input[_RPA];
  }
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_DTe] != null) {
    const memberEntries = se_MessageTagList(input[_DTe], context);
    if (input[_DTe]?.length === 0) {
      entries.DefaultTags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `DefaultTags.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_Te] != null) {
    entries[_Te] = input[_Te];
  }
  if (input[_TAe] != null) {
    entries[_TAe] = input[_TAe];
  }
  if (input[_DTD] != null) {
    entries[_DTD] = input[_DTD];
  }
  if (input[_De] != null) {
    const memberEntries = se_BulkEmailDestinationList(input[_De], context);
    if (input[_De]?.length === 0) {
      entries.Destinations = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Destinations.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_SendCustomVerificationEmailRequest = (input, context) => {
  const entries = {};
  if (input[_EA] != null) {
    entries[_EA] = input[_EA];
  }
  if (input[_TN] != null) {
    entries[_TN] = input[_TN];
  }
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  return entries;
};
var se_SendEmailRequest = (input, context) => {
  const entries = {};
  if (input[_So] != null) {
    entries[_So] = input[_So];
  }
  if (input[_D] != null) {
    const memberEntries = se_Destination(input[_D], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Destination.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_M] != null) {
    const memberEntries = se_Message(input[_M], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Message.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_RTA] != null) {
    const memberEntries = se_AddressList(input[_RTA], context);
    if (input[_RTA]?.length === 0) {
      entries.ReplyToAddresses = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ReplyToAddresses.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_RP] != null) {
    entries[_RP] = input[_RP];
  }
  if (input[_SAo] != null) {
    entries[_SAo] = input[_SAo];
  }
  if (input[_RPA] != null) {
    entries[_RPA] = input[_RPA];
  }
  if (input[_Ta] != null) {
    const memberEntries = se_MessageTagList(input[_Ta], context);
    if (input[_Ta]?.length === 0) {
      entries.Tags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Tags.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  return entries;
};
var se_SendRawEmailRequest = (input, context) => {
  const entries = {};
  if (input[_So] != null) {
    entries[_So] = input[_So];
  }
  if (input[_De] != null) {
    const memberEntries = se_AddressList(input[_De], context);
    if (input[_De]?.length === 0) {
      entries.Destinations = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Destinations.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_RMa] != null) {
    const memberEntries = se_RawMessage(input[_RMa], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `RawMessage.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_FAr] != null) {
    entries[_FAr] = input[_FAr];
  }
  if (input[_SAo] != null) {
    entries[_SAo] = input[_SAo];
  }
  if (input[_RPA] != null) {
    entries[_RPA] = input[_RPA];
  }
  if (input[_Ta] != null) {
    const memberEntries = se_MessageTagList(input[_Ta], context);
    if (input[_Ta]?.length === 0) {
      entries.Tags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Tags.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  return entries;
};
var se_SendTemplatedEmailRequest = (input, context) => {
  const entries = {};
  if (input[_So] != null) {
    entries[_So] = input[_So];
  }
  if (input[_D] != null) {
    const memberEntries = se_Destination(input[_D], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Destination.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_RTA] != null) {
    const memberEntries = se_AddressList(input[_RTA], context);
    if (input[_RTA]?.length === 0) {
      entries.ReplyToAddresses = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ReplyToAddresses.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_RP] != null) {
    entries[_RP] = input[_RP];
  }
  if (input[_SAo] != null) {
    entries[_SAo] = input[_SAo];
  }
  if (input[_RPA] != null) {
    entries[_RPA] = input[_RPA];
  }
  if (input[_Ta] != null) {
    const memberEntries = se_MessageTagList(input[_Ta], context);
    if (input[_Ta]?.length === 0) {
      entries.Tags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Tags.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_Te] != null) {
    entries[_Te] = input[_Te];
  }
  if (input[_TAe] != null) {
    entries[_TAe] = input[_TAe];
  }
  if (input[_TD] != null) {
    entries[_TD] = input[_TD];
  }
  return entries;
};
var se_SetActiveReceiptRuleSetRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  return entries;
};
var se_SetIdentityDkimEnabledRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  if (input[_DE] != null) {
    entries[_DE] = input[_DE];
  }
  return entries;
};
var se_SetIdentityFeedbackForwardingEnabledRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  if (input[_FE] != null) {
    entries[_FE] = input[_FE];
  }
  return entries;
};
var se_SetIdentityHeadersInNotificationsEnabledRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  if (input[_NTo] != null) {
    entries[_NTo] = input[_NTo];
  }
  if (input[_E] != null) {
    entries[_E] = input[_E];
  }
  return entries;
};
var se_SetIdentityMailFromDomainRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  if (input[_MFD] != null) {
    entries[_MFD] = input[_MFD];
  }
  if (input[_BOMXF] != null) {
    entries[_BOMXF] = input[_BOMXF];
  }
  return entries;
};
var se_SetIdentityNotificationTopicRequest = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  if (input[_NTo] != null) {
    entries[_NTo] = input[_NTo];
  }
  if (input[_ST] != null) {
    entries[_ST] = input[_ST];
  }
  return entries;
};
var se_SetReceiptRulePositionRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  if (input[_RN] != null) {
    entries[_RN] = input[_RN];
  }
  if (input[_Af] != null) {
    entries[_Af] = input[_Af];
  }
  return entries;
};
var se_SNSAction = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_En] != null) {
    entries[_En] = input[_En];
  }
  return entries;
};
var se_SNSDestination = (input, context) => {
  const entries = {};
  if (input[_TARN] != null) {
    entries[_TARN] = input[_TARN];
  }
  return entries;
};
var se_StopAction = (input, context) => {
  const entries = {};
  if (input[_Sc] != null) {
    entries[_Sc] = input[_Sc];
  }
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  return entries;
};
var se_Template = (input, context) => {
  const entries = {};
  if (input[_TN] != null) {
    entries[_TN] = input[_TN];
  }
  if (input[_SP] != null) {
    entries[_SP] = input[_SP];
  }
  if (input[_TPe] != null) {
    entries[_TPe] = input[_TPe];
  }
  if (input[_HP] != null) {
    entries[_HP] = input[_HP];
  }
  return entries;
};
var se_TestRenderTemplateRequest = (input, context) => {
  const entries = {};
  if (input[_TN] != null) {
    entries[_TN] = input[_TN];
  }
  if (input[_TD] != null) {
    entries[_TD] = input[_TD];
  }
  return entries;
};
var se_TrackingOptions = (input, context) => {
  const entries = {};
  if (input[_CRD] != null) {
    entries[_CRD] = input[_CRD];
  }
  return entries;
};
var se_UpdateAccountSendingEnabledRequest = (input, context) => {
  const entries = {};
  if (input[_E] != null) {
    entries[_E] = input[_E];
  }
  return entries;
};
var se_UpdateConfigurationSetEventDestinationRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_ED] != null) {
    const memberEntries = se_EventDestination(input[_ED], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `EventDestination.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_UpdateConfigurationSetReputationMetricsEnabledRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_E] != null) {
    entries[_E] = input[_E];
  }
  return entries;
};
var se_UpdateConfigurationSetSendingEnabledRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_E] != null) {
    entries[_E] = input[_E];
  }
  return entries;
};
var se_UpdateConfigurationSetTrackingOptionsRequest = (input, context) => {
  const entries = {};
  if (input[_CSN] != null) {
    entries[_CSN] = input[_CSN];
  }
  if (input[_TO] != null) {
    const memberEntries = se_TrackingOptions(input[_TO], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `TrackingOptions.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_UpdateCustomVerificationEmailTemplateRequest = (input, context) => {
  const entries = {};
  if (input[_TN] != null) {
    entries[_TN] = input[_TN];
  }
  if (input[_FEA] != null) {
    entries[_FEA] = input[_FEA];
  }
  if (input[_TS] != null) {
    entries[_TS] = input[_TS];
  }
  if (input[_TC] != null) {
    entries[_TC] = input[_TC];
  }
  if (input[_SRURL] != null) {
    entries[_SRURL] = input[_SRURL];
  }
  if (input[_FRURL] != null) {
    entries[_FRURL] = input[_FRURL];
  }
  return entries;
};
var se_UpdateReceiptRuleRequest = (input, context) => {
  const entries = {};
  if (input[_RSN] != null) {
    entries[_RSN] = input[_RSN];
  }
  if (input[_Ru] != null) {
    const memberEntries = se_ReceiptRule(input[_Ru], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Rule.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_UpdateTemplateRequest = (input, context) => {
  const entries = {};
  if (input[_Te] != null) {
    const memberEntries = se_Template(input[_Te], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Template.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_VerifyDomainDkimRequest = (input, context) => {
  const entries = {};
  if (input[_Do] != null) {
    entries[_Do] = input[_Do];
  }
  return entries;
};
var se_VerifyDomainIdentityRequest = (input, context) => {
  const entries = {};
  if (input[_Do] != null) {
    entries[_Do] = input[_Do];
  }
  return entries;
};
var se_VerifyEmailAddressRequest = (input, context) => {
  const entries = {};
  if (input[_EA] != null) {
    entries[_EA] = input[_EA];
  }
  return entries;
};
var se_VerifyEmailIdentityRequest = (input, context) => {
  const entries = {};
  if (input[_EA] != null) {
    entries[_EA] = input[_EA];
  }
  return entries;
};
var se_WorkmailAction = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_OA] != null) {
    entries[_OA] = input[_OA];
  }
  return entries;
};
var de_AccountSendingPausedException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_AddHeaderAction = (output, context) => {
  const contents = {};
  if (output[_HN] != null) {
    contents[_HN] = expectString(output[_HN]);
  }
  if (output[_HV] != null) {
    contents[_HV] = expectString(output[_HV]);
  }
  return contents;
};
var de_AddressList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return expectString(entry);
  });
};
var de_AlreadyExistsException = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_BounceAction = (output, context) => {
  const contents = {};
  if (output[_TA] != null) {
    contents[_TA] = expectString(output[_TA]);
  }
  if (output[_SRC] != null) {
    contents[_SRC] = expectString(output[_SRC]);
  }
  if (output[_SC] != null) {
    contents[_SC] = expectString(output[_SC]);
  }
  if (output[_M] != null) {
    contents[_M] = expectString(output[_M]);
  }
  if (output[_S] != null) {
    contents[_S] = expectString(output[_S]);
  }
  return contents;
};
var de_BulkEmailDestinationStatus = (output, context) => {
  const contents = {};
  if (output[_St] != null) {
    contents[_St] = expectString(output[_St]);
  }
  if (output[_Er] != null) {
    contents[_Er] = expectString(output[_Er]);
  }
  if (output[_MIe] != null) {
    contents[_MIe] = expectString(output[_MIe]);
  }
  return contents;
};
var de_BulkEmailDestinationStatusList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_BulkEmailDestinationStatus(entry, context);
  });
};
var de_CannotDeleteException = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_CloneReceiptRuleSetResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_CloudWatchDestination = (output, context) => {
  const contents = {};
  if (output.DimensionConfigurations === "") {
    contents[_DC] = [];
  } else if (output[_DC] != null && output[_DC][_me] != null) {
    contents[_DC] = de_CloudWatchDimensionConfigurations(getArrayIfSingleItem(output[_DC][_me]), context);
  }
  return contents;
};
var de_CloudWatchDimensionConfiguration = (output, context) => {
  const contents = {};
  if (output[_DN] != null) {
    contents[_DN] = expectString(output[_DN]);
  }
  if (output[_DVS] != null) {
    contents[_DVS] = expectString(output[_DVS]);
  }
  if (output[_DDV] != null) {
    contents[_DDV] = expectString(output[_DDV]);
  }
  return contents;
};
var de_CloudWatchDimensionConfigurations = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_CloudWatchDimensionConfiguration(entry, context);
  });
};
var de_ConfigurationSet = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  return contents;
};
var de_ConfigurationSetAlreadyExistsException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_ConfigurationSetDoesNotExistException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_ConfigurationSets = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ConfigurationSet(entry, context);
  });
};
var de_ConfigurationSetSendingPausedException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_CreateConfigurationSetEventDestinationResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_CreateConfigurationSetResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_CreateConfigurationSetTrackingOptionsResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_CreateReceiptFilterResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_CreateReceiptRuleResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_CreateReceiptRuleSetResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_CreateTemplateResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_CustomVerificationEmailInvalidContentException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_CustomVerificationEmailTemplate = (output, context) => {
  const contents = {};
  if (output[_TN] != null) {
    contents[_TN] = expectString(output[_TN]);
  }
  if (output[_FEA] != null) {
    contents[_FEA] = expectString(output[_FEA]);
  }
  if (output[_TS] != null) {
    contents[_TS] = expectString(output[_TS]);
  }
  if (output[_SRURL] != null) {
    contents[_SRURL] = expectString(output[_SRURL]);
  }
  if (output[_FRURL] != null) {
    contents[_FRURL] = expectString(output[_FRURL]);
  }
  return contents;
};
var de_CustomVerificationEmailTemplateAlreadyExistsException = (output, context) => {
  const contents = {};
  if (output[_CVETN] != null) {
    contents[_CVETN] = expectString(output[_CVETN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_CustomVerificationEmailTemplateDoesNotExistException = (output, context) => {
  const contents = {};
  if (output[_CVETN] != null) {
    contents[_CVETN] = expectString(output[_CVETN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_CustomVerificationEmailTemplates = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_CustomVerificationEmailTemplate(entry, context);
  });
};
var de_DeleteConfigurationSetEventDestinationResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_DeleteConfigurationSetResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_DeleteConfigurationSetTrackingOptionsResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_DeleteIdentityPolicyResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_DeleteIdentityResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_DeleteReceiptFilterResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_DeleteReceiptRuleResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_DeleteReceiptRuleSetResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_DeleteTemplateResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_DeliveryOptions = (output, context) => {
  const contents = {};
  if (output[_TP] != null) {
    contents[_TP] = expectString(output[_TP]);
  }
  return contents;
};
var de_DescribeActiveReceiptRuleSetResponse = (output, context) => {
  const contents = {};
  if (output[_Me] != null) {
    contents[_Me] = de_ReceiptRuleSetMetadata(output[_Me], context);
  }
  if (output.Rules === "") {
    contents[_Rul] = [];
  } else if (output[_Rul] != null && output[_Rul][_me] != null) {
    contents[_Rul] = de_ReceiptRulesList(getArrayIfSingleItem(output[_Rul][_me]), context);
  }
  return contents;
};
var de_DescribeConfigurationSetResponse = (output, context) => {
  const contents = {};
  if (output[_CS] != null) {
    contents[_CS] = de_ConfigurationSet(output[_CS], context);
  }
  if (output.EventDestinations === "") {
    contents[_EDv] = [];
  } else if (output[_EDv] != null && output[_EDv][_me] != null) {
    contents[_EDv] = de_EventDestinations(getArrayIfSingleItem(output[_EDv][_me]), context);
  }
  if (output[_TO] != null) {
    contents[_TO] = de_TrackingOptions(output[_TO], context);
  }
  if (output[_DO] != null) {
    contents[_DO] = de_DeliveryOptions(output[_DO], context);
  }
  if (output[_RO] != null) {
    contents[_RO] = de_ReputationOptions(output[_RO], context);
  }
  return contents;
};
var de_DescribeReceiptRuleResponse = (output, context) => {
  const contents = {};
  if (output[_Ru] != null) {
    contents[_Ru] = de_ReceiptRule(output[_Ru], context);
  }
  return contents;
};
var de_DescribeReceiptRuleSetResponse = (output, context) => {
  const contents = {};
  if (output[_Me] != null) {
    contents[_Me] = de_ReceiptRuleSetMetadata(output[_Me], context);
  }
  if (output.Rules === "") {
    contents[_Rul] = [];
  } else if (output[_Rul] != null && output[_Rul][_me] != null) {
    contents[_Rul] = de_ReceiptRulesList(getArrayIfSingleItem(output[_Rul][_me]), context);
  }
  return contents;
};
var de_DkimAttributes = (output, context) => {
  return output.reduce((acc, pair) => {
    if (pair["value"] === null) {
      return acc;
    }
    acc[pair["key"]] = de_IdentityDkimAttributes(pair["value"], context);
    return acc;
  }, {});
};
var de_EventDestination = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  if (output[_E] != null) {
    contents[_E] = parseBoolean(output[_E]);
  }
  if (output.MatchingEventTypes === "") {
    contents[_MET] = [];
  } else if (output[_MET] != null && output[_MET][_me] != null) {
    contents[_MET] = de_EventTypes(getArrayIfSingleItem(output[_MET][_me]), context);
  }
  if (output[_KFD] != null) {
    contents[_KFD] = de_KinesisFirehoseDestination(output[_KFD], context);
  }
  if (output[_CWD] != null) {
    contents[_CWD] = de_CloudWatchDestination(output[_CWD], context);
  }
  if (output[_SNSD] != null) {
    contents[_SNSD] = de_SNSDestination(output[_SNSD], context);
  }
  return contents;
};
var de_EventDestinationAlreadyExistsException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_EDN] != null) {
    contents[_EDN] = expectString(output[_EDN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_EventDestinationDoesNotExistException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_EDN] != null) {
    contents[_EDN] = expectString(output[_EDN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_EventDestinations = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_EventDestination(entry, context);
  });
};
var de_EventTypes = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return expectString(entry);
  });
};
var de_FromEmailAddressNotVerifiedException = (output, context) => {
  const contents = {};
  if (output[_FEA] != null) {
    contents[_FEA] = expectString(output[_FEA]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_GetAccountSendingEnabledResponse = (output, context) => {
  const contents = {};
  if (output[_E] != null) {
    contents[_E] = parseBoolean(output[_E]);
  }
  return contents;
};
var de_GetCustomVerificationEmailTemplateResponse = (output, context) => {
  const contents = {};
  if (output[_TN] != null) {
    contents[_TN] = expectString(output[_TN]);
  }
  if (output[_FEA] != null) {
    contents[_FEA] = expectString(output[_FEA]);
  }
  if (output[_TS] != null) {
    contents[_TS] = expectString(output[_TS]);
  }
  if (output[_TC] != null) {
    contents[_TC] = expectString(output[_TC]);
  }
  if (output[_SRURL] != null) {
    contents[_SRURL] = expectString(output[_SRURL]);
  }
  if (output[_FRURL] != null) {
    contents[_FRURL] = expectString(output[_FRURL]);
  }
  return contents;
};
var de_GetIdentityDkimAttributesResponse = (output, context) => {
  const contents = {};
  if (output.DkimAttributes === "") {
    contents[_DA] = {};
  } else if (output[_DA] != null && output[_DA][_e] != null) {
    contents[_DA] = de_DkimAttributes(getArrayIfSingleItem(output[_DA][_e]), context);
  }
  return contents;
};
var de_GetIdentityMailFromDomainAttributesResponse = (output, context) => {
  const contents = {};
  if (output.MailFromDomainAttributes === "") {
    contents[_MFDA] = {};
  } else if (output[_MFDA] != null && output[_MFDA][_e] != null) {
    contents[_MFDA] = de_MailFromDomainAttributes(getArrayIfSingleItem(output[_MFDA][_e]), context);
  }
  return contents;
};
var de_GetIdentityNotificationAttributesResponse = (output, context) => {
  const contents = {};
  if (output.NotificationAttributes === "") {
    contents[_NA] = {};
  } else if (output[_NA] != null && output[_NA][_e] != null) {
    contents[_NA] = de_NotificationAttributes(getArrayIfSingleItem(output[_NA][_e]), context);
  }
  return contents;
};
var de_GetIdentityPoliciesResponse = (output, context) => {
  const contents = {};
  if (output.Policies === "") {
    contents[_Po] = {};
  } else if (output[_Po] != null && output[_Po][_e] != null) {
    contents[_Po] = de_PolicyMap(getArrayIfSingleItem(output[_Po][_e]), context);
  }
  return contents;
};
var de_GetIdentityVerificationAttributesResponse = (output, context) => {
  const contents = {};
  if (output.VerificationAttributes === "") {
    contents[_VA] = {};
  } else if (output[_VA] != null && output[_VA][_e] != null) {
    contents[_VA] = de_VerificationAttributes(getArrayIfSingleItem(output[_VA][_e]), context);
  }
  return contents;
};
var de_GetSendQuotaResponse = (output, context) => {
  const contents = {};
  if (output[_MHS] != null) {
    contents[_MHS] = strictParseFloat(output[_MHS]);
  }
  if (output[_MSR] != null) {
    contents[_MSR] = strictParseFloat(output[_MSR]);
  }
  if (output[_SLH] != null) {
    contents[_SLH] = strictParseFloat(output[_SLH]);
  }
  return contents;
};
var de_GetSendStatisticsResponse = (output, context) => {
  const contents = {};
  if (output.SendDataPoints === "") {
    contents[_SDP] = [];
  } else if (output[_SDP] != null && output[_SDP][_me] != null) {
    contents[_SDP] = de_SendDataPointList(getArrayIfSingleItem(output[_SDP][_me]), context);
  }
  return contents;
};
var de_GetTemplateResponse = (output, context) => {
  const contents = {};
  if (output[_Te] != null) {
    contents[_Te] = de_Template(output[_Te], context);
  }
  return contents;
};
var de_IdentityDkimAttributes = (output, context) => {
  const contents = {};
  if (output[_DE] != null) {
    contents[_DE] = parseBoolean(output[_DE]);
  }
  if (output[_DVSk] != null) {
    contents[_DVSk] = expectString(output[_DVSk]);
  }
  if (output.DkimTokens === "") {
    contents[_DTk] = [];
  } else if (output[_DTk] != null && output[_DTk][_me] != null) {
    contents[_DTk] = de_VerificationTokenList(getArrayIfSingleItem(output[_DTk][_me]), context);
  }
  return contents;
};
var de_IdentityList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return expectString(entry);
  });
};
var de_IdentityMailFromDomainAttributes = (output, context) => {
  const contents = {};
  if (output[_MFD] != null) {
    contents[_MFD] = expectString(output[_MFD]);
  }
  if (output[_MFDS] != null) {
    contents[_MFDS] = expectString(output[_MFDS]);
  }
  if (output[_BOMXF] != null) {
    contents[_BOMXF] = expectString(output[_BOMXF]);
  }
  return contents;
};
var de_IdentityNotificationAttributes = (output, context) => {
  const contents = {};
  if (output[_BTo] != null) {
    contents[_BTo] = expectString(output[_BTo]);
  }
  if (output[_CTo] != null) {
    contents[_CTo] = expectString(output[_CTo]);
  }
  if (output[_DTel] != null) {
    contents[_DTel] = expectString(output[_DTel]);
  }
  if (output[_FE] != null) {
    contents[_FE] = parseBoolean(output[_FE]);
  }
  if (output[_HIBNE] != null) {
    contents[_HIBNE] = parseBoolean(output[_HIBNE]);
  }
  if (output[_HICNE] != null) {
    contents[_HICNE] = parseBoolean(output[_HICNE]);
  }
  if (output[_HIDNE] != null) {
    contents[_HIDNE] = parseBoolean(output[_HIDNE]);
  }
  return contents;
};
var de_IdentityVerificationAttributes = (output, context) => {
  const contents = {};
  if (output[_VS] != null) {
    contents[_VS] = expectString(output[_VS]);
  }
  if (output[_VT] != null) {
    contents[_VT] = expectString(output[_VT]);
  }
  return contents;
};
var de_InvalidCloudWatchDestinationException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_EDN] != null) {
    contents[_EDN] = expectString(output[_EDN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidConfigurationSetException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidDeliveryOptionsException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidFirehoseDestinationException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_EDN] != null) {
    contents[_EDN] = expectString(output[_EDN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidLambdaFunctionException = (output, context) => {
  const contents = {};
  if (output[_FA] != null) {
    contents[_FA] = expectString(output[_FA]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidPolicyException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidRenderingParameterException = (output, context) => {
  const contents = {};
  if (output[_TN] != null) {
    contents[_TN] = expectString(output[_TN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidS3ConfigurationException = (output, context) => {
  const contents = {};
  if (output[_Bu] != null) {
    contents[_Bu] = expectString(output[_Bu]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidSNSDestinationException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_EDN] != null) {
    contents[_EDN] = expectString(output[_EDN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidSnsTopicException = (output, context) => {
  const contents = {};
  if (output[_To] != null) {
    contents[_To] = expectString(output[_To]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidTemplateException = (output, context) => {
  const contents = {};
  if (output[_TN] != null) {
    contents[_TN] = expectString(output[_TN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidTrackingOptionsException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_KinesisFirehoseDestination = (output, context) => {
  const contents = {};
  if (output[_IAMRARN] != null) {
    contents[_IAMRARN] = expectString(output[_IAMRARN]);
  }
  if (output[_DSARN] != null) {
    contents[_DSARN] = expectString(output[_DSARN]);
  }
  return contents;
};
var de_LambdaAction = (output, context) => {
  const contents = {};
  if (output[_TA] != null) {
    contents[_TA] = expectString(output[_TA]);
  }
  if (output[_FA] != null) {
    contents[_FA] = expectString(output[_FA]);
  }
  if (output[_IT] != null) {
    contents[_IT] = expectString(output[_IT]);
  }
  return contents;
};
var de_LimitExceededException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_ListConfigurationSetsResponse = (output, context) => {
  const contents = {};
  if (output.ConfigurationSets === "") {
    contents[_CSo] = [];
  } else if (output[_CSo] != null && output[_CSo][_me] != null) {
    contents[_CSo] = de_ConfigurationSets(getArrayIfSingleItem(output[_CSo][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListCustomVerificationEmailTemplatesResponse = (output, context) => {
  const contents = {};
  if (output.CustomVerificationEmailTemplates === "") {
    contents[_CVET] = [];
  } else if (output[_CVET] != null && output[_CVET][_me] != null) {
    contents[_CVET] = de_CustomVerificationEmailTemplates(getArrayIfSingleItem(output[_CVET][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListIdentitiesResponse = (output, context) => {
  const contents = {};
  if (output.Identities === "") {
    contents[_Id] = [];
  } else if (output[_Id] != null && output[_Id][_me] != null) {
    contents[_Id] = de_IdentityList(getArrayIfSingleItem(output[_Id][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListIdentityPoliciesResponse = (output, context) => {
  const contents = {};
  if (output.PolicyNames === "") {
    contents[_PNo] = [];
  } else if (output[_PNo] != null && output[_PNo][_me] != null) {
    contents[_PNo] = de_PolicyNameList(getArrayIfSingleItem(output[_PNo][_me]), context);
  }
  return contents;
};
var de_ListReceiptFiltersResponse = (output, context) => {
  const contents = {};
  if (output.Filters === "") {
    contents[_Fi] = [];
  } else if (output[_Fi] != null && output[_Fi][_me] != null) {
    contents[_Fi] = de_ReceiptFilterList(getArrayIfSingleItem(output[_Fi][_me]), context);
  }
  return contents;
};
var de_ListReceiptRuleSetsResponse = (output, context) => {
  const contents = {};
  if (output.RuleSets === "") {
    contents[_RS] = [];
  } else if (output[_RS] != null && output[_RS][_me] != null) {
    contents[_RS] = de_ReceiptRuleSetsLists(getArrayIfSingleItem(output[_RS][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListTemplatesResponse = (output, context) => {
  const contents = {};
  if (output.TemplatesMetadata === "") {
    contents[_TM] = [];
  } else if (output[_TM] != null && output[_TM][_me] != null) {
    contents[_TM] = de_TemplateMetadataList(getArrayIfSingleItem(output[_TM][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListVerifiedEmailAddressesResponse = (output, context) => {
  const contents = {};
  if (output.VerifiedEmailAddresses === "") {
    contents[_VEAe] = [];
  } else if (output[_VEAe] != null && output[_VEAe][_me] != null) {
    contents[_VEAe] = de_AddressList(getArrayIfSingleItem(output[_VEAe][_me]), context);
  }
  return contents;
};
var de_MailFromDomainAttributes = (output, context) => {
  return output.reduce((acc, pair) => {
    if (pair["value"] === null) {
      return acc;
    }
    acc[pair["key"]] = de_IdentityMailFromDomainAttributes(pair["value"], context);
    return acc;
  }, {});
};
var de_MailFromDomainNotVerifiedException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_MessageRejected = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_MissingRenderingAttributeException = (output, context) => {
  const contents = {};
  if (output[_TN] != null) {
    contents[_TN] = expectString(output[_TN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_NotificationAttributes = (output, context) => {
  return output.reduce((acc, pair) => {
    if (pair["value"] === null) {
      return acc;
    }
    acc[pair["key"]] = de_IdentityNotificationAttributes(pair["value"], context);
    return acc;
  }, {});
};
var de_PolicyMap = (output, context) => {
  return output.reduce((acc, pair) => {
    if (pair["value"] === null) {
      return acc;
    }
    acc[pair["key"]] = expectString(pair["value"]);
    return acc;
  }, {});
};
var de_PolicyNameList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return expectString(entry);
  });
};
var de_ProductionAccessNotGrantedException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_PutConfigurationSetDeliveryOptionsResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_PutIdentityPolicyResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_ReceiptAction = (output, context) => {
  const contents = {};
  if (output[_SA] != null) {
    contents[_SA] = de_S3Action(output[_SA], context);
  }
  if (output[_BAo] != null) {
    contents[_BAo] = de_BounceAction(output[_BAo], context);
  }
  if (output[_WA] != null) {
    contents[_WA] = de_WorkmailAction(output[_WA], context);
  }
  if (output[_LA] != null) {
    contents[_LA] = de_LambdaAction(output[_LA], context);
  }
  if (output[_SAt] != null) {
    contents[_SAt] = de_StopAction(output[_SAt], context);
  }
  if (output[_AHA] != null) {
    contents[_AHA] = de_AddHeaderAction(output[_AHA], context);
  }
  if (output[_SNSA] != null) {
    contents[_SNSA] = de_SNSAction(output[_SNSA], context);
  }
  return contents;
};
var de_ReceiptActionsList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ReceiptAction(entry, context);
  });
};
var de_ReceiptFilter = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  if (output[_IF] != null) {
    contents[_IF] = de_ReceiptIpFilter(output[_IF], context);
  }
  return contents;
};
var de_ReceiptFilterList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ReceiptFilter(entry, context);
  });
};
var de_ReceiptIpFilter = (output, context) => {
  const contents = {};
  if (output[_P] != null) {
    contents[_P] = expectString(output[_P]);
  }
  if (output[_Ci] != null) {
    contents[_Ci] = expectString(output[_Ci]);
  }
  return contents;
};
var de_ReceiptRule = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  if (output[_E] != null) {
    contents[_E] = parseBoolean(output[_E]);
  }
  if (output[_TP] != null) {
    contents[_TP] = expectString(output[_TP]);
  }
  if (output.Recipients === "") {
    contents[_Re] = [];
  } else if (output[_Re] != null && output[_Re][_me] != null) {
    contents[_Re] = de_RecipientsList(getArrayIfSingleItem(output[_Re][_me]), context);
  }
  if (output.Actions === "") {
    contents[_Ac] = [];
  } else if (output[_Ac] != null && output[_Ac][_me] != null) {
    contents[_Ac] = de_ReceiptActionsList(getArrayIfSingleItem(output[_Ac][_me]), context);
  }
  if (output[_SEc] != null) {
    contents[_SEc] = parseBoolean(output[_SEc]);
  }
  return contents;
};
var de_ReceiptRuleSetMetadata = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  if (output[_CTr] != null) {
    contents[_CTr] = expectNonNull(parseRfc3339DateTimeWithOffset(output[_CTr]));
  }
  return contents;
};
var de_ReceiptRuleSetsLists = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ReceiptRuleSetMetadata(entry, context);
  });
};
var de_ReceiptRulesList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ReceiptRule(entry, context);
  });
};
var de_RecipientsList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return expectString(entry);
  });
};
var de_ReorderReceiptRuleSetResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_ReputationOptions = (output, context) => {
  const contents = {};
  if (output[_SEe] != null) {
    contents[_SEe] = parseBoolean(output[_SEe]);
  }
  if (output[_RME] != null) {
    contents[_RME] = parseBoolean(output[_RME]);
  }
  if (output[_LFS] != null) {
    contents[_LFS] = expectNonNull(parseRfc3339DateTimeWithOffset(output[_LFS]));
  }
  return contents;
};
var de_RuleDoesNotExistException = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_RuleSetDoesNotExistException = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_S3Action = (output, context) => {
  const contents = {};
  if (output[_TA] != null) {
    contents[_TA] = expectString(output[_TA]);
  }
  if (output[_BN] != null) {
    contents[_BN] = expectString(output[_BN]);
  }
  if (output[_OKP] != null) {
    contents[_OKP] = expectString(output[_OKP]);
  }
  if (output[_KKA] != null) {
    contents[_KKA] = expectString(output[_KKA]);
  }
  if (output[_IRA] != null) {
    contents[_IRA] = expectString(output[_IRA]);
  }
  return contents;
};
var de_SendBounceResponse = (output, context) => {
  const contents = {};
  if (output[_MIe] != null) {
    contents[_MIe] = expectString(output[_MIe]);
  }
  return contents;
};
var de_SendBulkTemplatedEmailResponse = (output, context) => {
  const contents = {};
  if (output.Status === "") {
    contents[_St] = [];
  } else if (output[_St] != null && output[_St][_me] != null) {
    contents[_St] = de_BulkEmailDestinationStatusList(getArrayIfSingleItem(output[_St][_me]), context);
  }
  return contents;
};
var de_SendCustomVerificationEmailResponse = (output, context) => {
  const contents = {};
  if (output[_MIe] != null) {
    contents[_MIe] = expectString(output[_MIe]);
  }
  return contents;
};
var de_SendDataPoint = (output, context) => {
  const contents = {};
  if (output[_Ti] != null) {
    contents[_Ti] = expectNonNull(parseRfc3339DateTimeWithOffset(output[_Ti]));
  }
  if (output[_DAe] != null) {
    contents[_DAe] = strictParseLong(output[_DAe]);
  }
  if (output[_Bo] != null) {
    contents[_Bo] = strictParseLong(output[_Bo]);
  }
  if (output[_Co] != null) {
    contents[_Co] = strictParseLong(output[_Co]);
  }
  if (output[_Rej] != null) {
    contents[_Rej] = strictParseLong(output[_Rej]);
  }
  return contents;
};
var de_SendDataPointList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_SendDataPoint(entry, context);
  });
};
var de_SendEmailResponse = (output, context) => {
  const contents = {};
  if (output[_MIe] != null) {
    contents[_MIe] = expectString(output[_MIe]);
  }
  return contents;
};
var de_SendRawEmailResponse = (output, context) => {
  const contents = {};
  if (output[_MIe] != null) {
    contents[_MIe] = expectString(output[_MIe]);
  }
  return contents;
};
var de_SendTemplatedEmailResponse = (output, context) => {
  const contents = {};
  if (output[_MIe] != null) {
    contents[_MIe] = expectString(output[_MIe]);
  }
  return contents;
};
var de_SetActiveReceiptRuleSetResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_SetIdentityDkimEnabledResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_SetIdentityFeedbackForwardingEnabledResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_SetIdentityHeadersInNotificationsEnabledResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_SetIdentityMailFromDomainResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_SetIdentityNotificationTopicResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_SetReceiptRulePositionResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_SNSAction = (output, context) => {
  const contents = {};
  if (output[_TA] != null) {
    contents[_TA] = expectString(output[_TA]);
  }
  if (output[_En] != null) {
    contents[_En] = expectString(output[_En]);
  }
  return contents;
};
var de_SNSDestination = (output, context) => {
  const contents = {};
  if (output[_TARN] != null) {
    contents[_TARN] = expectString(output[_TARN]);
  }
  return contents;
};
var de_StopAction = (output, context) => {
  const contents = {};
  if (output[_Sc] != null) {
    contents[_Sc] = expectString(output[_Sc]);
  }
  if (output[_TA] != null) {
    contents[_TA] = expectString(output[_TA]);
  }
  return contents;
};
var de_Template = (output, context) => {
  const contents = {};
  if (output[_TN] != null) {
    contents[_TN] = expectString(output[_TN]);
  }
  if (output[_SP] != null) {
    contents[_SP] = expectString(output[_SP]);
  }
  if (output[_TPe] != null) {
    contents[_TPe] = expectString(output[_TPe]);
  }
  if (output[_HP] != null) {
    contents[_HP] = expectString(output[_HP]);
  }
  return contents;
};
var de_TemplateDoesNotExistException = (output, context) => {
  const contents = {};
  if (output[_TN] != null) {
    contents[_TN] = expectString(output[_TN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_TemplateMetadata = (output, context) => {
  const contents = {};
  if (output[_N] != null) {
    contents[_N] = expectString(output[_N]);
  }
  if (output[_CTr] != null) {
    contents[_CTr] = expectNonNull(parseRfc3339DateTimeWithOffset(output[_CTr]));
  }
  return contents;
};
var de_TemplateMetadataList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_TemplateMetadata(entry, context);
  });
};
var de_TestRenderTemplateResponse = (output, context) => {
  const contents = {};
  if (output[_RTe] != null) {
    contents[_RTe] = expectString(output[_RTe]);
  }
  return contents;
};
var de_TrackingOptions = (output, context) => {
  const contents = {};
  if (output[_CRD] != null) {
    contents[_CRD] = expectString(output[_CRD]);
  }
  return contents;
};
var de_TrackingOptionsAlreadyExistsException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_TrackingOptionsDoesNotExistException = (output, context) => {
  const contents = {};
  if (output[_CSN] != null) {
    contents[_CSN] = expectString(output[_CSN]);
  }
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_UpdateConfigurationSetEventDestinationResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_UpdateConfigurationSetTrackingOptionsResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_UpdateReceiptRuleResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_UpdateTemplateResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_VerificationAttributes = (output, context) => {
  return output.reduce((acc, pair) => {
    if (pair["value"] === null) {
      return acc;
    }
    acc[pair["key"]] = de_IdentityVerificationAttributes(pair["value"], context);
    return acc;
  }, {});
};
var de_VerificationTokenList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return expectString(entry);
  });
};
var de_VerifyDomainDkimResponse = (output, context) => {
  const contents = {};
  if (output.DkimTokens === "") {
    contents[_DTk] = [];
  } else if (output[_DTk] != null && output[_DTk][_me] != null) {
    contents[_DTk] = de_VerificationTokenList(getArrayIfSingleItem(output[_DTk][_me]), context);
  }
  return contents;
};
var de_VerifyDomainIdentityResponse = (output, context) => {
  const contents = {};
  if (output[_VT] != null) {
    contents[_VT] = expectString(output[_VT]);
  }
  return contents;
};
var de_VerifyEmailIdentityResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_WorkmailAction = (output, context) => {
  const contents = {};
  if (output[_TA] != null) {
    contents[_TA] = expectString(output[_TA]);
  }
  if (output[_OA] != null) {
    contents[_OA] = expectString(output[_OA]);
  }
  return contents;
};
var deserializeMetadata = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var throwDefaultError = withBaseException(SESServiceException);
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
var SHARED_HEADERS = {
  "content-type": "application/x-www-form-urlencoded"
};
var _ = "2010-12-01";
var _A = "Action";
var _AD = "ArrivalDate";
var _AHA = "AddHeaderAction";
var _Ac = "Actions";
var _Af = "After";
var _B = "Body";
var _BA = "BccAddresses";
var _BAo = "BounceAction";
var _BN = "BucketName";
var _BOMXF = "BehaviorOnMXFailure";
var _BRIL = "BouncedRecipientInfoList";
var _BS = "BounceSender";
var _BSA = "BounceSenderArn";
var _BT = "BounceType";
var _BTo = "BounceTopic";
var _Bo = "Bounces";
var _Bu = "Bucket";
var _C = "Charset";
var _CA = "CcAddresses";
var _CCS = "CreateConfigurationSet";
var _CCSED = "CreateConfigurationSetEventDestination";
var _CCSTO = "CreateConfigurationSetTrackingOptions";
var _CCVET = "CreateCustomVerificationEmailTemplate";
var _CRD = "CustomRedirectDomain";
var _CRF = "CreateReceiptFilter";
var _CRR = "CreateReceiptRule";
var _CRRS = "CloneReceiptRuleSet";
var _CRRSr = "CreateReceiptRuleSet";
var _CS = "ConfigurationSet";
var _CSAN = "ConfigurationSetAttributeNames";
var _CSN = "ConfigurationSetName";
var _CSo = "ConfigurationSets";
var _CT = "CreateTemplate";
var _CTo = "ComplaintTopic";
var _CTr = "CreatedTimestamp";
var _CVET = "CustomVerificationEmailTemplates";
var _CVETN = "CustomVerificationEmailTemplateName";
var _CWD = "CloudWatchDestination";
var _Ci = "Cidr";
var _Co = "Complaints";
var _D = "Destination";
var _DA = "DkimAttributes";
var _DARRS = "DescribeActiveReceiptRuleSet";
var _DAe = "DeliveryAttempts";
var _DC = "DimensionConfigurations";
var _DCS = "DeleteConfigurationSet";
var _DCSED = "DeleteConfigurationSetEventDestination";
var _DCSTO = "DeleteConfigurationSetTrackingOptions";
var _DCSe = "DescribeConfigurationSet";
var _DCVET = "DeleteCustomVerificationEmailTemplate";
var _DCi = "DiagnosticCode";
var _DDV = "DefaultDimensionValue";
var _DE = "DkimEnabled";
var _DI = "DeleteIdentity";
var _DIP = "DeleteIdentityPolicy";
var _DN = "DimensionName";
var _DO = "DeliveryOptions";
var _DRF = "DeleteReceiptFilter";
var _DRR = "DeleteReceiptRule";
var _DRRS = "DeleteReceiptRuleSet";
var _DRRSe = "DescribeReceiptRuleSet";
var _DRRe = "DescribeReceiptRule";
var _DSARN = "DeliveryStreamARN";
var _DT = "DeleteTemplate";
var _DTD = "DefaultTemplateData";
var _DTe = "DefaultTags";
var _DTel = "DeliveryTopic";
var _DTk = "DkimTokens";
var _DVEA = "DeleteVerifiedEmailAddress";
var _DVS = "DimensionValueSource";
var _DVSk = "DkimVerificationStatus";
var _Da = "Data";
var _De = "Destinations";
var _Do = "Domain";
var _E = "Enabled";
var _EA = "EmailAddress";
var _ED = "EventDestination";
var _EDN = "EventDestinationName";
var _EDv = "EventDestinations";
var _EF = "ExtensionFields";
var _En = "Encoding";
var _Er = "Error";
var _Ex = "Explanation";
var _F = "Filter";
var _FA = "FunctionArn";
var _FAr = "FromArn";
var _FE = "ForwardingEnabled";
var _FEA = "FromEmailAddress";
var _FN = "FilterName";
var _FR = "FinalRecipient";
var _FRURL = "FailureRedirectionURL";
var _Fi = "Filters";
var _GASE = "GetAccountSendingEnabled";
var _GCVET = "GetCustomVerificationEmailTemplate";
var _GIDA = "GetIdentityDkimAttributes";
var _GIMFDA = "GetIdentityMailFromDomainAttributes";
var _GINA = "GetIdentityNotificationAttributes";
var _GIP = "GetIdentityPolicies";
var _GIVA = "GetIdentityVerificationAttributes";
var _GSQ = "GetSendQuota";
var _GSS = "GetSendStatistics";
var _GT = "GetTemplate";
var _H = "Html";
var _HIBNE = "HeadersInBounceNotificationsEnabled";
var _HICNE = "HeadersInComplaintNotificationsEnabled";
var _HIDNE = "HeadersInDeliveryNotificationsEnabled";
var _HN = "HeaderName";
var _HP = "HtmlPart";
var _HV = "HeaderValue";
var _I = "Identity";
var _IAMRARN = "IAMRoleARN";
var _IF = "IpFilter";
var _IRA = "IamRoleArn";
var _IT = "InvocationType";
var _ITd = "IdentityType";
var _Id = "Identities";
var _KFD = "KinesisFirehoseDestination";
var _KKA = "KmsKeyArn";
var _LA = "LambdaAction";
var _LAD = "LastAttemptDate";
var _LCS = "ListConfigurationSets";
var _LCVET = "ListCustomVerificationEmailTemplates";
var _LFS = "LastFreshStart";
var _LI = "ListIdentities";
var _LIP = "ListIdentityPolicies";
var _LRF = "ListReceiptFilters";
var _LRRS = "ListReceiptRuleSets";
var _LT = "ListTemplates";
var _LVEA = "ListVerifiedEmailAddresses";
var _M = "Message";
var _MD = "MessageDsn";
var _MET = "MatchingEventTypes";
var _MFD = "MailFromDomain";
var _MFDA = "MailFromDomainAttributes";
var _MFDS = "MailFromDomainStatus";
var _MHS = "Max24HourSend";
var _MI = "MaxItems";
var _MIe = "MessageId";
var _MR = "MaxResults";
var _MSR = "MaxSendRate";
var _Me = "Metadata";
var _N = "Name";
var _NA = "NotificationAttributes";
var _NT = "NextToken";
var _NTo = "NotificationType";
var _OA = "OrganizationArn";
var _OKP = "ObjectKeyPrefix";
var _OMI = "OriginalMessageId";
var _ORSN = "OriginalRuleSetName";
var _P = "Policy";
var _PCSDO = "PutConfigurationSetDeliveryOptions";
var _PIP = "PutIdentityPolicy";
var _PN = "PolicyName";
var _PNo = "PolicyNames";
var _Po = "Policies";
var _R = "Recipient";
var _RA = "RecipientArn";
var _RDF = "RecipientDsnFields";
var _RM = "ReportingMta";
var _RME = "ReputationMetricsEnabled";
var _RMa = "RawMessage";
var _RMe = "RemoteMta";
var _RN = "RuleName";
var _RNu = "RuleNames";
var _RO = "ReputationOptions";
var _RP = "ReturnPath";
var _RPA = "ReturnPathArn";
var _RRRS = "ReorderReceiptRuleSet";
var _RS = "RuleSets";
var _RSN = "RuleSetName";
var _RT = "ReplacementTags";
var _RTA = "ReplyToAddresses";
var _RTD = "ReplacementTemplateData";
var _RTe = "RenderedTemplate";
var _Re = "Recipients";
var _Rej = "Rejects";
var _Ru = "Rule";
var _Rul = "Rules";
var _S = "Sender";
var _SA = "S3Action";
var _SARRS = "SetActiveReceiptRuleSet";
var _SAo = "SourceArn";
var _SAt = "StopAction";
var _SB = "SendBounce";
var _SBTE = "SendBulkTemplatedEmail";
var _SC = "StatusCode";
var _SCVE = "SendCustomVerificationEmail";
var _SDP = "SendDataPoints";
var _SE = "SendEmail";
var _SEc = "ScanEnabled";
var _SEe = "SendingEnabled";
var _SIDE = "SetIdentityDkimEnabled";
var _SIFFE = "SetIdentityFeedbackForwardingEnabled";
var _SIHINE = "SetIdentityHeadersInNotificationsEnabled";
var _SIMFD = "SetIdentityMailFromDomain";
var _SINT = "SetIdentityNotificationTopic";
var _SLH = "SentLast24Hours";
var _SNSA = "SNSAction";
var _SNSD = "SNSDestination";
var _SP = "SubjectPart";
var _SRC = "SmtpReplyCode";
var _SRE = "SendRawEmail";
var _SRRP = "SetReceiptRulePosition";
var _SRURL = "SuccessRedirectionURL";
var _ST = "SnsTopic";
var _STE = "SendTemplatedEmail";
var _Sc = "Scope";
var _So = "Source";
var _St = "Status";
var _Su = "Subject";
var _T = "Text";
var _TA = "TopicArn";
var _TARN = "TopicARN";
var _TAe = "TemplateArn";
var _TAo = "ToAddresses";
var _TC = "TemplateContent";
var _TD = "TemplateData";
var _TM = "TemplatesMetadata";
var _TN = "TemplateName";
var _TO = "TrackingOptions";
var _TP = "TlsPolicy";
var _TPe = "TextPart";
var _TRT = "TestRenderTemplate";
var _TS = "TemplateSubject";
var _Ta = "Tags";
var _Te = "Template";
var _Ti = "Timestamp";
var _To = "Topic";
var _UASE = "UpdateAccountSendingEnabled";
var _UCSED = "UpdateConfigurationSetEventDestination";
var _UCSRME = "UpdateConfigurationSetReputationMetricsEnabled";
var _UCSSE = "UpdateConfigurationSetSendingEnabled";
var _UCSTO = "UpdateConfigurationSetTrackingOptions";
var _UCVET = "UpdateCustomVerificationEmailTemplate";
var _URR = "UpdateReceiptRule";
var _UT = "UpdateTemplate";
var _V = "Version";
var _VA = "VerificationAttributes";
var _VDD = "VerifyDomainDkim";
var _VDI = "VerifyDomainIdentity";
var _VEA = "VerifyEmailAddress";
var _VEAe = "VerifiedEmailAddresses";
var _VEI = "VerifyEmailIdentity";
var _VS = "VerificationStatus";
var _VT = "VerificationToken";
var _Va = "Value";
var _WA = "WorkmailAction";
var _e = "entry";
var _m = "message";
var _me = "member";
var buildFormUrlencodedString = (formEntries) => Object.entries(formEntries).map(([key, value]) => extendedEncodeURIComponent(key) + "=" + extendedEncodeURIComponent(value)).join("&");
var loadQueryErrorCode = (output, data) => {
  if (data.Error?.Code !== void 0) {
    return data.Error.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/CloneReceiptRuleSetCommand.js
var CloneReceiptRuleSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "CloneReceiptRuleSet", {}).n("SESClient", "CloneReceiptRuleSetCommand").f(void 0, void 0).ser(se_CloneReceiptRuleSetCommand).de(de_CloneReceiptRuleSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/CreateConfigurationSetCommand.js
var CreateConfigurationSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "CreateConfigurationSet", {}).n("SESClient", "CreateConfigurationSetCommand").f(void 0, void 0).ser(se_CreateConfigurationSetCommand).de(de_CreateConfigurationSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/CreateConfigurationSetEventDestinationCommand.js
var CreateConfigurationSetEventDestinationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "CreateConfigurationSetEventDestination", {}).n("SESClient", "CreateConfigurationSetEventDestinationCommand").f(void 0, void 0).ser(se_CreateConfigurationSetEventDestinationCommand).de(de_CreateConfigurationSetEventDestinationCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/CreateConfigurationSetTrackingOptionsCommand.js
var CreateConfigurationSetTrackingOptionsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "CreateConfigurationSetTrackingOptions", {}).n("SESClient", "CreateConfigurationSetTrackingOptionsCommand").f(void 0, void 0).ser(se_CreateConfigurationSetTrackingOptionsCommand).de(de_CreateConfigurationSetTrackingOptionsCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/CreateCustomVerificationEmailTemplateCommand.js
var CreateCustomVerificationEmailTemplateCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "CreateCustomVerificationEmailTemplate", {}).n("SESClient", "CreateCustomVerificationEmailTemplateCommand").f(void 0, void 0).ser(se_CreateCustomVerificationEmailTemplateCommand).de(de_CreateCustomVerificationEmailTemplateCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/CreateReceiptFilterCommand.js
var CreateReceiptFilterCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "CreateReceiptFilter", {}).n("SESClient", "CreateReceiptFilterCommand").f(void 0, void 0).ser(se_CreateReceiptFilterCommand).de(de_CreateReceiptFilterCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/CreateReceiptRuleCommand.js
var CreateReceiptRuleCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "CreateReceiptRule", {}).n("SESClient", "CreateReceiptRuleCommand").f(void 0, void 0).ser(se_CreateReceiptRuleCommand).de(de_CreateReceiptRuleCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/CreateReceiptRuleSetCommand.js
var CreateReceiptRuleSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "CreateReceiptRuleSet", {}).n("SESClient", "CreateReceiptRuleSetCommand").f(void 0, void 0).ser(se_CreateReceiptRuleSetCommand).de(de_CreateReceiptRuleSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/CreateTemplateCommand.js
var CreateTemplateCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "CreateTemplate", {}).n("SESClient", "CreateTemplateCommand").f(void 0, void 0).ser(se_CreateTemplateCommand).de(de_CreateTemplateCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteConfigurationSetCommand.js
var DeleteConfigurationSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteConfigurationSet", {}).n("SESClient", "DeleteConfigurationSetCommand").f(void 0, void 0).ser(se_DeleteConfigurationSetCommand).de(de_DeleteConfigurationSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteConfigurationSetEventDestinationCommand.js
var DeleteConfigurationSetEventDestinationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteConfigurationSetEventDestination", {}).n("SESClient", "DeleteConfigurationSetEventDestinationCommand").f(void 0, void 0).ser(se_DeleteConfigurationSetEventDestinationCommand).de(de_DeleteConfigurationSetEventDestinationCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteConfigurationSetTrackingOptionsCommand.js
var DeleteConfigurationSetTrackingOptionsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteConfigurationSetTrackingOptions", {}).n("SESClient", "DeleteConfigurationSetTrackingOptionsCommand").f(void 0, void 0).ser(se_DeleteConfigurationSetTrackingOptionsCommand).de(de_DeleteConfigurationSetTrackingOptionsCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteCustomVerificationEmailTemplateCommand.js
var DeleteCustomVerificationEmailTemplateCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteCustomVerificationEmailTemplate", {}).n("SESClient", "DeleteCustomVerificationEmailTemplateCommand").f(void 0, void 0).ser(se_DeleteCustomVerificationEmailTemplateCommand).de(de_DeleteCustomVerificationEmailTemplateCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteIdentityCommand.js
var DeleteIdentityCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteIdentity", {}).n("SESClient", "DeleteIdentityCommand").f(void 0, void 0).ser(se_DeleteIdentityCommand).de(de_DeleteIdentityCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteIdentityPolicyCommand.js
var DeleteIdentityPolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteIdentityPolicy", {}).n("SESClient", "DeleteIdentityPolicyCommand").f(void 0, void 0).ser(se_DeleteIdentityPolicyCommand).de(de_DeleteIdentityPolicyCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteReceiptFilterCommand.js
var DeleteReceiptFilterCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteReceiptFilter", {}).n("SESClient", "DeleteReceiptFilterCommand").f(void 0, void 0).ser(se_DeleteReceiptFilterCommand).de(de_DeleteReceiptFilterCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteReceiptRuleCommand.js
var DeleteReceiptRuleCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteReceiptRule", {}).n("SESClient", "DeleteReceiptRuleCommand").f(void 0, void 0).ser(se_DeleteReceiptRuleCommand).de(de_DeleteReceiptRuleCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteReceiptRuleSetCommand.js
var DeleteReceiptRuleSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteReceiptRuleSet", {}).n("SESClient", "DeleteReceiptRuleSetCommand").f(void 0, void 0).ser(se_DeleteReceiptRuleSetCommand).de(de_DeleteReceiptRuleSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteTemplateCommand.js
var DeleteTemplateCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteTemplate", {}).n("SESClient", "DeleteTemplateCommand").f(void 0, void 0).ser(se_DeleteTemplateCommand).de(de_DeleteTemplateCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DeleteVerifiedEmailAddressCommand.js
var DeleteVerifiedEmailAddressCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DeleteVerifiedEmailAddress", {}).n("SESClient", "DeleteVerifiedEmailAddressCommand").f(void 0, void 0).ser(se_DeleteVerifiedEmailAddressCommand).de(de_DeleteVerifiedEmailAddressCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DescribeActiveReceiptRuleSetCommand.js
var DescribeActiveReceiptRuleSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DescribeActiveReceiptRuleSet", {}).n("SESClient", "DescribeActiveReceiptRuleSetCommand").f(void 0, void 0).ser(se_DescribeActiveReceiptRuleSetCommand).de(de_DescribeActiveReceiptRuleSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DescribeConfigurationSetCommand.js
var DescribeConfigurationSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DescribeConfigurationSet", {}).n("SESClient", "DescribeConfigurationSetCommand").f(void 0, void 0).ser(se_DescribeConfigurationSetCommand).de(de_DescribeConfigurationSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DescribeReceiptRuleCommand.js
var DescribeReceiptRuleCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DescribeReceiptRule", {}).n("SESClient", "DescribeReceiptRuleCommand").f(void 0, void 0).ser(se_DescribeReceiptRuleCommand).de(de_DescribeReceiptRuleCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/DescribeReceiptRuleSetCommand.js
var DescribeReceiptRuleSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "DescribeReceiptRuleSet", {}).n("SESClient", "DescribeReceiptRuleSetCommand").f(void 0, void 0).ser(se_DescribeReceiptRuleSetCommand).de(de_DescribeReceiptRuleSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetAccountSendingEnabledCommand.js
var GetAccountSendingEnabledCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetAccountSendingEnabled", {}).n("SESClient", "GetAccountSendingEnabledCommand").f(void 0, void 0).ser(se_GetAccountSendingEnabledCommand).de(de_GetAccountSendingEnabledCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetCustomVerificationEmailTemplateCommand.js
var GetCustomVerificationEmailTemplateCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetCustomVerificationEmailTemplate", {}).n("SESClient", "GetCustomVerificationEmailTemplateCommand").f(void 0, void 0).ser(se_GetCustomVerificationEmailTemplateCommand).de(de_GetCustomVerificationEmailTemplateCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetIdentityDkimAttributesCommand.js
var GetIdentityDkimAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetIdentityDkimAttributes", {}).n("SESClient", "GetIdentityDkimAttributesCommand").f(void 0, void 0).ser(se_GetIdentityDkimAttributesCommand).de(de_GetIdentityDkimAttributesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetIdentityMailFromDomainAttributesCommand.js
var GetIdentityMailFromDomainAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetIdentityMailFromDomainAttributes", {}).n("SESClient", "GetIdentityMailFromDomainAttributesCommand").f(void 0, void 0).ser(se_GetIdentityMailFromDomainAttributesCommand).de(de_GetIdentityMailFromDomainAttributesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetIdentityNotificationAttributesCommand.js
var GetIdentityNotificationAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetIdentityNotificationAttributes", {}).n("SESClient", "GetIdentityNotificationAttributesCommand").f(void 0, void 0).ser(se_GetIdentityNotificationAttributesCommand).de(de_GetIdentityNotificationAttributesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetIdentityPoliciesCommand.js
var GetIdentityPoliciesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetIdentityPolicies", {}).n("SESClient", "GetIdentityPoliciesCommand").f(void 0, void 0).ser(se_GetIdentityPoliciesCommand).de(de_GetIdentityPoliciesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetIdentityVerificationAttributesCommand.js
var GetIdentityVerificationAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetIdentityVerificationAttributes", {}).n("SESClient", "GetIdentityVerificationAttributesCommand").f(void 0, void 0).ser(se_GetIdentityVerificationAttributesCommand).de(de_GetIdentityVerificationAttributesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetSendQuotaCommand.js
var GetSendQuotaCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetSendQuota", {}).n("SESClient", "GetSendQuotaCommand").f(void 0, void 0).ser(se_GetSendQuotaCommand).de(de_GetSendQuotaCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetSendStatisticsCommand.js
var GetSendStatisticsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetSendStatistics", {}).n("SESClient", "GetSendStatisticsCommand").f(void 0, void 0).ser(se_GetSendStatisticsCommand).de(de_GetSendStatisticsCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/GetTemplateCommand.js
var GetTemplateCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "GetTemplate", {}).n("SESClient", "GetTemplateCommand").f(void 0, void 0).ser(se_GetTemplateCommand).de(de_GetTemplateCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/ListConfigurationSetsCommand.js
var ListConfigurationSetsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "ListConfigurationSets", {}).n("SESClient", "ListConfigurationSetsCommand").f(void 0, void 0).ser(se_ListConfigurationSetsCommand).de(de_ListConfigurationSetsCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/ListCustomVerificationEmailTemplatesCommand.js
var ListCustomVerificationEmailTemplatesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "ListCustomVerificationEmailTemplates", {}).n("SESClient", "ListCustomVerificationEmailTemplatesCommand").f(void 0, void 0).ser(se_ListCustomVerificationEmailTemplatesCommand).de(de_ListCustomVerificationEmailTemplatesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/ListIdentitiesCommand.js
var ListIdentitiesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "ListIdentities", {}).n("SESClient", "ListIdentitiesCommand").f(void 0, void 0).ser(se_ListIdentitiesCommand).de(de_ListIdentitiesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/ListIdentityPoliciesCommand.js
var ListIdentityPoliciesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "ListIdentityPolicies", {}).n("SESClient", "ListIdentityPoliciesCommand").f(void 0, void 0).ser(se_ListIdentityPoliciesCommand).de(de_ListIdentityPoliciesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/ListReceiptFiltersCommand.js
var ListReceiptFiltersCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "ListReceiptFilters", {}).n("SESClient", "ListReceiptFiltersCommand").f(void 0, void 0).ser(se_ListReceiptFiltersCommand).de(de_ListReceiptFiltersCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/ListReceiptRuleSetsCommand.js
var ListReceiptRuleSetsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "ListReceiptRuleSets", {}).n("SESClient", "ListReceiptRuleSetsCommand").f(void 0, void 0).ser(se_ListReceiptRuleSetsCommand).de(de_ListReceiptRuleSetsCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/ListTemplatesCommand.js
var ListTemplatesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "ListTemplates", {}).n("SESClient", "ListTemplatesCommand").f(void 0, void 0).ser(se_ListTemplatesCommand).de(de_ListTemplatesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/ListVerifiedEmailAddressesCommand.js
var ListVerifiedEmailAddressesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "ListVerifiedEmailAddresses", {}).n("SESClient", "ListVerifiedEmailAddressesCommand").f(void 0, void 0).ser(se_ListVerifiedEmailAddressesCommand).de(de_ListVerifiedEmailAddressesCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/PutConfigurationSetDeliveryOptionsCommand.js
var PutConfigurationSetDeliveryOptionsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "PutConfigurationSetDeliveryOptions", {}).n("SESClient", "PutConfigurationSetDeliveryOptionsCommand").f(void 0, void 0).ser(se_PutConfigurationSetDeliveryOptionsCommand).de(de_PutConfigurationSetDeliveryOptionsCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/PutIdentityPolicyCommand.js
var PutIdentityPolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "PutIdentityPolicy", {}).n("SESClient", "PutIdentityPolicyCommand").f(void 0, void 0).ser(se_PutIdentityPolicyCommand).de(de_PutIdentityPolicyCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/ReorderReceiptRuleSetCommand.js
var ReorderReceiptRuleSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "ReorderReceiptRuleSet", {}).n("SESClient", "ReorderReceiptRuleSetCommand").f(void 0, void 0).ser(se_ReorderReceiptRuleSetCommand).de(de_ReorderReceiptRuleSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SendBounceCommand.js
var SendBounceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SendBounce", {}).n("SESClient", "SendBounceCommand").f(void 0, void 0).ser(se_SendBounceCommand).de(de_SendBounceCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SendBulkTemplatedEmailCommand.js
var SendBulkTemplatedEmailCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SendBulkTemplatedEmail", {}).n("SESClient", "SendBulkTemplatedEmailCommand").f(void 0, void 0).ser(se_SendBulkTemplatedEmailCommand).de(de_SendBulkTemplatedEmailCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SendCustomVerificationEmailCommand.js
var SendCustomVerificationEmailCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SendCustomVerificationEmail", {}).n("SESClient", "SendCustomVerificationEmailCommand").f(void 0, void 0).ser(se_SendCustomVerificationEmailCommand).de(de_SendCustomVerificationEmailCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SendEmailCommand.js
var SendEmailCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SendEmail", {}).n("SESClient", "SendEmailCommand").f(void 0, void 0).ser(se_SendEmailCommand).de(de_SendEmailCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SendRawEmailCommand.js
var SendRawEmailCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SendRawEmail", {}).n("SESClient", "SendRawEmailCommand").f(void 0, void 0).ser(se_SendRawEmailCommand).de(de_SendRawEmailCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SendTemplatedEmailCommand.js
var SendTemplatedEmailCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SendTemplatedEmail", {}).n("SESClient", "SendTemplatedEmailCommand").f(void 0, void 0).ser(se_SendTemplatedEmailCommand).de(de_SendTemplatedEmailCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SetActiveReceiptRuleSetCommand.js
var SetActiveReceiptRuleSetCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SetActiveReceiptRuleSet", {}).n("SESClient", "SetActiveReceiptRuleSetCommand").f(void 0, void 0).ser(se_SetActiveReceiptRuleSetCommand).de(de_SetActiveReceiptRuleSetCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SetIdentityDkimEnabledCommand.js
var SetIdentityDkimEnabledCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SetIdentityDkimEnabled", {}).n("SESClient", "SetIdentityDkimEnabledCommand").f(void 0, void 0).ser(se_SetIdentityDkimEnabledCommand).de(de_SetIdentityDkimEnabledCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SetIdentityFeedbackForwardingEnabledCommand.js
var SetIdentityFeedbackForwardingEnabledCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SetIdentityFeedbackForwardingEnabled", {}).n("SESClient", "SetIdentityFeedbackForwardingEnabledCommand").f(void 0, void 0).ser(se_SetIdentityFeedbackForwardingEnabledCommand).de(de_SetIdentityFeedbackForwardingEnabledCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SetIdentityHeadersInNotificationsEnabledCommand.js
var SetIdentityHeadersInNotificationsEnabledCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SetIdentityHeadersInNotificationsEnabled", {}).n("SESClient", "SetIdentityHeadersInNotificationsEnabledCommand").f(void 0, void 0).ser(se_SetIdentityHeadersInNotificationsEnabledCommand).de(de_SetIdentityHeadersInNotificationsEnabledCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SetIdentityMailFromDomainCommand.js
var SetIdentityMailFromDomainCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SetIdentityMailFromDomain", {}).n("SESClient", "SetIdentityMailFromDomainCommand").f(void 0, void 0).ser(se_SetIdentityMailFromDomainCommand).de(de_SetIdentityMailFromDomainCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SetIdentityNotificationTopicCommand.js
var SetIdentityNotificationTopicCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SetIdentityNotificationTopic", {}).n("SESClient", "SetIdentityNotificationTopicCommand").f(void 0, void 0).ser(se_SetIdentityNotificationTopicCommand).de(de_SetIdentityNotificationTopicCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/SetReceiptRulePositionCommand.js
var SetReceiptRulePositionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "SetReceiptRulePosition", {}).n("SESClient", "SetReceiptRulePositionCommand").f(void 0, void 0).ser(se_SetReceiptRulePositionCommand).de(de_SetReceiptRulePositionCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/TestRenderTemplateCommand.js
var TestRenderTemplateCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "TestRenderTemplate", {}).n("SESClient", "TestRenderTemplateCommand").f(void 0, void 0).ser(se_TestRenderTemplateCommand).de(de_TestRenderTemplateCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/UpdateAccountSendingEnabledCommand.js
var UpdateAccountSendingEnabledCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "UpdateAccountSendingEnabled", {}).n("SESClient", "UpdateAccountSendingEnabledCommand").f(void 0, void 0).ser(se_UpdateAccountSendingEnabledCommand).de(de_UpdateAccountSendingEnabledCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/UpdateConfigurationSetEventDestinationCommand.js
var UpdateConfigurationSetEventDestinationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "UpdateConfigurationSetEventDestination", {}).n("SESClient", "UpdateConfigurationSetEventDestinationCommand").f(void 0, void 0).ser(se_UpdateConfigurationSetEventDestinationCommand).de(de_UpdateConfigurationSetEventDestinationCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/UpdateConfigurationSetReputationMetricsEnabledCommand.js
var UpdateConfigurationSetReputationMetricsEnabledCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "UpdateConfigurationSetReputationMetricsEnabled", {}).n("SESClient", "UpdateConfigurationSetReputationMetricsEnabledCommand").f(void 0, void 0).ser(se_UpdateConfigurationSetReputationMetricsEnabledCommand).de(de_UpdateConfigurationSetReputationMetricsEnabledCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/UpdateConfigurationSetSendingEnabledCommand.js
var UpdateConfigurationSetSendingEnabledCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "UpdateConfigurationSetSendingEnabled", {}).n("SESClient", "UpdateConfigurationSetSendingEnabledCommand").f(void 0, void 0).ser(se_UpdateConfigurationSetSendingEnabledCommand).de(de_UpdateConfigurationSetSendingEnabledCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/UpdateConfigurationSetTrackingOptionsCommand.js
var UpdateConfigurationSetTrackingOptionsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "UpdateConfigurationSetTrackingOptions", {}).n("SESClient", "UpdateConfigurationSetTrackingOptionsCommand").f(void 0, void 0).ser(se_UpdateConfigurationSetTrackingOptionsCommand).de(de_UpdateConfigurationSetTrackingOptionsCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/UpdateCustomVerificationEmailTemplateCommand.js
var UpdateCustomVerificationEmailTemplateCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "UpdateCustomVerificationEmailTemplate", {}).n("SESClient", "UpdateCustomVerificationEmailTemplateCommand").f(void 0, void 0).ser(se_UpdateCustomVerificationEmailTemplateCommand).de(de_UpdateCustomVerificationEmailTemplateCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/UpdateReceiptRuleCommand.js
var UpdateReceiptRuleCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "UpdateReceiptRule", {}).n("SESClient", "UpdateReceiptRuleCommand").f(void 0, void 0).ser(se_UpdateReceiptRuleCommand).de(de_UpdateReceiptRuleCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/UpdateTemplateCommand.js
var UpdateTemplateCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "UpdateTemplate", {}).n("SESClient", "UpdateTemplateCommand").f(void 0, void 0).ser(se_UpdateTemplateCommand).de(de_UpdateTemplateCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/VerifyDomainDkimCommand.js
var VerifyDomainDkimCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "VerifyDomainDkim", {}).n("SESClient", "VerifyDomainDkimCommand").f(void 0, void 0).ser(se_VerifyDomainDkimCommand).de(de_VerifyDomainDkimCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/VerifyDomainIdentityCommand.js
var VerifyDomainIdentityCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "VerifyDomainIdentity", {}).n("SESClient", "VerifyDomainIdentityCommand").f(void 0, void 0).ser(se_VerifyDomainIdentityCommand).de(de_VerifyDomainIdentityCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/VerifyEmailAddressCommand.js
var VerifyEmailAddressCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "VerifyEmailAddress", {}).n("SESClient", "VerifyEmailAddressCommand").f(void 0, void 0).ser(se_VerifyEmailAddressCommand).de(de_VerifyEmailAddressCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/commands/VerifyEmailIdentityCommand.js
var VerifyEmailIdentityCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("SimpleEmailService", "VerifyEmailIdentity", {}).n("SESClient", "VerifyEmailIdentityCommand").f(void 0, void 0).ser(se_VerifyEmailIdentityCommand).de(de_VerifyEmailIdentityCommand).build() {
};

// node_modules/@aws-sdk/client-ses/dist-es/SES.js
var commands = {
  CloneReceiptRuleSetCommand,
  CreateConfigurationSetCommand,
  CreateConfigurationSetEventDestinationCommand,
  CreateConfigurationSetTrackingOptionsCommand,
  CreateCustomVerificationEmailTemplateCommand,
  CreateReceiptFilterCommand,
  CreateReceiptRuleCommand,
  CreateReceiptRuleSetCommand,
  CreateTemplateCommand,
  DeleteConfigurationSetCommand,
  DeleteConfigurationSetEventDestinationCommand,
  DeleteConfigurationSetTrackingOptionsCommand,
  DeleteCustomVerificationEmailTemplateCommand,
  DeleteIdentityCommand,
  DeleteIdentityPolicyCommand,
  DeleteReceiptFilterCommand,
  DeleteReceiptRuleCommand,
  DeleteReceiptRuleSetCommand,
  DeleteTemplateCommand,
  DeleteVerifiedEmailAddressCommand,
  DescribeActiveReceiptRuleSetCommand,
  DescribeConfigurationSetCommand,
  DescribeReceiptRuleCommand,
  DescribeReceiptRuleSetCommand,
  GetAccountSendingEnabledCommand,
  GetCustomVerificationEmailTemplateCommand,
  GetIdentityDkimAttributesCommand,
  GetIdentityMailFromDomainAttributesCommand,
  GetIdentityNotificationAttributesCommand,
  GetIdentityPoliciesCommand,
  GetIdentityVerificationAttributesCommand,
  GetSendQuotaCommand,
  GetSendStatisticsCommand,
  GetTemplateCommand,
  ListConfigurationSetsCommand,
  ListCustomVerificationEmailTemplatesCommand,
  ListIdentitiesCommand,
  ListIdentityPoliciesCommand,
  ListReceiptFiltersCommand,
  ListReceiptRuleSetsCommand,
  ListTemplatesCommand,
  ListVerifiedEmailAddressesCommand,
  PutConfigurationSetDeliveryOptionsCommand,
  PutIdentityPolicyCommand,
  ReorderReceiptRuleSetCommand,
  SendBounceCommand,
  SendBulkTemplatedEmailCommand,
  SendCustomVerificationEmailCommand,
  SendEmailCommand,
  SendRawEmailCommand,
  SendTemplatedEmailCommand,
  SetActiveReceiptRuleSetCommand,
  SetIdentityDkimEnabledCommand,
  SetIdentityFeedbackForwardingEnabledCommand,
  SetIdentityHeadersInNotificationsEnabledCommand,
  SetIdentityMailFromDomainCommand,
  SetIdentityNotificationTopicCommand,
  SetReceiptRulePositionCommand,
  TestRenderTemplateCommand,
  UpdateAccountSendingEnabledCommand,
  UpdateConfigurationSetEventDestinationCommand,
  UpdateConfigurationSetReputationMetricsEnabledCommand,
  UpdateConfigurationSetSendingEnabledCommand,
  UpdateConfigurationSetTrackingOptionsCommand,
  UpdateCustomVerificationEmailTemplateCommand,
  UpdateReceiptRuleCommand,
  UpdateTemplateCommand,
  VerifyDomainDkimCommand,
  VerifyDomainIdentityCommand,
  VerifyEmailAddressCommand,
  VerifyEmailIdentityCommand
};
var SES = class extends SESClient {
};
createAggregatedClient(commands, SES);

// node_modules/@aws-sdk/client-ses/dist-es/pagination/ListCustomVerificationEmailTemplatesPaginator.js
var paginateListCustomVerificationEmailTemplates = createPaginator(SESClient, ListCustomVerificationEmailTemplatesCommand, "NextToken", "NextToken", "MaxResults");

// node_modules/@aws-sdk/client-ses/dist-es/pagination/ListIdentitiesPaginator.js
var paginateListIdentities = createPaginator(SESClient, ListIdentitiesCommand, "NextToken", "NextToken", "MaxItems");

// node_modules/@aws-sdk/client-ses/dist-es/waiters/waitForIdentityExists.js
var checkState = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetIdentityVerificationAttributesCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        const objectProjection_2 = Object.values(result.VerificationAttributes).map((element_1) => {
          return element_1.VerificationStatus;
        });
        return objectProjection_2;
      };
      let allStringEq_4 = returnComparator().length > 0;
      for (const element_3 of returnComparator()) {
        allStringEq_4 = allStringEq_4 && element_3 == "Success";
      }
      if (allStringEq_4) {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForIdentityExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 3, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState);
});
var waitUntilIdentityExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 3, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState);
  return checkExceptions(result);
});
export {
  Command as $Command,
  AccountSendingPausedException,
  AlreadyExistsException,
  BehaviorOnMXFailure,
  BounceType,
  BulkEmailStatus,
  CannotDeleteException,
  CloneReceiptRuleSetCommand,
  ConfigurationSetAlreadyExistsException,
  ConfigurationSetAttribute,
  ConfigurationSetDoesNotExistException,
  ConfigurationSetSendingPausedException,
  CreateConfigurationSetCommand,
  CreateConfigurationSetEventDestinationCommand,
  CreateConfigurationSetTrackingOptionsCommand,
  CreateCustomVerificationEmailTemplateCommand,
  CreateReceiptFilterCommand,
  CreateReceiptRuleCommand,
  CreateReceiptRuleSetCommand,
  CreateTemplateCommand,
  CustomMailFromStatus,
  CustomVerificationEmailInvalidContentException,
  CustomVerificationEmailTemplateAlreadyExistsException,
  CustomVerificationEmailTemplateDoesNotExistException,
  DeleteConfigurationSetCommand,
  DeleteConfigurationSetEventDestinationCommand,
  DeleteConfigurationSetTrackingOptionsCommand,
  DeleteCustomVerificationEmailTemplateCommand,
  DeleteIdentityCommand,
  DeleteIdentityPolicyCommand,
  DeleteReceiptFilterCommand,
  DeleteReceiptRuleCommand,
  DeleteReceiptRuleSetCommand,
  DeleteTemplateCommand,
  DeleteVerifiedEmailAddressCommand,
  DescribeActiveReceiptRuleSetCommand,
  DescribeConfigurationSetCommand,
  DescribeReceiptRuleCommand,
  DescribeReceiptRuleSetCommand,
  DimensionValueSource,
  DsnAction,
  EventDestinationAlreadyExistsException,
  EventDestinationDoesNotExistException,
  EventType,
  FromEmailAddressNotVerifiedException,
  GetAccountSendingEnabledCommand,
  GetCustomVerificationEmailTemplateCommand,
  GetIdentityDkimAttributesCommand,
  GetIdentityMailFromDomainAttributesCommand,
  GetIdentityNotificationAttributesCommand,
  GetIdentityPoliciesCommand,
  GetIdentityVerificationAttributesCommand,
  GetSendQuotaCommand,
  GetSendStatisticsCommand,
  GetTemplateCommand,
  IdentityType,
  InvalidCloudWatchDestinationException,
  InvalidConfigurationSetException,
  InvalidDeliveryOptionsException,
  InvalidFirehoseDestinationException,
  InvalidLambdaFunctionException,
  InvalidPolicyException,
  InvalidRenderingParameterException,
  InvalidS3ConfigurationException,
  InvalidSNSDestinationException,
  InvalidSnsTopicException,
  InvalidTemplateException,
  InvalidTrackingOptionsException,
  InvocationType,
  LimitExceededException,
  ListConfigurationSetsCommand,
  ListCustomVerificationEmailTemplatesCommand,
  ListIdentitiesCommand,
  ListIdentityPoliciesCommand,
  ListReceiptFiltersCommand,
  ListReceiptRuleSetsCommand,
  ListTemplatesCommand,
  ListVerifiedEmailAddressesCommand,
  MailFromDomainNotVerifiedException,
  MessageRejected,
  MissingRenderingAttributeException,
  NotificationType,
  ProductionAccessNotGrantedException,
  PutConfigurationSetDeliveryOptionsCommand,
  PutIdentityPolicyCommand,
  ReceiptFilterPolicy,
  ReorderReceiptRuleSetCommand,
  RuleDoesNotExistException,
  RuleSetDoesNotExistException,
  SES,
  SESClient,
  SESServiceException,
  SNSActionEncoding,
  SendBounceCommand,
  SendBulkTemplatedEmailCommand,
  SendCustomVerificationEmailCommand,
  SendEmailCommand,
  SendRawEmailCommand,
  SendTemplatedEmailCommand,
  SetActiveReceiptRuleSetCommand,
  SetIdentityDkimEnabledCommand,
  SetIdentityFeedbackForwardingEnabledCommand,
  SetIdentityHeadersInNotificationsEnabledCommand,
  SetIdentityMailFromDomainCommand,
  SetIdentityNotificationTopicCommand,
  SetReceiptRulePositionCommand,
  StopScope,
  TemplateDoesNotExistException,
  TestRenderTemplateCommand,
  TlsPolicy,
  TrackingOptionsAlreadyExistsException,
  TrackingOptionsDoesNotExistException,
  UpdateAccountSendingEnabledCommand,
  UpdateConfigurationSetEventDestinationCommand,
  UpdateConfigurationSetReputationMetricsEnabledCommand,
  UpdateConfigurationSetSendingEnabledCommand,
  UpdateConfigurationSetTrackingOptionsCommand,
  UpdateCustomVerificationEmailTemplateCommand,
  UpdateReceiptRuleCommand,
  UpdateTemplateCommand,
  VerificationStatus,
  VerifyDomainDkimCommand,
  VerifyDomainIdentityCommand,
  VerifyEmailAddressCommand,
  VerifyEmailIdentityCommand,
  Client as __Client,
  paginateListCustomVerificationEmailTemplates,
  paginateListIdentities,
  waitForIdentityExists,
  waitUntilIdentityExists
};
//# sourceMappingURL=@aws-sdk_client-ses.js.map
