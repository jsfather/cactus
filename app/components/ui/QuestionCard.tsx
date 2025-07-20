import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { PlacementExamQuestion } from '@/app/lib/types/placement-exam';
import OptionButton from './OptionButton';
import ImageModal from '../ImageModal';

interface QuestionCardProps {
  question: PlacementExamQuestion;
  questionNumber: number;
  selectedOptionId?: number | string;
  onOptionSelect: (optionId: number | string) => void;
  disabled?: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedOptionId,
  onOptionSelect,
  disabled = false,
}: QuestionCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const imageUrl = question.file
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${question.file}`
    : null;

  return (
    <motion.div
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Question Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
            <span className="text-lg font-bold">{questionNumber}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            سوال {questionNumber}
          </h2>
        </div>

        {/* Question Image */}
        {imageUrl && (
          <div className="mb-4">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
              <Image
                src={imageUrl}
                alt={`تصویر سوال ${questionNumber}`}
                width={600}
                height={400}
                className="h-auto w-full cursor-pointer object-contain transition-transform duration-200 hover:scale-105"
                onClick={() => setIsImageModalOpen(true)}
                priority
              />
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="absolute top-2 left-2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/70"
                aria-label="بزرگ کردن تصویر"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
          <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100">
            {question.text}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          گزینه‌های پاسخ:
        </h3>
        {question.options.map((option, index) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            onSelect={onOptionSelect}
            disabled={disabled}
            index={index}
          />
        ))}
      </div>

      {/* Image Modal */}
      {imageUrl && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imagePath={imageUrl}
          imageName={`سوال ${questionNumber}`}
        />
      )}
    </motion.div>
  );
}
