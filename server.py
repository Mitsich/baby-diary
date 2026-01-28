#!/usr/bin/env python3
"""
Baby Diary app - Multi-user server
Serves static files and handles JSON save requests per user
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
import uuid
from pathlib import Path

DATA_DIR = Path(__file__).parent / 'data'
DATA_DIR.mkdir(exist_ok=True)

class BabyDiaryHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        """Handle POST requests to save JSON data"""
        if self.path == '/save':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            try:
                data = json.loads(body.decode('utf-8'))
                user_id = data.get('userId')
                
                if not user_id:
                    raise ValueError('userId is required')
                
                # Create user directory
                user_dir = DATA_DIR / user_id
                user_dir.mkdir(exist_ok=True)
                
                # Save to user-specific file
                file_path = user_dir / 'diary.json'
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                print(f'✅ [{user_id[:8]}...] Сохранено {len(data.get("events", []))} событий в {file_path}')
                
                # Send success response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'ok'}).encode())
                
            except Exception as e:
                print(f'❌ Ошибка сохранения: {e}')
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        
        elif self.path == '/load':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            try:
                data = json.loads(body.decode('utf-8'))
                user_id = data.get('userId')
                
                if not user_id:
                    raise ValueError('userId is required')
                
                # Load user-specific file
                file_path = DATA_DIR / user_id / 'diary.json'
                
                if file_path.exists():
                    with open(file_path, 'r', encoding='utf-8') as f:
                        user_data = json.load(f)
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(user_data).encode())
                    print(f'✅ [{user_id[:8]}...] Загружено {len(user_data.get("events", []))} событий')
                else:
                    # No data for this user yet
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    response = {
                        'userId': user_id,
                        'events': [],
                        'notes': [],
                        'exportDate': '',
                        'version': '1.0'
                    }
                    self.wfile.write(json.dumps(response).encode())
                    print(f'📝 [{user_id[:8]}...] Новый пользователь')
                    
            except Exception as e:
                print(f'❌ Ошибка загрузки: {e}')
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        
        elif self.path == '/delete':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            try:
                data = json.loads(body.decode('utf-8'))
                user_id = data.get('userId')
                
                if not user_id:
                    raise ValueError('userId is required')
                
                # Delete user directory
                user_dir = DATA_DIR / user_id
                
                if user_dir.exists():
                    import shutil
                    shutil.rmtree(user_dir)
                    
                    print(f'🗑️ [{user_id[:8]}...] Аккаунт удален вместе со всеми данными')
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'ok', 'message': 'Account deleted'}).encode())
                else:
                    raise ValueError('User directory not found')
                    
            except Exception as e:
                print(f'❌ Ошибка удаления аккаунта: {e}')
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_DELETE(self):
        """Handle DELETE requests (for compatibility)"""
        self.do_POST()


    def do_GET(self):
        """Serve static files"""
        if self.path == '/' or self.path == '/index.html':
            self.path = '/index.html'
        
        return super().do_GET()

    def end_headers(self):
        """Add CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    os.chdir(Path(__file__).parent)
    
    server = HTTPServer(('0.0.0.0', 8000), BabyDiaryHandler)
    print('🚀 Сервер запущен на http://0.0.0.0:8000')
    print('📁 Папка приложения:', Path(__file__).parent)
    print('� Режим: Мультипользовательский')
    print('💾 Данные пользователей в папке: data/')
    print('�🛑 Для остановки нажми Ctrl+C')
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n✋ Сервер остановлен')
        server.server_close()
