import React, { useRef, useEffect, useCallback, useState, useId } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { Link, useNavigate, Navigate, useSearchParams } from "react-router-dom"
import { useSelector } from 'react-redux';

import { Editor } from '@monaco-editor/react';
import { CODE_SNIPPETS } from '../utilities/constants';
import Video from '../components/video';
import Output from '../components/output';
import LanguageSelector from '../components/languageSelector';


const RoomPage = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [navigateToReport, setNavigateToReport] = useState(false);
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [cancelCalled, setCancelCalled] = useState(false);

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId")
  const role = useSelector(state => state.user.currentUserDetail.role);
  // ---------------------------------------------------------------------------------

  const editorRef = useRef();
  const [value, setValue] = useState('')
  const [language, setLanguage] = useState('javascript');

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };
  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
    socket.emit('codeSelector', { languages: language, codeSnipp: CODE_SNIPPETS[language] });
  };
  const handelChange = (newCode) => {
    setValue(newCode);
    socket.emit('codeUpdate', newCode);
  };

  useEffect(() => {
    // Listen for code updates from the server
    socket.on('codeUpdate', (newCode) => {
      setValue(newCode);
    });
    socket.on('codeSelector', ({ languages, codeSnipp }) => {
      setLanguage(languages);
      setValue(codeSnipp);
    });

    return () => {
      socket.off('codeSelector');
      socket.off('codeUpdate');
    };
  }, []);

  // ---------------------------------------------------------------------------------

  const handleUserJoined = useCallback(({ name, id }) => {
    console.log(`Email ${name} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCancel = () => {
    if (myStream && remoteStream) {
      myStream.getTracks().forEach(track => track.stop());
      remoteStream.getTracks().forEach(track => track.stop());
      setMyStream(null);
      setRemoteStream(null)
    }
    // Close the peer connection
    if (peer.peer) {
      peer.peer.close();
    }

    // Emit any necessary socket events to signal disconnection (optional)
    if (socket) {
      socket.emit('user-disconnect');
    }
    setCancelCalled(true);
  };

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(({ from, ans }) => {
    peer.setLocalDescription(ans);
    console.log("Call Accepted!");
    sendStreams();
  },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);
  console.log(userId)
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/forRoom/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Interview Data:', result);
      setData(result);
    } catch (error) {
      console.error('Error during the API call:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const timeLeft = useCallback((date, time, duration) => {
    if (!date || !time || !duration) {
      console.error('Missing required data for timeLeft calculation');
      return null;
    }

    const targetDateTime = new Date(`${date}T${time}`);
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    const durationInSeconds = (hours * 3600) + (minutes * 60) + seconds;
    const endDateTime = new Date(targetDateTime.getTime() + durationInSeconds * 1000);

    const currentDateTime = new Date();

    if (currentDateTime >= endDateTime) {
      return { difference1: 1, minutes1: 0, seconds1: 0 };
    }

    if (currentDateTime < targetDateTime) {
      const difference = targetDateTime - currentDateTime;
      return {
        difference1: 0,
        minutes1: Math.floor((difference / 1000 / 60) % 60),
        seconds1: Math.floor((difference / 1000) % 60)
      };
    }

    const difference = endDateTime - currentDateTime;
    return {
      difference1: 0,
      minutes1: Math.floor((difference / 1000 / 60) % 60),
      seconds1: Math.floor((difference / 1000) % 60)
    };
  }, []);
  
  console.log(data.interviews)
  useEffect(() => {
    if (data && data.interviewDate && data.interviewTime && data.interviewDuration) {
      const intervalId = setInterval(() => {
        const remaining = timeLeft(data.interviewDate, data.interviewTime, data.interviewDuration);
        setTimeRemaining(remaining);

        if (remaining && remaining.difference1 === 1 && !cancelCalled) {
          clearInterval(intervalId); // Stop the interval
          console.log(role);

          // Call the handleCancel function
          handleCancel();

          // Navigate based on role
          if (role === "Interviewer") {
            navigate(`/report/${data.interviews}`);
            window.location.reload()
          } else {
            navigate('/');
            window.location.reload()
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [data, timeLeft, navigate, cancelCalled, role]); // Add cancelCalled and role to dependencies


  if (isLoading) {
    return <div className="bg-[#0f0a19] w-full h-screen text-gray-500 p-6">Loading...</div>;
  }

  if (!data) {
    return <div className="bg-[#0f0a19] w-full h-screen text-gray-500 p-6">No data available</div>;
  }
  return (

    <div className="bg-[#0f0a19] w-full h-screen text-gray-500 p-6">
      {/* Container for entire layout */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col h-full">
          <div className='flex flex-col h-full'>
            {/* Header Area */}
            <div className="flex justify-center items-center mb-4 gap-2">
              {/* Language Selector at the top */}

              <button className="bg-red-500 text-gray-200 px-4 py-2 m-4 rounded-lg" onClick={handleCancel}>Cancel</button>

              {myStream == null ? <Link to={'/report'}>
                <button className="bg-blue-500 text-gray-200 px-4 py-2 m-4 rounded-lg" >Back</button>
              </Link> : ""}

              {/* 
              {timeRemaining.difference1 == 1 ?

                <>""</> :
                <>
                  <div>INTERVIEW Ends in : <span className='text-red-400'>{timeRemaining.minutes1}m {timeRemaining.seconds1}s</span></div>
                </>
              } */}
              {timeRemaining ? (
                timeRemaining.difference1 === 1 ? (
                  <></>
                ) : (
                  <div>INTERVIEW Ends in : <span className='text-red-400'>{timeRemaining.minutes1}m {timeRemaining.seconds1}s</span></div>
                )
              ) : (
                <div>Calculating time remaining...</div>
              )}

              {remoteSocketId ? <div className='text-gray-200'>Status : Connected</div> : <div className='text-gray-200'>Status : No one is connected</div>}
              <LanguageSelector language={language} onSelect={onSelect} />
              {remoteSocketId && <button onClick={handleCallUser} className="bg-green-500 text-gray-200 px-4 py-2 m-4 rounded-lg">Click To Connect</button>}
            </div>
            {myStream && (
              <>
                <ReactPlayer
                  playing
                  muted
                  height="100px"
                  width="200px"
                  url={myStream}
                  style={{ position: 'fixed', bottom: '10px', left: "10px", borderRadius: '10px', zIndex: '1000' }}
                />
              </>
            )}

            {/* Main Area */}
            <div className="flex flex-grow space-x-4">
              {/* Code Editor Section */}
              <div className="flex-grow">
                <Editor
                  options={{ minimap: { enabled: false } }}
                  // height="75vh"
                  theme="vs-dark"
                  language={language}
                  defaultValue={CODE_SNIPPETS[language]}
                  onMount={onMount}
                  value={value}
                  onChange={(value) => handelChange(value)}
                />
                {/* <div className="mt-4 flex justify-center"> */}
                {/* Pass isLoading and runCode to RunCodeButton */}
                {/* <RunCodeButton /> */}
                {/* </div> */}
              </div>

              {/* Video and Output Section */}
              <div className="flex flex-col justify-between w-2/5 space-y-4">
                {/* Video Component */}
                <Video remoteStream={remoteStream} />

                {/* Output Section */}
                <Output editorRef={editorRef} language={language} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div >

  );
};

export default RoomPage;