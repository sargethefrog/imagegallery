import './App.css';
import {Albums} from './components/Albums.jsx';
import {Images} from "./components/Images";
import {BrowserRouter,Route} from "react-router-dom";
import {Footer} from "./components/Footer";
import {EditAlbum} from "./components/EditAlbum";
import {AddAlbum} from "./components/AddAlbum";
import {AddImage} from "./components/AddImage";
import {Reg} from "./components/Reg";
import {Auth} from "./components/Auth";
import {Logout} from "./components/Logout";
import {EditImage} from "./components/EditImage";
import {Search} from "./components/Search";

function App() {
  return (
      <BrowserRouter>
          <div id="main">
          <Route path="/" exact render={() => <Albums />}/>
          <Route path="/edit_album/:id" component={EditAlbum}/>
          <Route path="/album/:id" component={Images}/>
          <Route path="/add_album" render={() => <AddAlbum />} />
          <Route path="/add_image/:id" component={AddImage} />
          <Route path="/reg" render={() => <Reg />} />
          <Route path="/auth" render={() => <Auth />} />
          <Route path="/logout" render={() => <Logout />} />
          <Route path="/edit_image/:id" component={EditImage} />
          <Route path="/search/:search" component={Search} />
          </div>
          <Footer />
      </BrowserRouter>
  );
}

export default App;
