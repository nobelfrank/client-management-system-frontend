import React from 'react';
import { Search, PlusCircle } from 'lucide-react';

const ClientSearch = ({ searchTerm, handleSearch, onAddClient }) => {
  return (
    <div className="clients-page-header">
      <div className="clients-page-search">
        <Search color="var(--primary-color)" size={20} />
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <button 
        className="clients-page-add-button"
        onClick={onAddClient}
      >
        <PlusCircle size={20} /> Add Client
      </button>
    </div>
  );
};

export default ClientSearch;