// ============================================================
// Data
// ============================================================
// Squad roster and formation layouts, kept separate from script.js
// so updating the squad (transfers, new formation) never touches
// interaction/rendering logic. Loaded as a plain <script> before
// script.js, so these are shared globals — no bundler in this project.

const formations = {
  '4-3-3': [
    { id: 'gk', label: 'GK', x: 5, y: 50 },
    { id: 'lb', label: 'LB', x: 25, y: 10 },
    { id: 'cb1', label: 'CB', x: 20, y: 35 },
    { id: 'cb2', label: 'CB', x: 20, y: 65 },
    { id: 'rb', label: 'RB', x: 25, y: 90 },
    { id: 'cm1', label: 'CM', x: 50, y: 50 },
    { id: 'cm2', label: 'CM', x: 55, y: 30 },
    { id: 'cm3', label: 'CM', x: 55, y: 70 },
    { id: 'lw', label: 'LW', x: 75, y: 15 },
    { id: 'rw', label: 'RW', x: 75, y: 85 },
    { id: 'cf', label: 'CF', x: 85, y: 50 }
  ],
  '4-4-2': [
    { id: 'gk', label: 'GK', x: 5, y: 50 },
    { id: 'lb', label: 'LB', x: 25, y: 10 },
    { id: 'cb1', label: 'CB', x: 20, y: 35 },
    { id: 'cb2', label: 'CB', x: 20, y: 65 },
    { id: 'rb', label: 'RB', x: 25, y: 90 },
    { id: 'cm1', label: 'CM', x: 50, y: 35 },
    { id: 'cm2', label: 'CM', x: 50, y: 65 },
    { id: 'lm', label: 'LM', x: 55, y: 10 },
    { id: 'rm', label: 'RM', x: 55, y: 90 },
    { id: 'cf1', label: 'CF', x: 80, y: 35 },
    { id: 'cf2', label: 'CF', x: 80, y: 65 }
  ],
  '3-4-3': [
    { id: 'gk', label: 'GK', x: 5, y: 50 },
    { id: 'cb1', label: 'CB', x: 20, y: 25 },
    { id: 'cb2', label: 'CB', x: 20, y: 50 },
    { id: 'cb3', label: 'CB', x: 20, y: 75 },
    { id: 'lwb', label: 'LWB', x: 50, y: 10 },
    { id: 'cm1', label: 'CM', x: 50, y: 35 },
    { id: 'cm2', label: 'CM', x: 50, y: 65 },
    { id: 'rwb', label: 'RWB', x: 50, y: 90 },
    { id: 'lw', label: 'LW', x: 75, y: 15 },
    { id: 'rw', label: 'RW', x: 75, y: 85 },
    { id: 'cf', label: 'CF', x: 85, y: 50 }
  ],
  '4-2-3-1': [
    { id: 'gk', label: 'GK', x: 5, y: 50 },
    { id: 'lb', label: 'LB', x: 25, y: 10 },
    { id: 'cb1', label: 'CB', x: 20, y: 35 },
    { id: 'cb2', label: 'CB', x: 20, y: 65 },
    { id: 'rb', label: 'RB', x: 25, y: 90 },
    { id: 'dm1', label: 'DM', x: 45, y: 35 },
    { id: 'dm2', label: 'DM', x: 45, y: 65 },
    { id: 'lw', label: 'LW', x: 70, y: 15 },
    { id: 'rw', label: 'RW', x: 70, y: 85 },
    { id: 'om', label: 'OM', x: 65, y: 50 },
    { id: 'cf', label: 'CF', x: 85, y: 50 }
  ]
};

