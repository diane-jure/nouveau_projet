/**
 * ICONS — toutes les icônes, dessinées en grille de pixels.
 *
 * Chaque icône est un tableau de chaînes : un caractère = un pixel.
 *   '#' = contour      'o' = remplissage      '.' = transparent
 *
 * Pour redessiner une icône, il suffit de réécrire sa grille ici.
 * Aucune couleur n'est fixée dans ce fichier : elles arrivent en props.
 */

import React from 'react';

/** Transforme une grille en SVG de carrés nets. */
function Grille({ motif, contour, remplissage, taille = 16, style }) {
  const n = motif[0].length;
  const carres = [];
  motif.forEach((ligne, y) =>
    [...ligne].forEach((c, x) => {
      if (c === '.') return;
      carres.push(
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1"
          fill={c === '#' ? contour : remplissage} />
      );
    })
  );
  return (
    <svg viewBox={`0 0 ${n} ${motif.length}`} width={taille} height={taille}
      shapeRendering="crispEdges" style={{ display: 'block', flex: 'none', ...style }}>
      {carres}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  LES GRILLES                                                        */
/* ------------------------------------------------------------------ */

const MOTIFS = {
  coeur: [
    '.##..##.',
    '#oo##oo#',
    '#oooooo#',
    '#oooooo#',
    '.#oooo#.',
    '..#oo#..',
    '...##...',
    '........',
  ],
  journal: [
    '.######.',
    '#oooooo#',
    '#o####o#',
    '#oooooo#',
    '#o####o#',
    '#oooooo#',
    '#oooooo#',
    '.######.',
  ],
  piece: [
    '..####..',
    '.#oooo#.',
    '#oo##oo#',
    '#o#oo#o#',
    '#o#oo#o#',
    '#oo##oo#',
    '.#oooo#.',
    '..####..',
  ],
  cartes: [
    '..#####.',
    '.#ooooo#',
    '#ooo#oo#',
    '#oo###o#',
    '#ooo#oo#',
    '#ooooo##',
    '#ooooo#.',
    '.#####..',
  ],
  retour: [
    '...#....',
    '..##....',
    '.###....',
    '########',
    '.###....',
    '..##....',
    '...#....',
    '........',
  ],
  plus: [
    '...##...',
    '...##...',
    '...##...',
    '########',
    '########',
    '...##...',
    '...##...',
    '........',
  ],
  etoile: [
    '...##...',
    '...##...',
    '#.####.#',
    '.######.',
    '..####..',
    '.##..##.',
    '##....##',
    '........',
  ],
  valide: [
    '.......#',
    '......##',
    '.....##.',
    '#...##..',
    '##.##...',
    '.####...',
    '..##....',
    '........',
  ],
  ferme: [
    '#......#',
    '##....##',
    '.##..##.',
    '..####..',
    '..####..',
    '.##..##.',
    '##....##',
    '#......#',
  ],
  bas: [
    '........',
    '#......#',
    '##....##',
    '.##..##.',
    '..####..',
    '...##...',
    '........',
    '........',
  ],
  haut: [
    '........',
    '........',
    '...##...',
    '..####..',
    '.##..##.',
    '##....##',
    '#......#',
    '........',
  ],
  disquette: [
    '########',
    '#o####o#',
    '#o####o#',
    '#oooooo#',
    '#o####o#',
    '#o#..#o#',
    '#o####o#',
    '########',
  ],
};

/** Sigils — le médaillon de chaque voie, en attendant de vraies illustrations. */
const SIGILS = [
  ['...##...', '..####..', '.##..##.', '##....##', '##....##', '.##..##.', '..####..', '...##...'],
  ['..####..', '.#o..o#.', '#o....o#', '#......#', '#o....o#', '.#o..o#.', '..####..', '........'],
  ['....#...', '...###..', '..#o#o#.', '.#ooooo#', '..#o#o#.', '...###..', '....#...', '........'],
  ['#......#', '.#....#.', '..####..', '.#oooo#.', '.#oooo#.', '..####..', '.#....#.', '#......#'],
];

/* ------------------------------------------------------------------ */
/*  COMPOSANTS                                                         */
/* ------------------------------------------------------------------ */

export function Icone({ nom, contour, remplissage, taille = 16, style }) {
  const motif = MOTIFS[nom];
  if (!motif) return null;
  return <Grille motif={motif} contour={contour} remplissage={remplissage ?? contour}
    taille={taille} style={style} />;
}

export function Sigil({ index = 0, contour, remplissage, taille = 48 }) {
  return <Grille motif={SIGILS[index % SIGILS.length]} contour={contour}
    remplissage={remplissage ?? contour} taille={taille} />;
}

/** Rangée de cœurs : l'énergie disponible. */
export function Coeurs({ valeur, total = 5, plein, vide, taille = 18 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {Array.from({ length: total }, (_, i) => (
        <Icone key={i} nom="coeur" taille={taille}
          contour={i < valeur ? plein : vide}
          remplissage={i < valeur ? plein : 'transparent'} />
      ))}
    </span>
  );
}

export const NOMS_ICONES = Object.keys(MOTIFS);
