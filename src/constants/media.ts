/** 媒体错误码对应的提示信息 */
export const MEDIA_ERROR_MESSAGE: Record<number, string> = {
  1: 'MEDIA_ERR_ABORTED：播放被中止',
  2: 'MEDIA_ERR_NETWORK：网络错误，导致媒体下载失败',
  3: 'MEDIA_ERR_DECODE：解码错误，媒体文件损坏或格式异常',
  4: 'MEDIA_ERR_SRC_NOT_SUPPORTED：媒体源不支持，格式或地址无法播放',
}

/** 播放异常错误码对应的提示信息 */
export const PLAY_EXCEPTION_MESSAGE: Record<string, string> = {
  NotAllowedError: '播放受限：请先点击页面再播放音频',
  NotSupportedError: '不支持播放该音频',
  NetworkError: '网络异常，播放中断',
  NotFoundError: '音频资源不存在',
  AbortError: '播放操作被中断',
  InvalidStateError: '音频状态异常，无法播放',
}

/** 视频播放速率选项 */
export const VIDEO_PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2, 3]

/** 视频播放进度本地存储键名 */
export const VIDEO_PROGRESS_STORAGE_KEY = 'SviAnL_VIDEO_PROGRESS_'

/** 视频播放音量本地存储键名 */
export const VIDEO_VOLUME_STORAGE_KEY = 'video-volume'

/** 视频播放速率本地存储键名 */
export const VIDEO_RATE_STORAGE_KEY = 'video-rate'

/** 图片懒加载灰色占位图*/
export const IMG_LAZY_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f1f1" width="400" height="300"/%3E%3C/svg%3E'

/** 懒加载失败占位图 */
export const IMG_LAZY_ERROR_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f1f1" width="400" height="300"/%3E%3Cg transform="translate(200 150)" fill="none" stroke="%23999" stroke-width="2" stroke-dasharray="6 4"%3E%3Crect x="-40" y="-30" width="80" height="60" rx="4"/%3E%3C/g%3E%3Cg transform="translate(200 150)" stroke="%23666" stroke-width="3" stroke-linecap="round"%3E%3Cpath d="M-12-12l24 24M12-12l-24 24"/%3E%3C/g%3E%3C/svg%3E'

/** 音乐列表 */
export const MUSIC_PLAY_LIST = [
  {
    id: '1',
    title: 'Spring Day',
    artist: 'BTS',
    cover: 'https://picsum.photos/seed/music1/200/200',
    url: 'https://api.zhheo.com/audio/%E5%8B%BF%E5%BF%B5.mp3',
    duration: 393,
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    cover: 'https://picsum.photos/seed/music2/200/200',
    url: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/audio.mp3',
    duration: 192,
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    cover: 'https://picsum.photos/seed/music3/200/200',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 344,
  },
  {
    id: '4',
    title: 'Stay',
    artist: 'The Kid LAROI',
    cover: 'https://picsum.photos/seed/music4/200/200',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 302,
  },
  {
    id: '5',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    cover: 'https://picsum.photos/seed/music5/200/200',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 353,
  },
] as const
