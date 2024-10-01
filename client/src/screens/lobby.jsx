import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSocket } from '../context/SocketProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
    const name = useSelector(state => state.user.currentUserDetail.role);
    const [room, setRoom] = useState("");
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const socket = useSocket();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        if (name === "Interviewer") {
            fetchData();
        } else {
            try {
                const response = await fetch(`http://127.0.0.1:8000/interview_start/${room}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    socket.emit("room:join", { name, room: result.room });
                    navigate(`/room/${result.room}?userId=${result.id}`);
                } else {
                    console.error('Failed to fetch data:', result.error);
                    setError(result.error);
                }
            } catch (error) {
                console.error('Network error or other issues:', error);
                setError('An error occurred. Please try again later.');
            }
        }
    };

    const handleJoinRoom = useCallback((data) => {
        const { name, room } = data;
        navigate(`/room/${room}`);
    }, [navigate]);

    useEffect(() => {
        const payload = { id: userId };

        async function fetchData() {
            if (name === "Interviewer") {
                setLoading(true);  // Set loading to true
                try {
                    const response = await fetch(`http://127.0.0.1:8000/interview_start/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();

                    setLoading(false);
                    if (response.ok) {
                        socket.emit("room:join", { name, room: result.room });

                        navigate(`/room/${result.room}?userId=${userId}`);
                    } else {
                        console.error('Failed to fetch data:', result.error);
                        setError(result.error);
                    }

                } catch (error) {
                    setLoading(false);
                    console.error('Error during the API call:', error);
                }
            }
        }

        fetchData();
    }, [name, userId, socket, navigate]);

    useEffect(() => {
        socket.on("room:join", handleJoinRoom);
        return () => {
            socket.off('room:join', handleJoinRoom);
        };
    }, [socket, handleJoinRoom]);

    const handleChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newCode = [...code];
            if (newCode[index] === '') {
                if (index > 0) {
                    newCode[index - 1] = '';
                    setCode(newCode);
                    inputRefs.current[index - 1].focus();
                }
            } else {
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };

    const handleJoin = () => {
        const joinCode = code.join('');
        setRoom(joinCode);
        console.log('Joining with code:', joinCode);
    };

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#ADE8F4] to-[#CAF0F8]">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-[#0077B6]">Enter your Code</h1>

                    <form onSubmit={handleSubmitForm}>
                        <div className="flex space-x-2 mb-6">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength="1"
                                    className="w-12 h-16 text-2xl text-center border-2 border-[#0077B6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                />
                            ))}
                        </div>
                        {error && <div className="text-red-500 mb-6">{error}</div>}

                        {loading ? (
                            <button className="w-full bg-[#0077B6] text-white py-2 rounded-md transition duration-300" disabled>
                                Loading...
                            </button>
                        ) : (
                            <button
                                onClick={handleJoin}
                                className="w-full bg-[#0077B6] text-white py-2 rounded-md hover:bg-[#005f8f] transition duration-300"
                            >
                                Join
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
