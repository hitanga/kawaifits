const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isAiStudio = window.location.hostname.includes('run.app');

export const API_BASE_URL = (!isLocal && !isAiStudio)
  ? 'https://ais-pre-cfqmiv2aku7pyknbzr4m7o-700828003249.asia-southeast1.run.app' 
  : '';
