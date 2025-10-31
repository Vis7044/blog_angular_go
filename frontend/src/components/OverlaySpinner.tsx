const OverlaySpinner = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col gap-2 items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xl">Loading...</p>
    </div>
  )
}

export default OverlaySpinner
