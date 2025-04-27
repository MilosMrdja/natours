/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibXJkamEiLCJhIjoiY205dmR2eDMxMGYwcDJrc201eG1rem16ZiJ9.n3K0VAeMZdwZheztdxSF1Q';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mrdja/cm9ve252n005m01sihkwrayck',
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    zoom: 4,
    center: [-118.113491, 34.111745],
    scrollZoom: false,
    //interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 200,
      right: 200,
    },
  });
};
