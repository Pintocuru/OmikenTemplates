// GetAccurateTime.ts

// 正確な時刻をAPIから取得する関数
export async function getAccurateTime(): Promise<Date> {
 const apiUrl = 'https://3fe5a5f690efc790d4764f1c528a4ebb89fa4168.nict.go.jp/cgi-bin/json';

 try {
  // APIにリクエストを送信
  const response = await fetch(apiUrl);
  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
  }

  // JSONデータを取得
  const data = await response.json();
  const unixTimestamp = data.st; // Unixタイムスタンプを取得

  if (typeof unixTimestamp !== 'number') {
   throw new Error('Invalid timestamp format');
  }

  // Unixタイムスタンプをミリ秒に変換し、UTC時刻を取得
  const utcTime = new Date(unixTimestamp * 1000);

  // JST（日本標準時）に変換（UTC + 9時間）
  const jstTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);

  return jstTime;
 } catch (error) {
  console.error('Error fetching accurate time:', error);
  // エラーが発生した場合はローカル時刻を返す
  return new Date();
 }
}

// 使用例
(async () => {
 const accurateTime = await getAccurateTime();
 console.log('Accurate time (JST):', accurateTime);
})();
