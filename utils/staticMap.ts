const TILE_SIZE = 256;

function lonLatToTile(lon: number, lat: number, zoom: number) {
  const scale = 2 ** zoom;
  const x = Math.floor(((lon + 180) / 360) * scale);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale
  );
  return { x, y, scale };
}

export function getStaticMapTileUrl(latitude: number, longitude: number, zoom = 15): string {
  const { x, y } = lonLatToTile(longitude, latitude, zoom);
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

export function getMarkerOffsetInTile(
  latitude: number,
  longitude: number,
  zoom: number,
  width: number,
  height: number
) {
  const { x, y, scale } = lonLatToTile(longitude, latitude, zoom);
  const worldX = ((longitude + 180) / 360) * scale * TILE_SIZE;
  const latRad = (latitude * Math.PI) / 180;
  const worldY =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale * TILE_SIZE;

  const tileWorldX = x * TILE_SIZE;
  const tileWorldY = y * TILE_SIZE;

  return {
    left: ((worldX - tileWorldX) / TILE_SIZE) * width,
    top: ((worldY - tileWorldY) / TILE_SIZE) * height,
  };
}
