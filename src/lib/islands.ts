export type IslandId='main'|'rabbit'|'parrot'|'guinea'|'hamster'|'hedgehog'|'ferret'|'meerkat'|'chinchilla'|'glider';
export type Point={x:number;y:number};
export type Island={id:IslandId;name:string;english:string;number:string;x:number;y:number;width:number;art:string;label:Point;tag:string;description:string;facts:string[]};
export const islands:Island[]=[
  {
    "id": "main",
    "name": "壹伍非犬貓旅宿",
    "english": "THE HEART OF YIWU",
    "number": "01",
    "x": 1450,
    "y": 1050,
    "width": 610,
    "art": "main-island",
    "tag": "讓每一份託付，都被好好照顧",
    "description": "從透明的照護空間，到每天的細心紀錄，讓特別的家人，安心住進溫柔日常。",
    "facts": [
      "透明可參觀的照護空間，讓您安心了解寶貝的生活環境。",
      "每日照片與影片回報，記錄寶貝的住宿日常。",
      "健康觀察、溫控與每日清潔，細心照顧生活細節。",
      "24 小時監視器觀看服務，使用方式依旅宿實際規定。"
    ],
    "label": {
      "x": 110,
      "y": 0
    }
  },
  {
    "id": "rabbit",
    "name": "兔兔區",
    "english": "THE CLOVER MEADOW",
    "number": "02",
    "x": 850,
    "y": 1000,
    "width": 410,
    "art": "rabbit-island",
    "tag": "在牧草香裡，慢慢認識你",
    "description": "低矮的草丘、安心的躲藏屋，還有一口口牧草。把步調放慢，發現長耳朵朋友的日常。",
    "facts": [
      "兔子日常主食是大量牧草，不是紅蘿蔔；也要隨時備妥乾淨飲水。",
      "腸胃健康與環境穩定很重要，留意日常食慾與排便的變化。",
      "兔子常會隱藏身體不舒服的症狀，需要每天細心觀察。",
      "安靜、安全、能躲藏的環境，有助於降低緊迫。"
    ],
    "label": {
      "x": 0,
      "y": 0
    }
  },
  {
    "id": "parrot",
    "name": "鸚鵡區",
    "english": "THE CANOPY RETREAT",
    "number": "03",
    "x": 2040,
    "y": 980,
    "width": 430,
    "art": "parrot-island",
    "tag": "一根棲木，就是探索的開始",
    "description": "穿過葉影，停在自然枝幹上。用啃咬、攀爬與理羽，填滿鳥兒豐富的小日子。",
    "facts": [
      "鸚鵡聰明，需要適當互動，以及啃咬、攀爬與探索的環境豐富化。",
      "不是所有鸚鵡都會學人說話，每隻鳥都有自己的表達方式。",
      "飲食不能只有種子，需要依物種需求均衡搭配。",
      "環境變化可能造成壓力，需留意行為與食慾是否和平常不同。"
    ],
    "label": {
      "x": 0,
      "y": 0
    }
  },
  {
    "id": "guinea",
    "name": "天竺鼠區",
    "english": "THE GENTLE GARDEN",
    "number": "04",
    "x": 390,
    "y": 1050,
    "width": 410,
    "art": "guinea-island",
    "tag": "有地方躲，也有安心相伴的日常",
    "description": "矮草、木棚與小隧道之間，是慢慢聞、慢慢吃的好時光。每一個躲藏角落，都留給喜歡安全感的牠。",
    "facts": [
      "天竺鼠需要從日常飲食補充維生素 C，搭配方式依個別需要安排。",
      "牠們容易緊張；穩定的作息與溫柔的照顧，能帶來更多安心。",
      "躲藏屋與隧道讓牠保有選擇，也有能自在休息的地方。",
      "飲食、飲水與環境清潔，都需要每天細心照顧。"
    ],
    "label": {
      "x": 0,
      "y": 0
    }
  },
  {
    "id": "hamster",
    "name": "倉鼠區",
    "english": "THE LITTLE BURROW",
    "number": "05",
    "x": 1050,
    "y": 1510,
    "width": 420,
    "art": "hamster-island",
    "tag": "小小的日常，也需要自己的空間",
    "description": "木屑下藏著祕密通道，角落有安心的小窩。四個獨立生活區，讓每隻倉鼠依自己的節奏探索。",
    "facts": [
      "倉鼠通常喜歡獨居；這裡以各自獨立的安全空間呈現，不任意混養。",
      "臉頰裡的頰囊可以暫時儲存食物，是牠搬運小收藏的方式。",
      "牠的作息多半與我們不同，休息時請留一份安靜。",
      "足夠墊材、躲藏處與合適的環境豐富化，讓探索更安心。"
    ],
    "label": {
      "x": 0,
      "y": 0
    }
  },
  {
    "id": "hedgehog",
    "name": "刺蝟區",
    "english": "THE LANTERN WOODS",
    "number": "06",
    "x": 1830,
    "y": 1510,
    "width": 430,
    "art": "hedgehog-island",
    "tag": "把燈放柔，留一片安靜的森林",
    "description": "樹根、落葉與暖暖微光，陪伴刺蝟慢慢醒來。保持自然距離，讓嗅聞和休息都有自己的空間。",
    "facts": [
      "刺蝟多為夜行性，白天的安靜休息同樣值得被照顧。",
      "牠對溫度與環境變化較敏感，穩定的照護條件很重要。",
      "探索時溫柔觀察即可，避免頻繁驚擾或強迫互動。",
      "安穩、乾淨又隱密的休息環境，讓牠能放心縮起身子。"
    ],
    "label": {
      "x": 0,
      "y": 0
    }
  },
  {
    "id": "ferret",
    "name": "雪貂區",
    "english": "THE WANDERING TRAIL",
    "number": "07",
    "x": 2510,
    "y": 1050,
    "width": 440,
    "art": "ferret-island",
    "tag": "每一段小通道，都有新的發現",
    "description": "坡道通往遊戲平台，布窩留給一場好眠。把探索區與休息區安排妥當，陪牠自在穿梭、安心停留。",
    "facts": [
      "雪貂活潑、喜歡探索，日常需要適當的活動與互動。",
      "鑽洞與穿梭是牠喜歡的遊戲，通道大小與材質要安全合適。",
      "照護空間需要細心規劃，留意縫隙、邊界與防逃措施。",
      "每天清潔，也觀察食慾、精神與活動變化，照顧藏在細節裡。"
    ],
    "label": {
      "x": 0,
      "y": 0
    }
  },
  {
    "id": "meerkat",
    "name": "狐獴區",
    "english": "THE WATCHFUL DUNES",
    "number": "08",
    "x": 540,
    "y": 510,
    "width": 430,
    "art": "meerkat-island",
    "label": {
      "x": -20,
      "y": 0
    },
    "tag": "站高一點，細細看看這個世界",
    "description": "沙土、岩石和小小的觀察台，留給喜歡看四周的狐獴。洞穴旁有可以退回休息的地方，探索也有安心的邊界。",
    "facts": [
      "狐獴警戒性高，常會留心觀察周圍；安靜靠近，給牠一點適應的時間。",
      "安全又有變化的活動空間，能讓探索、觀察與躲藏各得其所。",
      "牠的需求不同於一般犬貓，需要了解物種特性的照顧方式。",
      "每天細看精神與活動變化，也持續檢查環境設計是否合宜。"
    ]
  },
  {
    "id": "chinchilla",
    "name": "龍貓區",
    "english": "THE SILVER HIGHLANDS",
    "number": "09",
    "x": 1390,
    "y": 440,
    "width": 440,
    "art": "chinchilla-island",
    "label": {
      "x": 0,
      "y": 0
    },
    "tag": "在乾爽的微風裡，安心蓬鬆著",
    "description": "岩台、木製跳台與安靜的小窩，組成柔軟朋友的高地日常。留一個合適的浴沙角落，也留足休息的餘裕。",
    "facts": [
      "龍貓毛量豐厚，對溫度與濕度較敏感，穩定的環境很重要。",
      "乾爽、清潔的生活空間，是日常照護需要細心維持的基礎。",
      "通風與環境穩定要一起留意，也觀察牠和平常不同的表現。",
      "安靜舒適的躲藏與休息區，能讓牠少一點壓力、多一點安心。"
    ]
  },
  {
    "id": "glider",
    "name": "蜜袋鼯區",
    "english": "THE MOONLIT CANOPY",
    "number": "10",
    "x": 2250,
    "y": 500,
    "width": 450,
    "art": "glider-island",
    "label": {
      "x": -65,
      "y": 0
    },
    "tag": "月光放輕，陪牠慢慢探索枝間",
    "description": "樹洞、枝幹和小小棲點，讓蜜袋鼯能攀爬，也能藏進安心的角落。以柔和的節奏陪伴，尊重牠自己的作息。",
    "facts": [
      "蜜袋鼯喜歡攀爬與躲藏，安全的枝幹與棲點能豐富牠的日常。",
      "牠對環境與作息變化較敏感，照顧時盡量維持熟悉而穩定的節奏。",
      "豐富化空間也要保有安全感，探索之外同樣需要隱密的休息處。",
      "每天觀察食慾、活動與休息狀態，把照護放在細緻的小變化裡。"
    ]
  }
];

