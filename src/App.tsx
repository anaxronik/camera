import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-cyan/theme.css";

import Camera from "./components/Camera/Camera";

function App() {
  return (
    <PrimeReactProvider>
      <Camera />
    </PrimeReactProvider>
  );
}

export default App;
