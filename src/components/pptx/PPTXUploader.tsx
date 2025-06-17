import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, Download, Eye } from 'lucide-react';
import { convertPPTXWithFallback } from '@/utils/pptxPreviewConverter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function PPTXUploader() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pptx')) {
      setError('PPTXファイルを選択してください');
      return;
    }

    setError(null);
    setIsLoading(true);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const html = await convertPPTXWithFallback(arrayBuffer);
      setHtmlContent(html);
    } catch (err) {
      console.error('PPTX変換エラー:', err);
      setError('PPTXファイルの変換に失敗しました。ファイルが破損していないか確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadHTML = () => {
    if (!htmlContent || !fileName) return;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.pptx', '.html');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetUploader = () => {
    setHtmlContent(null);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto pptx-uploader">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          PPTX → HTML 変換
        </CardTitle>
        <CardDescription>
          PowerPointファイル(.pptx)をHTMLファイルに変換します (pptx-preview.js使用)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!htmlContent ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">PPTXファイルをアップロード</p>
            <p className="text-gray-500 mb-4">
              クリックしてファイルを選択するか、ドラッグ&ドロップしてください
            </p>
            <Button 
              onClick={handleUploadClick} 
              disabled={isLoading}
              className="mb-2"
            >
              {isLoading ? '変換中...' : 'ファイルを選択'}
            </Button>
            <p className="text-sm text-gray-400">
              サポート形式: .pptx (PowerPoint 2007以降)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">変換完了</p>
                  <p className="text-sm text-green-600">{fileName}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        プレビュー
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle>HTMLプレビュー - {fileName}</DialogTitle>
                      </DialogHeader>
                      <div 
                        className="border rounded-lg p-4"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button onClick={handleDownloadHTML} size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    HTMLダウンロード
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={resetUploader}
              className="w-full"
            >
              別のファイルを変換
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• pptx-preview.jsによる高品質な変換</p>
          <p>• テキスト、図形、画像、レイアウトをサポート</p>
          <p>• PowerPointの表示により近い結果を提供</p>
          <p>• 変換に失敗した場合は従来の方式にフォールバック</p>
        </div>
      </CardContent>
    </Card>
  );
}