import React, { useState, useRef } from 'react';
import { FileImage, Upload, Trash2, ArrowUp, ArrowDown, Printer, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { AdSenseBanner } from '../AdSenseBanner';

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  size: string;
}

export const ImageToPdfConverter: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pageSize, setPageSize] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('small');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newImages: UploadedImage[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newArr = [...images];
    const [moved] = newArr.splice(index, 1);
    newArr.splice(targetIndex, 0, moved);
    setImages(newArr);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleClearAll = () => {
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Document Utility
            </span>
            <span className="text-xs text-slate-500">JPG / PNG / WebP to A4 PDF</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Image to PDF Converter
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Combine invoice receipts, delivery challans, and product photos into clean, printable A4 PDF documents.
          </p>
        </div>

        <div className="flex gap-2">
          {images.length > 0 && (
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF ({images.length} Pages)</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload & Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileUpload}
            className="hidden"
            id="image-pdf-file-upload"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <label
              htmlFor="image-pdf-file-upload"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Images</span>
            </label>
          </div>

          {images.length > 0 && (
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Orientation:</span>
                <select
                  value={pageSize}
                  onChange={(e: any) => setPageSize(e.target.value)}
                  className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-800"
                >
                  <option value="portrait">A4 Portrait</option>
                  <option value="landscape">A4 Landscape</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Margins:</span>
                <select
                  value={margin}
                  onChange={(e: any) => setMargin(e.target.value)}
                  className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-800"
                >
                  <option value="none">Fit Full Page (0 margin)</option>
                  <option value="small">Small (10mm)</option>
                  <option value="normal">Normal (20mm)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                className="text-rose-600 hover:underline font-semibold ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview & Page Ordering */}
      {images.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-2xl space-y-3 no-print">
          <FileImage className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Images Uploaded</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upload images (JPG, PNG, WebP) from your device to organize pages and export or print directly to A4 PDF.
          </p>
        </div>
      ) : (
        <div className="space-y-4 no-print">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Page Order & Management ({images.length} Pages)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1 border-b border-slate-100">
                  <span className="flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[120px]">{img.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">{img.size}</span>
                </div>

                <div className="h-40 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-1">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30"
                      title="Move page up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30"
                      title="Move page down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(img.id)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    title="Remove page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print Document Render Area (Visible on Print) */}
      <div className="print-only">
        {images.map((img, idx) => (
          <div
            key={img.id}
            className={`page-break flex items-center justify-center w-full min-h-screen ${
              margin === 'small' ? 'p-4' : margin === 'normal' ? 'p-8' : 'p-0'
            }`}
          >
            <img
              src={img.url}
              alt={`Page ${idx + 1}`}
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        ))}
      </div>

      <AdSenseBanner slot="image-pdf-bottom" format="horizontal" />
    </div>
  );
};
