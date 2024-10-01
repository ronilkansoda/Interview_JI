import React from 'react';

export default function payBox() {
    return (
        <div className='w-full flex justify-center max-w-full'>
            <div className="bg-white shadow-lg rounded-lg p-6 mt-8 w-3/4  border-2 border-gray-700">
                <div className="text-xl bg-[#88dfd2] text-gray-700 font-bold p-7 mb-4 flex flex-row justify-between">
                    <div>Payment Details</div>
                    <div>Your Total is : $5230</div>
                </div>

                <div className="mb-4">
                    <label htmlFor="cardName" className="block text-gray-600 mb-2">Cardholder's Name</label>
                    <input
                        type="text"
                        id="cardName"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-gray-600 mb-2">Card Number</label>
                    <input
                        type="text"
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex space-x-4 mb-4">
                    <div className="w-1/2">
                        <label htmlFor="expiryDate" className="block text-gray-600 mb-2">Expiry Date</label>
                        <input
                            type="text"
                            id="expiryDate"
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="cvv" className="block text-gray-600 mb-2">CVV</label>
                        <input
                            type="text"
                            id="cvv"
                            placeholder="123"
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="amount" className="block text-gray-600 mb-2">Amount to Pay</label>
                    <input
                        type="text"
                        id="amount"
                        placeholder="$1000"
                        className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        readOnly
                    />
                </div>

                <div className='flex justify-center'>
                    <button className="bg-[#88dfd2] text-black px-4 py-2 rounded-md hover:bg-[#75c1b5] transition duration-200">
                        Get Payment
                    </button>
                </div>
            </div>
        </div>

    );
}
