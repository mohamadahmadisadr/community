import './App.css';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import HomePageComponent from './components/home/HomePageComponent';
import {Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import  AboutPage  from './pages/AboutPage';
import JobDetailPage from './components/JobDetail/JobDetailComponent';
import AddJobPage from './components/AddJobPage';

function App() {


  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePageComponent/>}/>
      <Route path="/login" element={<LoginComponent/>}/>
      <Route path="/register" element={<RegisterComponent/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/job/:id" element={<JobDetailPage/>}/>
      <Route path='/addJob' element={<AddJobPage/>}/>
      <Route path="*" element={<div>404 Not Found</div>}/>
    </Routes>
    </AuthProvider>
  )
}

export default App
