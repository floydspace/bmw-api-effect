import { HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema } from "@effect/schema";
import { Context, Layer } from "effect";
import { randomUUID } from "node:crypto";
import { fetchBmwCocoApi } from "./Common";

const AuthConfigSchema = Schema.Struct({
  authorizationEndpoint: Schema.String,
  brand: Schema.String,
  clientId: Schema.UUID,
  clientName: Schema.String,
  clientSecret: Schema.UUID,
  country: Schema.String,
  gcdmBaseUrl: Schema.String,
  language: Schema.String,
  promptValues: Schema.Array(Schema.String),
  returnUrl: Schema.String,
  scopes: Schema.Array(Schema.String),
  tokenEndpoint: Schema.String,
});
type AuthConfigSchema = Schema.Schema.Type<typeof AuthConfigSchema>;

export const getAuthConfig = () =>
  HttpClientRequest.get(`/eadrax-ucs/v1/presentation/oauth/config`).pipe(
    HttpClientRequest.setHeaders({
      "ocp-apim-subscription-key": "4f1c85a3-758f-a37d-bbb6-f8704494acfa",
      "bmw-session-id": randomUUID(),
    }),
    fetchBmwCocoApi,
    HttpClientResponse.schemaBodyJsonScoped(AuthConfigSchema),
  );

export class AuthConfig extends Context.Tag("AuthConfig")<
  AuthConfig,
  AuthConfigSchema
>() {
  static Live = Layer.effect(this, getAuthConfig());
}
