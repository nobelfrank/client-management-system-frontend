import React, { useState, useEffect } from "react";
import { 
  FileSignature, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign 
} from 'lucide-react';
import '../../assets/Styles/Policy.css';
const PolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyData, setPolicyData] = useState({
    clientId: "",
    premium: "",
    startDate: "",
    endDate: "",
    policyType: "LIFE"
  });

 

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // Updated policy type options to match backend format
  const policyTypeOptions = [
    "LIFE",
    "HEALTH",
    "AUTO",
    "PROPERTY"
  ];


  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchPolicies(),
          fetchClients()
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showNotification("Failed to load initial data", "error");
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

  const fetchPolicies = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/policies");
      if (!response.ok) {
        throw new Error('Failed to fetch policies');
      }
      const data = await response.json();
      // Transform the nested data structure
      const transformedPolicies = data.map(item => ({
        ...item.policy,
        clientName: item.clientName
      }));
      setPolicies(transformedPolicies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      showNotification("Failed to load policies", "error");
      setPolicies([]);
    }
  };
  
    const fetchClients = async () => {
    try {
      console.log('Fetching clients...');
      const response = await fetch("http://localhost:8080/api/clients");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch clients: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Directly set the response data if it's an array, otherwise look for data property
      const clientsArray = Array.isArray(data) ? data : (data.data || []);
      console.log('Processed Clients Data:', clientsArray);
      
      setClients(clientsArray);
    } catch (error) {
      console.error("Error fetching clients:", error);
      showNotification("Failed to load clients", "error");
      setClients([]);
    }
  };

  


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const togglePopup = (type, policy = null) => {
    setPopupType(type);
    setSelectedPolicy(policy);
    setShowPopup(!showPopup);
    
    if (type === 'create') {
      setPolicyData({
        clientId: "",
        premium: "",
        startDate: "",
        endDate: "",
        policyType: "Life Insurance"
      });
    } else if (type === 'edit' && policy) {
      setPolicyData({
        clientId: policy.client?.id || policy.clientId || "",
        premium: policy.premium || "",
        startDate: policy.startDate || "",
        endDate: policy.endDate || "",
        policyType: policy.policyType || "Life Insurance"
      });
    }
  };

  const handleCreate = async () => {
    try {
      // Validate input
      if (!policyData.clientId || !policyData.premium || !policyData.startDate || !policyData.endDate) {
        showNotification("Please fill in all required fields", "error");
        return;
      }

      const response = await fetch("http://localhost:8080/api/policies", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policyData)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error response:", errorBody);
        throw new Error('Failed to create policy');
      }

      // Refresh data after successful creation
      await Promise.all([
        fetchPolicies(),
        fetchClients()
      ]);

      setShowPopup(false);
      showNotification("Policy created successfully");
    } catch (error) {
      console.error("Error creating policy:", error);
      showNotification("Failed to create policy", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      // Validate input
      if (!policyData.clientId || !policyData.premium || !policyData.startDate || !policyData.endDate) {
        showNotification("Please fill in all required fields", "error");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/policies/${selectedPolicy.id || selectedPolicy.policyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...policyData,
          id: selectedPolicy.id || selectedPolicy.policyId
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error response:", errorBody);
        throw new Error('Failed to update policy');
      }

      // Refresh data after successful update
      await Promise.all([
        fetchPolicies(),
        fetchClients()
      ]);

      setShowPopup(false);
      showNotification("Policy updated successfully");
    } catch (error) {
      console.error("Error updating policy:", error);
      showNotification("Failed to update policy", "error");
    }
  };

  const handleDelete = async (policyId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/policies/${policyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error response:", errorBody);
        throw new Error('Failed to delete policy');
      }

      // Refresh data after successful deletion
      await Promise.all([
        fetchPolicies(),
        fetchClients()
      ]);

      showNotification("Policy deleted successfully");
    } catch (error) {
      console.error("Error deleting policy:", error);
      showNotification("Failed to delete policy", "error");
    }
  };




  

  const processedPolicies = policies.map(policy => {
    if (!policy) return null;
    
    return {
      ...policy,
      clientName: policy.clientName || 'Unknown Client',
    };
  }).filter(Boolean);


  // Filter processed policies based on search term
  const filteredPolicies = processedPolicies.filter(policy => 
    (policy.clientName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (policy.policyType || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );
  return (
    <div className="container">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h1 className="fade-in">
        <FileSignature className="page-header-icon" /> Policy Management
      </h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search policies by client or type..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <button 
          className="btn create-policy-btn large-btn" 
          onClick={() => togglePopup("create")}
        >
          <PlusCircle className="btn-icon" /> Create New Policy
        </button>
      </div>

      <div className="cards-row policy-cards">
        {Array.isArray(policies) && policies.map((policy) => {
          if (!policy) return null;
          return (
            <div 
              className="card policy-card fade-in" 
              key={policy.id}
            >
              <div className="policy-type-header">
                <FileSignature className="policy-type-icon" />
                <h2>{policy.policyType || 'Unknown Policy Type'}</h2>
              </div>
              
              <div className="policy-details">
                <p>
                  <span className="detail-label">Client:</span> 
                  {policy.clientName}
                </p>
                <p>
                  <DollarSign className="inline-icon" />
                  <span className="detail-label">Premium:</span> 
                  ${(policy.premium || 0).toFixed(2)}
                </p>
                <p>
                  <Calendar className="inline-icon" />
                  <span className="detail-label">Start Date:</span> 
                  {policy.startDate || 'N/A'}
                </p>
                <p>
                  <Calendar className="inline-icon" />
                  <span className="detail-label">End Date:</span> 
                  {policy.endDate || 'N/A'}
                </p>
              </div>

              <div className="card-actions">
                <button 
                  className="btn edit-btn" 
                  onClick={() => togglePopup("edit", policy)}
                >
                  <Edit className="btn-icon" /> Edit
                </button>
                <button 
                  className="btn delete-btn" 
                  onClick={() => handleDelete(policy.id)}
                >
                  <Trash2 className="btn-icon" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>


      {showPopup && (
        <div className="popup fade-in">
          <div className="popup-content">
            <h2>
              {popupType === "create" 
                ? "Create New Policy" 
                : "Edit Policy"}
            </h2>
            <label>
              Select Client:
              <select
                value={policyData.clientId}
                onChange={(e) => setPolicyData({ ...policyData, clientId: e.target.value })}
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
              Policy Type:
              <select
                value={policyData.policyType}
                onChange={(e) => setPolicyData({ ...policyData, policyType: e.target.value })}
              >
                {policyTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Premium:
              <input
                type="number"
                value={policyData.premium}
                onChange={(e) => setPolicyData({ ...policyData, premium: e.target.value })}
                placeholder="Enter premium amount"
              />
            </label>

            <label>
              Start Date:
              <input
                type="date"
                value={policyData.startDate}
                onChange={(e) => setPolicyData({ ...policyData, startDate: e.target.value })}
              />
            </label>

            <label>
              End Date:
              <input
                type="date"
                value={policyData.endDate}
                onChange={(e) => setPolicyData({ ...policyData, endDate: e.target.value })}
              />
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

export default PolicyPage;