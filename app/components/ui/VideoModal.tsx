import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
}

export function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-black p-1 shadow-xl transition-all">
                <div className="from-primary-500/20 via-primary-500/10 to-primary-500/20 absolute inset-0 bg-gradient-to-r opacity-50" />

                <div className="relative overflow-hidden rounded-xl bg-black">
                  <button
                    onClick={onClose}
                    className="focus:ring-primary-500/60 absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-black/70 hover:text-white focus:ring-2 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <div className="relative aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-primary-500/30 border-t-primary-500 h-12 w-12 animate-spin rounded-full border-4" />
                    </div>

                    {typeof window !== 'undefined' && (
                      <video
                        key={videoSrc}
                        className="h-full w-full"
                        controls
                        autoPlay
                        preload="auto"
                        src={videoSrc}
                        suppressHydrationWarning
                        onPause={(e) => {
                          const video = e.currentTarget;
                          if (video.paused) {
                            video.classList.add('show-play-button');
                          }
                        }}
                        onPlay={(e) => {
                          const video = e.currentTarget;
                          video.classList.remove('show-play-button');
                        }}
                      />
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
