// ============================================================
// Data
// ============================================================
// League list (`leagues`), club list (`clubs`, each tagged with the
// `league` it belongs to), squad roster (`playersByPosition`,
// `players`) and formation layouts (`formations`) live in data.js,
// loaded before script.js.
//
// To add a new league: add an entry to `leagues`, then add its clubs
// to `clubs` with a matching `league` id. A league with no clubs yet
// is fully supported — it just shows an empty roster until teams are
// added.

const leagues = [
  { id: 'chance-liga', name: 'Chance Liga', logo: 'img/logos/chance-liga.jpg' }
];

const clubs = [
  { id: 'slavia', name: 'Slavia', logo: 'img/logos/slavia.png', league: 'chance-liga' },
  { id: 'sparta', name: 'Sparta', logo: 'img/logos/sparta.svg', league: 'chance-liga' },
  { id: 'viktoria', name: 'Plzeň', logo: 'img/logos/plzen.png', league: 'chance-liga' }
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
    { id: 'p1', club: 'sparta', number: 44, name: 'Jakub Surovčík', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 1.8 },
    { id: 'p2', club: 'sparta', number: 47, name: 'Krisztián Hegyi', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 0.4 },
    { id: 's1', club: 'slavia', number: 1, name: 'Ondřej Kolář', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 0.05 },
    { id: 's2', club: 'slavia', number: 29, name: 'Nazar Domchak', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 4.0 },
    { id: 's3', club: 'slavia', number: 35, name: 'Jakub Markovič', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 3.5 },
    { id: 's4', club: 'slavia', number: 36, name: 'Jindřich Staněk', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 2.0 },
    { id: 'v1', club: 'viktoria', number: 30, name: 'Viktor Baier', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 0.65 },
    { id: 'v2', club: 'viktoria', number: 1, name: 'Dominik Ťapaj', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 0.4 },
    { id: 'v3', club: 'viktoria', number: 13, name: 'Marián Tvrdoň', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 0.1 },
    { id: 'v4', club: 'viktoria', number: 44, name: 'Florian Wiegele', role: 'GK', optimalPositions: ['GK'], compatiblePositions: ['GK'], marketValue: 2.2 }
  ],
  'Obránci': [
    { id: 'p3', club: 'sparta', number: 2, name: 'Martin Suchomel', role: 'RB', optimalPositions: ['LB', 'RB', 'LWB', 'RWB'], compatiblePositions: ['LM', 'RM'], marketValue: 0.9 },
    { id: 'p4', club: 'sparta', number: 3, name: 'Pavel Kadeřábek', role: 'RB', optimalPositions: ['RB', 'RWB'], compatiblePositions: ['RM'], marketValue: 1.0 },
    { id: 'p5', club: 'sparta', number: 4, name: 'Jakub Martinec', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['CB'], marketValue: 0.85 },
    { id: 'p6', club: 'sparta', number: 6, name: 'Tobias Guddal', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 3.5 },
    { id: 'p7', club: 'sparta', number: 11, name: 'Matěj Ryneš', role: 'LB', optimalPositions: ['LB', 'LWB'], compatiblePositions: ['LM'], marketValue: 4.0 },
    { id: 'p8', club: 'sparta', number: 15, name: 'Viktor Vitályos', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['LB'], marketValue: 1.0 },
    { id: 'p9', club: 'sparta', number: 16, name: 'Emmanuel Uchenna', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 4.5 },
    { id: 'p10', club: 'sparta', number: 19, name: 'Adam Ševínský', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 4.5 },
    { id: 'p11', club: 'sparta', number: 30, name: 'Jaroslav Zelený', role: 'LB', optimalPositions: ['LB', 'LWB', 'CB'], compatiblePositions: ['LM'], marketValue: 0.6 },
    { id: 'p12', club: 'sparta', number: 33, name: 'Elias Cobbaut', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 0.45 },
    { id: 's5', club: 'slavia', number: 2, name: 'Štěpán Chaloupek', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['RB'], marketValue: 10.0 },
    { id: 's6', club: 'slavia', number: 3, name: 'Tomáš Holeš', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['RB'], marketValue: 1.0 },
    { id: 's7', club: 'slavia', number: 4, name: 'David Zima', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 7.0 },
    { id: 's8', club: 'slavia', number: 5, name: 'Igoh Ogbu', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 7.0 },
    { id: 's9', club: 'slavia', number: 6, name: "Ange N'Guessan", role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 4.5 },
    { id: 's10', club: 'slavia', number: 14, name: 'Samuel Isife', role: 'RB', optimalPositions: ['RB', 'RWB'], compatiblePositions: ['RM'], marketValue: 3.5 },
    { id: 's11', club: 'slavia', number: 27, name: 'Tomáš Vlček', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 4.0 },
    { id: 's12', club: 'slavia', number: 33, name: 'Denis Halinský', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 2.0 },
    { id: 's13', club: 'slavia', number: 39, name: 'David Jurásek', role: 'LB', optimalPositions: ['LB', 'LWB'], compatiblePositions: ['LM'], marketValue: 5.0 },
    { id: 's14', club: 'slavia', number: 41, name: 'Sahmkou Camara', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 1.2 },
    { id: 's15', club: 'slavia', number: 42, name: 'Mikuláš Konečný', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 2.5 },
    { id: 's16', club: 'slavia', number: 43, name: 'Eliáš Piták', role: 'RB', optimalPositions: ['RB', 'RWB'], compatiblePositions: ['RM'], marketValue: 0.5 },
    { id: 'v5', club: 'viktoria', number: 14, name: 'Merchas Doski', role: 'LB', optimalPositions: ['LB'], compatiblePositions: ['LWB'], marketValue: 1.7 },
    { id: 'v6', club: 'viktoria', number: 40, name: 'Sampson Dweh', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 5.0 },
    { id: 'v7', club: 'viktoria', number: 21, name: 'Václav Jemelka', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 1.2 },
    { id: 'v8', club: 'viktoria', number: 37, name: 'Dávid Krčík', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 1.7 },
    { id: 'v9', club: 'viktoria', number: 22, name: 'Jan Paluška', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['RB'], marketValue: 3.0 },
    { id: 'v10', club: 'viktoria', number: 98, name: 'Filip Prebsl', role: 'CB', optimalPositions: ['CB'], compatiblePositions: [], marketValue: 0.9 },
    { id: 'v11', club: 'viktoria', number: 5, name: 'Karel Spáčil', role: 'CB', optimalPositions: ['CB'], compatiblePositions: ['RB'], marketValue: 3.5 }
  ],
  'Záložníci': [
    { id: 'p13', club: 'sparta', number: 5, name: 'Santiago Eneme', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['OM', 'DM'], marketValue: 2.3 },
    { id: 'p14', club: 'sparta', number: 7, name: 'Josimar Alcócer', role: 'LW', optimalPositions: ['LW'], compatiblePositions: ['RW'], marketValue: 3.0 },
    { id: 'p15', club: 'sparta', number: 8, name: 'Magnus Kofod Andersen', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], marketValue: 1.3 },
    { id: 'p16', club: 'sparta', number: 10, name: 'Adam Karabec', role: 'OM', optimalPositions: ['OM'], compatiblePositions: ['CM'], marketValue: 7.0 },
    { id: 'p17', club: 'sparta', number: 17, name: 'John Mercado', role: 'RW', optimalPositions: ['RW'], compatiblePositions: ['LW', 'OM'], marketValue: 4.0 },
    { id: 'p18', club: 'sparta', number: 18, name: 'Andrew Irving', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM', 'OM'], marketValue: 4.5 },
    { id: 'p19', club: 'sparta', number: 20, name: 'Sivert Mannsverk', role: 'DM', optimalPositions: ['DM'], compatiblePositions: ['CM'], marketValue: 3.5 },
    { id: 'p20', club: 'sparta', number: 21, name: 'Joao Grimaldo', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: ['OM'], marketValue: 0.85 },
    { id: 'p21', club: 'sparta', number: 24, name: 'Dominik Hollý', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['LW', 'OM'], marketValue: 0.75 },
    { id: 'p22', club: 'sparta', number: 26, name: 'Patrik Vydra', role: 'DM', optimalPositions: ['DM'], compatiblePositions: ['CB', 'CM'], marketValue: 7.0 },
    { id: 'p23', club: 'sparta', number: 27, name: 'Ebrima Singhateh', role: 'LW', optimalPositions: ['LW', 'CF', 'RW'], compatiblePositions: [], marketValue: 0.7 },
    { id: 'p24', club: 'sparta', number: 28, name: 'Roman Macek', role: 'CM', optimalPositions: ['CM', 'DM'], compatiblePositions: [], marketValue: 0.5 },
    { id: 'p25', club: 'sparta', number: 31, name: 'Matěj Jurásek', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: [], marketValue: 4.5 },
    { id: 'p26', club: 'sparta', number: 36, name: 'Garang Kuol', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: [], marketValue: 1.0 },
    { id: 'p27', club: 'sparta', number: 38, name: 'Hugo Sochůrek', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['OM', 'DM'], marketValue: 3.5 },
    { id: 'p28', club: 'sparta', number: 52, name: 'Ondřej Penxa', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: [], marketValue: 0.5 },
    { id: 's17', club: 'slavia', number: 8, name: 'Oskar Kubiak', role: 'LM', optimalPositions: ['LM'], compatiblePositions: ['LB'], marketValue: 1.5 },
    { id: 's18', club: 'slavia', number: 10, name: 'Danijel Šturm', role: 'LW', optimalPositions: ['LW', 'RW'], compatiblePositions: ['CF'], marketValue: 2.5 },
    { id: 's19', club: 'slavia', number: 11, name: 'Youssoupha Sanyang', role: 'LW', optimalPositions: ['LW'], compatiblePositions: ['RW'], marketValue: 2.7 },
    { id: 's20', club: 'slavia', number: 15, name: 'Mubarak Suleiman', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], marketValue: 1.8 },
    { id: 's21', club: 'slavia', number: 16, name: 'David Moses', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['OM'], marketValue: 10.0 },
    { id: 's22', club: 'slavia', number: 17, name: 'Lukáš Provod', role: 'OM', optimalPositions: ['OM', 'LW'], compatiblePositions: ['CM'], marketValue: 8.0 },
    { id: 's23', club: 'slavia', number: 18, name: 'Adonija Ouanda', role: 'RW', optimalPositions: ['RW'], compatiblePositions: ['LW'], marketValue: 0.6 },
    { id: 's25', club: 'slavia', number: 20, name: 'Emmanuel Ayaosi', role: 'LW', optimalPositions: ['LW'], compatiblePositions: ['RW'], marketValue: 2.0 },
    { id: 's26', club: 'slavia', number: 22, name: 'Toumani Diakité', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], marketValue: 3.0 },
    { id: 's27', club: 'slavia', number: 23, name: 'Michal Sadílek', role: 'CM', optimalPositions: ['CM', 'DM'], compatiblePositions: [], marketValue: 8.0 },
    { id: 's28', club: 'slavia', number: 26, name: 'Ivan Schranz', role: 'RW', optimalPositions: ['RW', 'LW'], compatiblePositions: ['OM', 'CF'], marketValue: 0.6 },
    { id: 's29', club: 'slavia', number: 30, name: 'Wiktor Nowak', role: 'OM', optimalPositions: ['OM'], compatiblePositions: ['CM'], marketValue: 1.5 },
    { id: 's30', club: 'slavia', number: 32, name: 'Pavel Kačor', role: 'RW', optimalPositions: ['RW'], compatiblePositions: ['LW'], marketValue: 2.0 },
    { id: 'v12', club: 'viktoria', number: 66, name: 'Sebastian Boháč', role: 'CM', optimalPositions: ['CM'], compatiblePositions: [], marketValue: 0.45 },
    { id: 'v13', club: 'viktoria', number: 6, name: 'Lukáš Červ', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], marketValue: 6.0 },
    { id: 'v14', club: 'viktoria', number: 17, name: 'Patrik Hrošovský', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], marketValue: 1.3 },
    { id: 'v15', club: 'viktoria', number: 18, name: 'Tomáš Ladra', role: 'OM', optimalPositions: ['OM'], compatiblePositions: ['CM'], marketValue: 1.3 },
    { id: 'v16', club: 'viktoria', number: 99, name: 'Amar Memić', role: 'RM', optimalPositions: ['RM'], compatiblePositions: ['RWB', 'RB'], marketValue: 4.5 },
    { id: 'v17', club: 'viktoria', number: 20, name: 'Jiří Panoš', role: 'CM', optimalPositions: ['CM'], compatiblePositions: [], marketValue: 1.8 },
    { id: 'v18', club: 'viktoria', number: 36, name: 'Stefan Pirgić', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], marketValue: 1.8 },
    { id: 'v19', club: 'viktoria', number: 12, name: 'Alexandr Sojka', role: 'CM', optimalPositions: ['CM'], compatiblePositions: ['DM'], marketValue: 2.3 },
    { id: 'v20', club: 'viktoria', number: 19, name: 'Cheick Souaré', role: 'LM', optimalPositions: ['LM'], compatiblePositions: ['LW'], marketValue: 3.5 },
    { id: 'v21', club: 'viktoria', number: 9, name: 'Denis Višinský', role: 'OM', optimalPositions: ['OM'], compatiblePositions: ['CM'], marketValue: 3.0 }
  ],
  'Útočníci': [
    { id: 'p34', club: 'sparta', number: 15, name: 'Jonatan Braut Brunes', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['OM'], marketValue: 8.0 },
    { id: 'p35', club: 'sparta', number: 29, name: 'Matyáš Vojta', role: 'CF', optimalPositions: ['CF'], compatiblePositions: [], marketValue: 3.0 },
    { id: 's31', club: 'slavia', number: 13, name: 'Mojmír Chytil', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['OM'], marketValue: 4.0 },
    { id: 's32', club: 'slavia', number: 25, name: 'Tomáš Chorý', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['OM'], marketValue: 2.7 },
    { id: 'v22', club: 'viktoria', number: 80, name: 'Prince Adu', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['LW'], marketValue: 3.0 },
    { id: 'v23', club: 'viktoria', number: 23, name: 'Baboucarr Faal', role: 'CF', optimalPositions: ['CF'], compatiblePositions: [], marketValue: 2.5 },
    { id: 'v24', club: 'viktoria', number: 25, name: 'Christophe Kabongo', role: 'CF', optimalPositions: ['CF'], compatiblePositions: [], marketValue: 0.75 },
    { id: 'v25', club: 'viktoria', number: 7, name: 'Salim Fago Lawal', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['LW', 'RW'], marketValue: 1.8 },
    { id: 'v26', club: 'viktoria', number: 10, name: 'Mohamed Touré', role: 'CF', optimalPositions: ['CF'], compatiblePositions: ['RW'], marketValue: 2.0 },
    { id: 'v27', club: 'viktoria', number: 11, name: 'Matěj Vydra', role: 'CF', optimalPositions: ['CF'], compatiblePositions: [], marketValue: 0.6 }
  ]
};

const players = Object.values(playersByPosition).flat();
