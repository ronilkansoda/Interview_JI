import React, { useState, useEffect } from 'react';
import { TbManFilled, TbMan, TbClockCog } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';

const card4 = ({ props }) => {

    const handleClick = async () => {
        console.log(props.id)
        const interview_id = props.id
        try {
            const response = await fetch(`http://127.0.0.1:8000/take_int/${interview_id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log('Fetched Data:', result);
            window.location.reload();
        } catch (error) {
            console.error('Error during the API call:', error);
        }
    }

    const addSecondsToTime = (time, secondsToAdd) => {
        // Split the input time string into hours, minutes, and seconds
        const [hours, minutes, seconds] = time.split(':').map(Number);

        // Create a Date object for today with the provided time
        const now = new Date();
        const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);

        // Add the specified number of seconds
        targetTime.setSeconds(targetTime.getSeconds() + secondsToAdd);

        // Format the result as "HH:MM:SS"
        const formattedHours = String(targetTime.getHours()).padStart(2, '0');
        const formattedMinutes = String(targetTime.getMinutes()).padStart(2, '0');
        const formattedSeconds = String(targetTime.getSeconds()).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    const timeLeft = (date, time) => {
        // Combine the date and time into a single string and create a Date object
        const targetDateTime = new Date(`${date}T${time}`);

        const newTime = addSecondsToTime(time, 900);

        const targetDateTime1 = new Date(`${date}T${newTime}`);
        // console.log(targetDateTime1);

        // Get the current date and time
        const currentDateTime = new Date();

        // Calculate the difference in milliseconds
        const difference = targetDateTime - currentDateTime;
        const difference1 = targetDateTime1 - currentDateTime;
        // console.log(difference)
        // console.log(difference1)

        // If the target time is in the past, return zero
        if (difference <= 0 && difference1 < 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                difference: 1,
                difference1: 1,
                minutes1: 0,
                seconds1: 0
            };
        }
        else if (difference <= 0) {
            const minutes1 = Math.floor((difference1 / 1000 / 60) % 60);
            const seconds1 = Math.floor((difference1 / 1000) % 60);
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                difference: 1,
                difference1: 0,
                minutes1,
                seconds1
            };
        }


        // console.log(difference)
        // Calculate the time left in days, hours, minutes, and seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        const minutes1 = Math.floor((difference / 1000 / 60) % 60);
        const seconds1 = Math.floor((difference / 1000) % 60);

        return {
            days,
            hours,
            minutes,
            seconds,
            minutes1,
            seconds1
        };
    };
    const [timeRemaining, setTimeRemaining] = useState(timeLeft(props.interviewDate, props.interviewTime));

    useEffect(() => {
        const updateTimeRemaining = setInterval(() => {
            setTimeRemaining(timeLeft(props.interviewDate, props.interviewTime));
        }, 1000);

        // let timer5min;
        // if (timeRemaining.difference === 1 && time5minLeft > 0) {
        //     timer5min = setInterval(() => {
        //         setTime5minLeft(prev => (prev > 0 ? prev - 1 : 0));
        //     }, 1000);
        // }

        return () => {
            clearInterval(updateTimeRemaining);
        };
    }, [props.interviewDate, props.interviewTime]);

    // const handleLobby = () => {

    // }

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

            {/* -------------------------------------- For the Taken Page -------------------------------------- */}
            {/* Right side: Actions */}
            <div className="flex flex-col items-center w-1/3 space-y-2">
                {timeRemaining && timeRemaining.difference == 1 ?

                    <>
                        {timeRemaining.difference1 == 1 ?

                            <>
                                <div>---Cancelled---</div>

                                <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600" onClick={handleClick}>
                                    Remove
                                </button>
                            </> :
                            <>
                                <div>Click START INTERVIEW In : <span className='text-red-400'>{timeRemaining.minutes1}m {timeRemaining.seconds1}s</span></div>

                                <Link to={`/lobby?userId=${props.id}`}>
                                    <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600" onClick={handleClick}>
                                        Start Interview
                                    </button>
                                </Link>
                            </>
                        }
                    </>
                    :
                    <>
                        <div>Interview starts at : <span className='text-red-400'>{timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s</span></div>
                        <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600" onClick={handleClick}>
                            Cancel
                        </button>
                    </>
                }


                <h1>Payment Per Interview : <span className='text-[#25a18e] text-lg font-medium'>${props.interviewPayment}</span></h1>



                <div className='flex gap-4'>
                    {timeRemaining.difference1 == 1 ?
                        <>
                            <p className="mt-1 text-xs text-gray-500">Interview Status: <span className='text-sm text-gray-700'>Cancelled</span></p>

                            <p className="mt-1 text-xs text-gray-500">Payment Status: <span className='text-sm text-gray-700'>Cancelled</span></p>
                        </>
                        :
                        <>
                            <p className="mt-1 text-xs text-gray-500">Interview Status: <span className='text-sm text-gray-700'>{props.interview_status}</span></p>

                            <p className="mt-1 text-xs text-gray-500">Payment Status: <span className='text-sm text-gray-700'>{props.payment_status}</span></p>
                        </>
                    }

                </div>
            </div>

        </div>
    );
};

export default card4;
// {props.candidate.Email}


