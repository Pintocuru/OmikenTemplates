// src/config.js

const BINGO_CONFIG = {
 // ビンゴの設定
 bingoCard: {
  cardSize: 3, // カードサイズ(3/4/5の3種類)
  // テーマカラー:下記のURL「List of themes」から選んで下さい
  // https://daisyui.com/docs/themes/
  theme: 'light',
  level: 1 // 難易度
 },
 // ビンゴの内容(固定)
 bingoSeeds: [
  {}, // 左上
  {}, // 上
  {}, // 右上
  {}, // 左
  { title: '!Free!', target: 1 }, // 中央
  {}, // 右
  {}, // 左下
  {}, // 下
  {} // 右下
 ],
 // ビンゴの内容(ランダム)
 bingoRandomSeeds: [
  // 配信状況
  { title: '💬初コメ(初級)', target: 1, weight: 15 },
  { title: '💬初コメ(中級)', target: 2, weight: 10 },
  { title: '💬初コメ(上級)', target: 5, weight: 5 },
  { title: '💬初コメ(超級)', target: 10, weight: 1 },
  { title: '📈 チャンネル登録が増える(初級)', target: 1, weight: 15 },
  { title: '📈 チャンネル登録が増える(中級)', target: 3, weight: 10 },
  { title: '📈 チャンネル登録が増える(上級)', target: 10, weight: 5 },
  { title: '📈 チャンネル登録が増える(超級)', target: 30, weight: 1 },
  { title: '💰ギフト(初級)', target: 1, unit: 100, weight: 15 },
  { title: '💰ギフト(中級)', target: 2, unit: 100, weight: 10 },
  { title: '💰ギフト(上級)', target: 5, unit: 100, weight: 5 },
  { title: '💰ギフト(超級)', target: 10, unit: 100, weight: 1 },
  { title: '👥ギフト人数(初級)', target: 1, weight: 10 },
  { title: '👥ギフト人数(中級)', target: 2, weight: 7 },
  { title: '👥ギフト人数(上級)', target: 3, weight: 4 },
  { title: '👥ギフト人数(超級)', target: 5, weight: 1 },
  { title: '🛡メンバーシップ加入(初級)', target: 1, weight: 10 },
  { title: '🛡メンバーシップ加入(中級)', target: 2, weight: 7 },
  { title: '🛡メンバーシップ加入(上級)', target: 3, weight: 4 },
  { title: '🛡メンバーシップ加入(超級)', target: 5, weight: 1 },
  { title: '👀同時視聴者数(初級)', target: 3, weight: 15 },
  { title: '👀同時視聴者数(中級)', target: 5, weight: 10 },
  { title: '👀同時視聴者数(上級)', target: 10, weight: 5 },
  { title: '👀同時視聴者数(超級)', target: 30, weight: 1 },
  { title: '👍高評価(初級)', target: 3, weight: 15 },
  { title: '👍高評価(中級)', target: 5, weight: 10 },
  { title: '👍高評価(上級)', target: 10, weight: 5 },
  { title: '👍高評価(超級)', target: 30, weight: 1 },
  { title: '🔥配信がホットトピックに載る', weight: 5 },
  { title: '⏳配信開始から 30分経過', target: 1, weight: 7 },
  { title: '⏳配信が15分延長される', target: 1, weight: 5 },
  { title: '🚀他の配信者が来訪/レイドする', target: 1, weight: 5 },
  { title: '🤝コラボ配信の約束が決まる', target: 1, weight: 5 },
  { title: '🎶BGMが変わる', target: 1, weight: 1 },
  { title: '🗣同じ話題が 15分以上続く', target: 1, weight: 2 },
  { title: '😲リスナー参加型企画が始まる', target: 1, weight: 2 },
  { title: '📢次回配信の予告がある', target: 1, weight: 1 },

  // 配信者の行動・クセ
  { title: '😂配信者が笑い続ける(秒)', target: 5, weight: 3 },
  { title: '🛑配信者が「ちょっと待って」と言う', target: 3, weight: 2 },
  { title: '😲配信者が「ヤバい」と言う', target: 3, weight: 2 },
  { title: '🤔配信者が「あのー」と言う', target: 3, weight: 3 },
  { title: '😱配信者が悲鳴を上げる', target: 3, weight: 3 },
  { title: '🥤配信者が飲み物を飲む', target: 1, weight: 1 },
  { title: '🌙 深夜配信でテンションが上がる', target: 1, weight: 2 },
  { title: '😍 配信者がキュンとする', target: 1, weight: 2 },
  { title: '🥺 配信者が感動で涙ぐむ', target: 1, weight: 2 },
  { title: '🤯 配信者の脳がバグる', target: 1, weight: 2 },
  { title: '😤 配信者がムキになる', target: 1, weight: 2 },
  { title: '🥵 配信者が暑い/寒いと訴える', target: 1, weight: 2 },
  { title: '🍜 配信者が麺類を啜る', target: 3, weight: 2 },
  { title: '🍙 おにぎりを頬張る', target: 3, weight: 2 },
  { title: '☕ コーヒーを吹き出す', target: 3, weight: 2 },
  { title: '🍬 飴玉を転がす', target: 3, weight: 2 },
  { title: '🍪 お菓子の袋を開ける', target: 1, weight: 1 },
  { title: '🛌 配信者が寝落ちしそうになる', target: 1, weight: 3 },
  { title: '🤸 配信者がストレッチをする', target: 1, weight: 2 },
  { title: '💨 配信者がオナラ', target: 1, weight: 1 },

  // 配信者の雑談内容
  { title: '📝 配信者が視聴者の名前を書く', target: 3, weight: 5 },
  { title: '👀 配信者がリスナーのアイコンを褒める', target: 3, weight: 5 },
  { title: '❓ 配信者が視聴者からの質問に答える', target: 1, weight: 5 },
  { title: '🎯 配信者がリスナーからのリクエストに応える', target: 1, weight: 5 },
  { title: '💬 配信者がチャットの反応に即興で返す', target: 1, weight: 5 },
  { title: '🤝 配信者が視聴者と一緒に悩みを考える', target: 1, weight: 5 },
  { title: '🎉 配信者が視聴者を祝う', target: 1, weight: 5 },
  { title: '🎁 ギフトのお礼タイム', target: 1, weight: 5 },
  { title: '🎤 配信者が歌う', target: 3, weight: 3 },
  { title: '📖 配信者が個人的なエピソードを話す', target: 1, weight: 2 },
  { title: '🍴 配信者が食事/料理の話をする', target: 1, weight: 2 },
  { title: '📰 配信者が時事ネタに触れる', target: 1, weight: 2 },
  { title: '🎨 配信者が趣味について熱く語る', target: 1, weight: 2 },
  { title: '🛒 配信者がオススメを紹介する', target: 1, weight: 2 },
  { title: '🔗 配信者が最近ハマっていることを共有する', target: 1, weight: 2 },
  { title: '💡 配信者が視聴者との思い出話をする', target: 1, weight: 2 },
  { title: '😂 配信者が失敗談を面白おかしく話す', target: 1, weight: 2 },
  { title: '🌸 配信者が季節の話題を取り上げる', target: 1, weight: 2 },
  { title: '🔍 配信者が日常生活の小さな発見を話す', target: 1, weight: 2 },
  { title: '🌙 配信者が昨日見た夢の話をする', target: 1, weight: 2 },
  { title: '👶 配信者が子供時代のエピソードを披露する', target: 1, weight: 2 },
  { title: '🐾 配信者がペット/動物にまつわる話をする', target: 1, weight: 2 },
  { title: '✈️ 配信者が旅行の思い出を語る', target: 1, weight: 2 },
  { title: '💪 配信者が健康/ダイエットの話題に触れる', target: 1, weight: 2 },
  { title: '🧠 配信者が視聴者からのアドバイスを求める', target: 1, weight: 2 },
  { title: '🤣 配信者がくだらないネタを披露する', target: 1, weight: 2 },
  { title: '🎙️ 配信者が変な声モノマネをしてみる', target: 1, weight: 2 },
  { title: '😤 配信者が愚痴/不満を言う', target: 1, weight: 1 },
  { title: '🎭 配信者が指定のキャラクターになりきる', target: 1, weight: 2 },
  { title: '📹 配信者が流行りの動画について語る', target: 1, weight: 2 },
  { title: '🎮 配信者が最新のゲーム/アニメ情報を話す', target: 1, weight: 2 },
  { title: '📱 配信者がSNSで話題のネタを取り上げる', target: 1, weight: 2 },
  { title: '🔬 配信者が新しい発見を報告する', target: 1, weight: 2 },
  { title: '🌟 配信者が将来の夢を熱く語る', target: 1, weight: 2 },
  { title: '🎧 配信者がASMR的な声を出す', target: 1, weight: 2 },
  { title: '🤔 配信者がシリアスな話題に触れる', target: 1, weight: 1 },
  { title: '🤪 配信者がテンション上がって奇声をあげる', target: 1, weight: 1 },
  { title: '😔 配信者が寂しさ/孤独感に触れる', target: 1, weight: 1 },

  // ユーザーコメント
  { title: '🐰視聴者が「かわいい」と言う(人数)', target: 3, weight: 4 },
  { title: '🐶視聴者が「かっこいい」と言う(人数)', target: 3, weight: 4 },
  { title: '❤️視聴者が「好き」と言う(人数)', target: 3, weight: 3 },
  { title: '🌟視聴者が「すごい」と言う(人数)', target: 3, weight: 3 },
  { title: '😂視聴者が「草」「w」と言う(人数)', target: 3, weight: 3 },
  { title: '🙏視聴者が「助かる」と言う(人数)', target: 3, weight: 3 },
  { title: '🥰視聴者が「尊い」と言う(人数)', target: 3, weight: 4 },
  { title: '😭視聴者が「泣ける」と言う(人数)', target: 3, weight: 3 },
  { title: '😇視聴者が「神配信」と讃える(人数)', target: 3, weight: 3 },
  { title: '❗視聴者が「！」だけ送信(人数)', target: 3, weight: 3 },
  { title: '⁉️視聴者が「！？」と驚く(人数)', target: 3, weight: 3 },
  { title: '👀視聴者が「見た」と報告(人数)', target: 3, weight: 3 },
  { title: '🎭視聴者がファンマを使う(人数)', target: 3, weight: 3 },
  { title: '🎨視聴者が絵文字を使う(人数)', target: 3, weight: 3 },
  { title: '📢視聴者がスタンプを使う(人数)', target: 3, weight: 3 },

  // ユーザーコメント(特殊)
  { title: '✏️アンケートで、X票投票される(初級)', target: 3, weight: 15 },
  { title: '✏️アンケートで、X票投票される(中級)', target: 7, weight: 10 },
  { title: '✏️アンケートで、X票投票される(上級)', target: 10, weight: 5 },
  { title: '✏️アンケートで、X票投票される(超級)', target: 30, weight: 1 },
  { title: '🔁同じ絵文字が X人続けて使われる(初級)', target: 3, weight: 4 },
  { title: '🔁同じ絵文字が X人続けて使われる(中級)', target: 5, weight: 2 },
  { title: '🔁同じ絵文字が X人続けて使われる(上級)', target: 7, weight: 1 },
  { title: '🔁同じ絵文字が X人続けて使われる(超級)', target: 10, weight: 1 },
  { title: '📄同じコメントが X人続けて送られる(初級)', target: 3, weight: 4 },
  { title: '📄同じコメントが X人続けて送られる(中級)', target: 5, weight: 2 },
  { title: '📄同じコメントが X人続けて送られる(上級)', target: 7, weight: 1 },
  { title: '📄同じコメントが X人続けて送られる(超級)', target: 10, weight: 1 },
  { title: '✏️リスナーが誤字をする', target: 1, weight: 1 },
  { title: '🎉 視聴者が初コメを歓迎する', target: 1, weight: 5 },
  { title: '🏆 視聴者が配信内クイズに正解する', target: 1, weight: 3 },
  { title: '🔁 視聴者が配信者のセリフをリピートする', target: 1, weight: 3 },
  { title: '🙌 視聴者が配信者のミスを優しく指摘する', target: 1, weight: 2 },
  { title: '💢 視聴者が配信内容にツッコミを入れる', target: 1, weight: 2 },
  { title: '🗂️ 視聴者が過去配信のネタを引用する', target: 1, weight: 2 },
  { title: '🤣視聴者の腹筋が崩壊する(人数)', target: 5, weight: 1 },

  // ユーザー(配信外・自己申告)
  { title: '📸配信者のSNSがフォローされる(初級)', target: 1, weight: 10 },
  { title: '📸配信者のSNSがフォローされる(中級)', target: 2, weight: 7 },
  { title: '📸配信者のSNSがフォローされる(上級)', target: 3, weight: 4 },
  { title: '📸配信者のSNSがフォローされる(超級)', target: 5, weight: 2 },
  { title: '🍡マシュマロが投げられる(初級)', target: 1, weight: 10 },
  { title: '🍡マシュマロが投げられる(中級)', target: 3, weight: 7 },
  { title: '🍡マシュマロが投げられる(上級)', target: 5, weight: 4 },
  { title: '🍡マシュマロが投げられる(超級)', target: 10, weight: 2 },
  { title: '🎬クリップが作られる', target: 1, weight: 3 },
  { title: '📸視聴者が配信のスクショをシェアする', target: 1, weight: 3 },
  { title: '🐦視聴者が配信ハッシュタグでつぶやく', target: 1, weight: 3 },
  { title: '🏷️視聴者が配信者をタグ付きで推薦する', target: 1, weight: 3 },
  { title: '🎨ファンアートがSNSで投稿される', target: 1, weight: 3 },
  { title: '🛡️モデレーターがコメント対応する', weight: 1 }
 ]
};

if (typeof window !== 'undefined') window.BINGO_CONFIG = BINGO_CONFIG;
