import { HttpClient, HttpClientRequest } from "@effect/platform";
import { Effect } from "effect";
import { Authentication } from "./Authentication";

export const CLIENT_RUNTIME = "android(AP2A.240605.024);bmw;4.7.2(35379);row";

export const fetchBmw = HttpClient.fetch.pipe(
  HttpClient.mapRequest(
    HttpClientRequest.setHeaders({
      "User-Agent": "Dart/3.3 (dart:io)",
      "x-user-agent": CLIENT_RUNTIME,
    }),
  ),
);

export const fetchBmwCocoApi = fetchBmw.pipe(
  HttpClient.filterStatusOk,
  HttpClient.mapRequest(
    HttpClientRequest.prependUrl("https://cocoapi.bmwgroup.com"),
  ),
);

export const fetchAuthBmwCocoApi = fetchBmwCocoApi.pipe(
  HttpClient.mapRequestEffect((request) =>
    Authentication.pipe(
      Effect.map(({ access_token }) =>
        HttpClientRequest.bearerToken(request, access_token),
      ),
    ),
  ),
);

export const filterStatus3xx = HttpClient.filterStatus(
  (status) => status >= 300 && status < 400,
);
