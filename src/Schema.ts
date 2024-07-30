import { Schema } from "@effect/schema";

export const SoftwareVersion = Schema.Struct({
  iStep: Schema.Number,
  puStep: Schema.Struct({
    month: Schema.Number,
    year: Schema.Number,
  }),
  seriesCluster: Schema.String,
});

export const MappingInfo = Schema.Struct({
  isAssociated: Schema.Boolean,
  isLmmEnabled: Schema.Boolean,
  isPrimaryUser: Schema.Boolean,
  mappingStatus: Schema.Uppercased,
});

export const VehicleInfo = Schema.Struct({
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
  mappingInfo: MappingInfo,
  vin: Schema.Uppercased,
});

export const Time = Schema.Struct({
  hour: Schema.Number,
  minute: Schema.Number,
});

export const DepartureTime = Schema.Struct({
  action: Schema.Uppercased,
  id: Schema.Number,
  timeStamp: Time,
  timerWeekDays: Schema.Array(Schema.Uppercased),
});

export const Coordinates = Schema.Struct({
  latitude: Schema.Number,
  longitude: Schema.Number,
});

export const TireState = Schema.Struct({
  details: Schema.Struct({
    dimension: Schema.String,
    identificationInProgress: Schema.Boolean,
    isOptimizedForOemBmw: Schema.Boolean,
    manufacturer: Schema.String,
    manufacturingWeek: Schema.Number,
    mountingDate: Schema.DateFromString,
    partNumber: Schema.String,
    season: Schema.Number,
    speedClassification: Schema.Struct({
      atLeast: Schema.Boolean,
      speedRating: Schema.Number,
    }),
    treadDesign: Schema.String,
  }),
  status: Schema.Struct({
    currentPressure: Schema.Number,
    targetPressure: Schema.Number,
  }),
});

