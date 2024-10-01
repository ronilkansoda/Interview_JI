import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DatePicker, TimePicker } from 'antd'; // Ensure you have antd installed for date and time pickers
// import 'antd/dist/reset.css'; // Import antd styles
import moment from 'moment';

export default function Form1() {


    // ------------------------------------------------------------ Hooks ------------------------------------------------------------

    // const [formData.interviewRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({
        interviewDate: null,
        interviewTime: [],
        interviewExp: '',
        techExpertise: [],
        interviewRole: null
    });
    const navigate = useNavigate()

    // ------------------------------------------------------- Handle Functions -------------------------------------------------------

    // Handle role selection
    const handleRoleSelect = (role) => {
        setFormData((prev) => ({
            ...prev,
            interviewRole: role,
        }));
    };

    // Handle experience selection
    const handleExperienceChange = (experience) => {
        setFormData((prev) => ({
            ...prev,
            interviewExp: experience,
        }));
    };

    // Handle tech stack selection
    const handleTechStackChange = (tech) => {
        setFormData((prev) => ({
            ...prev,
            techExpertise: prev.techExpertise.includes(tech)
                ? prev.techExpertise.filter((item) => item !== tech)
                : [...prev.techExpertise, tech],
        }));
    };

    // Handle date change
    const handleDateChange = (date, dateString) => {
        setFormData((prev) => ({
            ...prev,
            interviewDate: dateString,
        }));
    };

    // Handle time change
    const handleTimeChange = (times) => {
        setFormData((prev) => ({
            ...prev,
            interviewTime: times ? times.map(time => time.format('HH:mm')) : [],
        }));
    };

    const { interviewer_id } = useParams()

    const handleSubmit = async (e) => {
        e.preventDefault();


        console.log('Submitted data:', formData);
        try {
            const res = await fetch(`http://127.0.0.1:8000/i_signup/${interviewer_id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            // setResult(data); 

            console.log(data);
            if (data.message) {
                navigate('/signIn');
            }
            else {
                console.log(data.error)
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ----------------------------------------------------- renderFilters Functions -----------------------------------------------------

    const renderFilters = () => {
        switch (formData.interviewRole) {
            case 'Full-Stack Developer':
                return (

                    <div className="space-y-6">
                        <div>
                            <h4 className='text-lg font-semibold text-[#023047] mb-2'>Years of Experience:</h4>
                            <div className="grid grid-cols-3 gap-4">
                                {['1-2 years', '3-5 years', '6+ years'].map((exp) => (
                                    <button
                                        key={exp}
                                        type="button"
                                        onClick={() => handleExperienceChange(exp)}
                                        className={`p-3 rounded-lg text-center transition duration-300 ${formData.interviewExp === exp
                                            ? 'bg-[#fb8500] text-[#023047]'
                                            : 'bg-[#023047] text-[#8ecae6] hover:bg-[#219ebc] hover:text-[#023047]'
                                            }`}
                                    >
                                        {exp}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <h4 className='text-lg font-medium'>Primary Tech Stack : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['React.js', 'Angular', 'Vue.js', 'Node.js', 'Django'].map((tech) => (
                                <div
                                    key={tech}
                                    onClick={() => handleTechStackChange(tech)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.techExpertise.includes(tech) ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{tech}</div>
                                </div>
                            ))}
                        </div>

                        <h4 className='text-lg font-medium'>Databases : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['PostgreSQL', 'MongoDB', 'MySQL'].map((db) => (
                                <div
                                    key={db}
                                    onClick={() => handleTechStackChange(db)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.techExpertise.includes(db) ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{db}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'DevOps Engineer':
                return (
                    <div className="flex flex-col gap-4 mt-6">
                        <h4 className='text-lg font-medium'>Years of Experience : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['1-2 years', '3-5 years', '6+ years'].map((exp) => (
                                <div
                                    key={exp}
                                    onClick={() => handleExperienceChange(exp)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.interviewExp === exp ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{exp}</div>
                                </div>
                            ))}
                        </div>

                        <h4 className='text-lg font-medium'>Cloud Platforms : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['AWS', 'Google Cloud', 'Azure'].map((platform) => (
                                <div
                                    key={platform}
                                    onClick={() => handleTechStackChange(platform)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.techExpertise.includes(platform) ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{platform}</div>
                                </div>
                            ))}
                        </div>

                        <h4 className='text-lg font-medium'>Container Orchestration : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['Docker', 'Kubernetes'].map((tool) => (
                                <div
                                    key={tool}
                                    onClick={() => handleTechStackChange(tool)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.techExpertise.includes(tool) ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{tool}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Application Developer':
                return (
                    <div className="flex flex-col gap-4 mt-6">
                        <h4 className='text-lg font-medium'>Years of Experience : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['1-2 years', '3-5 years', '6+ years'].map((exp) => (
                                <div
                                    key={exp}
                                    onClick={() => handleExperienceChange(exp)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.interviewExp === exp ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{exp}</div>
                                </div>
                            ))}
                        </div>

                        <h4 className='text-lg font-medium'>Mobile/Web Tech : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['Swift', 'Kotlin', 'React Native', 'React', 'Angular'].map((tech) => (
                                <div
                                    key={tech}
                                    onClick={() => handleTechStackChange(tech)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.techExpertise.includes(tech) ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{tech}</div>
                                </div>
                            ))}
                        </div>

                        <h4 className='text-lg font-medium'>CI/CD Tools : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['GitLab CI', 'Jenkins'].map((tool) => (
                                <div
                                    key={tool}
                                    onClick={() => handleTechStackChange(tool)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.techExpertise.includes(tool) ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{tool}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Data Scientist/ML Engineer':
                return (
                    <div className="flex flex-col gap-4 mt-6">
                        <h4 className='text-lg font-medium'>Years of Experience : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['1-2 years', '3-5 years', '6+ years'].map((exp) => (
                                <div
                                    key={exp}
                                    onClick={() => handleExperienceChange(exp)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.interviewExp === exp ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{exp}</div>
                                </div>
                            ))}
                        </div>

                        <h4 className='text-lg font-medium'>ML Frameworks : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['TensorFlow', 'PyTorch', 'Scikit-learn'].map((framework) => (
                                <div
                                    key={framework}
                                    onClick={() => handleTechStackChange(framework)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.techExpertise.includes(framework) ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{framework}</div>
                                </div>
                            ))}
                        </div>

                        <h4 className='text-lg font-medium'>Data Processing & Deployment : </h4>
                        <div className="flex flex-wrap gap-4 mb-5">
                            {['Apache Spark', 'Docker', 'AWS Sagemaker'].map((tool) => (
                                <div
                                    key={tool}
                                    onClick={() => handleTechStackChange(tool)}
                                    className={`flex-1 min-w-[150px] h-20 relative flex justify-center items-center p-6 rounded-xl cursor-pointer ${formData.techExpertise.includes(tool) ? 'border-[#000000] bg-[#023E8A] text-white' : 'border-white'} border-2 hover:shadow-md`}
                                >
                                    <div className="text-xl font-bold text-center">{tool}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    // --------------------------------------------------------- Main Return ---------------------------------------------------------

    return (


        <form onSubmit={handleSubmit} className="min-h-screen bg-gradient-to-br from-[#023047] to-[#219ebc] p-8">
            <div className="max-w-4xl mx-auto bg-[#8ecae6] rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-[#023047] p-6 text-[#ffb703]">
                    <h1 className="text-4xl font-bold">Interview Engineer Form</h1>
                </div>
                <div className="p-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-[#023047] font-semibold mb-2">Interview Date</label>
                            <DatePicker
                                value={formData.interviewDate ? moment(formData.interviewDate) : null}
                                onChange={handleDateChange}
                                className="w-full bg-[#023047] text-white rounded-lg"
                                format="YYYY-MM-DD"
                            />
                        </div>
                        <div>
                            <label className="block text-[#023047] font-semibold mb-2">Interview Time</label>
                            <TimePicker.RangePicker
                                onChange={handleTimeChange}
                                className="w-full bg-[#023047] text-white rounded-lg"
                                format="HH:mm"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[#023047] mb-4">Select Your Role</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Full-Stack Developer', 'DevOps Engineer', 'Application Developer', 'Data Scientist/ML Engineer'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleRoleSelect(role)}
                                    className={`p-4 rounded-lg text-center font-semibold transition duration-300 ${formData.interviewRole === role
                                        ? 'bg-[#fb8500] text-[#023047]'
                                        : 'bg-[#023047] text-[#8ecae6] hover:bg-[#219ebc] hover:text-[#023047]'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {formData.interviewRole && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#023047] mb-4">Role-Specific Details</h2>
                            {renderFilters()}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-[#fb8500] text-[#023047] font-bold rounded-lg shadow-lg hover:bg-[#ffb703] transition duration-300"
                        >
                            Submit Application
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
