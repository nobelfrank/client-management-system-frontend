export const validateMappingData = (mappingData, existingMappings = []) => {
    const errors = {};
  
    if (!mappingData.clientId) {
      errors.clientId = 'Please select a client';
    }
  
    if (!mappingData.agentId) {
      errors.agentId = 'Please select an agent';
    }
  
    // Check if this client-agent combination already exists (for new mappings)
    const duplicateMapping = existingMappings.find(
      mapping => 
        mapping.clientId === mappingData.clientId && 
        mapping.agentId === mappingData.agentId
    );
  
    if (duplicateMapping) {
      errors.general = 'This client is already mapped to the selected agent';
    }
  
    if (!mappingData.status) {
      errors.status = 'Please select a status';
    } else if (!['Pending', 'ACTIVE', 'INACTIVE'].includes(mappingData.status)) {
      errors.status = 'Invalid status selected';
    }
  
    return errors;
  };