import React from 'react'

const AlertModel = ({onClose,}) => {
  return (
     <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm text-center">
            <p className="text-gray-800 mb-6">Please log in as a customer to book a service</p>
            <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">OK</button>
        </div>
    </div>
  )
}

export default AlertModel