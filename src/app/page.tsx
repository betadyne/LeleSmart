'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { evaluateSeedCondition } from '@/lib/expert-system/seed-condition';
import { evaluatePondCondition } from '@/lib/expert-system/pond-condition';
import { determineFinalResult } from '@/lib/expert-system/final-result';
import { ResultCard } from '@/components/ResultCard';

const formSchema = z.object({
  // Seed condition inputs
  headShape: z.number().min(1).max(2), // 1: Runcing, 2: Gemuk
  agility: z.number().min(1).max(2),   // 1: Lincah, 2: Lambat
  skinColor: z.number().min(1).max(2), // 1: Mengkilap, 2: Buram
  defect: z.number().min(1).max(3),    // 1: Sirip Merah, 2: Moncong Putih, 3: Tidak Ada
  cfHead: z.number().min(0).max(1),
  cfAgility: z.number().min(0).max(1),
  cfSkin: z.number().min(0).max(1),
  cfDefect: z.number().min(0).max(1),

  // Pond condition inputs
  ph: z.number().min(1).max(3), // 1: Tinggi, 2: Netral, 3: Rendah
  temperature: z.number().min(0).max(100),

  // Feed type
  feedType: z.number().min(1).max(4), // 1: Pelet, 2: Telur, 3: Usus, 4: Cacing
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    headShape: 1,
    agility: 1,
    skinColor: 1,
    defect: 3,
    cfHead: 1.0,
    cfAgility: 1.0,
    cfSkin: 1.0,
    cfDefect: 1.0,
    ph: 2,
    temperature: 28 ,
    feedType: 1,
  });  

  const seedConditionQuery = useQuery({
    queryKey: ['seedCondition', formData],
    queryFn: () => evaluateSeedCondition(formData),
    enabled: false,
  });

  const pondConditionQuery = useQuery({
    queryKey: ['pondCondition', formData],
    queryFn: () => evaluatePondCondition(formData),
    enabled: false,
  });

  const finalResultQuery = useQuery({
    queryKey: ['finalResult', seedConditionQuery.data, pondConditionQuery.data, formData.feedType],
    queryFn: () => {
      if (!seedConditionQuery.data || !pondConditionQuery.data) {
        throw new Error('Missing seed or pond condition data');
      }
      return determineFinalResult(seedConditionQuery.data, pondConditionQuery.data, formData.feedType);
    },
    enabled: false,
  });

  const saveAnalysisMutation = useMutation({
    mutationFn: async (data: {
      headShape: number;
      agility: number;
      skinColor: number;
      defect: number;
      cfHead: number;
      cfAgility: number;
      cfSkin: number;
      cfDefect: number;
      ph: number;
      temperature: number;
      feedType: number;
      seedCondition: { condition: string; cf: number };
      pondCondition: { condition: string; cf: number };
      finalResult: { recommendation: string; cf: number };
    }) => {
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to save analysis');
      }
      return response.json();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const seedResult = await seedConditionQuery.refetch();
      const pondResult = await pondConditionQuery.refetch();
      const finalResult = await finalResultQuery.refetch();

      if (seedResult.data && pondResult.data && finalResult.data) {
        await saveAnalysisMutation.mutateAsync({
          ...formData,
          seedCondition: seedResult.data,
          pondCondition: pondResult.data,
          finalResult: finalResult.data,
        });
      }
    } catch (error) {
      console.error('Error during analysis:', error);
    }
  };

  const isLoading =
    seedConditionQuery.isFetching ||
    pondConditionQuery.isFetching ||
    finalResultQuery.isFetching ||
    saveAnalysisMutation.isPending;

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Analisis Kondisi Benih dan Kolam
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Kondisi Benih</h2>
                
                <div>
                  <label htmlFor="headShape" className="block text-sm font-medium text-gray-700 mb-1">
                    Bentuk Kepala
                  </label>
                  <select
                    id="headShape"
                    value={formData.headShape}
                    onChange={(e) => setFormData({ ...formData, headShape: Number(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Runcing</option>
                    <option value="2">Gemuk</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="agility" className="block text-sm font-medium text-gray-700 mb-1">
                    Kelincahan
                  </label>
                  <select
                    id="agility"
                    value={formData.agility}
                    onChange={(e) => setFormData({ ...formData, agility: Number(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Lincah</option>
                    <option value="2">Lambat</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="skinColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Warna Kulit
                  </label>
                  <select
                    id="skinColor"
                    value={formData.skinColor}
                    onChange={(e) => setFormData({ ...formData, skinColor: Number(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Mengkilap</option>
                    <option value="2">Buram</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="defect" className="block text-sm font-medium text-gray-700 mb-1">
                    Kecacatan
                  </label>
                  <select
                    id="defect"
                    value={formData.defect}
                    onChange={(e) => setFormData({ ...formData, defect: Number(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Sirip Merah</option>
                    <option value="2">Moncong Putih</option>
                    <option value="3">Tidak Ada</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Tingkat Keyakinan</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cfHead" className="block text-xs text-gray-600">
                        Bentuk Kepala
                      </label>
                      <select
                        id="cfHead"
                        value={formData.cfHead}
                        onChange={(e) => setFormData({ ...formData, cfHead: Number(e.target.value) })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1.0">Yakin (1.0)</option>
                        <option value="0.8">Kurang Yakin (0.8)</option>
                        <option value="0.5">Tidak Yakin (0.5)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cfAgility" className="block text-xs text-gray-600">
                        Kelincahan
                      </label>
                      <select
                        id="cfAgility"
                        value={formData.cfAgility}
                        onChange={(e) => setFormData({ ...formData, cfAgility: Number(e.target.value) })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1.0">Yakin (1.0)</option>
                        <option value="0.8">Kurang Yakin (0.8)</option>
                        <option value="0.5">Tidak Yakin (0.5)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cfSkin" className="block text-xs text-gray-600">
                        Warna Kulit
                      </label>
                      <select
                        id="cfSkin"
                        value={formData.cfSkin}
                        onChange={(e) => setFormData({ ...formData, cfSkin: Number(e.target.value) })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1.0">Yakin (1.0)</option>
                        <option value="0.8">Kurang Yakin (0.8)</option>
                        <option value="0.5">Tidak Yakin (0.5)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cfDefect" className="block text-xs text-gray-600">
                        Kecacatan
                      </label>
                      <select
                        id="cfDefect"
                        value={formData.cfDefect}
                        onChange={(e) => setFormData({ ...formData, cfDefect: Number(e.target.value) })}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1.0">Yakin (1.0)</option>
                        <option value="0.8">Kurang Yakin (0.8)</option>
                        <option value="0.5">Tidak Yakin (0.5)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Kondisi Kolam</h2>
                
                <div>
                  <label htmlFor="ph" className="block text-sm font-medium text-gray-700 mb-1">
                    pH Air
                  </label>
                  <select
                    id="ph"
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: Number(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Tinggi</option>
                    <option value="2">Netral</option>
                    <option value="3">Rendah</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                    Suhu Air (°C)
                  </label>
                  <input
                    id="temperature"
                    type="number"
                    value={formData.temperature === 0 ? "" : formData.temperature || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        temperature: value === "" ? 0 : Number(value),
                      });
                    }}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="feedType" className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Pakan
                  </label>
                  <select
                    id="feedType"
                    value={formData.feedType}
                    onChange={(e) => setFormData({ ...formData, feedType: Number(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Pelet</option>
                    <option value="2">Telur</option>
                    <option value="3">Usus</option>
                    <option value="4">Cacing</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? 'Menganalisis...' : 'Analisis'}
            </button>
          </form>

          {isLoading && (
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!isLoading && finalResultQuery.data && seedConditionQuery.data && pondConditionQuery.data && (
            <div className="mt-8 space-y-6">
              <ResultCard
                title="Kondisi Benih"
                result={seedConditionQuery.data}
                type="seed"
              />
              <ResultCard
                title="Kondisi Kolam"
                result={pondConditionQuery.data}
                type="pond"
              />
              <ResultCard
                title="Hasil Analisis"
                result={finalResultQuery.data}
                type="final"
              />
            </div>
          )}

          {saveAnalysisMutation.isError && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              Gagal menyimpan hasil analisis. Silakan coba lagi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 