const playersByPosition = {
  'Brankáři': [
    { id: 'p1', number: 44, name: 'Jakub Surovčík', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], photo: 'img/surovcik.webp' },
    { id: 'p2', number: 47, name: 'Krisztián Hegyi', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], photo: 'img/hegyi.webp' }
  ],
  'Obránci': [
    { id: 'p3', number: 2, name: 'Martin Suchomel', role: 'RB', optimalPositions: ['LB', 'RB', 'LWB', 'RWB'], compatiblePositions: ['LM', 'RM'], photo: 'img/suchomel.webp' },
    { id: 'p4', number: 3, name: 'Pavel Kadeřábek', role: 'RB', optimalPositions: ['RB', 'RWB'], compatiblePositions: ['RM'], photo: 'img/kaderabek.webp' },
    { id: 'p5', number: 4, name: 'Jakub Martinec', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['CB'], photo: 'img/martinec.webp' },
    { id: 'p6', number: 6, name: 'Tobias Guddal', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/guddal.webp' },
    { id: 'p7', number: 11, name: 'Matěj Ryneš', role: 'LB', optimalPositions: ['LB', 'LWB'], compatiblePositions: ['LM'], photo: 'img/rynes.webp' },
    { id: 'p8', number: 15, name: 'Viktor Vitályos', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['LB'], photo: 'img/vitalyos.webp' },
    { id: 'p9', number: 16, name: 'Emmanuel Uchenna', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/uchenna.webp' },
    { id: 'p10', number: 19, name: 'Adam Ševínský', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/sevinsky.webp' },
    { id: 'p11', number: 30, name: 'Jaroslav Zelený', role: 'LB', optimalPositions: ['LB', 'LWB', 'CB'], compatiblePositions: ['LM'], photo: 'img/zeleny.webp' },
    { id: 'p12', number: 33, name: 'Elias Cobbaut', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/cobbaut.png' }
  ],
  'Záložníci': [
    { id: 'p13', number: 5, name: 'Santiago Eneme', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['OM', 'DM'], photo: 'img/eneme.webp' },
    { id: 'p14', number: 7, name: 'Josimar Alcócer', role: 'LW', optimalPositions: ['LW'], compatiblePositions: ['RW'], photo: 'img/alcocer.webp' },
    { id: 'p15', number: 8, name: 'Magnus Kofod Andersen', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], photo: 'img/andersen.webp' },
    { id: 'p16', number: 10, name: 'Adam Karabec', role: 'OM', optimalPositions: ['OM'], compatiblePositions: ['CM'], photo: 'img/karabec.webp' },
    { id: 'p17', number: 17, name: 'John Mercado', role: 'RW', optimalPositions: ['RW'], compatiblePositions: ['LW', 'OM'], photo: 'img/mercado.webp' },
    { id: 'p18', number: 18, name: 'Andrew Irving', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM', 'OM'], photo: 'img/irving.webp' },
    { id: 'p19', number: 20, name: 'Sivert Mannsverk', role: 'DM', optimalPositions: ['DM'], compatiblePositions: ['CM'], photo: 'img/mannsverk.webp' },
    { id: 'p20', number: 21, name: 'Joao Grimaldo', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: ['OM'], photo: 'img/grimaldo.webp' },
    { id: 'p21', number: 24, name: 'Dominik Hollý', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['LW', 'OM'], photo: 'img/holly.webp' },
    { id: 'p22', number: 26, name: 'Patrik Vydra', role: 'DM', optimalPositions: ['DM'], compatiblePositions: ['CB', 'CM'], photo: 'img/vydra.webp' },
    { id: 'p23', number: 27, name: 'Ebrima Singhateh', role: 'LW', optimalPositions: ['LW', 'CF', 'RW'], compatiblePositions: [], photo: 'img/singhateh.webp' },
    { id: 'p24', number: 28, name: 'Roman Macek', role: 'CM', optimalPositions: ['CM', 'DM'], compatiblePositions: [], photo: 'img/macek.webp' },
    { id: 'p25', number: 31, name: 'Matěj Jurásek', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: [], photo: 'img/matej-jurasek.webp' },
    { id: 'p26', number: 36, name: 'Garang Kuol', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: [], photo: 'img/kuol.webp' },
    { id: 'p27', number: 38, name: 'Hugo Sochůrek', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['OM', 'DM'], photo: 'img/sochurek.webp' },
    { id: 'p28', number: 52, name: 'Ondřej Penxa', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: [], photo: 'img/penxa.webp' }
  ],
  'Útočníci': [
    { id: 'p34', number: 15, name: 'Jonatan Braut Brunes', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['OM'], photo: 'img/brunes.webp' },
    { id: 'p35', number: 29, name: 'Matyáš Vojta', role: 'CF', optimalPositions: ['CF'], compatiblePositions: [], photo: 'img/vojta.webp' }
  ]
};

const players = Object.values(playersByPosition)
  .flat()
  .map((player) => ({
    ...player,
    photo: player.photo || 'img/surovcik.webp'
  }));
