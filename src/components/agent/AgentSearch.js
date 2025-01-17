import React from 'react';
import { Search } from 'lucide-react';

const AgentSearch = ({ searchTerm, handleSearch }) => (
  <div className="agents-page-search">
    <Search color="var(--primary-color)" size={20} />
    <input
      type="text"
      placeholder="Search by name or email"
      value={searchTerm}
      onChange={handleSearch}
    />
  </div>
);

export default AgentSearch;