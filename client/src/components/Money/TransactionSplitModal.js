import React from 'react';

const TransactionSplitModal = ({ data, onClose, onSave, onChangeAllocations }) => {
  const { transaction, allocations, error, saving } = data;

  if (!transaction) return null;

  const updateAllocation = (index, field, value) => {
    const updated = allocations.map((alloc, idx) =>
      idx === index ? { ...alloc, [field]: value } : alloc
    );
    onChangeAllocations(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary-600">Split deposit</p>
            <h3 className="text-lg font-semibold text-gray-900">
              ${transaction.amount.toLocaleString()} · {transaction.family} family
            </h3>
            <p className="text-xs text-gray-500">{transaction.description} · {transaction.date}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close split modal">
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {allocations.map((alloc, idx) => (
            <div key={`${alloc.name}-${idx}-${alloc.grade}`} className="flex flex-col gap-2 border border-gray-100 rounded-lg p-3">
              <input
                type="text"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="Student name"
                value={alloc.name || ''}
                onChange={(e) => updateAllocation(idx, 'name', e.target.value)}
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.01"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Amount"
                  value={alloc.amount ?? ''}
                  onChange={(e) => updateAllocation(idx, 'amount', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Program / Grade"
                  value={alloc.grade || ''}
                  onChange={(e) => updateAllocation(idx, 'grade', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChangeAllocations([...allocations, { name: '', amount: '', grade: '' }])}
            className="text-xs font-semibold text-primary-600"
            disabled={saving}
          >
            + Add student
          </button>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave(allocations)}
            disabled={saving}
            className={`px-4 py-2 text-sm rounded-lg text-white ${saving ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            {saving ? 'Saving...' : 'Save split'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionSplitModal;

