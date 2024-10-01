import React from 'react';

const Card = ({ props, name }) => {
    const pdfUrl = props.report

    const handleDownloadPdf = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = `http://127.0.0.1:8000${pdfUrl}`; // Ensure this points to the Django server
            link.setAttribute('download', `${name}.pdf`); // Name for the downloaded file
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            console.log("No PDF URL available");
        }
    };

    return (
        <div className="flex justify-between items-center bg-[#edf5ff] shadow-md rounded-lg p-4 mb-4 transform transition-transform duration-300 hover:-translate-y-1">
            {/* Left side: Interview Details */}
            <div className="flex flex-col
             w-1/3 pl-4">
                <h3 className="text-xl font-bold text-gray-700">{name}</h3>
                <p className="text-sm text-gray-500">For - {props.interviewRole}</p>
                <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600">Key Skills:</p>
                    <p className="text-sm text-gray-500">{props.interviewTechno}</p>
                </div>
            </div>

            {/* Center: Date and Time */}
            <div className="flex flex-col text-center w-1/3">
                <p className="text-gray-500 text-sm">Duration : {props.interviewDuration}</p>
                <p className="text-gray-700 font-medium">Date : {props.interviewDate}</p>
                <p className="text-gray-500">Time : {props.interviewTime}</p>
            </div>


            <div className="flex flex-col items-center w-1/3 space-y-2">
                {pdfUrl ? <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600" onClick={handleDownloadPdf} disabled={!pdfUrl}>
                    View Report
                </button>
                :
                <button className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500" disabled>
                    Given Soon
                </button>
            }

            </div>
        </div>
    );
};

export default Card;
