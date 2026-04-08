const DoctorSkeleton = () => (
  <div className="flex gap-2 overflow-x-auto pb-1 mt-2 px-2">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-xl p-3 min-w-[240px] animate-pulse border border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-full mb-1" />
        <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
        <div className="h-7 bg-gray-200 rounded-lg w-full" />
      </div>
    ))}
  </div>
);

export default DoctorSkeleton;
