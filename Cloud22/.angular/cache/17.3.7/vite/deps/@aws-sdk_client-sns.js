import {
  awsEndpointFunctions,
  getUserAgentPlugin,
  resolveUserAgentConfig
} from "./chunk-R62TKQBP.js";
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
  SENSITIVE_STRING,
  ServiceException,
  Sha256,
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
  streamCollector,
  toBase64,
  toUtf8,
  withBaseException
} from "./chunk-6GN2Y7VZ.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-CDW57LCT.js";

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/auth/httpAuthSchemeProvider.js
var defaultSNSHttpAuthSchemeParametersProvider = (config, context, input) => __async(void 0, null, function* () {
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
      name: "sns",
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
var defaultSNSHttpAuthSchemeProvider = (authParameters) => {
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

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters = (options) => {
  return __spreadProps(__spreadValues({}, options), {
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "sns"
  });
};
var commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};

// ../../../../node_modules/@aws-sdk/client-sns/package.json
var package_default = {
  name: "@aws-sdk/client-sns",
  description: "AWS SDK for JavaScript Sns Client for Node.js, Browser and React Native",
  version: "3.637.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "node ../../scripts/compilation/inline client-sns",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo sns"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "5.2.0",
    "@aws-crypto/sha256-js": "5.2.0",
    "@aws-sdk/client-sso-oidc": "3.637.0",
    "@aws-sdk/client-sts": "3.637.0",
    "@aws-sdk/core": "3.635.0",
    "@aws-sdk/credential-provider-node": "3.637.0",
    "@aws-sdk/middleware-host-header": "3.620.0",
    "@aws-sdk/middleware-logger": "3.609.0",
    "@aws-sdk/middleware-recursion-detection": "3.620.0",
    "@aws-sdk/middleware-user-agent": "3.637.0",
    "@aws-sdk/region-config-resolver": "3.614.0",
    "@aws-sdk/types": "3.609.0",
    "@aws-sdk/util-endpoints": "3.637.0",
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
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sns",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sns"
  }
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/endpoint/ruleset.js
var u = "required";
var v = "fn";
var w = "argv";
var x = "ref";
var a = true;
var b = "isSet";
var c = "booleanEquals";
var d = "error";
var e = "endpoint";
var f = "tree";
var g = "PartitionResult";
var h = "stringEquals";
var i = { [u]: false, "type": "String" };
var j = { [u]: true, "default": false, "type": "Boolean" };
var k = { [x]: "Endpoint" };
var l = { [v]: c, [w]: [{ [x]: "UseFIPS" }, true] };
var m = { [v]: c, [w]: [{ [x]: "UseDualStack" }, true] };
var n = {};
var o = { [x]: "Region" };
var p = { [v]: "getAttr", [w]: [{ [x]: g }, "supportsFIPS"] };
var q = { [v]: c, [w]: [true, { [v]: "getAttr", [w]: [{ [x]: g }, "supportsDualStack"] }] };
var r = [l];
var s = [m];
var t = [o];
var _data = { version: "1.0", parameters: { Region: i, UseDualStack: j, UseFIPS: j, Endpoint: i }, rules: [{ conditions: [{ [v]: b, [w]: [k] }], rules: [{ conditions: r, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: s, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: k, properties: n, headers: n }, type: e }], type: f }, { conditions: [{ [v]: b, [w]: t }], rules: [{ conditions: [{ [v]: "aws.partition", [w]: t, assign: g }], rules: [{ conditions: [l, m], rules: [{ conditions: [{ [v]: c, [w]: [a, p] }, q], rules: [{ endpoint: { url: "https://sns-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f }, { conditions: r, rules: [{ conditions: [{ [v]: c, [w]: [p, a] }], rules: [{ conditions: [{ [v]: h, [w]: [o, "us-gov-east-1"] }], endpoint: { url: "https://sns.us-gov-east-1.amazonaws.com", properties: n, headers: n }, type: e }, { conditions: [{ [v]: h, [w]: [o, "us-gov-west-1"] }], endpoint: { url: "https://sns.us-gov-west-1.amazonaws.com", properties: n, headers: n }, type: e }, { endpoint: { url: "https://sns-fips.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f }, { conditions: s, rules: [{ conditions: [q], rules: [{ endpoint: { url: "https://sns.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f }, { endpoint: { url: "https://sns.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }], type: f }, { error: "Invalid Configuration: Missing Region", type: d }] };
var ruleSet = _data;

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  });
};
customEndpointFunctions.aws = awsEndpointFunctions;

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/runtimeConfig.shared.js
var getRuntimeConfig = (config) => {
  return {
    apiVersion: "2010-03-31",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSNSHttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new AwsSdkSigV4Signer()
      }
    ],
    logger: config?.logger ?? new NoOpLogger(),
    serviceId: config?.serviceId ?? "SNS",
    urlParser: config?.urlParser ?? parseUrl,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/runtimeConfig.browser.js
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

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/auth/httpAuthExtensionConfiguration.js
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

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/runtimeExtensions.js
var asPartial = (t2) => t2;
var resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, asPartial(getAwsRegionExtensionConfiguration(runtimeConfig))), asPartial(getDefaultExtensionConfiguration(runtimeConfig))), asPartial(getHttpHandlerExtensionConfiguration(runtimeConfig))), asPartial(getHttpAuthExtensionConfiguration(runtimeConfig)));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, runtimeConfig), resolveAwsRegionExtensionConfiguration(extensionConfiguration)), resolveDefaultRuntimeConfig(extensionConfiguration)), resolveHttpHandlerRuntimeConfig(extensionConfiguration)), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/SNSClient.js
var SNSClient = class extends Client {
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
      httpAuthSchemeParametersProvider: defaultSNSHttpAuthSchemeParametersProvider,
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

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/models/SNSServiceException.js
var SNSServiceException = class _SNSServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _SNSServiceException.prototype);
  }
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/models/models_0.js
var AuthorizationErrorException = class _AuthorizationErrorException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "AuthorizationErrorException",
      $fault: "client"
    }, opts));
    this.name = "AuthorizationErrorException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _AuthorizationErrorException.prototype);
  }
};
var InternalErrorException = class _InternalErrorException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InternalErrorException",
      $fault: "server"
    }, opts));
    this.name = "InternalErrorException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InternalErrorException.prototype);
  }
};
var InvalidParameterException = class _InvalidParameterException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidParameterException",
      $fault: "client"
    }, opts));
    this.name = "InvalidParameterException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidParameterException.prototype);
  }
};
var NotFoundException = class _NotFoundException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "NotFoundException",
      $fault: "client"
    }, opts));
    this.name = "NotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _NotFoundException.prototype);
  }
};
var ThrottledException = class _ThrottledException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ThrottledException",
      $fault: "client"
    }, opts));
    this.name = "ThrottledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ThrottledException.prototype);
  }
};
var FilterPolicyLimitExceededException = class _FilterPolicyLimitExceededException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "FilterPolicyLimitExceededException",
      $fault: "client"
    }, opts));
    this.name = "FilterPolicyLimitExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _FilterPolicyLimitExceededException.prototype);
  }
};
var ReplayLimitExceededException = class _ReplayLimitExceededException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ReplayLimitExceededException",
      $fault: "client"
    }, opts));
    this.name = "ReplayLimitExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ReplayLimitExceededException.prototype);
  }
};
var SubscriptionLimitExceededException = class _SubscriptionLimitExceededException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SubscriptionLimitExceededException",
      $fault: "client"
    }, opts));
    this.name = "SubscriptionLimitExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SubscriptionLimitExceededException.prototype);
  }
};
var LanguageCodeString = {
  de_DE: "de-DE",
  en_GB: "en-GB",
  en_US: "en-US",
  es_419: "es-419",
  es_ES: "es-ES",
  fr_CA: "fr-CA",
  fr_FR: "fr-FR",
  it_IT: "it-IT",
  jp_JP: "ja-JP",
  kr_KR: "kr-KR",
  pt_BR: "pt-BR",
  zh_CN: "zh-CN",
  zh_TW: "zh-TW"
};
var OptedOutException = class _OptedOutException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "OptedOutException",
      $fault: "client"
    }, opts));
    this.name = "OptedOutException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _OptedOutException.prototype);
  }
};
var UserErrorException = class _UserErrorException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UserErrorException",
      $fault: "client"
    }, opts));
    this.name = "UserErrorException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UserErrorException.prototype);
  }
};
var ConcurrentAccessException = class _ConcurrentAccessException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ConcurrentAccessException",
      $fault: "client"
    }, opts));
    this.name = "ConcurrentAccessException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ConcurrentAccessException.prototype);
  }
};
var InvalidSecurityException = class _InvalidSecurityException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidSecurityException",
      $fault: "client"
    }, opts));
    this.name = "InvalidSecurityException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidSecurityException.prototype);
  }
};
var StaleTagException = class _StaleTagException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "StaleTagException",
      $fault: "client"
    }, opts));
    this.name = "StaleTagException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _StaleTagException.prototype);
  }
};
var TagLimitExceededException = class _TagLimitExceededException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TagLimitExceededException",
      $fault: "client"
    }, opts));
    this.name = "TagLimitExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TagLimitExceededException.prototype);
  }
};
var TagPolicyException = class _TagPolicyException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TagPolicyException",
      $fault: "client"
    }, opts));
    this.name = "TagPolicyException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TagPolicyException.prototype);
  }
};
var TopicLimitExceededException = class _TopicLimitExceededException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TopicLimitExceededException",
      $fault: "client"
    }, opts));
    this.name = "TopicLimitExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TopicLimitExceededException.prototype);
  }
};
var ResourceNotFoundException = class _ResourceNotFoundException extends SNSServiceException {
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
var InvalidStateException = class _InvalidStateException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidStateException",
      $fault: "client"
    }, opts));
    this.name = "InvalidStateException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidStateException.prototype);
  }
};
var NumberCapability = {
  MMS: "MMS",
  SMS: "SMS",
  VOICE: "VOICE"
};
var RouteType = {
  Premium: "Premium",
  Promotional: "Promotional",
  Transactional: "Transactional"
};
var ValidationException = class _ValidationException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ValidationException",
      $fault: "client"
    }, opts));
    this.name = "ValidationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ValidationException.prototype);
    this.Message = opts.Message;
  }
};
var SMSSandboxPhoneNumberVerificationStatus = {
  Pending: "Pending",
  Verified: "Verified"
};
var EndpointDisabledException = class _EndpointDisabledException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EndpointDisabledException",
      $fault: "client"
    }, opts));
    this.name = "EndpointDisabledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EndpointDisabledException.prototype);
  }
};
var InvalidParameterValueException = class _InvalidParameterValueException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidParameterValueException",
      $fault: "client"
    }, opts));
    this.name = "InvalidParameterValueException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidParameterValueException.prototype);
  }
};
var KMSAccessDeniedException = class _KMSAccessDeniedException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSAccessDeniedException",
      $fault: "client"
    }, opts));
    this.name = "KMSAccessDeniedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSAccessDeniedException.prototype);
  }
};
var KMSDisabledException = class _KMSDisabledException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSDisabledException",
      $fault: "client"
    }, opts));
    this.name = "KMSDisabledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSDisabledException.prototype);
  }
};
var KMSInvalidStateException = class _KMSInvalidStateException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSInvalidStateException",
      $fault: "client"
    }, opts));
    this.name = "KMSInvalidStateException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSInvalidStateException.prototype);
  }
};
var KMSNotFoundException = class _KMSNotFoundException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "KMSNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSNotFoundException.prototype);
  }
};
var KMSOptInRequired = class _KMSOptInRequired extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSOptInRequired",
      $fault: "client"
    }, opts));
    this.name = "KMSOptInRequired";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSOptInRequired.prototype);
  }
};
var KMSThrottlingException = class _KMSThrottlingException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSThrottlingException",
      $fault: "client"
    }, opts));
    this.name = "KMSThrottlingException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSThrottlingException.prototype);
  }
};
var PlatformApplicationDisabledException = class _PlatformApplicationDisabledException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PlatformApplicationDisabledException",
      $fault: "client"
    }, opts));
    this.name = "PlatformApplicationDisabledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PlatformApplicationDisabledException.prototype);
  }
};
var BatchEntryIdsNotDistinctException = class _BatchEntryIdsNotDistinctException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "BatchEntryIdsNotDistinctException",
      $fault: "client"
    }, opts));
    this.name = "BatchEntryIdsNotDistinctException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _BatchEntryIdsNotDistinctException.prototype);
  }
};
var BatchRequestTooLongException = class _BatchRequestTooLongException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "BatchRequestTooLongException",
      $fault: "client"
    }, opts));
    this.name = "BatchRequestTooLongException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _BatchRequestTooLongException.prototype);
  }
};
var EmptyBatchRequestException = class _EmptyBatchRequestException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EmptyBatchRequestException",
      $fault: "client"
    }, opts));
    this.name = "EmptyBatchRequestException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EmptyBatchRequestException.prototype);
  }
};
var InvalidBatchEntryIdException = class _InvalidBatchEntryIdException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidBatchEntryIdException",
      $fault: "client"
    }, opts));
    this.name = "InvalidBatchEntryIdException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidBatchEntryIdException.prototype);
  }
};
var TooManyEntriesInBatchRequestException = class _TooManyEntriesInBatchRequestException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TooManyEntriesInBatchRequestException",
      $fault: "client"
    }, opts));
    this.name = "TooManyEntriesInBatchRequestException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TooManyEntriesInBatchRequestException.prototype);
  }
};
var VerificationException = class _VerificationException extends SNSServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "VerificationException",
      $fault: "client"
    }, opts));
    this.name = "VerificationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _VerificationException.prototype);
    this.Message = opts.Message;
    this.Status = opts.Status;
  }
};
var CheckIfPhoneNumberIsOptedOutInputFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.phoneNumber && { phoneNumber: SENSITIVE_STRING });
var CreateSMSSandboxPhoneNumberInputFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.PhoneNumber && { PhoneNumber: SENSITIVE_STRING });
var DeleteSMSSandboxPhoneNumberInputFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.PhoneNumber && { PhoneNumber: SENSITIVE_STRING });
var PhoneNumberInformationFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.PhoneNumber && { PhoneNumber: SENSITIVE_STRING });
var ListOriginationNumbersResultFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.PhoneNumbers && {
  PhoneNumbers: obj.PhoneNumbers.map((item) => PhoneNumberInformationFilterSensitiveLog(item))
});
var ListPhoneNumbersOptedOutResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.phoneNumbers && { phoneNumbers: SENSITIVE_STRING });
var SMSSandboxPhoneNumberFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.PhoneNumber && { PhoneNumber: SENSITIVE_STRING });
var ListSMSSandboxPhoneNumbersResultFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.PhoneNumbers && {
  PhoneNumbers: obj.PhoneNumbers.map((item) => SMSSandboxPhoneNumberFilterSensitiveLog(item))
});
var OptInPhoneNumberInputFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.phoneNumber && { phoneNumber: SENSITIVE_STRING });
var PublishInputFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.PhoneNumber && { PhoneNumber: SENSITIVE_STRING });
var VerifySMSSandboxPhoneNumberInputFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.PhoneNumber && { PhoneNumber: SENSITIVE_STRING });

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/protocols/Aws_query.js
var se_AddPermissionCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_AddPermissionInput(input, context)), {
    [_A]: _AP,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CheckIfPhoneNumberIsOptedOutCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CheckIfPhoneNumberIsOptedOutInput(input, context)), {
    [_A]: _CIPNIOO,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ConfirmSubscriptionCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ConfirmSubscriptionInput(input, context)), {
    [_A]: _CS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreatePlatformApplicationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreatePlatformApplicationInput(input, context)), {
    [_A]: _CPA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreatePlatformEndpointCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreatePlatformEndpointInput(input, context)), {
    [_A]: _CPE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateSMSSandboxPhoneNumberCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateSMSSandboxPhoneNumberInput(input, context)), {
    [_A]: _CSMSSPN,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateTopicCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_CreateTopicInput(input, context)), {
    [_A]: _CT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteEndpointCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteEndpointInput(input, context)), {
    [_A]: _DE,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeletePlatformApplicationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeletePlatformApplicationInput(input, context)), {
    [_A]: _DPA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteSMSSandboxPhoneNumberCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteSMSSandboxPhoneNumberInput(input, context)), {
    [_A]: _DSMSSPN,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteTopicCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_DeleteTopicInput(input, context)), {
    [_A]: _DT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetDataProtectionPolicyCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetDataProtectionPolicyInput(input, context)), {
    [_A]: _GDPP,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetEndpointAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetEndpointAttributesInput(input, context)), {
    [_A]: _GEA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetPlatformApplicationAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetPlatformApplicationAttributesInput(input, context)), {
    [_A]: _GPAA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetSMSAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetSMSAttributesInput(input, context)), {
    [_A]: _GSMSA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetSMSSandboxAccountStatusCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetSMSSandboxAccountStatusInput(input, context)), {
    [_A]: _GSMSSAS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetSubscriptionAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetSubscriptionAttributesInput(input, context)), {
    [_A]: _GSA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetTopicAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_GetTopicAttributesInput(input, context)), {
    [_A]: _GTA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListEndpointsByPlatformApplicationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListEndpointsByPlatformApplicationInput(input, context)), {
    [_A]: _LEBPA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListOriginationNumbersCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListOriginationNumbersRequest(input, context)), {
    [_A]: _LON,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListPhoneNumbersOptedOutCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListPhoneNumbersOptedOutInput(input, context)), {
    [_A]: _LPNOO,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListPlatformApplicationsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListPlatformApplicationsInput(input, context)), {
    [_A]: _LPA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListSMSSandboxPhoneNumbersCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListSMSSandboxPhoneNumbersInput(input, context)), {
    [_A]: _LSMSSPN,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListSubscriptionsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListSubscriptionsInput(input, context)), {
    [_A]: _LS,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListSubscriptionsByTopicCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListSubscriptionsByTopicInput(input, context)), {
    [_A]: _LSBT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListTagsForResourceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListTagsForResourceRequest(input, context)), {
    [_A]: _LTFR,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListTopicsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_ListTopicsInput(input, context)), {
    [_A]: _LT,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_OptInPhoneNumberCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_OptInPhoneNumberInput(input, context)), {
    [_A]: _OIPN,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_PublishCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_PublishInput(input, context)), {
    [_A]: _P,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_PublishBatchCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_PublishBatchInput(input, context)), {
    [_A]: _PB,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_PutDataProtectionPolicyCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_PutDataProtectionPolicyInput(input, context)), {
    [_A]: _PDPP,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_RemovePermissionCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_RemovePermissionInput(input, context)), {
    [_A]: _RP,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetEndpointAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetEndpointAttributesInput(input, context)), {
    [_A]: _SEA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetPlatformApplicationAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetPlatformApplicationAttributesInput(input, context)), {
    [_A]: _SPAA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetSMSAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetSMSAttributesInput(input, context)), {
    [_A]: _SSMSA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetSubscriptionAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetSubscriptionAttributesInput(input, context)), {
    [_A]: _SSA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetTopicAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SetTopicAttributesInput(input, context)), {
    [_A]: _STA,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SubscribeCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_SubscribeInput(input, context)), {
    [_A]: _S,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_TagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_TagResourceRequest(input, context)), {
    [_A]: _TR,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UnsubscribeCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UnsubscribeInput(input, context)), {
    [_A]: _U,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UntagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_UntagResourceRequest(input, context)), {
    [_A]: _UR,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_VerifySMSSandboxPhoneNumberCommand = (input, context) => __async(void 0, null, function* () {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString(__spreadProps(__spreadValues({}, se_VerifySMSSandboxPhoneNumberInput(input, context)), {
    [_A]: _VSMSSPN,
    [_V]: _
  }));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var de_AddPermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_CheckIfPhoneNumberIsOptedOutCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CheckIfPhoneNumberIsOptedOutResponse(data.CheckIfPhoneNumberIsOptedOutResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ConfirmSubscriptionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ConfirmSubscriptionResponse(data.ConfirmSubscriptionResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreatePlatformApplicationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreatePlatformApplicationResponse(data.CreatePlatformApplicationResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreatePlatformEndpointCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateEndpointResponse(data.CreatePlatformEndpointResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateSMSSandboxPhoneNumberCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateSMSSandboxPhoneNumberResult(data.CreateSMSSandboxPhoneNumberResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_CreateTopicCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_CreateTopicResponse(data.CreateTopicResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteEndpointCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_DeletePlatformApplicationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_DeleteSMSSandboxPhoneNumberCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_DeleteSMSSandboxPhoneNumberResult(data.DeleteSMSSandboxPhoneNumberResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_DeleteTopicCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_GetDataProtectionPolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetDataProtectionPolicyResponse(data.GetDataProtectionPolicyResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetEndpointAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetEndpointAttributesResponse(data.GetEndpointAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetPlatformApplicationAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetPlatformApplicationAttributesResponse(data.GetPlatformApplicationAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetSMSAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetSMSAttributesResponse(data.GetSMSAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetSMSSandboxAccountStatusCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetSMSSandboxAccountStatusResult(data.GetSMSSandboxAccountStatusResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetSubscriptionAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetSubscriptionAttributesResponse(data.GetSubscriptionAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_GetTopicAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_GetTopicAttributesResponse(data.GetTopicAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListEndpointsByPlatformApplicationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListEndpointsByPlatformApplicationResponse(data.ListEndpointsByPlatformApplicationResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListOriginationNumbersCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListOriginationNumbersResult(data.ListOriginationNumbersResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListPhoneNumbersOptedOutCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListPhoneNumbersOptedOutResponse(data.ListPhoneNumbersOptedOutResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListPlatformApplicationsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListPlatformApplicationsResponse(data.ListPlatformApplicationsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListSMSSandboxPhoneNumbersCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListSMSSandboxPhoneNumbersResult(data.ListSMSSandboxPhoneNumbersResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListSubscriptionsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListSubscriptionsResponse(data.ListSubscriptionsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListSubscriptionsByTopicCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListSubscriptionsByTopicResponse(data.ListSubscriptionsByTopicResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListTagsForResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListTagsForResourceResponse(data.ListTagsForResourceResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_ListTopicsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_ListTopicsResponse(data.ListTopicsResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_OptInPhoneNumberCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_OptInPhoneNumberResponse(data.OptInPhoneNumberResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_PublishCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_PublishResponse(data.PublishResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_PublishBatchCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_PublishBatchResponse(data.PublishBatchResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_PutDataProtectionPolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_RemovePermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_SetEndpointAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_SetPlatformApplicationAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_SetSMSAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SetSMSAttributesResponse(data.SetSMSAttributesResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_SetSubscriptionAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_SetTopicAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_SubscribeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_SubscribeResponse(data.SubscribeResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_TagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_TagResourceResponse(data.TagResourceResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_UnsubscribeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
});
var de_UntagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_UntagResourceResponse(data.UntagResourceResult, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata(output)
  }, contents);
  return response;
});
var de_VerifySMSSandboxPhoneNumberCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseXmlBody(output.body, context);
  let contents = {};
  contents = de_VerifySMSSandboxPhoneNumberResult(data.VerifySMSSandboxPhoneNumberResult, context);
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
    case "AuthorizationError":
    case "com.amazonaws.sns#AuthorizationErrorException":
      throw yield de_AuthorizationErrorExceptionRes(parsedOutput, context);
    case "InternalError":
    case "com.amazonaws.sns#InternalErrorException":
      throw yield de_InternalErrorExceptionRes(parsedOutput, context);
    case "InvalidParameter":
    case "com.amazonaws.sns#InvalidParameterException":
      throw yield de_InvalidParameterExceptionRes(parsedOutput, context);
    case "NotFound":
    case "com.amazonaws.sns#NotFoundException":
      throw yield de_NotFoundExceptionRes(parsedOutput, context);
    case "Throttled":
    case "com.amazonaws.sns#ThrottledException":
      throw yield de_ThrottledExceptionRes(parsedOutput, context);
    case "FilterPolicyLimitExceeded":
    case "com.amazonaws.sns#FilterPolicyLimitExceededException":
      throw yield de_FilterPolicyLimitExceededExceptionRes(parsedOutput, context);
    case "ReplayLimitExceeded":
    case "com.amazonaws.sns#ReplayLimitExceededException":
      throw yield de_ReplayLimitExceededExceptionRes(parsedOutput, context);
    case "SubscriptionLimitExceeded":
    case "com.amazonaws.sns#SubscriptionLimitExceededException":
      throw yield de_SubscriptionLimitExceededExceptionRes(parsedOutput, context);
    case "OptedOut":
    case "com.amazonaws.sns#OptedOutException":
      throw yield de_OptedOutExceptionRes(parsedOutput, context);
    case "UserError":
    case "com.amazonaws.sns#UserErrorException":
      throw yield de_UserErrorExceptionRes(parsedOutput, context);
    case "ConcurrentAccess":
    case "com.amazonaws.sns#ConcurrentAccessException":
      throw yield de_ConcurrentAccessExceptionRes(parsedOutput, context);
    case "InvalidSecurity":
    case "com.amazonaws.sns#InvalidSecurityException":
      throw yield de_InvalidSecurityExceptionRes(parsedOutput, context);
    case "StaleTag":
    case "com.amazonaws.sns#StaleTagException":
      throw yield de_StaleTagExceptionRes(parsedOutput, context);
    case "TagLimitExceeded":
    case "com.amazonaws.sns#TagLimitExceededException":
      throw yield de_TagLimitExceededExceptionRes(parsedOutput, context);
    case "TagPolicy":
    case "com.amazonaws.sns#TagPolicyException":
      throw yield de_TagPolicyExceptionRes(parsedOutput, context);
    case "TopicLimitExceeded":
    case "com.amazonaws.sns#TopicLimitExceededException":
      throw yield de_TopicLimitExceededExceptionRes(parsedOutput, context);
    case "ResourceNotFound":
    case "com.amazonaws.sns#ResourceNotFoundException":
      throw yield de_ResourceNotFoundExceptionRes(parsedOutput, context);
    case "InvalidState":
    case "com.amazonaws.sns#InvalidStateException":
      throw yield de_InvalidStateExceptionRes(parsedOutput, context);
    case "ValidationException":
    case "com.amazonaws.sns#ValidationException":
      throw yield de_ValidationExceptionRes(parsedOutput, context);
    case "EndpointDisabled":
    case "com.amazonaws.sns#EndpointDisabledException":
      throw yield de_EndpointDisabledExceptionRes(parsedOutput, context);
    case "KMSAccessDenied":
    case "com.amazonaws.sns#KMSAccessDeniedException":
      throw yield de_KMSAccessDeniedExceptionRes(parsedOutput, context);
    case "KMSDisabled":
    case "com.amazonaws.sns#KMSDisabledException":
      throw yield de_KMSDisabledExceptionRes(parsedOutput, context);
    case "KMSInvalidState":
    case "com.amazonaws.sns#KMSInvalidStateException":
      throw yield de_KMSInvalidStateExceptionRes(parsedOutput, context);
    case "KMSNotFound":
    case "com.amazonaws.sns#KMSNotFoundException":
      throw yield de_KMSNotFoundExceptionRes(parsedOutput, context);
    case "KMSOptInRequired":
    case "com.amazonaws.sns#KMSOptInRequired":
      throw yield de_KMSOptInRequiredRes(parsedOutput, context);
    case "KMSThrottling":
    case "com.amazonaws.sns#KMSThrottlingException":
      throw yield de_KMSThrottlingExceptionRes(parsedOutput, context);
    case "ParameterValueInvalid":
    case "com.amazonaws.sns#InvalidParameterValueException":
      throw yield de_InvalidParameterValueExceptionRes(parsedOutput, context);
    case "PlatformApplicationDisabled":
    case "com.amazonaws.sns#PlatformApplicationDisabledException":
      throw yield de_PlatformApplicationDisabledExceptionRes(parsedOutput, context);
    case "BatchEntryIdsNotDistinct":
    case "com.amazonaws.sns#BatchEntryIdsNotDistinctException":
      throw yield de_BatchEntryIdsNotDistinctExceptionRes(parsedOutput, context);
    case "BatchRequestTooLong":
    case "com.amazonaws.sns#BatchRequestTooLongException":
      throw yield de_BatchRequestTooLongExceptionRes(parsedOutput, context);
    case "EmptyBatchRequest":
    case "com.amazonaws.sns#EmptyBatchRequestException":
      throw yield de_EmptyBatchRequestExceptionRes(parsedOutput, context);
    case "InvalidBatchEntryId":
    case "com.amazonaws.sns#InvalidBatchEntryIdException":
      throw yield de_InvalidBatchEntryIdExceptionRes(parsedOutput, context);
    case "TooManyEntriesInBatchRequest":
    case "com.amazonaws.sns#TooManyEntriesInBatchRequestException":
      throw yield de_TooManyEntriesInBatchRequestExceptionRes(parsedOutput, context);
    case "VerificationException":
    case "com.amazonaws.sns#VerificationException":
      throw yield de_VerificationExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError({
        output,
        parsedBody: parsedBody.Error,
        errorCode
      });
  }
});
var de_AuthorizationErrorExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_AuthorizationErrorException(body.Error, context);
  const exception = new AuthorizationErrorException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_BatchEntryIdsNotDistinctExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_BatchEntryIdsNotDistinctException(body.Error, context);
  const exception = new BatchEntryIdsNotDistinctException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_BatchRequestTooLongExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_BatchRequestTooLongException(body.Error, context);
  const exception = new BatchRequestTooLongException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ConcurrentAccessExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ConcurrentAccessException(body.Error, context);
  const exception = new ConcurrentAccessException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_EmptyBatchRequestExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_EmptyBatchRequestException(body.Error, context);
  const exception = new EmptyBatchRequestException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_EndpointDisabledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_EndpointDisabledException(body.Error, context);
  const exception = new EndpointDisabledException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_FilterPolicyLimitExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_FilterPolicyLimitExceededException(body.Error, context);
  const exception = new FilterPolicyLimitExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InternalErrorExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InternalErrorException(body.Error, context);
  const exception = new InternalErrorException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidBatchEntryIdExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidBatchEntryIdException(body.Error, context);
  const exception = new InvalidBatchEntryIdException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidParameterExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidParameterException(body.Error, context);
  const exception = new InvalidParameterException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidParameterValueExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidParameterValueException(body.Error, context);
  const exception = new InvalidParameterValueException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidSecurityExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidSecurityException(body.Error, context);
  const exception = new InvalidSecurityException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidStateExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_InvalidStateException(body.Error, context);
  const exception = new InvalidStateException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_KMSAccessDeniedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_KMSAccessDeniedException(body.Error, context);
  const exception = new KMSAccessDeniedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_KMSDisabledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_KMSDisabledException(body.Error, context);
  const exception = new KMSDisabledException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_KMSInvalidStateExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_KMSInvalidStateException(body.Error, context);
  const exception = new KMSInvalidStateException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_KMSNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_KMSNotFoundException(body.Error, context);
  const exception = new KMSNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_KMSOptInRequiredRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_KMSOptInRequired(body.Error, context);
  const exception = new KMSOptInRequired(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_KMSThrottlingExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_KMSThrottlingException(body.Error, context);
  const exception = new KMSThrottlingException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_NotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_NotFoundException(body.Error, context);
  const exception = new NotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_OptedOutExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_OptedOutException(body.Error, context);
  const exception = new OptedOutException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_PlatformApplicationDisabledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_PlatformApplicationDisabledException(body.Error, context);
  const exception = new PlatformApplicationDisabledException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ReplayLimitExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ReplayLimitExceededException(body.Error, context);
  const exception = new ReplayLimitExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ResourceNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ResourceNotFoundException(body.Error, context);
  const exception = new ResourceNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_StaleTagExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_StaleTagException(body.Error, context);
  const exception = new StaleTagException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_SubscriptionLimitExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_SubscriptionLimitExceededException(body.Error, context);
  const exception = new SubscriptionLimitExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TagLimitExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_TagLimitExceededException(body.Error, context);
  const exception = new TagLimitExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TagPolicyExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_TagPolicyException(body.Error, context);
  const exception = new TagPolicyException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ThrottledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ThrottledException(body.Error, context);
  const exception = new ThrottledException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TooManyEntriesInBatchRequestExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_TooManyEntriesInBatchRequestException(body.Error, context);
  const exception = new TooManyEntriesInBatchRequestException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TopicLimitExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_TopicLimitExceededException(body.Error, context);
  const exception = new TopicLimitExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UserErrorExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_UserErrorException(body.Error, context);
  const exception = new UserErrorException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ValidationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_ValidationException(body.Error, context);
  const exception = new ValidationException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_VerificationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = de_VerificationException(body.Error, context);
  const exception = new VerificationException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var se_ActionsList = (input, context) => {
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
var se_AddPermissionInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_L] != null) {
    entries[_L] = input[_L];
  }
  if (input[_AWSAI] != null) {
    const memberEntries = se_DelegatesList(input[_AWSAI], context);
    if (input[_AWSAI]?.length === 0) {
      entries.AWSAccountId = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `AWSAccountId.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_AN] != null) {
    const memberEntries = se_ActionsList(input[_AN], context);
    if (input[_AN]?.length === 0) {
      entries.ActionName = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ActionName.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_CheckIfPhoneNumberIsOptedOutInput = (input, context) => {
  const entries = {};
  if (input[_pN] != null) {
    entries[_pN] = input[_pN];
  }
  return entries;
};
var se_ConfirmSubscriptionInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_T] != null) {
    entries[_T] = input[_T];
  }
  if (input[_AOU] != null) {
    entries[_AOU] = input[_AOU];
  }
  return entries;
};
var se_CreatePlatformApplicationInput = (input, context) => {
  const entries = {};
  if (input[_N] != null) {
    entries[_N] = input[_N];
  }
  if (input[_Pl] != null) {
    entries[_Pl] = input[_Pl];
  }
  if (input[_At] != null) {
    const memberEntries = se_MapStringToString(input[_At], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Attributes.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_CreatePlatformEndpointInput = (input, context) => {
  const entries = {};
  if (input[_PAA] != null) {
    entries[_PAA] = input[_PAA];
  }
  if (input[_T] != null) {
    entries[_T] = input[_T];
  }
  if (input[_CUD] != null) {
    entries[_CUD] = input[_CUD];
  }
  if (input[_At] != null) {
    const memberEntries = se_MapStringToString(input[_At], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Attributes.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_CreateSMSSandboxPhoneNumberInput = (input, context) => {
  const entries = {};
  if (input[_PN] != null) {
    entries[_PN] = input[_PN];
  }
  if (input[_LC] != null) {
    entries[_LC] = input[_LC];
  }
  return entries;
};
var se_CreateTopicInput = (input, context) => {
  const entries = {};
  if (input[_N] != null) {
    entries[_N] = input[_N];
  }
  if (input[_At] != null) {
    const memberEntries = se_TopicAttributesMap(input[_At], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Attributes.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_Ta] != null) {
    const memberEntries = se_TagList(input[_Ta], context);
    if (input[_Ta]?.length === 0) {
      entries.Tags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Tags.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_DPP] != null) {
    entries[_DPP] = input[_DPP];
  }
  return entries;
};
var se_DelegatesList = (input, context) => {
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
var se_DeleteEndpointInput = (input, context) => {
  const entries = {};
  if (input[_EA] != null) {
    entries[_EA] = input[_EA];
  }
  return entries;
};
var se_DeletePlatformApplicationInput = (input, context) => {
  const entries = {};
  if (input[_PAA] != null) {
    entries[_PAA] = input[_PAA];
  }
  return entries;
};
var se_DeleteSMSSandboxPhoneNumberInput = (input, context) => {
  const entries = {};
  if (input[_PN] != null) {
    entries[_PN] = input[_PN];
  }
  return entries;
};
var se_DeleteTopicInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  return entries;
};
var se_GetDataProtectionPolicyInput = (input, context) => {
  const entries = {};
  if (input[_RA] != null) {
    entries[_RA] = input[_RA];
  }
  return entries;
};
var se_GetEndpointAttributesInput = (input, context) => {
  const entries = {};
  if (input[_EA] != null) {
    entries[_EA] = input[_EA];
  }
  return entries;
};
var se_GetPlatformApplicationAttributesInput = (input, context) => {
  const entries = {};
  if (input[_PAA] != null) {
    entries[_PAA] = input[_PAA];
  }
  return entries;
};
var se_GetSMSAttributesInput = (input, context) => {
  const entries = {};
  if (input[_a] != null) {
    const memberEntries = se_ListString(input[_a], context);
    if (input[_a]?.length === 0) {
      entries.attributes = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `attributes.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_GetSMSSandboxAccountStatusInput = (input, context) => {
  const entries = {};
  return entries;
};
var se_GetSubscriptionAttributesInput = (input, context) => {
  const entries = {};
  if (input[_SA] != null) {
    entries[_SA] = input[_SA];
  }
  return entries;
};
var se_GetTopicAttributesInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  return entries;
};
var se_ListEndpointsByPlatformApplicationInput = (input, context) => {
  const entries = {};
  if (input[_PAA] != null) {
    entries[_PAA] = input[_PAA];
  }
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  return entries;
};
var se_ListOriginationNumbersRequest = (input, context) => {
  const entries = {};
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  if (input[_MR] != null) {
    entries[_MR] = input[_MR];
  }
  return entries;
};
var se_ListPhoneNumbersOptedOutInput = (input, context) => {
  const entries = {};
  if (input[_nT] != null) {
    entries[_nT] = input[_nT];
  }
  return entries;
};
var se_ListPlatformApplicationsInput = (input, context) => {
  const entries = {};
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  return entries;
};
var se_ListSMSSandboxPhoneNumbersInput = (input, context) => {
  const entries = {};
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  if (input[_MR] != null) {
    entries[_MR] = input[_MR];
  }
  return entries;
};
var se_ListString = (input, context) => {
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
var se_ListSubscriptionsByTopicInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  return entries;
};
var se_ListSubscriptionsInput = (input, context) => {
  const entries = {};
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  return entries;
};
var se_ListTagsForResourceRequest = (input, context) => {
  const entries = {};
  if (input[_RA] != null) {
    entries[_RA] = input[_RA];
  }
  return entries;
};
var se_ListTopicsInput = (input, context) => {
  const entries = {};
  if (input[_NT] != null) {
    entries[_NT] = input[_NT];
  }
  return entries;
};
var se_MapStringToString = (input, context) => {
  const entries = {};
  let counter = 1;
  Object.keys(input).filter((key) => input[key] != null).forEach((key) => {
    entries[`entry.${counter}.key`] = key;
    entries[`entry.${counter}.value`] = input[key];
    counter++;
  });
  return entries;
};
var se_MessageAttributeMap = (input, context) => {
  const entries = {};
  let counter = 1;
  Object.keys(input).filter((key) => input[key] != null).forEach((key) => {
    entries[`entry.${counter}.Name`] = key;
    const memberEntries = se_MessageAttributeValue(input[key], context);
    Object.entries(memberEntries).forEach(([key2, value]) => {
      entries[`entry.${counter}.Value.${key2}`] = value;
    });
    counter++;
  });
  return entries;
};
var se_MessageAttributeValue = (input, context) => {
  const entries = {};
  if (input[_DTa] != null) {
    entries[_DTa] = input[_DTa];
  }
  if (input[_SV] != null) {
    entries[_SV] = input[_SV];
  }
  if (input[_BV] != null) {
    entries[_BV] = context.base64Encoder(input[_BV]);
  }
  return entries;
};
var se_OptInPhoneNumberInput = (input, context) => {
  const entries = {};
  if (input[_pN] != null) {
    entries[_pN] = input[_pN];
  }
  return entries;
};
var se_PublishBatchInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_PBRE] != null) {
    const memberEntries = se_PublishBatchRequestEntryList(input[_PBRE], context);
    if (input[_PBRE]?.length === 0) {
      entries.PublishBatchRequestEntries = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `PublishBatchRequestEntries.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_PublishBatchRequestEntry = (input, context) => {
  const entries = {};
  if (input[_I] != null) {
    entries[_I] = input[_I];
  }
  if (input[_M] != null) {
    entries[_M] = input[_M];
  }
  if (input[_Su] != null) {
    entries[_Su] = input[_Su];
  }
  if (input[_MS] != null) {
    entries[_MS] = input[_MS];
  }
  if (input[_MA] != null) {
    const memberEntries = se_MessageAttributeMap(input[_MA], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `MessageAttributes.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_MDI] != null) {
    entries[_MDI] = input[_MDI];
  }
  if (input[_MGI] != null) {
    entries[_MGI] = input[_MGI];
  }
  return entries;
};
var se_PublishBatchRequestEntryList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_PublishBatchRequestEntry(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_PublishInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_TAa] != null) {
    entries[_TAa] = input[_TAa];
  }
  if (input[_PN] != null) {
    entries[_PN] = input[_PN];
  }
  if (input[_M] != null) {
    entries[_M] = input[_M];
  }
  if (input[_Su] != null) {
    entries[_Su] = input[_Su];
  }
  if (input[_MS] != null) {
    entries[_MS] = input[_MS];
  }
  if (input[_MA] != null) {
    const memberEntries = se_MessageAttributeMap(input[_MA], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `MessageAttributes.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_MDI] != null) {
    entries[_MDI] = input[_MDI];
  }
  if (input[_MGI] != null) {
    entries[_MGI] = input[_MGI];
  }
  return entries;
};
var se_PutDataProtectionPolicyInput = (input, context) => {
  const entries = {};
  if (input[_RA] != null) {
    entries[_RA] = input[_RA];
  }
  if (input[_DPP] != null) {
    entries[_DPP] = input[_DPP];
  }
  return entries;
};
var se_RemovePermissionInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_L] != null) {
    entries[_L] = input[_L];
  }
  return entries;
};
var se_SetEndpointAttributesInput = (input, context) => {
  const entries = {};
  if (input[_EA] != null) {
    entries[_EA] = input[_EA];
  }
  if (input[_At] != null) {
    const memberEntries = se_MapStringToString(input[_At], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Attributes.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_SetPlatformApplicationAttributesInput = (input, context) => {
  const entries = {};
  if (input[_PAA] != null) {
    entries[_PAA] = input[_PAA];
  }
  if (input[_At] != null) {
    const memberEntries = se_MapStringToString(input[_At], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Attributes.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_SetSMSAttributesInput = (input, context) => {
  const entries = {};
  if (input[_a] != null) {
    const memberEntries = se_MapStringToString(input[_a], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `attributes.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_SetSubscriptionAttributesInput = (input, context) => {
  const entries = {};
  if (input[_SA] != null) {
    entries[_SA] = input[_SA];
  }
  if (input[_ANt] != null) {
    entries[_ANt] = input[_ANt];
  }
  if (input[_AV] != null) {
    entries[_AV] = input[_AV];
  }
  return entries;
};
var se_SetTopicAttributesInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_ANt] != null) {
    entries[_ANt] = input[_ANt];
  }
  if (input[_AV] != null) {
    entries[_AV] = input[_AV];
  }
  return entries;
};
var se_SubscribeInput = (input, context) => {
  const entries = {};
  if (input[_TA] != null) {
    entries[_TA] = input[_TA];
  }
  if (input[_Pr] != null) {
    entries[_Pr] = input[_Pr];
  }
  if (input[_E] != null) {
    entries[_E] = input[_E];
  }
  if (input[_At] != null) {
    const memberEntries = se_SubscriptionAttributesMap(input[_At], context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Attributes.${key}`;
      entries[loc] = value;
    });
  }
  if (input[_RSA] != null) {
    entries[_RSA] = input[_RSA];
  }
  return entries;
};
var se_SubscriptionAttributesMap = (input, context) => {
  const entries = {};
  let counter = 1;
  Object.keys(input).filter((key) => input[key] != null).forEach((key) => {
    entries[`entry.${counter}.key`] = key;
    entries[`entry.${counter}.value`] = input[key];
    counter++;
  });
  return entries;
};
var se_Tag = (input, context) => {
  const entries = {};
  if (input[_K] != null) {
    entries[_K] = input[_K];
  }
  if (input[_Va] != null) {
    entries[_Va] = input[_Va];
  }
  return entries;
};
var se_TagKeyList = (input, context) => {
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
var se_TagList = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_Tag(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_TagResourceRequest = (input, context) => {
  const entries = {};
  if (input[_RA] != null) {
    entries[_RA] = input[_RA];
  }
  if (input[_Ta] != null) {
    const memberEntries = se_TagList(input[_Ta], context);
    if (input[_Ta]?.length === 0) {
      entries.Tags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Tags.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_TopicAttributesMap = (input, context) => {
  const entries = {};
  let counter = 1;
  Object.keys(input).filter((key) => input[key] != null).forEach((key) => {
    entries[`entry.${counter}.key`] = key;
    entries[`entry.${counter}.value`] = input[key];
    counter++;
  });
  return entries;
};
var se_UnsubscribeInput = (input, context) => {
  const entries = {};
  if (input[_SA] != null) {
    entries[_SA] = input[_SA];
  }
  return entries;
};
var se_UntagResourceRequest = (input, context) => {
  const entries = {};
  if (input[_RA] != null) {
    entries[_RA] = input[_RA];
  }
  if (input[_TK] != null) {
    const memberEntries = se_TagKeyList(input[_TK], context);
    if (input[_TK]?.length === 0) {
      entries.TagKeys = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `TagKeys.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_VerifySMSSandboxPhoneNumberInput = (input, context) => {
  const entries = {};
  if (input[_PN] != null) {
    entries[_PN] = input[_PN];
  }
  if (input[_OTP] != null) {
    entries[_OTP] = input[_OTP];
  }
  return entries;
};
var de_AuthorizationErrorException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_BatchEntryIdsNotDistinctException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_BatchRequestTooLongException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_BatchResultErrorEntry = (output, context) => {
  const contents = {};
  if (output[_I] != null) {
    contents[_I] = expectString(output[_I]);
  }
  if (output[_C] != null) {
    contents[_C] = expectString(output[_C]);
  }
  if (output[_M] != null) {
    contents[_M] = expectString(output[_M]);
  }
  if (output[_SF] != null) {
    contents[_SF] = parseBoolean(output[_SF]);
  }
  return contents;
};
var de_BatchResultErrorEntryList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_BatchResultErrorEntry(entry, context);
  });
};
var de_CheckIfPhoneNumberIsOptedOutResponse = (output, context) => {
  const contents = {};
  if (output[_iOO] != null) {
    contents[_iOO] = parseBoolean(output[_iOO]);
  }
  return contents;
};
var de_ConcurrentAccessException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_ConfirmSubscriptionResponse = (output, context) => {
  const contents = {};
  if (output[_SA] != null) {
    contents[_SA] = expectString(output[_SA]);
  }
  return contents;
};
var de_CreateEndpointResponse = (output, context) => {
  const contents = {};
  if (output[_EA] != null) {
    contents[_EA] = expectString(output[_EA]);
  }
  return contents;
};
var de_CreatePlatformApplicationResponse = (output, context) => {
  const contents = {};
  if (output[_PAA] != null) {
    contents[_PAA] = expectString(output[_PAA]);
  }
  return contents;
};
var de_CreateSMSSandboxPhoneNumberResult = (output, context) => {
  const contents = {};
  return contents;
};
var de_CreateTopicResponse = (output, context) => {
  const contents = {};
  if (output[_TA] != null) {
    contents[_TA] = expectString(output[_TA]);
  }
  return contents;
};
var de_DeleteSMSSandboxPhoneNumberResult = (output, context) => {
  const contents = {};
  return contents;
};
var de_EmptyBatchRequestException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_Endpoint = (output, context) => {
  const contents = {};
  if (output[_EA] != null) {
    contents[_EA] = expectString(output[_EA]);
  }
  if (output.Attributes === "") {
    contents[_At] = {};
  } else if (output[_At] != null && output[_At][_e] != null) {
    contents[_At] = de_MapStringToString(getArrayIfSingleItem(output[_At][_e]), context);
  }
  return contents;
};
var de_EndpointDisabledException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_FilterPolicyLimitExceededException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_GetDataProtectionPolicyResponse = (output, context) => {
  const contents = {};
  if (output[_DPP] != null) {
    contents[_DPP] = expectString(output[_DPP]);
  }
  return contents;
};
var de_GetEndpointAttributesResponse = (output, context) => {
  const contents = {};
  if (output.Attributes === "") {
    contents[_At] = {};
  } else if (output[_At] != null && output[_At][_e] != null) {
    contents[_At] = de_MapStringToString(getArrayIfSingleItem(output[_At][_e]), context);
  }
  return contents;
};
var de_GetPlatformApplicationAttributesResponse = (output, context) => {
  const contents = {};
  if (output.Attributes === "") {
    contents[_At] = {};
  } else if (output[_At] != null && output[_At][_e] != null) {
    contents[_At] = de_MapStringToString(getArrayIfSingleItem(output[_At][_e]), context);
  }
  return contents;
};
var de_GetSMSAttributesResponse = (output, context) => {
  const contents = {};
  if (output.attributes === "") {
    contents[_a] = {};
  } else if (output[_a] != null && output[_a][_e] != null) {
    contents[_a] = de_MapStringToString(getArrayIfSingleItem(output[_a][_e]), context);
  }
  return contents;
};
var de_GetSMSSandboxAccountStatusResult = (output, context) => {
  const contents = {};
  if (output[_IIS] != null) {
    contents[_IIS] = parseBoolean(output[_IIS]);
  }
  return contents;
};
var de_GetSubscriptionAttributesResponse = (output, context) => {
  const contents = {};
  if (output.Attributes === "") {
    contents[_At] = {};
  } else if (output[_At] != null && output[_At][_e] != null) {
    contents[_At] = de_SubscriptionAttributesMap(getArrayIfSingleItem(output[_At][_e]), context);
  }
  return contents;
};
var de_GetTopicAttributesResponse = (output, context) => {
  const contents = {};
  if (output.Attributes === "") {
    contents[_At] = {};
  } else if (output[_At] != null && output[_At][_e] != null) {
    contents[_At] = de_TopicAttributesMap(getArrayIfSingleItem(output[_At][_e]), context);
  }
  return contents;
};
var de_InternalErrorException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidBatchEntryIdException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidParameterException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidParameterValueException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidSecurityException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_InvalidStateException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_KMSAccessDeniedException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_KMSDisabledException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_KMSInvalidStateException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_KMSNotFoundException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_KMSOptInRequired = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_KMSThrottlingException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_ListEndpointsByPlatformApplicationResponse = (output, context) => {
  const contents = {};
  if (output.Endpoints === "") {
    contents[_En] = [];
  } else if (output[_En] != null && output[_En][_me] != null) {
    contents[_En] = de_ListOfEndpoints(getArrayIfSingleItem(output[_En][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListOfEndpoints = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_Endpoint(entry, context);
  });
};
var de_ListOfPlatformApplications = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_PlatformApplication(entry, context);
  });
};
var de_ListOriginationNumbersResult = (output, context) => {
  const contents = {};
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  if (output.PhoneNumbers === "") {
    contents[_PNh] = [];
  } else if (output[_PNh] != null && output[_PNh][_me] != null) {
    contents[_PNh] = de_PhoneNumberInformationList(getArrayIfSingleItem(output[_PNh][_me]), context);
  }
  return contents;
};
var de_ListPhoneNumbersOptedOutResponse = (output, context) => {
  const contents = {};
  if (output.phoneNumbers === "") {
    contents[_pNh] = [];
  } else if (output[_pNh] != null && output[_pNh][_me] != null) {
    contents[_pNh] = de_PhoneNumberList(getArrayIfSingleItem(output[_pNh][_me]), context);
  }
  if (output[_nT] != null) {
    contents[_nT] = expectString(output[_nT]);
  }
  return contents;
};
var de_ListPlatformApplicationsResponse = (output, context) => {
  const contents = {};
  if (output.PlatformApplications === "") {
    contents[_PA] = [];
  } else if (output[_PA] != null && output[_PA][_me] != null) {
    contents[_PA] = de_ListOfPlatformApplications(getArrayIfSingleItem(output[_PA][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListSMSSandboxPhoneNumbersResult = (output, context) => {
  const contents = {};
  if (output.PhoneNumbers === "") {
    contents[_PNh] = [];
  } else if (output[_PNh] != null && output[_PNh][_me] != null) {
    contents[_PNh] = de_SMSSandboxPhoneNumberList(getArrayIfSingleItem(output[_PNh][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListSubscriptionsByTopicResponse = (output, context) => {
  const contents = {};
  if (output.Subscriptions === "") {
    contents[_Sub] = [];
  } else if (output[_Sub] != null && output[_Sub][_me] != null) {
    contents[_Sub] = de_SubscriptionsList(getArrayIfSingleItem(output[_Sub][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListSubscriptionsResponse = (output, context) => {
  const contents = {};
  if (output.Subscriptions === "") {
    contents[_Sub] = [];
  } else if (output[_Sub] != null && output[_Sub][_me] != null) {
    contents[_Sub] = de_SubscriptionsList(getArrayIfSingleItem(output[_Sub][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_ListTagsForResourceResponse = (output, context) => {
  const contents = {};
  if (output.Tags === "") {
    contents[_Ta] = [];
  } else if (output[_Ta] != null && output[_Ta][_me] != null) {
    contents[_Ta] = de_TagList(getArrayIfSingleItem(output[_Ta][_me]), context);
  }
  return contents;
};
var de_ListTopicsResponse = (output, context) => {
  const contents = {};
  if (output.Topics === "") {
    contents[_To] = [];
  } else if (output[_To] != null && output[_To][_me] != null) {
    contents[_To] = de_TopicsList(getArrayIfSingleItem(output[_To][_me]), context);
  }
  if (output[_NT] != null) {
    contents[_NT] = expectString(output[_NT]);
  }
  return contents;
};
var de_MapStringToString = (output, context) => {
  return output.reduce((acc, pair) => {
    if (pair["value"] === null) {
      return acc;
    }
    acc[pair["key"]] = expectString(pair["value"]);
    return acc;
  }, {});
};
var de_NotFoundException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_NumberCapabilityList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return expectString(entry);
  });
};
var de_OptedOutException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_OptInPhoneNumberResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_PhoneNumberInformation = (output, context) => {
  const contents = {};
  if (output[_CA] != null) {
    contents[_CA] = expectNonNull(parseRfc3339DateTimeWithOffset(output[_CA]));
  }
  if (output[_PN] != null) {
    contents[_PN] = expectString(output[_PN]);
  }
  if (output[_St] != null) {
    contents[_St] = expectString(output[_St]);
  }
  if (output[_ICC] != null) {
    contents[_ICC] = expectString(output[_ICC]);
  }
  if (output[_RT] != null) {
    contents[_RT] = expectString(output[_RT]);
  }
  if (output.NumberCapabilities === "") {
    contents[_NC] = [];
  } else if (output[_NC] != null && output[_NC][_me] != null) {
    contents[_NC] = de_NumberCapabilityList(getArrayIfSingleItem(output[_NC][_me]), context);
  }
  return contents;
};
var de_PhoneNumberInformationList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_PhoneNumberInformation(entry, context);
  });
};
var de_PhoneNumberList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return expectString(entry);
  });
};
var de_PlatformApplication = (output, context) => {
  const contents = {};
  if (output[_PAA] != null) {
    contents[_PAA] = expectString(output[_PAA]);
  }
  if (output.Attributes === "") {
    contents[_At] = {};
  } else if (output[_At] != null && output[_At][_e] != null) {
    contents[_At] = de_MapStringToString(getArrayIfSingleItem(output[_At][_e]), context);
  }
  return contents;
};
var de_PlatformApplicationDisabledException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_PublishBatchResponse = (output, context) => {
  const contents = {};
  if (output.Successful === "") {
    contents[_Suc] = [];
  } else if (output[_Suc] != null && output[_Suc][_me] != null) {
    contents[_Suc] = de_PublishBatchResultEntryList(getArrayIfSingleItem(output[_Suc][_me]), context);
  }
  if (output.Failed === "") {
    contents[_F] = [];
  } else if (output[_F] != null && output[_F][_me] != null) {
    contents[_F] = de_BatchResultErrorEntryList(getArrayIfSingleItem(output[_F][_me]), context);
  }
  return contents;
};
var de_PublishBatchResultEntry = (output, context) => {
  const contents = {};
  if (output[_I] != null) {
    contents[_I] = expectString(output[_I]);
  }
  if (output[_MI] != null) {
    contents[_MI] = expectString(output[_MI]);
  }
  if (output[_SN] != null) {
    contents[_SN] = expectString(output[_SN]);
  }
  return contents;
};
var de_PublishBatchResultEntryList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_PublishBatchResultEntry(entry, context);
  });
};
var de_PublishResponse = (output, context) => {
  const contents = {};
  if (output[_MI] != null) {
    contents[_MI] = expectString(output[_MI]);
  }
  if (output[_SN] != null) {
    contents[_SN] = expectString(output[_SN]);
  }
  return contents;
};
var de_ReplayLimitExceededException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_ResourceNotFoundException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_SetSMSAttributesResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_SMSSandboxPhoneNumber = (output, context) => {
  const contents = {};
  if (output[_PN] != null) {
    contents[_PN] = expectString(output[_PN]);
  }
  if (output[_St] != null) {
    contents[_St] = expectString(output[_St]);
  }
  return contents;
};
var de_SMSSandboxPhoneNumberList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_SMSSandboxPhoneNumber(entry, context);
  });
};
var de_StaleTagException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_SubscribeResponse = (output, context) => {
  const contents = {};
  if (output[_SA] != null) {
    contents[_SA] = expectString(output[_SA]);
  }
  return contents;
};
var de_Subscription = (output, context) => {
  const contents = {};
  if (output[_SA] != null) {
    contents[_SA] = expectString(output[_SA]);
  }
  if (output[_O] != null) {
    contents[_O] = expectString(output[_O]);
  }
  if (output[_Pr] != null) {
    contents[_Pr] = expectString(output[_Pr]);
  }
  if (output[_E] != null) {
    contents[_E] = expectString(output[_E]);
  }
  if (output[_TA] != null) {
    contents[_TA] = expectString(output[_TA]);
  }
  return contents;
};
var de_SubscriptionAttributesMap = (output, context) => {
  return output.reduce((acc, pair) => {
    if (pair["value"] === null) {
      return acc;
    }
    acc[pair["key"]] = expectString(pair["value"]);
    return acc;
  }, {});
};
var de_SubscriptionLimitExceededException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_SubscriptionsList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_Subscription(entry, context);
  });
};
var de_Tag = (output, context) => {
  const contents = {};
  if (output[_K] != null) {
    contents[_K] = expectString(output[_K]);
  }
  if (output[_Va] != null) {
    contents[_Va] = expectString(output[_Va]);
  }
  return contents;
};
var de_TagLimitExceededException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_TagList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_Tag(entry, context);
  });
};
var de_TagPolicyException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_TagResourceResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_ThrottledException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_TooManyEntriesInBatchRequestException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_Topic = (output, context) => {
  const contents = {};
  if (output[_TA] != null) {
    contents[_TA] = expectString(output[_TA]);
  }
  return contents;
};
var de_TopicAttributesMap = (output, context) => {
  return output.reduce((acc, pair) => {
    if (pair["value"] === null) {
      return acc;
    }
    acc[pair["key"]] = expectString(pair["value"]);
    return acc;
  }, {});
};
var de_TopicLimitExceededException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_TopicsList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_Topic(entry, context);
  });
};
var de_UntagResourceResponse = (output, context) => {
  const contents = {};
  return contents;
};
var de_UserErrorException = (output, context) => {
  const contents = {};
  if (output[_m] != null) {
    contents[_m] = expectString(output[_m]);
  }
  return contents;
};
var de_ValidationException = (output, context) => {
  const contents = {};
  if (output[_M] != null) {
    contents[_M] = expectString(output[_M]);
  }
  return contents;
};
var de_VerificationException = (output, context) => {
  const contents = {};
  if (output[_M] != null) {
    contents[_M] = expectString(output[_M]);
  }
  if (output[_St] != null) {
    contents[_St] = expectString(output[_St]);
  }
  return contents;
};
var de_VerifySMSSandboxPhoneNumberResult = (output, context) => {
  const contents = {};
  return contents;
};
var deserializeMetadata = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var throwDefaultError = withBaseException(SNSServiceException);
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
var _ = "2010-03-31";
var _A = "Action";
var _AN = "ActionName";
var _ANt = "AttributeName";
var _AOU = "AuthenticateOnUnsubscribe";
var _AP = "AddPermission";
var _AV = "AttributeValue";
var _AWSAI = "AWSAccountId";
var _At = "Attributes";
var _BV = "BinaryValue";
var _C = "Code";
var _CA = "CreatedAt";
var _CIPNIOO = "CheckIfPhoneNumberIsOptedOut";
var _CPA = "CreatePlatformApplication";
var _CPE = "CreatePlatformEndpoint";
var _CS = "ConfirmSubscription";
var _CSMSSPN = "CreateSMSSandboxPhoneNumber";
var _CT = "CreateTopic";
var _CUD = "CustomUserData";
var _DE = "DeleteEndpoint";
var _DPA = "DeletePlatformApplication";
var _DPP = "DataProtectionPolicy";
var _DSMSSPN = "DeleteSMSSandboxPhoneNumber";
var _DT = "DeleteTopic";
var _DTa = "DataType";
var _E = "Endpoint";
var _EA = "EndpointArn";
var _En = "Endpoints";
var _F = "Failed";
var _GDPP = "GetDataProtectionPolicy";
var _GEA = "GetEndpointAttributes";
var _GPAA = "GetPlatformApplicationAttributes";
var _GSA = "GetSubscriptionAttributes";
var _GSMSA = "GetSMSAttributes";
var _GSMSSAS = "GetSMSSandboxAccountStatus";
var _GTA = "GetTopicAttributes";
var _I = "Id";
var _ICC = "Iso2CountryCode";
var _IIS = "IsInSandbox";
var _K = "Key";
var _L = "Label";
var _LC = "LanguageCode";
var _LEBPA = "ListEndpointsByPlatformApplication";
var _LON = "ListOriginationNumbers";
var _LPA = "ListPlatformApplications";
var _LPNOO = "ListPhoneNumbersOptedOut";
var _LS = "ListSubscriptions";
var _LSBT = "ListSubscriptionsByTopic";
var _LSMSSPN = "ListSMSSandboxPhoneNumbers";
var _LT = "ListTopics";
var _LTFR = "ListTagsForResource";
var _M = "Message";
var _MA = "MessageAttributes";
var _MDI = "MessageDeduplicationId";
var _MGI = "MessageGroupId";
var _MI = "MessageId";
var _MR = "MaxResults";
var _MS = "MessageStructure";
var _N = "Name";
var _NC = "NumberCapabilities";
var _NT = "NextToken";
var _O = "Owner";
var _OIPN = "OptInPhoneNumber";
var _OTP = "OneTimePassword";
var _P = "Publish";
var _PA = "PlatformApplications";
var _PAA = "PlatformApplicationArn";
var _PB = "PublishBatch";
var _PBRE = "PublishBatchRequestEntries";
var _PDPP = "PutDataProtectionPolicy";
var _PN = "PhoneNumber";
var _PNh = "PhoneNumbers";
var _Pl = "Platform";
var _Pr = "Protocol";
var _RA = "ResourceArn";
var _RP = "RemovePermission";
var _RSA = "ReturnSubscriptionArn";
var _RT = "RouteType";
var _S = "Subscribe";
var _SA = "SubscriptionArn";
var _SEA = "SetEndpointAttributes";
var _SF = "SenderFault";
var _SN = "SequenceNumber";
var _SPAA = "SetPlatformApplicationAttributes";
var _SSA = "SetSubscriptionAttributes";
var _SSMSA = "SetSMSAttributes";
var _STA = "SetTopicAttributes";
var _SV = "StringValue";
var _St = "Status";
var _Su = "Subject";
var _Sub = "Subscriptions";
var _Suc = "Successful";
var _T = "Token";
var _TA = "TopicArn";
var _TAa = "TargetArn";
var _TK = "TagKeys";
var _TR = "TagResource";
var _Ta = "Tags";
var _To = "Topics";
var _U = "Unsubscribe";
var _UR = "UntagResource";
var _V = "Version";
var _VSMSSPN = "VerifySMSSandboxPhoneNumber";
var _Va = "Value";
var _a = "attributes";
var _e = "entry";
var _iOO = "isOptedOut";
var _m = "message";
var _me = "member";
var _nT = "nextToken";
var _pN = "phoneNumber";
var _pNh = "phoneNumbers";
var buildFormUrlencodedString = (formEntries) => Object.entries(formEntries).map(([key, value]) => extendedEncodeURIComponent(key) + "=" + extendedEncodeURIComponent(value)).join("&");
var loadQueryErrorCode = (output, data) => {
  if (data.Error?.Code !== void 0) {
    return data.Error.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/AddPermissionCommand.js
var AddPermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "AddPermission", {}).n("SNSClient", "AddPermissionCommand").f(void 0, void 0).ser(se_AddPermissionCommand).de(de_AddPermissionCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/CheckIfPhoneNumberIsOptedOutCommand.js
var CheckIfPhoneNumberIsOptedOutCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "CheckIfPhoneNumberIsOptedOut", {}).n("SNSClient", "CheckIfPhoneNumberIsOptedOutCommand").f(CheckIfPhoneNumberIsOptedOutInputFilterSensitiveLog, void 0).ser(se_CheckIfPhoneNumberIsOptedOutCommand).de(de_CheckIfPhoneNumberIsOptedOutCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ConfirmSubscriptionCommand.js
var ConfirmSubscriptionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ConfirmSubscription", {}).n("SNSClient", "ConfirmSubscriptionCommand").f(void 0, void 0).ser(se_ConfirmSubscriptionCommand).de(de_ConfirmSubscriptionCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/CreatePlatformApplicationCommand.js
var CreatePlatformApplicationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "CreatePlatformApplication", {}).n("SNSClient", "CreatePlatformApplicationCommand").f(void 0, void 0).ser(se_CreatePlatformApplicationCommand).de(de_CreatePlatformApplicationCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/CreatePlatformEndpointCommand.js
var CreatePlatformEndpointCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "CreatePlatformEndpoint", {}).n("SNSClient", "CreatePlatformEndpointCommand").f(void 0, void 0).ser(se_CreatePlatformEndpointCommand).de(de_CreatePlatformEndpointCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/CreateSMSSandboxPhoneNumberCommand.js
var CreateSMSSandboxPhoneNumberCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "CreateSMSSandboxPhoneNumber", {}).n("SNSClient", "CreateSMSSandboxPhoneNumberCommand").f(CreateSMSSandboxPhoneNumberInputFilterSensitiveLog, void 0).ser(se_CreateSMSSandboxPhoneNumberCommand).de(de_CreateSMSSandboxPhoneNumberCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/CreateTopicCommand.js
var CreateTopicCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "CreateTopic", {}).n("SNSClient", "CreateTopicCommand").f(void 0, void 0).ser(se_CreateTopicCommand).de(de_CreateTopicCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/DeleteEndpointCommand.js
var DeleteEndpointCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "DeleteEndpoint", {}).n("SNSClient", "DeleteEndpointCommand").f(void 0, void 0).ser(se_DeleteEndpointCommand).de(de_DeleteEndpointCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/DeletePlatformApplicationCommand.js
var DeletePlatformApplicationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "DeletePlatformApplication", {}).n("SNSClient", "DeletePlatformApplicationCommand").f(void 0, void 0).ser(se_DeletePlatformApplicationCommand).de(de_DeletePlatformApplicationCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/DeleteSMSSandboxPhoneNumberCommand.js
var DeleteSMSSandboxPhoneNumberCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "DeleteSMSSandboxPhoneNumber", {}).n("SNSClient", "DeleteSMSSandboxPhoneNumberCommand").f(DeleteSMSSandboxPhoneNumberInputFilterSensitiveLog, void 0).ser(se_DeleteSMSSandboxPhoneNumberCommand).de(de_DeleteSMSSandboxPhoneNumberCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/DeleteTopicCommand.js
var DeleteTopicCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "DeleteTopic", {}).n("SNSClient", "DeleteTopicCommand").f(void 0, void 0).ser(se_DeleteTopicCommand).de(de_DeleteTopicCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/GetDataProtectionPolicyCommand.js
var GetDataProtectionPolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "GetDataProtectionPolicy", {}).n("SNSClient", "GetDataProtectionPolicyCommand").f(void 0, void 0).ser(se_GetDataProtectionPolicyCommand).de(de_GetDataProtectionPolicyCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/GetEndpointAttributesCommand.js
var GetEndpointAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "GetEndpointAttributes", {}).n("SNSClient", "GetEndpointAttributesCommand").f(void 0, void 0).ser(se_GetEndpointAttributesCommand).de(de_GetEndpointAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/GetPlatformApplicationAttributesCommand.js
var GetPlatformApplicationAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "GetPlatformApplicationAttributes", {}).n("SNSClient", "GetPlatformApplicationAttributesCommand").f(void 0, void 0).ser(se_GetPlatformApplicationAttributesCommand).de(de_GetPlatformApplicationAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/GetSMSAttributesCommand.js
var GetSMSAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "GetSMSAttributes", {}).n("SNSClient", "GetSMSAttributesCommand").f(void 0, void 0).ser(se_GetSMSAttributesCommand).de(de_GetSMSAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/GetSMSSandboxAccountStatusCommand.js
var GetSMSSandboxAccountStatusCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "GetSMSSandboxAccountStatus", {}).n("SNSClient", "GetSMSSandboxAccountStatusCommand").f(void 0, void 0).ser(se_GetSMSSandboxAccountStatusCommand).de(de_GetSMSSandboxAccountStatusCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/GetSubscriptionAttributesCommand.js
var GetSubscriptionAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "GetSubscriptionAttributes", {}).n("SNSClient", "GetSubscriptionAttributesCommand").f(void 0, void 0).ser(se_GetSubscriptionAttributesCommand).de(de_GetSubscriptionAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/GetTopicAttributesCommand.js
var GetTopicAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "GetTopicAttributes", {}).n("SNSClient", "GetTopicAttributesCommand").f(void 0, void 0).ser(se_GetTopicAttributesCommand).de(de_GetTopicAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ListEndpointsByPlatformApplicationCommand.js
var ListEndpointsByPlatformApplicationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ListEndpointsByPlatformApplication", {}).n("SNSClient", "ListEndpointsByPlatformApplicationCommand").f(void 0, void 0).ser(se_ListEndpointsByPlatformApplicationCommand).de(de_ListEndpointsByPlatformApplicationCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ListOriginationNumbersCommand.js
var ListOriginationNumbersCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ListOriginationNumbers", {}).n("SNSClient", "ListOriginationNumbersCommand").f(void 0, ListOriginationNumbersResultFilterSensitiveLog).ser(se_ListOriginationNumbersCommand).de(de_ListOriginationNumbersCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ListPhoneNumbersOptedOutCommand.js
var ListPhoneNumbersOptedOutCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ListPhoneNumbersOptedOut", {}).n("SNSClient", "ListPhoneNumbersOptedOutCommand").f(void 0, ListPhoneNumbersOptedOutResponseFilterSensitiveLog).ser(se_ListPhoneNumbersOptedOutCommand).de(de_ListPhoneNumbersOptedOutCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ListPlatformApplicationsCommand.js
var ListPlatformApplicationsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ListPlatformApplications", {}).n("SNSClient", "ListPlatformApplicationsCommand").f(void 0, void 0).ser(se_ListPlatformApplicationsCommand).de(de_ListPlatformApplicationsCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ListSMSSandboxPhoneNumbersCommand.js
var ListSMSSandboxPhoneNumbersCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ListSMSSandboxPhoneNumbers", {}).n("SNSClient", "ListSMSSandboxPhoneNumbersCommand").f(void 0, ListSMSSandboxPhoneNumbersResultFilterSensitiveLog).ser(se_ListSMSSandboxPhoneNumbersCommand).de(de_ListSMSSandboxPhoneNumbersCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ListSubscriptionsByTopicCommand.js
var ListSubscriptionsByTopicCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ListSubscriptionsByTopic", {}).n("SNSClient", "ListSubscriptionsByTopicCommand").f(void 0, void 0).ser(se_ListSubscriptionsByTopicCommand).de(de_ListSubscriptionsByTopicCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ListSubscriptionsCommand.js
var ListSubscriptionsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ListSubscriptions", {}).n("SNSClient", "ListSubscriptionsCommand").f(void 0, void 0).ser(se_ListSubscriptionsCommand).de(de_ListSubscriptionsCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ListTagsForResourceCommand.js
var ListTagsForResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ListTagsForResource", {}).n("SNSClient", "ListTagsForResourceCommand").f(void 0, void 0).ser(se_ListTagsForResourceCommand).de(de_ListTagsForResourceCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/ListTopicsCommand.js
var ListTopicsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "ListTopics", {}).n("SNSClient", "ListTopicsCommand").f(void 0, void 0).ser(se_ListTopicsCommand).de(de_ListTopicsCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/OptInPhoneNumberCommand.js
var OptInPhoneNumberCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "OptInPhoneNumber", {}).n("SNSClient", "OptInPhoneNumberCommand").f(OptInPhoneNumberInputFilterSensitiveLog, void 0).ser(se_OptInPhoneNumberCommand).de(de_OptInPhoneNumberCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/PublishBatchCommand.js
var PublishBatchCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "PublishBatch", {}).n("SNSClient", "PublishBatchCommand").f(void 0, void 0).ser(se_PublishBatchCommand).de(de_PublishBatchCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/PublishCommand.js
var PublishCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "Publish", {}).n("SNSClient", "PublishCommand").f(PublishInputFilterSensitiveLog, void 0).ser(se_PublishCommand).de(de_PublishCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/PutDataProtectionPolicyCommand.js
var PutDataProtectionPolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "PutDataProtectionPolicy", {}).n("SNSClient", "PutDataProtectionPolicyCommand").f(void 0, void 0).ser(se_PutDataProtectionPolicyCommand).de(de_PutDataProtectionPolicyCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/RemovePermissionCommand.js
var RemovePermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "RemovePermission", {}).n("SNSClient", "RemovePermissionCommand").f(void 0, void 0).ser(se_RemovePermissionCommand).de(de_RemovePermissionCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/SetEndpointAttributesCommand.js
var SetEndpointAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "SetEndpointAttributes", {}).n("SNSClient", "SetEndpointAttributesCommand").f(void 0, void 0).ser(se_SetEndpointAttributesCommand).de(de_SetEndpointAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/SetPlatformApplicationAttributesCommand.js
var SetPlatformApplicationAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "SetPlatformApplicationAttributes", {}).n("SNSClient", "SetPlatformApplicationAttributesCommand").f(void 0, void 0).ser(se_SetPlatformApplicationAttributesCommand).de(de_SetPlatformApplicationAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/SetSMSAttributesCommand.js
var SetSMSAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "SetSMSAttributes", {}).n("SNSClient", "SetSMSAttributesCommand").f(void 0, void 0).ser(se_SetSMSAttributesCommand).de(de_SetSMSAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/SetSubscriptionAttributesCommand.js
var SetSubscriptionAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "SetSubscriptionAttributes", {}).n("SNSClient", "SetSubscriptionAttributesCommand").f(void 0, void 0).ser(se_SetSubscriptionAttributesCommand).de(de_SetSubscriptionAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/SetTopicAttributesCommand.js
var SetTopicAttributesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "SetTopicAttributes", {}).n("SNSClient", "SetTopicAttributesCommand").f(void 0, void 0).ser(se_SetTopicAttributesCommand).de(de_SetTopicAttributesCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/SubscribeCommand.js
var SubscribeCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "Subscribe", {}).n("SNSClient", "SubscribeCommand").f(void 0, void 0).ser(se_SubscribeCommand).de(de_SubscribeCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/TagResourceCommand.js
var TagResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "TagResource", {}).n("SNSClient", "TagResourceCommand").f(void 0, void 0).ser(se_TagResourceCommand).de(de_TagResourceCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/UnsubscribeCommand.js
var UnsubscribeCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "Unsubscribe", {}).n("SNSClient", "UnsubscribeCommand").f(void 0, void 0).ser(se_UnsubscribeCommand).de(de_UnsubscribeCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/UntagResourceCommand.js
var UntagResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "UntagResource", {}).n("SNSClient", "UntagResourceCommand").f(void 0, void 0).ser(se_UntagResourceCommand).de(de_UntagResourceCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/commands/VerifySMSSandboxPhoneNumberCommand.js
var VerifySMSSandboxPhoneNumberCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AmazonSimpleNotificationService", "VerifySMSSandboxPhoneNumber", {}).n("SNSClient", "VerifySMSSandboxPhoneNumberCommand").f(VerifySMSSandboxPhoneNumberInputFilterSensitiveLog, void 0).ser(se_VerifySMSSandboxPhoneNumberCommand).de(de_VerifySMSSandboxPhoneNumberCommand).build() {
};

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/SNS.js
var commands = {
  AddPermissionCommand,
  CheckIfPhoneNumberIsOptedOutCommand,
  ConfirmSubscriptionCommand,
  CreatePlatformApplicationCommand,
  CreatePlatformEndpointCommand,
  CreateSMSSandboxPhoneNumberCommand,
  CreateTopicCommand,
  DeleteEndpointCommand,
  DeletePlatformApplicationCommand,
  DeleteSMSSandboxPhoneNumberCommand,
  DeleteTopicCommand,
  GetDataProtectionPolicyCommand,
  GetEndpointAttributesCommand,
  GetPlatformApplicationAttributesCommand,
  GetSMSAttributesCommand,
  GetSMSSandboxAccountStatusCommand,
  GetSubscriptionAttributesCommand,
  GetTopicAttributesCommand,
  ListEndpointsByPlatformApplicationCommand,
  ListOriginationNumbersCommand,
  ListPhoneNumbersOptedOutCommand,
  ListPlatformApplicationsCommand,
  ListSMSSandboxPhoneNumbersCommand,
  ListSubscriptionsCommand,
  ListSubscriptionsByTopicCommand,
  ListTagsForResourceCommand,
  ListTopicsCommand,
  OptInPhoneNumberCommand,
  PublishCommand,
  PublishBatchCommand,
  PutDataProtectionPolicyCommand,
  RemovePermissionCommand,
  SetEndpointAttributesCommand,
  SetPlatformApplicationAttributesCommand,
  SetSMSAttributesCommand,
  SetSubscriptionAttributesCommand,
  SetTopicAttributesCommand,
  SubscribeCommand,
  TagResourceCommand,
  UnsubscribeCommand,
  UntagResourceCommand,
  VerifySMSSandboxPhoneNumberCommand
};
var SNS = class extends SNSClient {
};
createAggregatedClient(commands, SNS);

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/pagination/ListEndpointsByPlatformApplicationPaginator.js
var paginateListEndpointsByPlatformApplication = createPaginator(SNSClient, ListEndpointsByPlatformApplicationCommand, "NextToken", "NextToken", "");

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/pagination/ListOriginationNumbersPaginator.js
var paginateListOriginationNumbers = createPaginator(SNSClient, ListOriginationNumbersCommand, "NextToken", "NextToken", "MaxResults");

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/pagination/ListPhoneNumbersOptedOutPaginator.js
var paginateListPhoneNumbersOptedOut = createPaginator(SNSClient, ListPhoneNumbersOptedOutCommand, "nextToken", "nextToken", "");

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/pagination/ListPlatformApplicationsPaginator.js
var paginateListPlatformApplications = createPaginator(SNSClient, ListPlatformApplicationsCommand, "NextToken", "NextToken", "");

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/pagination/ListSMSSandboxPhoneNumbersPaginator.js
var paginateListSMSSandboxPhoneNumbers = createPaginator(SNSClient, ListSMSSandboxPhoneNumbersCommand, "NextToken", "NextToken", "MaxResults");

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/pagination/ListSubscriptionsByTopicPaginator.js
var paginateListSubscriptionsByTopic = createPaginator(SNSClient, ListSubscriptionsByTopicCommand, "NextToken", "NextToken", "");

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/pagination/ListSubscriptionsPaginator.js
var paginateListSubscriptions = createPaginator(SNSClient, ListSubscriptionsCommand, "NextToken", "NextToken", "");

// ../../../../node_modules/@aws-sdk/client-sns/dist-es/pagination/ListTopicsPaginator.js
var paginateListTopics = createPaginator(SNSClient, ListTopicsCommand, "NextToken", "NextToken", "");
export {
  Command as $Command,
  AddPermissionCommand,
  AuthorizationErrorException,
  BatchEntryIdsNotDistinctException,
  BatchRequestTooLongException,
  CheckIfPhoneNumberIsOptedOutCommand,
  CheckIfPhoneNumberIsOptedOutInputFilterSensitiveLog,
  ConcurrentAccessException,
  ConfirmSubscriptionCommand,
  CreatePlatformApplicationCommand,
  CreatePlatformEndpointCommand,
  CreateSMSSandboxPhoneNumberCommand,
  CreateSMSSandboxPhoneNumberInputFilterSensitiveLog,
  CreateTopicCommand,
  DeleteEndpointCommand,
  DeletePlatformApplicationCommand,
  DeleteSMSSandboxPhoneNumberCommand,
  DeleteSMSSandboxPhoneNumberInputFilterSensitiveLog,
  DeleteTopicCommand,
  EmptyBatchRequestException,
  EndpointDisabledException,
  FilterPolicyLimitExceededException,
  GetDataProtectionPolicyCommand,
  GetEndpointAttributesCommand,
  GetPlatformApplicationAttributesCommand,
  GetSMSAttributesCommand,
  GetSMSSandboxAccountStatusCommand,
  GetSubscriptionAttributesCommand,
  GetTopicAttributesCommand,
  InternalErrorException,
  InvalidBatchEntryIdException,
  InvalidParameterException,
  InvalidParameterValueException,
  InvalidSecurityException,
  InvalidStateException,
  KMSAccessDeniedException,
  KMSDisabledException,
  KMSInvalidStateException,
  KMSNotFoundException,
  KMSOptInRequired,
  KMSThrottlingException,
  LanguageCodeString,
  ListEndpointsByPlatformApplicationCommand,
  ListOriginationNumbersCommand,
  ListOriginationNumbersResultFilterSensitiveLog,
  ListPhoneNumbersOptedOutCommand,
  ListPhoneNumbersOptedOutResponseFilterSensitiveLog,
  ListPlatformApplicationsCommand,
  ListSMSSandboxPhoneNumbersCommand,
  ListSMSSandboxPhoneNumbersResultFilterSensitiveLog,
  ListSubscriptionsByTopicCommand,
  ListSubscriptionsCommand,
  ListTagsForResourceCommand,
  ListTopicsCommand,
  NotFoundException,
  NumberCapability,
  OptInPhoneNumberCommand,
  OptInPhoneNumberInputFilterSensitiveLog,
  OptedOutException,
  PhoneNumberInformationFilterSensitiveLog,
  PlatformApplicationDisabledException,
  PublishBatchCommand,
  PublishCommand,
  PublishInputFilterSensitiveLog,
  PutDataProtectionPolicyCommand,
  RemovePermissionCommand,
  ReplayLimitExceededException,
  ResourceNotFoundException,
  RouteType,
  SMSSandboxPhoneNumberFilterSensitiveLog,
  SMSSandboxPhoneNumberVerificationStatus,
  SNS,
  SNSClient,
  SNSServiceException,
  SetEndpointAttributesCommand,
  SetPlatformApplicationAttributesCommand,
  SetSMSAttributesCommand,
  SetSubscriptionAttributesCommand,
  SetTopicAttributesCommand,
  StaleTagException,
  SubscribeCommand,
  SubscriptionLimitExceededException,
  TagLimitExceededException,
  TagPolicyException,
  TagResourceCommand,
  ThrottledException,
  TooManyEntriesInBatchRequestException,
  TopicLimitExceededException,
  UnsubscribeCommand,
  UntagResourceCommand,
  UserErrorException,
  ValidationException,
  VerificationException,
  VerifySMSSandboxPhoneNumberCommand,
  VerifySMSSandboxPhoneNumberInputFilterSensitiveLog,
  Client as __Client,
  paginateListEndpointsByPlatformApplication,
  paginateListOriginationNumbers,
  paginateListPhoneNumbersOptedOut,
  paginateListPlatformApplications,
  paginateListSMSSandboxPhoneNumbers,
  paginateListSubscriptions,
  paginateListSubscriptionsByTopic,
  paginateListTopics
};
//# sourceMappingURL=@aws-sdk_client-sns.js.map