// One authored ground coordinate system drives artwork, bridge decks and foot contacts.
export const destinations:Record<IslandId,Point>={main:{x:1480,y:1000},rabbit:{x:950,y:915},parrot:{x:2110,y:974},guinea:{x:450,y:970},hamster:{x:1110,y:1420},hedgehog:{x:1900,y:1425},ferret:{x:2460,y:960},meerkat:{x:560,y:410},chinchilla:{x:1410,y:374},glider:{x:2280,y:410}};
const rabbit=[destinations.main,{x:1420,y:997},{x:1330,y:995},{x:1245,y:1015},{x:1025,y:905},destinations.rabbit];
const parrot=[destinations.main,{x:1555,y:982},{x:1635,y:974},{x:1700,y:960},{x:1875,y:955},{x:1980,y:972},destinations.parrot];
const rabbitFront=[destinations.rabbit,{x:920,y:935},{x:810,y:937},{x:700,y:915},{x:665,y:910}];
const guineaLink=[rabbitFront[3],{x:580,y:970},destinations.guinea];
const hamsterLink=[destinations.main,{x:1470,y:1015},{x:1210,y:1400},destinations.hamster];
const hedgehogLink=[destinations.parrot,{x:2150,y:985},{x:1980,y:1390},destinations.hedgehog];
const rightJunction={x:2190,y:970};
const ferretLink=[destinations.parrot,rightJunction,{x:2200,y:975},{x:2370,y:935},destinations.ferret];
const meerkatLink=[rabbitFront[4],{x:720,y:400},{x:650,y:420},destinations.meerkat];
const chinchillaLink=[meerkatLink[1],{x:1210,y:310},{x:1320,y:350},destinations.chinchilla];
const gliderLink=[rightJunction,{x:2250,y:970},{x:2430,y:410},{x:2360,y:430},destinations.glider];
const meerkat=[...rabbit,...rabbitFront.slice(1),...meerkatLink.slice(1)];
export const bridgePaths:Record<Exclude<IslandId,'main'>,Point[]>={rabbit,parrot,guinea:[...rabbit,...rabbitFront.slice(1,4),...guineaLink.slice(1)],hamster:hamsterLink,hedgehog:[...parrot,...hedgehogLink.slice(1)],ferret:[...parrot,...ferretLink.slice(1)],meerkat,chinchilla:[...rabbit,...rabbitFront.slice(1),meerkatLink[1],...chinchillaLink.slice(1)],glider:[...parrot,rightJunction,...gliderLink.slice(1)]};
export const bridgeSpans:Record<string,Point[]>={rabbit:rabbit.slice(3,5),parrot:parrot.slice(3,5),guinea:guineaLink.slice(0,2),hamster:hamsterLink.slice(1,3),hedgehog:hedgehogLink.slice(1,3),ferret:ferretLink.slice(2,4),meerkat:meerkatLink.slice(0,2),chinchilla:chinchillaLink.slice(0,2),glider:gliderLink.slice(1,3)};
export const surfacePaths=[rabbit.slice(0,4),rabbit.slice(4),parrot.slice(0,4),parrot.slice(4),rabbitFront,guineaLink.slice(1),hamsterLink.slice(0,2),hamsterLink.slice(2),hedgehogLink.slice(0,2),hedgehogLink.slice(2),ferretLink.slice(0,3),ferretLink.slice(3),meerkatLink.slice(1),chinchillaLink.slice(1),gliderLink.slice(0,2),gliderLink.slice(2)];
export const world={width:3000,height:1950,center:{x:1450,y:940},bounds:{width:2800,height:1710}};

