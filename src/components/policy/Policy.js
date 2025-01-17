import React, { useState, useEffect } from "react";
import { FileSignature, PlusCircle } from 'lucide-react';
import PolicyCard from '../policy/PolicyCard';
import PolicyForm from '../policy/PolicyForm';
import Notification from '../policy/Notification';
import { validatePolicyData } from './validationUtils';
import '../../assets/Styles/Mapping.css'

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

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const policyTypeOptions = ["LIFE", "HEALTH", "AUTO", "PROPERTY"];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([fetchPolicies(), fetchClients()]);
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
      if (!response.ok) throw new Error('Failed to fetch policies');
      const data = await response.json();
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
      const response = await fetch("http://localhost:8080/api/clients");
      if (!response.ok) throw new Error(`Failed to fetch clients: ${response.status}`);
      const data = await response.json();
      const clientsArray = Array.isArray(data) ? data : (data.data || []);
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
        policyType: "LIFE"
      });
    } else if (type === 'edit' && policy) {
      setPolicyData({
        clientId: policy.client?.id || policy.clientId || "",
        premium: policy.premium || "",
        startDate: policy.startDate || "",
        endDate: policy.endDate || "",
        policyType: policy.policyType || "LIFE"
      });
    }
  };

  const handleCreate = async () => {
    try {
      const validationErrors = validatePolicyData(policyData);
      if (Object.keys(validationErrors).length > 0) {
        const errorMessages = Object.values(validationErrors).join(', ');
        showNotification(errorMessages, "error");
        return;
      }

      const response = await fetch("http://localhost:8080/api/policies", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      });

      if (!response.ok) throw new Error('Failed to create policy');

      await Promise.all([fetchPolicies(), fetchClients()]);
      setShowPopup(false);
      showNotification("Policy created successfully");
    } catch (error) {
      console.error("Error creating policy:", error);
      showNotification("Failed to create policy", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      const validationErrors = validatePolicyData(policyData);
      if (Object.keys(validationErrors).length > 0) {
        const errorMessages = Object.values(validationErrors).join(', ');
        showNotification(errorMessages, "error");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/policies/${selectedPolicy.id || selectedPolicy.policyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...policyData,
          id: selectedPolicy.id || selectedPolicy.policyId
        })
      });

      if (!response.ok) throw new Error('Failed to update policy');

      await Promise.all([fetchPolicies(), fetchClients()]);
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

      if (!response.ok) throw new Error('Failed to delete policy');

      await Promise.all([fetchPolicies(), fetchClients()]);
      showNotification("Policy deleted successfully");
    } catch (error) {
      console.error("Error deleting policy:", error);
      showNotification("Failed to delete policy", "error");
    }
  };

  const filteredPolicies = policies.filter(policy => 
    (policy.clientName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (policy.policyType || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="container">
      <Notification notification={notification} />

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
        {filteredPolicies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            onEdit={(policy) => togglePopup("edit", policy)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showPopup && (
        <PolicyForm
          policyData={policyData}
          setPolicyData={setPolicyData}
          clients={clients}
          policyTypeOptions={policyTypeOptions}
          onSave={popupType === "create" ? handleCreate : handleUpdate}
          onCancel={() => setShowPopup(false)}
          popupType={popupType}
        />
      )}
    </div>
  );
};

export default PolicyPage;