import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Copy, Check, Maximize2, Minimize2, Code, Eye, Sparkles } from 'lucide-react';

interface CodePlaygroundProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  height?: string;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialHtml = '<h1>مرحباً بك في نواة كود!</h1>\n<p>اكتب كودك واشاهد النتيجة مباشرة.</p>',
  initialCss = 'h1 {\n  color: #4355E8;\n  font-family: sans-serif;\n}\np {\n  color: #0E9F9A;\n}',
  initialJs = '// اكتب كود JavaScript هنا\nconsole.log("نواة كود جاهزة!");',
  height = 'h-[460px]'
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'preview'>('html');
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);

  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate Sandboxed Iframe Output
  const generateSrcDoc = () => {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 1rem;
              margin: 0;
              background-color: transparent;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;
  };

  const [srcDoc, setSrcDoc] = useState(generateSrcDoc());

  const handleRun = () => {
    setSrcDoc(generateSrcDoc());
  };

  const handleReset = () => {
    setHtml(initialHtml);
    setCss(initialCss);
    setJs(initialJs);
    setSrcDoc(
      `<!DOCTYPE html><html dir="rtl"><head><style>${initialCss}</style></head><body>${initialHtml}<script>${initialJs}</script></body></html>`
    );
  };

  const handleCopy = () => {
    let textToCopy = html;
    if (activeTab === 'css') textToCopy = css;
    if (activeTab === 'js') textToCopy = js;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`border border-bdr rounded-2xl overflow-hidden bg-slate-950 text-slate-100 shadow-md flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : height
      }`}
    >
      {/* Playground Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2">
        {/* Editor Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'html'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'css'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'js'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            JS
          </button>

          {/* Mobile Preview Toggle Tab */}
          <button
            onClick={() => setActiveTab('preview')}
            className={`md:hidden px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'preview'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة</span>
          </button>
        </div>

        {/* Playground Toolbar Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="تشغيل الكود وتحديث النتيجة"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>تشغيل الكود</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="إعادة التعيين للكود الأصلي"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="نسخ الكود الحالي"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
            title={isFullscreen ? 'إلغاء التكبير' : 'تكبير المحرر'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Panel */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800 min-h-0 overflow-hidden">
        {/* Editor Side (LTR) */}
        <div
          className={`flex-1 flex flex-col bg-slate-950 p-3 min-h-0 ${
            activeTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeTab === 'html' && (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="<!-- اكتب HTML هنا -->"
              dir="ltr"
              spellCheck="false"
              className="w-full flex-1 bg-transparent text-slate-100 font-mono text-sm resize-none focus:outline-none leading-relaxed code-editor"
            />
          )}

          {activeTab === 'css' && (
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              placeholder="/* اكتب CSS هنا */"
              dir="ltr"
              spellCheck="false"
              className="w-full flex-1 bg-transparent text-slate-100 font-mono text-sm resize-none focus:outline-none leading-relaxed code-editor"
            />
          )}

          {activeTab === 'js' && (
            <textarea
              value={js}
              onChange={(e) => setJs(e.target.value)}
              placeholder="// اكتب JavaScript هنا"
              dir="ltr"
              spellCheck="false"
              className="w-full flex-1 bg-transparent text-slate-100 font-mono text-sm resize-none focus:outline-none leading-relaxed code-editor"
            />
          )}
        </div>

        {/* Sandboxed Live Output Preview */}
        <div
          className={`flex-1 flex flex-col bg-white dark:bg-slate-900 min-h-0 ${
            activeTab !== 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 border-b border-bdr text-[11px] font-bold text-txt-muted flex items-center justify-between">
            <span>النتيجة المعروضة (Sandboxed Output)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            title="Playground Live Preview"
            sandbox="allow-scripts"
            className="w-full flex-1 bg-white border-0"
          />
        </div>
      </div>
    </div>
  );
};
