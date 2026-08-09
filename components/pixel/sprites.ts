/**
 * Pixel sprite library.
 *
 * Every sprite is an array of equal-length rows; each character maps to a
 * colour in PALETTE, and "." is transparent. Grids are 24 wide by convention
 * so sprites sit at a consistent scale when composed in a scene; height is
 * free.
 *
 * The palette carries a light/base/dark triple for most hues. That's what
 * separates a shape from an illustration — a sprite drawn in one flat colour
 * reads as a symbol, the same shape with a highlight and a shadow reads as an
 * object.
 *
 * Adding a sprite is just adding an entry here — the renderer and the scene
 * player pick it up with no other changes.
 */

export const PALETTE: Record<string, string> = {
  K: "#23262b", // outline
  k: "#454c57", // soft outline
  W: "#ffffff",
  w: "#e9edf2", // paper
  M: "#c3ccd6", // light stone
  S: "#98a3af", // stone
  s: "#69737f", // shadow
  Y: "#ffd84d", // yellow
  y: "#fff2ab", // yellow highlight
  O: "#f0a32e", // amber
  o: "#c07a14", // amber shadow
  G: "#5ec860", // green
  g: "#93e795", // green highlight
  D: "#2f7a3a", // green shadow
  B: "#4a86e8", // blue
  b: "#93c2f7", // blue highlight
  U: "#2a5cb0", // blue shadow
  C: "#78d6f0", // cyan
  c: "#c6f0fb", // cyan highlight
  A: "#2b93bd", // cyan shadow
  N: "#b07a45", // brown
  n: "#d8a26d", // brown highlight
  E: "#6b4425", // brown shadow
  P: "#f5cba7", // skin
  R: "#e35454", // red
  r: "#f79191", // red highlight
  V: "#9b7fd4", // violet
  X: "#f490b4", // pink
  F: "#e2231a", // ADP red — matches the walkthrough in public/
  f: "#fcebeb", // ADP red tint
  I: "#141b5c", // ADP navy
};

