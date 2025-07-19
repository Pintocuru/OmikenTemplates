// [packages] vite.config.ts
import { baseViteConfig } from '../../vite.config';
import path from 'path';
import { defineConfig, mergeConfig } from 'vite';
import type { ViteDevServer } from 'vite';
import fs from 'fs';
import type { IncomingMessage, ServerResponse } from 'http';
import url from 'url';

// APIレスポンスの型定義
interface FileItem {
 name: string;
 modified: string;
}

interface SaveRequest {
 fileName: string;
 data: string;
}

// ホットリロード用設定
export default defineConfig(({ mode }) => {
 return mergeConfig(baseViteConfig(__dirname), {
  root: path.resolve(__dirname),
  publicDir: path.resolve(__dirname, '../../public'),
  resolve: {
   alias: {
    '@type': path.resolve(__dirname, 'src/types/types.ts'),
    '@assets': path.resolve(__dirname, 'assets'),
    '@': path.resolve(__dirname, 'src'),
    '@Config': path.resolve(__dirname, 'src/ConfigMaker'),
    '@ConfigComponents': path.resolve(__dirname, 'src/ConfigMaker/components'),
    '@ConfigScript': path.resolve(__dirname, 'src/ConfigMaker/script')
   }
  },
  server: {
   // Vite組み込みミドルウェアでAPIを処理
   middlewareMode: false,
   configure(app: ViteDevServer['middlewares']): void {
    const configDir: string = path.join(process.cwd(), 'dev-configs');

    // dev-configsディレクトリを作成
    if (!fs.existsSync(configDir)) {
     fs.mkdirSync(configDir, { recursive: true });
    }

    // APIミドルウェア
    app.use(
     '/api/dev-configs',
     (req: IncomingMessage, res: ServerResponse, next: () => void): void => {
      // CORS対応
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
       res.statusCode = 200;
       res.end();
       return;
      }

      const parsedUrl = url.parse(req.url || '', true);
      const pathname = parsedUrl.pathname;
      const method = req.method;

      try {
       // ファイル一覧
       if (method === 'GET' && pathname === '/api/dev-configs/list') {
        const files: FileItem[] = fs
         .readdirSync(configDir)
         .filter((file: string) => file.endsWith('.json'))
         .map((file: string): FileItem => {
          const stats = fs.statSync(path.join(configDir, file));
          return {
           name: file,
           modified: stats.mtime.toISOString()
          };
         })
         .sort(
          (a: FileItem, b: FileItem) =>
           new Date(b.modified).getTime() - new Date(a.modified).getTime()
         );

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(files));
        return;
       }

       // ファイル読み込み
       if (method === 'GET' && pathname?.startsWith('/api/dev-configs/load/')) {
        const fileName = pathname.replace('/api/dev-configs/load/', '');

        if (!fileName.endsWith('.json')) {
         res.statusCode = 400;
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify({ error: 'Invalid file extension' }));
         return;
        }

        const filePath = path.join(configDir, fileName);

        if (!fs.existsSync(filePath)) {
         res.statusCode = 404;
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify({ error: 'File not found' }));
         return;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(data));
        return;
       }

       // ファイル削除
       if (method === 'DELETE' && pathname?.startsWith('/api/dev-configs/delete/')) {
        const fileName = pathname.replace('/api/dev-configs/delete/', '');

        if (!fileName.endsWith('.json')) {
         res.statusCode = 400;
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify({ error: 'Invalid file extension' }));
         return;
        }

        const filePath = path.join(configDir, fileName);

        if (!fs.existsSync(filePath)) {
         res.statusCode = 404;
         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify({ error: 'File not found' }));
         return;
        }

        fs.unlinkSync(filePath);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'File deleted successfully' }));
        return;
       }

       // ファイル保存（POSTデータの処理）
       if (method === 'POST' && pathname === '/api/dev-configs/save') {
        let body = '';

        req.on('data', (chunk) => {
         body += chunk.toString();
        });

        req.on('end', () => {
         try {
          const { fileName, data }: SaveRequest = JSON.parse(body);

          if (!fileName || !data) {
           res.statusCode = 400;
           res.setHeader('Content-Type', 'application/json');
           res.end(JSON.stringify({ error: 'fileName and data are required' }));
           return;
          }

          const filePath = path.join(configDir, fileName);
          fs.writeFileSync(filePath, data);

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ message: 'File saved successfully' }));
         } catch (parseError) {
          console.error('Failed to parse request body:', parseError);
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
         }
        });
        return;
       }

       // ルートが見つからない場合
       next();
      } catch (error) {
       console.error('API Error:', error);
       res.statusCode = 500;
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify({ error: 'Internal server error' }));
      }
     }
    );
   }
  }
 });
});
