import React, { useState, useEffect } from "react";
import { 
  UserCheck, 
  PlusCircle, 
  Edit, 
  Trash2 
} from 'lucide-react';
import '../../assets/Styles/Mapping.css'

const ClientAgentMappingPage = () => {
  const [mappings, setMappings] = useState([]);
  const [clients, setClients] = useState([]); // Initialize as empty array
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [mappingData, setMappingData] = useState({
    clientId: "",
    agentId: "",
    status: "Pending"
  });
  const [isLoading, setIsLoading] = useState(true);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // Status options
  const statusOptions = [
    "Pending",
    "ACTIVE",
    "INACTIVE"
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchMappings(),
          fetchClients(),
          fetchAgents()
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showNotification("Failed to load initial data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };
  const fetchMappings = async () => {
    try {
      console.log('Fetching mappings...');
      const response = await fetch("http://localhost:8080/api/mappings");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch mappings: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Extract the data array from the response object
      const mappingsArray = responseData.data || [];
      console.log('Processed Mappings Data:', mappingsArray);
      
      setMappings(mappingsArray);
    } catch (error) {
      console.error("Error fetching mappings:", error);
      showNotification("Failed to load mappings", "error");
      setMappings([]);
    }
  };
  
  const fetchClients = async () => {
    try {
      console.log('Fetching clients...');
      const response = await fetch("http://localhost:8080/api/clients");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch clients: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Extract the data array from the response object
      const clientsArray = responseData.data || [];
      console.log('Processed Clients Data:', clientsArray);
      
      setClients(clientsArray);
    } catch (error) {
      console.error("Error fetching clients:", error);
      showNotification("Failed to load clients", "error");
      setClients([]);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/agents");
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      setAgents(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching agents:", error);
      showNotification("Failed to load agents", "error");
      setAgents([]); // Set empty array on error
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const togglePopup = (type, mapping = null) => {
    setPopupType(type);
    setSelectedMapping(mapping);
    setShowPopup(!showPopup);
    
    if (type === 'create') {
      setMappingData({
        clientId: "",
        agentId: "",
        status: "Pending"
      });
    } else if (type === 'edit' && mapping) {
      setMappingData({
        clientId: mapping.clientId,
        agentId: mapping.agentId,
        status: mapping.status
      });
    }
  };

  const handleCreate = async () => {
    try {
      if (!mappingData.clientId || !mappingData.agentId) {
        showNotification("Please select both client and agent", "error");
        return;
      }

      const response = await fetch("http://localhost:8080/api/mappings", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappingData)
      });

      if (!response.ok) {
        throw new Error('Failed to create mapping');
      }

      await fetchMappings();
      setShowPopup(false);
      showNotification("Client-Agent Mapping created successfully");
    } catch (error) {
      console.error("Error creating mapping:", error);
      showNotification("Failed to create mapping", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!mappingData.clientId || !mappingData.agentId) {
        showNotification("Please select both client and agent", "error");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/mappings/${selectedMapping.mappingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...mappingData,
          mappingId: selectedMapping.mappingId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update mapping');
      }

      await fetchMappings();
      setShowPopup(false);
      showNotification("Client-Agent Mapping updated successfully");
    } catch (error) {
      console.error("Error updating mapping:", error);
      showNotification("Failed to update mapping", "error");
    }
  };

  const handleDelete = async (mappingId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/mappings/${mappingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete mapping');
      }

      await fetchMappings();
      showNotification("Client-Agent Mapping deleted successfully");
    } catch (error) {
      console.error("Error deleting mapping:", error);
      showNotification("Failed to delete mapping", "error");
    }
  };

  // Process mappings to create a more readable view
  const processedMappings = mappings.filter(Boolean).map(mapping => {
    const client = clients.find(c => c?.clientId === mapping?.clientId);
    const agent = agents.find(a => a?.agentId === mapping?.agentId);

    return {
      ...mapping,
      clientName: client 
        ? `${client.firstName || ''} ${client.lastName || ''}`
        : 'Unknown Client',
      agentName: agent 
        ? `${agent.firstName || ''} ${agent.lastName || ''}`
        : 'Unknown Agent'
    };
  });
  // Filter processed mappings based on search term
  const filteredMappings = processedMappings.filter(mapping => 
    mapping.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h1 className="fade-in">
        <UserCheck className="page-header-icon" /> Client-Agent Mapping
      </h1>
      
      <div className="controls">
        <input
          type="text"
          placeholder="Search mappings by client, agent, or status..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <button 
          className="btn create-mapping-btn large-btn" 
          onClick={() => togglePopup("create")}
        >
          <PlusCircle className="btn-icon" /> Assign A Client
        </button>
      </div>

      <div className="cards-row mapping-cards">
        {filteredMappings.map((mapping) => (
          <div 
            className="card mapping-card fade-in" 
            key={mapping.mappingId}
          >
            <div className="mapping-header">
              <UserCheck className="mapping-type-icon" />
              <h2>{mapping.agentName}</h2>
            </div>
            
            <div className="mapping-details">
              <p>
                <span className="detail-label">Client:</span> 
                {mapping.clientName}
              </p>
              <p>
                <span className="detail-label">Status:</span> 
                <span className={`status-badge ${mapping.status.toLowerCase()}`}>
                  {mapping.status}
                </span>
              </p>
            </div>

            <div className="card-actions">
              <button 
                className="btn edit-btn" 
                onClick={() => togglePopup("edit", mapping)}
              >
                <Edit className="btn-icon" /> Edit
              </button>
              <button 
                className="btn delete-btn" 
                onClick={() => handleDelete(mapping.mappingId)}
              >
                <Trash2 className="btn-icon" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup fade-in">
          <div className="popup-content">
            <h2>
              {popupType === "create" 
                ? "Create New Mapping" 
                : "Edit Mapping"}
            </h2>
            <label>
              Select Client:
              <select
                value={mappingData.clientId}
                onChange={(e) => setMappingData({ ...mappingData, clientId: e.target.value })}
              >
                <option value="">-- Select Client --</option>
                {Array.isArray(clients) && clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {`${client.firstName} ${client.lastName}`}
                  </option>
                ))}
              </select>
            </label>
            
            <label>
              Select Agent:
              <select
                value={mappingData.agentId}
                onChange={(e) => setMappingData({ ...mappingData, agentId: e.target.value })}
              >
                <option value="">-- Select Agent --</option>
                {Array.isArray(agents) && agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {`${agent.firstName} ${agent.lastName}`}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status:
              <select
                value={mappingData.status}
                onChange={(e) => setMappingData({ ...mappingData, status: e.target.value })}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <div className="popup-actions">
              <button 
                className="btn save-btn" 
                onClick={popupType === "create" ? handleCreate : handleUpdate}
              >
                Save
              </button>
              <button 
                className="btn cancel-btn" 
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAgentMappingPage;