// ============================================================
// Data
// ============================================================
// Squad roster (`playersByPosition`, `players`), club list (`clubs`)
// and formation layouts (`formations`) live in data.js, loaded
// before script.js.

const clubs = [
  { id: 'sparta', name: 'Sparta', logo: 'img/logos/sparta.svg' },
  { id: 'slavia', name: 'Slavia', logo: 'img/logos/slavia.png' }
];

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
    { id: 'p1', club: 'sparta', number: 44, name: 'Jakub Surovčík', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], photo: 'img/sparta/surovcik.webp' },
    { id: 'p2', club: 'sparta', number: 47, name: 'Krisztián Hegyi', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], photo: 'img/sparta/hegyi.webp' },
    { id: 's1', club: 'slavia', number: 1, name: 'Ondřej Kolář', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], photo: 'img/slavia/kolar.png' },
    { id: 's2', club: 'slavia', number: 29, name: 'Nazar Domchak', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], photo: 'img/slavia/domchak.png' },
    { id: 's3', club: 'slavia', number: 35, name: 'Jakub Markovič', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], photo: 'img/slavia/markovic.png' },
    { id: 's4', club: 'slavia', number: 36, name: 'Jindřich Staněk', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], photo: 'img/slavia/stanek.png' }
  ],
  'Obránci': [
    { id: 'p3', club: 'sparta', number: 2, name: 'Martin Suchomel', role: 'RB', optimalPositions: ['LB', 'RB', 'LWB', 'RWB'], compatiblePositions: ['LM', 'RM'], photo: 'img/sparta/suchomel.webp' },
    { id: 'p4', club: 'sparta', number: 3, name: 'Pavel Kadeřábek', role: 'RB', optimalPositions: ['RB', 'RWB'], compatiblePositions: ['RM'], photo: 'img/sparta/kaderabek.webp' },
    { id: 'p5', club: 'sparta', number: 4, name: 'Jakub Martinec', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['CB'], photo: 'img/sparta/martinec.webp' },
    { id: 'p6', club: 'sparta', number: 6, name: 'Tobias Guddal', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/sparta/guddal.webp' },
    { id: 'p7', club: 'sparta', number: 11, name: 'Matěj Ryneš', role: 'LB', optimalPositions: ['LB', 'LWB'], compatiblePositions: ['LM'], photo: 'img/sparta/rynes.webp' },
    { id: 'p8', club: 'sparta', number: 15, name: 'Viktor Vitályos', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['LB'], photo: 'img/sparta/vitalyos.webp' },
    { id: 'p9', club: 'sparta', number: 16, name: 'Emmanuel Uchenna', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/sparta/uchenna.webp' },
    { id: 'p10', club: 'sparta', number: 19, name: 'Adam Ševínský', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/sparta/sevinsky.webp' },
    { id: 'p11', club: 'sparta', number: 30, name: 'Jaroslav Zelený', role: 'LB', optimalPositions: ['LB', 'LWB', 'CB'], compatiblePositions: ['LM'], photo: 'img/sparta/zeleny.webp' },
    { id: 'p12', club: 'sparta', number: 33, name: 'Elias Cobbaut', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/sparta/cobbaut.png' },
    { id: 's5', club: 'slavia', number: 2, name: 'Štěpán Chaloupek', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['RB'], photo: 'img/slavia/chaloupek.png' },
    { id: 's6', club: 'slavia', number: 3, name: 'Tomáš Holeš', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['RB'], photo: 'img/slavia/holes.png' },
    { id: 's7', club: 'slavia', number: 4, name: 'David Zima', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/slavia/zima.png' },
    { id: 's8', club: 'slavia', number: 5, name: 'Igoh Ogbu', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/slavia/ogbu.png' },
    { id: 's9', club: 'slavia', number: 6, name: "Ange N'Guessan", role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/slavia/nguessan.png' },
    { id: 's10', club: 'slavia', number: 14, name: 'Samuel Isife', role: 'RB', optimalPositions: ['RB', 'RWB'], compatiblePositions: ['RM'], photo: 'img/slavia/isife.png' },
    { id: 's11', club: 'slavia', number: 27, name: 'Tomáš Vlček', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/slavia/vlcek.png' },
    { id: 's12', club: 'slavia', number: 33, name: 'Denis Halinský', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/slavia/halinsky.png' },
    { id: 's13', club: 'slavia', number: 39, name: 'David Jurásek', role: 'LB', optimalPositions: ['LB', 'LWB'], compatiblePositions: ['LM'], photo: 'img/slavia/jurasek.png' },
    { id: 's14', club: 'slavia', number: 41, name: 'Sahmkou Camara', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/slavia/camara.png' },
    { id: 's15', club: 'slavia', number: 42, name: 'Mikuláš Konečný', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], photo: 'img/slavia/konecny.png' },
    { id: 's16', club: 'slavia', number: 43, name: 'Eliáš Piták', role: 'RB', optimalPositions: ['RB', 'RWB'], compatiblePositions: ['RM'], photo: 'img/slavia/pitak.png' }
  ],
  'Záložníci': [
    { id: 'p13', club: 'sparta', number: 5, name: 'Santiago Eneme', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['OM', 'DM'], photo: 'img/sparta/eneme.webp' },
    { id: 'p14', club: 'sparta', number: 7, name: 'Josimar Alcócer', role: 'LW', optimalPositions: ['LW'], compatiblePositions: ['RW'], photo: 'img/sparta/alcocer.webp' },
    { id: 'p15', club: 'sparta', number: 8, name: 'Magnus Kofod Andersen', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], photo: 'img/sparta/andersen.webp' },
    { id: 'p16', club: 'sparta', number: 10, name: 'Adam Karabec', role: 'OM', optimalPositions: ['OM'], compatiblePositions: ['CM'], photo: 'img/sparta/karabec.webp' },
    { id: 'p17', club: 'sparta', number: 17, name: 'John Mercado', role: 'RW', optimalPositions: ['RW'], compatiblePositions: ['LW', 'OM'], photo: 'img/sparta/mercado.webp' },
    { id: 'p18', club: 'sparta', number: 18, name: 'Andrew Irving', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM', 'OM'], photo: 'img/sparta/irving.webp' },
    { id: 'p19', club: 'sparta', number: 20, name: 'Sivert Mannsverk', role: 'DM', optimalPositions: ['DM'], compatiblePositions: ['CM'], photo: 'img/sparta/mannsverk.webp' },
    { id: 'p20', club: 'sparta', number: 21, name: 'Joao Grimaldo', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: ['OM'], photo: 'img/sparta/grimaldo.webp' },
    { id: 'p21', club: 'sparta', number: 24, name: 'Dominik Hollý', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['LW', 'OM'], photo: 'img/sparta/holly.webp' },
    { id: 'p22', club: 'sparta', number: 26, name: 'Patrik Vydra', role: 'DM', optimalPositions: ['DM'], compatiblePositions: ['CB', 'CM'], photo: 'img/sparta/vydra.webp' },
    { id: 'p23', club: 'sparta', number: 27, name: 'Ebrima Singhateh', role: 'LW', optimalPositions: ['LW', 'CF', 'RW'], compatiblePositions: [], photo: 'img/sparta/singhateh.webp' },
    { id: 'p24', club: 'sparta', number: 28, name: 'Roman Macek', role: 'CM', optimalPositions: ['CM', 'DM'], compatiblePositions: [], photo: 'img/sparta/macek.webp' },
    { id: 'p25', club: 'sparta', number: 31, name: 'Matěj Jurásek', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: [], photo: 'img/sparta/matej-jurasek.webp' },
    { id: 'p26', club: 'sparta', number: 36, name: 'Garang Kuol', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: [], photo: 'img/sparta/kuol.webp' },
    { id: 'p27', club: 'sparta', number: 38, name: 'Hugo Sochůrek', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['OM', 'DM'], photo: 'img/sparta/sochurek.webp' },
    { id: 'p28', club: 'sparta', number: 52, name: 'Ondřej Penxa', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: [], photo: 'img/sparta/penxa.webp' },
    { id: 's17', club: 'slavia', number: 8, name: 'Oskar Kubiak', role: 'LM', optimalPositions: ['LM'], compatiblePositions: ['LB'], photo: 'img/slavia/kobiak.png' },
    { id: 's18', club: 'slavia', number: 10, name: 'Danijel Šturm', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: ['CF'], photo: 'img/slavia/sturm.png' },
    { id: 's19', club: 'slavia', number: 11, name: 'Youssoupha Sanyang', role: 'LW', optimalPositions: ['LW'], compatiblePositions: ['RW'], photo: 'img/slavia/sanyang.png' },
    { id: 's20', club: 'slavia', number: 15, name: 'Mubarak Suleiman', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], photo: 'img/slavia/suleiman.png' },
    { id: 's21', club: 'slavia', number: 16, name: 'David Moses', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['OM'], photo: 'img/slavia/moses.png' },
    { id: 's22', club: 'slavia', number: 17, name: 'Lukáš Provod', role: 'OM', optimalPositions: ['OM', 'LW'], compatiblePositions: ['CM'], photo: 'img/slavia/provod.png' },
    { id: 's23', club: 'slavia', number: 18, name: 'Adonija Ouanda', role: 'RW', optimalPositions: ['RW'], compatiblePositions: ['LW'], photo: 'img/slavia/ouanda.png' },
    { id: 's24', club: 'slavia', number: 19, name: 'Oscar Dorley', role: 'DM', optimalPositions: ['DM', 'RB'], compatiblePositions: ['CM', 'RWB'], photo: 'img/slavia/dorley.png' },
    { id: 's25', club: 'slavia', number: 20, name: 'Emmanuel Ayaosi', role: 'LW', optimalPositions: ['LW'], compatiblePositions: ['RW'], photo: 'img/slavia/ayaosi.png' },
    { id: 's26', club: 'slavia', number: 22, name: 'Toumani Diakité', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], photo: 'img/slavia/diakite.png' },
    { id: 's27', club: 'slavia', number: 23, name: 'Michal Sadílek', role: 'CM', optimalPositions: ['CM', 'DM'], compatiblePositions: [], photo: 'img/slavia/sadilek.png' },
    { id: 's28', club: 'slavia', number: 26, name: 'Ivan Schranz', role: 'RW', optimalPositions: ['RW', 'LW'], compatiblePositions: ['OM', 'CF'], photo: 'img/slavia/schranz.png' },
    { id: 's29', club: 'slavia', number: 30, name: 'Wiktor Nowak', role: 'OM', optimalPositions: ['OM'], compatiblePositions: ['CM'], photo: 'img/slavia/nowak.png' },
    { id: 's30', club: 'slavia', number: 32, name: 'Pavel Kačor', role: 'RW', optimalPositions: ['RW'], compatiblePositions: ['LW'], photo: 'img/slavia/kacor.png' }
  ],
  'Útočníci': [
    { id: 'p34', club: 'sparta', number: 15, name: 'Jonatan Braut Brunes', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['OM'], photo: 'img/sparta/brunes.webp' },
    { id: 'p35', club: 'sparta', number: 29, name: 'Matyáš Vojta', role: 'CF', optimalPositions: ['CF'], compatiblePositions: [], photo: 'img/sparta/vojta.webp' },
    { id: 's31', club: 'slavia', number: 13, name: 'Mojmír Chytil', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['OM'], photo: 'img/slavia/chytil.png' },
    { id: 's32', club: 'slavia', number: 25, name: 'Tomáš Chorý', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['OM'], photo: 'img/slavia/chory.png' }
  ]
};

const players = Object.values(playersByPosition).flat();
