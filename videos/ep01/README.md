# Episode 01｜什麼是失智症？（繁體中文）

高中生衛教短片：9:16 直式、1080×1920、30 fps、60 秒（1800 frames）、8 個連續場景。動畫沿用根目錄的 Remotion 專案（Composition `DementiaExplainer`）。

> **醫療免責聲明**：本影片僅供一般衛教，不能取代醫師診斷或治療。若對自己或家人的記憶與生活功能有持續且明顯的擔憂，請諮詢神經內科、精神科或老年醫學等專業醫療人員。
> **版權**：腳本與動畫為原創；自行替換的旁白、音樂、圖像須確認授權。

## 目錄

| 路徑 | 說明 |
|---|---|
| `script.json` | 單一資料來源：metadata、時間軸、旁白、字幕、關鍵字、畫面與轉場描述 |
| `index.html.tpl` / `index.html` | 分鏡預覽（`index.html` 由 tpl + script.json 產生，內嵌資料，無建置依賴） |
| `stills/sheet_zh.png` | 8 場景 still sheet（4×2，1440×1280） |
| `tts.py` | 旁白產生器（有 fallback） |
| `audio/` | 場景音訊與 `voiceover_zh.wav` 輸出位置 |
| `out/ep01_zh.mp4` | 渲染成品 |

## 安裝

```bash
npm install            # Node 18+；Python 3 僅用標準庫；ffmpeg 用於 sheet 與音訊
```

## 預覽分鏡

直接用瀏覽器開啟 `videos/ep01/index.html`（file:// 即可）。支援播放／暫停／重播、時間軸拖曳、場景切換、字幕與關鍵字動畫，並可選用瀏覽器內建語音朗讀。修改 `script.json` 後執行 `npm run ep01:html` 重新產生（測試會檢查是否同步）。

## Still sheet

```bash
npm run ep01:stills    # 以 Remotion 取每場景中點畫格，再用 ffmpeg xstack 拼成 stills/sheet_zh.png
```

需要 Chromium：預設自動偵測 `/opt/pw-browsers` 下的 headless shell，或以 `REMOTION_BROWSER=/path/to/chrome-headless-shell` 指定；否則 Remotion 會自行下載。

## TTS

```bash
npm run ep01:tts -- --dry-run          # 只列出計畫
npm run ep01:tts                       # auto：edge-tts → pyttsx3 → espeak-ng → silent
npm run ep01:tts -- --engine silent    # 靜音 placeholder，無需網路/金鑰
npm run ep01:tts -- --engine edge --voice zh-TW-HsiaoChenNeural   # 需 pip install edge-tts 與網路
```

輸出 `audio/<場景id>.wav` 與 `manifest.json`。真實引擎另會依場景起點合併為 `audio/voiceover_zh.wav`；`silent` 只是 placeholder，不會產生 `voiceover_zh.wav`。程式不含任何金鑰。

## 替換正式音檔

把已授權的完整旁白（60 秒、單一檔案）存為 `videos/ep01/audio/voiceover_zh.wav`，再執行 `npm run ep01:render`；渲染腳本偵測到該檔會自動混入（暫存於 `public/audio/`，結束後刪除）。加 `-- --no-audio` 可強制不含旁白。目標聲音風格：約 20 歲女性、台灣口音、活潑自信。

## 渲染 MP4

```bash
npm run ep01:render    # → videos/ep01/out/ep01_zh.mp4（H.264, 1080x1920, 30fps, 60s）
```

## 驗證

```bash
npm test               # script.json 結構、時間軸連續、HTML 控制項/同步、tts.py 語法與 dry-run、PNG/MP4 媒體資訊
npm run typecheck
```

## 目前狀態（如實記錄）

- 已產生並驗證：`script.json`、`index.html`（headless Chromium 載入成功並渲染第一場景）、`stills/sheet_zh.png`（1440×1280 PNG）、`out/ep01_zh.mp4`（h264 1080×1920、30fps、60.0 秒、約 7 MB）。
- **MP4 目前沒有真實旁白**：環境無 TTS 服務／引擎，MP4 內的 AAC 軌為 Remotion 預設的靜音軌。`tts.py --engine silent` 僅產生靜音 placeholder。取得正式旁白後請依上節替換並重新渲染。
- 預覽 HTML 的朗讀功能依賴瀏覽器內建 zh-TW 語音，各平台品質不一，僅供試聽。
- 字幕為畫面內嵌（burned-in），未另輸出 SRT。
- 未執行 CodeQL / 外部 code review 工作流程（本環境無此權限）。
