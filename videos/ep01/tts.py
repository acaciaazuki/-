#!/usr/bin/env python3
"""Episode 01 旁白產生器：讀取 script.json，輸出各場景音訊 audio/<id>.wav 與 audio/manifest.json。

引擎（--engine）：
  auto      依序嘗試 edge-tts（需網路，免 API key）、pyttsx3、espeak-ng；都不可用則 silent
  edge      edge-tts（pip install edge-tts；預設聲音 zh-TW-HsiaoChenNeural）
  pyttsx3   本機 pyttsx3
  espeak    本機 espeak-ng（品質僅供試聽）
  silent    依場景長度產生靜音 WAV（placeholder，無需任何服務）
  --dry-run 只列出計畫，不寫檔

不含任何金鑰；正式音檔請見 README「替換正式音檔」。
"""
import argparse
import json
import shutil
import subprocess
import sys
import wave
from pathlib import Path

HERE = Path(__file__).resolve().parent
SAMPLE_RATE = 24000


def load_script(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not data.get("scenes"):
        raise SystemExit("script.json 缺少 scenes")
    return data


def write_silence(path, seconds):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(b"\x00\x00" * int(SAMPLE_RATE * seconds))


def to_wav(src, dst):
    if not shutil.which("ffmpeg"):
        raise RuntimeError("需要 ffmpeg 轉成 WAV")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-ar", str(SAMPLE_RATE), "-ac", "1", str(dst)], check=True)


def synth_edge(text, dst, voice):
    import asyncio
    import edge_tts  # noqa: PLC0415

    tmp = dst.with_suffix(".mp3")
    asyncio.run(edge_tts.Communicate(text, voice).save(str(tmp)))
    to_wav(tmp, dst)
    tmp.unlink()


def synth_pyttsx3(text, dst, voice):
    import pyttsx3  # noqa: PLC0415

    eng = pyttsx3.init()
    eng.save_to_file(text, str(dst))
    eng.runAndWait()


def synth_espeak(text, dst, voice):
    exe = shutil.which("espeak-ng") or shutil.which("espeak")
    if not exe:
        raise RuntimeError("找不到 espeak-ng")
    subprocess.run([exe, "-v", "cmn", "-w", str(dst), text], check=True)


def available(engine):
    if engine == "edge":
        try:
            import edge_tts  # noqa: F401, PLC0415
            return True
        except ImportError:
            return False
    if engine == "pyttsx3":
        try:
            import pyttsx3  # noqa: F401, PLC0415
            return True
        except ImportError:
            return False
    if engine == "espeak":
        return bool(shutil.which("espeak-ng") or shutil.which("espeak"))
    return engine == "silent"


SYNTH = {"edge": synth_edge, "pyttsx3": synth_pyttsx3, "espeak": synth_espeak}


def pick_engine(requested):
    if requested != "auto":
        if not available(requested):
            print(f"[警告] 引擎 {requested} 不可用，改用 silent", file=sys.stderr)
            return "silent"
        return requested
    for name in ("edge", "pyttsx3", "espeak"):
        if available(name):
            return name
    return "silent"


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--script", default=str(HERE / "script.json"))
    p.add_argument("--out-dir", default=str(HERE / "audio"))
    p.add_argument("--engine", choices=["auto", "edge", "pyttsx3", "espeak", "silent"], default="auto")
    p.add_argument("--voice", default="zh-TW-HsiaoChenNeural")
    p.add_argument("--dry-run", action="store_true", help="只顯示計畫，不寫檔")
    a = p.parse_args(argv)

    data = load_script(a.script)
    engine = pick_engine(a.engine)
    out = Path(a.out_dir)
    print(f"引擎：{engine}；場景數：{len(data['scenes'])}；輸出：{out}")
    manifest = {"engine": engine, "placeholder": engine == "silent", "scenes": []}

    for s in data["scenes"]:
        dur = s["endSec"] - s["startSec"]
        dst = out / f"{s['id']}.wav"
        print(f"  {s['id']} {dur:g}s -> {dst.name}：{s['narration'][:24]}…")
        if not a.dry_run:
            out.mkdir(parents=True, exist_ok=True)
            if engine == "silent":
                write_silence(dst, dur)
            else:
                SYNTH[engine](s["narration"], dst, a.voice)
        manifest["scenes"].append({"id": s["id"], "file": dst.name, "durationSec": dur})

    if a.dry_run:
        print("dry-run：未寫入任何檔案")
        return 0
    (out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if engine != "silent" and shutil.which("ffmpeg"):
        # 依場景起點對齊，合併為 voiceover_zh.wav（供 npm run ep01:render 使用）
        cmd = ["ffmpeg", "-y", "-v", "error"]
        for s in data["scenes"]:
            cmd += ["-i", str(out / f"{s['id']}.wav")]
        delays = ";".join(f"[{i}:a]adelay={int(s['startSec'] * 1000)}:all=1[a{i}]" for i, s in enumerate(data["scenes"]))
        mix = "".join(f"[a{i}]" for i in range(len(data["scenes"])))
        cmd += ["-filter_complex", f"{delays};{mix}amix=inputs={len(data['scenes'])}:normalize=0[o]", "-map", "[o]", str(out / "voiceover_zh.wav")]
        subprocess.run(cmd, check=True)
        print("已合併 voiceover_zh.wav")
    elif engine == "silent":
        print("silent 為 placeholder：未產生 voiceover_zh.wav，影片將不含旁白。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
