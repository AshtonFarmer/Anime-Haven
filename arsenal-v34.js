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
    },
    {
      id:'inosuke-nichirin',type:'weapon',kind:'katana',name:'Beast Nichirin Swords',owner:'Inosuke Hashibira',
      anime:'Demon Slayer',accent:'#405061',accent2:'#a6efff',
      sketchfabId:'552492b630c94cc38d9a0e80911a6950',
      sourceUrl:'https://sketchfab.com/3d-models/inosuke-nichirin-swords-552492b630c94cc38d9a0e80911a6950',
      description:'Inosuke deliberately chips the twin indigo-gray blades into jagged edges suited to his ferocious Beast Breathing style.'
    },
    {
      id:'giyu-nichirin',type:'weapon',kind:'katana',name:'Water Nichirin Sword',owner:'Giyu Tomioka',
      anime:'Demon Slayer',accent:'#203f76',accent2:'#78caff',
      sketchfabId:'1946c39681744d4bbf3ca1bccba5d8d5',
      sourceUrl:'https://sketchfab.com/3d-models/giyu-tomiokas-nichirin-katana-1946c39681744d4bbf3ca1bccba5d8d5',
      description:'Giyu’s deep-blue Nichirin katana carries a hexagonal guard and channels the exacting forms of Water Breathing.'
    },
    {
      id:'shinobu-nichirin',type:'weapon',kind:'katana',name:'Insect Nichirin Blade',owner:'Shinobu Kocho',
      anime:'Demon Slayer',accent:'#6a3d92',accent2:'#dfb6ff',
      sketchfabId:'2c1e043a55ec48e3a5b363a9858b84f7',
      sourceUrl:'https://sketchfab.com/3d-models/shinobu-kochou-nichirin-blade-demon-slayer-2c1e043a55ec48e3a5b363a9858b84f7',
      description:'Shinobu’s needle-tipped Nichirin blade is designed to inject lethal wisteria poison rather than decapitate demons.'
    },
    {
      id:'shusui',type:'weapon',kind:'katana',name:'Shusui',owner:'Ryuma / Roronoa Zoro',
      anime:'One Piece',accent:'#2d1d35',accent2:'#d870ff',
      sketchfabId:'0d71c7388f17439e846983521f40ba68',
      sourceUrl:'https://sketchfab.com/3d-models/shusui-katana-0d71c7388f17439e846983521f40ba68',
      description:'Wano’s national treasure is a permanently blackened Great Grade blade once carried by the legendary samurai Ryuma.'
    },
    {
      id:'sandai-kitetsu',type:'weapon',kind:'katana',name:'Sandai Kitetsu',owner:'Roronoa Zoro',
      anime:'One Piece',accent:'#5d1628',accent2:'#ff657d',
      sketchfabId:'12d5d79befbd485391b782c55b06d554',
      sourceUrl:'https://sketchfab.com/3d-models/sandai-kitetsu-12d5d79befbd485391b782c55b06d554',
      description:'A famously cursed Kitetsu blade whose blood-red fittings and dangerous temperament are matched by Zoro’s resolve.'
    },
    {
      id:'murakumogiri',type:'weapon',kind:'spear',name:'Murakumogiri',owner:'Edward Newgate',
      anime:'One Piece',accent:'#6e341c',accent2:'#ffd36d',
      sketchfabId:'6cdaf6635bad4da78cb5ac74d4b1680b',
      sourceUrl:'https://sketchfab.com/3d-models/murakumogiri-whitebeards-weapon-6cdaf6635bad4da78cb5ac74d4b1680b',
      description:'Whitebeard’s enormous bisento is one of the Supreme Grade blades and withstands his quake-infused attacks.'
    },
    {
      id:'sode-no-shirayuki',type:'weapon',kind:'katana',name:'Sode no Shirayuki',owner:'Rukia Kuchiki',
      anime:'Bleach',accent:'#d7edf3',accent2:'#ffffff',
      sketchfabId:'20ba6aab069c480b830d3c3ad5fbbe41',
      sourceUrl:'https://sketchfab.com/3d-models/sode-no-shirayuki-20ba6aab069c480b830d3c3ad5fbbe41',
      description:'Called Soul Society’s most beautiful Zanpakutō, its white blade and ribbon conduct Rukia’s freezing dances.'
    },
    {
      id:'zabimaru',type:'weapon',kind:'katana',name:'Zabimaru',owner:'Renji Abarai',
      anime:'Bleach',accent:'#7d2630',accent2:'#ff9a70',
      sketchfabId:'886ce84b131b4faba098e4f5028d893d',
      sourceUrl:'https://sketchfab.com/3d-models/zabimaru-zanpakuto-bleach-886ce84b131b4faba098e4f5028d893d',
      description:'Renji’s segmented Shikai extends like a bladed whip, combining a cleaver’s force with surprising reach.'
    },
    {
      id:'sasuke-kusanagi',type:'weapon',kind:'katana',name:'Sword of Kusanagi',owner:'Sasuke Uchiha',
      anime:'Naruto: Shippuden',accent:'#28304f',accent2:'#9b86ff',
      sketchfabId:'80cd4a9ac8a444cc971b7b503f69168e',
      sourceUrl:'https://sketchfab.com/3d-models/sword-of-kusanagi-sasuke-uchiha-80cd4a9ac8a444cc971b7b503f69168e',
      description:'Sasuke’s chokutō channels lightning-nature chakra through its blade to sharpen every thrust and slash.'
    },
    {
      id:'madara-gunbai',type:'weapon',kind:'staff',name:'Gunbai',owner:'Madara Uchiha',
      anime:'Naruto: Shippuden',accent:'#6a241e',accent2:'#ff8a69',
      sketchfabId:'99739dc3d41844419cd3d6bb9acd36f2',
      sourceUrl:'https://sketchfab.com/3d-models/madaras-gunbai-99739dc3d41844419cd3d6bb9acd36f2',
      description:'Madara’s war fan is forged from a sacred tree branch and can deflect attacks through Uchiha Reflection.'
    },
    {
      id:'flying-raijin-kunai',type:'weapon',kind:'dagger',name:'Flying Raijin Kunai',owner:'Minato Namikaze',
      anime:'Naruto: Shippuden',accent:'#314563',accent2:'#f7dd62',
      sketchfabId:'2b39fd2504484d4982c777d631acb507',
      sourceUrl:'https://sketchfab.com/3d-models/flying-thunder-god-kunai-fan-art-2b39fd2504484d4982c777d631acb507',
      description:'Minato’s three-pronged kunai carry his technique formula, creating marked destinations for instant teleportation.'
    },
    {
      id:'kiba-lightning-blades',type:'weapon',kind:'longsword',name:'Kiba',owner:'Ameyuri Ringo / Rashi',
      anime:'Naruto: Shippuden',accent:'#294c67',accent2:'#69e8ff',
      sketchfabId:'ae7b15311c7047f08cc95d50a884023e',
      sourceUrl:'https://sketchfab.com/3d-models/kiba-ae7b15311c7047f08cc95d50a884023e',
      description:'Twin Lightning Blades from the Seven Ninja Swordsmen naturally conduct electricity and call down lightning.'
    },
    {
      id:'ea-sword-of-rupture',type:'weapon',kind:'longsword',name:'Ea — Sword of Rupture',owner:'Gilgamesh',
      anime:'Fate',accent:'#7d111f',accent2:'#f1bd52',
      sketchfabId:'551a02ec36b949cb93c2b6579f4d9016',
      sourceUrl:'https://sketchfab.com/3d-models/sword-of-rupture-enuma-elish-ea-551a02ec36b949cb93c2b6579f4d9016',
      description:'Gilgamesh’s unique cylindrical blade rotates in three sections to unleash the world-rending force of Enuma Elish.'
    },
    {
      id:'kanshou-bakuya',type:'weapon',kind:'dagger',name:'Kanshou and Bakuya',owner:'Archer',
      anime:'Fate/stay night',accent:'#222735',accent2:'#f4f5ff',
      sketchfabId:'bdc80d32b669426ea78dae737c5ce85a',
      sourceUrl:'https://sketchfab.com/3d-models/emiyas-daggers-fatestay-night-bdc80d32b669426ea78dae737c5ce85a',
      description:'Archer’s paired black-and-white falchions attract one another and are repeatedly projected for close combat.'
    },
    {
      id:'caliburn',type:'weapon',kind:'longsword',name:'Caliburn',owner:'Artoria Pendragon',
      anime:'Fate',accent:'#3556a1',accent2:'#ffe681',
      sketchfabId:'390e72d3ac8d4b29ad5247665a800dba',
      sourceUrl:'https://sketchfab.com/3d-models/caliburn-fate-390e72d3ac8d4b29ad5247665a800dba',
      description:'The radiant sword of selection chose Artoria as Britain’s king before Excalibur became her defining holy blade.'
    },
    {
      id:'lambent-light',type:'weapon',kind:'longsword',name:'Lambent Light',owner:'Asuna Yuuki',
      anime:'Sword Art Online',accent:'#4d739f',accent2:'#e8f6ff',
      sketchfabId:'9caf23836fe441fe97f3e17242ad9447',
      sourceUrl:'https://sketchfab.com/3d-models/lambent-light-sword-art-online-9caf23836fe441fe97f3e17242ad9447',
      description:'Asuna’s elegant silver rapier is optimized for the lightning-fast linear thrusts that earned her the name The Flash.'
    },
    {
      id:'night-sky-sword',type:'weapon',kind:'longsword',name:'Night Sky Sword',owner:'Kirito',
      anime:'Sword Art Online: Alicization',accent:'#171b2f',accent2:'#7d8cff',
      sketchfabId:'f02e4dc7c03e4184b76731f1dd342709',
      sourceUrl:'https://sketchfab.com/3d-models/night-sky-blade-sword-art-online-f02e4dc7c03e4184b76731f1dd342709',
      description:'Forged from the Gigas Cedar, Kirito’s pitch-black Divine Object absorbs resources and releases them as a sky of stars.'
    },
    {
      id:'fragrant-olive-sword',type:'weapon',kind:'longsword',name:'Fragrant Olive Sword',owner:'Alice Zuberg',
      anime:'Sword Art Online: Alicization',accent:'#a46d16',accent2:'#ffef7d',
      sketchfabId:'49ab175a8aa14218ab9d72a0587efab4',
      sourceUrl:'https://sketchfab.com/3d-models/fragrant-olive-sao-alicization-alices-sword-49ab175a8aa14218ab9d72a0587efab4',
      description:'Alice’s golden Divine Object can divide into thousands of flower-like blades through its Enhance Armament release.'
    },
    {
      id:'scissor-blade',type:'weapon',kind:'longsword',name:'Red Scissor Blade',owner:'Ryuko Matoi',
      anime:'Kill la Kill',accent:'#86172c',accent2:'#ff596f',
      sketchfabId:'898247cbb00f4b70917c006bcf3cb595',
      sourceUrl:'https://sketchfab.com/3d-models/kill-la-kill-scissor-blade-898247cbb00f4b70917c006bcf3cb595',
      description:'One half of the Rending Scissors, Ryuko’s oversized red blade can sever the Life Fibers woven into Goku Uniforms.'
    },
    {
      id:'anti-titan-sword',type:'weapon',kind:'longsword',name:'Anti-Titan Sword',owner:'Survey Corps',
      anime:'Attack on Titan',accent:'#4a5662',accent2:'#c8e1ee',
      sketchfabId:'5c2003d406ef4f6dba9257c3b606f7c8',
      sourceUrl:'https://sketchfab.com/3d-models/aot-ultrahard-steel-anti-titan-sword-5c2003d406ef4f6dba9257c3b606f7c8',
      description:'Replaceable ultrahard-steel blades pair with ODM gear to cut deeply through a Titan’s vulnerable nape.'
    },
    {
      id:'lance-of-longinus',type:'weapon',kind:'spear',name:'Lance of Longinus',owner:'Evangelion Unit-00',
      anime:'Neon Genesis Evangelion',accent:'#7f1024',accent2:'#ff4868',
      sketchfabId:'c99cc77024a141beb6555778fd577d0a',
      sourceUrl:'https://sketchfab.com/3d-models/lance-of-longinus-c99cc77024a141beb6555778fd577d0a',
      description:'The crimson double-helix spear is an extraterrestrial artifact capable of piercing an Angel’s A.T. Field.'
    },
    {
      id:'hellsing-casull',type:'weapon',kind:'dagger',name:'Hellsing ARMS .454 Casull',owner:'Alucard',
      anime:'Hellsing Ultimate',accent:'#4a181e',accent2:'#d9b98a',
      sketchfabId:'4973c75213324ebcafa8be8c1fe4cbec',
      sourceUrl:'https://sketchfab.com/3d-models/hellsing-arms-casull-4973c75213324ebcafa8be8c1fe4cbec',
      description:'Alucard’s long-slide silver handgun fires blessed explosive rounds designed to destroy supernatural targets.'
    },
    {
      id:'hellsing-jackal',type:'weapon',kind:'dagger',name:'The Jackal',owner:'Alucard',
      anime:'Hellsing Ultimate',accent:'#151b26',accent2:'#d1dae8',
      sketchfabId:'c73c228e70e5419cb2f85148ec143369',
      sourceUrl:'https://sketchfab.com/3d-models/13mm-jackal-hellsing-c73c228e70e5419cb2f85148ec143369',
      description:'The massive matte-black 13 mm pistol complements the Casull with armor-piercing explosive ammunition.'
    },
    {
      id:'courechouse',type:'weapon',kind:'staff',name:'Courechouse',owner:'Ban',
      anime:'The Seven Deadly Sins',accent:'#4b4959',accent2:'#bde9ff',
      sketchfabId:'fd47882ebfaf4a329840b8f607f81007',
      sourceUrl:'https://sketchfab.com/3d-models/courechouse-bans-weapon-fd47882ebfaf4a329840b8f607f81007',
      description:'Ban’s Sacred Treasure is a four-section staff joined by chains that amplifies his reach, speed and precision.'
    },
    {
      id:'crescent-rose',type:'weapon',kind:'spear',name:'Crescent Rose',owner:'Ruby Rose',
      anime:'RWBY',accent:'#79172c',accent2:'#ff4968',
      sketchfabId:'2e0626c3c8234acf8694ffc948296d6b',
      sourceUrl:'https://sketchfab.com/3d-models/crescent-rose-2e0626c3c8234acf8694ffc948296d6b',
      description:'Ruby’s signature High-Caliber Sniper-Scythe transforms between compact, rifle and full scythe configurations.'
    },
    {
      id:'pumpkin-teigu',type:'weapon',kind:'staff',name:'Pumpkin',owner:'Mine',
      anime:'Akame ga Kill!',accent:'#a34a17',accent2:'#ffcf63',
      sketchfabId:'d7e70e9bb4a04c23a1a24d5ba25cb3ea',
      sourceUrl:'https://sketchfab.com/3d-models/akame-ga-kill-pumpkin-d7e70e9bb4a04c23a1a24d5ba25cb3ea',
      description:'Mine’s Roman Artillery Teigu converts emotional danger into greater firepower and can shift into a long-barrel form.'
    },
    {
      id:'wolfwood-punisher',type:'weapon',kind:'staff',name:'Punisher',owner:'Nicholas D. Wolfwood',
      anime:'Trigun',accent:'#3d3330',accent2:'#d8c8b6',
      sketchfabId:'632998c244554b4c85fc56064698729f',
      sourceUrl:'https://sketchfab.com/3d-models/wolfwoods-punisher-632998c244554b4c85fc56064698729f',
      description:'Wolfwood carries an enormous cross-shaped arsenal concealing a machine gun, rocket launcher and sidearms.'
    },
    {
      id:'vash-revolver',type:'weapon',kind:'dagger',name:'.45 Long Colt',owner:'Vash the Stampede',
      anime:'Trigun',accent:'#4e6473',accent2:'#e6f3ff',
      sketchfabId:'b71eaeaf78c049fb93023c941613d349',
      sourceUrl:'https://sketchfab.com/3d-models/45-long-colt-vashs-revolver-from-trigun-b71eaeaf78c049fb93023c941613d349',
      description:'Vash’s custom top-break revolver is recognizable by its low barrel, oversized frame and silver finish.'
    },
    {
      id:'progressive-knife',type:'weapon',kind:'dagger',name:'PKN-01C Progressive Knife',owner:'Evangelion Unit-01',
      anime:'Rebuild of Evangelion',accent:'#4b2b78',accent2:'#8aff5b',
      sketchfabId:'896276075d9b4f40858ee90b63321adc',
      sourceUrl:'https://sketchfab.com/3d-models/pkn-01c-progressive-knife-896276075d9b4f40858ee90b63321adc',
      description:'EVA-01’s vibrating close-combat blade uses high-frequency oscillation to cut through heavily protected targets.'
    },
    {
      id:'core-drill',type:'weapon',kind:'dagger',name:'Core Drill',owner:'Simon',
      anime:'Gurren Lagann',accent:'#c18419',accent2:'#fff07a',
      sketchfabId:'112ad6d1a48842c0bb6a395576842d89',
      sourceUrl:'https://sketchfab.com/3d-models/core-drill-gurren-lagann-112ad6d1a48842c0bb6a395576842d89',
      description:'Simon’s small golden drill acts as Lagann’s ignition key and a focused conduit for his ever-growing Spiral Power.'
    },
    {
      id:'muichiro-nichirin',type:'weapon',kind:'katana',name:'Mist Nichirin Sword',owner:'Muichiro Tokito',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'1d4be69a4c56442c91c02db9445a7cc2',
      sourceUrl:'https://sketchfab.com/3d-models/muichiro-tokitos-nichirin-1d4be69a4c56442c91c02db9445a7cc2',
      description:'A faithful interactive replica of Mist Nichirin Sword, the katana used by Muichiro Tokito in Demon Slayer.'
    },
    {
      id:'mitsuri-katana',type:'weapon',kind:'whip sword',name:'Love Nichirin Sword',owner:'Mitsuri Kanroji',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'46f3154c78b64eaf83f66c89c61dae13',
      sourceUrl:'https://sketchfab.com/3d-models/mitsuri-kanroji-katana-46f3154c78b64eaf83f66c89c61dae13',
      description:'A faithful interactive replica of Love Nichirin Sword, the whip sword used by Mitsuri Kanroji in Demon Slayer.'
    },
    {
      id:'sanemi-katana',type:'weapon',kind:'katana',name:'Wind Nichirin Sword',owner:'Sanemi Shinazugawa',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'2fbb72c30b1d45b6aa3f8f5b562cfa0e',
      sourceUrl:'https://sketchfab.com/3d-models/sanemi-shinazugawa-katana-2fbb72c30b1d45b6aa3f8f5b562cfa0e',
      description:'A faithful interactive replica of Wind Nichirin Sword, the katana used by Sanemi Shinazugawa in Demon Slayer.'
    },
    {
      id:'obanai-katana',type:'weapon',kind:'wavy katana',name:'Serpent Nichirin Sword',owner:'Obanai Iguro',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'def96fff1d864c129ba5eeed36d77df3',
      sourceUrl:'https://sketchfab.com/3d-models/obanai-iguro-nichirin-katana-def96fff1d864c129ba5eeed36d77df3',
      description:'A faithful interactive replica of Serpent Nichirin Sword, the wavy katana used by Obanai Iguro in Demon Slayer.'
    },
    {
      id:'kanao-katana',type:'weapon',kind:'katana',name:'Flower Nichirin Sword',owner:'Kanao Tsuyuri',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'d1d77e301d454f669785ffbcb2c3428f',
      sourceUrl:'https://sketchfab.com/3d-models/kanao-tsuyuri-nichirin-katana-d1d77e301d454f669785ffbcb2c3428f',
      description:'A faithful interactive replica of Flower Nichirin Sword, the katana used by Kanao Tsuyuri in Demon Slayer.'
    },
    {
      id:'yoriichi-katana',type:'weapon',kind:'katana',name:'Yoriichi’s Nichirin Sword',owner:'Yoriichi Tsugikuni',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'dbe5481430954719be09111e9ece7756',
      sourceUrl:'https://sketchfab.com/3d-models/yoriichi-tsugikuni-nichirin-katana-dbe5481430954719be09111e9ece7756',
      description:'A faithful interactive replica of Yoriichi’s Nichirin Sword, the katana used by Yoriichi Tsugikuni in Demon Slayer.'
    },
    {
      id:'kokushibo-sword',type:'weapon',kind:'demonic katana',name:'Kokushibo’s Flesh Sword',owner:'Kokushibo',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'67dcb4b0872c46ff9e03b213781ede10',
      sourceUrl:'https://sketchfab.com/3d-models/kokushibo-sword-67dcb4b0872c46ff9e03b213781ede10',
      description:'A faithful interactive replica of Kokushibo’s Flesh Sword, the demonic katana used by Kokushibo in Demon Slayer.'
    },
    {
      id:'genya-shotgun',type:'weapon',kind:'shotgun',name:'Double-Barreled Shotgun',owner:'Genya Shinazugawa',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'e73b2e70b9b84430a93854c2419d412c',
      sourceUrl:'https://sketchfab.com/3d-models/genya-double-barreled-shotgun-e73b2e70b9b84430a93854c2419d412c',
      description:'A faithful interactive replica of Double-Barreled Shotgun, the shotgun used by Genya Shinazugawa in Demon Slayer.'
    },
    {
      id:'genya-wakizashi',type:'weapon',kind:'wakizashi',name:'Genya’s Nichirin Wakizashi',owner:'Genya Shinazugawa',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'d48fc2ef8c854369ac836dea1df90258',
      sourceUrl:'https://sketchfab.com/3d-models/genya-nichirin-wakizashi-d48fc2ef8c854369ac836dea1df90258',
      description:'A faithful interactive replica of Genya’s Nichirin Wakizashi, the wakizashi used by Genya Shinazugawa in Demon Slayer.'
    },
    {
      id:'gyutaro-sickles',type:'weapon',kind:'paired sickles',name:'Blood Demon Sickles',owner:'Gyutaro',
      anime:'Demon Slayer',accent:'#4a2638',accent2:'#ff98c8',
      sketchfabId:'f218953bcb9f4bc4afda2cc65601fb78',
      sourceUrl:'https://sketchfab.com/3d-models/gyutaro-blood-sickles-f218953bcb9f4bc4afda2cc65601fb78',
      description:'A faithful interactive replica of Blood Demon Sickles, the paired sickles used by Gyutaro in Demon Slayer.'
    },
    {
      id:'kikoku',type:'weapon',kind:'nodachi',name:'Kikoku',owner:'Trafalgar Law',
      anime:'One Piece',accent:'#29456d',accent2:'#ffd45d',
      sketchfabId:'24fabb796280452c91c558470e1c2862',
      sourceUrl:'https://sketchfab.com/3d-models/one-piece-kikoku-trafalgar-laws-sword-24fabb796280452c91c558470e1c2862',
      description:'A faithful interactive replica of Kikoku, the nodachi used by Trafalgar Law in One Piece.'
    },
    {
      id:'gryphon',type:'weapon',kind:'saber',name:'Gryphon',owner:'Shanks',
      anime:'One Piece',accent:'#29456d',accent2:'#ffd45d',
      sketchfabId:'7323f684cee74967b7b5133749dcfc95',
      sourceUrl:'https://sketchfab.com/3d-models/one-piece-gryphon-shanks-sword-7323f684cee74967b7b5133749dcfc95',
      description:'A faithful interactive replica of Gryphon, the saber used by Shanks in One Piece.'
    },
    {
      id:'napoleon',type:'weapon',kind:'sentient saber',name:'Napoleon',owner:'Charlotte Linlin',
      anime:'One Piece',accent:'#29456d',accent2:'#ffd45d',
      sketchfabId:'a87f178b13be454fac2a9581c5beee36',
      sourceUrl:'https://sketchfab.com/3d-models/one-piece-napoleon-big-mom-sword-a87f178b13be454fac2a9581c5beee36',
      description:'A faithful interactive replica of Napoleon, the sentient saber used by Charlotte Linlin in One Piece.'
    },
    {
      id:'kuro-kabuto',type:'weapon',kind:'slingshot',name:'Kuro Kabuto',owner:'Usopp',
      anime:'One Piece',accent:'#29456d',accent2:'#ffd45d',
      sketchfabId:'bb3d77707d8641fb9ea93d0d3bfe1b71',
      sourceUrl:'https://sketchfab.com/3d-models/one-piece-kuro-kabuto-usopp-bb3d77707d8641fb9ea93d0d3bfe1b71',
      description:'A faithful interactive replica of Kuro Kabuto, the slingshot used by Usopp in One Piece.'
    },
    {
      id:'clima-tact',type:'weapon',kind:'weather staff',name:'Clima-Tact',owner:'Nami',
      anime:'One Piece',accent:'#29456d',accent2:'#ffd45d',
      sketchfabId:'516e3020ec6b40e182916dbe33aa6068',
      sourceUrl:'https://sketchfab.com/3d-models/one-piece-nami-clima-tact-v1-v2-516e3020ec6b40e182916dbe33aa6068',
      description:'A faithful interactive replica of Clima-Tact, the weather staff used by Nami in One Piece.'
    },
    {
      id:'soul-solid',type:'weapon',kind:'shikomizue',name:'Soul Solid',owner:'Brook',
      anime:'One Piece',accent:'#29456d',accent2:'#ffd45d',
      sketchfabId:'c7c7a63e865f447ca6e920387338e6e5',
      sourceUrl:'https://sketchfab.com/3d-models/one-piece-brook-soul-solid-c7c7a63e865f447ca6e920387338e6e5',
      description:'A faithful interactive replica of Soul Solid, the shikomizue used by Brook in One Piece.'
    },
    {
      id:'shigure',type:'weapon',kind:'katana',name:'Shigure',owner:'Tashigi',
      anime:'One Piece',accent:'#29456d',accent2:'#ffd45d',
      sketchfabId:'a6031da932dd48ab80e1eacf033ecc3c',
      sourceUrl:'https://sketchfab.com/3d-models/one-piece-tashigi-shigure-a6031da932dd48ab80e1eacf033ecc3c',
      description:'A faithful interactive replica of Shigure, the katana used by Tashigi in One Piece.'
    },
    {
      id:'kiribachi',type:'weapon',kind:'sawblade sword',name:'Kiribachi',owner:'Arlong',
      anime:'One Piece',accent:'#29456d',accent2:'#ffd45d',
      sketchfabId:'28bbd0089ae34468abe4cf5f97809dcd',
      sourceUrl:'https://sketchfab.com/3d-models/one-piece-arlong-kiribachi-28bbd0089ae34468abe4cf5f97809dcd',
      description:'A faithful interactive replica of Kiribachi, the sawblade sword used by Arlong in One Piece.'
    },
    {
      id:'enel-staff',type:'weapon',kind:'bo staff and trident',name:'Nonosama Bo',owner:'Enel',
      anime:'One Piece',accent:'#29456d',accent2:'#ffd45d',
      sketchfabId:'874d905a337f4e23a8aede500fda4b09',
      sourceUrl:'https://sketchfab.com/3d-models/one-piece-enel-bo-staff-trident-874d905a337f4e23a8aede500fda4b09',
      description:'A faithful interactive replica of Nonosama Bo, the bo staff and trident used by Enel in One Piece.'
    },
    {
      id:'myrtenaster',type:'weapon',kind:'revolver rapier',name:'Myrtenaster',owner:'Weiss Schnee',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'6d62431468c74bb99545849b431e8b5b',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-myrtenaster-6d62431468c74bb99545849b431e8b5b',
      description:'A faithful interactive replica of Myrtenaster, the revolver rapier used by Weiss Schnee in RWBY.'
    },
    {
      id:'gambol-shroud',type:'weapon',kind:'variant ballistic chain scythe',name:'Gambol Shroud',owner:'Blake Belladonna',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'673257c7fb944025a4d2d5428dece5d1',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-gambol-shroud-673257c7fb944025a4d2d5428dece5d1',
      description:'A faithful interactive replica of Gambol Shroud, the variant ballistic chain scythe used by Blake Belladonna in RWBY.'
    },
    {
      id:'ember-celica',type:'weapon',kind:'shotgun gauntlets',name:'Ember Celica',owner:'Yang Xiao Long',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'687a6a62d1924de29e2cf649ffa8efef',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-ember-celica-687a6a62d1924de29e2cf649ffa8efef',
      description:'A faithful interactive replica of Ember Celica, the shotgun gauntlets used by Yang Xiao Long in RWBY.'
    },
    {
      id:'magnhild',type:'weapon',kind:'grenade launcher hammer',name:'Magnhild',owner:'Nora Valkyrie',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'62fcca87d0564795806efe6f9c359c29',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-magnhild-62fcca87d0564795806efe6f9c359c29',
      description:'A faithful interactive replica of Magnhild, the grenade launcher hammer used by Nora Valkyrie in RWBY.'
    },
    {
      id:'crocea-mors',type:'weapon',kind:'sword and shield',name:'Crocea Mors',owner:'Jaune Arc',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'7e73b3a80cb540ccb0aa4ea98c94895f',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-crocea-mors-7e73b3a80cb540ccb0aa4ea98c94895f',
      description:'A faithful interactive replica of Crocea Mors, the sword and shield used by Jaune Arc in RWBY.'
    },
    {
      id:'storm-flower',type:'weapon',kind:'machine pistols',name:'StormFlower',owner:'Lie Ren',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'d5f8663d032643bdabcbf15e4c318300',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-storm-flower-d5f8663d032643bdabcbf15e4c318300',
      description:'A faithful interactive replica of StormFlower, the machine pistols used by Lie Ren in RWBY.'
    },
    {
      id:'milo-akouo',type:'weapon',kind:'rifle javelin and shield',name:'Miló and Akoúo',owner:'Pyrrha Nikos',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'011e340892824ca7a8450d21b57a3001',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-milo-and-akouo-011e340892824ca7a8450d21b57a3001',
      description:'A faithful interactive replica of Miló and Akoúo, the rifle javelin and shield used by Pyrrha Nikos in RWBY.'
    },
    {
      id:'harbinger',type:'weapon',kind:'sword and scythe',name:'Harbinger',owner:'Qrow Branwen',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'d0ac2e311b4843a8a3a03c615dc2f490',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-harbinger-sword-d0ac2e311b4843a8a3a03c615dc2f490',
      description:'A faithful interactive replica of Harbinger, the sword and scythe used by Qrow Branwen in RWBY.'
    },
    {
      id:'omen',type:'weapon',kind:'dust katana',name:'Omen',owner:'Raven Branwen',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'707011994ae5428a9ad1afe003e51757',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-omen-raven-sword-707011994ae5428a9ad1afe003e51757',
      description:'A faithful interactive replica of Omen, the dust katana used by Raven Branwen in RWBY.'
    },
    {
      id:'long-memory',type:'weapon',kind:'cane',name:'The Long Memory',owner:'Ozpin / Oscar Pine',
      anime:'RWBY',accent:'#62233a',accent2:'#ff6b8a',
      sketchfabId:'d654f7642e464102bf4305320a88e03e',
      sourceUrl:'https://sketchfab.com/3d-models/rwby-the-long-memory-d654f7642e464102bf4305320a88e03e',
      description:'A faithful interactive replica of The Long Memory, the cane used by Ozpin / Oscar Pine in RWBY.'
    },
    {
      id:'hiramekarei',type:'weapon',kind:'dual-handled sword',name:'Hiramekarei',owner:'Chōjūrō',
      anime:'Naruto Shippuden',accent:'#223b58',accent2:'#70c9ff',
      sketchfabId:'cb784173e62b4ab7bb068092d9026002',
      sourceUrl:'https://sketchfab.com/3d-models/naruto-hiramekarei-cb784173e62b4ab7bb068092d9026002',
      description:'A faithful interactive replica of Hiramekarei, the dual-handled sword used by Chōjūrō in Naruto Shippuden.'
    },
    {
      id:'nuibari',type:'weapon',kind:'needle sword',name:'Nuibari',owner:'Kushimaru Kuriarare',
      anime:'Naruto Shippuden',accent:'#223b58',accent2:'#70c9ff',
      sketchfabId:'cdca29c608bc469698c6a2e213f2ab4d',
      sourceUrl:'https://sketchfab.com/3d-models/naruto-nuibari-cdca29c608bc469698c6a2e213f2ab4d',
      description:'A faithful interactive replica of Nuibari, the needle sword used by Kushimaru Kuriarare in Naruto Shippuden.'
    },
    {
      id:'kabutowari',type:'weapon',kind:'axe and hammer',name:'Kabutowari',owner:'Jinin Akebino',
      anime:'Naruto Shippuden',accent:'#223b58',accent2:'#70c9ff',
      sketchfabId:'711a0f1c3dac424fb2b02e0f0cc4e7f5',
      sourceUrl:'https://sketchfab.com/3d-models/naruto-kabutowari-711a0f1c3dac424fb2b02e0f0cc4e7f5',
      description:'A faithful interactive replica of Kabutowari, the axe and hammer used by Jinin Akebino in Naruto Shippuden.'
    },
    {
      id:'shibuki',type:'weapon',kind:'explosive sword',name:'Shibuki',owner:'Jinpachi Munashi',
      anime:'Naruto Shippuden',accent:'#223b58',accent2:'#70c9ff',
      sketchfabId:'023042765274456cb056c7ec71765be2',
      sourceUrl:'https://sketchfab.com/3d-models/naruto-shibuki-023042765274456cb056c7ec71765be2',
      description:'A faithful interactive replica of Shibuki, the explosive sword used by Jinpachi Munashi in Naruto Shippuden.'
    },
    {
      id:'asuma-chakra-blades',type:'weapon',kind:'trench knives',name:'Chakra Blades',owner:'Asuma Sarutobi',
      anime:'Naruto Shippuden',accent:'#223b58',accent2:'#70c9ff',
      sketchfabId:'8c9c1fb242624ba198920cdf465c0de6',
      sourceUrl:'https://sketchfab.com/3d-models/naruto-asuma-chakra-blades-8c9c1fb242624ba198920cdf465c0de6',
      description:'A faithful interactive replica of Chakra Blades, the trench knives used by Asuma Sarutobi in Naruto Shippuden.'
    },
    {
      id:'hidan-scythe',type:'weapon',kind:'scythe',name:'Triple-Bladed Scythe',owner:'Hidan',
      anime:'Naruto Shippuden',accent:'#223b58',accent2:'#70c9ff',
      sketchfabId:'27e5bed0dc134ffeb10673f6b13c6cac',
      sourceUrl:'https://sketchfab.com/3d-models/naruto-hidan-triple-bladed-scythe-27e5bed0dc134ffeb10673f6b13c6cac',
      description:'A faithful interactive replica of Triple-Bladed Scythe, the scythe used by Hidan in Naruto Shippuden.'
    },
    {
      id:'hiruko-puppet',type:'weapon',kind:'combat puppet',name:'Hiruko',owner:'Sasori',
      anime:'Naruto Shippuden',accent:'#223b58',accent2:'#70c9ff',
      sketchfabId:'5c5ce1d07cbe4de8822702ad3d5810dd',
      sourceUrl:'https://sketchfab.com/3d-models/naruto-sasori-hiruko-puppet-5c5ce1d07cbe4de8822702ad3d5810dd',
      description:'A faithful interactive replica of Hiruko, the combat puppet used by Sasori in Naruto Shippuden.'
    },
    {
      id:'anneal-blade',type:'weapon',kind:'longsword',name:'Anneal Blade',owner:'Kirito',
      anime:'Sword Art Online',accent:'#15263d',accent2:'#57d9ff',
      sketchfabId:'1f62bdc79b2347eabd7c35b05c0c148d',
      sourceUrl:'https://sketchfab.com/3d-models/sword-art-online-anneal-blade-1f62bdc79b2347eabd7c35b05c0c148d',
      description:'A faithful interactive replica of Anneal Blade, the longsword used by Kirito in Sword Art Online.'
    },
    {
      id:'wind-fleuret',type:'weapon',kind:'rapier',name:'Wind Fleuret',owner:'Asuna',
      anime:'Sword Art Online',accent:'#15263d',accent2:'#57d9ff',
      sketchfabId:'cc654bc3f9fe4824bc0895dbfce49fcc',
      sourceUrl:'https://sketchfab.com/3d-models/sword-art-online-wind-fleuret-cc654bc3f9fe4824bc0895dbfce49fcc',
      description:'A faithful interactive replica of Wind Fleuret, the rapier used by Asuna in Sword Art Online.'
    },
    {
      id:'kagemitsu-g4',type:'weapon',kind:'photon sword',name:'Kagemitsu G4',owner:'Kirito',
      anime:'Sword Art Online',accent:'#15263d',accent2:'#57d9ff',
      sketchfabId:'59651b44ecdf474aba93527d29d301f1',
      sourceUrl:'https://sketchfab.com/3d-models/kagemitsu-g4-photon-sword-from-sao-59651b44ecdf474aba93527d29d301f1',
      description:'A faithful interactive replica of Kagemitsu G4, the photon sword used by Kirito in Sword Art Online.'
    },
    {
      id:'hecate-ii',type:'weapon',kind:'sniper rifle',name:'PGM Ultima Ratio Hecate II',owner:'Sinon',
      anime:'Sword Art Online',accent:'#15263d',accent2:'#57d9ff',
      sketchfabId:'bb075495498a41f7bf86f423c951a45b',
      sourceUrl:'https://sketchfab.com/3d-models/hecate-ii-bb075495498a41f7bf86f423c951a45b',
      description:'A faithful interactive replica of PGM Ultima Ratio Hecate II, the sniper rifle used by Sinon in Sword Art Online.'
    },
    {
      id:'death-gun-loadout',type:'weapon',kind:'rifle and pistol',name:'L115A3 and Type 54',owner:'Death Gun',
      anime:'Sword Art Online',accent:'#15263d',accent2:'#57d9ff',
      sketchfabId:'7bd219d200fc456291bb12661d81b413',
      sourceUrl:'https://sketchfab.com/3d-models/sword-art-online-death-gun-7bd219d200fc456291bb12661d81b413',
      description:'A faithful interactive replica of L115A3 and Type 54, the rifle and pistol used by Death Gun in Sword Art Online.'
    },
    {
      id:'yuuki-sword',type:'weapon',kind:'longsword',name:'Yuuki’s Sword',owner:'Yuuki Konno',
      anime:'Sword Art Online',accent:'#15263d',accent2:'#57d9ff',
      sketchfabId:'9997f6fdcc3545a1a71a109ca249d238',
      sourceUrl:'https://sketchfab.com/3d-models/sword-art-online-konno-yuuki-sword-9997f6fdcc3545a1a71a109ca249d238',
      description:'A faithful interactive replica of Yuuki’s Sword, the longsword used by Yuuki Konno in Sword Art Online.'
    },
    {
      id:'annihilate-ray',type:'weapon',kind:'bow',name:'Annihilate Ray',owner:'Sinon',
      anime:'Sword Art Online: Alicization',accent:'#234f61',accent2:'#8ffff1',
      sketchfabId:'513b02b3c9c140368d2c66c50cdd21bb',
      sourceUrl:'https://sketchfab.com/3d-models/sao-alicization-sinons-bow-in-underworld-513b02b3c9c140368d2c66c50cdd21bb',
      description:'A faithful interactive replica of Annihilate Ray, the bow used by Sinon in Sword Art Online: Alicization.'
    },
    {
      id:'ordinal-scale-sword',type:'weapon',kind:'longsword',name:'Ordinal Scale Sword',owner:'Kirito',
      anime:'Sword Art Online: Ordinal Scale',accent:'#172544',accent2:'#60cfff',
      sketchfabId:'219cbf2236f646a48f673c1e6218132d',
      sourceUrl:'https://sketchfab.com/3d-models/ordinal-scale-sword-219cbf2236f646a48f673c1e6218132d',
      description:'A faithful interactive replica of Ordinal Scale Sword, the longsword used by Kirito in Sword Art Online: Ordinal Scale.'
    },
    {
      id:'black-iron-greatsword',type:'weapon',kind:'greatsword',name:'Black Iron Greatsword',owner:'Kirito',
      anime:'Sword Art Online',accent:'#15263d',accent2:'#57d9ff',
      sketchfabId:'edf04a33f12f4c2f901eacec344b04f1',
      sourceUrl:'https://sketchfab.com/3d-models/alo-black-iron-great-sword-edf04a33f12f4c2f901eacec344b04f1',
      description:'A faithful interactive replica of Black Iron Greatsword, the greatsword used by Kirito in Sword Art Online.'
    },
    {
      id:'aincrad-floor-100-sword',type:'weapon',kind:'longsword',name:'Aincrad Floor 100 Sword',owner:'Kirito',
      anime:'Sword Art Online: Ordinal Scale',accent:'#172544',accent2:'#60cfff',
      sketchfabId:'dee78194bd4b43609b43b06541ca8d92',
      sourceUrl:'https://sketchfab.com/3d-models/sword-floor-100th-aincrad-sao-ordinal-scale-dee78194bd4b43609b43b06541ca8d92',
      description:'A faithful interactive replica of Aincrad Floor 100 Sword, the longsword used by Kirito in Sword Art Online: Ordinal Scale.'
    },
    {
      id:'rule-breaker',type:'weapon',kind:'dagger',name:'Rule Breaker',owner:'Medea',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'c06aa46e12e24dc0b0a4383c238a5f44',
      sourceUrl:'https://sketchfab.com/3d-models/fate-rule-breaker-c06aa46e12e24dc0b0a4383c238a5f44',
      description:'A faithful interactive replica of Rule Breaker, the dagger used by Medea in Fate.'
    },
    {
      id:'clarent',type:'weapon',kind:'longsword',name:'Clarent',owner:'Mordred',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'40ddcafa94d44635b32cb624ee736df1',
      sourceUrl:'https://sketchfab.com/3d-models/fate-clarent-40ddcafa94d44635b32cb624ee736df1',
      description:'A faithful interactive replica of Clarent, the longsword used by Mordred in Fate.'
    },
    {
      id:'balmung',type:'weapon',kind:'greatsword',name:'Balmung',owner:'Siegfried',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'d6180daa0a9b43838e3226028486e12a',
      sourceUrl:'https://sketchfab.com/3d-models/fate-balmung-d6180daa0a9b43838e3226028486e12a',
      description:'A faithful interactive replica of Balmung, the greatsword used by Siegfried in Fate.'
    },
    {
      id:'arondight',type:'weapon',kind:'longsword',name:'Arondight',owner:'Lancelot',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'998dcafc79a949b390e2853d9604fe6a',
      sourceUrl:'https://sketchfab.com/3d-models/fate-arondight-998dcafc79a949b390e2853d9604fe6a',
      description:'A faithful interactive replica of Arondight, the longsword used by Lancelot in Fate.'
    },
    {
      id:'rhongomyniad-alter',type:'weapon',kind:'holy lance',name:'Rhongomyniad Alter',owner:'Artoria Pendragon Alter',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'a95651982a9b4c70a770c0e093e8a181',
      sourceUrl:'https://sketchfab.com/3d-models/fate-rhongomyniad-alter-a95651982a9b4c70a770c0e093e8a181',
      description:'A faithful interactive replica of Rhongomyniad Alter, the holy lance used by Artoria Pendragon Alter in Fate.'
    },
    {
      id:'caladbolg-fergus',type:'weapon',kind:'spiral sword',name:'Caladbolg',owner:'Fergus mac Róich',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'351e06177930445d9c2e39a667ddcc54',
      sourceUrl:'https://sketchfab.com/3d-models/fate-caladbolg-fergus-351e06177930445d9c2e39a667ddcc54',
      description:'A faithful interactive replica of Caladbolg, the spiral sword used by Fergus mac Róich in Fate.'
    },
    {
      id:'rhongomyniad-lr',type:'weapon',kind:'lance',name:'Rhongomyniad LR',owner:'Mysterious Heroine XX',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'cdaacfff7bd447c4bb54d8e1a66dc5b4',
      sourceUrl:'https://sketchfab.com/3d-models/fate-mysterious-heroine-xx-rhongomyniad-lr-cdaacfff7bd447c4bb54d8e1a66dc5b4',
      description:'A faithful interactive replica of Rhongomyniad LR, the lance used by Mysterious Heroine XX in Fate.'
    },
    {
      id:'nobunaga-rifle',type:'weapon',kind:'matchlock rifle',name:'Nobunaga’s Rifle',owner:'Oda Nobunaga',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'59ac58320cbd4b7d911aaaf4f9cce56c',
      sourceUrl:'https://sketchfab.com/3d-models/nobunagas-rifle-59ac58320cbd4b7d911aaaf4f9cce56c',
      description:'A faithful interactive replica of Nobunaga’s Rifle, the matchlock rifle used by Oda Nobunaga in Fate.'
    },
    {
      id:'lord-camelot',type:'weapon',kind:'great shield',name:'Lord Camelot',owner:'Mash Kyrielight',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'9977953dd1b846baab41af7c354d5b58',
      sourceUrl:'https://sketchfab.com/3d-models/lord-camelot-9977953dd1b846baab41af7c354d5b58',
      description:'A faithful interactive replica of Lord Camelot, the great shield used by Mash Kyrielight in Fate.'
    },
    {
      id:'gae-bolg-alternative',type:'weapon',kind:'twin spears',name:'Gáe Bolg Alternative',owner:'Scáthach',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'4fb05e5a925346a5be2de76e5ada1533',
      sourceUrl:'https://sketchfab.com/3d-models/gae-bolg-alternative-4fb05e5a925346a5be2de76e5ada1533',
      description:'A faithful interactive replica of Gáe Bolg Alternative, the twin spears used by Scáthach in Fate.'
    },
    {
      id:'musashi-swords',type:'weapon',kind:'katana set',name:'Musashi’s Five Swords',owner:'Miyamoto Musashi',
      anime:'Fate',accent:'#3c335f',accent2:'#c2adff',
      sketchfabId:'7425246c92f240dc97a2151f4948ffbe',
      sourceUrl:'https://sketchfab.com/3d-models/musashis-swords-7425246c92f240dc97a2151f4948ffbe',
      description:'A faithful interactive replica of Musashi’s Five Swords, the katana set used by Miyamoto Musashi in Fate.'
    },
    {
      id:'benihime',type:'weapon',kind:'katana',name:'Benihime',owner:'Kisuke Urahara',
      anime:'Bleach',accent:'#222d3d',accent2:'#78e8ff',
      sketchfabId:'ecffb4fd74194241bd7b1ee03ac0e0bd',
      sourceUrl:'https://sketchfab.com/3d-models/bleach-benihime-ecffb4fd74194241bd7b1ee03ac0e0bd',
      description:'A faithful interactive replica of Benihime, the katana used by Kisuke Urahara in Bleach.'
    },
    {
      id:'katen-kyokotsu',type:'weapon',kind:'paired daisho',name:'Katen Kyōkotsu',owner:'Shunsui Kyōraku',
      anime:'Bleach',accent:'#222d3d',accent2:'#78e8ff',
      sketchfabId:'a58123cb1c894bd49549c4b3f541d492',
      sourceUrl:'https://sketchfab.com/3d-models/bleach-katen-kyokotsu-a58123cb1c894bd49549c4b3f541d492',
      description:'A faithful interactive replica of Katen Kyōkotsu, the paired daisho used by Shunsui Kyōraku in Bleach.'
    },
    {
      id:'hihio-zabimaru',type:'weapon',kind:'segmented bankai blade',name:'Hihiō Zabimaru',owner:'Renji Abarai',
      anime:'Bleach',accent:'#222d3d',accent2:'#78e8ff',
      sketchfabId:'6aa056382a3642e9917f0937e8b2aca4',
      sourceUrl:'https://sketchfab.com/3d-models/bleach-hihio-zabimaru-animated-6aa056382a3642e9917f0937e8b2aca4',
      description:'A faithful interactive replica of Hihiō Zabimaru, the segmented bankai blade used by Renji Abarai in Bleach.'
    },
    {
      id:'true-zangetsu',type:'weapon',kind:'dual blades',name:'True Zangetsu',owner:'Ichigo Kurosaki',
      anime:'Bleach',accent:'#222d3d',accent2:'#78e8ff',
      sketchfabId:'ec43bee4305a42f5b85e6f8acd25e976',
      sourceUrl:'https://sketchfab.com/3d-models/bleach-dual-true-zangetsu-ec43bee4305a42f5b85e6f8acd25e976',
      description:'A faithful interactive replica of True Zangetsu, the dual blades used by Ichigo Kurosaki in Bleach.'
    },
    {
      id:'true-tensa-zangetsu',type:'weapon',kind:'bankai sword',name:'True Tensa Zangetsu',owner:'Ichigo Kurosaki',
      anime:'Bleach',accent:'#222d3d',accent2:'#78e8ff',
      sketchfabId:'98c6e4f137e94f03b388b9f7a1baa728',
      sourceUrl:'https://sketchfab.com/3d-models/bleach-true-tensa-zangetsu-98c6e4f137e94f03b388b9f7a1baa728',
      description:'A faithful interactive replica of True Tensa Zangetsu, the bankai sword used by Ichigo Kurosaki in Bleach.'
    },
    {
      id:'wabisuke',type:'weapon',kind:'hooked katana',name:'Wabisuke',owner:'Izuru Kira',
      anime:'Bleach',accent:'#222d3d',accent2:'#78e8ff',
      sketchfabId:'6633c88a11514ce193d223eadefd54f8',
      sourceUrl:'https://sketchfab.com/3d-models/bleach-wabisuke-6633c88a11514ce193d223eadefd54f8',
      description:'A faithful interactive replica of Wabisuke, the hooked katana used by Izuru Kira in Bleach.'
    },
    {
      id:'slaughter-demon',type:'weapon',kind:'combat knife',name:'Slaughter Demon',owner:'Yuji Itadori',
      anime:'Jujutsu Kaisen',accent:'#372448',accent2:'#c88cff',
      sketchfabId:'dd23c7d47a974ee0a10454f731d04335',
      sourceUrl:'https://sketchfab.com/3d-models/jujutsu-kaisen-slaughter-demon-dd23c7d47a974ee0a10454f731d04335',
      description:'A faithful interactive replica of Slaughter Demon, the combat knife used by Yuji Itadori in Jujutsu Kaisen.'
    },
    {
      id:'split-soul-katana',type:'weapon',kind:'katana',name:'Split Soul Katana',owner:'Maki Zenin / Toji Fushiguro',
      anime:'Jujutsu Kaisen',accent:'#372448',accent2:'#c88cff',
      sketchfabId:'6ec3e5d28c0c41dcb12e141b3f14ce4b',
      sourceUrl:'https://sketchfab.com/3d-models/jujutsu-kaisen-split-soul-katana-6ec3e5d28c0c41dcb12e141b3f14ce4b',
      description:'A faithful interactive replica of Split Soul Katana, the katana used by Maki Zenin / Toji Fushiguro in Jujutsu Kaisen.'
    },
    {
      id:'nanami-blunt-sword',type:'weapon',kind:'wrapped cleaver',name:'Nanami’s Blunt Sword',owner:'Kento Nanami',
      anime:'Jujutsu Kaisen',accent:'#372448',accent2:'#c88cff',
      sketchfabId:'d7cc893de18a4a3980bc7d24e997db00',
      sourceUrl:'https://sketchfab.com/3d-models/jujutsu-kaisen-nanami-blunt-sword-d7cc893de18a4a3980bc7d24e997db00',
      description:'A faithful interactive replica of Nanami’s Blunt Sword, the wrapped cleaver used by Kento Nanami in Jujutsu Kaisen.'
    },
    {
      id:'nobara-hammer',type:'weapon',kind:'hammer',name:'Nobara’s Hammer',owner:'Nobara Kugisaki',
      anime:'Jujutsu Kaisen',accent:'#372448',accent2:'#c88cff',
      sketchfabId:'91b6090bffa7476092b3d45ef493ba19',
      sourceUrl:'https://sketchfab.com/3d-models/hammer-91b6090bffa7476092b3d45ef493ba19',
      description:'A faithful interactive replica of Nobara’s Hammer, the hammer used by Nobara Kugisaki in Jujutsu Kaisen.'
    },
    {
      id:'shigemo-cursed-tool',type:'weapon',kind:'hand-hilt sword',name:'Shigemo’s Cursed Tool',owner:'Haruta Shigemo',
      anime:'Jujutsu Kaisen',accent:'#372448',accent2:'#c88cff',
      sketchfabId:'3881a926d4ad4cc7ac9e20d3a8d537e6',
      sourceUrl:'https://sketchfab.com/3d-models/shigemos-cursed-tool-jujutsu-kaisen-3881a926d4ad4cc7ac9e20d3a8d537e6',
      description:'A faithful interactive replica of Shigemo’s Cursed Tool, the hand-hilt sword used by Haruta Shigemo in Jujutsu Kaisen.'
    },
    {
      id:'cursed-speech-megaphone',type:'weapon',kind:'megaphone',name:'Cursed Speech Megaphone',owner:'Yuta Okkotsu',
      anime:'Jujutsu Kaisen',accent:'#372448',accent2:'#c88cff',
      sketchfabId:'864459bb96b54ca08667ec6ede22dc1c',
      sourceUrl:'https://sketchfab.com/3d-models/cursed-speech-megaphone-low-poly-864459bb96b54ca08667ec6ede22dc1c',
      description:'A faithful interactive replica of Cursed Speech Megaphone, the megaphone used by Yuta Okkotsu in Jujutsu Kaisen.'
    },
    {
      id:'kasaka-venom-fang',type:'weapon',kind:'dagger',name:'Kasaka’s Venom Fang',owner:'Sung Jin-Woo',
      anime:'Solo Leveling',accent:'#2b1f50',accent2:'#9f72ff',
      sketchfabId:'6a5b0acb6db94959ad5f6439e36c8040',
      sourceUrl:'https://sketchfab.com/3d-models/kasakas-venom-fang-dagger-solo-leveling-6a5b0acb6db94959ad5f6439e36c8040',
      description:'A faithful interactive replica of Kasaka’s Venom Fang, the dagger used by Sung Jin-Woo in Solo Leveling.'
    },
    {
      id:'knight-killer',type:'weapon',kind:'dagger',name:'Knight Killer',owner:'Sung Jin-Woo',
      anime:'Solo Leveling',accent:'#2b1f50',accent2:'#9f72ff',
      sketchfabId:'3462be9aed204f4c86d6553f12e0005d',
      sourceUrl:'https://sketchfab.com/3d-models/knight-killer-dagger-solo-leveling-3462be9aed204f4c86d6553f12e0005d',
      description:'A faithful interactive replica of Knight Killer, the dagger used by Sung Jin-Woo in Solo Leveling.'
    },
    {
      id:'baruka-dagger',type:'weapon',kind:'dagger',name:'Baruka’s Dagger',owner:'Sung Jin-Woo',
      anime:'Solo Leveling',accent:'#2b1f50',accent2:'#9f72ff',
      sketchfabId:'01b139c4fa4d4ee0ab36fc15268a899a',
      sourceUrl:'https://sketchfab.com/3d-models/barukas-dagger-solo-leveling-01b139c4fa4d4ee0ab36fc15268a899a',
      description:'A faithful interactive replica of Baruka’s Dagger, the dagger used by Sung Jin-Woo in Solo Leveling.'
    },
    {
      id:'demon-king-daggers',type:'weapon',kind:'paired daggers',name:'Demon King’s Daggers',owner:'Sung Jin-Woo',
      anime:'Solo Leveling',accent:'#2b1f50',accent2:'#9f72ff',
      sketchfabId:'7361f36cf8c74b53a5e6caef138cf780',
      sourceUrl:'https://sketchfab.com/3d-models/demon-kings-daggers-7361f36cf8c74b53a5e6caef138cf780',
      description:'A faithful interactive replica of Demon King’s Daggers, the paired daggers used by Sung Jin-Woo in Solo Leveling.'
    },
    {
      id:'kamish-wrath',type:'weapon',kind:'paired daggers',name:'Kamish’s Wrath',owner:'Sung Jin-Woo',
      anime:'Solo Leveling',accent:'#2b1f50',accent2:'#9f72ff',
      sketchfabId:'966ed284660449048c881a9300bbcb8c',
      sourceUrl:'https://sketchfab.com/3d-models/kamishs-wrath-dagger-left-966ed284660449048c881a9300bbcb8c',
      description:'A faithful interactive replica of Kamish’s Wrath, the paired daggers used by Sung Jin-Woo in Solo Leveling.'
    },
    {
      id:'anti-personnel-odm',type:'weapon',kind:'paired firearms',name:'Anti-Personnel ODM Gear',owner:'Kenny Ackerman’s squad',
      anime:'Attack on Titan',accent:'#4a3b31',accent2:'#d8b88f',
      sketchfabId:'b979d5b1c0ac49f3b82a7a475327bed8',
      sourceUrl:'https://sketchfab.com/3d-models/anti-personnel-odm-gear-attack-on-titan-b979d5b1c0ac49f3b82a7a475327bed8',
      description:'A faithful interactive replica of Anti-Personnel ODM Gear, the paired firearms used by Kenny Ackerman’s squad in Attack on Titan.'
    },
    {
      id:'signal-flare-gun',type:'weapon',kind:'flare gun',name:'Signal Flare Gun',owner:'Survey Corps',
      anime:'Attack on Titan',accent:'#4a3b31',accent2:'#d8b88f',
      sketchfabId:'5739890e24584b09abe77e19fb7fe32e',
      sourceUrl:'https://sketchfab.com/3d-models/attack-on-titan-signal-flare-gun-5739890e24584b09abe77e19fb7fe32e',
      description:'A faithful interactive replica of Signal Flare Gun, the flare gun used by Survey Corps in Attack on Titan.'
    },
    {
      id:'bakuzan',type:'weapon',kind:'katana',name:'Bakuzan',owner:'Satsuki Kiryūin',
      anime:'Kill la Kill',accent:'#4d1728',accent2:'#ff5b75',
      sketchfabId:'03b22bd57a38431786e0f109f9dc3208',
      sourceUrl:'https://sketchfab.com/3d-models/satsukis-bakuzan-03b22bd57a38431786e0f109f9dc3208',
      description:'A faithful interactive replica of Bakuzan, the katana used by Satsuki Kiryūin in Kill la Kill.'
    },
    {
      id:'nui-scissor-blade',type:'weapon',kind:'scissor blade',name:'Purple Scissor Blade',owner:'Nui Harime',
      anime:'Kill la Kill',accent:'#4d1728',accent2:'#ff5b75',
      sketchfabId:'00d4810c877c4cfda24b02cebec253fc',
      sourceUrl:'https://sketchfab.com/3d-models/nui-harimes-scissor-blade-00d4810c877c4cfda24b02cebec253fc',
      description:'A faithful interactive replica of Purple Scissor Blade, the scissor blade used by Nui Harime in Kill la Kill.'
    },
    {
      id:'bakugo-gauntlets',type:'weapon',kind:'explosive gauntlets',name:'Grenadier Bracers',owner:'Katsuki Bakugo',
      anime:'My Hero Academia',accent:'#244a43',accent2:'#6ff0c1',
      sketchfabId:'eddfb0fd1c514445acede00e333dfd68',
      sourceUrl:'https://sketchfab.com/3d-models/my-hero-academia-bakugou-gauntlets-eddfb0fd1c514445acede00e333dfd68',
      description:'A faithful interactive replica of Grenadier Bracers, the explosive gauntlets used by Katsuki Bakugo in My Hero Academia.'
    },
    {
      id:'ixa',type:'weapon',kind:'quinque lance and shield',name:'IXA',owner:'Kishou Arima',
      anime:'Tokyo Ghoul',accent:'#3f1e33',accent2:'#e98cc7',
      sketchfabId:'7f63fa30337a47a8a069394789556a56',
      sourceUrl:'https://sketchfab.com/3d-models/ixa-final-7f63fa30337a47a8a069394789556a56',
      description:'A faithful interactive replica of IXA, the quinque lance and shield used by Kishou Arima in Tokyo Ghoul.'
    },
    {
      id:'mami-musket',type:'weapon',kind:'rifled musket',name:'Mami’s Musket',owner:'Mami Tomoe',
      anime:'Puella Magi Madoka Magica',accent:'#5a284f',accent2:'#ff9cdd',
      sketchfabId:'2c1a7a77d5e8499abe4338a004808595',
      sourceUrl:'https://sketchfab.com/3d-models/mami-tomoes-gun-2c1a7a77d5e8499abe4338a004808595',
      description:'A faithful interactive replica of Mami’s Musket, the rifled musket used by Mami Tomoe in Puella Magi Madoka Magica.'
    },
    {
      id:'sayaka-sword',type:'weapon',kind:'saber',name:'Sayaka’s Sword',owner:'Sayaka Miki',
      anime:'Puella Magi Madoka Magica',accent:'#5a284f',accent2:'#ff9cdd',
      sketchfabId:'8a836ea0b32547b5be492692e7df4b85',
      sourceUrl:'https://sketchfab.com/3d-models/sayaka-sword-8a836ea0b32547b5be492692e7df4b85',
      description:'A faithful interactive replica of Sayaka’s Sword, the saber used by Sayaka Miki in Puella Magi Madoka Magica.'
    },
    {
      id:'kyoko-spear',type:'weapon',kind:'chain spear',name:'Kyoko’s Spear',owner:'Kyoko Sakura',
      anime:'Puella Magi Madoka Magica',accent:'#5a284f',accent2:'#ff9cdd',
      sketchfabId:'89927440bdf64343924283327b7a7bce',
      sourceUrl:'https://sketchfab.com/3d-models/kyoko-sakuras-spear-89927440bdf64343924283327b7a7bce',
      description:'A faithful interactive replica of Kyoko’s Spear, the chain spear used by Kyoko Sakura in Puella Magi Madoka Magica.'
    },
    {
      id:'homura-shield',type:'weapon',kind:'time shield',name:'Homura’s Shield',owner:'Homura Akemi',
      anime:'Puella Magi Madoka Magica',accent:'#5a284f',accent2:'#ff9cdd',
      sketchfabId:'d9defb0040404dd18ba6bccd31471570',
      sourceUrl:'https://sketchfab.com/3d-models/madoka-magica-homuras-shield-d9defb0040404dd18ba6bccd31471570',
      description:'A faithful interactive replica of Homura’s Shield, the time shield used by Homura Akemi in Puella Magi Madoka Magica.'
    },
    {
      id:'aki-sword',type:'weapon',kind:'nail sword',name:'Aki’s Cursed Sword',owner:'Aki Hayakawa',
      anime:'Chainsaw Man',accent:'#4a2b24',accent2:'#ff765b',
      sketchfabId:'c9e59329407a431d9575e0cae67f6a9e',
      sourceUrl:'https://sketchfab.com/3d-models/aki-sword-c9e59329407a431d9575e0cae67f6a9e',
      description:'A faithful interactive replica of Aki’s Cursed Sword, the nail sword used by Aki Hayakawa in Chainsaw Man.'
    },
    {
      id:'darkness-devil-sword',type:'weapon',kind:'ritual sword',name:'Darkness Devil Sword',owner:'Darkness Devil',
      anime:'Chainsaw Man',accent:'#4a2b24',accent2:'#ff765b',
      sketchfabId:'72032fcb4e1c4780be733b686d157770',
      sourceUrl:'https://sketchfab.com/3d-models/chainsaw-man-darkness-devil-sword-72032fcb4e1c4780be733b686d157770',
      description:'A faithful interactive replica of Darkness Devil Sword, the ritual sword used by Darkness Devil in Chainsaw Man.'
    },
    {
      id:'anubis-sword',type:'weapon',kind:'katana',name:'Anubis',owner:'Chaka / Polnareff',
      anime:'JoJo’s Bizarre Adventure',accent:'#4c295e',accent2:'#df9bff',
      sketchfabId:'9f5cb1ba97164ca398491eead7606184',
      sourceUrl:'https://sketchfab.com/3d-models/anubis-jojos-roblox-model-9f5cb1ba97164ca398491eead7606184',
      description:'A faithful interactive replica of Anubis, the katana used by Chaka / Polnareff in JoJo’s Bizarre Adventure.'
    },
    {
      id:'stand-bow-arrow',type:'weapon',kind:'bow and arrow',name:'Stand Bow and Arrow',owner:'Keicho Nijimura and others',
      anime:'JoJo’s Bizarre Adventure',accent:'#4c295e',accent2:'#df9bff',
      sketchfabId:'72796820bcb74e41a2eaf686809f24fe',
      sourceUrl:'https://sketchfab.com/3d-models/jojo-bow-and-arrow-72796820bcb74e41a2eaf686809f24fe',
      description:'A faithful interactive replica of Stand Bow and Arrow, the bow and arrow used by Keicho Nijimura and others in JoJo’s Bizarre Adventure.'
    },
    {
      id:'gyro-steel-ball',type:'weapon',kind:'throwing ball',name:'Steel Ball',owner:'Gyro Zeppeli',
      anime:'JoJo’s Bizarre Adventure',accent:'#4c295e',accent2:'#df9bff',
      sketchfabId:'dfb1780502da492faa383d5126df495f',
      sourceUrl:'https://sketchfab.com/3d-models/gyro-zeppelis-steel-ball-jjba-steel-ball-run-dfb1780502da492faa383d5126df495f',
      description:'A faithful interactive replica of Steel Ball, the throwing ball used by Gyro Zeppeli in JoJo’s Bizarre Adventure.'
    },
    {
      id:'dominator',type:'weapon',kind:'transforming handgun',name:'Dominator',owner:'Public Safety Bureau Inspectors',
      anime:'Psycho-Pass',accent:'#1b3f4c',accent2:'#64e5ff',
      sketchfabId:'1aba64ef0e28467bba43088eeb80771d',
      sourceUrl:'https://sketchfab.com/3d-models/dominator-from-psycho-pass-1aba64ef0e28467bba43088eeb80771d',
      description:'A faithful interactive replica of Dominator, the transforming handgun used by Public Safety Bureau Inspectors in Psycho-Pass.'
    },
    {
      id:'z-sword',type:'weapon',kind:'greatsword',name:'Z Sword',owner:'Son Gohan',
      anime:'Dragon Ball Z',accent:'#783b16',accent2:'#ffcc5f',
      sketchfabId:'62573e40dcb948329b2d282d4526bf84',
      sourceUrl:'https://sketchfab.com/3d-models/z-sword-dragon-ball-z-62573e40dcb948329b2d282d4526bf84',
      description:'A faithful interactive replica of Z Sword, the greatsword used by Son Gohan in Dragon Ball Z.'
    },
    {
      id:'moon-stick',type:'weapon',kind:'magic wand',name:'Moon Stick',owner:'Usagi Tsukino',
      anime:'Sailor Moon',accent:'#392b6e',accent2:'#ff9ae1',
      sketchfabId:'612582bc490a4353ba468a9839bf9119',
      sourceUrl:'https://sketchfab.com/3d-models/sailor-moon-moon-stick-612582bc490a4353ba468a9839bf9119',
      description:'A faithful interactive replica of Moon Stick, the magic wand used by Usagi Tsukino in Sailor Moon.'
    },
    {
      id:'clow-wand',type:'weapon',kind:'magic staff',name:'Clow Wand',owner:'Sakura Kinomoto',
      anime:'Cardcaptor Sakura',accent:'#56325e',accent2:'#ffb1dd',
      sketchfabId:'493ff31ae5fa4fe2a840aa57d4dca2eb',
      sourceUrl:'https://sketchfab.com/3d-models/cardcaptor-sakuras-clow-wand-493ff31ae5fa4fe2a840aa57d4dca2eb',
      description:'A faithful interactive replica of Clow Wand, the magic staff used by Sakura Kinomoto in Cardcaptor Sakura.'
    },
    {
      id:'rock-cannon',type:'weapon',kind:'cannon',name:'Rock Cannon',owner:'Black Rock Shooter',
      anime:'Black Rock Shooter',accent:'#172b45',accent2:'#55baff',
      sketchfabId:'1aa11400029942ec94bfaffe838afb15',
      sourceUrl:'https://sketchfab.com/3d-models/rock-cannon-1aa11400029942ec94bfaffe838afb15',
      description:'A faithful interactive replica of Rock Cannon, the cannon used by Black Rock Shooter in Black Rock Shooter.'
    },
    {
      id:'sekki',type:'weapon',kind:'regalia sword',name:'Sekki',owner:'Yato / Yukine',
      anime:'Noragami',accent:'#223d62',accent2:'#7fdcff',
      sketchfabId:'8fabbfb6ecca43cead00fc714a704cb1',
      sourceUrl:'https://sketchfab.com/3d-models/yatos-sword-yukine-sekki-8fabbfb6ecca43cead00fc714a704cb1',
      description:'A faithful interactive replica of Sekki, the regalia sword used by Yato / Yukine in Noragami.'
    },
    {
      id:'sakabato',type:'weapon',kind:'reverse-blade katana',name:'Sakabatō',owner:'Kenshin Himura',
      anime:'Rurouni Kenshin',accent:'#4d2c27',accent2:'#ff9a70',
      sketchfabId:'05fd4090fd24483facf1ed54b8ea6ace',
      sourceUrl:'https://sketchfab.com/3d-models/kenshins-reverse-blade-sword-05fd4090fd24483facf1ed54b8ea6ace',
      description:'A faithful interactive replica of Sakabatō, the reverse-blade katana used by Kenshin Himura in Rurouni Kenshin.'
    },
    {
      id:'liz-patty-pistols',type:'weapon',kind:'twin pistols',name:'Liz and Patty',owner:'Death the Kid',
      anime:'Soul Eater',accent:'#342740',accent2:'#caa0ff',
      sketchfabId:'01c7e51355f8477b8065b2f29264cce6',
      sourceUrl:'https://sketchfab.com/3d-models/death-the-kid-liz-or-patty-01c7e51355f8477b8065b2f29264cce6',
      description:'A faithful interactive replica of Liz and Patty, the twin pistols used by Death the Kid in Soul Eater.'
    },
    {
      id:'tsubaki-chain-scythe',type:'weapon',kind:'chain scythe',name:'Tsubaki Chain Scythe',owner:'Black☆Star',
      anime:'Soul Eater',accent:'#342740',accent2:'#caa0ff',
      sketchfabId:'26cb30656451439a83577b823315abb6',
      sourceUrl:'https://sketchfab.com/3d-models/soul-eater-tsubaki-26cb30656451439a83577b823315abb6',
      description:'A faithful interactive replica of Tsubaki Chain Scythe, the chain scythe used by Black☆Star in Soul Eater.'
    },
    {
      id:'ragnarok-sword',type:'weapon',kind:'demon sword',name:'Ragnarok',owner:'Crona',
      anime:'Soul Eater',accent:'#342740',accent2:'#caa0ff',
      sketchfabId:'ecf4a194453b427f882d550e00a9ce4c',
      sourceUrl:'https://sketchfab.com/3d-models/soul-eater-ragnarok-ecf4a194453b427f882d550e00a9ce4c',
      description:'A faithful interactive replica of Ragnarok, the demon sword used by Crona in Soul Eater.'
    },
    {
      id:'guts-cannon-arm',type:'weapon',kind:'prosthetic cannon',name:'Cannon Arm',owner:'Guts',
      anime:'Berserk',accent:'#34333a',accent2:'#ff766b',
      sketchfabId:'f50dd328d0a94ea89cff45367774ddd5',
      sourceUrl:'https://sketchfab.com/3d-models/asset-3d-berserk-ironarm-cannon-of-guts-f50dd328d0a94ea89cff45367774ddd5',
      description:'A faithful interactive replica of Cannon Arm, the prosthetic cannon used by Guts in Berserk.'
    },
    {"id":"suzumebachi","type":"weapon","kind":"stinger","name":"Suzumebachi","owner":"Soi Fon","anime":"Bleach","accent":"#111827","accent2":"#60a5fa","sketchfabId":"444174d47f094dfcaba546a1bd4a77ee","sourceUrl":"https://sketchfab.com/3d-models/suzumebachi-soi-fons-zanpaktou-shikai-bleach-444174d47f094dfcaba546a1bd4a77ee","description":"Soi Fon’s compact Shikai forms a lethal finger-mounted stinger built for two-strike assassinations."},
    {"id":"shinso","type":"weapon","kind":"wakizashi","name":"Shinsō","owner":"Gin Ichimaru","anime":"Bleach","accent":"#25152d","accent2":"#f472b6","sketchfabId":"606cdbf0f26746a28af283ae15419ba9","sourceUrl":"https://sketchfab.com/3d-models/shinso-606cdbf0f26746a28af283ae15419ba9","description":"Gin’s deceptive Zanpakutō can extend its blade at extreme speed and distance."},
    {"id":"arrogante","type":"weapon","kind":"battleaxe","name":"Arrogante","owner":"Baraggan Louisenbairn","anime":"Bleach","accent":"#172554","accent2":"#38bdf8","sketchfabId":"d0fac6f77d6c496e8f504bf70574044c","sourceUrl":"https://sketchfab.com/3d-models/arrogante-bleach-d0fac6f77d6c496e8f504bf70574044c","description":"Baraggan’s massive double-headed axe conceals the release of his deathly Resurrección."},
    {"id":"melodic-cudgel","type":"weapon","kind":"cane gun","name":"Melodic Cudgel","owner":"Roman Torchwick","anime":"RWBY","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"ac5ea2191e0d4ae8aeb34cae6cb413aa","sourceUrl":"https://sketchfab.com/3d-models/melodic-cudgel-ac5ea2191e0d4ae8aeb34cae6cb413aa","description":"Roman’s swaggering cane doubles as a firearm and close-quarters bludgeon."},
    {"id":"tessaiga","type":"weapon","kind":"yokai sword","name":"Tessaiga","owner":"Inuyasha","anime":"Inuyasha","accent":"#12251f","accent2":"#34d399","sketchfabId":"5e849d275acc40149b1a01694da420c7","sourceUrl":"https://sketchfab.com/3d-models/inuyasha-tessaiga-5e849d275acc40149b1a01694da420c7","description":"A fang-forged yōkai sword whose transformed blade unleashes devastating energy attacks."},
    {"id":"eisenmeteor","type":"weapon","kind":"iron sword","name":"Eisenmeteor","owner":"Haru Glory","anime":"Rave Master","accent":"#2d2010","accent2":"#facc15","sketchfabId":"7b732b03fa864e29bdf20fa9af6c06a2","sourceUrl":"https://sketchfab.com/3d-models/rave-master-eisenmeteor-7b732b03fa864e29bdf20fa9af6c06a2","description":"The default iron form of the Ten Commandments, balanced for straightforward sword combat."},
    {"id":"explosion-rave","type":"weapon","kind":"explosive sword","name":"Explosion","owner":"Haru Glory","anime":"Rave Master","accent":"#201638","accent2":"#a78bfa","sketchfabId":"591605a43f7d4e4fa9421a2d3ad03891","sourceUrl":"https://sketchfab.com/3d-models/rave-master-explosion-591605a43f7d4e4fa9421a2d3ad03891","description":"The Ten Commandments’ second form creates explosive force instead of a cutting edge."},
    {"id":"silfarion","type":"weapon","kind":"speed sword","name":"Silfarion","owner":"Haru Glory","anime":"Rave Master","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"033917902deb44e582ba47196eb23a20","sourceUrl":"https://sketchfab.com/3d-models/rave-master-silfarion-033917902deb44e582ba47196eb23a20","description":"A lightweight Ten Commandments form that trades raw power for tremendous speed."},
    {"id":"rune-save","type":"weapon","kind":"sealing sword","name":"Rune Save","owner":"Haru Glory","anime":"Rave Master","accent":"#111827","accent2":"#60a5fa","sketchfabId":"75d5d9d1a5094daf93bc79e0302effb5","sourceUrl":"https://sketchfab.com/3d-models/rave-master-rune-save-75d5d9d1a5094daf93bc79e0302effb5","description":"A non-cutting sword form able to sever magic and seal supernatural effects."},
    {"id":"gravity-core","type":"weapon","kind":"gravity sword","name":"Gravity Core","owner":"Haru Glory","anime":"Rave Master","accent":"#25152d","accent2":"#f472b6","sketchfabId":"0638d44171fb47ce90a36cfb8b8fff3b","sourceUrl":"https://sketchfab.com/3d-models/rave-master-gravity-core-0638d44171fb47ce90a36cfb8b8fff3b","description":"The Ten Commandments becomes an enormously heavy blade for crushing, high-impact strikes."},
    {"id":"staff-of-ainz-ooal-gown","type":"weapon","kind":"guild staff","name":"Staff of Ainz Ooal Gown","owner":"Ainz Ooal Gown","anime":"Overlord","accent":"#172554","accent2":"#38bdf8","sketchfabId":"6025afa60a0d4d7eb95ab9b01830e73e","sourceUrl":"https://sketchfab.com/3d-models/staff-of-ainz-ooal-gown-overlord-6025afa60a0d4d7eb95ab9b01830e73e","description":"The guild weapon crowned with seven jeweled serpents and immense magical authority."},
    {"id":"frost-pain","type":"weapon","kind":"enchanted blade","name":"Frost Pain","owner":"Zaryusu Shasha","anime":"Overlord","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"4cecd08a37be46f19fb147aa4156873e","sourceUrl":"https://sketchfab.com/3d-models/frost-pain-overlord-4cecd08a37be46f19fb147aa4156873e","description":"A treasured lizardman blade that channels cold and protects its wielder with icy power."},
    {"id":"kilineiram","type":"weapon","kind":"cursed sword","name":"Kilineiram","owner":"Brain Unglaus","anime":"Overlord","accent":"#12251f","accent2":"#34d399","sketchfabId":"46541e600e7f415a9801335a191ce354","sourceUrl":"https://sketchfab.com/3d-models/kilineiram-46541e600e7f415a9801335a191ce354","description":"Brain’s cursed katana is the blade behind his refined Field and God Flash techniques."},
    {"id":"albedo-3f","type":"weapon","kind":"battleaxe","name":"3F","owner":"Albedo","anime":"Overlord","accent":"#2d2010","accent2":"#facc15","sketchfabId":"0e4665586d504621bf9071b6b58de899","sourceUrl":"https://sketchfab.com/3d-models/3f-overlord-albedo-0e4665586d504621bf9071b6b58de899","description":"Albedo’s massive black battleaxe is built to match the overwhelming strength of Nazarick’s guardian overseer."},
    {"id":"spuit-lance","type":"weapon","kind":"divine lance","name":"Spuit Lance","owner":"Shalltear Bloodfallen","anime":"Overlord","accent":"#201638","accent2":"#a78bfa","sketchfabId":"552af4f1839c47efbcd2606cb3a196cf","sourceUrl":"https://sketchfab.com/3d-models/mass-for-the-dead-overlord-spuit-lance-552af4f1839c47efbcd2606cb3a196cf","description":"Shalltear’s crimson lance restores health as it drains damage from her enemies."},
    {"id":"momon-great-swords","type":"weapon","kind":"greatsword pair","name":"Momon’s Great Swords","owner":"Momon","anime":"Overlord","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"0309c1386eae4cd2b9123f4cbca9006f","sourceUrl":"https://sketchfab.com/3d-models/great-sword-0309c1386eae4cd2b9123f4cbca9006f","description":"The gigantic twin blades Ainz creates and wields while adventuring as the warrior Momon."},
    {"id":"platinum-dragon-great-sword","type":"weapon","kind":"floating greatsword","name":"Platinum Dragon Lord’s Great Sword","owner":"Tsaindorcus Vaision","anime":"Overlord","accent":"#111827","accent2":"#60a5fa","sketchfabId":"113a6bd0476a447d8625685b1acf1982","sourceUrl":"https://sketchfab.com/3d-models/platinum-dragon-lords-great-sword-113a6bd0476a447d8625685b1acf1982","description":"One of the colossal weapons telekinetically controlled by Platinum Dragon Lord’s remote armor."},
    {"id":"heavy-explosion","type":"weapon","kind":"magic spear","name":"Heavy Explosion","owner":"Leinas Rockbruise","anime":"Overlord","accent":"#25152d","accent2":"#f472b6","sketchfabId":"158d60cbd43f4a93b99621cd8a876bf8","sourceUrl":"https://sketchfab.com/3d-models/overlord-heavy-explosion-158d60cbd43f4a93b99621cd8a876bf8","description":"Leinas carries this ornate spear as one of the Baharuth Empire’s elite Four Imperial Knights."},
    {"id":"dragon-sword-reid","type":"weapon","kind":"dragon sword","name":"Dragon Sword Reid","owner":"Reinhard van Astrea","anime":"Re:Zero","accent":"#172554","accent2":"#38bdf8","sketchfabId":"9cc55438727f433b9c7b42a2a3fe6d7e","sourceUrl":"https://sketchfab.com/3d-models/reinhards-sword-rezero-9cc55438727f433b9c7b42a2a3fe6d7e","description":"The treasured blade of the Sword Saint draws itself only against an opponent it deems worthy."},
    {"id":"yang-sword-vollachia","type":"weapon","kind":"enchanted sword","name":"Yang Sword Vollachia","owner":"Priscilla Barielle","anime":"Re:Zero","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"af7e5ff8388f4455b06e7ca3eaf20324","sourceUrl":"https://sketchfab.com/3d-models/priscilla-barielles-sword-rezero-af7e5ff8388f4455b06e7ca3eaf20324","description":"Priscilla’s crimson royal sword burns chosen targets with sunlike, selective flame."},
    {"id":"rems-morningstar","type":"weapon","kind":"chain flail","name":"Rem’s Morningstar","owner":"Rem","anime":"Re:Zero","accent":"#12251f","accent2":"#34d399","sketchfabId":"8b4861e9aff94997a37e269f78041134","sourceUrl":"https://sketchfab.com/3d-models/re-zero-rem-weapon-8b4861e9aff94997a37e269f78041134","description":"Rem swings this spiked iron ball on a long chain with oni-enhanced strength."},
    {"id":"legendary-shield","type":"weapon","kind":"legendary shield","name":"Legendary Shield","owner":"Naofumi Iwatani","anime":"The Rising of the Shield Hero","accent":"#2d2010","accent2":"#facc15","sketchfabId":"48ac8fa6ad22402eab61a389cb2817ef","sourceUrl":"https://sketchfab.com/3d-models/legendary-shield-naofumis-shield-48ac8fa6ad22402eab61a389cb2817ef","description":"Naofumi’s Cardinal Weapon unlocks a vast tree of defensive and counterattack forms."},
    {"id":"legendary-spear","type":"weapon","kind":"legendary spear","name":"Legendary Spear","owner":"Motoyasu Kitamura","anime":"The Rising of the Shield Hero","accent":"#201638","accent2":"#a78bfa","sketchfabId":"4e756c36f1eb432d9fef5ab4dd07d0ae","sourceUrl":"https://sketchfab.com/3d-models/legendary-spear-the-rising-of-the-shield-hero-4e756c36f1eb432d9fef5ab4dd07d0ae","description":"Motoyasu’s Cardinal Weapon evolves through copied materials and unlocked spear forms."},
    {"id":"legendary-sword","type":"weapon","kind":"legendary sword","name":"Legendary Sword","owner":"Ren Amaki","anime":"The Rising of the Shield Hero","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"653b633275304ef7addc1797de88cec8","sourceUrl":"https://sketchfab.com/3d-models/legendary-sword-the-rising-of-the-shield-hero-653b633275304ef7addc1797de88cec8","description":"Ren’s Cardinal Weapon changes form as he strengthens and expands its weapon tree."},
    {"id":"legendary-bow","type":"weapon","kind":"legendary bow","name":"Legendary Bow","owner":"Itsuki Kawasumi","anime":"The Rising of the Shield Hero","accent":"#111827","accent2":"#60a5fa","sketchfabId":"dc5a2313e56647c5936771b548a812d0","sourceUrl":"https://sketchfab.com/3d-models/legendary-bow-the-rising-of-the-shield-hero-dc5a2313e56647c5936771b548a812d0","description":"Itsuki’s Cardinal Weapon grants an expanding arsenal of bows and ranged skills."},
    {"id":"megumins-staff","type":"weapon","kind":"magic staff","name":"Megumin’s Staff","owner":"Megumin","anime":"KonoSuba","accent":"#25152d","accent2":"#f472b6","sketchfabId":"54b5caf1e830485a86383907c4e2c276","sourceUrl":"https://sketchfab.com/3d-models/megumins-staff-54b5caf1e830485a86383907c4e2c276","description":"Megumin channels every ounce of her magic through this staff into a single spectacular Explosion."},
    {"id":"frierens-staff","type":"weapon","kind":"magic staff","name":"Frieren’s Staff","owner":"Frieren","anime":"Frieren: Beyond Journey’s End","accent":"#172554","accent2":"#38bdf8","sketchfabId":"8f23d4e7842b40b7b8c6058ee80a254c","sourceUrl":"https://sketchfab.com/3d-models/frierens-magic-staff-anime-fan-art-3d-model-8f23d4e7842b40b7b8c6058ee80a254c","description":"Frieren’s red-jeweled staff focuses the ancient elf mage’s immense spellcraft."},
    {"id":"ferns-staff","type":"weapon","kind":"magic staff","name":"Fern’s Staff","owner":"Fern","anime":"Frieren: Beyond Journey’s End","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"dad86ee6825f4574ac080f7742a72382","sourceUrl":"https://sketchfab.com/3d-models/sousou-no-frieren-fern-staff-no-clotch-dad86ee6825f4574ac080f7742a72382","description":"Fern’s long staff supports her precise, exceptionally fast offensive magic."},
    {"id":"starks-axe","type":"weapon","kind":"battleaxe","name":"Stark’s Axe","owner":"Stark","anime":"Frieren: Beyond Journey’s End","accent":"#12251f","accent2":"#34d399","sketchfabId":"45d08cc9e04744e8bf6bdd9e08d602f7","sourceUrl":"https://sketchfab.com/3d-models/starks-axe-sousou-no-frieren-45d08cc9e04744e8bf6bdd9e08d602f7","description":"Stark’s oversized double-headed axe turns his fearsome strength into monster-splitting blows."},
    {"id":"himmels-sword","type":"weapon","kind":"longsword","name":"Himmel’s Sword","owner":"Himmel","anime":"Frieren: Beyond Journey’s End","accent":"#2d2010","accent2":"#facc15","sketchfabId":"f88132599a414822a8760fb0427a1fbd","sourceUrl":"https://sketchfab.com/3d-models/himmels-sword-sousou-no-frieren-f88132599a414822a8760fb0427a1fbd","description":"The replica Hero’s Sword carried by Himmel throughout the party’s legendary journey."},
    {"id":"ubels-staff","type":"weapon","kind":"magic staff","name":"Übel’s Staff","owner":"Übel","anime":"Frieren: Beyond Journey’s End","accent":"#201638","accent2":"#a78bfa","sketchfabId":"3d843afeebab48d1b46e33d14f7cc67d","sourceUrl":"https://sketchfab.com/3d-models/ubels-staff-3d843afeebab48d1b46e33d14f7cc67d","description":"Übel’s distinctive staff accompanies her intuitive cutting magic in the First-Class Mage Exam."},
    {"id":"aqua-heartia","type":"weapon","kind":"magic staff","name":"Aqua Heartia","owner":"Rudeus Greyrat","anime":"Mushoku Tensei","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"3c9c1be1ec0f4b389ab2e8a2bcc16d8b","sourceUrl":"https://sketchfab.com/3d-models/aqua-heartia-rudeus-staff-3c9c1be1ec0f4b389ab2e8a2bcc16d8b","description":"An expensive water-aspected staff gifted to Rudeus, greatly amplifying his spellcasting."},
    {"id":"rudeus-first-wand","type":"weapon","kind":"magic wand","name":"Rudeus’s First Wand","owner":"Rudeus Greyrat","anime":"Mushoku Tensei","accent":"#111827","accent2":"#60a5fa","sketchfabId":"10ba0ce97fd141debdee7fd121bc9187","sourceUrl":"https://sketchfab.com/3d-models/rudeus-wand-mushoku-tensei-10ba0ce97fd141debdee7fd121bc9187","description":"The compact beginner’s wand Rudeus carved and used during his earliest magic training."},
    {"id":"roxys-staff","type":"weapon","kind":"magic staff","name":"Roxy’s Staff","owner":"Roxy Migurdia","anime":"Mushoku Tensei","accent":"#25152d","accent2":"#f472b6","sketchfabId":"7f44931f68104f91a23f3cc6bc75a4de","sourceUrl":"https://sketchfab.com/3d-models/roxy-migurdias-staff-7f44931f68104f91a23f3cc6bc75a4de","description":"Roxy’s blue-crystal staff accompanies the Water King-class mage on her journeys."},
    {"id":"king-dragon-sword-kajakut","type":"weapon","kind":"gravity greatsword","name":"King Dragon Sword Kajakut","owner":"Kalman III","anime":"Mushoku Tensei","accent":"#172554","accent2":"#38bdf8","sketchfabId":"3a7dd6704dfd4d4ba0d6851e5db36ea3","sourceUrl":"https://sketchfab.com/3d-models/king-dragon-sword-kajakut-3a7dd6704dfd4d4ba0d6851e5db36ea3","description":"A supreme cursed greatsword that manipulates gravity and releases crater-making bursts."},
    {"id":"gideon","type":"weapon","kind":"war hammer","name":"Gideon","owner":"Diane","anime":"The Seven Deadly Sins","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"5e34832585f14c63bd5992c018d24fd3","sourceUrl":"https://sketchfab.com/3d-models/dianes-weapon-from-seven-deadly-sins-5e34832585f14c63bd5992c018d24fd3","description":"Diane’s enormous Sacred Treasure channels Creation through a colossal war hammer."},
    {"id":"aldan","type":"weapon","kind":"magic orb","name":"Aldan","owner":"Merlin","anime":"The Seven Deadly Sins","accent":"#12251f","accent2":"#34d399","sketchfabId":"f0275f1b6e7647a4902d8ac6951791c6","sourceUrl":"https://sketchfab.com/3d-models/seven-deadly-sins-morning-star-aldan-f0275f1b6e7647a4902d8ac6951791c6","description":"Merlin’s floating Sacred Treasure amplifies magic and can manifest as a radiant morning star."},
    {"id":"dragon-handle","type":"weapon","kind":"broken sword","name":"Dragon Handle","owner":"Meliodas","anime":"The Seven Deadly Sins","accent":"#2d2010","accent2":"#facc15","sketchfabId":"19766e5cf13b46958753744e36686064","sourceUrl":"https://sketchfab.com/3d-models/nanatsu-no-taizai-dragon-handle-19766e5cf13b46958753744e36686064","description":"Meliodas carried this broken blade and dragon-emblazoned hilt before recovering Lostvayne."},
    {"id":"sword-cutlass","type":"weapon","kind":"pistol pair","name":"Sword Cutlass","owner":"Revy","anime":"Black Lagoon","accent":"#201638","accent2":"#a78bfa","sketchfabId":"7f2db84735e2460ba1e0d200e51e2786","sourceUrl":"https://sketchfab.com/3d-models/black-lagoon-beretta-92f-sword-cutlass-7f2db84735e2460ba1e0d200e51e2786","description":"Revy’s customized stainless Beretta 92F pistols define her two-handed gunfighting style."},
    {"id":"edas-g17l","type":"weapon","kind":"pistol","name":"Eda’s G17L","owner":"Eda","anime":"Black Lagoon","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"346d2a126fb54c9b891b1f60b6a79b32","sourceUrl":"https://sketchfab.com/3d-models/eda-g17l-pistol-346d2a126fb54c9b891b1f60b6a79b32","description":"Eda’s long-slide Glock is a practical sidearm for the gun-running nun of Roanapur."},
    {"id":"jericho-941r","type":"weapon","kind":"pistol","name":"Jericho 941 R","owner":"Spike Spiegel","anime":"Cowboy Bebop","accent":"#111827","accent2":"#60a5fa","sketchfabId":"a2259810d86c4aff85faedf973cb4166","sourceUrl":"https://sketchfab.com/3d-models/jericho-941-r-a2259810d86c4aff85faedf973cb4166","description":"Spike’s customized Jericho is his reliable sidearm for bounty hunts across the solar system."},
    {"id":"mateba-2006m","type":"weapon","kind":"revolver","name":"Mateba 2006M","owner":"Togusa","anime":"Ghost in the Shell","accent":"#25152d","accent2":"#f472b6","sketchfabId":"11bab5a98dd848f69ba67791a916b88c","sourceUrl":"https://sketchfab.com/3d-models/mateba-2006m-11bab5a98dd848f69ba67791a916b88c","description":"Togusa favors this distinctive Mateba revolver despite Section 9’s advanced arsenal."},
    {"id":"knives-black-colt","type":"weapon","kind":"revolver","name":"Black AGL Arms .45 Long Colt","owner":"Millions Knives","anime":"Trigun","accent":"#172554","accent2":"#38bdf8","sketchfabId":"e909375f85d14104ab1a713b0f8763df","sourceUrl":"https://sketchfab.com/3d-models/low-poly-agl-arms-45-long-colt-e909375f85d14104ab1a713b0f8763df","description":"Knives’ black custom revolver mirrors Vash’s silver sidearm with a darker finish."},
    {"id":"nanashaku-jitte","type":"weapon","kind":"jitte","name":"Nanashaku Jitte","owner":"Smoker","anime":"One Piece","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"411da4ecdce84553bfb85cd177cd5cac","sourceUrl":"https://sketchfab.com/3d-models/nanashaku-jitte-smokers-weapon-411da4ecdce84553bfb85cd177cd5cac","description":"Smoker’s long Seastone-tipped jitte suppresses Devil Fruit powers on contact."},
    {"id":"takeru","type":"weapon","kind":"kanabo","name":"Takeru","owner":"Yamato","anime":"One Piece","accent":"#12251f","accent2":"#34d399","sketchfabId":"69d0b95b76e242b095eb1a60dd60abcf","sourceUrl":"https://sketchfab.com/3d-models/one-piece-yamatos-weapon-69d0b95b76e242b095eb1a60dd60abcf","description":"Yamato’s immense studded kanabō delivers thunderous, Haki-coated strikes."},
    {"id":"rx78-beam-saber","type":"weapon","kind":"beam saber","name":"RX-78-2 Beam Saber","owner":"Amuro Ray","anime":"Mobile Suit Gundam","accent":"#2d2010","accent2":"#facc15","sketchfabId":"6825d1d538b7435eb14bcc1b2261a6fd","sourceUrl":"https://sketchfab.com/3d-models/rx-78-2-gundam-beam-saber-6825d1d538b7435eb14bcc1b2261a6fd","description":"The RX-78-2’s compact hilt projects a beam blade for close mobile-suit combat."},
    {"id":"nu-gundam-beam-rifle","type":"weapon","kind":"beam rifle","name":"Nu Gundam Beam Rifle","owner":"Amuro Ray","anime":"Mobile Suit Gundam: Char’s Counterattack","accent":"#201638","accent2":"#a78bfa","sketchfabId":"16c63da089b74e4f974f8f44a8341782","sourceUrl":"https://sketchfab.com/3d-models/nu-gundam-beam-rifle-16c63da089b74e4f974f8f44a8341782","description":"Nu Gundam’s primary rifle fires rapid or high-powered beam shots."},
    {"id":"crocodiles-hook","type":"weapon","kind":"poison hook","name":"Crocodile’s Hook","owner":"Crocodile","anime":"One Piece","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"309f234ef56a4c10b55dd192db37a38a","sourceUrl":"https://sketchfab.com/3d-models/crocodiles-hook-309f234ef56a4c10b55dd192db37a38a","description":"Crocodile’s golden prosthetic hides a poison hook and a concealed blade."},
    {"id":"dojima-quinque","type":"weapon","kind":"quinque spear","name":"Dōjima 1/2","owner":"Kōtarō Amon","anime":"Tokyo Ghoul","accent":"#111827","accent2":"#60a5fa","sketchfabId":"85feb220a3f64931a493dbc714732220","sourceUrl":"https://sketchfab.com/3d-models/dojima-quinque-tokyo-ghoul-85feb220a3f64931a493dbc714732220","description":"Amon’s heavy koukaku quinque extends into a brutal spear-like close-combat weapon."},
    {"id":"yukimura-quinque","type":"weapon","kind":"quinque sword","name":"Yukimura 1/3","owner":"Kishō Arima","anime":"Tokyo Ghoul","accent":"#25152d","accent2":"#f472b6","sketchfabId":"26ff449f5ec8499c810390d7376bc973","sourceUrl":"https://sketchfab.com/3d-models/yukimura-26ff449f5ec8499c810390d7376bc973","description":"Arima’s balanced bikaku quinque takes the form of a clean, dependable sword."},
    {"id":"jasons-xiii","type":"weapon","kind":"quinque scythe","name":"Jason’s XIII","owner":"Jūzō Suzuya","anime":"Tokyo Ghoul","accent":"#172554","accent2":"#38bdf8","sketchfabId":"98cb10ef8bf34e0b9d3a80385bced4fa","sourceUrl":"https://sketchfab.com/3d-models/xiiis-jason-tokyo-ghoul-98cb10ef8bf34e0b9d3a80385bced4fa","description":"Jūzō’s quinque becomes a huge red scythe forged from Yamori’s kakuhou."},
    {"id":"soul-eater-excalibur","type":"weapon","kind":"demon sword","name":"Excalibur","owner":"Excalibur","anime":"Soul Eater","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"34fac33821f54b5da41dc7979a3d7ee1","sourceUrl":"https://sketchfab.com/3d-models/excalibur-soul-eater-34fac33821f54b5da41dc7979a3d7ee1","description":"The legendary holy sword offers absurd power to any meister patient enough to tolerate him."},
    {"id":"incursio-spear","type":"weapon","kind":"spear","name":"Incursio Spear","owner":"Tatsumi","anime":"Akame ga Kill!","accent":"#12251f","accent2":"#34d399","sketchfabId":"afad9fe0a70a44b58421546ec9551a6d","sourceUrl":"https://sketchfab.com/3d-models/incursio-spear-akame-ga-kill-afad9fe0a70a44b58421546ec9551a6d","description":"Incursio’s spear gives Tatsumi long reach alongside the armor Teigu’s evolving strength."},
    {"id":"incursio-sword","type":"weapon","kind":"sword","name":"Incursio Sword","owner":"Bulat","anime":"Akame ga Kill!","accent":"#2d2010","accent2":"#facc15","sketchfabId":"775f1d7b140c421982934308e0da1f9e","sourceUrl":"https://sketchfab.com/3d-models/incursio-sword-akame-ga-kill-775f1d7b140c421982934308e0da1f9e","description":"The key weapon of the Incursio Teigu transforms into armor while retaining a battle-ready blade."},
    {"id":"pen-mace","type":"weapon","kind":"mace","name":"Pen Mace","owner":"Ai Ohto","anime":"Wonder Egg Priority","accent":"#201638","accent2":"#a78bfa","sketchfabId":"9c2ecd82a87a41eebbec360a7e681a4b","sourceUrl":"https://sketchfab.com/3d-models/ohto-ais-pen-mace-9c2ecd82a87a41eebbec360a7e681a4b","description":"Ai’s ordinary pen transforms inside the Egg world into a colorful, heavy mace."},
    {"id":"strawberry-bell","type":"weapon","kind":"magic bell","name":"Strawberry Bell","owner":"Ichigo Momomiya","anime":"Tokyo Mew Mew","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"5ea47a841d484b219038db19d6a8b489","sourceUrl":"https://sketchfab.com/3d-models/ichigos-strawberry-bell-5ea47a841d484b219038db19d6a8b489","description":"Ichigo’s heart-shaped bell channels her signature Ribbon Strawberry attacks."},
    {"id":"pink-moon-stick","type":"weapon","kind":"magic wand","name":"Pink Moon Stick","owner":"Chibiusa","anime":"Sailor Moon","accent":"#111827","accent2":"#60a5fa","sketchfabId":"d01e48de7a464524b9a25fbc28a2b702","sourceUrl":"https://sketchfab.com/3d-models/sugar-heart-pink-wand-d01e48de7a464524b9a25fbc28a2b702","description":"Chibi Moon’s first wand focuses the bright Pink Sugar Heart Attack."},
    {"id":"star-wand","type":"weapon","kind":"sealing staff","name":"Star Wand","owner":"Sakura Kinomoto","anime":"Cardcaptor Sakura","accent":"#25152d","accent2":"#f472b6","sketchfabId":"9b2106ff51cb41ef933872c41e3c44b2","sourceUrl":"https://sketchfab.com/3d-models/cardcaptor-sakura-star-wand-9b2106ff51cb41ef933872c41e3c44b2","description":"Sakura’s star-headed staff channels her evolved Sakura Cards."},
    {"id":"kaleidomoon-scope","type":"weapon","kind":"magic scepter","name":"Kaleidomoon Scope","owner":"Sailor Moon","anime":"Sailor Moon","accent":"#172554","accent2":"#38bdf8","sketchfabId":"c078d19ea6524ecbb17fec10cbd88a4f","sourceUrl":"https://sketchfab.com/3d-models/kaleidomoon-scope-c078d19ea6524ecbb17fec10cbd88a4f","description":"Sailor Moon’s ornate SuperS weapon releases the Moon Gorgeous Meditation attack."},
    {"id":"spiral-heart-moon-rod","type":"weapon","kind":"magic rod","name":"Spiral Heart Moon Rod","owner":"Sailor Moon","anime":"Sailor Moon","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"fdc209f0985040da93e9eadb9ebbbb67","sourceUrl":"https://sketchfab.com/3d-models/spiral-heart-moon-rod-sailor-moon-fdc209f0985040da93e9eadb9ebbbb67","description":"A heart-crowned rod used for Moon Spiral Heart Attack and Rainbow Moon Heartache."},
    {"id":"clares-claymore","type":"weapon","kind":"greatsword","name":"Clare’s Claymore","owner":"Clare","anime":"Claymore","accent":"#12251f","accent2":"#34d399","sketchfabId":"a3a51948c9834d6997eadb0a1eef6bf9","sourceUrl":"https://sketchfab.com/3d-models/claymore-claymore-anime-clares-weapon-a3a51948c9834d6997eadb0a1eef6bf9","description":"Clare’s organization-issued silver greatsword is nearly indestructible and built to kill Yoma."},
    {"id":"sanosukes-zanbato","type":"weapon","kind":"zanbatō","name":"Sanosuke’s Zanbatō","owner":"Sagara Sanosuke","anime":"Rurouni Kenshin","accent":"#2d2010","accent2":"#facc15","sketchfabId":"3cb8af2c572048b1aa37301c1a03a8dd","sourceUrl":"https://sketchfab.com/3d-models/rurouni-kenshin-zanbato-3cb8af2c572048b1aa37301c1a03a8dd","description":"Sanosuke’s first weapon is a massive anti-cavalry blade swung with raw strength."},
    {"id":"sao-excalibur","type":"weapon","kind":"holy sword","name":"Excalibur","owner":"Kirito","anime":"Sword Art Online","accent":"#201638","accent2":"#a78bfa","sketchfabId":"80779aaa5b75493c82a0839b0e36a4d8","sourceUrl":"https://sketchfab.com/3d-models/excalibur-sword-art-online-80779aaa5b75493c82a0839b0e36a4d8","description":"ALO’s legendary golden Holy Sword is awarded after the Ice Palace quest."},
    {"id":"future-trunks-sword","type":"weapon","kind":"longsword","name":"Future Trunks’ Sword","owner":"Future Trunks","anime":"Dragon Ball Z","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"f0f11c854ccb4cf69735e7d163d756be","sourceUrl":"https://sketchfab.com/3d-models/trunks-sword-dragonball-z-f0f11c854ccb4cf69735e7d163d756be","description":"Trunks carries this straight blade across time and uses it to dismantle Frieza’s forces."},
    {"id":"power-pole","type":"weapon","kind":"extending staff","name":"Power Pole","owner":"Goku","anime":"Dragon Ball","accent":"#111827","accent2":"#60a5fa","sketchfabId":"b8c674e174964f65b858a6ba36ca89c5","sourceUrl":"https://sketchfab.com/3d-models/power-pole-b8c674e174964f65b858a6ba36ca89c5","description":"Goku’s red staff can extend to extraordinary lengths on command."},
    {"id":"gurens-mahiru-no-yo","type":"weapon","kind":"demon sword","name":"Mahiru-no-Yo","owner":"Guren Ichinose","anime":"Seraph of the End","accent":"#25152d","accent2":"#f472b6","sketchfabId":"f49df7ef6abc41159cc73f24a0f0abf1","sourceUrl":"https://sketchfab.com/3d-models/gurens-sword-owari-no-seraph-f49df7ef6abc41159cc73f24a0f0abf1","description":"Guren’s Black Demon Series sword houses Mahiru and grants dangerous demonic power."},
    {"id":"asuramaru","type":"weapon","kind":"demon katana","name":"Asuramaru","owner":"Yūichirō Hyakuya","anime":"Seraph of the End","accent":"#172554","accent2":"#38bdf8","sketchfabId":"292e8cde916040d691b655f34bfed36c","sourceUrl":"https://sketchfab.com/3d-models/asuramaru-katana-owari-no-seraph-292e8cde916040d691b655f34bfed36c","description":"Yūichirō’s Black Demon Series katana unleashes the power of the demon Asuramaru."},
    {"id":"fire-force-excalibur","type":"weapon","kind":"plasma sword","name":"Excalibur","owner":"Arthur Boyle","anime":"Fire Force","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"70940a231c254f72bf5e5f401e9a766c","sourceUrl":"https://sketchfab.com/3d-models/fireforce-excalibur-70940a231c254f72bf5e5f401e9a766c","description":"Arthur’s bladeless hilt forms a concentrated plasma blade from his ignition ability."},
    {"id":"alibabas-dagger","type":"weapon","kind":"metal vessel","name":"Alibaba’s Dagger","owner":"Alibaba Saluja","anime":"Magi: The Labyrinth of Magic","accent":"#12251f","accent2":"#34d399","sketchfabId":"7d2228cf3dbe45e0954029487d19bff1","sourceUrl":"https://sketchfab.com/3d-models/alibaba-salujas-dagger-from-the-anime-magi-7d2228cf3dbe45e0954029487d19bff1","description":"Alibaba’s dagger becomes Amon’s Metal Vessel and channels scorching djinn power."},
    {"id":"odeot","type":"weapon","kind":"greatsword","name":"Odeot","owner":"Jack Rakan","anime":"Negima! Magister Negi Magi","accent":"#2d2010","accent2":"#facc15","sketchfabId":"04772ce579414c858303101e00550118","sourceUrl":"https://sketchfab.com/3d-models/odeot-negima-magister-negi-magi-04772ce579414c858303101e00550118","description":"Jack Rakan’s enormous pactio artifact can reshape itself and scale to absurd proportions."},
    {"id":"zaku-heat-hawk","type":"weapon","kind":"heated axe","name":"Heat Hawk","owner":"Zaku II pilots","anime":"Mobile Suit Gundam","accent":"#201638","accent2":"#a78bfa","sketchfabId":"a3ee3d8b8e2646eea1f2ac97a1117804","sourceUrl":"https://sketchfab.com/3d-models/zaku-heat-hawk-a3ee3d8b8e2646eea1f2ac97a1117804","description":"The Zaku’s superheated axe cuts through armor in close-quarters mobile-suit combat."},
    {"id":"aerial-beam-rifle","type":"weapon","kind":"beam rifle","name":"Aerial Beam Rifle","owner":"Suletta Mercury","anime":"Mobile Suit Gundam: The Witch from Mercury","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"66346aeb34004d0c964cd79262e763a8","sourceUrl":"https://sketchfab.com/3d-models/sd-gundam-aerial-beam-rifle-66346aeb34004d0c964cd79262e763a8","description":"Gundam Aerial’s rifle integrates with its GUND-BIT equipment for heavier firing modes."},
    {"id":"hyaku-shiki-weapons","type":"weapon","kind":"weapon set","name":"Hyaku Shiki Weapon Set","owner":"Quattro Bajeena","anime":"Mobile Suit Zeta Gundam","accent":"#111827","accent2":"#60a5fa","sketchfabId":"cac51ac3384645379ffe80d1e6832844","sourceUrl":"https://sketchfab.com/3d-models/hyaku-shiki-weapons-cac51ac3384645379ffe80d1e6832844","description":"A matched set containing Hyaku Shiki’s beam rifle, Clay Bazooka and Mega Bazooka Launcher."},
    {"id":"knightmare-assault-rifle","type":"weapon","kind":"mecha rifle","name":"Knightmare Assault Rifle","owner":"Britannian Knightmare pilots","anime":"Code Geass","accent":"#25152d","accent2":"#f472b6","sketchfabId":"46f54208a4bd4e8283c192c268bcdff2","sourceUrl":"https://sketchfab.com/3d-models/knightmare-assault-rifle-from-code-geass-46f54208a4bd4e8283c192c268bcdff2","description":"A standard large-caliber rifle carried by Britannian Knightmare Frames."},
    {"id":"code-geass-officer-pistol","type":"weapon","kind":"pistol","name":"Britannian Officer Pistol","owner":"Britannian officers","anime":"Code Geass","accent":"#172554","accent2":"#38bdf8","sketchfabId":"7e0905640f944b3689419acdd87581af","sourceUrl":"https://sketchfab.com/3d-models/code-geass-officer-pistol-7e0905640f944b3689419acdd87581af","description":"The distinctive service pistol carried by Britannian military officers."},
    {"id":"sword-of-akasha","type":"weapon","kind":"god-killing weapon","name":"Sword of Akasha","owner":"Charles zi Britannia","anime":"Code Geass","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"6bdd4946a6584b6a9bbbfe692b722dbd","sourceUrl":"https://sketchfab.com/3d-models/sword-of-akasha-6bdd4946a6584b6a9bbbfe692b722dbd","description":"A monumental weapon and system created as part of Charles’ plan to kill God."},
    {"id":"thunder-spear","type":"weapon","kind":"explosive spear","name":"Thunder Spear","owner":"Survey Corps","anime":"Attack on Titan","accent":"#12251f","accent2":"#34d399","sketchfabId":"e1a004f73cff4b0b98c4e4984ba66db7","sourceUrl":"https://sketchfab.com/3d-models/attack-on-titan-thunder-spear-armed-e1a004f73cff4b0b98c4e4984ba66db7","description":"A shoulder-fired explosive lance designed to break hardened Titan armor."},
    {"id":"wall-cannon","type":"weapon","kind":"cannon","name":"Wall Cannon","owner":"Garrison Regiment","anime":"Attack on Titan","accent":"#2d2010","accent2":"#facc15","sketchfabId":"7bacac0f2c8b443ea6df505efd02fe8c","sourceUrl":"https://sketchfab.com/3d-models/attack-on-titan-cannon-7bacac0f2c8b443ea6df505efd02fe8c","description":"Heavy cannons line the Walls and fire explosive shells into approaching Titans."},
    {"id":"thorfinns-knives","type":"weapon","kind":"dagger pair","name":"Thorfinn’s Knives","owner":"Thorfinn","anime":"Vinland Saga","accent":"#201638","accent2":"#a78bfa","sketchfabId":"10ec8a60e33b43449e835ee6e3e1d6f0","sourceUrl":"https://sketchfab.com/3d-models/thorfinns-knives-from-vinland-saga-10ec8a60e33b43449e835ee6e3e1d6f0","description":"Thorfinn’s paired short blades favor speed, reversals and close-range Viking combat."},
    {"id":"mugens-sword","type":"weapon","kind":"tachi","name":"Mugen’s Sword","owner":"Mugen","anime":"Samurai Champloo","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"ddacea3759374970b36ac253c7b3e112","sourceUrl":"https://sketchfab.com/3d-models/mugens-sword-ddacea3759374970b36ac253c7b3e112","description":"Mugen’s unusual curved sword complements his wild, breakdance-inspired fighting style."},
    {"id":"goblin-slayer-shield","type":"weapon","kind":"round shield","name":"Goblin Slayer’s Shield","owner":"Goblin Slayer","anime":"Goblin Slayer","accent":"#111827","accent2":"#60a5fa","sketchfabId":"92897049254249259ff9fd4b1d44afa6","sourceUrl":"https://sketchfab.com/3d-models/goblin-slayers-shield-goblin-slayer-92897049254249259ff9fd4b1d44afa6","description":"A small battered shield chosen for maneuverability in cramped goblin tunnels."},
    {"id":"raphtalias-sword","type":"weapon","kind":"magic sword","name":"Raphtalia’s Sword","owner":"Raphtalia","anime":"The Rising of the Shield Hero","accent":"#25152d","accent2":"#f472b6","sketchfabId":"0557b3ee14aa4d39a6d432320f97b20c","sourceUrl":"https://sketchfab.com/3d-models/raphtalias-sword-shield-hero-0557b3ee14aa4d39a6d432320f97b20c","description":"Raphtalia’s sword supports her fast illusion-assisted style as the Katana Hero."},
    {"id":"siderite-shield","type":"weapon","kind":"shield form","name":"Siderite Shield","owner":"Naofumi Iwatani","anime":"The Rising of the Shield Hero","accent":"#172554","accent2":"#38bdf8","sketchfabId":"73b7b2055fef44d58d0d677822f2661f","sourceUrl":"https://sketchfab.com/3d-models/siderite-shield-73b7b2055fef44d58d0d677822f2661f","description":"A metallic Legendary Shield variant unlocked within Naofumi’s expanding shield tree."},
    {"id":"aquas-staff","type":"weapon","kind":"magic staff","name":"Aqua’s Staff","owner":"Aqua","anime":"KonoSuba","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"61db344a4d724dad8fd598e330a80710","sourceUrl":"https://sketchfab.com/3d-models/aquas-staff-61db344a4d724dad8fd598e330a80710","description":"Aqua’s flower-topped staff accompanies her healing, purification and party tricks."},
    {"id":"sabos-pipe","type":"weapon","kind":"iron pipe","name":"Sabo’s Pipe","owner":"Sabo","anime":"One Piece","accent":"#12251f","accent2":"#34d399","sketchfabId":"5c40130cdda540e0a9ea0feb0a14b2fe","sourceUrl":"https://sketchfab.com/3d-models/sabos-weapon-5c40130cdda540e0a9ea0feb0a14b2fe","description":"Sabo reinforces his simple iron pipe with Armament Haki for crushing Dragon Claw strikes."},
    {"id":"dxd-durandal","type":"weapon","kind":"holy sword","name":"Durandal","owner":"Xenovia Quarta","anime":"High School DxD","accent":"#2d2010","accent2":"#facc15","sketchfabId":"6cbb6193a44b4bab8053f644fc0ea252","sourceUrl":"https://sketchfab.com/3d-models/high-school-dxd-xenovia-durandal-6cbb6193a44b4bab8053f644fc0ea252","description":"Xenovia’s alchemically forged Holy Sword releases overwhelming destructive power."},
    {"id":"kogatana","type":"weapon","kind":"dagger","name":"Kogatana","owner":"Dracule Mihawk","anime":"One Piece","accent":"#201638","accent2":"#a78bfa","sketchfabId":"2f96a16007354a5e8e7c2e1d0f4f2eff","sourceUrl":"https://sketchfab.com/3d-models/yoru-mihawks-sword-2f96a16007354a5e8e7c2e1d0f4f2eff","description":"Mihawk’s tiny cross-shaped neck knife is still deadly in the hands of the world’s greatest swordsman."},
    {"id":"boosted-gear","type":"weapon","kind":"sacred gauntlet","name":"Boosted Gear","owner":"Issei Hyoudou","anime":"High School DxD","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"1b59febf0ff24d698c143edfbd21aad7","sourceUrl":"https://sketchfab.com/3d-models/boosted-gear-dxd-ver2-1b59febf0ff24d698c143edfbd21aad7","description":"The Red Dragon Emperor’s gauntlet repeatedly doubles Issei’s power and transfers it to allies."},
    {"id":"true-longinus","type":"weapon","kind":"holy spear","name":"True Longinus","owner":"Cao Cao","anime":"High School DxD","accent":"#111827","accent2":"#60a5fa","sketchfabId":"2c73690e51114a4590fbcb409ee9a98d","sourceUrl":"https://sketchfab.com/3d-models/true-longinus-high-school-dxd-2c73690e51114a4590fbcb409ee9a98d","description":"The highest-ranked Longinus is the legendary spear said to have pierced Christ."},
    {"id":"valkyrie-spears","type":"weapon","kind":"spear and shield set","name":"Valkyries’ Spears and Shield","owner":"Ortlinde, Hildr and Thrúd","anime":"Fate/Grand Order","accent":"#25152d","accent2":"#f472b6","sketchfabId":"93b4120b86d04fb1843e22210ff45e7b","sourceUrl":"https://sketchfab.com/3d-models/valkyries-spears-93b4120b86d04fb1843e22210ff45e7b","description":"A coordinated set of light spears and shield carried by the three mass-produced Valkyries."},
    {"id":"seburo-m5","type":"weapon","kind":"pistol","name":"Seburo M5","owner":"Public Security Section 9","anime":"Ghost in the Shell: Stand Alone Complex","accent":"#172554","accent2":"#38bdf8","sketchfabId":"7ee7bd7ac3d247eba331c0b307599327","sourceUrl":"https://sketchfab.com/3d-models/seburo-m5-2017-7ee7bd7ac3d247eba331c0b307599327","description":"Section 9’s compact fictional sidearm pairs cyberpunk ergonomics with dependable firepower."},
    {"id":"kogis-uzi","type":"weapon","kind":"submachine gun","name":"Kogi’s Uzi","owner":"Kogi","anime":"Ghost in the Shell","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"67e9d6f9237e4365a6476f648e4a3a83","sourceUrl":"https://sketchfab.com/3d-models/uzi-smg-from-ghost-in-the-shell-67e9d6f9237e4365a6476f648e4a3a83","description":"Kogi’s overloaded Uzi fires oversized ammunition at the cost of wrecking its own barrel."},
    {"id":"rebeccas-handgun","type":"weapon","kind":"pistol","name":"Rebecca’s Handgun","owner":"Rebecca","anime":"Cyberpunk: Edgerunners","accent":"#12251f","accent2":"#34d399","sketchfabId":"9aec8edb7fda431faf914cbce04ef1a1","sourceUrl":"https://sketchfab.com/3d-models/cyberpunk-2077rebeccas-handgun-9aec8edb7fda431faf914cbce04ef1a1","description":"Rebecca’s brightly customized heavy pistol matches her reckless close-range gunplay."},
    {"id":"grieving-blade","type":"weapon","kind":"gunblade","name":"Grieving Blade","owner":"Sakura Inami","anime":"Beyond the Boundary","accent":"#2d2010","accent2":"#facc15","sketchfabId":"2b89a22e2ae34dd08c8a31cdde6781e4","sourceUrl":"https://sketchfab.com/3d-models/greiving-blade-2b89a22e2ae34dd08c8a31cdde6781e4","description":"A bizarre hybrid weapon combining a blade, chainsaw, spear and firearm components."},
    {"id":"stampede-revolver","type":"weapon","kind":"revolver","name":"Trigun Stampede Revolver","owner":"Vash the Stampede","anime":"Trigun Stampede","accent":"#201638","accent2":"#a78bfa","sketchfabId":"c903cffae6f1421b8519898a92527a2e","sourceUrl":"https://sketchfab.com/3d-models/trigun-stampede-gun-c903cffae6f1421b8519898a92527a2e","description":"Vash’s redesigned break-action revolver from Trigun Stampede carries a lower-bore, modern silhouette."},
    {"id":"giga-drill","type":"weapon","kind":"drill","name":"Giga Drill","owner":"Gurren Lagann","anime":"Gurren Lagann","accent":"#2a1018","accent2":"#fb7185","sketchfabId":"31d732b68a7d4abf8f928b5f4762ddf6","sourceUrl":"https://sketchfab.com/3d-models/drill-gurren-lagann-31d732b68a7d4abf8f928b5f4762ddf6","description":"Gurren Lagann manifests a gigantic spiral drill for its most iconic finishing attacks."},
    {"id":"queen-pike","type":"weapon","kind":"mecha lance","name":"Queen Pike","owner":"Strelizia","anime":"DARLING in the FRANXX","accent":"#111827","accent2":"#60a5fa","sketchfabId":"23559679a10d4a4e86f323dff1ef45da","sourceUrl":"https://sketchfab.com/3d-models/darling-in-the-franxx-strelizia-weapon-23559679a10d4a4e86f323dff1ef45da","description":"Strelizia’s huge white-and-red lance becomes her tail when she enters Stampede Mode."},
    {"id":"metal-bat","type":"weapon","kind":"metal bat","name":"Metal Bat","owner":"Bad","anime":"One-Punch Man","accent":"#25152d","accent2":"#f472b6","sketchfabId":"83858413b9854ca0846e1c7d577e7e5c","sourceUrl":"https://sketchfab.com/3d-models/metal-bat-one-punch-man-83858413b9854ca0846e1c7d577e7e5c","description":"The S-Class hero’s supposedly unbreakable bat grows deadlier as his fighting spirit rises."},
    {"id":"kensuke","type":"weapon","kind":"living sword","name":"Kensuke","owner":"Laios Touden","anime":"Delicious in Dungeon","accent":"#172554","accent2":"#38bdf8","sketchfabId":"4279a0cb8a7b4c159d3681f4fa9a95c1","sourceUrl":"https://sketchfab.com/3d-models/kensuke-dungeon-meshi-4279a0cb8a7b4c159d3681f4fa9a95c1","description":"Laios’ sword houses a living mollusk-like monster whose reactions can warn the party of danger."},
    {"id":"igris-broadsword","type":"weapon","kind":"broadsword","name":"Igris’ Broadsword","owner":"Blood-Red Commander Igris","anime":"Solo Leveling","accent":"#2a1710","accent2":"#fb923c","sketchfabId":"a915a103299a4613b2235b548a90f81f","sourceUrl":"https://sketchfab.com/3d-models/igris-broadsword-a915a103299a4613b2235b548a90f81f","description":"Igris’ broad, knightly sword cuts through dungeon enemies before and after his shadow conversion."}
  ];
  const arsenalCollator=new Intl.Collator(undefined,{numeric:true,sensitivity:'base'});
  const DISPLAY_ITEMS=[
    ...ITEMS.filter(item=>item.type==='power'),
    ...ITEMS
      .filter(item=>item.type==='weapon')
      .sort((left,right)=>arsenalCollator.compare(left.anime,right.anime)||arsenalCollator.compare(left.name,right.name))
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

  function cardMarkup(item,index,groupKey){
    const media=mediaMeta(item);
    return `<article class="arsenal-card" role="button" tabindex="0" data-arsenal-id="${escapeHtml(item.id)}" data-arsenal-type="${item.type}" data-arsenal-group="${escapeHtml(groupKey)}" data-search="${escapeHtml(`${item.name} ${item.owner} ${item.anime}`.toLowerCase())}" style="--accent:${escapeHtml(item.accent)};--accent2:${escapeHtml(item.accent2)}" aria-label="Open ${escapeHtml(item.name)} showcase">
      ${visualMarkup(item,index)}
      <span class="arsenal-card-copy">
        <span class="arsenal-anime">${escapeHtml(item.anime)}</span>
        <h3>${escapeHtml(item.name)}</h3>
        <span class="arsenal-owner">${escapeHtml(item.owner)}</span>
        <span class="arsenal-card-footer"><span>${media.label}</span><b>${item.type==='power'?'WATCH ATTACK':'INSPECT WEAPON'}</b></span>
      </span>
    </article>`;
  }

  function groupDividerMarkup(title,count,groupKey,type){
    return `<div class="arsenal-anime-divider" data-arsenal-group="${escapeHtml(groupKey)}" data-arsenal-group-type="${escapeHtml(type)}">
      <span>${escapeHtml(title)}</span>
      <small>${count} ${type==='power'?'POWER'+(count===1?'':'S'):'WEAPON'+(count===1?'':'S')}</small>
    </div>`;
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
    const powers=DISPLAY_ITEMS.filter(item=>item.type==='power');
    const weaponGroups=new Map();
    DISPLAY_ITEMS.filter(item=>item.type==='weapon').forEach(item=>{
      if(!weaponGroups.has(item.anime))weaponGroups.set(item.anime,[]);
      weaponGroups.get(item.anime).push(item);
    });
    let displayIndex=0;
    let markup=groupDividerMarkup('Powers & Techniques',powers.length,'power:all','power');
    markup+=powers.map(item=>cardMarkup(item,displayIndex++,'power:all')).join('');
    weaponGroups.forEach((items,anime)=>{
      const groupKey=`weapon:${anime}`;
      markup+=groupDividerMarkup(anime,items.length,groupKey,'weapon');
      markup+=items.map(item=>cardMarkup(item,displayIndex++,groupKey)).join('');
    });
    grid.innerHTML=markup;
    grid.querySelectorAll('[data-arsenal-media-src]').forEach(node=>initializeMedia(node));
  }

  function install(){
    if(document.documentElement.dataset.arsenalV40)return true;
    const app=document.getElementById('app');
    const nav=document.querySelector('.bottom-nav');
    const topbar=document.querySelector('.topbar');
    if(!app||!nav||!topbar)return false;
    document.documentElement.dataset.arsenalV40='1';

    let arsenalStyles=document.querySelector('link[href*="arsenal-v34.css"]');
    if(!arsenalStyles){
      arsenalStyles=document.createElement('link');
      arsenalStyles.rel='stylesheet';
      document.head.appendChild(arsenalStyles);
    }
    arsenalStyles.href='./arsenal-v34.css?release=40';

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
      <div class="arsenal-results-line"><span id="arsenalResultCount"><strong>${totalCount}</strong> entries ready</span><span>Weapons grouped A–Z by anime</span></div>
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
      const cards=[...section.querySelectorAll('.arsenal-card')];
      section.querySelectorAll('.arsenal-anime-divider').forEach(divider=>{
        divider.hidden=!cards.some(card=>card.dataset.arsenalGroup===divider.dataset.arsenalGroup&&!card.hidden);
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
      const index=DISPLAY_ITEMS.findIndex(item=>item.id===card.dataset.arsenalId);
      if(index>=0)openShowcase(DISPLAY_ITEMS[index],index);
    });
    section.querySelector('#arsenalGrid').addEventListener('keydown',event=>{
      if(event.key!=='Enter'&&event.key!==' ')return;
      const card=event.target.closest('[data-arsenal-id]');if(!card)return;
      event.preventDefault();
      const index=DISPLAY_ITEMS.findIndex(item=>item.id===card.dataset.arsenalId);
      if(index>=0)openShowcase(DISPLAY_ITEMS[index],index);
    });
    section.querySelector('#arsenalRandom').addEventListener('click',()=>{
      const visible=[...section.querySelectorAll('.arsenal-card:not([hidden])')];
      if(!visible.length)return;
      const card=visible[Math.floor(Math.random()*visible.length)];
      const index=DISPLAY_ITEMS.findIndex(item=>item.id===card.dataset.arsenalId);
      if(index>=0)openShowcase(DISPLAY_ITEMS[index],index);
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
