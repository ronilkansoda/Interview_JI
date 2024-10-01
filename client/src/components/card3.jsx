import React from 'react';
import { TbManFilled, TbMan } from "react-icons/tb";

const card3 = () => {
    return (
        <div className="flex justify-between items-center bg-[#d6ffce] shadow-lg rounded-lg p-2 mb-4 border-2 border-gray-200 hover:shadow-md">
            {/* Left side: Interviewee Details */}
            <div className="flex flex-row justify-between pl-4 w-1/3 ">
                <div className=''>
                    <div className="text-sm font-medium text-gray-400 flex flex-row items-center gap-1"> <TbManFilled /> Candidate</div>
                    <p className="text-lg font-bold text-gray-500">For - Frontend Developer</p>
                </div>
                <div className="">
                    <p className="text-sm font-medium text-gray-600">Key Skills:</p>
                    <p className="text-sm text-gray-500">React, JavaScript</p>
                </div>
            </div>

            {/* Center: Date, Time and Interview Type */}
            <div className="flex flex-col text-center w-1/3 ">
                <p className="text-lg font-medium text-gray-700">12/08/2024</p>
                <p className="text-sm text-gray-500">3:00 PM</p>
            </div>

            {/* Right side: Actions */}
            <div className="flex flex-col items-center w-1/3 space-y-2">
                <h1>Payment Per Interview : <span className='text-[#25a18e] text-2xl font-medium'>$1000</span></h1>
                <p className="mt-1 text-xs text-gray-500">Payment Status : <span className='text-lg text-gray-700   '>Incompleted</span></p>
            </div>
        </div>
    );
};

export default card3;
