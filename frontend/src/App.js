import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminIndex from './pages/AdminIndex';
import AdminLeave from './pages/AdminLeave';
import AdminAtt from './pages/AdminAtt';
import SignIn from './pages/SignIn';
import Employee from './pages/Employee';
import Setting from './pages/Setting';
import Dashboard from './pages/Dashboard';
import Clock from './pages/Clock';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import AdminReport from './pages/AdminReport';
import AttReport from './pages/AttReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<SignIn />} />
          <Route path="/adminIndex" element={<AdminIndex />} />
          <Route path="/adminLeave" element={<AdminLeave />} />
          <Route path="/adminAtt/:id" element={<AdminAtt />} />
          <Route path="/adminReport/:id" element={<AdminReport />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clock" element={<Clock />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/attReport" element={<AttReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
