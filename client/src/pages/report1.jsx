import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Card1 from '../components/card1';

export default function report1() {
    const [data, setData] = useState([])
    const [candidateName, setCandidateName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const candi_id = useSelector(state => state.user.currentUserDetail.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/candidate_report/${candi_id}/`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' },
                })
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await res.json();
                setCandidateName(result.candidate_name); 
                setData(result.interviews);
                console.log('Fetched Data:', result);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }

    return (
        <>
            <div className='p-5'>
                <h1 className='pb-5'>Past Interviews for {candidateName} : </h1>
                {data && 
                    data.length > 0 ? data.map((card) => (
                        <Card1 key={card.id} props={card} name={candidateName}/>
                    )) : (
                        <div>Insufficient Data available</div>
                    )
                }
            </div>
        </>
    )
}
