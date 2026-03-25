interface NoteInputProps {
  note: string;
  setNote: (value: string) => void;
}

export default function NoteInput({ note, setNote }: NoteInputProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-3">Ghi chú</h3>
      <textarea
        className="w-full p-3.5 rounded-xl text-sm bg-gray-50 border-2 border-gray-100 text-gray-800 placeholder-gray-400 outline-none resize-none transition-all focus:border-amber-400 focus:bg-white"
        rows={3}
        placeholder="VD: Giao giờ hành chính, gọi trước khi giao..."
        value={note}
        onChange={e => setNote(e.target.value)}
        maxLength={200}
      />
      <div className="flex justify-end mt-1.5">
        <span className={`text-xs ${note.length > 180 ? 'text-red-400' : 'text-gray-400'}`}>{note.length}/200</span>
      </div>
    </div>
  );
}