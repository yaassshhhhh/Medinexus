const DoctorCard = ({ doctor }) => {
  const stars = typeof doctor.rating === 'number'
    ? '⭐'.repeat(Math.round(doctor.rating))
    : '';

  return (
    <div className="bg-white rounded-xl shadow-md p-3 mb-2 border border-gray-100 min-w-[240px] max-w-[280px]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm leading-tight">{doctor.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{doctor.address}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
          doctor.isOpen === true
            ? 'bg-green-100 text-green-700'
            : doctor.isOpen === false
            ? 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {doctor.isOpen === true ? 'Open' : doctor.isOpen === false ? 'Closed' : 'N/A'}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {doctor.rating !== 'N/A' && (
          <span className="text-xs text-yellow-600 font-medium">
            ⭐ {doctor.rating} ({doctor.totalRatings})
          </span>
        )}
      </div>

      <a
        href={doctor.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 w-full block text-center bg-primary text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-primaryDark transition-colors"
      >
        📍 View on Maps
      </a>
    </div>
  );
};

export default DoctorCard;
