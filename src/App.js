import logo from './logo.svg';
import './App.css';
import {Header} from './components/Header.jsx';
import {Albums} from './components/Albums.jsx';
import {Images} from "./components/Images";
import {BrowserRouter,Route} from "react-router-dom";
import {Footer} from "./components/Footer";
import {EditAlbum} from "./components/EditAlbum";
import {AddAlbum} from "./components/AddAlbum";
import {AddImage} from "./components/AddImage";

function App() {
  return (
      <BrowserRouter>
          <Header />
          <Route path="/" exact render={() => <Albums />}/>
          <Route path="/edit_album/:id" component={EditAlbum}/>
          <Route path="/album/:id" component={Images}/>
          <Route path="/add_album" render={() => <AddAlbum />} />
          <Route path="/add_image/:id" component={AddImage} />
          {/*<Albums />*/}
          {/*<Images albumid="1" />*/}
          {/*<Images albumid="2" />*/}
          <Footer />
      </BrowserRouter>
  );
}

export default App;
