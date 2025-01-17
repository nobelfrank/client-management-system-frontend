/* eslint-disable no-unused-vars */
/* eslint-disable default-case */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  Eye, 
  Edit2, 
  Trash2, 
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../assets/Styles/Client.css';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  
  // Dropdown data states
  const [countries, setCountries] = useState([]);
const [states, setStates] = useState([]);
const [cities, setCities] = useState([]);


  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.trim().length < 3) return 'Name must be at least 3 characters long';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return 'Phone number is required';
    const phoneRegex = /^\+?\d{10,}$/;
    if (!phoneRegex.test(phone)) return 'Invalid phone number';
    return '';
  };

  const validatePostalCode = (postalCode) => {
    if (!postalCode) return 'Postal code is required';
    const postalCodeRegex = /^\d{5}$/;
    if (!postalCodeRegex.test(postalCode)) return 'Postal code must be 6 digits';
    return '';
  };

  const validateDateOfBirth = (dob) => {
    if (!dob) return 'Date of Birth is required';
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) return 'Must be at least 18 years old';
    
    return '';
  };


  const transformApiResponse = (apiData) => {
    return {
      firstName: apiData.firstName,
      lastName: apiData.lastName,
      email: apiData.email,
      phoneNumber: apiData.phoneNumber,
      dateOfBirth: apiData.dob, // Match API field name
      address: {
        street: apiData.address?.streetAddress || '',
        postalCode: apiData.address?.postalCode || '',
        city: {
          id: apiData.address?.cityId || null,
          name: apiData.address?.cityName || '',
          state: {
            name: apiData.address?.stateName || '',
            country: {
              name: apiData.address?.countryName || ''
            }
          }
        }
      }
    };
  };

  const transformFormDataToApi = (formData) => {
    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dob: formData.dateOfBirth,
      address: {
        streetAddress: formData.address.street,
        postalCode: formData.address.postalCode,
        cityId: formData.address.city.id,
        cityName: formData.address.city.name,
        stateName: formData.address.city.state.name,
        countryName: formData.address.city.state.country.name
      }
    };
  };


  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: {
      street: '',
      postalCode: '',
      city: {
        id: null,
        name: '',
        state: {
          id: null,
          name: '',
          country: {
            id: null,
            name: '',
            code: ''
          }
        }
      }
    }
  };

  // Then modify your formData state to use initialFormData
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  // Add this function after your state declarations
  const safeSetClientData = (clientData) => {
    if (!clientData) return initialFormData;
    
    return {
      ...clientData,
      address: {
        street: clientData.address?.street || '',
        postalCode: clientData.address?.postalCode || '',
        city: {
          id: clientData.address?.city?.id || null,
          name: clientData.address?.city?.name || '',
          state: {
            id: clientData.address?.city?.state?.id || null,
            name: clientData.address?.city?.state?.name || '',
            country: {
              id: clientData.address?.city?.state?.country?.id || null,
              name: clientData.address?.city?.state?.country?.name || '',
              code: clientData.address?.city?.state?.country?.code || ''
            }
          }
        }
      }
    };
  };

  // Fetch initial data
  const fetchInitialData = async () => {
  setIsLoading(true);
  try {
    const clientsResponse = await fetch('http://localhost:8080/api/clients');
    const clientsData = await clientsResponse.json();
    const transformedClients = clientsData.data.map(transformApiResponse);
    setClients(transformedClients);
    setFilteredClients(transformedClients);
  
      const countriesResponse = await fetch('http://localhost:8080/api/clients/countries');
      const countriesData = await countriesResponse.json();
      setCountries(countriesData.data || []); // Access the data property
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('error', 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch states based on selected country
  const fetchStates = async (countryId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/clients/states/${countryId}`);
      const statesData = await response.json();
      setStates(statesData.data || []); // Access the data property
      setCities([]); // Reset cities when country changes
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
      showNotification('error', 'Failed to fetch states');
    }
  };
  
  const fetchCities = async (stateId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/clients/cities/${stateId}`);
      const citiesData = await response.json();
      setCities(citiesData.data || []); // Access the data property, similar to other fetch calls
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
      showNotification('error', 'Failed to fetch cities');
    }
  };


  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = clients.filter(
      client => 
       `${client.firstName} ${client.lastName}`.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term)
    );
    setFilteredClients(filtered);
  };
  // Comprehensive form validation
  const validateForm = () => {
    const errors = {};
    
    // Validate all fields
    const firstNameError = validateName(formData.firstName);
    const lastNameError = validateName(formData.lastName);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhoneNumber(formData.phoneNumber);
    const dobError = validateDateOfBirth(formData.dateOfBirth);
    const postalCodeError = validatePostalCode(formData.address.postalCode);

    // Add errors if they exist
    if (firstNameError) errors.firstName = firstNameError;
    if (lastNameError) errors.lastName = lastNameError;
    if (emailError) errors.email = emailError;
    if (phoneError) errors.phoneNumber = phoneError;
    if (dobError) errors.dateOfBirth = dobError;
    if (postalCodeError) errors.postalCode = postalCodeError;

    // Additional required field validations
    if (!formData.address.street) errors.street = 'Street address is required';
    if (!formData.address.city.state.country.id) errors.country = 'Country is required';
    if (!formData.address.city.state.id) errors.state = 'State is required';
    if (!formData.address.city.id) errors.city = 'City is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Input change handler with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Real-time validation for specific fields
    const validateAndSetError = (fieldName, validationFn, value) => {
      const error = validationFn ? validationFn(value) : '';
      setFormErrors(prev => {
        const newErrors = {...prev};
        
        // Clear the error if validation passes
        if (!error) {
          delete newErrors[fieldName];
        } else {
          // Set the error if validation fails
          newErrors[fieldName] = error;
        }
        
        return newErrors;
      });
      
      return error;
    };
  
    // Specific validation for different fields
    switch(name) {
      case 'firstName':
        validateAndSetError('firstName', validateName, value);
        break;
      case 'lastName':
        validateAndSetError('lastName', validateName, value);
        break;
      case 'email':
        validateAndSetError('email', validateEmail, value);
        break;
      case 'phoneNumber':
        validateAndSetError('phoneNumber', validatePhoneNumber, value);
        break;
      case 'dateOfBirth':
        validateAndSetError('dateOfBirth', validateDateOfBirth, value);
        break;
      case 'postalCode':
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            postalCode: value
          }
        }));
        validateAndSetError('postalCode', validatePostalCode, value);
        break;
      case 'street':
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            street: value
          }
        }));
        validateAndSetError('street', 
          (val) => !val.trim() ? 'Street address is required' : '', 
          value
        );
        break;
    }
  
    // Handling nested form fields and validation
    if (name === 'country') {
      const selectedCountry = countries.find(c => c.id === parseInt(value));
      
      // Validate country selection
      validateAndSetError('country', 
        (val) => !val ? 'Country is required' : '', 
        value
      );
  
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          city: {
            ...prev.address.city,
            state: {
              ...prev.address.city.state,
              country: selectedCountry
            }
          }
        }
      }));
      fetchStates(value);
    } else if (name === 'state') {
      const selectedState = states.find(s => s.id === parseInt(value));
      
      // Validate state selection
      validateAndSetError('state', 
        (val) => !val ? 'State is required' : '', 
        value
      );
  
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          city: {
            ...prev.address.city,
            state: selectedState
          }
        }
      }));
      fetchCities(value);
    } else if (name === 'city') {
      const selectedCity = cities.find(c => c.id === parseInt(value));
      
      // Validate city selection
      validateAndSetError('city', 
        (val) => !val ? 'City is required' : '', 
        value
      );
  
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          city: selectedCity
        }
      }));
    } else {
      // Handle other inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add client handler
  // Update handleAddClient
const handleAddClient = async () => {
  if (validateForm()) {
    try {
      const apiData = transformFormDataToApi(formData);
      const response = await fetch('http://localhost:8080/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });
    

        if (!response.ok) {
          // Handle specific error responses
          const errorData = await response.json();
          if (errorData.message.includes('Email already exists')) {
            setFormErrors(prev => ({
              ...prev,
              email: 'Email is already registered'
            }));
            throw new Error('Email already exists');
          }
          if (errorData.message.includes('Phone number already exists')) {
            setFormErrors(prev => ({
              ...prev,
              phoneNumber: 'Phone number is already registered'
            }));
            throw new Error('Phone number already exists');
          }
          throw new Error('Failed to add client');
        }

        const newClient = await response.json();
        fetchInitialData();
        setIsModalOpen(false);
        showNotification('success', 'Client added successfully');
        resetForm();
     } catch (error) {
      showNotification('error', error.message);
    }
  }
};

  const handleEditClient = async () => {
    if (validateForm() && currentClient) {
      try {
        const response = await fetch(`http://localhost:8080/api/clients/${currentClient.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          // Handle specific error responses
          const errorData = await response.json();
          if (errorData.message.includes('Email already exists')) {
            setFormErrors(prev => ({
              ...prev,
              email: 'Email is already registered'
            }));
            throw new Error('Email already exists');
          }
          if (errorData.message.includes('Phone number already exists')) {
            setFormErrors(prev => ({
              ...prev,
              phoneNumber: 'Phone number is already registered'
            }));
            throw new Error('Phone number already exists');
          }
          throw new Error('Failed to update client');
        }

        fetchInitialData();
        setIsModalOpen(false);
        showNotification('success', 'Client updated successfully');
      } catch (error) {
        showNotification('error', error.message);
      }
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/clients/${clientId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      fetchInitialData();
      showNotification('success', 'Client deleted successfully');
    } catch (error) {
      showNotification('error', error.message);
    }
  };
  const handleViewClient = (client) => {
    setCurrentClient(client);
    setFormMode('view');
    setFormData(safeSetClientData(client));
    setIsModalOpen(true);
  };
  
  const handleEditInitiate = (client) => {
    const safeClient = safeSetClientData(client);
    setCurrentClient(safeClient);
    setFormMode('edit');
    setFormData(safeClient);
    
    if (safeClient.address?.city?.state?.country?.id) {
      fetchStates(safeClient.address.city.state.country.id);
      if (safeClient.address?.city?.state?.id) {
        fetchCities(safeClient.address.city.state.id);
      }
    }
    
    setIsModalOpen(true);
  };
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      address: {
        street: '',
        postalCode: '',
        city: {
          id: null,
          name: '',
          state: {
            id: null,
            name: '',
            country: {
              id: null,
              name: '',
              code: ''
            }
          }
        }
      }
    });
    setFormErrors({});
  };

  const NotificationPopup = () => (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`notification notification-${notification.type}`}
        >
          {notification.type === 'success' 
            ? <CheckCircle2 size={20} /> 
            : <AlertTriangle size={20} />
          }
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="clients-page-container"
    >
      <NotificationPopup />

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
          onClick={() => {
            setFormMode('add');
            setCurrentClient(null);
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <PlusCircle size={20} /> Add Client
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0.5 : 1 }}
        className="clients-page-content"
      >
        {isLoading ? (
          <div className="loading-spinner">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="spinner"
            />
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
{filteredClients && Array.isArray(filteredClients) && filteredClients.map(client => (
  <motion.tr 
    key={client.id}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
                  <td>{`${client.firstName} ${client.lastName}`}</td>
                  <td>{client.email}</td>
                  <td>{client.phoneNumber}</td>
                  <td>{new Date(client.dateOfBirth).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-button" 
                        onClick={() => handleViewClient(client)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="edit-button"
                        onClick={() => handleEditInitiate(client)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              className="clients-page-details-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              className="clients-page-details-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="clients-page-details-header">
                <h2>
                  {formMode === 'add' 
                    ? 'Add New Client' 
                    : formMode === 'edit' 
                      ? 'Edit Client' 
                      : 'Client Details'}
                </h2>
                <button 
                  className="clients-page-details-close-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              {formMode === 'view' ? (
                <div className="client-details-view">
                  <div className="details-row">
                    <strong>Name:</strong> 
                    {`${formData.firstName} ${formData.lastName}`}
                  </div>


                  <div className="details-row">
                    <strong>Email:</strong> 
                    {formData.email}
                  </div>
                  <div className="details-row">
                    <strong>Phone:</strong> 
                    {formData.phoneNumber}
                  </div>
                  <div className="details-row">
  <strong>Date of Birth:</strong> 
  {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : ''}
</div>
                  <div className="details-row">
                    <strong>Address:</strong> 
                    {`${formData.address.street}, ${formData.address.city.name}, 
                      ${formData.address.city.state.name}, 
                      ${formData.address.city.state.country.name} 
                      ${formData.address.postalCode}`}
                  </div>
                </div>
              ) : (
                <form>
                  <div className="input-wrapper">
                    <div className="clients-page-details-field">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={formMode === 'view'}
                        className={formErrors.firstName ? 'input-error-border' : ''}
                      />
                      {formErrors.firstName && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.firstName}
                        </div>
                      )}
                    </div>

                    <div className="clients-page-details-field">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={formMode === 'view'}
                        className={formErrors.lastName ? 'input-error-border' : ''}
                      />
                      {formErrors.lastName && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.lastName}
                        </div>
                      )}
                    </div>

                    <div className="clients-page-details-field">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        disabled={formMode === 'view'}
                        className={formErrors.email ? 'input-error-border' : ''}
                      />
                      {formErrors.email && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.email}
                        </div>
                      )}
                    </div>

                    <div className="clients-page-details-field">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit phone number"
                        disabled={formMode === 'view'}
                        className={formErrors.phoneNumber ? 'input-error-border' : ''}
                      />
                      {formErrors.phoneNumber && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.phoneNumber}
                        </div>
                      )}
                    </div>

                    <div className="clients-page-details-field">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={formMode === 'view'}
                        className={formErrors.dateOfBirth ? 'input-error-border' : ''}
                      />
                      {formErrors.dateOfBirth && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.dateOfBirth}
                        </div>
                      )}
                    </div>

                    <div className="clients-page-details-field">
                      <label>Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.address.street}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            street: e.target.value
                          }
                        }))}
                        disabled={formMode === 'view'}
                        className={formErrors.street ? 'input-error-border' : ''}
                      />
                      {formErrors.street && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.street}
                        </div>
                      )}
                    </div>

                    <div className="clients-page-details-field">
                      <label>Country</label>
                      <select
  name="country"
  value={formData.address.city.state.country.id || ''}
  onChange={handleInputChange}
  disabled={formMode === 'view'}
  className={formErrors.country ? 'input-error-border' : ''}
>
  <option value="">Select Country</option>
  {countries && Array.isArray(countries) && countries.map(country => (
    <option key={country.id} value={country.id}>
      {country.name}
    </option>
  ))}
</select>

                      {formErrors.country && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.country}
                        </div>
                      )}
                    </div>

                    <div className="clients-page-details-field">
                      <label>State</label>
                      <select
  name="state"
  value={formData.address.city.state.id || ''}
  onChange={handleInputChange}
  disabled={formMode === 'view' || !formData.address.city.state.country.id}
  className={formErrors.state ? 'input-error-border' : ''}
>
  <option value="">Select State</option>
  {states && Array.isArray(states) && states.map(state => (
    <option key={state.id} value={state.id}>
      {state.name}
    </option>
  ))}
</select>

                      {formErrors.state && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.state}
                        </div>
                      )}
                    </div>

                    <div className="clients-page-details-field">
                      <label>City</label>
                      <select
  name="city"
  value={formData.address.city.id || ''}
  onChange={handleInputChange}
  disabled={formMode === 'view' || !formData.address.city.state.id}
  className={formErrors.city ? 'input-error-border' : ''}
>
  <option value="">Select City</option>
  {cities && Array.isArray(cities) && cities.map(city => (
    <option key={city.id} value={city.id}>
      {city.name}
    </option>
  ))}
</select>
                      {formErrors.city && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.city}
                        </div>
                      )}
                    </div>

                    <div className="clients-page-details-field">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.address.postalCode}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            postalCode: e.target.value
                          }
                        }))}
                        disabled={formMode === 'view'}
                        className={formErrors.postalCode ? 'input-error-border' : ''}
                      />
                      {formErrors.postalCode && (
                        <div className="input-error">
                          <AlertTriangle size={16} /> {formErrors.postalCode}
                        </div>
                      )}
                    </div>
                  </div>

                  {formMode !== 'view' && (
                    <div className="clients-page-details-actions">
                      <button 
                        type="button"
                        className="clients-page-details-create-button"
                        onClick={formMode === 'add' ? handleAddClient : handleEditClient}
                      >
                        {formMode === 'add' ? 'Create Client' : 'Update Client'}
                      </button>
                    </div>
                  )}
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Client;