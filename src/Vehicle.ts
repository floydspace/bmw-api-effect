import { HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema } from "@effect/schema";
import { fetchAuthBmwCocoApi } from "./Common";

export const getVehicleList = () =>
  HttpClientRequest.post(`/eadrax-vcs/v5/vehicle-list`).pipe(
    fetchAuthBmwCocoApi,
    HttpClientResponse.json,
  );

const SoftwareVersion = Schema.Struct({
  iStep: Schema.Number,
  puStep: Schema.Struct({
    month: Schema.Number,
    year: Schema.Number,
  }),
  seriesCluster: Schema.String,
});

export const getVehicles = () =>
  HttpClientRequest.get(`/eadrax-vcs/v4/vehicles`).pipe(
    fetchAuthBmwCocoApi,
    HttpClientResponse.schemaBodyJsonScoped(
      Schema.Array(
        Schema.Struct({
          appVehicleType: Schema.Literal("CONNECTED"),
          attributes: Schema.Struct({
            bodyType: Schema.Uppercased,
            brand: Schema.String,
            color: Schema.Number,
            countryOfOrigin: Schema.Uppercased,
            driveTrain: Schema.Uppercased,
            headUnitRaw: Schema.Uppercased,
            headUnitType: Schema.Uppercased,
            hmiVersion: Schema.Uppercased,
            lastFetched: Schema.DateFromString,
            model: Schema.String,
            softwareVersionCurrent: SoftwareVersion,
            softwareVersionExFactory: SoftwareVersion,
            telematicsUnit: Schema.Uppercased,
            year: Schema.Number,
          }),
          mappingInfo: Schema.Struct({
            isAssociated: Schema.Boolean,
            isLmmEnabled: Schema.Boolean,
            isPrimaryUser: Schema.Boolean,
            mappingStatus: Schema.Uppercased,
          }),
          vin: Schema.Uppercased,
        }),
      ),
    ),
  );

export const getVehicleState = (vin: string) =>
  HttpClientRequest.get(`/eadrax-vcs/v4/vehicles/state`).pipe(
    HttpClientRequest.setHeader("bmw-vin", vin),
    fetchAuthBmwCocoApi,
    HttpClientResponse.json,
  );
