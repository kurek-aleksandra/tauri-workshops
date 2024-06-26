import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { ask } from "@tauri-apps/plugin-dialog";
import { isPermissionGranted, sendNotification, requestPermission } from "@tauri-apps/plugin-notification";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(()=>{
    async function checkNotificationPermission() {
    const hasPermission = await isPermissionGranted();

    if (!hasPermission) {
      const permission = await requestPermission();

      if (permission === "granted") {
        console.log("Permission granted");
        sendNotification({
          title: "Hello from Rust!",
          body: "This is a notification from JavaScript and Rust",
        });
      } else {
        console.log("Permission denied");
      }
    } else {
      console.log("Already has permission");
      console.log("sendNotification ");
      sendNotification({
        title: "Hello from Rust!",
        body: "This is a notification from JavaScript and Rust",
      });
    }
  }

    checkNotificationPermission();

  }, []);

  useEffect(() => {
    const tryAsk = async () => {
      const response = await ask('BRBRBRBRGBR', {
        title: 'Tauri',
        okLabel: 'Yes',
        cancelLabel: 'Not yet',
      });
 
      console.log(response);
    };
 
    tryAsk();
  }, []);

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