export const VehicleState = Schema.Struct({
  capabilities: Schema.Struct({
    a4aType: Schema.Uppercased,
    alarmSystem: Schema.Boolean,
    climateFunction: Schema.Uppercased,
    climateNow: Schema.Boolean,
    digitalKey: Schema.Struct({
      bookedServicePackage: Schema.Uppercased,
      isDigitalKeyFirstSupported: Schema.Boolean,
      readerGraphics: Schema.String,
      state: Schema.Uppercased,
      vehicleSoftwareUpgradeRequired: Schema.Boolean,
    }),
    horn: Schema.Boolean,
    isBatteryPreconditioningSupported: Schema.Boolean,
    isBmwChargingSupported: Schema.Boolean,
    isCarSharingSupported: Schema.Boolean,
    isChargeNowForBusinessSupported: Schema.Boolean,
    isChargingHistorySupported: Schema.Boolean,
    isChargingHospitalityEnabled: Schema.Boolean,
    isChargingLoudnessEnabled: Schema.Boolean,
    isChargingPlanSupported: Schema.Boolean,
    isChargingPowerLimitEnabled: Schema.Boolean,
    isChargingSettingsEnabled: Schema.Boolean,
    isChargingTargetSocEnabled: Schema.Boolean,
    isClimateTimerWeeklyActive: Schema.Boolean,
    isCustomerEsimSupported: Schema.Boolean,
    isDCSContractManagementSupported: Schema.Boolean,
    isDataPrivacyEnabled: Schema.Boolean,
    isEasyChargeEnabled: Schema.Boolean,
    isEvGoChargingSupported: Schema.Boolean,
    isLocationBasedChargingSettingsSupported: Schema.Boolean,
    isMiniChargingSupported: Schema.Boolean,
    isNonLscFeatureEnabled: Schema.Boolean,
    isOptimizedChargingSupported: Schema.Boolean,
    isPersonalPictureUploadSupported: Schema.Boolean,
    isPlugAndChargeSupported: Schema.Boolean,
    isRemoteEngineStartSupported: Schema.Boolean,
    isRemoteHistoryDeletionSupported: Schema.Boolean,
    isRemoteHistorySupported: Schema.Boolean,
    isRemoteParkingEes25Active: Schema.Boolean,
    isRemoteParkingSupported: Schema.Boolean,
    isRemoteServicesActivationRequired: Schema.Boolean,
    isRemoteServicesBookingRequired: Schema.Boolean,
    isScanAndChargeSupported: Schema.Boolean,
    isSustainabilityAccumulatedViewEnabled: Schema.Boolean,
    isSustainabilitySupported: Schema.Boolean,
    isThirdPartyAppStoreSupported: Schema.Boolean,
    isWifiHotspotServiceSupported: Schema.Boolean,
    lastStateCallState: Schema.Uppercased,
    lights: Schema.Boolean,
    locationBasedCommerceFeatures: Schema.Struct({
      fueling: Schema.Boolean,
      parking: Schema.Boolean,
      reservations: Schema.Boolean,
    }),
    lock: Schema.Boolean,
    remote360: Schema.Boolean,
    remoteChargingCommands: Schema.Struct({
      chargingControl: Schema.Array(Schema.Uppercased),
      flapControl: Schema.Array(Schema.Uppercased),
      plugControl: Schema.Array(Schema.Uppercased),
    }),
    remoteServices: Schema.Record({
      key: Schema.String,
      value: Schema.Struct({
        id: Schema.String,
        state: Schema.Uppercased,
      }),
    }),
    remoteSoftwareUpgrade: Schema.Boolean,
    sendPoi: Schema.Boolean,
    //  "specialThemeSupport": Array [],
    unlock: Schema.Boolean,
    vehicleFinder: Schema.Boolean,
    vehicleStateSource: Schema.Uppercased,
  }),
  state: Schema.Struct({
    chargingProfile: Schema.Struct({
      chargingControlType: Schema.Uppercased,
      chargingMode: Schema.Uppercased,
      chargingPreference: Schema.Uppercased,
      chargingSettings: Schema.Struct({
        acCurrentLimit: Schema.Number,
        hospitality: Schema.Uppercased,
        idcc: Schema.Uppercased,
        isAcCurrentLimitActive: Schema.Boolean,
        targetSoc: Schema.Number,
      }),
      climatisationOn: Schema.Boolean,
      departureTimes: Schema.Array(DepartureTime),
      reductionOfChargeCurrent: Schema.Struct({
        end: Time,
        start: Time,
      }),
    }),
    checkControlMessages: Schema.Array(
      Schema.Struct({
        severity: Schema.Uppercased,
        type: Schema.Uppercased,
      }),
    ),
    climateControlState: Schema.Struct({
      activity: Schema.Uppercased,
    }),
    climateTimers: Schema.Array(
      Schema.Struct({
        departureTime: Time,
        isWeeklyTimer: Schema.Boolean,
        timerAction: Schema.Uppercased,
        timerWeekDays: Schema.Array(Schema.Uppercased),
      }),
    ),
    combustionFuelLevel: Schema.Struct({
      range: Schema.Number,
      remainingFuelPercent: Schema.Number,
    }),
    currentMileage: Schema.Number,
    doorsState: Schema.Struct({
      combinedSecurityState: Schema.Uppercased,
      combinedState: Schema.Uppercased,
      hood: Schema.Uppercased,
      leftFront: Schema.Uppercased,
      leftRear: Schema.Uppercased,
      rightFront: Schema.Uppercased,
      rightRear: Schema.Uppercased,
      trunk: Schema.Uppercased,
    }),
    driverPreferences: Schema.Struct({
      lscPrivacyMode: Schema.Uppercased,
    }),
    electricChargingState: Schema.Struct({
      chargingLevelPercent: Schema.Number,
      chargingStatus: Schema.Uppercased,
      chargingTarget: Schema.Number,
      isChargerConnected: Schema.Boolean,
      range: Schema.Number,
    }),
    isLeftSteering: Schema.Boolean,
    isLscSupported: Schema.Boolean,
    lastFetched: Schema.DateFromString,
    lastUpdatedAt: Schema.DateFromString,
    location: Schema.Struct({
      address: Schema.Struct({ formatted: Schema.String }),
      coordinates: Coordinates,
      heading: Schema.Number,
    }),
    range: Schema.Number,
    //    "requiredServices": Array [],
    //    "securityOverviewMode": null,
    tireState: Schema.Struct({
      frontLeft: TireState,
      frontRight: TireState,
      rearLeft: TireState,
      rearRight: TireState,
    }),
    vehicleSoftwareVersion: Schema.Struct({
      iStep: Schema.Struct({
        iStep: Schema.Number,
        month: Schema.Number,
        seriesCluster: Schema.String,
        year: Schema.Number,
      }),
      puStep: Schema.Struct({
        month: Schema.Number,
        year: Schema.Number,
      }),
    }),
    windowsState: Schema.Struct({
      combinedState: Schema.Uppercased,
      leftFront: Schema.Uppercased,
      leftRear: Schema.Uppercased,
      rightFront: Schema.Uppercased,
      rightRear: Schema.Uppercased,
    }),
  }),
});
