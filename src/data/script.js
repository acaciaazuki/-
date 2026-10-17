import {VIDEO_FPS} from '../videoConfig.js';

export const narratorStyle = '約 20 歲女性、台灣口音、活潑自信';

export const fullVoiceoverText = `你有沒有過這種時候？手機明明拿在手上，卻一直找手機？
偶爾忘記，通常很正常。但失智症，不只是單純記性變差。
失智症比較像是大腦系統持續出現問題，讓記憶、思考、溝通，甚至日常生活都受到影響。
例如，常常忘記最近發生的事、東西放到奇怪的地方，或在熟悉的地方突然不知道怎麼走。
最常見的原因是阿茲海默症，但失智症其實是一大類狀況的總稱，不只有一種原因。
而且，失智症不是老化的必然結果。年紀變大，不代表一定會失智。
如果身邊的人出現持續而明顯的變化，先別急著責怪或貼標籤，耐心陪伴，也可以鼓勵他和家人尋求專業評估。
記住三件事：失智不只是健忘、不是正常老化、也不代表一個人的價值消失。多一點理解，就能多一點支持！`;

export const scenes = [
  {
    id: 's1',
    startSec: 0,
    endSec: 6,
    title: '你也常常忘東忘西嗎？',
    subtitle: '手機明明在手上，卻一直找手機？',
    points: ['生活小瞬間', '很多人都遇過'],
    icon: '📱',
    highlight: '忘東忘西'
  },
  {
    id: 's2',
    startSec: 6,
    endSec: 13,
    title: '失智症不只是偶爾忘記',
    subtitle: '大腦像手機系統，問題是持續出現。',
    points: ['偶爾忘記常見', '持續退化要留意'],
    icon: '🧠',
    highlight: '不只是偶爾忘記'
  },
  {
    id: 's3',
    startSec: 13,
    endSec: 21,
    title: '像系統一直卡頓',
    subtitle: '記憶、思考、溝通、生活都可能受影響。',
    points: ['記憶', '思考', '溝通', '日常生活'],
    icon: '⚙️',
    highlight: '持續卡頓'
  },
  {
    id: 's4',
    startSec: 21,
    endSec: 28,
    title: '常見變化（溫和理解）',
    subtitle: '忘近期、放錯物、在熟悉處迷路。',
    points: ['先理解，不嘲笑', '觀察是否持續'],
    icon: '🧭',
    highlight: '溫和陪伴'
  },
  {
    id: 's5',
    startSec: 28,
    endSec: 35,
    title: '阿茲海默症是常見原因',
    subtitle: '但失智症是很多狀況的總稱。',
    points: ['不只一種原因', '需要專業判斷'],
    icon: '🧩',
    highlight: '一大類狀況'
  },
  {
    id: 's6',
    startSec: 35,
    endSec: 42,
    title: '正常老化 ≠ 失智症',
    subtitle: '年紀變大，不代表一定會失智。',
    points: ['失智不是必然', '可及早關心'],
    icon: '🌱',
    highlight: '不是老化必然'
  },
  {
    id: 's7',
    startSec: 42,
    endSec: 51,
    title: '先陪伴，再求助',
    subtitle: '看照片、耐心溝通，鼓勵專業評估。',
    points: ['避免責怪與貼標籤', '和家人一起面對'],
    icon: '🤝',
    highlight: '尋求專業評估'
  },
  {
    id: 's8',
    startSec: 51,
    endSec: 60,
    title: '記住三件事',
    subtitle: '失智不只是健忘，不是正常老化，也不減損人的價值。',
    points: ['多一點理解', '就能多一點支持'],
    icon: '💛',
    highlight: '理解與支持'
  }
].map((scene) => ({
  ...scene,
  startFrame: Math.round(scene.startSec * VIDEO_FPS),
  endFrame: Math.round(scene.endSec * VIDEO_FPS)
}));
