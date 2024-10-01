import React,{useState,useEffect} from 'react'
import Card4 from '../components/card4'

export default function pendingInt() {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/take_int/", {    
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' },
                })
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await res.json();
                setData(result)
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

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='p-5'>
            {
                data.length > 0 ? data.map((card) => (
                    <Card4 key={card.id} props={card} />
                )) : (
                    <div>Insufficient Data available</div>
                )
            }
        </div>
    )
}
