// server/dev-api.ts
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 型定義
interface FileItem {
 name: string;
 modified: string;
}

interface SaveRequest {
 fileName: string;
 data: string;
}

// 設定ファイルの保存ディレクトリ
const CONFIG_DIR = path.join(__dirname, 'dev-configs');

let server: Server | null = null;

// ディレクトリを作成（存在しない場合）
async function ensureConfigDir(): Promise<void> {
 try {
  await fs.access(CONFIG_DIR);
 } catch {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  console.log('📁 Created dev-configs directory:', CONFIG_DIR);
 }
}

// ファイル一覧を取得
async function getFileList(): Promise<FileItem[]> {
 try {
  await ensureConfigDir();
  const files = await fs.readdir(CONFIG_DIR);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  const fileDetails = await Promise.all(
   jsonFiles.map(async (file): Promise<FileItem> => {
    const filePath = path.join(CONFIG_DIR, file);
    const stats = await fs.stat(filePath);
    return {
     name: file,
     modified: stats.mtime.toISOString()
    };
   })
  );

  // 更新日時で降順ソート
  return fileDetails.sort(
   (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );
 } catch (error) {
  console.error('Error getting file list:', error);
  return [];
 }
}

// ファイルを保存
async function saveFile(fileName: string, data: string): Promise<void> {
 await ensureConfigDir();
 const filePath = path.join(CONFIG_DIR, fileName);
 await fs.writeFile(filePath, data, 'utf8');
}

// ファイルを読み込み
async function loadFile(fileName: string): Promise<any> {
 const filePath = path.join(CONFIG_DIR, fileName);
 const data = await fs.readFile(filePath, 'utf8');
 return JSON.parse(data);
}

// ファイルを削除
async function deleteFile(fileName: string): Promise<void> {
 const filePath = path.join(CONFIG_DIR, fileName);
 await fs.unlink(filePath);
}

// 開発用APIサーバーを起動
export function startDevApiServer(): Server | null {
 // 既にサーバーが起動している場合はスキップ
 if (server) {
  console.log('⚠️ Dev API server is already running');
  return server;
 }

 const app: Application = express();
 const port = 3001;

 // ミドルウェア
 app.use(cors());
 app.use(express.json({ limit: '10mb' }));

 // ログ用ミドルウェア
 app.use((req: Request, res: Response, next) => {
  console.log(`[DEV API] ${req.method} ${req.path}`);
  next();
 });

 // ファイル一覧取得
 app.get('/api/dev-configs/list', async (req: Request, res: Response) => {
  try {
   const files = await getFileList();
   res.json(files);
  } catch (error) {
   console.error('List files error:', error);
   res.status(500).json({ error: 'Failed to list files' });
  }
 });

 // ファイル保存
 app.post('/api/dev-configs/save', async (req: Request<{}, {}, SaveRequest>, res: Response) => {
  try {
   const { fileName, data } = req.body;

   if (!fileName || !data) {
    return res.status(400).json({ error: 'fileName and data are required' });
   }

   // ファイル名の検証
   if (!/^[\w\-. ]+\.json$/.test(fileName)) {
    return res.status(400).json({ error: 'Invalid file name' });
   }

   await saveFile(fileName, data);
   console.log(`💾 Saved config file: ${fileName}`);
   res.json({ message: 'File saved successfully', fileName });
  } catch (error) {
   console.error('Save file error:', error);
   res.status(500).json({ error: 'Failed to save file' });
  }
 });

 // ファイル読み込み
 app.get('/api/dev-configs/load/:fileName', async (req: Request, res: Response) => {
  try {
   const { fileName } = req.params;

   // ファイル名の検証
   if (!/^[\w\-. ]+\.json$/.test(fileName)) {
    return res.status(400).json({ error: 'Invalid file name' });
   }

   const data = await loadFile(fileName);
   console.log(`📖 Loaded config file: ${fileName}`);
   res.json(data);
  } catch (error: any) {
   console.error('Load file error:', error);
   if (error.code === 'ENOENT') {
    res.status(404).json({ error: 'File not found' });
   } else {
    res.status(500).json({ error: 'Failed to load file' });
   }
  }
 });

 // ファイル削除
 app.delete('/api/dev-configs/delete/:fileName', async (req: Request, res: Response) => {
  try {
   const { fileName } = req.params;

   // ファイル名の検証
   if (!/^[\w\-. ]+\.json$/.test(fileName)) {
    return res.status(400).json({ error: 'Invalid file name' });
   }

   await deleteFile(fileName);
   console.log(`🗑️ Deleted config file: ${fileName}`);
   res.json({ message: 'File deleted successfully', fileName });
  } catch (error: any) {
   console.error('Delete file error:', error);
   if (error.code === 'ENOENT') {
    res.status(404).json({ error: 'File not found' });
   } else {
    res.status(500).json({ error: 'Failed to delete file' });
   }
  }
 });

 // ヘルスチェック
 app.get('/api/dev-configs/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Dev API server is running' });
 });

 // サーバー起動
 server = app.listen(port, () => {
  console.log(`🚀 Dev API server running on http://localhost:${port}`);
  console.log(`📁 Config files directory: ${CONFIG_DIR}`);
 });

 // プロセス終了時の処理
 process.on('SIGTERM', () => {
  if (server) {
   server.close();
   server = null;
  }
 });

 return server;
}

// サーバーを停止
export function stopDevApiServer(): void {
 if (server) {
  server.close();
  server = null;
  console.log('🛑 Dev API server stopped');
 }
}
