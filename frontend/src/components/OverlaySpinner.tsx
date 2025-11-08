
const OverlaySpinner = () => {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      {/* Image Placeholder */}
      <div className="h-40 bg-gray-200 rounded-md mb-4"></div>

      {/* Title Placeholder */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

      {/* Description Placeholder */}
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>

      {/* Footer */}
      <div className="flex items-center mt-4">
        <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  )
}
export default OverlaySpinner

