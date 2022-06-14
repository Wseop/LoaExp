import { Routes, Route, BrowserRouter } from "react-router-dom";

import Navigation from "./components/Navigation.js";

import Main from "./pages/Main.js";
import UserInfo from "./pages/UserInfo.js";

function App() {
  return (
    <BrowserRouter basename={process.env.REACT_APP_URL_BASE}>
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/userInfo" element={<UserInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
