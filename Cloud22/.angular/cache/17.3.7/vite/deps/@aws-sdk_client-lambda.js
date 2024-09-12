import {
  eventStreamSerdeProvider,
  resolveEventStreamSerdeConfig
} from "./chunk-NHXG5M2F.js";
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
  NoOpLogger,
  SENSITIVE_STRING,
  ServiceException,
  Sha256,
  _json,
  awsEndpointFunctions,
  calculateBodyLength,
  collectBody,
  createAggregatedClient,
  createPaginator,
  customEndpointFunctions,
  decorateServiceException,
  defaultUserAgent,
  expectBoolean,
  expectInt32,
  expectLong,
  expectNonNull,
  expectNumber,
  expectObject,
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
  map,
  normalizeProvider,
  parseEpochTimestamp,
  parseJsonBody,
  parseJsonErrorBody,
  parseUrl,
  requestBuilder,
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
} from "./chunk-TC2ZGZ7K.js";
import "./chunk-7VQPY5UX.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-CDW57LCT.js";

// node_modules/@aws-sdk/client-lambda/dist-es/auth/httpAuthSchemeProvider.js
var defaultLambdaHttpAuthSchemeParametersProvider = (config, context, input) => __async(void 0, null, function* () {
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
      name: "lambda",
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
var defaultLambdaHttpAuthSchemeProvider = (authParameters) => {
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

// node_modules/@aws-sdk/client-lambda/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters = (options) => {
  return __spreadProps(__spreadValues({}, options), {
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "lambda"
  });
};
var commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};

// node_modules/@aws-sdk/client-lambda/package.json
var package_default = {
  name: "@aws-sdk/client-lambda",
  description: "AWS SDK for JavaScript Lambda Client for Node.js, Browser and React Native",
  version: "3.645.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "node ../../scripts/compilation/inline client-lambda",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo lambda"
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
    "@smithy/eventstream-serde-browser": "^3.0.6",
    "@smithy/eventstream-serde-config-resolver": "^3.0.3",
    "@smithy/eventstream-serde-node": "^3.0.5",
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
    "@smithy/util-stream": "^3.1.3",
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
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-lambda",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-lambda"
  }
};

// node_modules/@aws-sdk/client-lambda/dist-es/endpoint/ruleset.js
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
var _data = { version: "1.0", parameters: { Region: h, UseDualStack: i, UseFIPS: i, Endpoint: h }, rules: [{ conditions: [{ [t]: b, [u]: [j] }], rules: [{ conditions: p, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: q, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: j, properties: m, headers: m }, type: e }], type: f }, { conditions: [{ [t]: b, [u]: r }], rules: [{ conditions: [{ [t]: "aws.partition", [u]: r, assign: g }], rules: [{ conditions: [k, l], rules: [{ conditions: [{ [t]: c, [u]: [a, n] }, o], rules: [{ endpoint: { url: "https://lambda-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m, headers: m }, type: e }], type: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f }, { conditions: p, rules: [{ conditions: [{ [t]: c, [u]: [n, a] }], rules: [{ endpoint: { url: "https://lambda-fips.{Region}.{PartitionResult#dnsSuffix}", properties: m, headers: m }, type: e }], type: f }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f }, { conditions: q, rules: [{ conditions: [o], rules: [{ endpoint: { url: "https://lambda.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m, headers: m }, type: e }], type: f }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f }, { endpoint: { url: "https://lambda.{Region}.{PartitionResult#dnsSuffix}", properties: m, headers: m }, type: e }], type: f }], type: f }, { error: "Invalid Configuration: Missing Region", type: d }] };
var ruleSet = _data;

// node_modules/@aws-sdk/client-lambda/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  });
};
customEndpointFunctions.aws = awsEndpointFunctions;

// node_modules/@aws-sdk/client-lambda/dist-es/runtimeConfig.shared.js
var getRuntimeConfig = (config) => {
  return {
    apiVersion: "2015-03-31",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultLambdaHttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new AwsSdkSigV4Signer()
      }
    ],
    logger: config?.logger ?? new NoOpLogger(),
    serviceId: config?.serviceId ?? "Lambda",
    urlParser: config?.urlParser ?? parseUrl,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
};

// node_modules/@aws-sdk/client-lambda/dist-es/runtimeConfig.browser.js
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
    eventStreamSerdeProvider: config?.eventStreamSerdeProvider ?? eventStreamSerdeProvider,
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

// node_modules/@aws-sdk/client-lambda/dist-es/auth/httpAuthExtensionConfiguration.js
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

// node_modules/@aws-sdk/client-lambda/dist-es/runtimeExtensions.js
var asPartial = (t2) => t2;
var resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, asPartial(getAwsRegionExtensionConfiguration(runtimeConfig))), asPartial(getDefaultExtensionConfiguration(runtimeConfig))), asPartial(getHttpHandlerExtensionConfiguration(runtimeConfig))), asPartial(getHttpAuthExtensionConfiguration(runtimeConfig)));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, runtimeConfig), resolveAwsRegionExtensionConfiguration(extensionConfiguration)), resolveDefaultRuntimeConfig(extensionConfiguration)), resolveHttpHandlerRuntimeConfig(extensionConfiguration)), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

// node_modules/@aws-sdk/client-lambda/dist-es/LambdaClient.js
var LambdaClient = class extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig2(configuration || {});
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveRetryConfig(_config_2);
    const _config_4 = resolveRegionConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveEndpointConfig(_config_5);
    const _config_7 = resolveEventStreamSerdeConfig(_config_6);
    const _config_8 = resolveHttpAuthSchemeConfig(_config_7);
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
      httpAuthSchemeParametersProvider: defaultLambdaHttpAuthSchemeParametersProvider,
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

// node_modules/@aws-sdk/client-lambda/dist-es/models/LambdaServiceException.js
var LambdaServiceException = class _LambdaServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _LambdaServiceException.prototype);
  }
};

