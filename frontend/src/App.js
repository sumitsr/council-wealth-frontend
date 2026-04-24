import React from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from '@/pages/Dashboard';
import NewSession from '@/pages/NewSession';
import LiveSession from '@/pages/LiveSession';
import AuditViewer from '@/pages/AuditViewer';
import Integrations from '@/pages/Integrations';
import TenantAdmin from '@/pages/TenantAdmin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/council/new" element={<NewSession />} />
          <Route path="/council/live" element={<Navigate to="/council/live/CW-2041" replace />} />
          <Route path="/council/live/:sessionId" element={<LiveSession />} />
          <Route path="/compliance" element={<Navigate to="/compliance/audit" replace />} />
          <Route path="/compliance/audit" element={<AuditViewer />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/admin/tenant" element={<TenantAdmin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
