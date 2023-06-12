import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import Login from './Components/Login';
import Register from './Components/Register';
import Forgot from './Components/Forgot';
import Reset from './Components/Reset';
import User from './Components/User';


function App() {

  if(sessionStorage.getItem("SESSION_USER") !== null){

    const user = JSON.parse(sessionStorage.getItem("SESSION_USER"))

    return(
      <>                                                                                                                                                                                                                                                                                                                                                                                                     
        <Router>
          <Routes>
            <Route path={"/"} element={<User user = {user.nome} id = {user.id_user}/>}></Route>
            <Route path={"*"} element={<User user = {user.nome} id = {user.id_user}/>}></Route>
          </Routes>
        </Router>
        
      </>

    )
  }else{
    return(
      <>
        <Router>
          <Routes>
            <Route path={"/"} element={<Login/>}></Route>
            <Route path={"*"} element={<Login/>}></Route>
            <Route path={"/register"} element={<Register/>}></Route>
            <Route path={"/forgot"} element={<Forgot/>}></Route>
            <Route path={"/reset"} element={<Reset/>}></Route>
          </Routes>
        </Router>
      
      </>
    );
  }
}

export default App;
