import { createTile } from "./tile.js";

const draw = (map, tile, waterColor) => {
  const { width, height } = map;
  const context = map.getContext("2d");
  context.fillStyle = waterColor;
  context.fillRect(0, 0, width, height);

  const center = {
    x: Math.ceil(width / 2 - tile.center.x),
    y: Math.ceil(height / 2 - tile.center.y),
  };

  const tilesBefore = Math.ceil(center.x / tile.width);
  const tilesAfter = Math.ceil((width - (center.x + tile.width)) / tile.width);

  for (let tileCount = 1; tileCount <= tilesBefore; tileCount++) {
    context.drawImage(tile.canvas, center.x - tile.width * tileCount, center.y);
  }
  for (let tileCount = 1; tileCount <= tilesAfter; tileCount++) {
    context.drawImage(tile.canvas, center.x + tile.width * tileCount, center.y);
  }
  context.drawImage(tile.canvas, center.x, center.y);
};

export default (
  el = document.body,
  geojson = {},
  {
    zoom = 0,
    center = [0, 0],
    waterColor = "#b3d1ff",
    landColor = "#fff",
    markers = [
      {
        color: "#333",
        size: 5,
      },
    ],
  } = {}
) => {
  const map = document.createElement("canvas");
  const tile = createTile(geojson, zoom, center, landColor, markers);

  new ResizeObserver(() => {
    const { width, height } = el.getBoundingClientRect();
    Object.assign(map, { width, height });
    draw(map, tile, waterColor);
  }).observe(el);

  return { map, tile };
};
