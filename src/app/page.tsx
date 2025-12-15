'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Package, TrendingUp, History, Plus, FileText } from 'lucide-react';

type ProductType = 'punta' | 'chato' | 'telera' | 'grande';

interface Product {
  id: string;
  name: string;
  type: ProductType;
  icon: string;
}

interface ProductionEntry {
  id: string;
  date: string;
  products: { [key in ProductType]: number };
  notes?: string;
}

interface SalesEntry {
  id: string;
  date: string;
  products: { [key in ProductType]: number };
  notes?: string;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Bolillo de Punta', type: 'punta', icon: '🥖' },
  { id: '2', name: 'Bolillo Chato', type: 'chato', icon: '🥐' },
  { id: '3', name: 'Telera', type: 'telera', icon: '🍞' },
  { id: '4', name: 'Bolillo Grande', type: 'grande', icon: '🥯' },
];

export default function SistemaPanaderia() {
  const [activeView, setActiveView] = useState('dashboard');
  const [productions, setProductions] = useState<ProductionEntry[]>([]);
  const [sales, setSales] = useState<SalesEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para formulario de producción
  const [productionForm, setProductionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    punta: 0, chato: 0, telera: 0, grande: 0,
    notes: ''
  });
  
  // Estados para formulario de ventas
  const [salesForm, setSalesForm] = useState({
    date: new Date().toISOString().split('T')[0],
    punta: 0, chato: 0, telera: 0, grande: 0,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const prodResult = await window.storage.get('productions');
      const salesResult = await window.storage.get('sales');
      
      if (prodResult?.value) {
        setProductions(JSON.parse(prodResult.value));
      }
      if (salesResult?.value) {
        setSales(JSON.parse(salesResult.value));
      }
    } catch (error) {
      console.log('No hay datos previos, iniciando con datos vacíos');
    }
    setIsLoading(false);
  };

  const saveProductions = async (data: ProductionEntry[]) => {
    try {
      await window.storage.set('productions', JSON.stringify(data));
      setProductions(data);
    } catch (error) {
      console.error('Error al guardar producción:', error);
    }
  };

  const saveSales = async (data: SalesEntry[]) => {
    try {
      await window.storage.set('sales', JSON.stringify(data));
      setSales(data);
    } catch (error) {
      console.error('Error al guardar ventas:', error);
    }
  };

  const calculateStock = () => {
    const stock: { [key in ProductType]: number } = {
      punta: 0, chato: 0, telera: 0, grande: 0
    };

    productions.forEach(entry => {
      Object.entries(entry.products).forEach(([type, qty]) => {
        stock[type as ProductType] += qty;
      });
    });

    sales.forEach(entry => {
      Object.entries(entry.products).forEach(([type, qty]) => {
        stock[type as ProductType] -= qty;
      });
    });

    return stock;
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayProduction = productions.filter(p => p.date === today);
    const todaySales = sales.filter(s => s.date === today);

    const totalProduction = todayProduction.reduce((sum, entry) => 
      sum + Object.values(entry.products).reduce((a, b) => a + b, 0), 0);
    const totalSales = todaySales.reduce((sum, entry) => 
      sum + Object.values(entry.products).reduce((a, b) => a + b, 0), 0);

    return { totalProduction, totalSales };
  };

  const handleProductionSubmit = () => {
    const newEntry: ProductionEntry = {
      id: Date.now().toString(),
      date: productionForm.date,
      products: {
        punta: productionForm.punta,
        chato: productionForm.chato,
        telera: productionForm.telera,
        grande: productionForm.grande,
      },
      notes: productionForm.notes
    };
    saveProductions([...productions, newEntry]);
    setProductionForm({ 
      date: new Date().toISOString().split('T')[0], 
      punta: 0, chato: 0, telera: 0, grande: 0, 
      notes: '' 
    });
    alert('Producción registrada exitosamente! ✅');
  };

  const handleSalesSubmit = () => {
    const newEntry: SalesEntry = {
      id: Date.now().toString(),
      date: salesForm.date,
      products: {
        punta: salesForm.punta,
        chato: salesForm.chato,
        telera: salesForm.telera,
        grande: salesForm.grande,
      },
      notes: salesForm.notes
    };
    saveSales([...sales, newEntry]);
    setSalesForm({ 
      date: new Date().toISOString().split('T')[0], 
      punta: 0, chato: 0, telera: 0, grande: 0, 
      notes: '' 
    });
    alert('Venta registrada exitosamente! ✅');
  };

  const renderNavigation = () => (
    <nav className="bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="text-3xl">🥖</div>
            <h1 className="text-2xl font-bold text-amber-800">Sistema Panadería</h1>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'production', icon: Plus, label: 'Producción' },
              { id: 'sales', icon: TrendingUp, label: 'Ventas' },
              { id: 'stock', icon: Package, label: 'Stock' },
              { id: 'history', icon: History, label: 'Historial' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === item.id 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <item.icon size={18} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderDashboard = () => {
    const stock = calculateStock();
    const stats = getTodayStats();
    const totalStock = Object.values(stock).reduce((a, b) => a + b, 0);

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Producción Hoy</p>
                <p className="text-3xl font-bold mt-1">{stats.totalProduction}</p>
              </div>
              <Plus className="text-blue-200" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Ventas Hoy</p>
                <p className="text-3xl font-bold mt-1">{stats.totalSales}</p>
              </div>
              <TrendingUp className="text-green-200" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Stock Total</p>
                <p className="text-3xl font-bold mt-1">{totalStock}</p>
              </div>
              <Package className="text-amber-200" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Registros</p>
                <p className="text-3xl font-bold mt-1">{productions.length + sales.length}</p>
              </div>
              <FileText className="text-purple-200" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Stock por Producto</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.map(product => (
              <div key={product.id} className="border-2 border-gray-200 rounded-lg p-4 text-center hover:border-amber-400 transition-colors">
                <div className="text-4xl mb-2">{product.icon}</div>
                <p className="font-semibold text-gray-700">{product.name}</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{stock[product.type]}</p>
                <p className="text-sm text-gray-500">unidades</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProductionForm = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Registrar Producción</h2>
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              value={productionForm.date}
              onChange={(e) => setProductionForm({...productionForm, date: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          {PRODUCTS.map(product => (
            <div key={product.id}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {product.icon} {product.name}
              </label>
              <input
                type="number"
                min="0"
                value={productionForm[product.type]}
                onChange={(e) => setProductionForm({...productionForm, [product.type]: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                placeholder="Cantidad producida"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notas (opcional)</label>
            <textarea
              value={productionForm.notes}
              onChange={(e) => setProductionForm({...productionForm, notes: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
              rows={3}
              placeholder="Observaciones..."
            />
          </div>

          <button
            onClick={handleProductionSubmit}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            Registrar Producción
          </button>
        </div>
      </div>
    );
  };

  const renderSalesForm = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Registrar Ventas</h2>
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              value={salesForm.date}
              onChange={(e) => setSalesForm({...salesForm, date: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          {PRODUCTS.map(product => (
            <div key={product.id}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {product.icon} {product.name}
              </label>
              <input
                type="number"
                min="0"
                value={salesForm[product.type]}
                onChange={(e) => setSalesForm({...salesForm, [product.type]: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="Cantidad vendida"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notas (opcional)</label>
            <textarea
              value={salesForm.notes}
              onChange={(e) => setSalesForm({...salesForm, notes: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              rows={3}
              placeholder="Observaciones..."
            />
          </div>

          <button
            onClick={handleSalesSubmit}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Registrar Venta
          </button>
        </div>
      </div>
    );
  };

  const renderStock = () => {
    const stock = calculateStock();
    const totalProduction = productions.reduce((sum, entry) => 
      sum + Object.values(entry.products).reduce((a, b) => a + b, 0), 0);
    const totalSales = sales.reduce((sum, entry) => 
      sum + Object.values(entry.products).reduce((a, b) => a + b, 0), 0);

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Control de Stock</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Total Producido</h3>
            <p className="text-4xl font-bold text-blue-600">{totalProduction}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Total Vendido</h3>
            <p className="text-4xl font-bold text-green-600">{totalSales}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Detalle por Producto</h3>
          <div className="space-y-4">
            {PRODUCTS.map(product => {
              const prodTotal = productions.reduce((sum, entry) => 
                sum + entry.products[product.type], 0);
              const salesTotal = sales.reduce((sum, entry) => 
                sum + entry.products[product.type], 0);
              const current = stock[product.type];
              const percentage = prodTotal > 0 ? (salesTotal / prodTotal * 100).toFixed(1) : 0;

              return (
                <div key={product.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{product.icon}</span>
                      <div>
                        <p className="font-bold text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">Stock actual: {current} unidades</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      current > 50 ? 'bg-green-100 text-green-800' : 
                      current > 20 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {current > 50 ? '✓ OK' : current > 20 ? '⚠ Bajo' : '⚠ Crítico'}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Producido</p>
                      <p className="text-xl font-bold text-blue-600">{prodTotal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vendido</p>
                      <p className="text-xl font-bold text-green-600">{salesTotal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">% Venta</p>
                      <p className="text-xl font-bold text-purple-600">{percentage}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    const allEntries = [
      ...productions.map(p => ({ ...p, type: 'production' as const })),
      ...sales.map(s => ({ ...s, type: 'sales' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Historial de Movimientos</h2>
        
        {allEntries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <History size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No hay registros todavía</p>
            <p className="text-gray-400 mt-2">Comienza registrando producción o ventas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allEntries.map(entry => (
              <div key={entry.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      entry.type === 'production' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {entry.type === 'production' ? 
                        <Plus className="text-blue-600" size={24} /> : 
                        <TrendingUp className="text-green-600" size={24} />
                      }
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {entry.type === 'production' ? 'Producción' : 'Venta'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString('es-MX', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">
                      {Object.values(entry.products).reduce((a, b) => a + b, 0)}
                    </p>
                    <p className="text-sm text-gray-500">unidades</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PRODUCTS.map(product => (
                    entry.products[product.type] > 0 && (
                      <div key={product.id} className="bg-gray-50 rounded-lg p-3 text-center">
                        <span className="text-2xl">{product.icon}</span>
                        <p className="text-sm text-gray-600 mt-1">{product.name}</p>
                        <p className="text-lg font-bold text-gray-800">{entry.products[product.type]}</p>
                      </div>
                    )
                  ))}
                </div>
                {entry.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Notas:</span> {entry.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🥖</div>
          <p className="text-xl text-gray-600">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {renderNavigation()}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'production' && renderProductionForm()}
        {activeView === 'sales' && renderSalesForm()}
        {activeView === 'stock' && renderStock()}
        {activeView === 'history' && renderHistory()}
      </div>
    </div>
  );
}