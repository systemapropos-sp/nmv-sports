import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 animate-slide-up">
      <button onClick={() => setDismissed(true)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
        <X size={16} />
      </button>
      <div className="flex items-center gap-3">
        <img src="/icon-72.png" alt="NMV SPORTS" className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-900">Install NMV SPORTS</p>
          <p className="text-xs text-gray-500">Add to your home screen for quick access</p>
        </div>
        <Button onClick={handleInstall} size="sm" className="bg-[#0C1B2E] hover:bg-[#1A56DB] text-white shrink-0">
          <Download size={14} className="mr-1" />
          Install
        </Button>
      </div>
    </div>
  );
}
