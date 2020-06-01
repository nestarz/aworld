import createMap from "./map.js";

const el = document.body.appendChild(document.createElement("div"));

fetch("world.json")
  .then((r) => r.json())
  .then((world) =>
    createMap(el, world, {
      zoom: 3,
      center: [10, 20],
    })
  )
  .then(({ map }) => el.appendChild(map));
