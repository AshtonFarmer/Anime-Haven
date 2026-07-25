(()=>{
  'use strict';

  const ITEMS=[
    {
      id:'mob-telekinesis',type:'power',effect:'telekinesis',name:'100% Telekinesis',owner:'Shigeo “Mob” Kageyama',
      anime:'Mob Psycho 100',accent:'#ff58c8',accent2:'#65f8ff',
      tenorId:'6137101',
      sourceUrl:'https://tenor.com/view/mobpsycho100-kageyamashigeo-telekinesis-gif-6137101',
      description:'Psychic force erupts into a shifting storm of color, floating debris and pressure waves as Mob reaches 100%.'
    },
    {
      id:'hollow-purple',type:'power',effect:'hollow',name:'Hollow Purple',owner:'Satoru Gojo',
      anime:'Jujutsu Kaisen',accent:'#a73cff',accent2:'#ff59cc',
      tenorId:'16843591044568531318',
      sourceUrl:'https://tenor.com/view/gojo-satoru-gojo-hollow-purple-jujutsu-kaisen-blue-gif-16843591044568531318',
      description:'Blue and Red collide into an overwhelming imaginary mass that tears through everything in its path.'
    },
    {
      id:'kamehameha',type:'power',effect:'kamehameha',name:'Kamehameha',owner:'Goku',
      anime:'Dragon Ball',accent:'#2477ff',accent2:'#7df8ff',
      tenorId:'9815496963847746678',
      sourceUrl:'https://tenor.com/view/goku-kamehameha-dragon-ball-son-goku-energy-wave-gif-9815496963847746678',
      description:'A concentrated sphere of ki releases as a roaring blue-white energy wave.'
    },
    {
      id:'arise',type:'power',effect:'arise',name:'Arise',owner:'Sung Jin-Woo',
      anime:'Solo Leveling',accent:'#7d35ff',accent2:'#caa7ff',
      tenorId:'17496945317088408472',
      sourceUrl:'https://tenor.com/view/sung-jin-woo-igris-arise-solo-leveling-bloodred-commander-gif-17496945317088408472',
      description:'Fallen enemies rise from violet-black energy and join the Shadow Monarch’s army.'
    },
    {
      id:'getsuga-tensho',type:'power',effect:'getsuga',name:'Getsuga Tenshō',owner:'Ichigo Kurosaki',
      anime:'Bleach',accent:'#175dff',accent2:'#7ff8ff',
      tenorId:'24230454',
      sourceUrl:'https://tenor.com/view/ichigo-kurosaki-getsuga-tensho-fade-to-black-snake-movie3-gif-24230454',
      description:'Compressed spiritual energy leaves Zangetsu as a massive crescent-shaped slash.'
    },
    {
      id:'megiddo',type:'power',effect:'megiddo',name:'Megiddo',owner:'Rimuru Tempest',
      anime:'That Time I Got Reincarnated as a Slime',accent:'#ffc84f',accent2:'#fff5ad',
      tenorId:'25761644',
      sourceUrl:'https://tenor.com/view/rimuru-tempest-megiddo-ybaau-solos-yba-au-gif-25761644',
      description:'Countless water lenses focus sunlight into a silent and terrifying rain of beams.'
    },
    {
      id:'zoltraak',type:'power',effect:'zoltraak',name:'Zoltraak',owner:'Frieren',
      anime:'Frieren: Beyond Journey’s End',accent:'#6b42ff',accent2:'#ffe789',
      tenorId:'4846196759717581677',
      sourceUrl:'https://tenor.com/view/frieren-zoltraak-gif-4846196759717581677',
      description:'A precise magic circle forms before a devastating beam of ordinary offensive magic is released.'
    },
    {
      id:'malevolent-shrine',type:'power',effect:'shrine',name:'Malevolent Shrine',owner:'Ryomen Sukuna',
      anime:'Jujutsu Kaisen',accent:'#e51f45',accent2:'#ffb05e',
      tenorId:'5523999485760831537',
      sourceUrl:'https://tenor.com/view/malevolent-shrine-jujutsu-kaisen-sukuna-sukuna-vs-mahoraga-shibuya-gif-5523999485760831537',
      description:'A barrierless domain manifests with relentless invisible slashes across its entire range.'
    },
    {
      id:'detroit-smash',type:'power',effect:'impact',name:'Detroit Smash',owner:'Izuku Midoriya',
      anime:'My Hero Academia',accent:'#25d5a0',accent2:'#a4fff0',
      tenorId:'17757946',
      sourceUrl:'https://tenor.com/view/detroit-smash-izuku-midoriya-deku-my-hero-academia-boku-no-hero-academia-gif-17757946',
      description:'One For All detonates through a single strike and turns the surrounding air into a shockwave.'
    },
    {
      id:'adolla-burst',type:'power',effect:'adolla',name:'Adolla Burst',owner:'Shinra Kusakabe',
      anime:'Fire Force',accent:'#ff3f1f',accent2:'#ffe660',
      tenorId:'25690254',
      sourceUrl:'https://tenor.com/view/shinra-shinra-kusakabe-fire-force-enen-no-shouboutai-adolla-burst-gif-25690254',
      description:'Pure flame explodes from Shinra’s feet with brilliant heat, speed and jet-like force.'
    },
    {
      id:'full-counter',type:'power',effect:'counter',name:'Full Counter',owner:'Meliodas',
      anime:'The Seven Deadly Sins',accent:'#9a4dff',accent2:'#ffe275',
      tenorId:'20751424',
      sourceUrl:'https://tenor.com/view/meliodas-full-counter-the-seven-deadly-sins-tsds-seven-deadly-sins-sds-gif-20751424',
      description:'Incoming magical power is reflected back at the attacker with even greater force.'
    },
    {
      id:'water-breathing',type:'power',effect:'water',name:'Water Breathing',owner:'Tanjiro Kamado',
      anime:'Demon Slayer',accent:'#176fff',accent2:'#7ef4ff',
      tenorId:'10480000295623830569',
      sourceUrl:'https://tenor.com/view/demon-slayer-tanjiro-kamado-kimetsu-no-yaiba-water-breathing-gif-10480000295623830569',
      description:'A flowing sword form surrounds each movement with luminous arcs of rushing water.'
    },
    {
      id:'zangetsu',type:'weapon',kind:'cleaver',name:'Zangetsu',owner:'Ichigo Kurosaki',
      anime:'Bleach',accent:'#172235',accent2:'#7deeff',
      sketchfabId:'8cb58515c55943fa8549610124186414',
      sourceUrl:'https://sketchfab.com/3d-models/ichigo-kurosaki-shikai-bleach-fan-art-8cb58515c55943fa8549610124186414',
      description:'Ichigo’s enormous original Zanpakutō, shaped like a cleaver without a traditional guard.'
    },
    {
      id:'demon-slayer-sword',type:'weapon',kind:'greatsword',name:'Demon-Slayer Sword',owner:'Asta',
      anime:'Black Clover',accent:'#242733',accent2:'#ff4c69',
      sketchfabId:'c7ff315569354e6496dafc110338be4d',
      sourceUrl:'https://sketchfab.com/3d-models/black-clover-demon-slayer-sword-c7ff315569354e6496dafc110338be4d',
      description:'A massive anti-magic blade capable of cutting magic and batting spells back toward an enemy.'
    },
    {
      id:'demon-dweller-sword',type:'weapon',kind:'cleaver',name:'Demon-Dweller Sword',owner:'Asta',
      anime:'Black Clover',accent:'#222634',accent2:'#65d8ff',
      sketchfabId:'b7ed730bac5d4237b08203282065e160',
      sourceUrl:'https://sketchfab.com/3d-models/demon-dweller-black-clover-asta-sword-b7ed730bac5d4237b08203282065e160',
      description:'An anti-magic sword that can borrow, absorb and release the magic of Asta’s allies.'
    },
    {
      id:'yami-katana',type:'weapon',kind:'katana',name:'Yami’s Katana',owner:'Yami Sukehiro',
      anime:'Black Clover',accent:'#182535',accent2:'#a764ff',
      imageUrl:'https://i.ytimg.com/vi/y91x1c4IjHk/maxresdefault.jpg',
      sourceUrl:'https://www.youtube.com/watch?v=y91x1c4IjHk',
      mediaKind:'ANIME STILL',mediaLabel:'OFFICIAL ANIME STILL • CRUNCHYROLL',
      description:'A dark-cloaked katana used to channel Yami’s dimension-cutting magic.'
    },
    {
      id:'elucidator',type:'weapon',kind:'longsword',name:'Elucidator',owner:'Kirito',
      anime:'Sword Art Online',accent:'#111727',accent2:'#68dfff',
      sketchfabId:'d5fd833325d846ec810c97c03d96776f',
      sourceUrl:'https://sketchfab.com/3d-models/kiritos-elucidator-d5fd833325d846ec810c97c03d96776f',
      description:'Kirito’s black one-handed sword and the defining blade of his Aincrad equipment.'
    },
    {
      id:'dark-repulser',type:'weapon',kind:'longsword',name:'Dark Repulser',owner:'Kirito',
      anime:'Sword Art Online',accent:'#1e5965',accent2:'#a4fff5',
      sketchfabId:'7c1def3ae60146c78eb1871ce7aeb954',
      sourceUrl:'https://sketchfab.com/3d-models/kiritos-dark-repulser-7c1def3ae60146c78eb1871ce7aeb954',
      description:'A crystalline blue-green sword forged for Kirito and paired with Elucidator for Dual Blades.'
    },
    {
      id:'blue-rose-sword',type:'weapon',kind:'longsword',name:'Blue Rose Sword',owner:'Eugeo',
      anime:'Sword Art Online: Alicization',accent:'#297bd7',accent2:'#e6fbff',
      sketchfabId:'ca533d34643d4034a2a3710b95a0ffd8',
      sourceUrl:'https://sketchfab.com/3d-models/blue-rose-sword-from-sword-art-online-ca533d34643d4034a2a3710b95a0ffd8',
      description:'A Divine Object with an icy blue blade and a rose motif capable of freezing its surroundings.'
    },
    {
      id:'dragon-slayer',type:'weapon',kind:'greatsword',name:'Dragon Slayer',owner:'Guts',
      anime:'Berserk',accent:'#343a48',accent2:'#ff6c5c',
      sketchfabId:'3f9e323324af41fdb4c54b97c8cb9807',
      sourceUrl:'https://sketchfab.com/3d-models/dragon-slayer-berserk-3f9e323324af41fdb4c54b97c8cb9807',
      description:'An impossibly large slab of iron made deadly through Guts’s strength and endless battles.'
    },
    {
      id:'murasame',type:'weapon',kind:'katana',name:'Murasame',owner:'Akame',
      anime:'Akame ga Kill!',accent:'#651827',accent2:'#ff526d',
      sketchfabId:'e815bef689ff40a3ace5513f63bb3e35',
      sourceUrl:'https://sketchfab.com/3d-models/murasame-e815bef689ff40a3ace5513f63bb3e35',
      description:'A cursed Teigu whose poisonous cut can kill a target with a single wound.'
    },
    {
      id:'lostvayne',type:'weapon',kind:'dagger',name:'Lostvayne',owner:'Meliodas',
      anime:'The Seven Deadly Sins',accent:'#3f274e',accent2:'#b784ff',
      imageUrl:'https://minikatana.com/cdn/shop/products/IMG_8727-1_36e97682-5065-4613-8018-a6a8854b786b_1100x.jpg?v=1657647023',
      sourceUrl:'https://minikatana.com/products/lostvayne-metal-dull-sword',
      mediaKind:'HD REPLICA',mediaLabel:'ANIME-ACCURATE REPLICA • MINI KATANA',
      description:'Meliodas’s curved Sacred Treasure, built to create physical clones of its wielder.'
    },
    {
      id:'chastiefol',type:'weapon',kind:'spear',name:'Spirit Spear Chastiefol',owner:'King',
      anime:'The Seven Deadly Sins',accent:'#19708a',accent2:'#94ffdd',
      sketchfabId:'19d518e9563c40b1b9e4f04faf857deb',
      sourceUrl:'https://sketchfab.com/3d-models/chastiefol-spirit-spear-seven-deadly-sins-19d518e9563c40b1b9e4f04faf857deb',
      description:'A Sacred Treasure made from the Fairy Realm’s sacred tree that changes between many forms.'
    },
    {
      id:'rhitta',type:'weapon',kind:'axe',name:'Divine Axe Rhitta',owner:'Escanor',
      anime:'The Seven Deadly Sins',accent:'#b84318',accent2:'#ffde68',
      sketchfabId:'98b6ee1cbd7a496db3ae3020b57252c5',
      sourceUrl:'https://sketchfab.com/3d-models/rhitta-escanors-axe-seven-deadly-sins-98b6ee1cbd7a496db3ae3020b57252c5',
      description:'A gigantic ornate axe that stores and releases the overwhelming heat of Sunshine.'
    },
    {
      id:'kurikara',type:'weapon',kind:'katana',name:'Kurikara',owner:'Rin Okumura',
      anime:'Blue Exorcist',accent:'#16325a',accent2:'#3bbdff',
      imageUrl:'https://minikatana.com/cdn/shop/files/BlueExorcistSword-DULL_1100x.png?v=1757112920',
      sourceUrl:'https://minikatana.com/products/rin-okumuras-katana-metal',
      mediaKind:'HD REPLICA',mediaLabel:'ANIME-ACCURATE REPLICA • MINI KATANA',
      description:'The demon-slaying blade that seals Rin’s demonic heart and releases his blue flames when drawn.'
    },
    {
      id:'playful-cloud',type:'weapon',kind:'staff',name:'Playful Cloud',owner:'Maki Zenin / Toji Fushiguro',
      anime:'Jujutsu Kaisen',accent:'#531c2a',accent2:'#ff8f63',
      sketchfabId:'5d79400ce4ec4830819aa0f347c2f2c9',
      sourceUrl:'https://sketchfab.com/3d-models/playful-cloud-jujutsu-kaisen-5d79400ce4ec4830819aa0f347c2f2c9',
      description:'A three-section cursed tool whose physical power depends entirely on the strength of its wielder.'
    },
    {
      id:'inverted-spear',type:'weapon',kind:'dagger',name:'Inverted Spear of Heaven',owner:'Toji Fushiguro',
      anime:'Jujutsu Kaisen',accent:'#293241',accent2:'#8bf5ff',
      sketchfabId:'089c61807b8b4c68ad5b814ae481b87f',
      sourceUrl:'https://sketchfab.com/3d-models/inverted-spear-of-heaven-jujutsu-kaisen-089c61807b8b4c68ad5b814ae481b87f',
      description:'A special-grade cursed tool capable of forcing active cursed techniques to stop.'
    },
    {
      id:'rebellion',type:'weapon',kind:'greatsword',name:'Rebellion',owner:'Dante',
      anime:'Devil May Cry',accent:'#491a24',accent2:'#ff6378',
      sketchfabId:'07a2646d166b469daa6bf41028d5e4cc',
      sourceUrl:'https://sketchfab.com/3d-models/rebellion-sword-game-asset-devil-may-cry-5-07a2646d166b469daa6bf41028d5e4cc',
      description:'Dante’s signature demonic greatsword, marked by a skeletal guard and immense power.'
    },
    {
      id:'excalibur',type:'weapon',kind:'longsword',name:'Excalibur',owner:'Saber',
      anime:'Fate',accent:'#765a17',accent2:'#fff1a4',
      sketchfabId:'dc4e601857e94a2b9c3acbd856943581',
      sourceUrl:'https://sketchfab.com/3d-models/fatestay-night-excalibur-updated-dc4e601857e94a2b9c3acbd856943581',
      description:'The golden Sword of Promised Victory, concealed by wind until its brilliant power is released.'
    },
    {
      id:'black-march',type:'weapon',kind:'needle',name:'Black March',owner:'Yuri Jahad / Bam',
      anime:'Tower of God',accent:'#22192c',accent2:'#f2b4ff',
      sketchfabId:'6e59cc78a1ee4ccd94fb7f24f8156a86',
      sourceUrl:'https://sketchfab.com/3d-models/black-march-blade-tower-of-god-6e59cc78a1ee4ccd94fb7f24f8156a86',
      description:'One of the legendary 13 Month Series weapons, appearing as a dark needle with a golden handle.'
    },
    {
      id:'demon-destroyer-sword',type:'weapon',kind:'greatsword',name:'Demon-Destroyer Sword',owner:'Asta',
      anime:'Black Clover',accent:'#242733',accent2:'#7ee9ff',
      sketchfabId:'d7ed451d88f34f51b8ce039376868c3c',
      sourceUrl:'https://sketchfab.com/3d-models/astas-demon-destroyer-sword-d7ed451d88f34f51b8ce039376868c3c',
      description:'Asta’s third anti-magic sword can sever the cause-and-effect relationship of spells and remove their lingering effects.'
    },
    {
      id:'tanjiro-nichirin',type:'weapon',kind:'katana',name:'Tanjiro’s Nichirin Sword',owner:'Tanjiro Kamado',
      anime:'Demon Slayer',accent:'#171b21',accent2:'#45e1ff',
      sketchfabId:'51b99ce0ffa943dea9d91fe24341fb35',
      sourceUrl:'https://sketchfab.com/3d-models/kamado-tanjiro-nichirin-sword-51b99ce0ffa943dea9d91fe24341fb35',
      description:'Tanjiro’s black Nichirin blade is forged from sunlight-absorbing ore and carried through his battles against demons.'
    },
    {
      id:'rengoku-nichirin',type:'weapon',kind:'katana',name:'Flame Nichirin Sword',owner:'Kyojuro Rengoku',
      anime:'Demon Slayer',accent:'#d2351d',accent2:'#ffd75d',
      sketchfabId:'c230d145932c43f1b44c7103552d0394',
      sourceUrl:'https://sketchfab.com/3d-models/rengoku-s-nichirin-c230d145932c43f1b44c7103552d0394',
      description:'Rengoku’s red Nichirin katana bears a flame-shaped guard and the engraving Destroyer of Demons.'
    },
    {
      id:'zenitsu-nichirin',type:'weapon',kind:'katana',name:'Thunder Nichirin Sword',owner:'Zenitsu Agatsuma',
      anime:'Demon Slayer',accent:'#a86d12',accent2:'#fff27a',
      sketchfabId:'988a106cadf54f66a0a7b07bee4d9ddc',
      sourceUrl:'https://sketchfab.com/3d-models/zenitsus-nichirin-katana-demon-slayer-988a106cadf54f66a0a7b07bee4d9ddc',
      description:'Zenitsu’s golden Nichirin blade is marked by a lightning pattern from hilt to tip.'
    },
    {
      id:'tengen-cleavers',type:'weapon',kind:'cleaver',name:'Nichirin Cleavers',owner:'Tengen Uzui',
      anime:'Demon Slayer',accent:'#7b284b',accent2:'#ffbfde',
      sketchfabId:'7f11ec4f79b840c58c9797c5038719f4',
      sourceUrl:'https://sketchfab.com/3d-models/tengen-uzuis-nichirin-sword-7f11ec4f79b840c58c9797c5038719f4',
      description:'Tengen’s enormous amber-edged Nichirin cleavers are chained together for his explosive Sound Breathing style.'
    },
    {
      id:'gyomei-flail-axe',type:'weapon',kind:'axe',name:'Nichirin Flail and Axe',owner:'Gyomei Himejima',
      anime:'Demon Slayer',accent:'#46526a',accent2:'#b5d9ff',
      sketchfabId:'2d36969b7f49483c97136b9a9bc44986',
      sourceUrl:'https://sketchfab.com/3d-models/swordtember-2022-day-23-chain-iconic-2d36969b7f49483c97136b9a9bc44986',
      description:'Gyomei’s unique Nichirin weapon joins a spiked flail and hand axe with a heavy chain.'
    },
    {
      id:'enma',type:'weapon',kind:'katana',name:'Enma',owner:'Roronoa Zoro / Kozuki Oden',
      anime:'One Piece',accent:'#5c245d',accent2:'#f6a8ff',
      sketchfabId:'3706646a721c4293a33dca08ffe5d825',
      sourceUrl:'https://sketchfab.com/3d-models/katana-enma-3706646a721c4293a33dca08ffe5d825',
      description:'One of Oden’s legendary blades, Enma forcefully draws out its wielder’s Haki and now belongs to Zoro.'
    },
    {
      id:'wado-ichimonji',type:'weapon',kind:'katana',name:'Wado Ichimonji',owner:'Roronoa Zoro',
      anime:'One Piece',accent:'#e2e5ee',accent2:'#fff8d4',
      sketchfabId:'3b40e5a485c34a1b8a88104756f81610',
      sourceUrl:'https://sketchfab.com/3d-models/zoro-katana-3b40e5a485c34a1b8a88104756f81610',
      description:'The white-hilted Great Grade sword Zoro inherited after promising Kuina that one of them would become the world’s greatest swordsman.'
    },
    {
      id:'yoru',type:'weapon',kind:'greatsword',name:'Yoru',owner:'Dracule Mihawk',
      anime:'One Piece',accent:'#171a21',accent2:'#72f0a4',
      sketchfabId:'8f5adf7747a246a8b1f9eb5c1ab9316e',
      sourceUrl:'https://sketchfab.com/3d-models/yoru-one-piece-dracula-mihawk-black-sword-8f5adf7747a246a8b1f9eb5c1ab9316e',
      description:'Mihawk’s enormous cruciform Black Blade is one of the world’s twelve Supreme Grade swords.'
    },
    {
      id:'samehada',type:'weapon',kind:'greatsword',name:'Samehada',owner:'Kisame Hoshigaki',
      anime:'Naruto Shippuden',accent:'#243a54',accent2:'#83caff',
      sketchfabId:'5bacda6b788c44f9a1e98b6fc0e9c254',
      sourceUrl:'https://sketchfab.com/3d-models/naruto-shippuden-samehada-5bacda6b788c44f9a1e98b6fc0e9c254',
      description:'A living, scale-covered blade that shreds its target and feeds on chakra instead of cutting cleanly.'
    },
    {
      id:'kubikiribocho',type:'weapon',kind:'cleaver',name:'Kubikiribōchō',owner:'Zabuza Momochi / Suigetsu Hozuki',
      anime:'Naruto',accent:'#3c4651',accent2:'#dceeff',
      sketchfabId:'3ba757110ebb4a479874a7aea2532b96',
      sourceUrl:'https://sketchfab.com/3d-models/kubikiribocho-aka-zabuzas-sword-3ba757110ebb4a479874a7aea2532b96',
      description:'The Executioner’s Blade repairs damage by absorbing iron from the blood of those it cuts.'
    },
    {
      id:'senbonzakura',type:'weapon',kind:'katana',name:'Senbonzakura',owner:'Byakuya Kuchiki',
      anime:'Bleach',accent:'#713e78',accent2:'#ffb9ef',
      sketchfabId:'6e98d195d2c246aba076049c1c359c3c',
      sourceUrl:'https://sketchfab.com/3d-models/6e98d195d2c246aba076049c1c359c3c',
      description:'Byakuya’s elegant Zanpakutō disperses into countless petal-like blades when released.'
    },
    {
      id:'nozarashi',type:'weapon',kind:'axe',name:'Nozarashi',owner:'Kenpachi Zaraki',
      anime:'Bleach',accent:'#51493d',accent2:'#f2d68e',
      sketchfabId:'296a44990bc14d96a43f262913d1b5ca',
      sourceUrl:'https://sketchfab.com/3d-models/nozarashi-bleach-296a44990bc14d96a43f262913d1b5ca',
      description:'Kenpachi’s released Zanpakutō becomes a gigantic war-cleaver capable of cutting through massive opponents.'
    },
    {
      id:'hyorinmaru',type:'weapon',kind:'katana',name:'Hyōrinmaru',owner:'Tōshirō Hitsugaya',
      anime:'Bleach',accent:'#205579',accent2:'#9deaff',
      sketchfabId:'53ca107bd8e34cb195b3baa04d93820b',
      sourceUrl:'https://sketchfab.com/3d-models/japanese-sword-katana-hyorinmaru-53ca107bd8e34cb195b3baa04d93820b',
      description:'Hitsugaya’s ice-type Zanpakutō commands frozen water and manifests a chain with a crescent blade at its hilt.'
    },
    {
      id:'soul-evans-scythe',type:'weapon',kind:'spear',name:'Soul Evans — Scythe Form',owner:'Maka Albarn',
      anime:'Soul Eater',accent:'#782235',accent2:'#ff6f7f',
      sketchfabId:'302b1bd3047742cdb69de27df6e0692f',
      sourceUrl:'https://sketchfab.com/3d-models/soul-eater-soul-evans-scythe-form-302b1bd3047742cdb69de27df6e0692f',
      description:'Soul transforms into a red-and-black demon scythe and synchronizes with Maka through soul resonance.'
    },
    {
      id:'gae-bolg',type:'weapon',kind:'spear',name:'Gáe Bolg',owner:'Cú Chulainn',
      anime:'Fate/stay night',accent:'#7b1027',accent2:'#ff5b74',
      sketchfabId:'b92555eef0b2433d81e72ef8dd038c3d',
      sourceUrl:'https://sketchfab.com/3d-models/gae-bolg-cu-chulainn-b92555eef0b2433d81e72ef8dd038c3d',
      description:'Lancer’s crimson cursed spear reverses cause and effect so its thrust is destined to pierce the heart.'
    },
    {
      id:'killua-yoyos',type:'weapon',kind:'staff',name:'50-Kilogram Yo-Yos',owner:'Killua Zoldyck',
      anime:'Hunter × Hunter',accent:'#343d63',accent2:'#9bd8ff',
      sketchfabId:'b71eb6ada5ca41dc9884a8242e1c7e9d',
      sourceUrl:'https://sketchfab.com/3d-models/killuas-yoyo-hunter-x-hunter-b71eb6ada5ca41dc9884a8242e1c7e9d',
      description:'Killua’s nearly indestructible yo-yos weigh fifty kilograms each and double as devastating close-range weapons.'
    },
    {
      id:'hestia-knife',type:'weapon',kind:'dagger',name:'Hestia Knife',owner:'Bell Cranel',
      anime:'Is It Wrong to Try to Pick Up Girls in a Dungeon?',accent:'#473b78',accent2:'#95f5ff',
      sketchfabId:'fd8d9286ad5a4cabaa0067317ec73108',
      sourceUrl:'https://sketchfab.com/3d-models/danmachi-hestia-knife-fd8d9286ad5a4cabaa0067317ec73108',
      description:'A living Divine Knife forged by Hephaestus that grows stronger alongside Bell and bears Hestia’s sacred writing.'
    }
  ];

  const POWER_MARKUP={
    telekinesis:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-shard shard-a"></span><span class="fx-shard shard-b"></span><span class="fx-shard shard-c"></span>',
    hollow:'<span class="fx-orb orb-a"></span><span class="fx-orb orb-b"></span><span class="fx-core"></span><span class="fx-ring ring-b"></span>',
    kamehameha:'<span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-beam"></span>',
    arise:'<span class="fx-core"></span><span class="fx-symbol">ARISE</span><span class="fx-shard shard-a"></span><span class="fx-shard shard-b"></span>',
    getsuga:'<span class="fx-ring ring-b"></span><span class="fx-slash"></span><span class="fx-core"></span>',
    megiddo:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span>',
    zoltraak:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-beam"></span>',
    shrine:'<span class="fx-symbol">伏魔</span><span class="fx-slash"></span><span class="fx-ring ring-b"></span>',
    impact:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-slash"></span>',
    adolla:'<span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-shard shard-a"></span><span class="fx-shard shard-b"></span>',
    counter:'<span class="fx-ring"></span><span class="fx-ring ring-b"></span><span class="fx-core"></span><span class="fx-beam"></span>',
    water:'<span class="fx-ring ring-b"></span><span class="fx-slash"></span><span class="fx-core"></span>'
  };

  let svgSequence=0;
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  function weaponShape(kind){
    if(kind==='katana')return `
      <path d="M162 273 Q391 130 650 75" fill="none" stroke="url(#blade)" stroke-width="20" stroke-linecap="round"/>
      <path d="M163 274 Q394 144 650 83" fill="none" stroke="url(#edge)" stroke-width="4" stroke-linecap="round"/>
      <path d="M92 319 L164 272" stroke="url(#grip)" stroke-width="24" stroke-linecap="round"/>
      <path d="M108 305l10 12m8-24l10 12m8-24l10 12" stroke="#f6f4ff" stroke-opacity=".52" stroke-width="3"/>
      <path d="M151 252l32 38" stroke="url(#metal)" stroke-width="10" stroke-linecap="round"/>`;
    if(kind==='greatsword')return `
      <path d="M214 287 L548 45 L657 55 L630 145 L292 326 Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="7"/>
      <path d="M272 300L621 71" stroke="url(#edge)" stroke-width="6" opacity=".9"/>
      <path d="M127 336L240 268" stroke="url(#grip)" stroke-width="31" stroke-linecap="round"/>
      <path d="M195 252L261 329" stroke="url(#metal)" stroke-width="15" stroke-linecap="round"/>
      <path d="M137 326l12 17m14-33l12 17m14-33l12 17" stroke="#fff" stroke-opacity=".5" stroke-width="4"/>`;
    if(kind==='cleaver')return `
      <path d="M245 290 L532 67 Q605 38 665 58 L609 183 L291 330 Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="7"/>
      <path d="M285 306L620 91" stroke="url(#edge)" stroke-width="6"/>
      <circle cx="592" cy="105" r="17" fill="#060712" stroke="url(#accent)" stroke-width="5"/>
      <path d="M126 344L250 272" stroke="url(#grip)" stroke-width="30" stroke-linecap="round"/>
      <path d="M205 263L267 326" stroke="url(#metal)" stroke-width="15" stroke-linecap="round"/>`;
    if(kind==='longsword')return `
      <path d="M233 291 L573 42 L650 44 L624 116 L282 324 Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="6"/>
      <path d="M275 305L620 67" stroke="url(#edge)" stroke-width="5"/>
      <path d="M133 345L244 276" stroke="url(#grip)" stroke-width="25" stroke-linecap="round"/>
      <path d="M205 258L270 333" stroke="url(#accent)" stroke-width="13" stroke-linecap="round"/>
      <circle cx="130" cy="346" r="15" fill="url(#accent)" stroke="#f8f7ff" stroke-opacity=".5" stroke-width="4"/>`;
    if(kind==='dagger')return `
      <path d="M280 273 L546 91 L628 89 L587 159 L330 312 Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="7"/>
      <path d="M326 291L587 116" stroke="url(#edge)" stroke-width="5"/>
      <path d="M164 342L292 259" stroke="url(#grip)" stroke-width="29" stroke-linecap="round"/>
      <path d="M244 245L320 326" stroke="url(#accent)" stroke-width="14" stroke-linecap="round"/>`;
    if(kind==='spear')return `
      <path d="M100 321L578 101" stroke="url(#grip)" stroke-width="20" stroke-linecap="round"/>
      <path d="M553 106L663 35L625 151Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="6"/>
      <path d="M548 111L624 83" stroke="url(#accent)" stroke-width="10" stroke-linecap="round"/>
      <circle cx="126" cy="309" r="15" fill="url(#accent)" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`;
    if(kind==='staff')return `
      <path d="M100 309L260 240M284 228L445 155M469 143L641 65" stroke="url(#grip)" stroke-width="25" stroke-linecap="round"/>
      <path d="M245 225L292 244M430 139L476 160" stroke="url(#metal)" stroke-width="19" stroke-linecap="round"/>
      <path d="M112 297L248 238M296 224L434 162M480 140L628 73" stroke="url(#edge)" stroke-width="4" opacity=".72"/>`;
    if(kind==='axe')return `
      <path d="M138 334L506 103" stroke="url(#grip)" stroke-width="29" stroke-linecap="round"/>
      <path d="M453 129Q539 30 669 44Q654 150 548 212L489 168Z" fill="url(#blade)" stroke="url(#metal)" stroke-width="7"/>
      <path d="M526 110Q581 72 640 69" fill="none" stroke="url(#edge)" stroke-width="8" stroke-linecap="round"/>
      <circle cx="490" cy="145" r="25" fill="url(#accent)" stroke="#fff" stroke-opacity=".45" stroke-width="5"/>`;
    return `
      <path d="M120 325L622 70" stroke="url(#blade)" stroke-width="13" stroke-linecap="round"/>
      <path d="M585 90L662 48L620 111Z" fill="url(#accent)" stroke="url(#metal)" stroke-width="5"/>
      <path d="M107 333L198 288" stroke="url(#grip)" stroke-width="26" stroke-linecap="round"/>
      <path d="M181 272L211 310" stroke="url(#metal)" stroke-width="12" stroke-linecap="round"/>`;
  }

  function weaponArt(item){
    const uid=`weapon-${++svgSequence}`;
    return `<span class="arsenal-weapon-aura" aria-hidden="true"></span>
      <svg class="arsenal-weapon-svg" viewBox="0 0 760 360" role="img" aria-label="${escapeHtml(item.name)} vector artwork">
        <defs>
          <linearGradient id="${uid}-blade" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#161a27"/><stop offset=".38" stop-color="#f8fbff"/><stop offset=".62" stop-color="#7f8da9"/><stop offset="1" stop-color="#202536"/></linearGradient>
          <linearGradient id="${uid}-edge" x1="0" x2="1"><stop stop-color="${escapeHtml(item.accent2)}"/><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="${escapeHtml(item.accent2)}"/></linearGradient>
          <linearGradient id="${uid}-metal" x1="0" x2="1"><stop stop-color="#272c3c"/><stop offset=".5" stop-color="#e7eaf4"/><stop offset="1" stop-color="#252a39"/></linearGradient>
          <linearGradient id="${uid}-grip" x1="0" x2="1"><stop stop-color="#080914"/><stop offset=".5" stop-color="${escapeHtml(item.accent)}"/><stop offset="1" stop-color="#060710"/></linearGradient>
          <linearGradient id="${uid}-accent" x1="0" x2="1"><stop stop-color="${escapeHtml(item.accent)}"/><stop offset=".5" stop-color="${escapeHtml(item.accent2)}"/><stop offset="1" stop-color="#fff"/></linearGradient>
          <filter id="${uid}-glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <g transform="rotate(-2 380 180)" filter="url(#${uid}-glow)"
          style="--blade:url(#${uid}-blade);--edge:url(#${uid}-edge);--metal:url(#${uid}-metal);--grip:url(#${uid}-grip);--accent:url(#${uid}-accent)">
          ${weaponShape(item.kind)
            .replaceAll('url(#blade)',`url(#${uid}-blade)`)
            .replaceAll('url(#edge)',`url(#${uid}-edge)`)
            .replaceAll('url(#metal)',`url(#${uid}-metal)`)
            .replaceAll('url(#grip)',`url(#${uid}-grip)`)
            .replaceAll('url(#accent)',`url(#${uid}-accent)`)}
        </g>
      </svg>`;
  }

  function mediaMeta(item){
    if(item.type==='power'){
      return {
        kind:'ANIME GIF',
        label:'REAL ANIME GIF • TENOR',
        src:`https://tenor.com/embed/${encodeURIComponent(item.tenorId)}`,
        className:'arsenal-tenor-frame',
        tag:'iframe'
      };
    }
    if(item.sketchfabId){
      return {
        kind:'EXACT 3D',
        label:'SOURCED 3D REPLICA • SKETCHFAB',
        src:`https://sketchfab.com/models/${encodeURIComponent(item.sketchfabId)}/embed?autostart=1&autospin=0.25&ui_hint=0&ui_theme=dark&ui_infos=0&ui_controls=0&ui_watermark=1&dnt=1`,
        className:'arsenal-model-frame',
        tag:'iframe'
      };
    }
    return {
      kind:item.mediaKind||'ANIME STILL',
      label:item.mediaLabel||'SOURCED ANIME WEAPON STILL',
      src:item.imageUrl,
      className:'arsenal-media-image',
      tag:'img'
    };
  }

  function visualMarkup(item,index,showcase=false){
    const media=mediaMeta(item);
    const classes=`arsenal-visual ${showcase?'arsenal-showcase-visual ':''}${item.type==='power'?'arsenal-power-media':'arsenal-weapon-media'}`;
    const content=media.tag==='iframe'
      ? `<iframe class="arsenal-media-frame ${media.className}" data-arsenal-media-src="${escapeHtml(media.src)}" title="${escapeHtml(`${item.name} ${media.kind.toLowerCase()}`)}" tabindex="-1" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe>`
      : `<img class="${media.className}" data-arsenal-media-src="${escapeHtml(media.src)}" alt="${escapeHtml(`${item.name}, the weapon used by ${item.owner}`)}" loading="lazy" decoding="async">`;
    return `<div class="${classes}" data-accent="${escapeHtml(item.accent)}" data-accent2="${escapeHtml(item.accent2)}" style="--accent:${escapeHtml(item.accent)};--accent2:${escapeHtml(item.accent2)}">
      <div class="arsenal-media-shell">
        <span class="arsenal-media-loading" aria-hidden="true"><i></i><b>LOADING REAL MEDIA</b></span>
        ${content}
        <span class="arsenal-media-failed" role="status">REAL MEDIA UNAVAILABLE — OPEN SOURCE</span>
      </div>
      ${showcase?'':`<span class="arsenal-index">${String(index+1).padStart(2,'0')}</span><span class="arsenal-kind">${media.kind}</span><span class="arsenal-media-label">${media.label}</span>`}
    </div>`;
  }

  function cardMarkup(item,index){
    const media=mediaMeta(item);
    return `<article class="arsenal-card" role="button" tabindex="0" data-arsenal-id="${escapeHtml(item.id)}" data-arsenal-type="${item.type}" data-search="${escapeHtml(`${item.name} ${item.owner} ${item.anime}`.toLowerCase())}" style="--accent:${escapeHtml(item.accent)};--accent2:${escapeHtml(item.accent2)}" aria-label="Open ${escapeHtml(item.name)} showcase">
      ${visualMarkup(item,index)}
      <span class="arsenal-card-copy">
        <span class="arsenal-anime">${escapeHtml(item.anime)}</span>
        <h3>${escapeHtml(item.name)}</h3>
        <span class="arsenal-owner">${escapeHtml(item.owner)}</span>
        <span class="arsenal-card-footer"><span>${media.label}</span><b>${item.type==='power'?'WATCH ATTACK':'INSPECT WEAPON'}</b></span>
      </span>
    </article>`;
  }

  const canvasStates=new Map();
  let canvasObserver;
  let mediaObserver;

  function loadMedia(media){
    if(!media||media.dataset.arsenalMediaLoaded==='1')return;
    const src=media.dataset.arsenalMediaSrc;
    if(!src)return;
    media.dataset.arsenalMediaLoaded='1';
    const shell=media.closest('.arsenal-media-shell');
    const loaded=()=>{
      shell?.classList.add('media-loaded');
      shell?.classList.remove('media-failed');
    };
    const failed=()=>{
      shell?.classList.add('media-failed');
      shell?.classList.remove('media-loaded');
    };
    media.addEventListener('load',loaded,{once:true});
    media.addEventListener('error',failed,{once:true});
    media.src=src;
  }

  function initializeMedia(media,immediate=false){
    if(immediate||!mediaObserver)loadMedia(media);
    else mediaObserver.observe(media);
  }

  function hexRgb(value){
    const hex=String(value||'#ffffff').replace('#','');
    const expanded=hex.length===3?hex.split('').map(char=>char+char).join(''):hex.padEnd(6,'f').slice(0,6);
    return [0,2,4].map(offset=>parseInt(expanded.slice(offset,offset+2),16));
  }

  function color(rgb,alpha=1){
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
  }

  function seedParticles(count){
    return Array.from({length:count},(_,index)=>({
      x:Math.random(),y:Math.random(),r:.5+Math.random()*2.2,s:.2+Math.random()*1.1,
      a:.25+Math.random()*.75,o:Math.random()*Math.PI*2,index
    }));
  }

  function sizeCanvas(state){
    const {canvas}=state;
    const rect=canvas.getBoundingClientRect();
    if(rect.width<2||rect.height<2)return;
    const ratio=Math.min(2,window.devicePixelRatio||1);
    const width=Math.round(rect.width*ratio),height=Math.round(rect.height*ratio);
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;canvas.height=height;
      state.width=rect.width;state.height=rect.height;state.ratio=ratio;
      state.ctx.setTransform(ratio,0,0,ratio,0,0);
    }
  }

  function glowDot(ctx,x,y,r,rgb,alpha){
    const gradient=ctx.createRadialGradient(x,y,0,x,y,r*5);
    gradient.addColorStop(0,color([255,255,255],Math.min(1,alpha)));
    gradient.addColorStop(.18,color(rgb,alpha));
    gradient.addColorStop(1,color(rgb,0));
    ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x,y,r*5,0,Math.PI*2);ctx.fill();
  }

  function drawCanvas(state,time){
    sizeCanvas(state);
    const {ctx,width:w,height:h,effect,particles,palette}=state;
    if(!w||!h)return;
    const t=time*.001;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.globalCompositeOperation='lighter';

    if(effect==='telekinesis'){
      particles.forEach(p=>{
        const angle=t*(.35+p.s*.16)+p.o;
        const radius=(.12+p.x*.42)*Math.min(w,h);
        const x=w/2+Math.cos(angle)*radius;
        const y=h/2+Math.sin(angle*1.35)*radius*.54+Math.sin(t*2+p.o)*8;
        const hue=Math.sin(t+p.o)>.15?palette[0]:palette[1];
        glowDot(ctx,x,y,p.r+1,hue,p.a*.64);
        ctx.strokeStyle=color(hue,p.a*.38);ctx.lineWidth=.7;
        ctx.beginPath();ctx.moveTo(w/2,h/2);ctx.lineTo(x,y);ctx.stroke();
      });
    }else if(effect==='hollow'){
      particles.forEach(p=>{
        const phase=(t*.33+p.o)%(Math.PI*2),side=p.index%2?-1:1;
        const cx=w/2+side*(42*(1-Math.min(1,(Math.sin(t*.98)+1)/2)));
        const x=cx+Math.cos(phase)*(16+p.x*42),y=h/2+Math.sin(phase)*(12+p.y*35);
        glowDot(ctx,x,y,p.r,p.index%2?palette[0]:palette[1],p.a*.7);
      });
    }else if(['kamehameha','zoltraak','counter'].includes(effect)){
      particles.forEach(p=>{
        const cycle=(p.x+t*(.38+p.s*.18))%1;
        const x=w*.18+cycle*w*.84;
        const y=h/2+Math.sin(p.o+t*3)*((p.y-.5)*58);
        glowDot(ctx,x,y,p.r+cycle*1.4,p.index%3?palette[0]:palette[1],p.a*(1-cycle*.45));
      });
    }else if(effect==='arise'){
      particles.forEach(p=>{
        const cycle=(p.y-t*(.07+p.s*.035)+2)%1;
        const x=w*(.08+p.x*.84)+Math.sin(t+p.o)*9;
        const y=h*(.93-cycle*.86);
        const tail=14+p.s*24;
        ctx.strokeStyle=color(p.index%3?palette[0]:palette[1],p.a*.55);
        ctx.lineWidth=p.r;ctx.beginPath();ctx.moveTo(x,y+tail);ctx.quadraticCurveTo(x+8,y+tail*.5,x,y);ctx.stroke();
        glowDot(ctx,x,y,p.r,palette[1],p.a*.45);
      });
    }else if(effect==='getsuga'){
      particles.forEach(p=>{
        const cycle=(t*.3+p.x)%1;
        const angle=-.3+cycle*.62;
        const radius=w*(.17+p.y*.48);
        const x=w*.42+Math.cos(angle)*radius,y=h*.62+Math.sin(angle)*radius;
        glowDot(ctx,x,y,p.r+1,p.index%4?palette[0]:palette[1],p.a*.65);
      });
    }else if(effect==='megiddo'){
      particles.slice(0,28).forEach(p=>{
        const x=w*(.08+p.x*.84),cycle=(p.y+t*(.27+p.s*.1))%1,y=cycle*h;
        const gradient=ctx.createLinearGradient(x,y-36,x,y+12);
        gradient.addColorStop(0,color(palette[0],0));gradient.addColorStop(.7,color(palette[1],p.a*.76));gradient.addColorStop(1,'rgba(255,255,255,.9)');
        ctx.strokeStyle=gradient;ctx.lineWidth=1+p.r*.7;ctx.beginPath();ctx.moveTo(x,y-38);ctx.lineTo(x,y+10);ctx.stroke();
      });
    }else if(effect==='shrine'){
      particles.slice(0,26).forEach(p=>{
        const cycle=(p.x+t*(.55+p.s*.17))%1,x=cycle*w,y=p.y*h;
        ctx.strokeStyle=color(p.index%3?palette[0]:palette[1],p.a*.76);ctx.lineWidth=.8+p.r;
        ctx.beginPath();ctx.moveTo(x-34,y+17);ctx.lineTo(x+34,y-17);ctx.stroke();
      });
    }else if(effect==='impact'){
      particles.forEach(p=>{
        const cycle=(p.x+t*(.38+p.s*.16))%1,angle=p.o,radius=cycle*Math.max(w,h)*.62;
        const x=w/2+Math.cos(angle)*radius,y=h/2+Math.sin(angle)*radius;
        ctx.strokeStyle=color(p.index%4?palette[0]:palette[1],p.a*(1-cycle));ctx.lineWidth=p.r;
        ctx.beginPath();ctx.moveTo(w/2+Math.cos(angle)*Math.max(0,radius-32),h/2+Math.sin(angle)*Math.max(0,radius-32));ctx.lineTo(x,y);ctx.stroke();
      });
    }else if(effect==='adolla'){
      particles.forEach(p=>{
        const cycle=(p.y-t*(.19+p.s*.11)+2)%1;
        const x=w/2+(p.x-.5)*w*.38+Math.sin(t*4+p.o)*14*cycle,y=h*(.92-cycle*.93);
        glowDot(ctx,x,y,p.r+1,p.index%3?palette[0]:palette[1],p.a*(1-cycle*.58));
      });
    }else if(effect==='water'){
      particles.forEach(p=>{
        const cycle=(p.x+t*(.16+p.s*.08))%1;
        const x=cycle*w,y=h*.56+Math.sin(cycle*Math.PI*2.1+t*1.7+p.o*.08)*h*.17;
        glowDot(ctx,x,y,p.r+1,p.index%3?palette[0]:palette[1],p.a*.58);
      });
    }
    ctx.restore();
  }

  function initializeCanvas(canvas){
    if(canvasStates.has(canvas))return;
    const root=canvas.closest('.arsenal-visual');
    const state={
      canvas,ctx:canvas.getContext('2d'),effect:root?.dataset.effect||'impact',
      palette:[hexRgb(root?.dataset.accent2),hexRgb(root?.dataset.accent)],
      particles:seedParticles(root?.classList.contains('arsenal-showcase-visual')?88:54),
      width:0,height:0,ratio:1,active:false
    };
    canvasStates.set(canvas,state);
    canvasObserver?.observe(canvas);
    if('ResizeObserver' in window)new ResizeObserver(()=>sizeCanvas(state)).observe(canvas);
    sizeCanvas(state);
  }

  function animationLoop(time){
    for(const [canvas,state] of canvasStates){
      if(!canvas.isConnected){canvasStates.delete(canvas);continue}
      if(state.active&&!document.hidden)drawCanvas(state,time);
    }
    requestAnimationFrame(animationLoop);
  }

  function openShowcase(item,index){
    const dialog=document.getElementById('arsenalShowcase');
    if(!dialog)return;
    const media=mediaMeta(item);
    dialog.style.setProperty('--showcase-accent',item.accent);
    dialog.querySelector('#arsenalShowcaseBody').innerHTML=`
      ${visualMarkup(item,index,true)}
      <div class="arsenal-showcase-copy">
        <div>
          <span class="arsenal-anime">${escapeHtml(item.anime)} • ${media.label}</span>
          <h2>${escapeHtml(item.name)}</h2>
          <p><strong>${escapeHtml(item.owner)}</strong> — ${escapeHtml(item.description)}</p>
          <a class="arsenal-showcase-source" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">OPEN ORIGINAL MEDIA SOURCE ↗</a>
        </div>
        <span class="arsenal-showcase-number">${String(index+1).padStart(2,'0')}</span>
      </div>`;
    dialog.showModal();
    document.body.classList.add('arsenal-dialog-open');
    requestAnimationFrame(()=>dialog.querySelectorAll('[data-arsenal-media-src]').forEach(node=>initializeMedia(node,true)));
    navigator.vibrate?.(item.type==='power'?[18,28,36]:12);
  }

  function renderArsenal(section){
    const grid=section.querySelector('#arsenalGrid');
    grid.innerHTML=ITEMS.map(cardMarkup).join('');
    grid.querySelectorAll('[data-arsenal-media-src]').forEach(node=>initializeMedia(node));
  }

  function install(){
    if(document.documentElement.dataset.arsenalV36)return true;
    const app=document.getElementById('app');
    const nav=document.querySelector('.bottom-nav');
    const topbar=document.querySelector('.topbar');
    if(!app||!nav||!topbar)return false;
    document.documentElement.dataset.arsenalV36='1';

    let arsenalStyles=document.querySelector('link[href*="arsenal-v34.css"]');
    if(!arsenalStyles){
      arsenalStyles=document.createElement('link');
      arsenalStyles.rel='stylesheet';
      document.head.appendChild(arsenalStyles);
    }
    arsenalStyles.href='./arsenal-v34.css?release=36';

    const settingsNav=nav.querySelector('[data-view="settings"]');
    if(settingsNav){
      settingsNav.dataset.view='arsenal';
      settingsNav.setAttribute('aria-label','Open Arsenal');
      settingsNav.innerHTML='<span aria-hidden="true">⚔</span>Arsenal';
    }
    nav.classList.add('kn-bottom-nav');
    nav.dataset.knSafeNav='22';
    const setNavHeight=()=>document.documentElement.style.setProperty('--kn-bottom-nav-height',`${Math.ceil(nav.getBoundingClientRect().height)}px`);
    setNavHeight();
    if('ResizeObserver' in window)new ResizeObserver(setNavHeight).observe(nav);

    if(!document.getElementById('arsenalSettingsButton')){
      const settings=document.createElement('button');
      settings.id='arsenalSettingsButton';
      settings.className='arsenal-settings-button';
      settings.type='button';settings.dataset.view='settings';
      settings.setAttribute('aria-label','Settings');
      settings.innerHTML='<span aria-hidden="true">⚙</span>';
      const profile=topbar.querySelector('.profile-button');
      topbar.insertBefore(settings,profile||null);
    }

    const section=document.createElement('section');
    section.id='arsenalView';section.className='view arsenal-view';section.dataset.viewName='arsenal';
    const powerCount=ITEMS.filter(item=>item.type==='power').length;
    const weaponCount=ITEMS.filter(item=>item.type==='weapon').length;
    const totalCount=ITEMS.length;
    section.innerHTML=`
      <div class="section-heading arsenal-heading">
        <button class="back-button" data-view="home">← HOME</button>
        <div class="arsenal-heading-copy">
          <p class="eyebrow">${totalCount} RELICS, POWERS + TECHNIQUES</p>
          <h2>Arsenal</h2>
          <p class="arsenal-lede">Physical weapons and unforgettable abilities from across your anime universe. Tap anything to unleash its full showcase.</p>
        </div>
      </div>
      <section class="arsenal-overview" aria-label="Arsenal collection summary">
        <div><strong>The real moves. The exact weapons.</strong><p>${powerCount} sourced anime attack GIFs plus ${weaponCount} exact weapon models and stills. Every entry links back to the original media source.</p></div>
        <div class="arsenal-counts"><span><b>${powerCount}</b><small>Anime GIFs</small></span><span><b>${weaponCount}</b><small>Exact Weapons</small></span><span><b>${totalCount}</b><small>Sourced</small></span></div>
      </section>
      <div class="arsenal-toolbar">
        <label class="arsenal-search-wrap"><input id="arsenalSearch" type="search" autocomplete="off" placeholder="Search weapon, power, character or anime…" aria-label="Search Arsenal"></label>
        <div class="arsenal-filters" aria-label="Arsenal filters">
          <button class="arsenal-filter active" type="button" data-arsenal-filter="all">ALL ${totalCount}</button>
          <button class="arsenal-filter" type="button" data-arsenal-filter="power">POWERS ${powerCount}</button>
          <button class="arsenal-filter" type="button" data-arsenal-filter="weapon">WEAPONS ${weaponCount}</button>
        </div>
        <button class="arsenal-random" id="arsenalRandom" type="button">UNLEASH RANDOM</button>
      </div>
      <div class="arsenal-results-line"><span id="arsenalResultCount"><strong>${totalCount}</strong> entries ready</span><span>Tap to view in action</span></div>
      <div class="arsenal-grid" id="arsenalGrid"></div>`;
    app.appendChild(section);

    const dialog=document.createElement('dialog');
    dialog.id='arsenalShowcase';dialog.className='arsenal-showcase';
    dialog.innerHTML='<button class="arsenal-showcase-close" type="button" aria-label="Close showcase">×</button><div id="arsenalShowcaseBody"></div>';
    document.body.appendChild(dialog);

    canvasObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const state=canvasStates.get(entry.target);
        if(state)state.active=entry.isIntersecting;
      });
    },{rootMargin:'80px 0px',threshold:.05});
    mediaObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        mediaObserver.unobserve(entry.target);
        loadMedia(entry.target);
      });
    },{rootMargin:'420px 0px',threshold:.01});

    renderArsenal(section);

    let activeFilter='all';
    const updateResults=()=>{
      const query=section.querySelector('#arsenalSearch').value.trim().toLowerCase();
      let count=0;
      section.querySelectorAll('.arsenal-card').forEach(card=>{
        const matchesType=activeFilter==='all'||card.dataset.arsenalType===activeFilter;
        const matchesQuery=!query||card.dataset.search.includes(query);
        card.hidden=!(matchesType&&matchesQuery);
        if(!card.hidden)count++;
      });
      const countLine=section.querySelector('#arsenalResultCount');
      countLine.innerHTML=count
        ? `<strong>${count}</strong> entr${count===1?'y':'ies'} ready`
        : '<strong>0</strong> matches';
      let empty=section.querySelector('.arsenal-empty');
      if(!count&&!empty){
        empty=document.createElement('div');empty.className='arsenal-empty';
        empty.innerHTML='<b>No Arsenal entries found.</b><span>Try a character, anime, weapon or attack name.</span>';
        section.querySelector('#arsenalGrid').appendChild(empty);
      }else if(count&&empty)empty.remove();
    };

    section.querySelector('#arsenalSearch').addEventListener('input',updateResults);
    section.querySelector('.arsenal-filters').addEventListener('click',event=>{
      const button=event.target.closest('[data-arsenal-filter]');if(!button)return;
      activeFilter=button.dataset.arsenalFilter;
      section.querySelectorAll('.arsenal-filter').forEach(item=>item.classList.toggle('active',item===button));
      updateResults();
    });
    section.querySelector('#arsenalGrid').addEventListener('click',event=>{
      const card=event.target.closest('[data-arsenal-id]');if(!card)return;
      const index=ITEMS.findIndex(item=>item.id===card.dataset.arsenalId);
      if(index>=0)openShowcase(ITEMS[index],index);
    });
    section.querySelector('#arsenalGrid').addEventListener('keydown',event=>{
      if(event.key!=='Enter'&&event.key!==' ')return;
      const card=event.target.closest('[data-arsenal-id]');if(!card)return;
      event.preventDefault();
      const index=ITEMS.findIndex(item=>item.id===card.dataset.arsenalId);
      if(index>=0)openShowcase(ITEMS[index],index);
    });
    section.querySelector('#arsenalRandom').addEventListener('click',()=>{
      const visible=[...section.querySelectorAll('.arsenal-card:not([hidden])')];
      if(!visible.length)return;
      const card=visible[Math.floor(Math.random()*visible.length)];
      const index=ITEMS.findIndex(item=>item.id===card.dataset.arsenalId);
      if(index>=0)openShowcase(ITEMS[index],index);
    });

    const closeDialog=()=>{
      if(dialog.open)dialog.close();
      document.body.classList.remove('arsenal-dialog-open');
      dialog.querySelector('#arsenalShowcaseBody').replaceChildren();
    };
    dialog.querySelector('.arsenal-showcase-close').addEventListener('click',closeDialog);
    dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});
    dialog.addEventListener('close',()=>{
      document.body.classList.remove('arsenal-dialog-open');
      dialog.querySelector('#arsenalShowcaseBody').replaceChildren();
    });

    const syncArsenalState=()=>{
      const active=section.classList.contains('active');
      document.body.classList.toggle('arsenal-active',active);
      if(!active&&dialog.open)closeDialog();
    };
    new MutationObserver(syncArsenalState).observe(section,{attributes:true,attributeFilter:['class']});
    syncArsenalState();

    try{
      const state=JSON.parse(localStorage.getItem('anime-haven-state-v2')||'null');
      if(state?.view==='arsenal')setTimeout(()=>settingsNav?.click(),0);
    }catch(error){console.warn('Arsenal could not restore its last view',error)}
    return true;
  }

  requestAnimationFrame(animationLoop);
  if(install())return;
  window.addEventListener('kagenexus-ready',install,{once:true});
  window.addEventListener('anime-haven-ready',install,{once:true});
  let tries=0;
  const timer=setInterval(()=>{tries++;if(install()||tries>200)clearInterval(timer)},100);
})();