// node_modules/@aws-sdk/client-lambda/dist-es/models/models_0.js
var InvalidParameterValueException = class _InvalidParameterValueException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidParameterValueException",
      $fault: "client"
    }, opts));
    this.name = "InvalidParameterValueException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidParameterValueException.prototype);
    this.Type = opts.Type;
  }
};
var PolicyLengthExceededException = class _PolicyLengthExceededException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PolicyLengthExceededException",
      $fault: "client"
    }, opts));
    this.name = "PolicyLengthExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PolicyLengthExceededException.prototype);
    this.Type = opts.Type;
  }
};
var PreconditionFailedException = class _PreconditionFailedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PreconditionFailedException",
      $fault: "client"
    }, opts));
    this.name = "PreconditionFailedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PreconditionFailedException.prototype);
    this.Type = opts.Type;
  }
};
var ResourceConflictException = class _ResourceConflictException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceConflictException",
      $fault: "client"
    }, opts));
    this.name = "ResourceConflictException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceConflictException.prototype);
    this.Type = opts.Type;
  }
};
var ResourceNotFoundException = class _ResourceNotFoundException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "ResourceNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceNotFoundException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var ServiceException2 = class _ServiceException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ServiceException",
      $fault: "server"
    }, opts));
    this.name = "ServiceException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _ServiceException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var ThrottleReason = {
  CallerRateLimitExceeded: "CallerRateLimitExceeded",
  ConcurrentInvocationLimitExceeded: "ConcurrentInvocationLimitExceeded",
  ConcurrentSnapshotCreateLimitExceeded: "ConcurrentSnapshotCreateLimitExceeded",
  FunctionInvocationRateLimitExceeded: "FunctionInvocationRateLimitExceeded",
  ReservedFunctionConcurrentInvocationLimitExceeded: "ReservedFunctionConcurrentInvocationLimitExceeded",
  ReservedFunctionInvocationRateLimitExceeded: "ReservedFunctionInvocationRateLimitExceeded"
};
var TooManyRequestsException = class _TooManyRequestsException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TooManyRequestsException",
      $fault: "client"
    }, opts));
    this.name = "TooManyRequestsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TooManyRequestsException.prototype);
    this.retryAfterSeconds = opts.retryAfterSeconds;
    this.Type = opts.Type;
    this.Reason = opts.Reason;
  }
};
var FunctionUrlAuthType = {
  AWS_IAM: "AWS_IAM",
  NONE: "NONE"
};
var ApplicationLogLevel = {
  Debug: "DEBUG",
  Error: "ERROR",
  Fatal: "FATAL",
  Info: "INFO",
  Trace: "TRACE",
  Warn: "WARN"
};
var Architecture = {
  arm64: "arm64",
  x86_64: "x86_64"
};
var CodeSigningPolicy = {
  Enforce: "Enforce",
  Warn: "Warn"
};
var FullDocument = {
  Default: "Default",
  UpdateLookup: "UpdateLookup"
};
var FunctionResponseType = {
  ReportBatchItemFailures: "ReportBatchItemFailures"
};
var EndPointType = {
  KAFKA_BOOTSTRAP_SERVERS: "KAFKA_BOOTSTRAP_SERVERS"
};
var SourceAccessType = {
  BASIC_AUTH: "BASIC_AUTH",
  CLIENT_CERTIFICATE_TLS_AUTH: "CLIENT_CERTIFICATE_TLS_AUTH",
  SASL_SCRAM_256_AUTH: "SASL_SCRAM_256_AUTH",
  SASL_SCRAM_512_AUTH: "SASL_SCRAM_512_AUTH",
  SERVER_ROOT_CA_CERTIFICATE: "SERVER_ROOT_CA_CERTIFICATE",
  VIRTUAL_HOST: "VIRTUAL_HOST",
  VPC_SECURITY_GROUP: "VPC_SECURITY_GROUP",
  VPC_SUBNET: "VPC_SUBNET"
};
var EventSourcePosition = {
  AT_TIMESTAMP: "AT_TIMESTAMP",
  LATEST: "LATEST",
  TRIM_HORIZON: "TRIM_HORIZON"
};
var CodeSigningConfigNotFoundException = class _CodeSigningConfigNotFoundException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CodeSigningConfigNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "CodeSigningConfigNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CodeSigningConfigNotFoundException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var CodeStorageExceededException = class _CodeStorageExceededException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CodeStorageExceededException",
      $fault: "client"
    }, opts));
    this.name = "CodeStorageExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CodeStorageExceededException.prototype);
    this.Type = opts.Type;
  }
};
var CodeVerificationFailedException = class _CodeVerificationFailedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CodeVerificationFailedException",
      $fault: "client"
    }, opts));
    this.name = "CodeVerificationFailedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CodeVerificationFailedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var LogFormat = {
  Json: "JSON",
  Text: "Text"
};
var SystemLogLevel = {
  Debug: "DEBUG",
  Info: "INFO",
  Warn: "WARN"
};
var PackageType = {
  Image: "Image",
  Zip: "Zip"
};
var Runtime = {
  dotnet6: "dotnet6",
  dotnet8: "dotnet8",
  dotnetcore10: "dotnetcore1.0",
  dotnetcore20: "dotnetcore2.0",
  dotnetcore21: "dotnetcore2.1",
  dotnetcore31: "dotnetcore3.1",
  go1x: "go1.x",
  java11: "java11",
  java17: "java17",
  java21: "java21",
  java8: "java8",
  java8al2: "java8.al2",
  nodejs: "nodejs",
  nodejs10x: "nodejs10.x",
  nodejs12x: "nodejs12.x",
  nodejs14x: "nodejs14.x",
  nodejs16x: "nodejs16.x",
  nodejs18x: "nodejs18.x",
  nodejs20x: "nodejs20.x",
  nodejs43: "nodejs4.3",
  nodejs43edge: "nodejs4.3-edge",
  nodejs610: "nodejs6.10",
  nodejs810: "nodejs8.10",
  provided: "provided",
  providedal2: "provided.al2",
  providedal2023: "provided.al2023",
  python27: "python2.7",
  python310: "python3.10",
  python311: "python3.11",
  python312: "python3.12",
  python36: "python3.6",
  python37: "python3.7",
  python38: "python3.8",
  python39: "python3.9",
  ruby25: "ruby2.5",
  ruby27: "ruby2.7",
  ruby32: "ruby3.2",
  ruby33: "ruby3.3"
};
var SnapStartApplyOn = {
  None: "None",
  PublishedVersions: "PublishedVersions"
};
var TracingMode = {
  Active: "Active",
  PassThrough: "PassThrough"
};
var LastUpdateStatus = {
  Failed: "Failed",
  InProgress: "InProgress",
  Successful: "Successful"
};
var LastUpdateStatusReasonCode = {
  DisabledKMSKey: "DisabledKMSKey",
  EFSIOError: "EFSIOError",
  EFSMountConnectivityError: "EFSMountConnectivityError",
  EFSMountFailure: "EFSMountFailure",
  EFSMountTimeout: "EFSMountTimeout",
  EniLimitExceeded: "EniLimitExceeded",
  FunctionError: "FunctionError",
  ImageAccessDenied: "ImageAccessDenied",
  ImageDeleted: "ImageDeleted",
  InsufficientRolePermissions: "InsufficientRolePermissions",
  InternalError: "InternalError",
  InvalidConfiguration: "InvalidConfiguration",
  InvalidImage: "InvalidImage",
  InvalidRuntime: "InvalidRuntime",
  InvalidSecurityGroup: "InvalidSecurityGroup",
  InvalidStateKMSKey: "InvalidStateKMSKey",
  InvalidSubnet: "InvalidSubnet",
  InvalidZipFileException: "InvalidZipFileException",
  KMSKeyAccessDenied: "KMSKeyAccessDenied",
  KMSKeyNotFound: "KMSKeyNotFound",
  SubnetOutOfIPAddresses: "SubnetOutOfIPAddresses"
};
var SnapStartOptimizationStatus = {
  Off: "Off",
  On: "On"
};
var State = {
  Active: "Active",
  Failed: "Failed",
  Inactive: "Inactive",
  Pending: "Pending"
};
var StateReasonCode = {
  Creating: "Creating",
  DisabledKMSKey: "DisabledKMSKey",
  EFSIOError: "EFSIOError",
  EFSMountConnectivityError: "EFSMountConnectivityError",
  EFSMountFailure: "EFSMountFailure",
  EFSMountTimeout: "EFSMountTimeout",
  EniLimitExceeded: "EniLimitExceeded",
  FunctionError: "FunctionError",
  Idle: "Idle",
  ImageAccessDenied: "ImageAccessDenied",
  ImageDeleted: "ImageDeleted",
  InsufficientRolePermissions: "InsufficientRolePermissions",
  InternalError: "InternalError",
  InvalidConfiguration: "InvalidConfiguration",
  InvalidImage: "InvalidImage",
  InvalidRuntime: "InvalidRuntime",
  InvalidSecurityGroup: "InvalidSecurityGroup",
  InvalidStateKMSKey: "InvalidStateKMSKey",
  InvalidSubnet: "InvalidSubnet",
  InvalidZipFileException: "InvalidZipFileException",
  KMSKeyAccessDenied: "KMSKeyAccessDenied",
  KMSKeyNotFound: "KMSKeyNotFound",
  Restoring: "Restoring",
  SubnetOutOfIPAddresses: "SubnetOutOfIPAddresses"
};
var InvalidCodeSignatureException = class _InvalidCodeSignatureException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidCodeSignatureException",
      $fault: "client"
    }, opts));
    this.name = "InvalidCodeSignatureException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidCodeSignatureException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvokeMode = {
  BUFFERED: "BUFFERED",
  RESPONSE_STREAM: "RESPONSE_STREAM"
};
var ResourceInUseException = class _ResourceInUseException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceInUseException",
      $fault: "client"
    }, opts));
    this.name = "ResourceInUseException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceInUseException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var RecursiveLoop = {
  Allow: "Allow",
  Terminate: "Terminate"
};
var ProvisionedConcurrencyStatusEnum = {
  FAILED: "FAILED",
  IN_PROGRESS: "IN_PROGRESS",
  READY: "READY"
};
var ProvisionedConcurrencyConfigNotFoundException = class _ProvisionedConcurrencyConfigNotFoundException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ProvisionedConcurrencyConfigNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "ProvisionedConcurrencyConfigNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ProvisionedConcurrencyConfigNotFoundException.prototype);
    this.Type = opts.Type;
  }
};
var UpdateRuntimeOn = {
  Auto: "Auto",
  FunctionUpdate: "FunctionUpdate",
  Manual: "Manual"
};
var EC2AccessDeniedException = class _EC2AccessDeniedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EC2AccessDeniedException",
      $fault: "server"
    }, opts));
    this.name = "EC2AccessDeniedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _EC2AccessDeniedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EC2ThrottledException = class _EC2ThrottledException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EC2ThrottledException",
      $fault: "server"
    }, opts));
    this.name = "EC2ThrottledException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _EC2ThrottledException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EC2UnexpectedException = class _EC2UnexpectedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EC2UnexpectedException",
      $fault: "server"
    }, opts));
    this.name = "EC2UnexpectedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _EC2UnexpectedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
    this.EC2ErrorCode = opts.EC2ErrorCode;
  }
};
var EFSIOException = class _EFSIOException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EFSIOException",
      $fault: "client"
    }, opts));
    this.name = "EFSIOException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EFSIOException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EFSMountConnectivityException = class _EFSMountConnectivityException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EFSMountConnectivityException",
      $fault: "client"
    }, opts));
    this.name = "EFSMountConnectivityException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EFSMountConnectivityException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EFSMountFailureException = class _EFSMountFailureException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EFSMountFailureException",
      $fault: "client"
    }, opts));
    this.name = "EFSMountFailureException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EFSMountFailureException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EFSMountTimeoutException = class _EFSMountTimeoutException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EFSMountTimeoutException",
      $fault: "client"
    }, opts));
    this.name = "EFSMountTimeoutException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EFSMountTimeoutException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var ENILimitReachedException = class _ENILimitReachedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ENILimitReachedException",
      $fault: "server"
    }, opts));
    this.name = "ENILimitReachedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _ENILimitReachedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvalidRequestContentException = class _InvalidRequestContentException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidRequestContentException",
      $fault: "client"
    }, opts));
    this.name = "InvalidRequestContentException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidRequestContentException.prototype);
    this.Type = opts.Type;
  }
};
var InvalidRuntimeException = class _InvalidRuntimeException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidRuntimeException",
      $fault: "server"
    }, opts));
    this.name = "InvalidRuntimeException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InvalidRuntimeException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvalidSecurityGroupIDException = class _InvalidSecurityGroupIDException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidSecurityGroupIDException",
      $fault: "server"
    }, opts));
    this.name = "InvalidSecurityGroupIDException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InvalidSecurityGroupIDException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvalidSubnetIDException = class _InvalidSubnetIDException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidSubnetIDException",
      $fault: "server"
    }, opts));
    this.name = "InvalidSubnetIDException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InvalidSubnetIDException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvalidZipFileException = class _InvalidZipFileException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidZipFileException",
      $fault: "server"
    }, opts));
    this.name = "InvalidZipFileException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InvalidZipFileException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvocationType = {
  DryRun: "DryRun",
  Event: "Event",
  RequestResponse: "RequestResponse"
};
var LogType = {
  None: "None",
  Tail: "Tail"
};
var KMSAccessDeniedException = class _KMSAccessDeniedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSAccessDeniedException",
      $fault: "server"
    }, opts));
    this.name = "KMSAccessDeniedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _KMSAccessDeniedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var KMSDisabledException = class _KMSDisabledException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSDisabledException",
      $fault: "server"
    }, opts));
    this.name = "KMSDisabledException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _KMSDisabledException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var KMSInvalidStateException = class _KMSInvalidStateException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSInvalidStateException",
      $fault: "server"
    }, opts));
    this.name = "KMSInvalidStateException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _KMSInvalidStateException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var KMSNotFoundException = class _KMSNotFoundException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSNotFoundException",
      $fault: "server"
    }, opts));
    this.name = "KMSNotFoundException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _KMSNotFoundException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var RecursiveInvocationException = class _RecursiveInvocationException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "RecursiveInvocationException",
      $fault: "client"
    }, opts));
    this.name = "RecursiveInvocationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _RecursiveInvocationException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var RequestTooLargeException = class _RequestTooLargeException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "RequestTooLargeException",
      $fault: "client"
    }, opts));
    this.name = "RequestTooLargeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _RequestTooLargeException.prototype);
    this.Type = opts.Type;
  }
};
var ResourceNotReadyException = class _ResourceNotReadyException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceNotReadyException",
      $fault: "server"
    }, opts));
    this.name = "ResourceNotReadyException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _ResourceNotReadyException.prototype);
    this.Type = opts.Type;
  }
};
var SnapStartException = class _SnapStartException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SnapStartException",
      $fault: "client"
    }, opts));
    this.name = "SnapStartException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SnapStartException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var SnapStartNotReadyException = class _SnapStartNotReadyException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SnapStartNotReadyException",
      $fault: "client"
    }, opts));
    this.name = "SnapStartNotReadyException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SnapStartNotReadyException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var SnapStartTimeoutException = class _SnapStartTimeoutException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SnapStartTimeoutException",
      $fault: "client"
    }, opts));
    this.name = "SnapStartTimeoutException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SnapStartTimeoutException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var SubnetIPAddressLimitReachedException = class _SubnetIPAddressLimitReachedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SubnetIPAddressLimitReachedException",
      $fault: "server"
    }, opts));
    this.name = "SubnetIPAddressLimitReachedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _SubnetIPAddressLimitReachedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var UnsupportedMediaTypeException = class _UnsupportedMediaTypeException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UnsupportedMediaTypeException",
      $fault: "client"
    }, opts));
    this.name = "UnsupportedMediaTypeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnsupportedMediaTypeException.prototype);
    this.Type = opts.Type;
  }
};
var ResponseStreamingInvocationType = {
  DryRun: "DryRun",
  RequestResponse: "RequestResponse"
};
var InvokeWithResponseStreamResponseEvent;
(function(InvokeWithResponseStreamResponseEvent2) {
  InvokeWithResponseStreamResponseEvent2.visit = (value, visitor) => {
    if (value.PayloadChunk !== void 0)
      return visitor.PayloadChunk(value.PayloadChunk);
    if (value.InvokeComplete !== void 0)
      return visitor.InvokeComplete(value.InvokeComplete);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(InvokeWithResponseStreamResponseEvent || (InvokeWithResponseStreamResponseEvent = {}));
var FunctionVersion = {
  ALL: "ALL"
};
var FunctionCodeFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ZipFile && { ZipFile: SENSITIVE_STRING });
var EnvironmentFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Variables && { Variables: SENSITIVE_STRING });
var CreateFunctionRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Code && { Code: FunctionCodeFilterSensitiveLog(obj.Code) }), obj.Environment && { Environment: EnvironmentFilterSensitiveLog(obj.Environment) });
var EnvironmentErrorFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Message && { Message: SENSITIVE_STRING });
var EnvironmentResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Variables && { Variables: SENSITIVE_STRING }), obj.Error && { Error: EnvironmentErrorFilterSensitiveLog(obj.Error) });
var ImageConfigErrorFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Message && { Message: SENSITIVE_STRING });
var ImageConfigResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Error && { Error: ImageConfigErrorFilterSensitiveLog(obj.Error) });
var RuntimeVersionErrorFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Message && { Message: SENSITIVE_STRING });
var RuntimeVersionConfigFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Error && { Error: RuntimeVersionErrorFilterSensitiveLog(obj.Error) });
var FunctionConfigurationFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.Environment && { Environment: EnvironmentResponseFilterSensitiveLog(obj.Environment) }), obj.ImageConfigResponse && {
  ImageConfigResponse: ImageConfigResponseFilterSensitiveLog(obj.ImageConfigResponse)
}), obj.RuntimeVersionConfig && {
  RuntimeVersionConfig: RuntimeVersionConfigFilterSensitiveLog(obj.RuntimeVersionConfig)
});
var GetFunctionResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Configuration && { Configuration: FunctionConfigurationFilterSensitiveLog(obj.Configuration) });
var InvocationRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Payload && { Payload: SENSITIVE_STRING });
var InvocationResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Payload && { Payload: SENSITIVE_STRING });
var InvokeAsyncRequestFilterSensitiveLog = (obj) => __spreadValues({}, obj);
var InvokeWithResponseStreamRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Payload && { Payload: SENSITIVE_STRING });
var InvokeResponseStreamUpdateFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Payload && { Payload: SENSITIVE_STRING });
var InvokeWithResponseStreamResponseEventFilterSensitiveLog = (obj) => {
  if (obj.PayloadChunk !== void 0)
    return { PayloadChunk: InvokeResponseStreamUpdateFilterSensitiveLog(obj.PayloadChunk) };
  if (obj.InvokeComplete !== void 0)
    return { InvokeComplete: obj.InvokeComplete };
  if (obj.$unknown !== void 0)
    return { [obj.$unknown[0]]: "UNKNOWN" };
};
var InvokeWithResponseStreamResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.EventStream && { EventStream: "STREAMING_CONTENT" });
var ListFunctionsResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Functions && { Functions: obj.Functions.map((item) => FunctionConfigurationFilterSensitiveLog(item)) });
var ListVersionsByFunctionResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Versions && { Versions: obj.Versions.map((item) => FunctionConfigurationFilterSensitiveLog(item)) });
var LayerVersionContentInputFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ZipFile && { ZipFile: SENSITIVE_STRING });
var PublishLayerVersionRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Content && { Content: LayerVersionContentInputFilterSensitiveLog(obj.Content) });
var UpdateFunctionCodeRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ZipFile && { ZipFile: SENSITIVE_STRING });
var UpdateFunctionConfigurationRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Environment && { Environment: EnvironmentFilterSensitiveLog(obj.Environment) });

