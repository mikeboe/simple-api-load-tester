import React from "react";
import useWebSocket from "react-use-websocket";

const socketUrl = "ws://localhost:8000/loadTest";  // Update the URL if necessary

const App = () => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const handleClickSendMessage = () => {
    const message = {
      config: {
        RequestsPerSecond: 10, // Example value
        DurationInSeconds: 3, // Example value
        UseStatisticalDistribution: true,
      },
      endpoints: [
        {
          URL: "https://dev-api.rocketcrm.io/status",
          Method: "GET",
          Data: {}
        }
      ]
    };
    sendMessage(JSON.stringify(message));
  };

  return (
    <div>
      <button onClick={handleClickSendMessage}>Send Message</button>
      {lastMessage ? <p>Last message: {lastMessage.data}</p> : <p>No messages yet</p>}
      <p>Ready state: {readyState}</p>
    </div>
  );
};

export default App;
