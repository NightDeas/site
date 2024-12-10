import logo from './logo.svg';
import './App.css';
import { Button } from 'react-bootstrap';
import Login from './Pages/LoginPage';
import Menu from './Menu'
import Tasks from './Pages/TasksPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="*" element={<Login/>}></Route>
      <Route path="Login" element={<Login/>}></Route>
      <Route path="Menu" element={<Menu/>}></Route>
      <Route path="Tasks" element={<Tasks/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
