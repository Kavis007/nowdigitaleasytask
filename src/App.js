import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loginpage from './Login/Loginpage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Postinnormal from './Components/Postinnormal';
import PostsRQ from './Components/PostsRQ';
import Menudisp from './Menupagecomp/Menudisp';
import Signin from './Login/Signin'
import Todo from './Menupagecomp/Todo';
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Loginpage/>}></Route>
      <Route path='/Signin' element={<Signin/>}></Route>
      <Route path='/Menudisp/:userId' element={<Menudisp/>}></Route>
      <Route path="/todo/:userId/:groupId" element={<Todo />} />
    </Routes>
    </BrowserRouter>
    {/* <PostsRQ/> */}
    </>
  );
}

export default App;
