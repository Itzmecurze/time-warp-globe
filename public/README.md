
# Interstellar Time Dilation Explorer Textures

This directory contains texture files needed for the 3D models:

- `earth-map.jpg` - Earth surface texture (diffuse map)
- `earth-normal.jpg` - Earth normal map for surface details
- `earth-specular.jpg` - Earth specular map for shininess
- `earth-clouds.png` - Earth clouds layer (transparent)
- `earth-night.jpg` - Earth night lights
- `miller-map.jpg` - Miller's planet water world texture (deep blue ocean texture)

Please ensure these files are placed in the `/public` folder for the application to load them correctly.

## Recommended Texture Sources

You can download free planet textures from:
- NASA Visible Earth: https://visibleearth.nasa.gov/
- Solar System Scope: https://www.solarsystemscope.com/textures/
- Planet Texture Maps: https://planetpixelemporium.com/planets.html

For Miller's planet:
- Create a custom water/ocean texture with deep blues and whites (for foam/waves)
- Miller's planet in the movie was a shallow water world with massive waves
- A blue-tinted water texture with smooth surface details works well

For reference, in the movie:
- Gargantua is a supermassive black hole with bright blue accretion disk
- Miller's planet has shallow water with giant tidal waves
- The Endurance spacecraft has a circular design with extending modules

## Setting Up in VS Code

To run this project in Visual Studio Code:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Add the texture files to the `/public` folder
4. Run `npm run dev` to start the development server
5. View the app in your browser at the provided URL (usually http://localhost:5173/)

## Dependencies

Main dependencies include:
- React
- Three.js for 3D rendering
- React Three Fiber (if used)
- Framer Motion for animations
- TailwindCSS for styling
