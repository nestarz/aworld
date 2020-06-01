const RADIANS = Math.PI / 180;

export const mercator = (latitude, longitude) => {
  const RADIUS = 6378137;
  const MAX = 85.0511287798;

  const y = Math.max(Math.min(MAX, latitude), -MAX) * RADIANS;
  return {
    x: RADIUS * longitude * RADIANS,
    y: RADIUS * Math.log(Math.tan(Math.PI / 4 + y / 2)),
  };
};
