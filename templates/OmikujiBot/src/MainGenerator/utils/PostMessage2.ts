// src/Modules/api/PostMessage.ts
// 250709_エイリアス変更
import { CharacterEmotionType, CharacterType, PostAction, PostActionWordParty } from '@type/';
import { SendCommentType } from '@public/type';
import { postSystemMessage, postWordParty, postComment } from '@public/common/api/PostOneComme';
import { ServiceAPI } from '@public/common/api/ServiceAPI';
import { SETTINGS } from '@public/common/settings';
import { Service } from '@onecomme.com/onesdk/types/Service';

/**
 * メッセージ投稿を管理するクラス
 * キャラクターのメッセージ投稿とWordParty投稿を統合的に処理
 */
export class PostMessage {
 private readonly serviceAPI: ServiceAPI;
 /** 取得済みサービス一覧（キャッシュ用） */
 private services: Service[] = [];
 /** 作成済みサービスIDのSet（重複作成防止用） */
 private createdServiceIds: Set<string> = new Set();

 /**
  * コンストラクタ
  * @param charactersMap キャラクタープリセットのマップ（キーはcharacterKey）
  */
 constructor(private readonly charactersMap: Record<string, CharacterType> = {}) {
  this.serviceAPI = new ServiceAPI();
 }

 /**
  * 複数の投稿アクションを順次実行
  * @param posts 投稿アクションの配列
  * @throws 投稿処理中にエラーが発生した場合
  */
 async post(posts: PostAction[] | PostActionWordParty[]): Promise<void> {
  try {
   // 枠情報を事前に取得（全投稿で共有）
   await this.refreshServices();

   // 全ての投稿を並行処理で実行
   await Promise.all(
    posts.map(async (post) => {
     const chara = this.getCharacterFromPost(post);
     await this.processPost(post, chara);
    })
   );
  } catch (error) {
   console.error('メッセージ投稿処理に失敗しました:', error);
   throw error;
  }
 }

 /**
  * サービス一覧を取得してキャッシュを更新
  */
 private async refreshServices(): Promise<void> {
  this.services = (await this.serviceAPI.getServices()) ?? [];
 }

 /**
  * 投稿アクションからキャラクター情報を取得
  * @param post 投稿アクション
  * @returns キャラクタープリセット（存在しない場合はundefined）
  */
 private getCharacterFromPost(post: PostAction | PostActionWordParty): CharacterType | undefined {
  // PostActionWordPartyの場合はcharacterKeyが存在しない
  if (!('characterKey' in post)) {
   return undefined;
  }

  const { characterKey } = post;
  return characterKey && characterKey !== '' ? this.charactersMap[characterKey] : undefined;
 }

 /**
  * 個別の投稿処理を実行
  * @param post 投稿アクション
  * @param chara キャラクタープリセット（オプション）
  */
 private async processPost(
  post: PostAction | PostActionWordParty,
  chara?: CharacterType
 ): Promise<void> {
  const { delaySeconds = 0 } = post;

  // キャラクターの枠作成が必要な場合は事前処理
  if (chara && this.shouldCreateService(chara)) {
   await this.ensureServiceExists(chara);
  }

  // メッセージ投稿処理
  if (this.hasMessageContent(post)) {
   await this.postMessage(post, chara, delaySeconds);
  }

  // WordParty投稿処理
  if (this.hasWordParty(post)) {
   postWordParty(post.wordParty, delaySeconds);
  }
 }

 /**
  * キャラクター用のサービス作成が必要かチェック
  * @param chara キャラクタープリセット
  * @returns サービス作成が必要な場合true
  */
 private shouldCreateService(chara: CharacterType): boolean {
  return chara.isIconDisplay && SETTINGS.isCreateService && chara.frameId !== null;
 }

 /**
  * キャラクター用のサービスが存在することを保証
  * 存在しない場合は新規作成し、サービス一覧を更新
  * @param chara キャラクタープリセット
  */
 private async ensureServiceExists(chara: CharacterType): Promise<void> {
  if (!chara.frameId) return;

  // 既存サービスまたは作成済みかチェック
  const serviceExists =
   this.services.some((s) => s.id === chara.frameId) || this.createdServiceIds.has(chara.frameId);

  if (!serviceExists) {
   try {
    const newService = await this.serviceAPI.createService(
     chara.name,
     chara.frameId,
     chara.color.backgroundColor
    );

    if (newService) {
     // 作成成功時はキャッシュを更新
     this.createdServiceIds.add(chara.frameId);
     await this.refreshServices();
    }
   } catch (error) {
    console.error(`サービス作成に失敗: ${chara.name} (${chara.frameId})`, error);
    // サービス作成失敗でも投稿処理は継続
   }
  }
 }

 /**
  * 投稿アクションにメッセージ内容が含まれているかチェック
  * @param post 投稿アクション
  * @returns メッセージ内容がある場合true
  */
 private hasMessageContent(post: PostAction | PostActionWordParty): post is PostAction {
  return (
   'messageContent' in post && post.messageContent !== undefined && post.messageContent !== ''
  );
 }

