import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function Report() {
    const [formData, setFormData] = useState({ answers: {} });
    const [err, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const { intId } = useParams();
    // const intId = 7; // Set your interview ID here
    const navigate = useNavigate();
    console.log(intId)

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, answers: { ...prev.answers, [id]: value } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        setLoading(true);
        setError(false);

        // Prepare the data for submission
        const dataToSubmit = {
            interview_id: intId,
            answers: formData.answers,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/report/', { // Adjust the endpoint as necessary
                method: 'PUT', // Use POST if you're creating a new report
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            // Handle success response if needed
            console.log('Report submitted successfully',dataToSubmit);
            navigate('/'); // Navigate to another route if necessary
        } catch (error) {
            console.error(error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='p-4 max-w-lg mx-auto'>
                <h1 className='text-center font-semibold text-3xl my-7'>Report</h1>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <label htmlFor="q1">How would you rate the candidate’s understanding of key technical concepts (e.g., algorithms, data structures, frameworks)?</label>
                    <input
                        type="text"
                        placeholder='Your Answer'
                        id='a1'
                        className='bg-slate-200 p-3 rounded-lg'
                        onChange={handleChange}
                    />

                    <label htmlFor="q2">How well did the candidate write and debug code? Was the approach structured and optimized?</label>
                    <input
                        type="text"
                        placeholder='Your Answer'
                        id='a2'
                        className='bg-slate-200 p-3 rounded-lg'
                        onChange={handleChange}
                    />

                    <label htmlFor="q3">How effective was the candidate in explaining their thought process and solutions?</label>
                    <input
                        type="text"
                        placeholder='Your Answer'
                        id='a3'
                        className='bg-slate-200 p-3 rounded-lg'
                        onChange={handleChange}
                    />

                    <button
                        className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Send"}
                    </button>
                </form>
                <div className="text-red-700 mt-3">{err && 'Something went wrong!!!'}</div>
            </div>
        </div>
    );
}
