import React from 'react';
import ReactPlayer from "react-player";

export default function Video({ remoteStream }) {
  return (
    <div className="flex flex-wrap bg-[#1f1b2e] border border-gray-700 rounded h-1/2 p-4">
      {remoteStream && (
        <ReactPlayer
          playing
          muted
          height="100%"
          width="100%"
          url={remoteStream}
        />
      )}
    </div>
  );
}
