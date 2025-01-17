const SearchBar = ({ searchTerm, onSearch, onCreateNew }) => (
    <div className="controls">
      <input
        type="text"
        placeholder="Search policies by client or type..."
        value={searchTerm}
        onChange={onSearch}
        className="search-bar"
      />
      <button 
        className="btn create-policy-btn large-btn" 
        onClick={onCreateNew}
      >
        <PlusCircle className="btn-icon" /> Create New Policy
      </button>
    </div>
  );