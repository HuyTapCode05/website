interface NoteInputProps {
  note: string;
  setNote: (value: string) => void;
}

export default function NoteInput({ note, setNote }: NoteInputProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <label className="font-semibold text-gray-700 text-lg">Ghi chú đơn hàng</label>
      </div>
      
      <div className="relative">
        <textarea
          className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400 resize-none pr-12"
          rows={4}
          placeholder="Ví dụ: Giao giờ hành chính, giao tại cổng công ty, gọi điện trước khi giao..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="absolute right-4 top-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <p className="text-gray-500 text-sm">
          Ghi chú cho đơn hàng (tuỳ chọn)
        </p>
        <span className={`text-sm ${note.length > 200 ? 'text-red-500' : 'text-gray-500'}`}>
          {note.length}/200 ký tự
        </span>
      </div>
    </div>
  );
}