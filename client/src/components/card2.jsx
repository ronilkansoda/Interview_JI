import React, { useState, useEffect } from 'react';
import { TbManFilled, TbMan } from "react-icons/tb";
import { useSelector } from 'react-redux';

const card2 = ({ props }) => {

    const [data, setData] = useState({})

    const interviewer = useSelector(state => state.user.currentUserDetail.id);
    const interviews = props.interviewId

    const handleClick = async () => {
        const { candidate, interviewId, interview_status, ...filteredProps } = props;

        console.log({ ...filteredProps, interviewer, interviews })


        try {
            // Send the PUT request to update the interview status
            const response2 = await fetch(`http://127.0.0.1:8000/interviews/${interviews}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',

                },
            });

            console.log("UPDATE RESPONSE2", response2, props.interview_status);

            // Check if the PUT request was successful
            if (response2.ok) {
                const result2 = await response2.json();
                console.log('Interview status updated successfully:', result2.interview_status);

                // Now that the interview status has been successfully updated, send the POST request
                const response = await fetch('http://127.0.0.1:8000/take_int/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...filteredProps, interviewer, interviews, interview_status: result2.interview_status }),
                });

                console.log("ADDING DATA RESPONSE", response);

                // Check if the POST request was successful
                if (response.ok) {
                    const result = await response.json();
                    console.log('Data successfully saved:', result);
                    window.location.reload();
                } else {
                    console.error('Failed to save data:', response.statusText);
                }
            } else {
                throw new Error('Network response was not ok for UPDATE request');
            }
        } catch (error) {
            console.error('Error during the API call:', error);
        }




    };


    return (
        <div className="flex justify-between items-center bg-white shadow-lg rounded-lg p-4 mb-4 border-2 border-gray-200 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-150">
            {/* Left side: Interviewee Details */}
            <div className="flex flex-col w-1/3 border-r border-gray-400">
                <div className="text-sm font-medium text-gray-400 flex flex-row items-center gap-1"> <TbManFilled /> Candidate</div>
                <p className="text-xl font-bold text-gray-500">For - {props.interviewRole}</p>
                <div className="mt-2">
                    <p className="text-sm font-medium text-gray-400">Key Skills:</p>
                    <p className="text-xl font-bold text-gray-500">{props.interviewTechno}</p>
                </div>
            </div>

            {/* Center: Date, Time and Interview Type */}
            <div className="flex flex-col text-center w-1/3 border-r border-gray-400">
                <p className="text-lg font-medium text-gray-700">On : {props.interviewDate}</p>
                <p className="text-sm text-gray-500">Time : {props.interviewTime}</p>
                <p className="text-sm text-gray-500">Duration : {props.interviewDuration}</p>
                {/* <p className="mt-2 text-sm text-indigo-500 font-semibold">Technical - Full Stack Focus</p> */}
            </div>

            {/* Right side: Actions */}
            <div className="flex flex-col items-center w-1/3 space-y-2">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600" onClick={handleClick}>
                    Take Interview
                </button>
                <h1>Payment Per Interview : <span className='text-[#25a18e] text-lg font-medium'>${props.interviewPayment}</span></h1>
                <p className="mt-1 text-xs text-gray-500">Interview Status: <span className='text-sm text-gray-700'>Not Taken</span></p>
            </div>
        </div>
    );
};

export default card2;
