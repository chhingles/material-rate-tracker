import React from 'react';
import { Search, User, Calendar, Edit2, Trash2, RefreshCw } from 'lucide-react';
import './MaterialsView.css';

export default function MaterialsView({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filteredMaterials,
  sortOrder,
  toggleSort,
  startEdit,
  deleteItem
}) {
  return (
    <div className="materials-layout">
      <div className="materials-filter-panel">
        <div className="materials-search">
          <span className="materials-search-icon">
            <Search className="h-4 w-4" />
            
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by material or supplier..."
            className="materials-input"
          />
        </div>
          <div className="materials-count-pill">
          Count: <span className="materials-count-value">{filteredMaterials.length}</span>
        </div>

        <div className="materials-date-grid">
          <label className="materials-date-label">Start date</label>
          <label className="materials-date-label">End date</label>
          
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="materials-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="materials-input"
          />
        </div>
      </div>

      <div className="materials-table-card">
        <div className="materials-table-scroll">
          <table className="materials-table">
            <thead>
              <tr className="materials-table-header">
                <th className="materials-table-heading">Material</th>
                <th className="materials-table-heading materials-table-heading-sortable" onClick={toggleSort}>
                  Rate
                  <span className={`materials-sort-arrow ${sortOrder === 'asc' ? 'asc' : 'desc'}`}>
                    {sortOrder === 'asc' ? '△' : '▽'}
                  </span>
                </th>
                <th className="materials-table-heading">Vendor</th>
                <th className="materials-table-heading">Last Updated</th>
                <th className="materials-table-heading materials-table-heading-right">Actions</th>
              </tr>
            </thead>
            <tbody className="materials-table-body">
              {filteredMaterials.map((item) => (
                <tr key={item.id} className="materials-table-row">
                  <td className="materials-table-cell">
                    <div className="materials-table-name">{item.name}</div>
                  </td>
                  <td className="materials-table-cell">
                    <span className="materials-rate-chip">
                      ₹{item.rate}
                    </span>
                  </td>
                  <td className="materials-table-cell materials-table-vendor">
                    <div className="materials-vendor-wrap">
                      <User className="materials-vendor-icon" />
                      {item.vendor}
                    </div>
                  </td>
                  <td className="materials-table-cell materials-table-date">
                    <div className="materials-date-wrap">
                      <Calendar className="materials-date-icon" />
                      {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="materials-table-cell materials-table-actions">
                    <div className="materials-action-group">
                      <button
                        onClick={() => startEdit(item)}
                        className="materials-icon-button materials-icon-button-edit"
                        title="Edit Record"
                      >
                        <Edit2 className="materials-action-icon" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id, item.name)}
                        className="materials-icon-button materials-icon-button-delete"
                        title="Delete Record"
                      >
                        <Trash2 className="materials-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="materials-empty-state">
            <RefreshCw className="materials-empty-icon" style={{ animationDuration: '3s' }} />
            <p className="materials-empty-title">No material logs found matching parameters.</p>
            <p className="materials-empty-copy">Refine your query string or register a new material entry ledger.</p>
          </div>
        )}
      </div>
    </div>
  );
}
