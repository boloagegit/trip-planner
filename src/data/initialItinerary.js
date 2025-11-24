export const initialItinerary = [
  {
    date: "2025-12-28",
    dayOfWeek: "週日",
    events: [
      {
        id: '1228-1',
        time: "12:50",
        title: "飛往東京",
        description: "國泰航空 CX450 台北(TPE) -> 成田(NRT) (抵達 16:50)",
        type: "flight",
        fixed: true,
        location: "Taoyuan International Airport",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1228-2',
        time: "18:00",
        title: "飯店入住",
        description: "Comfort Hotel Tokyo Kiyosumi Shirakawa (清澄白河)",
        type: "hotel",
        fixed: true,
        location: "Comfort Hotel Tokyo Kiyosumi Shirakawa",
        image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/49969630.jpg?k=3333333333333333333333333333333333333333333333333333333333333333&o=&hp=1"
      },
      {
        id: '1228-3',
        time: "19:00",
        title: "晚餐 & 周邊探索",
        description: "在清澄白河附近享用晚餐，體驗下町風情",
        type: "food",
        location: "Kiyosumi-shirakawa Station",
        image: "https://images.unsplash.com/photo-1554797589-7241bb691973?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  {
    date: "2025-12-29",
    dayOfWeek: "週一",
    events: [
      {
        id: '1229-1',
        time: "09:00",
        title: "澀谷十字路口",
        description: "參觀忠犬八公像與著名的十字路口",
        type: "sightseeing",
        location: "Shibuya Scramble Crossing",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1229-2',
        time: "11:00",
        title: "原宿竹下通",
        description: "體驗年輕人潮流文化，參觀明治神宮(外圍)",
        type: "sightseeing",
        location: "Takeshita Street",
        image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1229-3',
        time: "13:00",
        title: "表參道午餐",
        description: "在時尚的咖啡廳或餐廳用餐",
        type: "food",
        location: "Omotesando",
        image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1229-4',
        time: "15:00",
        title: "新宿御苑",
        description: "在都市中的綠洲散步放鬆",
        type: "sightseeing",
        location: "Shinjuku Gyoen National Garden",
        image: "https://images.unsplash.com/photo-1588712395893-605837a77265?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1229-5',
        time: "18:00",
        title: "新宿夜生活",
        description: "歌舞伎町或回憶橫丁",
        type: "activity",
        location: "Kabukicho",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  {
    date: "2025-12-30",
    dayOfWeek: "週二",
    events: [
      {
        id: '1230-1',
        time: "09:00",
        title: "築地場外市場",
        description: "享用新鮮海鮮早餐",
        type: "food",
        location: "Tsukiji Outer Market",
        image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1230-2',
        time: "11:00",
        title: "TeamLab Planets",
        description: "豐洲數位藝術美術館體驗",
        type: "activity",
        location: "teamLab Planets TOKYO",
        image: "https://images.unsplash.com/photo-1569420077901-742d442f0d45?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1230-3',
        time: "14:00",
        title: "台場",
        description: "觀賞獨角獸鋼彈與購物",
        type: "sightseeing",
        location: "DiverCity Tokyo Plaza",
        image: "https://images.unsplash.com/photo-1545622783-b3e021430fee?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1230-4',
        time: "18:00",
        title: "銀座購物",
        description: "欣賞奢華建築與購物",
        type: "shopping",
        location: "Ginza",
        image: "https://images.unsplash.com/photo-1565058764617-6f8cc76a6d66?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  {
    date: "2025-12-31",
    dayOfWeek: "週三",
    events: [
      {
        id: '1231-1',
        time: "10:00",
        title: "上野公園",
        description: "參觀博物館或動物園",
        type: "sightseeing",
        location: "Ueno Park",
        image: "https://images.unsplash.com/photo-1570527140771-020891229bb4?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1231-2',
        time: "13:00",
        title: "阿美橫丁",
        description: "感受熱鬧的市場氛圍，採買年貨",
        type: "shopping",
        location: "Ameyoko Shopping District",
        image: "https://images.unsplash.com/photo-1583995029312-582736486027?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1231-3',
        time: "16:00",
        title: "飯店休息",
        description: "為跨年夜養精蓄銳",
        type: "rest",
        location: "Comfort Hotel Tokyo Kiyosumi Shirakawa",
        image: "https://images.unsplash.com/photo-1512918760532-3ea50d24133d?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '1231-4',
        time: "22:00",
        title: "淺草寺跨年",
        description: "參加除夕撞鐘 (除夜の鐘) 儀式",
        type: "special",
        fixed: true,
        location: "Senso-ji",
        image: "https://images.unsplash.com/photo-1583315858023-e2293345ed2d?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  {
    date: "2026-01-01",
    dayOfWeek: "週四",
    events: [
      {
        id: '0101-1',
        time: "09:00",
        title: "增上寺初詣",
        description: "新年參拜，欣賞東京鐵塔美景",
        type: "special",
        fixed: true,
        location: "Zojoji Temple",
        image: "https://images.unsplash.com/photo-1536183932960-37700a75cfa0?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '0101-2',
        time: "12:00",
        title: "東京鐵塔",
        description: "登上展望台俯瞰東京",
        type: "sightseeing",
        location: "Tokyo Tower",
        image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '0101-3',
        time: "15:00",
        title: "皇居",
        description: "新年一般參賀 (視情況) 或參觀東御苑",
        type: "sightseeing",
        location: "Imperial Palace",
        image: "https://images.unsplash.com/photo-1540991830302-00f81f3b913e?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  {
    date: "2026-01-02",
    dayOfWeek: "週五",
    events: [
      {
        id: '0102-1',
        time: "10:00",
        title: "搶購福袋",
        description: "各大百貨公司福袋 (Fukubukuro)",
        type: "shopping",
        location: "Ginza",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '0102-2',
        time: "14:00",
        title: "秋葉原",
        description: "動漫與電器天堂",
        type: "shopping",
        location: "Akihabara",
        image: "https://images.unsplash.com/photo-1580418448014-3c9e55797188?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '0102-3',
        time: "18:00",
        title: "最後的晚餐",
        description: "享用燒肉或壽司大餐",
        type: "food",
        location: "Tokyo",
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  {
    date: "2026-01-03",
    dayOfWeek: "週六",
    events: [
      {
        id: '0103-1',
        time: "10:00",
        title: "退房",
        description: "寄放行李或前往車站",
        type: "hotel",
        fixed: true,
        location: "Comfort Hotel Tokyo Kiyosumi Shirakawa",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '0103-2',
        time: "11:00",
        title: "最後採買",
        description: "東京車站一番街",
        type: "shopping",
        location: "Tokyo Station",
        image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '0103-3',
        time: "13:00",
        title: "前往機場",
        description: "搭乘 Skyliner / N'EX",
        type: "transport",
        location: "Narita International Airport",
        image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: '0103-4',
        time: "15:30",
        title: "搭機返台",
        description: "國泰航空 CX451 成田(NRT) -> 台北(TPE) (抵達 18:40)",
        type: "flight",
        fixed: true,
        location: "Narita International Airport",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  }
];
