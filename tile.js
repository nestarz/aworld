import { mercator } from "./projection.js";

const projectCoordinate = (latitude, longitude, scale) => {
  const { x, y } = mercator(latitude, longitude);
  return {
    x: x * scale,
    y: y * scale,
  };
};

const coordinateToPoint = (
  latitude = 0,
  longitude = 0,
  width = 0,
  height = 0,
  scale = 0,
  bounds = {
    xMax: 0,
    xMin: 0,
    yMax: 0,
    yMin: 0,
  }
) => {
  const point = projectCoordinate(latitude, longitude, scale);

  const xScale = width / Math.abs(bounds.xMax - bounds.xMin);
  const yScale = height / Math.abs(bounds.yMax - bounds.yMin);
  const cscale = xScale < yScale ? xScale : yScale;

  return {
    x: (point.x - bounds.xMin) * cscale,
    y: (bounds.yMax - point.y) * cscale,
  };
};

const addMarker = (context, { x, y, size, color }) => {
  const center = coordinateToPoint(x, y);

  context.beginPath();
  context.arc(center.x, center.y, size, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
};

const draw = (
  tile = document.createElement("canvas"),
  geojson = [],
  bounds = {},
  landColor = "#fff",
  scale = 1,
  markers = []
) => {
  const { width, height } = tile;
  const context = Object.assign(tile.getContext("2d"), {
    fillStyle: landColor,
  });

  for (let i = 0; i < geojson.length; i++) {
    const coords = geojson[i].geometry.coordinates[0];

    for (let j = 0; j < coords.length; j++) {
      const { x, y } = coordinateToPoint(
        coords[j][1],
        coords[j][0],
        width,
        height,
        scale,
        bounds
      );
      if (j === 0) {
        context.beginPath();
        context.moveTo(x, y);
      } else context.lineTo(x, y);
    }

    context.fill();
  }

  if (markers)
    for (let i = 0; i < markers.length; i++) addMarker(context, markers[i]);
};

const getBounds = (geojson, scale) => {
  const bounds = {};

  for (let i = 0; i < geojson.length; i++) {
    const coords = geojson[i].geometry.coordinates[0];

    for (let j = 0; j < coords.length; j++) {
      const { x, y } = projectCoordinate(coords[j][1], coords[j][0], scale);

      bounds.xMin = bounds.xMin < x ? bounds.xMin : x;
      bounds.xMax = bounds.xMax > x ? bounds.xMax : x;
      bounds.yMin = bounds.yMin < y ? bounds.yMin : y;
      bounds.yMax = bounds.yMax > y ? bounds.yMax : y;
    }
  }

  return bounds;
};

export const createTile = (geojson, zoom, mapcenter, landColor, markers) => {
  const features = geojson.features || geojson;
  const scale = Math.pow(2, parseInt(zoom));
  const bounds = getBounds(features, scale);

  const width = Math.ceil(256 * scale);
  const height = Math.ceil(width / 1.041975309);
  const center = coordinateToPoint(
    mapcenter[0],
    mapcenter[1],
    width,
    height,
    scale,
    bounds
  );
  const tile = Object.assign(document.createElement("canvas"), {
    width,
    height,
  });

  draw(tile, features, bounds, landColor, scale, markers);
  return { canvas: tile, center, width, height };
};
