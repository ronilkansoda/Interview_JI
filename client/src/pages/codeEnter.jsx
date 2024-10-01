import React, { useState, useRef } from 'react';

export default function CodeEnter() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

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
    console.log('Joining with code:', joinCode);
    // Add your join logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#ADE8F4] to-[#CAF0F8]">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-[#0077B6]">Enter your Code</h1>

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
        <div className='text-red-500 mb-6'>Error enter all digits</div>
        <button 
          onClick={handleJoin}
          className="w-full bg-[#0077B6] text-white py-2 rounded-md hover:bg-[#005f8f] transition duration-300"
        >
          Join
        </button>
        
      </div>
    </div>
  );
}