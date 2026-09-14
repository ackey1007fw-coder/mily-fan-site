import type { StreamRecap } from "./streamRecaps.ts";

export type SongPostLink = { platform: "youtube" | "tiktok" | "instagram"; url: string };
export type SongPost = { recapId: string; songTitle: string; links: SongPostLink[] };
// Published posts matched to existing song records. No remote media is loaded.
export const streamSongPosts: SongPost[] = [
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=fbVeoKXb3dY"
      },
      {
        "platform": "tiktok",
        "url": "https://www.tiktok.com/@ackeytan_/video/7685359899764641042"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdRFwm1gihj/"
      }
    ],
    "recapId": "2026-09-12-yoru-showroom",
    "songTitle": "ケセラセラ"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=cVLMrx1zuBU"
      },
      {
        "platform": "tiktok",
        "url": "https://www.tiktok.com/@ackeytan_/video/7685320919664938261"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdQ0WVLDBkY/"
      }
    ],
    "recapId": "2026-09-12-yoru-showroom",
    "songTitle": "かわいいだけじゃだめですか？"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=odZi-FTuA_w"
      },
      {
        "platform": "tiktok",
        "url": "https://www.tiktok.com/@ackeytan_/video/7685228084324240657"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdQLJzngOOY/"
      }
    ],
    "recapId": "2026-09-12-yoru-showroom",
    "songTitle": "ちっぽけな勇気"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=w50G9Lg49Aw"
      },
      {
        "platform": "tiktok",
        "url": "https://www.tiktok.com/@ackeytan_/video/7685174093968084231"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdPzLoXiXJS/"
      }
    ],
    "recapId": "2026-09-12-yoru-showroom",
    "songTitle": "明日はきっといい日になる"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=q_pyauMxI54"
      },
      {
        "platform": "tiktok",
        "url": "https://www.tiktok.com/@ackeytan_/video/7684996116441615617"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdOkMDwkTmh/"
      }
    ],
    "recapId": "2026-09-12-yoru-showroom",
    "songTitle": "生まれてはじめて"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=P1uFlurg3Oc"
      },
      {
        "platform": "tiktok",
        "url": "https://www.tiktok.com/@ackeytan_/video/7684965315444362516"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdOWdFWDTWE/"
      }
    ],
    "recapId": "2026-09-12-yoru-showroom",
    "songTitle": "ありがとう"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=jHXS_oB_Bls"
      },
      {
        "platform": "tiktok",
        "url": "https://www.tiktok.com/@ackeytan_/video/7684926818960379137"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdOFY4ijSrI/"
      }
    ],
    "recapId": "2026-09-12-yoru-showroom",
    "songTitle": "超最強"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=sQlNmU68yGQ"
      }
    ],
    "recapId": "2026-09-10-asa-showroom",
    "songTitle": "かわいいだけじゃだめですか？"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=lku15UMeSCU"
      }
    ],
    "recapId": "2026-09-10-asa-showroom",
    "songTitle": "ケセラセラ"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=ouGTY0uWrsI"
      }
    ],
    "recapId": "2026-09-11-yoru-showroom",
    "songTitle": "明日も"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=QkvkRY5oPVk"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdLg3rVggMU/"
      }
    ],
    "recapId": "2026-09-12-asa-showroom",
    "songTitle": "Lovers"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=LddbMSpy52k"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdLgyDuj6sv/"
      }
    ],
    "recapId": "2026-09-12-asa-showroom",
    "songTitle": "好きすぎて滅！"
  },
  {
    "links": [
      {
        "platform": "youtube",
        "url": "https://www.youtube.com/watch?v=CXc1bODLuZY"
      },
      {
        "platform": "instagram",
        "url": "https://www.instagram.com/reel/DdLFz9WCJW1/"
      }
    ],
    "recapId": "2026-09-12-asa-showroom",
    "songTitle": "拝啓、少年よ"
  }
];
export function songPostGroups(recaps: readonly StreamRecap[], posts: readonly SongPost[] = streamSongPosts) {
  return recaps.flatMap(recap => {
    const songs = (recap.songs ?? []).flatMap(song => {
      const post = posts.find(p => p.recapId === recap.id && p.songTitle === song.title);
      return post ? [{ song, links: post.links }] : [];
    });
    return songs.length ? [{ recap, songs }] : [];
  });
}

