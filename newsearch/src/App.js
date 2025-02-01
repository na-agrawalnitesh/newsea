import './App.css';
import Login from './component/Login';
import Dashboard from './component/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Signup from './component/signup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/nits' element={<Signup/>}/>
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />} 
        />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
