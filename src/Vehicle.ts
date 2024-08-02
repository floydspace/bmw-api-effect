import { HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema } from "@effect/schema";
import { fetchAuthBmwCocoApi } from "./Common";
import { MappingInfo, VehicleInfo, VehicleState } from "./Schema";

/**
 * Retrieves the short list of vehicles.
 */
export const getVehicleList = () =>
  HttpClientRequest.post(`/eadrax-vcs/v5/vehicle-list`).pipe(
    fetchAuthBmwCocoApi,
    HttpClientResponse.schemaBodyJsonScoped(
      Schema.Struct({
        gcid: Schema.UUID,
        mappingInfos: Schema.Array(
          MappingInfo.pipe(
            Schema.extend(
              Schema.Struct({
                vehicleMappingType: Schema.Literal("CONNECTED"),
                vin: Schema.Uppercased,
              }),
            ),
          ),
        ),
      }),
      { onExcessProperty: "preserve" },
    ),
  );

/**
 * Retrieves the detailed list of vehicles.
 */
export const getVehicles = () =>
  HttpClientRequest.get(`/eadrax-vcs/v4/vehicles`).pipe(
    fetchAuthBmwCocoApi,
    HttpClientResponse.schemaBodyJsonScoped(Schema.Array(VehicleInfo), {
      onExcessProperty: "preserve",
    }),
  );

/**
 * Retrieves the state of a vehicle using the provided VIN.
 * @param vin - The VIN (Vehicle Identification Number) of the vehicle.
 */
export const getVehicleState = (vin: string) =>
  HttpClientRequest.get(`/eadrax-vcs/v4/vehicles/state`).pipe(
    HttpClientRequest.setHeader("bmw-vin", vin),
    fetchAuthBmwCocoApi,
    HttpClientResponse.schemaBodyJsonScoped(VehicleState, {
      onExcessProperty: "preserve",
    }),
  );

/**
 * Retrieves the image of a vehicle based on its VIN.
 *
 * @param vin - The VIN (Vehicle Identification Number) of the vehicle.
 */
export const getVehicleImage = (vin: string) =>
  HttpClientRequest.get(`/eadrax-ics/v5/presentation/vehicles/images`).pipe(
    HttpClientRequest.setHeader("bmw-app-vehicle-type", "connected"),
    HttpClientRequest.setHeader("bmw-vin", vin),
    HttpClientRequest.accept("image/png"),
    HttpClientRequest.setUrlParams({ carView: "VehicleStatus" }),
    fetchAuthBmwCocoApi,
    HttpClientResponse.arrayBuffer,
  );
