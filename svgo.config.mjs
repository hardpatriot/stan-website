/**
 * Optimisation des emojis 3D.
 *
 * Ils viennent du pack de l'app et sortent d'un export Figma : coordonnées à
 * six décimales, métadonnées inutiles, identifiants verbeux. On réduit sans
 * toucher au rendu.
 *
 * Deux réglages comptent :
 * - `removeViewBox` désactivé, sinon le SVG reprend une taille figée et le
 *   flou revient
 * - `cleanupIds` désactivé, car les identifiants sont réécrits ensuite pour
 *   fabriquer la planche de symboles, et deux emojis ne doivent pas se
 *   retrouver avec le même identifiant de dégradé.
 */
const config = {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: false,
        },
      },
    },
  ],
};

export default config;
