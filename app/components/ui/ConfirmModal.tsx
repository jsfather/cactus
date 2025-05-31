'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/components/ui/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

const variantStyles = {
  danger: {
    icon: 'text-red-600 dark:text-red-400',
  },
  warning: {
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  info: {
    icon: 'text-blue-600 dark:text-blue-400',
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'تایید',
  cancelText = 'انصراف',
  loading = false,
  variant = 'danger',
}: ModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm transition-opacity dark:bg-gray-950/30" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white px-4 pt-5 pb-4 text-right shadow-xl ring-1 ring-gray-950/5 transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-gray-900 dark:ring-white/5">
                <div className="absolute top-0 left-0 hidden pt-4 pl-4 sm:block">
                  <button
                    type="button"
                    className={`cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${variantStyles[variant].icon}`}
                    onClick={onClose}
                  >
                    <span className="sr-only">بستن</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-right">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-semibold text-gray-900 dark:text-white"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 gap-3 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    type="button"
                    variant={variant}
                    className="w-full sm:w-auto"
                    onClick={onConfirm}
                    loading={loading}
                  >
                    {confirmText}
                  </Button>
                  <Button
                    type="button"
                    variant="white"
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    {cancelText}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