 /**
  * 投稿アクションにWordParty内容が含まれているかチェック
  * @param post 投稿アクション
  * @returns WordParty内容がある場合true
  */
 private hasWordParty(post: PostAction | PostActionWordParty): boolean {
  return post.wordParty !== undefined && post.wordParty !== '';
 }

 /**
  * メッセージ投稿を実行
  * @param post 投稿アクション
  * @param chara キャラクタープリセット（オプション）
  * @param delaySeconds 遅延秒数
  */
 private async postMessage(
  post: PostAction,
  chara: CharacterType | undefined,
  delaySeconds: number
 ): Promise<void> {
  if (chara && chara.frameId !== '') {
   // キャラクター情報があるなら、わんコメへ投稿
   try {
    const request = this.createCommentRequest(post, chara);
    postComment(request, delaySeconds);
   } catch (error) {
    console.error(`キャラクターコメント投稿エラー: ${chara.name}`, error);
    // エラー時はシステムメッセージとして投稿
    this.postSystemMessage(post.messageContent, delaySeconds);
   }
  } else {
   // キャラ情報がないなら、コメントテスターで投稿
   this.postSystemMessage(post.messageContent, delaySeconds);
  }
 }

 /**
  * システムメッセージとして投稿
  * @param messageContent メッセージ内容
  * @param delaySeconds 遅延秒数
  */
 private postSystemMessage(
  messageContent: string,
  delaySeconds: number,
  botName: string = SETTINGS.BOT_DEFAULT_NAME
 ): void {
  postSystemMessage(messageContent, botName, delaySeconds);
 }

 /**
  * わんコメ投稿用のリクエストオブジェクトを作成
  * @param post 投稿アクション
  * @param chara キャラクタープリセット
  * @returns わんコメ投稿リクエスト
  * @throws frameIdが存在しない場合
  */
 private createCommentRequest(post: PostAction, chara: CharacterType): SendCommentType {
  if (!chara.frameId || chara.frameId === '') {
   throw new Error(`キャラクター「${chara.name}」にframeIdが設定されていません`);
  }
  return {
   service: {
    id: chara.frameId
   },
   comment: {
    // 一意なコメントIDを生成（キャラクターid + タイムスタンプ + ランダム文字列）
    id: `${chara.id}-` + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    userId: SETTINGS.BOT_USER_ID,
    name: chara.displayName || 'おみくじBOT',
    comment: post.messageContent,
    profileImage: this.getCharacterImagePath(chara, post.iconKey),
    badges: [],
    nickname: ' '
   }
  };
 }

 /**
  * キャラクターの画像パスを取得
  * 指定されたアイコンキーに対応する画像、存在しない場合はデフォルト画像を返す
  * @param chara キャラクタープリセット
  * @param iconKey アイコンキー（オプション）
  * @returns 画像のBase64データまたはURL
  */
 private getCharacterImagePath(chara: CharacterType, iconKey?: string): string {
  // iconKeyが指定されていればそれを使用、なければ'default'を使用
  const targetKey = (iconKey ?? 'default') as CharacterEmotionType;
  const charaImage = chara.image?.[targetKey];

  if (charaImage) {
   return charaImage;
  }

  // 指定されたキーの画像がない場合、Defaultキーの画像を試行
  if (targetKey !== 'default' && chara.image?.default) {
   console.warn(
    `キャラクター「${chara.name}」にアイコン「${targetKey}」が見つかりません。デフォルト画像を使用します。`
   );
   return chara.image.default;
  }

  // どの画像も見つからない場合はデフォルト画像
  console.warn(
   `キャラクター「${chara.name}」に画像が設定されていません。システムデフォルト画像を使用します。`
  );
  return DEFAULT_BASE64_IMAGE;
 }
}

/**
 * デフォルト画像（システム共通）
 * 出典: http://flat-icon-design.com/?p=271
 */
const DEFAULT_BASE64_IMAGE =
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVBJREFUeNpi/P37OQMpgImBRECuhj93Hvz/8hWPut8XrkIYLBDVH1OLgQxWA202azNmfS2Gr9+BXGYJ0V9HTv2+eBVIgszuqRM01gdpgJsNNAaIfv36ycbGDuR++PBWQEAYbsnXV6//vX6Nzw/fvn8F6kEW+fL5CxYN/2CMv/8ZMfWwQNzKoCDzi4313amLn378+P3nr3BJ+vdjZ789ec7E8P8nDy+btgrHp2//hYWgocQkIcY7s/uNrPTbL1+BqtmU5Xlc7QQzYsC2MX578fZXdPC3hqJ/IoKIYGX99Vv4yClmJhBXMCMWZLW4KFAbRPZtz0z0ePh24BiLgqyCqBCXgTaHniZEkD82iImHC6gTFPQvX0MEGSFp6d+/fy+fPWeasfiXq+0/WSm4eR+XrGMWF4FbhdAA1/Pr1y9i0xITE5O4lCQbGxsJiY8YPQABBgBWpJPZmpoVPwAAAABJRU5ErkJggg==';
