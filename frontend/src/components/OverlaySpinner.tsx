
const OverlaySpinner = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="animate-spin w-10 h-10 bg-blue-500 border-r-8"></div>
    </div>
  )
}

export default OverlaySpinner