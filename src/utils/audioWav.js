/**
 * Converts a recorded audio Blob (webm/ogg/mp4...) into a mono 16 kHz WAV Blob.
 * Keeps uploads small and guarantees a format the AI evaluation accepts,
 * without any server-side transcoding.
 */
const TARGET_SAMPLE_RATE = 16000;

export const blobToWav = async (blob, sampleRate = TARGET_SAMPLE_RATE) => {
  const arrayBuffer = await blob.arrayBuffer();

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const decodeCtx = new AudioCtx();
  let decoded;
  try {
    decoded = await decodeCtx.decodeAudioData(arrayBuffer);
  } finally {
    await decodeCtx.close();
  }

  const length = Math.ceil(decoded.duration * sampleRate);
  const OfflineAudioCtx =
    window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OfflineAudioCtx) {
    throw new Error("Audio conversion is not supported by this browser");
  }
  const offlineCtx = new OfflineAudioCtx(1, length, sampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = decoded;
  source.connect(offlineCtx.destination);
  source.start(0);

  const rendered = await offlineCtx.startRendering();
  return encodeWav(rendered.getChannelData(0), sampleRate);
};

const encodeWav = (samples, sampleRate) => {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i += 1) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i += 1, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([view], { type: "audio/wav" });
};
