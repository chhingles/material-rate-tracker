import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import './RegisterMaterial.css';

export default function RegisterMaterial({ formData, handleInputChange, handleSubmit, isEditing, cancelEdit, materials }) {
  const [activeSuggestions, setActiveSuggestions] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);

    if (name === 'name') {
      if (value.trim()) {
        const matches = [...new Set(materials.map(m => m.name))].filter(n =>
          n.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(matches);
        setActiveSuggestions('name');
      } else {
        setSuggestions([]);
        setActiveSuggestions(null);
      }
    } else if (name === 'vendor') {
      if (value.trim()) {
        const matches = [...new Set(materials.map(m => m.vendor))].filter(v =>
          v.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(matches);
        setActiveSuggestions('vendor');
      } else {
        setSuggestions([]);
        setActiveSuggestions(null);
      }
    }
  };

  const selectSuggestion = (suggestion) => {
    const field = activeSuggestions;
    handleInputChange({
      target: { name: field, value: suggestion }
    });
    setSuggestions([]);
    setActiveSuggestions(null);
  };

  return (
    <div className="register-panel">
      <div className="register-header">
        <PlusCircle className={`register-icon ${isEditing ? 'text-amber-500' : 'text-blue-600'}`} />
        <h2 className="register-title">
          {isEditing ? 'Modify Rate Record' : 'Register New Material'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <div>
          <label className="register-label">
            Material Nomenclature *
          </label>
          <div className="register-autocomplete">
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              required 
              placeholder="e.g., Alu Alu Foil, Blister PVC" 
              className="register-input"
              autoComplete="off"
            />
            {activeSuggestions === 'name' && suggestions.length > 0 && (
              <ul className="register-suggestions">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} onClick={() => selectSuggestion(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="register-label">
            Unit Cost Rate (₹) *
          </label>
          <div className="register-rate-wrap">
            <span className="register-currency">₹</span>
            <input
              type="number"
              step="0.01"
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
              required
              placeholder="0.00"
              className="register-input register-input-rate"
            />
          </div>
        </div>

        <div>
          <label className="register-label">
            Supplier / Manufacturer *
          </label>
          <div className="register-autocomplete">
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleFieldChange}
              required
              placeholder="e.g., Flexicaps"
              className="register-input"
              autoComplete="off"
            />
            {activeSuggestions === 'vendor' && suggestions.length > 0 && (
              <ul className="register-suggestions">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} onClick={() => selectSuggestion(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="register-label">
            Effective Log Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            disabled
            className="register-input"
          />
        </div>

        <div className="register-actions">
          <button
            type="submit"
            className={`register-submit ${isEditing ? 'register-submit-edit' : 'register-submit-new'}`}
          >
            {isEditing ? 'Apply Changes' : 'Commit Record'}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="register-cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
