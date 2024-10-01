import React, { useEffect, useState } from 'react';
import Card1 from '../components/card1';
import Card2 from '../components/card2';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { responsiveArray } from 'antd/es/_util/responsiveObserver';
import { useSelector } from 'react-redux';

export default function home() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const role = useSelector(state => state.user.currentUserDetail.role);
    const intwId = useSelector(state => state.user.currentUserDetail.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/interviews/${intwId}`, {
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
        if (role=="Interviewer"){
            fetchData()
        }
        else{
            setLoading(false)
        }
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const blogPosts = [
        {
            title: "5 Tips to Ace Your Technical Interview",
            excerpt: "Prepare effectively with these key strategies...",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            title: "Common Coding Challenges in Interviews",
            excerpt: "Familiarize yourself with these frequent problems...",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            title: "How to Showcase Your Soft Skills",
            excerpt: "Demonstrate your teamwork and communication abilities...",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            title: "How to Showcase Your Soft Skills",
            excerpt: "Demonstrate your teamwork and communication abilities...",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            title: "How to Showcase Your Soft Skills",
            excerpt: "Demonstrate your teamwork and communication abilities...",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            title: "How to Showcase Your Soft Skills",
            excerpt: "Demonstrate your teamwork and communication abilities...",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            title: "How to Showcase Your Soft Skills",
            excerpt: "Demonstrate your teamwork and communication abilities...",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            title: "How to Showcase Your Soft Skills",
            excerpt: "Demonstrate your teamwork and communication abilities...",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
    ];
    return (
        // <div className="p-5 flex flex-row flex-wrap justify-center gap-8">
        <div className="">

            {role == "Interviewer" ?
                <div className='p-8'>

                    <h1 className='pb-5'>Interview To be Taken :</h1>
                    {
                        data.length > 0 ? data.map((card) => (
                            <Card2 key={card.interviewId} props={card} />
                        )) : (
                            <div>Insufficient Data available</div>
                        )
                    }

                </div>
                :
                <>
                    
                    <div className="bg-gradient-to-br from-[#e5fbff] to-[#79cffd] min-h-screen p-8">
                        <div
                            className="max-w-6xl mx-auto bg-white rounded-lg shadow-2xl p-6"
                        >
                            <h1 className="text-4xl font-bold text-[#0077B6] mb-8">Welcome Back, Ronil!</h1>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="mb-10 bg-gradient-to-br from-[#cbf0f7] to-[#e4fbff] p-6 rounded-lg shadow-md"
                            >
                                <p className="text-xl text-[#0077B6] font-semibold flex justify-center items-center">If you have an Interview, Please click on the Join button below</p>
                                <div className='flex justify-center'>
                                    <Link to={'/lobby'}>
                                        <button
                                            className="mt-4 bg-[#0077B6] text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-[#005f8f] transition duration-300 shadow-lg items-center"
                                        >
                                            Join Now
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>

                            <div>
                                <h2 className="text-3xl font-semibold text-[#0077B6] mb-6">Your Helpful Blogs</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blogPosts.map((post, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white rounded-lg overflow-hidden shadow-lg"
                                        >
                                            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                                            <div className="p-4">
                                                <h3 className="text-xl font-semibold text-[#0077B6] mb-2">{post.title}</h3>
                                                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                                <motion.a
                                                    href="#"
                                                    className="text-[#0077B6] font-semibold hover:underline inline-block"
                                                    whileHover={{ scale: 1.06 }}
                                                >
                                                    Read more
                                                </motion.a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }





        </div>

    )

}