// node_modules/@aws-sdk/client-lambda/dist-es/protocols/Aws_restJson1.js
var se_AddLayerVersionPermissionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  const query = map({
    [_RI]: [, input[_RI]]
  });
  let body;
  body = JSON.stringify(take(input, {
    Action: [],
    OrganizationId: [],
    Principal: [],
    StatementId: []
  }));
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_AddPermissionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/policy");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    Action: [],
    EventSourceToken: [],
    FunctionUrlAuthType: [],
    Principal: [],
    PrincipalOrgID: [],
    RevisionId: [],
    SourceAccount: [],
    SourceArn: [],
    StatementId: []
  }));
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_CreateAliasCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    Description: [],
    FunctionVersion: [],
    Name: [],
    RoutingConfig: (_) => se_AliasRoutingConfiguration(_, context)
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_CreateCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2020-04-22/code-signing-configs");
  let body;
  body = JSON.stringify(take(input, {
    AllowedPublishers: (_) => _json(_),
    CodeSigningPolicies: (_) => _json(_),
    Description: []
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_CreateEventSourceMappingCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/event-source-mappings");
  let body;
  body = JSON.stringify(take(input, {
    AmazonManagedKafkaEventSourceConfig: (_) => _json(_),
    BatchSize: [],
    BisectBatchOnFunctionError: [],
    DestinationConfig: (_) => _json(_),
    DocumentDBEventSourceConfig: (_) => _json(_),
    Enabled: [],
    EventSourceArn: [],
    FilterCriteria: (_) => _json(_),
    FunctionName: [],
    FunctionResponseTypes: (_) => _json(_),
    KMSKeyArn: [],
    MaximumBatchingWindowInSeconds: [],
    MaximumRecordAgeInSeconds: [],
    MaximumRetryAttempts: [],
    ParallelizationFactor: [],
    Queues: (_) => _json(_),
    ScalingConfig: (_) => _json(_),
    SelfManagedEventSource: (_) => _json(_),
    SelfManagedKafkaEventSourceConfig: (_) => _json(_),
    SourceAccessConfigurations: (_) => _json(_),
    StartingPosition: [],
    StartingPositionTimestamp: (_) => _.getTime() / 1e3,
    Topics: (_) => _json(_),
    TumblingWindowInSeconds: []
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_CreateFunctionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions");
  let body;
  body = JSON.stringify(take(input, {
    Architectures: (_) => _json(_),
    Code: (_) => se_FunctionCode(_, context),
    CodeSigningConfigArn: [],
    DeadLetterConfig: (_) => _json(_),
    Description: [],
    Environment: (_) => _json(_),
    EphemeralStorage: (_) => _json(_),
    FileSystemConfigs: (_) => _json(_),
    FunctionName: [],
    Handler: [],
    ImageConfig: (_) => _json(_),
    KMSKeyArn: [],
    Layers: (_) => _json(_),
    LoggingConfig: (_) => _json(_),
    MemorySize: [],
    PackageType: [],
    Publish: [],
    Role: [],
    Runtime: [],
    SnapStart: (_) => _json(_),
    Tags: (_) => _json(_),
    Timeout: [],
    TracingConfig: (_) => _json(_),
    VpcConfig: (_) => _json(_)
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_CreateFunctionUrlConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2021-10-31/functions/{FunctionName}/url");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    AuthType: [],
    Cors: (_) => _json(_),
    InvokeMode: []
  }));
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_DeleteAliasCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases/{Name}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  b2.p("Name", () => input.Name, "{Name}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}");
  b2.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteEventSourceMappingCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/event-source-mappings/{UUID}");
  b2.p("UUID", () => input.UUID, "{UUID}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteFunctionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_DeleteFunctionCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-06-30/functions/{FunctionName}/code-signing-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteFunctionConcurrencyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2017-10-31/functions/{FunctionName}/concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteFunctionEventInvokeConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_DeleteFunctionUrlConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2021-10-31/functions/{FunctionName}/url");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_DeleteLayerVersionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteProvisionedConcurrencyConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, expectNonNull(input[_Q], `Qualifier`)]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetAccountSettingsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2016-08-19/account-settings");
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetAliasCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases/{Name}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  b2.p("Name", () => input.Name, "{Name}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}");
  b2.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetEventSourceMappingCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/event-source-mappings/{UUID}");
  b2.p("UUID", () => input.UUID, "{UUID}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetFunctionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetFunctionCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-06-30/functions/{FunctionName}/code-signing-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetFunctionConcurrencyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-30/functions/{FunctionName}/concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetFunctionConfigurationCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/configuration");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetFunctionEventInvokeConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetFunctionRecursionConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2024-08-31/functions/{FunctionName}/recursion-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetFunctionUrlConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2021-10-31/functions/{FunctionName}/url");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetLayerVersionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetLayerVersionByArnCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers");
  const query = map({
    [_f]: [, "LayerVersion"],
    [_A]: [, expectNonNull(input[_A], `Arn`)]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetLayerVersionPolicyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetPolicyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/policy");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetProvisionedConcurrencyConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, expectNonNull(input[_Q], `Qualifier`)]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetRuntimeManagementConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2021-07-20/functions/{FunctionName}/runtime-management-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_InvokeCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    "content-type": "application/octet-stream",
    [_xait]: input[_IT],
    [_xalt]: input[_LT],
    [_xacc]: input[_CC]
  });
  b2.bp("/2015-03-31/functions/{FunctionName}/invocations");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  if (input.Payload !== void 0) {
    body = input.Payload;
  }
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_InvokeAsyncCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/octet-stream"
  };
  b2.bp("/2014-11-13/functions/{FunctionName}/invoke-async");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  if (input.InvokeArgs !== void 0) {
    body = input.InvokeArgs;
  }
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_InvokeWithResponseStreamCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    "content-type": "application/octet-stream",
    [_xait]: input[_IT],
    [_xalt]: input[_LT],
    [_xacc]: input[_CC]
  });
  b2.bp("/2021-11-15/functions/{FunctionName}/response-streaming-invocations");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  if (input.Payload !== void 0) {
    body = input.Payload;
  }
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListAliasesCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_FV]: [, input[_FV]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListCodeSigningConfigsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-04-22/code-signing-configs");
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListEventSourceMappingsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/event-source-mappings");
  const query = map({
    [_ESA]: [, input[_ESA]],
    [_FN]: [, input[_FN]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListFunctionEventInvokeConfigsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config/list");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListFunctionsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions");
  const query = map({
    [_MR]: [, input[_MR]],
    [_FV]: [, input[_FV]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListFunctionsByCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}/functions");
  b2.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListFunctionUrlConfigsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2021-10-31/functions/{FunctionName}/urls");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListLayersCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers");
  const query = map({
    [_CR]: [, input[_CR]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    [_CA]: [, input[_CA]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListLayerVersionsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  const query = map({
    [_CR]: [, input[_CR]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    [_CA]: [, input[_CA]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListProvisionedConcurrencyConfigsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_L]: [, "ALL"],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListTagsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2017-03-31/tags/{Resource}");
  b2.p("Resource", () => input.Resource, "{Resource}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_ListVersionsByFunctionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/versions");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_PublishLayerVersionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2018-10-31/layers/{LayerName}/versions");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  let body;
  body = JSON.stringify(take(input, {
    CompatibleArchitectures: (_) => _json(_),
    CompatibleRuntimes: (_) => _json(_),
    Content: (_) => se_LayerVersionContentInput(_, context),
    Description: [],
    LicenseInfo: []
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_PublishVersionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/versions");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    CodeSha256: [],
    Description: [],
    RevisionId: []
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_PutFunctionCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2020-06-30/functions/{FunctionName}/code-signing-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    CodeSigningConfigArn: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_PutFunctionConcurrencyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2017-10-31/functions/{FunctionName}/concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    ReservedConcurrentExecutions: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_PutFunctionEventInvokeConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    DestinationConfig: (_) => _json(_),
    MaximumEventAgeInSeconds: [],
    MaximumRetryAttempts: []
  }));
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
});
var se_PutFunctionRecursionConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2024-08-31/functions/{FunctionName}/recursion-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    RecursiveLoop: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_PutProvisionedConcurrencyConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, expectNonNull(input[_Q], `Qualifier`)]
  });
  let body;
  body = JSON.stringify(take(input, {
    ProvisionedConcurrentExecutions: []
  }));
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
});
var se_PutRuntimeManagementConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2021-07-20/functions/{FunctionName}/runtime-management-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    RuntimeVersionArn: [],
    UpdateRuntimeOn: []
  }));
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
});
var se_RemoveLayerVersionPermissionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy/{StatementId}");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  b2.p("StatementId", () => input.StatementId, "{StatementId}", false);
  const query = map({
    [_RI]: [, input[_RI]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_RemovePermissionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/policy/{StatementId}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  b2.p("StatementId", () => input.StatementId, "{StatementId}", false);
  const query = map({
    [_Q]: [, input[_Q]],
    [_RI]: [, input[_RI]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_TagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2017-03-31/tags/{Resource}");
  b2.p("Resource", () => input.Resource, "{Resource}", false);
  let body;
  body = JSON.stringify(take(input, {
    Tags: (_) => _json(_)
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_UntagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2017-03-31/tags/{Resource}");
  b2.p("Resource", () => input.Resource, "{Resource}", false);
  const query = map({
    [_tK]: [
      expectNonNull(input.TagKeys, `TagKeys`) != null,
      () => (input[_TK] || []).map((_entry) => _entry)
    ]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_UpdateAliasCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases/{Name}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  b2.p("Name", () => input.Name, "{Name}", false);
  let body;
  body = JSON.stringify(take(input, {
    Description: [],
    FunctionVersion: [],
    RevisionId: [],
    RoutingConfig: (_) => se_AliasRoutingConfiguration(_, context)
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}");
  b2.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
  let body;
  body = JSON.stringify(take(input, {
    AllowedPublishers: (_) => _json(_),
    CodeSigningPolicies: (_) => _json(_),
    Description: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateEventSourceMappingCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/event-source-mappings/{UUID}");
  b2.p("UUID", () => input.UUID, "{UUID}", false);
  let body;
  body = JSON.stringify(take(input, {
    BatchSize: [],
    BisectBatchOnFunctionError: [],
    DestinationConfig: (_) => _json(_),
    DocumentDBEventSourceConfig: (_) => _json(_),
    Enabled: [],
    FilterCriteria: (_) => _json(_),
    FunctionName: [],
    FunctionResponseTypes: (_) => _json(_),
    KMSKeyArn: [],
    MaximumBatchingWindowInSeconds: [],
    MaximumRecordAgeInSeconds: [],
    MaximumRetryAttempts: [],
    ParallelizationFactor: [],
    ScalingConfig: (_) => _json(_),
    SourceAccessConfigurations: (_) => _json(_),
    TumblingWindowInSeconds: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateFunctionCodeCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/code");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    Architectures: (_) => _json(_),
    DryRun: [],
    ImageUri: [],
    Publish: [],
    RevisionId: [],
    S3Bucket: [],
    S3Key: [],
    S3ObjectVersion: [],
    ZipFile: (_) => context.base64Encoder(_)
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateFunctionConfigurationCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/configuration");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    DeadLetterConfig: (_) => _json(_),
    Description: [],
    Environment: (_) => _json(_),
    EphemeralStorage: (_) => _json(_),
    FileSystemConfigs: (_) => _json(_),
    Handler: [],
    ImageConfig: (_) => _json(_),
    KMSKeyArn: [],
    Layers: (_) => _json(_),
    LoggingConfig: (_) => _json(_),
    MemorySize: [],
    RevisionId: [],
    Role: [],
    Runtime: [],
    SnapStart: (_) => _json(_),
    Timeout: [],
    TracingConfig: (_) => _json(_),
    VpcConfig: (_) => _json(_)
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateFunctionEventInvokeConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    DestinationConfig: (_) => _json(_),
    MaximumEventAgeInSeconds: [],
    MaximumRetryAttempts: []
  }));
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_UpdateFunctionUrlConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2021-10-31/functions/{FunctionName}/url");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    AuthType: [],
    Cors: (_) => _json(_),
    InvokeMode: []
  }));
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
});
var de_AddLayerVersionPermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    RevisionId: expectString,
    Statement: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_AddPermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Statement: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateAliasCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AliasArn: expectString,
    Description: expectString,
    FunctionVersion: expectString,
    Name: expectString,
    RevisionId: expectString,
    RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context)
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateEventSourceMappingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateFunctionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateFunctionUrlConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AuthType: expectString,
    Cors: _json,
    CreationTime: expectString,
    FunctionArn: expectString,
    FunctionUrl: expectString,
    InvokeMode: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_DeleteAliasCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteEventSourceMappingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_DeleteFunctionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteFunctionCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteFunctionConcurrencyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteFunctionEventInvokeConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteFunctionUrlConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteLayerVersionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteProvisionedConcurrencyConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_GetAccountSettingsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AccountLimit: _json,
    AccountUsage: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetAliasCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AliasArn: expectString,
    Description: expectString,
    FunctionVersion: expectString,
    Name: expectString,
    RevisionId: expectString,
    RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context)
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetEventSourceMappingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Code: _json,
    Concurrency: _json,
    Configuration: _json,
    Tags: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfigArn: expectString,
    FunctionName: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionConcurrencyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    ReservedConcurrentExecutions: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionConfigurationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionEventInvokeConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    DestinationConfig: _json,
    FunctionArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    MaximumEventAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionRecursionConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    RecursiveLoop: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionUrlConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AuthType: expectString,
    Cors: _json,
    CreationTime: expectString,
    FunctionArn: expectString,
    FunctionUrl: expectString,
    InvokeMode: expectString,
    LastModifiedTime: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetLayerVersionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CompatibleArchitectures: _json,
    CompatibleRuntimes: _json,
    Content: _json,
    CreatedDate: expectString,
    Description: expectString,
    LayerArn: expectString,
    LayerVersionArn: expectString,
    LicenseInfo: expectString,
    Version: expectLong
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetLayerVersionByArnCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CompatibleArchitectures: _json,
    CompatibleRuntimes: _json,
    Content: _json,
    CreatedDate: expectString,
    Description: expectString,
    LayerArn: expectString,
    LayerVersionArn: expectString,
    LicenseInfo: expectString,
    Version: expectLong
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetLayerVersionPolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Policy: expectString,
    RevisionId: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetPolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Policy: expectString,
    RevisionId: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetProvisionedConcurrencyConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AllocatedProvisionedConcurrentExecutions: expectInt32,
    AvailableProvisionedConcurrentExecutions: expectInt32,
    LastModified: expectString,
    RequestedProvisionedConcurrentExecutions: expectInt32,
    Status: expectString,
    StatusReason: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetRuntimeManagementConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionArn: expectString,
    RuntimeVersionArn: expectString,
    UpdateRuntimeOn: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_InvokeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output),
    [_FE]: [, output.headers[_xafe]],
    [_LR]: [, output.headers[_xalr]],
    [_EV]: [, output.headers[_xaev]]
  });
  const data = yield collectBody(output.body, context);
  contents.Payload = data;
  map(contents, {
    StatusCode: [, output.statusCode]
  });
  return contents;
});
var de_InvokeAsyncCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  map(contents, {
    Status: [, output.statusCode]
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_InvokeWithResponseStreamCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output),
    [_EV]: [, output.headers[_xaev]],
    [_RSCT]: [, output.headers[_ct]]
  });
  const data = output.body;
  contents.EventStream = de_InvokeWithResponseStreamResponseEvent(data, context);
  map(contents, {
    StatusCode: [, output.statusCode]
  });
  return contents;
});
var de_ListAliasesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Aliases: (_) => de_AliasList(_, context),
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListCodeSigningConfigsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfigs: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListEventSourceMappingsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    EventSourceMappings: (_) => de_EventSourceMappingsList(_, context),
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListFunctionEventInvokeConfigsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionEventInvokeConfigs: (_) => de_FunctionEventInvokeConfigList(_, context),
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListFunctionsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Functions: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListFunctionsByCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionArns: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListFunctionUrlConfigsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionUrlConfigs: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListLayersCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Layers: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListLayerVersionsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    LayerVersions: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListProvisionedConcurrencyConfigsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    NextMarker: expectString,
    ProvisionedConcurrencyConfigs: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListTagsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Tags: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListVersionsByFunctionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    NextMarker: expectString,
    Versions: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PublishLayerVersionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CompatibleArchitectures: _json,
    CompatibleRuntimes: _json,
    Content: _json,
    CreatedDate: expectString,
    Description: expectString,
    LayerArn: expectString,
    LayerVersionArn: expectString,
    LicenseInfo: expectString,
    Version: expectLong
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PublishVersionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutFunctionCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfigArn: expectString,
    FunctionName: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutFunctionConcurrencyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    ReservedConcurrentExecutions: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutFunctionEventInvokeConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    DestinationConfig: _json,
    FunctionArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    MaximumEventAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutFunctionRecursionConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    RecursiveLoop: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutProvisionedConcurrencyConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AllocatedProvisionedConcurrentExecutions: expectInt32,
    AvailableProvisionedConcurrentExecutions: expectInt32,
    LastModified: expectString,
    RequestedProvisionedConcurrentExecutions: expectInt32,
    Status: expectString,
    StatusReason: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutRuntimeManagementConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionArn: expectString,
    RuntimeVersionArn: expectString,
    UpdateRuntimeOn: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_RemoveLayerVersionPermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_RemovePermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_TagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_UntagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_UpdateAliasCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AliasArn: expectString,
    Description: expectString,
    FunctionVersion: expectString,
    Name: expectString,
    RevisionId: expectString,
    RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context)
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateEventSourceMappingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateFunctionCodeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateFunctionConfigurationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateFunctionEventInvokeConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    DestinationConfig: _json,
    FunctionArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    MaximumEventAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateFunctionUrlConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AuthType: expectString,
    Cors: _json,
    CreationTime: expectString,
    FunctionArn: expectString,
    FunctionUrl: expectString,
    InvokeMode: expectString,
    LastModifiedTime: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CommandError = (output, context) => __async(void 0, null, function* () {
  const parsedOutput = __spreadProps(__spreadValues({}, output), {
    body: yield parseJsonErrorBody(output.body, context)
  });
  const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "InvalidParameterValueException":
    case "com.amazonaws.lambda#InvalidParameterValueException":
      throw yield de_InvalidParameterValueExceptionRes(parsedOutput, context);
    case "PolicyLengthExceededException":
    case "com.amazonaws.lambda#PolicyLengthExceededException":
      throw yield de_PolicyLengthExceededExceptionRes(parsedOutput, context);
    case "PreconditionFailedException":
    case "com.amazonaws.lambda#PreconditionFailedException":
      throw yield de_PreconditionFailedExceptionRes(parsedOutput, context);
    case "ResourceConflictException":
    case "com.amazonaws.lambda#ResourceConflictException":
      throw yield de_ResourceConflictExceptionRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.lambda#ResourceNotFoundException":
      throw yield de_ResourceNotFoundExceptionRes(parsedOutput, context);
    case "ServiceException":
    case "com.amazonaws.lambda#ServiceException":
      throw yield de_ServiceExceptionRes(parsedOutput, context);
    case "TooManyRequestsException":
    case "com.amazonaws.lambda#TooManyRequestsException":
      throw yield de_TooManyRequestsExceptionRes(parsedOutput, context);
    case "CodeSigningConfigNotFoundException":
    case "com.amazonaws.lambda#CodeSigningConfigNotFoundException":
      throw yield de_CodeSigningConfigNotFoundExceptionRes(parsedOutput, context);
    case "CodeStorageExceededException":
    case "com.amazonaws.lambda#CodeStorageExceededException":
      throw yield de_CodeStorageExceededExceptionRes(parsedOutput, context);
    case "CodeVerificationFailedException":
    case "com.amazonaws.lambda#CodeVerificationFailedException":
      throw yield de_CodeVerificationFailedExceptionRes(parsedOutput, context);
    case "InvalidCodeSignatureException":
    case "com.amazonaws.lambda#InvalidCodeSignatureException":
      throw yield de_InvalidCodeSignatureExceptionRes(parsedOutput, context);
    case "ResourceInUseException":
    case "com.amazonaws.lambda#ResourceInUseException":
      throw yield de_ResourceInUseExceptionRes(parsedOutput, context);
    case "ProvisionedConcurrencyConfigNotFoundException":
    case "com.amazonaws.lambda#ProvisionedConcurrencyConfigNotFoundException":
      throw yield de_ProvisionedConcurrencyConfigNotFoundExceptionRes(parsedOutput, context);
    case "EC2AccessDeniedException":
    case "com.amazonaws.lambda#EC2AccessDeniedException":
      throw yield de_EC2AccessDeniedExceptionRes(parsedOutput, context);
    case "EC2ThrottledException":
    case "com.amazonaws.lambda#EC2ThrottledException":
      throw yield de_EC2ThrottledExceptionRes(parsedOutput, context);
    case "EC2UnexpectedException":
    case "com.amazonaws.lambda#EC2UnexpectedException":
      throw yield de_EC2UnexpectedExceptionRes(parsedOutput, context);
    case "EFSIOException":
    case "com.amazonaws.lambda#EFSIOException":
      throw yield de_EFSIOExceptionRes(parsedOutput, context);
    case "EFSMountConnectivityException":
    case "com.amazonaws.lambda#EFSMountConnectivityException":
      throw yield de_EFSMountConnectivityExceptionRes(parsedOutput, context);
    case "EFSMountFailureException":
    case "com.amazonaws.lambda#EFSMountFailureException":
      throw yield de_EFSMountFailureExceptionRes(parsedOutput, context);
    case "EFSMountTimeoutException":
    case "com.amazonaws.lambda#EFSMountTimeoutException":
      throw yield de_EFSMountTimeoutExceptionRes(parsedOutput, context);
    case "ENILimitReachedException":
    case "com.amazonaws.lambda#ENILimitReachedException":
      throw yield de_ENILimitReachedExceptionRes(parsedOutput, context);
    case "InvalidRequestContentException":
    case "com.amazonaws.lambda#InvalidRequestContentException":
      throw yield de_InvalidRequestContentExceptionRes(parsedOutput, context);
    case "InvalidRuntimeException":
    case "com.amazonaws.lambda#InvalidRuntimeException":
      throw yield de_InvalidRuntimeExceptionRes(parsedOutput, context);
    case "InvalidSecurityGroupIDException":
    case "com.amazonaws.lambda#InvalidSecurityGroupIDException":
      throw yield de_InvalidSecurityGroupIDExceptionRes(parsedOutput, context);
    case "InvalidSubnetIDException":
    case "com.amazonaws.lambda#InvalidSubnetIDException":
      throw yield de_InvalidSubnetIDExceptionRes(parsedOutput, context);
    case "InvalidZipFileException":
    case "com.amazonaws.lambda#InvalidZipFileException":
      throw yield de_InvalidZipFileExceptionRes(parsedOutput, context);
    case "KMSAccessDeniedException":
    case "com.amazonaws.lambda#KMSAccessDeniedException":
      throw yield de_KMSAccessDeniedExceptionRes(parsedOutput, context);
    case "KMSDisabledException":
    case "com.amazonaws.lambda#KMSDisabledException":
      throw yield de_KMSDisabledExceptionRes(parsedOutput, context);
    case "KMSInvalidStateException":
    case "com.amazonaws.lambda#KMSInvalidStateException":
      throw yield de_KMSInvalidStateExceptionRes(parsedOutput, context);
    case "KMSNotFoundException":
    case "com.amazonaws.lambda#KMSNotFoundException":
      throw yield de_KMSNotFoundExceptionRes(parsedOutput, context);
    case "RecursiveInvocationException":
    case "com.amazonaws.lambda#RecursiveInvocationException":
      throw yield de_RecursiveInvocationExceptionRes(parsedOutput, context);
    case "RequestTooLargeException":
    case "com.amazonaws.lambda#RequestTooLargeException":
      throw yield de_RequestTooLargeExceptionRes(parsedOutput, context);
    case "ResourceNotReadyException":
    case "com.amazonaws.lambda#ResourceNotReadyException":
      throw yield de_ResourceNotReadyExceptionRes(parsedOutput, context);
    case "SnapStartException":
    case "com.amazonaws.lambda#SnapStartException":
      throw yield de_SnapStartExceptionRes(parsedOutput, context);
    case "SnapStartNotReadyException":
    case "com.amazonaws.lambda#SnapStartNotReadyException":
      throw yield de_SnapStartNotReadyExceptionRes(parsedOutput, context);
    case "SnapStartTimeoutException":
    case "com.amazonaws.lambda#SnapStartTimeoutException":
      throw yield de_SnapStartTimeoutExceptionRes(parsedOutput, context);
    case "SubnetIPAddressLimitReachedException":
    case "com.amazonaws.lambda#SubnetIPAddressLimitReachedException":
      throw yield de_SubnetIPAddressLimitReachedExceptionRes(parsedOutput, context);
    case "UnsupportedMediaTypeException":
    case "com.amazonaws.lambda#UnsupportedMediaTypeException":
      throw yield de_UnsupportedMediaTypeExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError({
        output,
        parsedBody,
        errorCode
      });
  }
});
var throwDefaultError = withBaseException(LambdaServiceException);
var de_CodeSigningConfigNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new CodeSigningConfigNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_CodeStorageExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new CodeStorageExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_CodeVerificationFailedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new CodeVerificationFailedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EC2AccessDeniedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EC2AccessDeniedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EC2ThrottledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EC2ThrottledException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EC2UnexpectedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    EC2ErrorCode: expectString,
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EC2UnexpectedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EFSIOExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EFSIOException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EFSMountConnectivityExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EFSMountConnectivityException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EFSMountFailureExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EFSMountFailureException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EFSMountTimeoutExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EFSMountTimeoutException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ENILimitReachedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new ENILimitReachedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidCodeSignatureExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidCodeSignatureException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidParameterValueExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidParameterValueException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidRequestContentExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRequestContentException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidRuntimeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRuntimeException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidSecurityGroupIDExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidSecurityGroupIDException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidSubnetIDExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidSubnetIDException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidZipFileExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidZipFileException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_KMSAccessDeniedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new KMSAccessDeniedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_KMSDisabledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new KMSDisabledException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_KMSInvalidStateExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new KMSInvalidStateException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_KMSNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new KMSNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_PolicyLengthExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new PolicyLengthExceededException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_PreconditionFailedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new PreconditionFailedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ProvisionedConcurrencyConfigNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new ProvisionedConcurrencyConfigNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_RecursiveInvocationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new RecursiveInvocationException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_RequestTooLargeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new RequestTooLargeException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ResourceConflictExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceConflictException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ResourceInUseExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceInUseException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ResourceNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceNotFoundException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ResourceNotReadyExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceNotReadyException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ServiceExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new ServiceException2(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_SnapStartExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new SnapStartException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_SnapStartNotReadyExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new SnapStartNotReadyException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_SnapStartTimeoutExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new SnapStartTimeoutException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_SubnetIPAddressLimitReachedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new SubnetIPAddressLimitReachedException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_TooManyRequestsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({
    [_rAS]: [, parsedOutput.headers[_ra]]
  });
  const data = parsedOutput.body;
  const doc = take(data, {
    Reason: expectString,
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new TooManyRequestsException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_UnsupportedMediaTypeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnsupportedMediaTypeException(__spreadValues({
    $metadata: deserializeMetadata(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvokeWithResponseStreamResponseEvent = (output, context) => {
  return context.eventStreamMarshaller.deserialize(output, (event) => __async(void 0, null, function* () {
    if (event["PayloadChunk"] != null) {
      return {
        PayloadChunk: yield de_InvokeResponseStreamUpdate_event(event["PayloadChunk"], context)
      };
    }
    if (event["InvokeComplete"] != null) {
      return {
        InvokeComplete: yield de_InvokeWithResponseStreamCompleteEvent_event(event["InvokeComplete"], context)
      };
    }
    return { $unknown: output };
  }));
};
var de_InvokeResponseStreamUpdate_event = (output, context) => __async(void 0, null, function* () {
  const contents = {};
  contents.Payload = output.body;
  return contents;
});
var de_InvokeWithResponseStreamCompleteEvent_event = (output, context) => __async(void 0, null, function* () {
  const contents = {};
  const data = yield parseJsonBody(output.body, context);
  Object.assign(contents, _json(data));
  return contents;
});
var se_AdditionalVersionWeights = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = serializeFloat(value);
    return acc;
  }, {});
};
var se_AliasRoutingConfiguration = (input, context) => {
  return take(input, {
    AdditionalVersionWeights: (_) => se_AdditionalVersionWeights(_, context)
  });
};
var se_FunctionCode = (input, context) => {
  return take(input, {
    ImageUri: [],
    S3Bucket: [],
    S3Key: [],
    S3ObjectVersion: [],
    ZipFile: context.base64Encoder
  });
};
var se_LayerVersionContentInput = (input, context) => {
  return take(input, {
    S3Bucket: [],
    S3Key: [],
    S3ObjectVersion: [],
    ZipFile: context.base64Encoder
  });
};
var de_AdditionalVersionWeights = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = limitedParseDouble(value);
    return acc;
  }, {});
};
var de_AliasConfiguration = (output, context) => {
  return take(output, {
    AliasArn: expectString,
    Description: expectString,
    FunctionVersion: expectString,
    Name: expectString,
    RevisionId: expectString,
    RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context)
  });
};
var de_AliasList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_AliasConfiguration(entry, context);
  });
  return retVal;
};
var de_AliasRoutingConfiguration = (output, context) => {
  return take(output, {
    AdditionalVersionWeights: (_) => de_AdditionalVersionWeights(_, context)
  });
};
var de_EventSourceMappingConfiguration = (output, context) => {
  return take(output, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
};
var de_EventSourceMappingsList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_EventSourceMappingConfiguration(entry, context);
  });
  return retVal;
};
var de_FunctionEventInvokeConfig = (output, context) => {
  return take(output, {
    DestinationConfig: _json,
    FunctionArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    MaximumEventAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32
  });
};
var de_FunctionEventInvokeConfigList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_FunctionEventInvokeConfig(entry, context);
  });
  return retVal;
};
var deserializeMetadata = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var isSerializableHeaderValue = (value) => value !== void 0 && value !== null && value !== "" && (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) && (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
var _A = "Arn";
var _CA = "CompatibleArchitecture";
var _CC = "ClientContext";
var _CR = "CompatibleRuntime";
var _ESA = "EventSourceArn";
var _EV = "ExecutedVersion";
var _FE = "FunctionError";
var _FN = "FunctionName";
var _FV = "FunctionVersion";
var _IT = "InvocationType";
var _L = "List";
var _LR = "LogResult";
var _LT = "LogType";
var _M = "Marker";
var _MI = "MaxItems";
var _MR = "MasterRegion";
var _Q = "Qualifier";
var _RI = "RevisionId";
var _RSCT = "ResponseStreamContentType";
var _TK = "TagKeys";
var _ct = "content-type";
var _f = "find";
var _rAS = "retryAfterSeconds";
var _ra = "retry-after";
var _tK = "tagKeys";
var _xacc = "x-amz-client-context";
var _xaev = "x-amz-executed-version";
var _xafe = "x-amz-function-error";
var _xait = "x-amz-invocation-type";
var _xalr = "x-amz-log-result";
var _xalt = "x-amz-log-type";

// node_modules/@aws-sdk/client-lambda/dist-es/commands/AddLayerVersionPermissionCommand.js
var AddLayerVersionPermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "AddLayerVersionPermission", {}).n("LambdaClient", "AddLayerVersionPermissionCommand").f(void 0, void 0).ser(se_AddLayerVersionPermissionCommand).de(de_AddLayerVersionPermissionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/AddPermissionCommand.js
var AddPermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "AddPermission", {}).n("LambdaClient", "AddPermissionCommand").f(void 0, void 0).ser(se_AddPermissionCommand).de(de_AddPermissionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateAliasCommand.js
var CreateAliasCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateAlias", {}).n("LambdaClient", "CreateAliasCommand").f(void 0, void 0).ser(se_CreateAliasCommand).de(de_CreateAliasCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateCodeSigningConfigCommand.js
var CreateCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateCodeSigningConfig", {}).n("LambdaClient", "CreateCodeSigningConfigCommand").f(void 0, void 0).ser(se_CreateCodeSigningConfigCommand).de(de_CreateCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateEventSourceMappingCommand.js
var CreateEventSourceMappingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateEventSourceMapping", {}).n("LambdaClient", "CreateEventSourceMappingCommand").f(void 0, void 0).ser(se_CreateEventSourceMappingCommand).de(de_CreateEventSourceMappingCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateFunctionCommand.js
var CreateFunctionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateFunction", {}).n("LambdaClient", "CreateFunctionCommand").f(CreateFunctionRequestFilterSensitiveLog, FunctionConfigurationFilterSensitiveLog).ser(se_CreateFunctionCommand).de(de_CreateFunctionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateFunctionUrlConfigCommand.js
var CreateFunctionUrlConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateFunctionUrlConfig", {}).n("LambdaClient", "CreateFunctionUrlConfigCommand").f(void 0, void 0).ser(se_CreateFunctionUrlConfigCommand).de(de_CreateFunctionUrlConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteAliasCommand.js
var DeleteAliasCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteAlias", {}).n("LambdaClient", "DeleteAliasCommand").f(void 0, void 0).ser(se_DeleteAliasCommand).de(de_DeleteAliasCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteCodeSigningConfigCommand.js
var DeleteCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteCodeSigningConfig", {}).n("LambdaClient", "DeleteCodeSigningConfigCommand").f(void 0, void 0).ser(se_DeleteCodeSigningConfigCommand).de(de_DeleteCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteEventSourceMappingCommand.js
var DeleteEventSourceMappingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteEventSourceMapping", {}).n("LambdaClient", "DeleteEventSourceMappingCommand").f(void 0, void 0).ser(se_DeleteEventSourceMappingCommand).de(de_DeleteEventSourceMappingCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionCodeSigningConfigCommand.js
var DeleteFunctionCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunctionCodeSigningConfig", {}).n("LambdaClient", "DeleteFunctionCodeSigningConfigCommand").f(void 0, void 0).ser(se_DeleteFunctionCodeSigningConfigCommand).de(de_DeleteFunctionCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionCommand.js
var DeleteFunctionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunction", {}).n("LambdaClient", "DeleteFunctionCommand").f(void 0, void 0).ser(se_DeleteFunctionCommand).de(de_DeleteFunctionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionConcurrencyCommand.js
var DeleteFunctionConcurrencyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunctionConcurrency", {}).n("LambdaClient", "DeleteFunctionConcurrencyCommand").f(void 0, void 0).ser(se_DeleteFunctionConcurrencyCommand).de(de_DeleteFunctionConcurrencyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionEventInvokeConfigCommand.js
var DeleteFunctionEventInvokeConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunctionEventInvokeConfig", {}).n("LambdaClient", "DeleteFunctionEventInvokeConfigCommand").f(void 0, void 0).ser(se_DeleteFunctionEventInvokeConfigCommand).de(de_DeleteFunctionEventInvokeConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionUrlConfigCommand.js
var DeleteFunctionUrlConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunctionUrlConfig", {}).n("LambdaClient", "DeleteFunctionUrlConfigCommand").f(void 0, void 0).ser(se_DeleteFunctionUrlConfigCommand).de(de_DeleteFunctionUrlConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteLayerVersionCommand.js
var DeleteLayerVersionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteLayerVersion", {}).n("LambdaClient", "DeleteLayerVersionCommand").f(void 0, void 0).ser(se_DeleteLayerVersionCommand).de(de_DeleteLayerVersionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteProvisionedConcurrencyConfigCommand.js
var DeleteProvisionedConcurrencyConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteProvisionedConcurrencyConfig", {}).n("LambdaClient", "DeleteProvisionedConcurrencyConfigCommand").f(void 0, void 0).ser(se_DeleteProvisionedConcurrencyConfigCommand).de(de_DeleteProvisionedConcurrencyConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetAccountSettingsCommand.js
var GetAccountSettingsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetAccountSettings", {}).n("LambdaClient", "GetAccountSettingsCommand").f(void 0, void 0).ser(se_GetAccountSettingsCommand).de(de_GetAccountSettingsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetAliasCommand.js
var GetAliasCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetAlias", {}).n("LambdaClient", "GetAliasCommand").f(void 0, void 0).ser(se_GetAliasCommand).de(de_GetAliasCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetCodeSigningConfigCommand.js
var GetCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetCodeSigningConfig", {}).n("LambdaClient", "GetCodeSigningConfigCommand").f(void 0, void 0).ser(se_GetCodeSigningConfigCommand).de(de_GetCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetEventSourceMappingCommand.js
var GetEventSourceMappingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetEventSourceMapping", {}).n("LambdaClient", "GetEventSourceMappingCommand").f(void 0, void 0).ser(se_GetEventSourceMappingCommand).de(de_GetEventSourceMappingCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionCodeSigningConfigCommand.js
var GetFunctionCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionCodeSigningConfig", {}).n("LambdaClient", "GetFunctionCodeSigningConfigCommand").f(void 0, void 0).ser(se_GetFunctionCodeSigningConfigCommand).de(de_GetFunctionCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionCommand.js
var GetFunctionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunction", {}).n("LambdaClient", "GetFunctionCommand").f(void 0, GetFunctionResponseFilterSensitiveLog).ser(se_GetFunctionCommand).de(de_GetFunctionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionConcurrencyCommand.js
var GetFunctionConcurrencyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionConcurrency", {}).n("LambdaClient", "GetFunctionConcurrencyCommand").f(void 0, void 0).ser(se_GetFunctionConcurrencyCommand).de(de_GetFunctionConcurrencyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionConfigurationCommand.js
var GetFunctionConfigurationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionConfiguration", {}).n("LambdaClient", "GetFunctionConfigurationCommand").f(void 0, FunctionConfigurationFilterSensitiveLog).ser(se_GetFunctionConfigurationCommand).de(de_GetFunctionConfigurationCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionEventInvokeConfigCommand.js
var GetFunctionEventInvokeConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionEventInvokeConfig", {}).n("LambdaClient", "GetFunctionEventInvokeConfigCommand").f(void 0, void 0).ser(se_GetFunctionEventInvokeConfigCommand).de(de_GetFunctionEventInvokeConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionRecursionConfigCommand.js
var GetFunctionRecursionConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionRecursionConfig", {}).n("LambdaClient", "GetFunctionRecursionConfigCommand").f(void 0, void 0).ser(se_GetFunctionRecursionConfigCommand).de(de_GetFunctionRecursionConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionUrlConfigCommand.js
var GetFunctionUrlConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionUrlConfig", {}).n("LambdaClient", "GetFunctionUrlConfigCommand").f(void 0, void 0).ser(se_GetFunctionUrlConfigCommand).de(de_GetFunctionUrlConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetLayerVersionByArnCommand.js
var GetLayerVersionByArnCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetLayerVersionByArn", {}).n("LambdaClient", "GetLayerVersionByArnCommand").f(void 0, void 0).ser(se_GetLayerVersionByArnCommand).de(de_GetLayerVersionByArnCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetLayerVersionCommand.js
var GetLayerVersionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetLayerVersion", {}).n("LambdaClient", "GetLayerVersionCommand").f(void 0, void 0).ser(se_GetLayerVersionCommand).de(de_GetLayerVersionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetLayerVersionPolicyCommand.js
var GetLayerVersionPolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetLayerVersionPolicy", {}).n("LambdaClient", "GetLayerVersionPolicyCommand").f(void 0, void 0).ser(se_GetLayerVersionPolicyCommand).de(de_GetLayerVersionPolicyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetPolicyCommand.js
var GetPolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetPolicy", {}).n("LambdaClient", "GetPolicyCommand").f(void 0, void 0).ser(se_GetPolicyCommand).de(de_GetPolicyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetProvisionedConcurrencyConfigCommand.js
var GetProvisionedConcurrencyConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetProvisionedConcurrencyConfig", {}).n("LambdaClient", "GetProvisionedConcurrencyConfigCommand").f(void 0, void 0).ser(se_GetProvisionedConcurrencyConfigCommand).de(de_GetProvisionedConcurrencyConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetRuntimeManagementConfigCommand.js
var GetRuntimeManagementConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetRuntimeManagementConfig", {}).n("LambdaClient", "GetRuntimeManagementConfigCommand").f(void 0, void 0).ser(se_GetRuntimeManagementConfigCommand).de(de_GetRuntimeManagementConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/InvokeAsyncCommand.js
var InvokeAsyncCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "InvokeAsync", {}).n("LambdaClient", "InvokeAsyncCommand").f(InvokeAsyncRequestFilterSensitiveLog, void 0).ser(se_InvokeAsyncCommand).de(de_InvokeAsyncCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/InvokeCommand.js
var InvokeCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "Invoke", {}).n("LambdaClient", "InvokeCommand").f(InvocationRequestFilterSensitiveLog, InvocationResponseFilterSensitiveLog).ser(se_InvokeCommand).de(de_InvokeCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/InvokeWithResponseStreamCommand.js
var InvokeWithResponseStreamCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "InvokeWithResponseStream", {
  eventStream: {
    output: true
  }
}).n("LambdaClient", "InvokeWithResponseStreamCommand").f(InvokeWithResponseStreamRequestFilterSensitiveLog, InvokeWithResponseStreamResponseFilterSensitiveLog).ser(se_InvokeWithResponseStreamCommand).de(de_InvokeWithResponseStreamCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListAliasesCommand.js
var ListAliasesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListAliases", {}).n("LambdaClient", "ListAliasesCommand").f(void 0, void 0).ser(se_ListAliasesCommand).de(de_ListAliasesCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListCodeSigningConfigsCommand.js
var ListCodeSigningConfigsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListCodeSigningConfigs", {}).n("LambdaClient", "ListCodeSigningConfigsCommand").f(void 0, void 0).ser(se_ListCodeSigningConfigsCommand).de(de_ListCodeSigningConfigsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListEventSourceMappingsCommand.js
var ListEventSourceMappingsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListEventSourceMappings", {}).n("LambdaClient", "ListEventSourceMappingsCommand").f(void 0, void 0).ser(se_ListEventSourceMappingsCommand).de(de_ListEventSourceMappingsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListFunctionEventInvokeConfigsCommand.js
var ListFunctionEventInvokeConfigsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListFunctionEventInvokeConfigs", {}).n("LambdaClient", "ListFunctionEventInvokeConfigsCommand").f(void 0, void 0).ser(se_ListFunctionEventInvokeConfigsCommand).de(de_ListFunctionEventInvokeConfigsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListFunctionsByCodeSigningConfigCommand.js
var ListFunctionsByCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListFunctionsByCodeSigningConfig", {}).n("LambdaClient", "ListFunctionsByCodeSigningConfigCommand").f(void 0, void 0).ser(se_ListFunctionsByCodeSigningConfigCommand).de(de_ListFunctionsByCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListFunctionsCommand.js
var ListFunctionsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListFunctions", {}).n("LambdaClient", "ListFunctionsCommand").f(void 0, ListFunctionsResponseFilterSensitiveLog).ser(se_ListFunctionsCommand).de(de_ListFunctionsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListFunctionUrlConfigsCommand.js
var ListFunctionUrlConfigsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListFunctionUrlConfigs", {}).n("LambdaClient", "ListFunctionUrlConfigsCommand").f(void 0, void 0).ser(se_ListFunctionUrlConfigsCommand).de(de_ListFunctionUrlConfigsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListLayersCommand.js
var ListLayersCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListLayers", {}).n("LambdaClient", "ListLayersCommand").f(void 0, void 0).ser(se_ListLayersCommand).de(de_ListLayersCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListLayerVersionsCommand.js
var ListLayerVersionsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListLayerVersions", {}).n("LambdaClient", "ListLayerVersionsCommand").f(void 0, void 0).ser(se_ListLayerVersionsCommand).de(de_ListLayerVersionsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListProvisionedConcurrencyConfigsCommand.js
var ListProvisionedConcurrencyConfigsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListProvisionedConcurrencyConfigs", {}).n("LambdaClient", "ListProvisionedConcurrencyConfigsCommand").f(void 0, void 0).ser(se_ListProvisionedConcurrencyConfigsCommand).de(de_ListProvisionedConcurrencyConfigsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListTagsCommand.js
var ListTagsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListTags", {}).n("LambdaClient", "ListTagsCommand").f(void 0, void 0).ser(se_ListTagsCommand).de(de_ListTagsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListVersionsByFunctionCommand.js
var ListVersionsByFunctionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListVersionsByFunction", {}).n("LambdaClient", "ListVersionsByFunctionCommand").f(void 0, ListVersionsByFunctionResponseFilterSensitiveLog).ser(se_ListVersionsByFunctionCommand).de(de_ListVersionsByFunctionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PublishLayerVersionCommand.js
var PublishLayerVersionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PublishLayerVersion", {}).n("LambdaClient", "PublishLayerVersionCommand").f(PublishLayerVersionRequestFilterSensitiveLog, void 0).ser(se_PublishLayerVersionCommand).de(de_PublishLayerVersionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PublishVersionCommand.js
var PublishVersionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PublishVersion", {}).n("LambdaClient", "PublishVersionCommand").f(void 0, FunctionConfigurationFilterSensitiveLog).ser(se_PublishVersionCommand).de(de_PublishVersionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutFunctionCodeSigningConfigCommand.js
var PutFunctionCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutFunctionCodeSigningConfig", {}).n("LambdaClient", "PutFunctionCodeSigningConfigCommand").f(void 0, void 0).ser(se_PutFunctionCodeSigningConfigCommand).de(de_PutFunctionCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutFunctionConcurrencyCommand.js
var PutFunctionConcurrencyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutFunctionConcurrency", {}).n("LambdaClient", "PutFunctionConcurrencyCommand").f(void 0, void 0).ser(se_PutFunctionConcurrencyCommand).de(de_PutFunctionConcurrencyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutFunctionEventInvokeConfigCommand.js
var PutFunctionEventInvokeConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutFunctionEventInvokeConfig", {}).n("LambdaClient", "PutFunctionEventInvokeConfigCommand").f(void 0, void 0).ser(se_PutFunctionEventInvokeConfigCommand).de(de_PutFunctionEventInvokeConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutFunctionRecursionConfigCommand.js
var PutFunctionRecursionConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutFunctionRecursionConfig", {}).n("LambdaClient", "PutFunctionRecursionConfigCommand").f(void 0, void 0).ser(se_PutFunctionRecursionConfigCommand).de(de_PutFunctionRecursionConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutProvisionedConcurrencyConfigCommand.js
var PutProvisionedConcurrencyConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutProvisionedConcurrencyConfig", {}).n("LambdaClient", "PutProvisionedConcurrencyConfigCommand").f(void 0, void 0).ser(se_PutProvisionedConcurrencyConfigCommand).de(de_PutProvisionedConcurrencyConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutRuntimeManagementConfigCommand.js
var PutRuntimeManagementConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutRuntimeManagementConfig", {}).n("LambdaClient", "PutRuntimeManagementConfigCommand").f(void 0, void 0).ser(se_PutRuntimeManagementConfigCommand).de(de_PutRuntimeManagementConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/RemoveLayerVersionPermissionCommand.js
var RemoveLayerVersionPermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "RemoveLayerVersionPermission", {}).n("LambdaClient", "RemoveLayerVersionPermissionCommand").f(void 0, void 0).ser(se_RemoveLayerVersionPermissionCommand).de(de_RemoveLayerVersionPermissionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/RemovePermissionCommand.js
var RemovePermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "RemovePermission", {}).n("LambdaClient", "RemovePermissionCommand").f(void 0, void 0).ser(se_RemovePermissionCommand).de(de_RemovePermissionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/TagResourceCommand.js
var TagResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "TagResource", {}).n("LambdaClient", "TagResourceCommand").f(void 0, void 0).ser(se_TagResourceCommand).de(de_TagResourceCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UntagResourceCommand.js
var UntagResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UntagResource", {}).n("LambdaClient", "UntagResourceCommand").f(void 0, void 0).ser(se_UntagResourceCommand).de(de_UntagResourceCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateAliasCommand.js
var UpdateAliasCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateAlias", {}).n("LambdaClient", "UpdateAliasCommand").f(void 0, void 0).ser(se_UpdateAliasCommand).de(de_UpdateAliasCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateCodeSigningConfigCommand.js
var UpdateCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateCodeSigningConfig", {}).n("LambdaClient", "UpdateCodeSigningConfigCommand").f(void 0, void 0).ser(se_UpdateCodeSigningConfigCommand).de(de_UpdateCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateEventSourceMappingCommand.js
var UpdateEventSourceMappingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateEventSourceMapping", {}).n("LambdaClient", "UpdateEventSourceMappingCommand").f(void 0, void 0).ser(se_UpdateEventSourceMappingCommand).de(de_UpdateEventSourceMappingCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateFunctionCodeCommand.js
var UpdateFunctionCodeCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateFunctionCode", {}).n("LambdaClient", "UpdateFunctionCodeCommand").f(UpdateFunctionCodeRequestFilterSensitiveLog, FunctionConfigurationFilterSensitiveLog).ser(se_UpdateFunctionCodeCommand).de(de_UpdateFunctionCodeCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateFunctionConfigurationCommand.js
var UpdateFunctionConfigurationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateFunctionConfiguration", {}).n("LambdaClient", "UpdateFunctionConfigurationCommand").f(UpdateFunctionConfigurationRequestFilterSensitiveLog, FunctionConfigurationFilterSensitiveLog).ser(se_UpdateFunctionConfigurationCommand).de(de_UpdateFunctionConfigurationCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateFunctionEventInvokeConfigCommand.js
var UpdateFunctionEventInvokeConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateFunctionEventInvokeConfig", {}).n("LambdaClient", "UpdateFunctionEventInvokeConfigCommand").f(void 0, void 0).ser(se_UpdateFunctionEventInvokeConfigCommand).de(de_UpdateFunctionEventInvokeConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateFunctionUrlConfigCommand.js
var UpdateFunctionUrlConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateFunctionUrlConfig", {}).n("LambdaClient", "UpdateFunctionUrlConfigCommand").f(void 0, void 0).ser(se_UpdateFunctionUrlConfigCommand).de(de_UpdateFunctionUrlConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/Lambda.js
var commands = {
  AddLayerVersionPermissionCommand,
  AddPermissionCommand,
  CreateAliasCommand,
  CreateCodeSigningConfigCommand,
  CreateEventSourceMappingCommand,
  CreateFunctionCommand,
  CreateFunctionUrlConfigCommand,
  DeleteAliasCommand,
  DeleteCodeSigningConfigCommand,
  DeleteEventSourceMappingCommand,
  DeleteFunctionCommand,
  DeleteFunctionCodeSigningConfigCommand,
  DeleteFunctionConcurrencyCommand,
  DeleteFunctionEventInvokeConfigCommand,
  DeleteFunctionUrlConfigCommand,
  DeleteLayerVersionCommand,
  DeleteProvisionedConcurrencyConfigCommand,
  GetAccountSettingsCommand,
  GetAliasCommand,
  GetCodeSigningConfigCommand,
  GetEventSourceMappingCommand,
  GetFunctionCommand,
  GetFunctionCodeSigningConfigCommand,
  GetFunctionConcurrencyCommand,
  GetFunctionConfigurationCommand,
  GetFunctionEventInvokeConfigCommand,
  GetFunctionRecursionConfigCommand,
  GetFunctionUrlConfigCommand,
  GetLayerVersionCommand,
  GetLayerVersionByArnCommand,
  GetLayerVersionPolicyCommand,
  GetPolicyCommand,
  GetProvisionedConcurrencyConfigCommand,
  GetRuntimeManagementConfigCommand,
  InvokeCommand,
  InvokeAsyncCommand,
  InvokeWithResponseStreamCommand,
  ListAliasesCommand,
  ListCodeSigningConfigsCommand,
  ListEventSourceMappingsCommand,
  ListFunctionEventInvokeConfigsCommand,
  ListFunctionsCommand,
  ListFunctionsByCodeSigningConfigCommand,
  ListFunctionUrlConfigsCommand,
  ListLayersCommand,
  ListLayerVersionsCommand,
  ListProvisionedConcurrencyConfigsCommand,
  ListTagsCommand,
  ListVersionsByFunctionCommand,
  PublishLayerVersionCommand,
  PublishVersionCommand,
  PutFunctionCodeSigningConfigCommand,
  PutFunctionConcurrencyCommand,
  PutFunctionEventInvokeConfigCommand,
  PutFunctionRecursionConfigCommand,
  PutProvisionedConcurrencyConfigCommand,
  PutRuntimeManagementConfigCommand,
  RemoveLayerVersionPermissionCommand,
  RemovePermissionCommand,
  TagResourceCommand,
  UntagResourceCommand,
  UpdateAliasCommand,
  UpdateCodeSigningConfigCommand,
  UpdateEventSourceMappingCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
  UpdateFunctionEventInvokeConfigCommand,
  UpdateFunctionUrlConfigCommand
};
var Lambda = class extends LambdaClient {
};
createAggregatedClient(commands, Lambda);

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListAliasesPaginator.js
var paginateListAliases = createPaginator(LambdaClient, ListAliasesCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListCodeSigningConfigsPaginator.js
var paginateListCodeSigningConfigs = createPaginator(LambdaClient, ListCodeSigningConfigsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListEventSourceMappingsPaginator.js
var paginateListEventSourceMappings = createPaginator(LambdaClient, ListEventSourceMappingsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListFunctionEventInvokeConfigsPaginator.js
var paginateListFunctionEventInvokeConfigs = createPaginator(LambdaClient, ListFunctionEventInvokeConfigsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListFunctionUrlConfigsPaginator.js
var paginateListFunctionUrlConfigs = createPaginator(LambdaClient, ListFunctionUrlConfigsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListFunctionsByCodeSigningConfigPaginator.js
var paginateListFunctionsByCodeSigningConfig = createPaginator(LambdaClient, ListFunctionsByCodeSigningConfigCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListFunctionsPaginator.js
var paginateListFunctions = createPaginator(LambdaClient, ListFunctionsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListLayerVersionsPaginator.js
var paginateListLayerVersions = createPaginator(LambdaClient, ListLayerVersionsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListLayersPaginator.js
var paginateListLayers = createPaginator(LambdaClient, ListLayersCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListProvisionedConcurrencyConfigsPaginator.js
var paginateListProvisionedConcurrencyConfigs = createPaginator(LambdaClient, ListProvisionedConcurrencyConfigsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListVersionsByFunctionPaginator.js
var paginateListVersionsByFunction = createPaginator(LambdaClient, ListVersionsByFunctionCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionActive.js
var checkState = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionConfigurationCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Active") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Pending") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionActive = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState);
});
var waitUntilFunctionActive = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionActiveV2.js
var checkState2 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.Configuration.State;
      };
      if (returnComparator() === "Active") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.Configuration.State;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.Configuration.State;
      };
      if (returnComparator() === "Pending") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionActiveV2 = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState2);
});
var waitUntilFunctionActiveV2 = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState2);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionExists.js
var checkState3 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionCommand(input));
    reason = result;
    return { state: WaiterState.SUCCESS, reason };
  } catch (exception) {
    reason = exception;
    if (exception.name && exception.name == "ResourceNotFoundException") {
      return { state: WaiterState.RETRY, reason };
    }
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState3);
});
var waitUntilFunctionExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState3);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionUpdated.js
var checkState4 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionConfigurationCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.LastUpdateStatus;
      };
      if (returnComparator() === "Successful") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.LastUpdateStatus;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.LastUpdateStatus;
      };
      if (returnComparator() === "InProgress") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionUpdated = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState4);
});
var waitUntilFunctionUpdated = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState4);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionUpdatedV2.js
var checkState5 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.Configuration.LastUpdateStatus;
      };
      if (returnComparator() === "Successful") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.Configuration.LastUpdateStatus;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.Configuration.LastUpdateStatus;
      };
      if (returnComparator() === "InProgress") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionUpdatedV2 = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState5);
});
var waitUntilFunctionUpdatedV2 = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState5);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForPublishedVersionActive.js
var checkState6 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionConfigurationCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Active") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Pending") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForPublishedVersionActive = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState6);
});
var waitUntilPublishedVersionActive = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState6);
  return checkExceptions(result);
});
export {
  Command as $Command,
  AddLayerVersionPermissionCommand,
  AddPermissionCommand,
  ApplicationLogLevel,
  Architecture,
  CodeSigningConfigNotFoundException,
  CodeSigningPolicy,
  CodeStorageExceededException,
  CodeVerificationFailedException,
  CreateAliasCommand,
  CreateCodeSigningConfigCommand,
  CreateEventSourceMappingCommand,
  CreateFunctionCommand,
  CreateFunctionRequestFilterSensitiveLog,
  CreateFunctionUrlConfigCommand,
  DeleteAliasCommand,
  DeleteCodeSigningConfigCommand,
  DeleteEventSourceMappingCommand,
  DeleteFunctionCodeSigningConfigCommand,
  DeleteFunctionCommand,
  DeleteFunctionConcurrencyCommand,
  DeleteFunctionEventInvokeConfigCommand,
  DeleteFunctionUrlConfigCommand,
  DeleteLayerVersionCommand,
  DeleteProvisionedConcurrencyConfigCommand,
  EC2AccessDeniedException,
  EC2ThrottledException,
  EC2UnexpectedException,
  EFSIOException,
  EFSMountConnectivityException,
  EFSMountFailureException,
  EFSMountTimeoutException,
  ENILimitReachedException,
  EndPointType,
  EnvironmentErrorFilterSensitiveLog,
  EnvironmentFilterSensitiveLog,
  EnvironmentResponseFilterSensitiveLog,
  EventSourcePosition,
  FullDocument,
  FunctionCodeFilterSensitiveLog,
  FunctionConfigurationFilterSensitiveLog,
  FunctionResponseType,
  FunctionUrlAuthType,
  FunctionVersion,
  GetAccountSettingsCommand,
  GetAliasCommand,
  GetCodeSigningConfigCommand,
  GetEventSourceMappingCommand,
  GetFunctionCodeSigningConfigCommand,
  GetFunctionCommand,
  GetFunctionConcurrencyCommand,
  GetFunctionConfigurationCommand,
  GetFunctionEventInvokeConfigCommand,
  GetFunctionRecursionConfigCommand,
  GetFunctionResponseFilterSensitiveLog,
  GetFunctionUrlConfigCommand,
  GetLayerVersionByArnCommand,
  GetLayerVersionCommand,
  GetLayerVersionPolicyCommand,
  GetPolicyCommand,
  GetProvisionedConcurrencyConfigCommand,
  GetRuntimeManagementConfigCommand,
  ImageConfigErrorFilterSensitiveLog,
  ImageConfigResponseFilterSensitiveLog,
  InvalidCodeSignatureException,
  InvalidParameterValueException,
  InvalidRequestContentException,
  InvalidRuntimeException,
  InvalidSecurityGroupIDException,
  InvalidSubnetIDException,
  InvalidZipFileException,
  InvocationRequestFilterSensitiveLog,
  InvocationResponseFilterSensitiveLog,
  InvocationType,
  InvokeAsyncCommand,
  InvokeAsyncRequestFilterSensitiveLog,
  InvokeCommand,
  InvokeMode,
  InvokeResponseStreamUpdateFilterSensitiveLog,
  InvokeWithResponseStreamCommand,
  InvokeWithResponseStreamRequestFilterSensitiveLog,
  InvokeWithResponseStreamResponseEvent,
  InvokeWithResponseStreamResponseEventFilterSensitiveLog,
  InvokeWithResponseStreamResponseFilterSensitiveLog,
  KMSAccessDeniedException,
  KMSDisabledException,
  KMSInvalidStateException,
  KMSNotFoundException,
  Lambda,
  LambdaClient,
  LambdaServiceException,
  LastUpdateStatus,
  LastUpdateStatusReasonCode,
  LayerVersionContentInputFilterSensitiveLog,
  ListAliasesCommand,
  ListCodeSigningConfigsCommand,
  ListEventSourceMappingsCommand,
  ListFunctionEventInvokeConfigsCommand,
  ListFunctionUrlConfigsCommand,
  ListFunctionsByCodeSigningConfigCommand,
  ListFunctionsCommand,
  ListFunctionsResponseFilterSensitiveLog,
  ListLayerVersionsCommand,
  ListLayersCommand,
  ListProvisionedConcurrencyConfigsCommand,
  ListTagsCommand,
  ListVersionsByFunctionCommand,
  ListVersionsByFunctionResponseFilterSensitiveLog,
  LogFormat,
  LogType,
  PackageType,
  PolicyLengthExceededException,
  PreconditionFailedException,
  ProvisionedConcurrencyConfigNotFoundException,
  ProvisionedConcurrencyStatusEnum,
  PublishLayerVersionCommand,
  PublishLayerVersionRequestFilterSensitiveLog,
  PublishVersionCommand,
  PutFunctionCodeSigningConfigCommand,
  PutFunctionConcurrencyCommand,
  PutFunctionEventInvokeConfigCommand,
  PutFunctionRecursionConfigCommand,
  PutProvisionedConcurrencyConfigCommand,
  PutRuntimeManagementConfigCommand,
  RecursiveInvocationException,
  RecursiveLoop,
  RemoveLayerVersionPermissionCommand,
  RemovePermissionCommand,
  RequestTooLargeException,
  ResourceConflictException,
  ResourceInUseException,
  ResourceNotFoundException,
  ResourceNotReadyException,
  ResponseStreamingInvocationType,
  Runtime,
  RuntimeVersionConfigFilterSensitiveLog,
  RuntimeVersionErrorFilterSensitiveLog,
  ServiceException2 as ServiceException,
  SnapStartApplyOn,
  SnapStartException,
  SnapStartNotReadyException,
  SnapStartOptimizationStatus,
  SnapStartTimeoutException,
  SourceAccessType,
  State,
  StateReasonCode,
  SubnetIPAddressLimitReachedException,
  SystemLogLevel,
  TagResourceCommand,
  ThrottleReason,
  TooManyRequestsException,
  TracingMode,
  UnsupportedMediaTypeException,
  UntagResourceCommand,
  UpdateAliasCommand,
  UpdateCodeSigningConfigCommand,
  UpdateEventSourceMappingCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionCodeRequestFilterSensitiveLog,
  UpdateFunctionConfigurationCommand,
  UpdateFunctionConfigurationRequestFilterSensitiveLog,
  UpdateFunctionEventInvokeConfigCommand,
  UpdateFunctionUrlConfigCommand,
  UpdateRuntimeOn,
  Client as __Client,
  paginateListAliases,
  paginateListCodeSigningConfigs,
  paginateListEventSourceMappings,
  paginateListFunctionEventInvokeConfigs,
  paginateListFunctionUrlConfigs,
  paginateListFunctions,
  paginateListFunctionsByCodeSigningConfig,
  paginateListLayerVersions,
  paginateListLayers,
  paginateListProvisionedConcurrencyConfigs,
  paginateListVersionsByFunction,
  waitForFunctionActive,
  waitForFunctionActiveV2,
  waitForFunctionExists,
  waitForFunctionUpdated,
  waitForFunctionUpdatedV2,
  waitForPublishedVersionActive,
  waitUntilFunctionActive,
  waitUntilFunctionActiveV2,
  waitUntilFunctionExists,
  waitUntilFunctionUpdated,
  waitUntilFunctionUpdatedV2,
  waitUntilPublishedVersionActive
};
//# sourceMappingURL=@aws-sdk_client-lambda.js.map
