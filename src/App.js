import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LawyerForm from "./pages/Lawyerform";
import Clientform from "./pages/clientform/Clientform";
import React, { useState } from "react";
import Filter from "./pages/filter/Filter";
import ClientDash from "./pages/ClientDash";
import LawyerDash from "./pages/LawyerDash/LawyerDash";
import Settings from "./pages/LawyerDash/Settings";
import ClientsLawyer from "./pages/LawyerDash/ClientsLawyer";
import Popupsection from "./pages/Popupsection";
import Upload from "./pages/clientform/Upload";
import Review from "./pages/clientform/Review";


function App() {

  const [uploadedFiles, setUploadedFiles] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/lawyer-form" element={<LawyerForm/>}></Route>
        <Route path="/caseform/:id" element={<Clientform />} />
        <Route path="/upload" element={<Upload setUploadedFiles={setUploadedFiles}/>}></Route>
        <Route path="/review" element={<Review uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}/>}></Route>
        <Route path="/filter" element={<Filter/>}></Route>
        <Route path="/client-dashboard" element={<ClientDash/>}></Route>
        <Route path="/lawyer-dashboard" element={<LawyerDash/>}></Route>
        <Route path="/lawyer-dashboard/clients" element={<ClientsLawyer/>}></Route>
        <Route path="/settings" element={<Settings/>}></Route>
        <Route path="/popup" element={<Popupsection/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
