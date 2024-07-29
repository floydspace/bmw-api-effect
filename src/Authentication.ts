import {
  Cookies,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { ParseResult, Schema } from "@effect/schema";
import { Config, Context, Effect, Layer, Redacted, Ref } from "effect";
import { randomUUID } from "node:crypto";
import { AuthConfig } from "./AuthConfig";
import { CLIENT_RUNTIME, fetchBmw, filterStatus3xx } from "./Common";
import {
  createS256CodeChallenge,
  generateToken,
  parseQueryParams,
} from "./Utils";

const AuthChallenge = Schema.transformOrFail(
  Schema.Struct({ redirect_to: Schema.String }),
  Schema.Struct({
    client_id: Schema.UUID,
    response_type: Schema.String,
    scope: Schema.String,
    state: Schema.String,
    authorization: Schema.String,
  }),
  {
    decode: ({ redirect_to }) =>
      ParseResult.succeed(
        parseQueryParams(redirect_to.replace(/^redirect_uri=/, "")),
      ),
    encode: (u) =>
      ParseResult.fail(new ParseResult.Unexpected(u, "Not implemented")),
    strict: false,
  },
);
type AuthChallenge = Schema.Schema.Type<typeof AuthChallenge>;

export const getAuthCodeChallenge = (
  username: string,
  password: string,
  state: string,
  nonce: string,
  codeChallenge: string,
  cookiesRef: Ref.Ref<Cookies.Cookies>,
) =>
  Effect.gen(function* () {
    const config = yield* AuthConfig;
    const challengeUrl = `${config.gcdmBaseUrl}/gcdm/oauth/authenticate`;

    const body = new URLSearchParams();
    body.append("client_id", config.clientId);
    body.append("response_type", "code");
    body.append("scope", "authenticate_user vehicle_data remote_services");
    body.append("redirect_uri", config.returnUrl);
    body.append("state", state);
    body.append("nonce", nonce);
    body.append("code_challenge", codeChallenge);
    body.append("code_challenge_method", "S256");
    body.append("grant_type", "authorization_code");
    body.append("username", username);
    body.append("password", password);

    return yield* HttpClientRequest.post(challengeUrl).pipe(
      HttpClientRequest.urlParamsBody(body),
      HttpClient.filterStatusOk(fetchBmw).pipe(
        HttpClient.withCookiesRef(cookiesRef),
      ),
      HttpClientResponse.schemaBodyJsonScoped(AuthChallenge),
    );
  });

const RedirectResult = Schema.transformOrFail(
  Schema.Struct({ location: Schema.String }),
  Schema.Struct({
    client_id: Schema.UUID,
    state: Schema.String,
    nonce: Schema.String,
    code: Schema.String,
  }),
  {
    decode: ({ location }) => ParseResult.succeed(parseQueryParams(location)),
    encode: (u) =>
      ParseResult.fail(new ParseResult.Unexpected(u, "Not implemented")),
    strict: false,
  },
);

export const getAuthCode = (
  state: string,
  nonce: string,
  codeChallenge: string,
  authorization: string,
  cookiesRef: Ref.Ref<Cookies.Cookies>,
) =>
  Effect.gen(function* () {
    const config = yield* AuthConfig;
    const challengeUrl = `${config.gcdmBaseUrl}/gcdm/oauth/authenticate`;

    const params = new URLSearchParams();
    params.append("interaction-id", randomUUID());
    params.append("client-version", CLIENT_RUNTIME);

    const body = new URLSearchParams();
    body.append("client_id", config.clientId);
    body.append("response_type", "code");
    body.append("scope", "authenticate_user vehicle_data remote_services");
    body.append("redirect_uri", config.returnUrl);
    body.append("state", state);
    body.append("nonce", nonce);
    body.append("code_challenge", codeChallenge);
    body.append("code_challenge_method", "S256");
    body.append("authorization", authorization);

    return yield* HttpClientRequest.post(challengeUrl).pipe(
      HttpClientRequest.setUrlParams(params),
      HttpClientRequest.urlParamsBody(body),
      filterStatus3xx(fetchBmw).pipe(HttpClient.withCookiesRef(cookiesRef)),
      HttpClient.withFetchOptions({ redirect: "manual" }),
      HttpClientResponse.schemaHeadersScoped(RedirectResult),
    );
  });

const AuthenticationSchema = Schema.Struct({
  access_token: Schema.String,
  token_type: Schema.String,
  expires_in: Schema.Number,
  refresh_token: Schema.String,
  gcid: Schema.UUID,
  scope: Schema.String,
});
type AuthenticationSchema = Schema.Schema.Type<typeof AuthenticationSchema>;

export const getAccessToken = (
  code: string,
  codeVerifier: string,
  cookiesRef: Ref.Ref<Cookies.Cookies>,
) =>
  Effect.gen(function* () {
    const config = yield* AuthConfig;
    const challengeUrl = `${config.gcdmBaseUrl}/gcdm/oauth/token`;

    const body = new URLSearchParams();
    body.append("code", code);
    body.append("code_verifier", codeVerifier);
    body.append("redirect_uri", config.returnUrl);
    body.append("grant_type", "authorization_code");

    return yield* HttpClientRequest.post(challengeUrl).pipe(
      HttpClientRequest.basicAuth(config.clientId, config.clientSecret),
      HttpClientRequest.urlParamsBody(body),
      HttpClient.filterStatusOk(fetchBmw).pipe(
        HttpClient.withCookiesRef(cookiesRef),
      ),
      HttpClientResponse.schemaBodyJsonScoped(AuthenticationSchema),
    );
  });

export const authenticate = (username: string, password: string) =>
  Effect.gen(function* () {
    const state = generateToken(22);
    const nonce = generateToken(22);
    const codeVerifier = generateToken(86);
    const codeChallenge = createS256CodeChallenge(codeVerifier);
    const cookiesRef = yield* Ref.make(Cookies.empty);

    const { authorization } = yield* getAuthCodeChallenge(
      username,
      password,
      state,
      nonce,
      codeChallenge,
      cookiesRef,
    );

    const { code } = yield* getAuthCode(
      state,
      nonce,
      codeChallenge,
      authorization,
      cookiesRef,
    );

    return yield* getAccessToken(code, codeVerifier, cookiesRef);
  });

export class Authentication extends Context.Tag("Authentication")<
  Authentication,
  AuthenticationSchema
>() {
  static Live = Layer.effect(
    this,
    Config.all({
      username: Config.string("MYBMW_USERNAME"),
      password: Config.redacted("MYBMW_PASSWORD"),
    }).pipe(
      Effect.andThen(({ username, password }) =>
        authenticate(username, Redacted.value(password)),
      ),
    ),
  );
}
