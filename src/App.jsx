import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import './App.css';
import initialMaterials from './data/materials.json';
import RegisterMaterial from './components/RegisterMaterial';
import MaterialsView from './components/MaterialsView';

function App() {
  // State initialization: start with bundled JSON, then load authoritative data from local API when available
  const [materials, setMaterials] = useState(initialMaterials);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    rate: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date().toLocaleString());
  const [sortBy, setSortBy] = useState('rate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Update real-time clock indicator
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load materials from local API (server must be running). Falls back to bundled JSON on failure.
  useEffect(() => {
    fetch('http://localhost:3000/api/materials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMaterials(data);
      })
      .catch(err => console.warn('Could not load materials from server, using bundled data', err));
  }, []);

  // Persist materials to the local API and also keep a local runtime backup in localStorage
  useEffect(() => {
    fetch('http://localhost:3000/api/materials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materials)
    }).catch(err => console.warn('Failed to persist to server', err));

    try {
      localStorage.setItem('react_material_rates', JSON.stringify(materials));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }, [materials]);

  // Handle Input Changes safely (excluding date field)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') return; // Ignore date changes
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit Handler: Adds new items or edits current line item
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rate || !formData.vendor) return;

    const todayDate = new Date().toISOString().split('T')[0];

    if (isEditing) {
      setMaterials(prev => prev.map(item => 
        item.id === formData.id 
          ? { ...formData, rate: parseFloat(formData.rate).toFixed(2), date: todayDate } 
          : item
      ));
      setIsEditing(false);
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        rate: parseFloat(formData.rate).toFixed(2),
        vendor: formData.vendor.trim(),
        date: todayDate
      };
      setMaterials(prev => [newItem, ...prev]);
    }

    // Reset Form to initial empty structure
    setFormData({
      id: '',
      name: '',
      rate: '',
      vendor: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Trigger Edit Context for Selected Row
  const startEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
  };

  // Delete Action Item
  const deleteItem = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from tracking?`)) {
      setMaterials(prev => prev.filter(item => item.id !== id));
      if (formData.id === id) cancelEdit();
    }
  };

  // Escape Edit mode and reset form state safely
  const cancelEdit = () => {
    setFormData({
      id: '',
      name: '',
      rate: '',
      vendor: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  // Filter dataset by dynamic user search terms and optional date range
  const filteredMaterials = materials.filter(item => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesText =
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.vendor.toLowerCase().includes(normalizedQuery);

    if (!matchesText) return false;

    if (startDate || endDate) {
      const itemDate = new Date(item.date);
      if (startDate) {
        const minDate = new Date(startDate);
        if (itemDate < minDate) return false;
      }
      if (endDate) {
        const maxDate = new Date(endDate);
        if (itemDate > maxDate) return false;
      }
    }

    return true;
  });

  // Sort filtered materials by rate
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    const aVal = parseFloat(a.rate);
    const bVal = parseFloat(b.rate);
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="app-shell">
      {/* Navbar header section */}
      <nav className="app-nav">
        <div className="app-nav-inner">
          <div className="app-nav-brand">
            <div className="app-nav-icon">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="app-nav-title">
              <h1>Material Rate Tracker</h1>
              <p>React Production Workspace</p>
            </div>
          </div>
          <div className="app-clock">
            {liveTime}
          </div>
        </div>
      </nav>

      {/* Main Container Core Workspace Layout */}
      <main className="app-main">
        
        {/* Left Input panel Column */}
        <RegisterMaterial
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          cancelEdit={cancelEdit}
          materials={materials}
        />

        {/* Right Dashboard panel Column */}
        <MaterialsView
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          filteredMaterials={sortedMaterials}
          sortOrder={sortOrder}
          toggleSort={toggleSort}
          startEdit={startEdit}
          deleteItem={deleteItem}
        />
      </main>
    </div>
  );
}

export default App;
