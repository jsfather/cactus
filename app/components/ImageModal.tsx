import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagePath: string;
  imageName: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imagePath,
  imageName,
}: ImageModalProps) {
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
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative max-h-[95vh] max-w-[95vw] overflow-hidden rounded-lg">
              <div className="relative">
                <Image
                  src={imagePath}
                  alt={imageName}
                  width={1200}
                  height={800}
                  className="max-h-[90vh] w-auto object-contain"
                  priority
                />
                <Dialog.Title className="absolute right-0 bottom-0 left-0 bg-black/50 p-4 text-center text-lg font-semibold text-white backdrop-blur-sm">
                  {imageName.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/70"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
