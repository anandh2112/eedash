import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Installations from './pages/Installations';
import Operations from './pages/Operations';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import Tickets from './pages/Tickets';
import ElementsScore from './pages/ElementsScore';
import Alerts from './pages/Alerts';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Wrap all pages inside Layout */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="installations" element={<Installations />} />
                    <Route path="operations" element={<Operations />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="tickets" element={<Tickets />} />
                    <Route path="elements-score" element={<ElementsScore />} />
                    <Route path="alerts" element={<Alerts />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
