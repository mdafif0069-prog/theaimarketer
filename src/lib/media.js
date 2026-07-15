// Client-side media validation against the per-platform spec table.
// Server must re-validate on upload (README: "validate client-side AND server-side").

import { MEDIA_SPECS } from '../constants.js';

function kindOf(fileType) {
  if (fileType.indexOf('video') === 0) return 'video';
  if (fileType.indexOf('image') === 0) return 'image';
  return 'doc';
}

function sizeLabel(mb) {
  if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
  if (mb < 1) return Math.max(1, Math.round(mb * 1024)) + ' KB';
  return mb.toFixed(1) + ' MB';
}

// Validate a FileList (or array of File) against a platform's limits.
export function validateFiles(files, platformKey) {
  const spec = MEDIA_SPECS[platformKey];
  return Array.from(files).map((file) => {
    const mb = file.size / 1048576;
    const kind = kindOf(file.type || '');
    const cap = spec[kind];
    const ok = cap > 0 && mb <= cap;
    return {
      id: Date.now() + Math.random(),
      name: file.name,
      kind,
      sizeLabel: sizeLabel(mb),
      ok,
      reason: cap === 0 ? 'Not allowed here' : 'Too large',
    };
  });
}
