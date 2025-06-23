// src/components/SellerCard.jsx
export default function SellerCard({ seller }) {
  return (
    <div className="p-4 border rounded-md shadow-sm mb-3 bg-white">
      <h3 className="text-lg font-semibold text-gray-800">{seller.name}</h3>
      <p className="text-sm text-gray-600">{seller.email}</p>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${seller.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {seller.status}
      </span>
    </div>
  );
}
