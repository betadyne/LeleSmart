'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  title: string;
  result: {
    condition?: string;
    recommendation?: string;
    cf: number;
  };
  type: 'seed' | 'pond' | 'final';
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const progressVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

const getConditionColor = (condition: string) => {
  switch (condition) {
    case 'Baik':
      return 'bg-green-100 text-green-800';
    case 'Sedang':
      return 'bg-yellow-100 text-yellow-800';
    case 'Buruk':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function ResultCard({ title, result, type }: ResultCardProps) {
  const getColorClass = (cf: number) => {
    if (cf >= 0.8) return 'bg-green-50 border-green-200';
    if (cf >= 0.6) return 'bg-blue-50 border-blue-200';
    if (cf >= 0.4) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getTextColorClass = (cf: number) => {
    if (cf >= 0.8) return 'text-green-700';
    if (cf >= 0.6) return 'text-blue-700';
    if (cf >= 0.4) return 'text-yellow-700';
    return 'text-red-700';
  };

  const colorClass = getColorClass(result.cf);
  const textColorClass = getTextColorClass(result.cf);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg border ${colorClass}`}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        <p className={textColorClass}>
          {type === 'final' ? result.recommendation : result.condition}
        </p>
        <p className="text-sm text-gray-600">
          Tingkat Kepastian: {(result.cf * 100).toFixed(1)}%
        </p>
      </div>
    </motion.div>
  );
}

interface FinalResultCardProps {
  recommendation: string;
  cf: number;
}

export function FinalResultCard({ recommendation, cf }: FinalResultCardProps) {
  const percentage = Math.round(cf * 100);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white p-4 rounded-md shadow-sm border-2 border-blue-100"
    >
      <h4 className="font-medium text-gray-900 mb-3">Rekomendasi Akhir</h4>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Hasil:</span>
          <span className="font-medium text-blue-600">{recommendation}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tingkat Kepastian:</span>
            <span className="font-medium text-blue-600">{percentage}%</span>
          </div>
          
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              variants={progressVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
} 