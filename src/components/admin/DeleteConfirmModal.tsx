import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  awayTeam: string;
  homeTeam: string;
}

export default function DeleteConfirmModal({ open, onClose, onConfirm, awayTeam, homeTeam }: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className="relative z-50 bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <div className="flex flex-col items-center text-center sm:text-left sm:items-start gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-red-500" />
                <h2 className="text-lg font-semibold">Delete Game?</h2>
              </div>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <strong className="text-gray-700">{awayTeam} @ {homeTeam}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 w-full mt-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
