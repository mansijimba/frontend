import React from 'react'

export default function DeleteModal(
    {
        isOpen,
        onClose,
        onConfirm,
        title,
        description
    }
) {
    if(!isOpen) return null
    return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-[320px] sm:w-[400px] text-center relative animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition shadow"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
}