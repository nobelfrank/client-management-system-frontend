import React, { useState, useEffect } from "react";
import { UserCheck, PlusCircle } from 'lucide-react';
import MappingCard from './MappingCard';
import MappingForm from './MappingForm';
import Notification from '../policy/Notification';
import { validateMappingData } from './MappingValidation';
import '../policy/Policy.css';

const ClientAgentMappingPage = () => {
  const [mappings, setMappings] = useState([]);
  const [clients, setClients] = useState([]);
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

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const statusOptions = ["Pending", "ACTIVE", "INACTIVE"];

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
      setAgents(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Error fetching agents:", error);
      showNotification("Failed to load agents", "error");
      setAgents([]); 
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
      const validationErrors = validateMappingData(mappingData, mappings);
      if (Object.keys(validationErrors).length > 0) {
        const errorMessages = Object.values(validationErrors).join(', ');
        showNotification(errorMessages, "error");
        return;
      }

      const response = await fetch("http://localhost:8080/api/mappings", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappingData)
      });

      if (!response.ok) throw new Error('Failed to create mapping');

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
      const validationErrors = validateMappingData(mappingData, 
        mappings.filter(m => m.mappingId !== selectedMapping.mappingId)
      );
      if (Object.keys(validationErrors).length > 0) {
        const errorMessages = Object.values(validationErrors).join(', ');
        showNotification(errorMessages, "error");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/mappings/${selectedMapping.mappingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mappingData,
          mappingId: selectedMapping.mappingId
        })
      });

      if (!response.ok) throw new Error('Failed to update mapping');

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

      if (!response.ok) throw new Error('Failed to delete mapping');

      await fetchMappings();
      showNotification("Client-Agent Mapping deleted successfully");
    } catch (error) {
      console.error("Error deleting mapping:", error);
      showNotification("Failed to delete mapping", "error");
    }
  };

  const processedMappings = mappings.filter(Boolean).map(mapping => {
    const client = clients.find(c => c?.clientId === mapping?.clientId);
    const agent = agents.find(a => a?.agentId === mapping?.agentId);

    return {
      ...mapping,
      clientName: client 
        ?` ${client.firstName || ''} ${client.lastName || ''}`
        : 'Unknown Client',
      agentName: agent 
        ? `${agent.firstName || ''} ${agent.lastName || ''}`
        : 'Unknown Agent'
    };
  });

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
      <Notification notification={notification} />

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
          <MappingCard
            key={mapping.mappingId}
            mapping={mapping}
            onEdit={(mapping) => togglePopup("edit", mapping)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showPopup && (
        <MappingForm
          mappingData={mappingData}
          setMappingData={setMappingData}
          clients={clients}
          agents={agents}
          statusOptions={statusOptions}
          existingMappings={mappings}
          onSave={popupType === "create" ? handleCreate : handleUpdate}
          onCancel={() => setShowPopup(false)}
          popupType={popupType}
        />
      )}
    </div>
  );
};

export default ClientAgentMappingPage;