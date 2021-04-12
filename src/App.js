import logo from './logo.svg';
import './App.css';
import {Header} from './components/Header.jsx';
import {Albums} from './components/Albums.jsx';
import {Images} from "./components/Images";
import {BrowserRouter} from "react-router-dom";
import {Footer} from "./components/Footer";

function App() {
  return (
      <BrowserRouter>
          <Header />
          {/*<Albums />*/}
          {/*<Images albumid="1" />*/}
          <Images albumid="2" />
          <Footer />
      </BrowserRouter>
  );
}

export default App;
