/**
 * PostCSS Configuration
 * 
 * PostCSS is a CSS post-processor that transforms CSS with JavaScript plugins.
 * This configuration sets up the essential plugins for modern CSS development
 * with Tailwind CSS and browser compatibility.
 */

export default {
  plugins: {
    // Tailwind CSS plugin - processes Tailwind directives and generates utility classes
    // This transforms @tailwind directives into actual CSS rules
    tailwindcss: {},
    
    // Autoprefixer plugin - automatically adds vendor prefixes to CSS properties
    // Ensures browser compatibility by adding -webkit-, -moz-, etc. prefixes as needed
    autoprefixer: {},
  },
}
