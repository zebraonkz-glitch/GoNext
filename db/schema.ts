export const CREATE_SCHEMA_VERSION_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
  );
`;

export const CREATE_PLACES_TABLE = `
  CREATE TABLE IF NOT EXISTS places (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    visitlater INTEGER NOT NULL DEFAULT 0,
    liked INTEGER NOT NULL DEFAULT 0,
    latitude REAL,
    longitude REAL,
    createdAt TEXT NOT NULL
  );
`;

export const CREATE_TRIPS_TABLE = `
  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    startDate TEXT,
    endDate TEXT,
    current INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  );
`;

export const CREATE_TRIP_PLACES_TABLE = `
  CREATE TABLE IF NOT EXISTS trip_places (
    id TEXT PRIMARY KEY NOT NULL,
    tripId TEXT NOT NULL,
    placeId TEXT NOT NULL,
    orderIndex INTEGER NOT NULL,
    visited INTEGER NOT NULL DEFAULT 0,
    visitDate TEXT,
    notes TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (placeId) REFERENCES places(id) ON DELETE CASCADE,
    UNIQUE(tripId, placeId)
  );
`;

export const CREATE_PHOTOS_TABLE = `
  CREATE TABLE IF NOT EXISTS photos (
    id TEXT PRIMARY KEY NOT NULL,
    entityType TEXT NOT NULL,
    entityId TEXT NOT NULL,
    filePath TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`;

export const CREATE_COMPANIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS companions (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL
  );
`;

export const CREATE_PLACE_COMPANIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS place_companions (
    placeId TEXT NOT NULL,
    companionId TEXT NOT NULL,
    PRIMARY KEY (placeId, companionId),
    FOREIGN KEY (placeId) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (companionId) REFERENCES companions(id) ON DELETE CASCADE
  );
`;