export const SPRITES = {
  /** Radiant sun with a shaded core and alternating rays. */
  sun: [
    "...........YY...........",
    "..Y........YY........Y..",
    "...Y.......YY.......Y...",
    "....y......yy......y....",
    ".......OOOOOOOOOO.......",
    ".....OOyyyyyyyyyyOO.....",
    "....OyyyyYYYYYYyyyyO....",
    "...OyyYYYYYYYYYYYYyyO...",
    "..OyYYYYYYYYYYYYYYYYyO..",
    "YY.OyYYYYYYYYYYYYYYyO.YY",
    "..OyYYYYYYYYYYYYYYYYyO..",
    "...OyyYYYYYYYYYYYYyyO...",
    "....OyyyyYYYYYYyyyyO....",
    ".....OOyyyyyyyyyyOO.....",
    ".......OOOOOOOOOO.......",
    "....y......yy......y....",
    "...Y.......YY.......Y...",
    "..Y........YY........Y..",
    "...........YY...........",
  ],

  /** Leaf with a central vein and a lit upper edge. */
  leaf: [
    "..................DD....",
    ".................DD.....",
    "................DD......",
    ".......gggggggDD........",
    "....ggggggggggDgg.......",
    "..gggGGGGGGGGGDGgggg....",
    ".ggGGGGGGGGGGGDGGGGgg...",
    "gGGGGGGGGGGGGGDGGGGGGg..",
    "gGGGGGGGGGGGGDGGGGGGGg..",
    ".gGGGGGGGGGGDGGGGGGGg...",
    "..gGGGGGGGGDGGGGGGg.....",
    "...gGGGGGGDGGGGGg.......",
    ".....gGGGDGGGGg.........",
    "........DGGg............",
    ".......D................",
    "......D.................",
  ],

  /** Droplet with a specular highlight. */
  water: [
    "...........C............",
    "..........CAC...........",
    "..........CAC...........",
    ".........CCAAC..........",
    "........CCcAAAC.........",
    ".......CCccAAAAC........",
    "......CCcccAAAAAC.......",
    ".....CCcccAAAAAAAC......",
    ".....CccccAAAAAAAC......",
    ".....CCcccAAAAAAAC......",
    "......CCcAAAAAAAC.......",
    ".......CAAAAAAAC........",
    "........CAAAAAC.........",
    ".........CCCCC..........",
  ],

  /** CO2 — a heavy grey cloud. */
  co2: [
    ".......ssssss...........",
    ".....ssSSSSSSss.........",
    "...ssSSSSSSSSSSss.......",
    "..sSSSSSSSSSSSSSSs......",
    ".sSSSSSSSSSSSSSSSSs.....",
    ".sSSSSSSSSSSSSSSSSs.....",
    "..sSSSSSSSSSSSSSSs......",
    "...ssSSSSSSSSSSss.......",
    ".....ssssssssss.........",
  ],

  /** O2 — light bubbles. */
  oxygen: [
    ".....cccc.......cccc....",
    "...ccCCCCcc...ccCCCCcc..",
    "..cCCWWWWCCc.cCCWWWWCCc.",
    "..cCWWWWWWCc.cCWWWWWWCc.",
    "..cCCWWWWCCc.cCCWWWWCCc.",
    "...ccCCCCcc...ccCCCCcc..",
    ".....cccc.......cccc....",
  ],

  /** Soil with scattered stones. */
  soil: [
    "nnnnnnnnnnnnnnnnnnnnnnnn",
    "NNNNNNNNNNNNNNNNNNNNNNNN",
    "NNENNNNNENNNNNENNNNNENNN",
    "NNNNNENNNNNNENNNNNNNNENN",
    "EEEEEEEEEEEEEEEEEEEEEEEE",
  ],

  /** Form with ruled lines and a signature block. */
  document: [
    "....KKKKKKKKKKKKKKKK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWWkkkkkkkkkWWWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWWkkkkkkkkkkkWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWWkkkkkkkkkWWWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWWkkkkkkkkkkkWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWWBBBBBBWWWWWWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWWkkkkkkWWWWWWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KKKKKKKKKKKKKKKK....",
  ],

  /** Classical bank — pediment, columns, portico steps, flag. */
  bank: [
    "...........KK...........",
    "..........KRRK..........",
    "..........KRRK..........",
    "..........KKK...........",
    ".........KKKKKK.........",
    "........KKwwwwKK........",
    ".......KKwwwwwwKK.......",
    "......KKwwwwwwwwKK......",
    ".....KKwwwYYYYwwwKK.....",
    "....KKwwwwYYYYwwwwKK....",
    "...KKwwwwwwwwwwwwwwKK...",
    "..KKKKKKKKKKKKKKKKKKKK..",
    "..KMMMMMMMMMMMMMMMMMMK..",
    "..KKKKKKKKKKKKKKKKKKKK..",
    "..sMMMssMMMMMMMMssMMMs..",
    "..sMMMssMMMMMMMMssMMMs..",
    "..sMMMssKnnnnnnKssMMMs..",
    "..sMMMssKnnEEnnKssMMMs..",
    "..sMMMssKnnnnnnKssMMMs..",
    "..sMMMssKnnnnnnKssMMMs..",
    "..KKKKKKKKKKKKKKKKKKKK..",
    ".MMMMMMMMMMMMMMMMMMMMMM.",
    "MMMMMMMMMMMMMMMMMMMMMMMM",
    "ssssssssssssssssssssssss",
  ],

  /** Coin with a struck rim and a currency mark. */
  coin: [
    "........OOOOOO..........",
    "......OOyyyyyyOO........",
    ".....OyyYYYYYYyyO.......",
    "....OyYYYYoYYYYYyO......",
    "...OyYYYYYoYYYYYYyO.....",
    "...OyYYYoooooYYYYyO.....",
    "...OyYYYYoYYYYYYYyO.....",
    "...OyYYYYoYYYYYYYyO.....",
    "...OyYYYoooooYYYYyO.....",
    "....OyYYYYoYYYYYyO......",
    ".....OyyYYYoYYyyO.......",
    "......OOyyyyyyOO........",
    "........OOOOOO..........",
  ],

  /** Person, waist up. */
  person: [
    ".........EEEEEE.........",
    "........ENNNNNNE........",
    ".......ENPPPPPPNE.......",
    ".......NPPPPPPPPN.......",
    ".......NPPKPPKPPN.......",
    ".......NPPPPPPPPN.......",
    "........NPPRRPPN........",
    ".........NPPPPN.........",
    "..........PPPP..........",
    "......BBBBBBBBBBBB......",
    ".....BbBBBBBBBBBBbB.....",
    "....BbBBBBBWWBBBBBBbB...",
    "....BBBBBBBWWBBBBBBBB...",
    "....BBBBBBBWWBBBBBBBB...",
    "....UBBBBBBBBBBBBBBU....",
    "....UUU..........UUU....",
  ],

  /** Wall calendar with a highlighted date. */
  calendar: [
    ".....K......KKKK....K...",
    ".....K......K..K....K...",
    "..KKKKKKKKKKKKKKKKKKKK..",
    "..KRRRRRRRRRRRRRRRRRRK..",
    "..KRRRRRRRRRRRRRRRRRRK..",
    "..KWWWWWWWWWWWWWWWWWWK..",
    "..KWkkWkkWkkWkkWkkWWWK..",
    "..KWWWWWWWWWWWWWWWWWWK..",
    "..KWkkWkkWkkWkkWkkWWWK..",
    "..KWWWWWWWWWWWWWWWWWWK..",
    "..KWkkWkkWBBWkkWkkWWWK..",
    "..KWWWWWWWBBWWWWWWWWWK..",
    "..KWkkWkkWkkWkkWkkWWWK..",
    "..KWWWWWWWWWWWWWWWWWWK..",
    "..KKKKKKKKKKKKKKKKKKKK..",
  ],

  /** Tick, with a lit inner edge. */
  check: [
    "....................GD..",
    "..................GGgD..",
    "................GGggD...",
    "..............GGggD.....",
    "....D.......GGggD.......",
    "...DGD.....GGggD........",
    "..DGgGD...GGggD.........",
    "...DGgGD.GGggD..........",
    "....DGgGGGggD...........",
    ".....DGgGggD............",
    "......DGggD.............",
    ".......DGD..............",
    "........D...............",
  ],

  /** Monitor on a stand, screen lit. */
  computer: [
    "..KKKKKKKKKKKKKKKKKKKK..",
    "..KUUUUUUUUUUUUUUUUUUK..",
    "..KUBBBBBBBBBBBBBBBBUK..",
    "..KUBbbBBBBBBBBBBBBBUK..",
    "..KUBbBBBBBBBBBBBBBBUK..",
    "..KUBBBBBBBBBBBBBBBBUK..",
    "..KUBBBBBBBBBBBBBBBBUK..",
    "..KUUUUUUUUUUUUUUUUUUK..",
    "..KKKKKKKKKKKKKKKKKKKK..",
    "........KSSSSK..........",
    "........KSSSSK..........",
    "......KKSSSSSSKK........",
    "....KKSSSSSSSSSSKK......",
    "....KKKKKKKKKKKKKK......",
  ],

  /** Chunky arrow with a shaded underside. */
  arrow: [
    "............KK..........",
    "............KkK.........",
    "KKKKKKKKKKKKKKkK........",
    "KkkkkkkkkkkkkkkkK.......",
    "KkkkkkkkkkkkkkkkkK......",
    "KkkkkkkkkkkkkkkkK.......",
    "KKKKKKKKKKKKKKkK........",
    "............KkK.........",
    "............KK..........",
  ],

  /** Padlock, shackle closed. */
  lock: [
    ".......KKKKKK...........",
    "......KKMMMMKK..........",
    ".....KKM....MKK.........",
    ".....KM......MK.........",
    ".....KM......MK.........",
    "...KKKKKKKKKKKKKK.......",
    "...KyYYYYYYYYYYoK.......",
    "...KYYYYKKKKYYYoK.......",
    "...KYYYYKKKKYYYoK.......",
    "...KYYYYYKKYYYYoK.......",
    "...KYYYYYKKYYYYoK.......",
    "...KYYYYYYYYYYYoK.......",
    "...KooooooooooooK.......",
    "...KKKKKKKKKKKKKK.......",
  ],

  /** Pay stub — branded header band, ruled figures, net pay picked out. */
  payslip: [
    "....KKKKKKKKKKKKKKKK....",
    "....KFFFFFFFFFFFFFFK....",
    "....KFFFFFFFFFFFFFFK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWkkkkkWWWWWWWWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWkkkkWWWkkkkWWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWkkkkWWWkkkkWWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWkkkkWWWkkkkWWK....",
    "....KWWWWWWWWWWWWWWK....",
    "....KWWWWWWWWGGGGGWK....",
    "....KWWWWWWWWGGGGGWK....",
    "....KKKKKKKKKKKKKKKK....",
  ],

  /** Sealed envelope with a wax-red flap line. */
  envelope: [
    "..KKKKKKKKKKKKKKKKKKKK..",
    "..KWWWWWWWWWWWWWWWWWWK..",
    "..KWkWWWWWWWWWWWWWWkWK..",
    "..KWWkWWWWWWWWWWWWkWWK..",
    "..KWWWkWWWWWWWWWWkWWWK..",
    "..KWWWWkWWWWWWWWkWWWWK..",
    "..KWWWWWkWWWWWWkWWWWWK..",
    "..KWWWWWWkWWWWkWWWWWWK..",
    "..KWWWWWWWkRRkWWWWWWWK..",
    "..KWWWWWWWWRRWWWWWWWWK..",
    "..KWWWWWWWWWWWWWWWWWWK..",
    "..KKKKKKKKKKKKKKKKKKKK..",
  ],
} satisfies Record<string, string[]>;

export type SpriteName = keyof typeof SPRITES;

/** Sprite names arriving from the backend are untrusted strings. */
export function isSpriteName(value: string): value is SpriteName {
  return Object.prototype.hasOwnProperty.call(SPRITES, value);
}
