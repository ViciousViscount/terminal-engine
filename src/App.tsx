import "./App.css";

import { Terminal } from "./features/terminal/Terminal";

function App() {
  return (
    <>
      <div>
        {/* You can keep your react logo or any other header content */}
      </div>
      <h1>React Terminal Engine</h1>
      <div className="card">
        {/*
          It's a self-contained unit that requires no props.
        */}
        <Terminal />
      </div>
      <p className="read-the-docs">
        A standalone terminal component built with React and TypeScript.
      </p>
    </>
  );
}

export default App;
