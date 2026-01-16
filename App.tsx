
import React, { useState, useEffect } from 'react';
import { User, UserRole, InventorySession, Assignment, InventoryType, SAPRow } from './types';
import { mockService } from './services/mockService';
import Layout from './components/Layout';
import InventoryTable from './components/InventoryTable';
import SapImport from './components/SapImport';
import { INVENTORY_TYPE_CONFIG } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sessions, setSessions] = useState<InventorySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InventorySession | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth Form State
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState('');

  // Load Initial Data
  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    setIsLoading(true);
    const data = await mockService.getSessions();
    setSessions(data);
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const loggedUser = await mockService.login(loginForm.user, loginForm.pass);
    if (loggedUser) {
      setUser(loggedUser);
    } else {
      setLoginError('Credenciales inválidas. La contraseña debe tener 8 caracteres.');
    }
  };

  const handleSelectSession = async (session: InventorySession) => {
    setSelectedSession(session);
    setIsLoading(true);
    const data = await mockService.getAssignments(session.id);
    setAssignments(data);
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-10">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <i className="fa-solid fa-warehouse text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Inventari<span className="text-blue-600">App</span></h1>
            </div>
            
            <h2 className="text-lg font-semibold text-slate-800 mb-6 text-center">Acceso Plataforma Central</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Usuario SAP/LDAP</label>
                <input
                  type="text"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ej: jsmith"
                  value={loginForm.user}
                  onChange={(e) => setLoginForm({ ...loginForm, user: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña (8 caracteres)</label>
                <input
                  type="password"
                  maxLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={loginForm.pass}
                  onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })}
                  required
                />
              </div>
              {loginError && <p className="text-red-500 text-xs font-medium">{loginError}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                Ingresar al Sistema
              </button>
            </form>
          </div>
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400">© 2024 InventariApp Corporate - Enterprise Edition</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={() => setUser(null)} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Inventarios Activos</p>
              <h3 className="text-3xl font-bold text-slate-800">{sessions.filter(s => s.estado === 'ACTIVO').length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Controles Hoy</p>
              <h3 className="text-3xl font-bold text-slate-800">42</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Precisión Stock</p>
              <h3 className="text-3xl font-bold text-emerald-600">98.4%</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Alertas Pendientes</p>
              <h3 className="text-3xl font-bold text-red-500">3</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Monitoreo de AppSheet (Tiempo Real)</h3>
              <button className="text-blue-600 text-sm font-bold"><i className="fa-solid fa-rotate mr-2"></i>Refrescar</button>
            </div>
            <div className="p-8 text-center text-slate-400 italic">
              Conexión activa con Base_Inventario. PosicionesAsignadas vinculada.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventories' && (
        <div className="space-y-6">
          {!selectedSession ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Gestión de Inventarios</h3>
                <button 
                  onClick={() => alert('Abrir Modal de Creación')}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  <i className="fa-solid fa-plus"></i>
                  Nuevo Inventario
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map(session => {
                  const config = INVENTORY_TYPE_CONFIG[session.tipo];
                  return (
                    <div 
                      key={session.id} 
                      onClick={() => handleSelectSession(session)}
                      className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-${config.color}-50 text-${config.color}-600 flex items-center justify-center`}>
                          <i className={`fa-solid ${config.icon} text-xl`}></i>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${session.estado === 'ACTIVO' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {session.estado}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{session.nombre}</h4>
                      <p className="text-xs text-slate-400 mb-4">{session.tipo}</p>
                      
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                        <div className="text-xs text-slate-500">
                          <i className="fa-solid fa-calendar mr-1"></i> {session.fechaCreacion}
                        </div>
                        <div className="text-xs font-bold text-slate-700">
                          {session.itemsCount} Posiciones
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-4 mb-2">
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left text-xl"></i>
                </button>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedSession.nombre}</h3>
                  <p className="text-sm text-slate-500">ID: {selectedSession.id} • {selectedSession.tipo}</p>
                </div>
                <div className="ml-auto flex gap-3">
                  <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                    <i className="fa-solid fa-file-export mr-2"></i>Exportar
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-colors">
                    <i className="fa-solid fa-paper-plane mr-2"></i>Sincronizar SAP
                  </button>
                </div>
              </div>

              {assignments.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200">
                   <SapImport 
                     inventoryType={selectedSession.tipo} 
                     onDataReady={async (data) => {
                       await mockService.pushToAppSheet(selectedSession.id, 'ctrl01', data);
                       const updated = await mockService.getAssignments(selectedSession.id);
                       setAssignments(updated);
                     }}
                   />
                </div>
              ) : (
                <InventoryTable assignments={assignments} isLoading={isLoading} />
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
           <i className="fa-solid fa-user-lock text-5xl text-slate-200 mb-4 block"></i>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Gestión de Usuarios Auditores</h3>
           <p className="text-slate-500 max-w-md mx-auto">Esta sección permite el alta de CONTROLADORES sincronizados con Google Sheet: <strong>datos_user</strong>.</p>
           <button className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Ver Tabla de Usuarios</button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-4 items-center">
            <i className="fa-solid fa-circle-info text-blue-500"></i>
            <p className="text-sm text-blue-700">El histórico conserva una instantánea de cada control finalizado para cumplimiento de normativas de auditoría interna.</p>
          </div>
          {sessions.filter(s => s.estado === 'FINALIZADO').map(s => (
            <div key={s.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                  <i className="fa-solid fa-box-archive"></i>
                </div>
                <div>
                  <p className="font-bold text-slate-800">{s.nombre}</p>
                  <p className="text-xs text-slate-400">{s.fechaCreacion} • {s.tipo}</p>
                </div>
              </div>
              <button className="text-blue-600 font-bold text-sm px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
                Ver Reporte Final
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default App;
