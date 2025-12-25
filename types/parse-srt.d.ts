declare module 'parse-srt' {
  interface SubtitleEntry {
    id: number;
    start: number;
    end: number;
    text: string;
  }

  function parseSRT(srtContent: string): SubtitleEntry[];
  export default parseSRT;
}