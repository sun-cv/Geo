const championListAutocomplete = 
    [
	'A. Blademaster',
	'Abbess',
	'Abyssal',
	'Acelin',
	'Achak',
	'Acolyte',
	'Acrizia',
	'Adelyn',
	'Adjudicator',
	'Admonitor',
	'Adriel',
	'Aeila',
	'Aeshma',
	'Ailil',
	'Aina',
	'Akemtum',
	'Akoth',
	'Alaric',
	'Alaz',
	'Aleksandr',
	'Alice',
	'Alika',
	'Alsgor',
	'Altan',
	'Alure',
	'Ambassador Lethelin',
	'Anax',
	'Anchorite',
	'Androc',
	'Andryssia',
	'Angar',
	'Ankora',
	'Anointed',
	'Aothar',
	'Aox',
	'Aphidus',
	'Apothecary',
	'Aragaz',
	'Arashi',
	'Arbais',
	'Arbalester',
	'Arbiter',
	'Arcanist',
	'Archbishop Pinthroy',
	'Archer',
	'Archmage Hellmut',
	'Aristocrat',
	'Arix',
	'Armanz',
	'Armiger',
	'Armina',
	'Arndulf',
	'Arnorn',
	'Artak',
	'Arwydd',
	'Ashwalker',
	'Ash’nar',
	'Assassin',
	'Astralith',
	'Astralon',
	'Athel',
	'Atur',
	'Avenger',
	'Avir',
	'Axeman',
	'Azure',
	'Ba Satha',
	'Bad-el-Kazar',
	'Baerdal',
	'Balthus',
	'Bambus',
	'Bandit',
	'Banshee',
	'Baron',
	'Baroth',
	'Basher',
	'Basilisk',
	'Battle Sister',
	'Battlesage',
	'Beast Wrestler',
	'Belanor',
	'Belletar',
	'Bellower',
	'Belz',
	'Bergoth',
	'Berserker',
	'Big ’Un',
	'Bivald',
	'Black Knight',
	'Blacktusk',
	'Blind Seer',
	'Blizaar',
	'Bloatwraith',
	'Bloodbraid',
	'Bloodfeather',
	'Bloodgorged',
	'Bloodhorn',
	'Bloodmask',
	'Bloodpainter',
	'Bogwalker',
	'Bolint',
	'Boltsmith',
	'Bombardier',
	'Bone Knight',
	'Bonekeeper',
	'Boragar',
	'Bovos',
	'Bowf',
	'Brakus',
	'Branchweaver',
	'Broadmaw',
	'Broodlord',
	'Brute',
	'Bully',
	'Bulwark',
	'Burangiri',
	'Bushi',
	'Bystophus',
	'Cagebound',
	'Cagebreaker',
	'Cait',
	'Calamitus',
	'Candleguard',
	'Candraphon',
	'Canoness',
	'Caoilte',
	'Captain Temila',
	'Cardiel',
	'Cardinal',
	'Carlinia',
	'Castigator',
	'Catacomb Councilor',
	'Cataphract',
	'Ceez',
	'Centurion',
	'Chaagur',
	'Chalco',
	'Chancellor Yasmin',
	'Chani',
	'Channeler',
	'Chaplain',
	'Chemist',
	'Cheshire',
	'Chevalier',
	'Chonoru',
	'Chopper',
	'Cillian',
	'Claidna',
	'Cleopterix',
	'Coffin Smasher',
	'Coldheart',
	'Colwyn',
	'Commander',
	'Conellia',
	'Confessor',
	'Conquerer',
	'Conscript',
	'Cormac',
	'Corpse Collector',
	'Corpulent Cadaver',
	'Corvis',
	'Countess Lix',
	'Courtier',
	'Craklin',
	'Crimson Helm',
	'Crimson Slayer',
	'Criodan',
	'Crohnam',
	'Cromax',
	'Crossbowman',
	'Cruetraxa',
	'Crusader',
	'Crusher',
	'Crypt Witch',
	'Crypt-King Graal',
	'Cudgeler',
	'Cultist',
	'Cupidus',
	'Dagger',
	'Daithi',
	'Danag',
	'Dark Athel',
	'Dark Elhain',
	'Dark Kael',
	'Daywalker',
	'Deacon Armstrong',
	'Dead Crusader',
	'Death Hound',
	'Deathchanter',
	'Deathknight',
	'Deathless',
	'Defiled Sinner',
	'Delaaja',
	'Deliana',
	'Delver',
	'Demytha',
	'Denid',
	'Dervish',
	'Dhampir',
	'Dhukk',
	'Diabolist',
	'Diamant',
	'Dilgol',
	'Dirandil',
	'Djamarsa',
	'Dolor',
	'Doompriest',
	'Doomscreech',
	'Dracomorph',
	'Draconis',
	'Drake',
	'Dreng',
	'Drexthar',
	'Drillmaster',
	'Drokgul',
	'Duchess Lilitu',
	'Duedan',
	'Duelist',
	'Duhr',
	'Dunestrider',
	'Dyana',
	'Elder',
	'Elder Skarg',
	'Elegaius',
	'Elenaril',
	'Elfguard',
	'Elhain',
	'Elva',
	'Embrys',
	'Emic',
	'Enda',
	'Endalia',
	'Eolfrig',
	'Eostrid',
	'Erinyes',
	'Errol',
	'Esme',
	'Ethlen',
	'Eva',
	'Eviscerator',
	'Excruciator',
	'Executioner',
	'Exemplar',
	'F. Blademaster',
	'Faceless',
	'Fahrakin',
	'Falmond',
	'Fanatic',
	'Fang Cleric',
	'Fayne',
	'Fearmonger',
	'Fellhound',
	'Fenax',
	'Fencer',
	'Fenshi',
	'Fireblade',
	'Firrol',
	'Fjorad',
	'Flailer',
	'Flannan',
	'Flesh-Tearer',
	'Flesheater',
	'Fleshmonger',
	'Flinger',
	'Fodbor',
	'Foli',
	'Fortus',
	'Fren’zi',
	'Freyja',
	'Frolni',
	'Frontline Warrior',
	'Frostbringer',
	'Frostskin',
	'Frozen Banshee',
	'Fu-Shan',
	'Furystoker',
	'Fylja',
	'Fyna',
	'Gaius',
	'Gala',
	'Galathir',
	'Galek',
	'Galkut',
	'Galleus',
	'Gamuran',
	'Gator',
	'Geargrinder',
	'Genbo',
	'Genzin',
	'Geomancer',
	'Georgid',
	'Gerhard',
	'Gharol',
	'Ghostborn',
	'Ghoulish Ranger',
	'Ghrukkus',
	'Ghrush',
	'Giath',
	'Ginro',
	'Giscard',
	'Gizmak',
	'Gladiator',
	'Glaicad',
	'Glenspear',
	'Gliseah',
	'Gloril',
	'Gnarlhorn',
	'Gnishak',
	'Gnut',
	'Godseeker Aniri',
	'Goffred',
	'Golden Reaper',
	'Gomlok',
	'Goon',
	'Goremask',
	'Gorgorab',
	'Gorlos',
	'Gory',
	'Graazur',
	'Grandmaster',
	'Grappler',
	'Gravechill',
	'Graybeard',
	'Greggor',
	'Gretel',
	'Grimskin',
	'Grinner',
	'Grizzled Jarl',
	'Grohak',
	'Gronjarr',
	'Grumbler',
	'Grunch',
	'Guardian',
	'Gurgoh',
	'Gurptuk',
	'Guurda',
	'Gwyndolin',
	'Gwynneth',
	'Haarken',
	'Hakkorhn',
	'Halberdier',
	'Hansel',
	'Hardscale',
	'Harima',
	'Harrier',
	'Haruspex',
	'Harvest Jack',
	'Harvester',
	'Hatchet Slinger',
	'Hatter',
	'He-Man',
	'Head Taker',
	'Headsman',
	'Heartpiercer',
	'Hegemon',
	'Heiress',
	'Helicath',
	'Helior',
	'Hellborn',
	'Hellfang',
	'Hellfreak',
	'Hellgazer',
	'Hellhound',
	'Hephraak',
	'Herakletes',
	'Herald',
	'Hexia',
	'Hexweaver',
	'High Khatun',
	'Hill Nomad',
	'Hoforees',
	'Hollow',
	'Holsring',
	'Honor Guard',
	'Hope',
	'Hordin',
	'Hoskarul',
	'Hospitaller',
	'Hotatsu',
	'Hound Spawn',
	'Hungerer',
	'Huntress',
	'Hurler',
	'Hurndig',
	'Husk',
	'Hyria',
	'Icebound',
	'Ieyasu',
	'Ifrit',
	'Ignatius',
	'Ilysinya',
	'Incarnate',
	'Incubus',
	'Infernal Baroness',
	'Infiltrator',
	'Ingid',
	'Inithwe',
	'Inquisitor Shamael',
	'Interceptor',
	'Intercessor',
	'Iron Brago',
	'Ironclad',
	'Isbeil',
	'Islin',
	'Ithos',
	'Itinerant',
	'Jaeger',
	'Jagg',
	'Jailer',
	'Jarang',
	'Jareg',
	'Jeroboam',
	'Jetni',
	'Jinglehunter',
	'Jingwon',
	'Jintoro',
	'Jizoh',
	'Jorrg',
	'Jotunn',
	'Judge',
	'Judicator',
	'Juliana',
	'Jurojin',
	'Justiciar',
	'Kael',
	'Kaiden',
	'Kaja',
	'Kallia',
	'Kalvalax',
	'Kantra',
	'Karam',
	'Karato',
	'Karilon',
	'Karnage',
	'Keeyra',
	'Kellan',
	'Khafru',
	'Khoronar',
	'Kinagashi',
	'King Gallcobar',
	'King Garog',
	'Klodd',
	'Knave',
	'Knecht',
	'Knight-Errant',
	'Knott',
	'Komidus',
	'Konstantin',
	'Korugar',
	'Krakarth',
	'Kreela',
	'Krisk',
	'Krixia',
	'Krok’mar',
	'Kunoichi',
	'Kurzad',
	'Kyoku',
	'Kytis',
	'K’Leth',
	'Lady Annabelle',
	'Lady Eresh',
	'Lady Etessa',
	'Lady Kimi',
	'Lady Mikage',
	'Lady Quilen',
	'Lady of Ireth',
	'Lamasu',
	'Lamellar',
	'Lamibur',
	'Lanakis',
	'Lasair',
	'Lazarius',
	'Lemure',
	'Leorius',
	'Liburga',
	'Lich',
	'Lifetaker',
	'Lightsworn',
	'Line Infantry',
	'Little Miss Annie',
	'Locwain',
	'Lodric',
	'Loki',
	'Lonatharil',
	'Longbeard',
	'Lord Champfort',
	'Lord Shazar',
	'Lordly Legionary',
	'Loriaca',
	'Lorn',
	'Lua',
	'Lugan',
	'Lumberer',
	'Luria',
	'Lurker',
	'Luthiea',
	'Lydia',
	'Lyssandra',
	'Madame Serris',
	'Madman',
	'Maeve',
	'Magekiller',
	'Magister',
	'Magmablood',
	'Magnarr',
	'Magus',
	'Maiden',
	'Malbranche',
	'Malkith',
	'Maneater',
	'Maranix',
	'Marauder',
	'Margrave',
	'Marichka',
	'Marius',
	'Marked',
	'Marksman',
	'Marquess',
	'Marquis',
	'Martyr',
	'Masamoto',
	'Master Butcher',
	'Mathias',
	'Maud',
	'Maulie',
	'Mausoleum Mage',
	'Ma’Shalled',
	'Medicus',
	'Melga',
	'Merouka',
	'Metalshaper',
	'Mezomel',
	'Michinaki',
	'Militia',
	'Minaya',
	'Miscreated Monster',
	'Misericord',
	'Missionary',
	'Mistress',
	'Mithrala',
	'Modo',
	'Morag',
	'Mordecai',
	'Morrigaine',
	'Mortu-Macaab',
	'Mother Cybele',
	'Mother Superior',
	'Mountain King',
	'Muckstalker',
	'Mycolus',
	'Myrmidon',
	'Mystic Hand',
	'Nais',
	'Nari',
	'Narma',
	'Narses',
	'Nazana',
	'Necrohunter',
	'Nekhret',
	'Nekmo Thaar',
	'Neldor',
	'Nell',
	'Nethril',
	'Nia',
	'Ninja',
	'Nobel',
	'Noct',
	'Noelle',
	'Nogdar',
	'Nogoryo',
	'Norog',
	'Novitiate',
	'Oathbound',
	'Oboro',
	'Occult Brawler',
	'Odachi',
	'Odin',
	'Oella',
	'Oldbeard',
	'Opardin',
	'Ordinator',
	'Orn',
	'Ostrox',
	'Othorion',
	'Outlander',
	'Outlaw Monk',
	'Outrider',
	'Ox',
	'Padraig',
	'Pain Keeper',
	'Painsmith',
	'Pann',
	'Panthera',
	'Paragon',
	'Penitent',
	'Perforator',
	'Pestilus',
	'Petrifya',
	'Peydma',
	'Pharsalas',
	'Pheidi',
	'Phranox',
	'Pigsticker',
	'Pikeman',
	'Pilgrim',
	'Pit Cur',
	'Pit Fighter',
	'Pitiless One',
	'Pitspawn',
	'Pounder',
	'Preacher',
	'Preserver',
	'Prince Kymar',
	'Prosecutor',
	'Prundar',
	'Prysma',
	'Psylar',
	'Purgator',
	'Pythion',
	'Pyxniel',
	'Quaestor',
	'Quargan',
	'Queen of Hearts',
	'Quintus',
	'R. Blademaster',
	'R. N. Archer',
	'Rae',
	'Raf-Matab',
	'Ragash',
	'Ragemonger',
	'Raglin',
	'Raider',
	'Rakka',
	'Ramantu',
	'Ranger',
	'Razelvarg',
	'Rearguard Sergeant',
	'Rector Drath',
	'Redeemer',
	'Reinbeast',
	'Relickeeper',
	'Reliquary Tender',
	'Renegade',
	'Renouncer',
	'Retainer',
	'Rhazin',
	'Riab',
	'Rian',
	'Richtoff',
	'Riho',
	'Ripper',
	'Ripperfist',
	'Riscarm',
	'Ritualist',
	'Roanas',
	'Robar',
	'Rock Breaker',
	'Rockbeast',
	'Rocktooth',
	'Romero',
	'Ronda',
	'Roric',
	'Roshcard',
	'Rotos',
	'Rotting Mage',
	'Rowan',
	'Roxam',
	'Royal Guard',
	'Royal Huntsman',
	'Ruarc',
	'Ruel',
	'Ruella',
	'Ruffstone',
	'Rugnor',
	'Runekeeper Dazdurk',
	'Runic Warder',
	'Sabitha',
	'Sachi',
	'Saito',
	'Samar',
	'Samson',
	'Sanctum Protector',
	'Sandbow',
	'Sanguinia',
	'Satyr',
	'Saurus',
	'Scabrius',
	'Scion',
	'Scrapper',
	'Scyl',
	'Searsha',
	'Seducer',
	'Seeker',
	'Seer',
	'Selinia',
	'Seneschal',
	'Senna',
	'Sentinel',
	'Septimus',
	'Sepulcher Sentinel',
	'Sergeant',
	'Sethallia',
	'Shaman',
	'Shamrock',
	'Shatterbones',
	'Shemnath',
	'Shieldguard',
	'Shirimani',
	'Shu-Zhen',
	'Shy’ek',
	'Sicia',
	'Siegebreaker',
	'Siegehulk',
	'Siegfrund',
	'Sigmund',
	'Signy',
	'Sikara',
	'Sinesha',
	'Siphi',
	'Sir Artimage',
	'Sir Nicholas',
	'Sister Militant',
	'Skartorsis',
	'Skathix',
	'Skeleton',
	'Skeletor',
	'Skellag',
	'Skeuramis',
	'Skimfos',
	'Skink',
	'Skinner',
	'Skirmisher',
	'Skorid',
	'Skraank',
	'Skullcrown',
	'Skullcrusher',
	'Skullsquire',
	'Skullsworn',
	'Skytouched Shaman',
	'Slasher',
	'Slayer',
	'Slicer',
	'Slitherbrute',
	'Slixus',
	'Sniktraak',
	'Sniper',
	'Snorting Thug',
	'Solaris',
	'Sorceress',
	'Soulbond Bowyer',
	'Souldrinker',
	'Soulless',
	'Spider',
	'Spikehead',
	'Spirithost',
	'Spiritwalker',
	'Spymaster',
	'Squire',
	'Stag Knight',
	'Stalker',
	'Staltus',
	'Stalwart',
	'Steadfast Marshal',
	'Steel Bowyer',
	'Steelskull',
	'Stitched Beast',
	'Stokk',
	'Stout Axeman',
	'Suiren',
	'Sulfuryion',
	'Sun Wukong',
	'Suntribe',
	'Supreme Athel',
	'Supreme Elhain',
	'Supreme Galek',
	'Supreme Kael',
	'Survivor',
	'Suwai',
	'Suzerain Katonn',
	'Swordsman',
	'Tagoar',
	'Tainix',
	'Tallia',
	'Taneko',
	'Taras',
	'Tarshon',
	'Tatsu',
	'Tatura',
	'Taurus',
	'Taya',
	'Tayrel',
	'Teela',
	'Templar',
	'Temptress',
	'Teodor',
	'Teox',
	'Terrorbeast',
	'Teryx',
	'Teshada',
	'Teumesia',
	'Thea',
	'Thenasil',
	'Theresc',
	'Theurgist',
	'Thor',
	'Thrall',
	'Thrasher',
	'Throatcutter',
	'Thylessia',
	'Tigersoul',
	'Timit',
	'Tirlac',
	'Togron',
	'Tolf',
	'Tolog',
	'Tomb Lord',
	'Tomoe',
	'Toragi',
	'Tormentor',
	'Tormin',
	'Torrux',
	'Torturehelm',
	'Toshiro',
	'Totem',
	'Towering Titan',
	'Tracker',
	'Tramaria',
	'Treefeller',
	'Troglodyte',
	'Truath',
	'Trugorr',
	'Trumborr',
	'Trunda',
	'Tuhak',
	'Tuhanarak',
	'Tunnel Steward',
	'Turvold',
	'Twinclaw',
	'Tyrant Ixlimor',
	'Ugir',
	'Ukko',
	'Ultan',
	'Ultimate Deathknight',
	'Ultimate Galek',
	'Umbral Enchantress',
	'Umetogi',
	'Underpriest Brogni',
	'Urogrim',
	'Urost',
	'Ursala',
	'Ursine Icecrusher',
	'Ursine Ironhide',
	'Ursuga',
	'Urticata',
	'Uugo',
	'Vagabond',
	'Valerie',
	'Valkanen',
	'Valkyrie',
	'Valla',
	'Vanguard',
	'Var-Gall',
	'Varl',
	'Vasal',
	'Venomage',
	'Venus',
	'Vergis',
	'Vergumkaar',
	'Versulf',
	'Veteran',
	'Vigilante',
	'Vildrax',
	'Vilespawn',
	'Visionary',
	'Visix',
	'Vitrius',
	'Vizier Ovelis',
	'Vizug',
	'Vlad',
	'Vogoth',
	'Vrask',
	'Vulkanos',
	'Vulpine',
	'Wagonbane',
	'Wanderer',
	'War Mother',
	'Warboy',
	'Warcaster',
	'Warchanter',
	'Warchief',
	'Warden',
	'Warlord',
	'Warmaiden',
	'Warpriest',
	'Weregren',
	'Whisper',
	'Windtalker',
	'Witness',
	'Wixwell',
	'Woad-Painted',
	'Word Bearer',
	'Wretch',
	'Wuji',
	'Wurlim',
	'Wuzgar',
	'Wyrennon',
	'Wysteri',
	'Wythir',
	'Wyvernbane',
	'Xena',
	'Yaga',
	'Yakarl',
	'Yannica',
	'Yelagirna',
	'Yeoman',
	'Yncensa',
	'Yoshi',
	'Yumeko',
	'Z. Blademaster',
	'Zargala',
	'Zarguna',
	'Zavia',
	'Zelotah',
	'Zephyr Sniper',
	'Zii',
	'Zyclic',
    ];
    
    export { championListAutocomplete };