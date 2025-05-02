import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ClientSearch from './ClientSearch';
import ClientTable from './ClientTable';
import ClientModal from './ClientModal';
import NotificationPopup from '../agent/Notification';
import '../../assets/Styles/Client.css';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dropdown data states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

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

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Transform API response for consistent data structure
  const transformApiResponse = (apiData) => {
    return {
      id: apiData.id,
      firstName: apiData.firstName,
      lastName: apiData.lastName,
      email: apiData.email,
      phoneNumber: apiData.phoneNumber,
      dateOfBirth: apiData.dob, 
      address: {
        street: apiData.address?.streetAddress || '',
        postalCode: apiData.address?.postalCode || '',
        city: {
          id: apiData.address?.cityId || null,
          name: apiData.address?.cityName || '',
          state: {
            id: apiData.address?.stateId || null,
            name: apiData.address?.stateName || '',
            country: {
              id: apiData.address?.countryId || null,
              name: apiData.address?.countryName || '',
              code: apiData.address?.countryCode || ''
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

  // Form validation functions
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
    if (!postalCodeRegex.test(postalCode)) return 'Postal code must be 5 digits';
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
      setCountries(countriesData.data || []);
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
      setStates(statesData.data || []);
      setCities([]); // Reset cities when country changes
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
      showNotification('error', 'Failed to fetch states');
    }
  };
  
  // Fetch cities based on selected state
  const fetchCities = async (stateId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/clients/cities/${stateId}`);
      const citiesData = await response.json();
      setCities(citiesData.data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
      showNotification('error', 'Failed to fetch cities');
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
  };

  // Show notification message
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = clients.filter(
      client => 
       `${client.firstName} ${client.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
        client.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  // Form input change handler
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
        setFormData(prev => ({ ...prev, firstName: value }));
        break;
      case 'lastName':
        validateAndSetError('lastName', validateName, value);
        setFormData(prev => ({ ...prev, lastName: value }));
        break;
      case 'email':
        validateAndSetError('email', validateEmail, value);
        setFormData(prev => ({ ...prev, email: value }));
        break;
      case 'phoneNumber':
        validateAndSetError('phoneNumber', validatePhoneNumber, value);
        setFormData(prev => ({ ...prev, phoneNumber: value }));
        break;
      case 'dateOfBirth':
        validateAndSetError('dateOfBirth', validateDateOfBirth, value);
        setFormData(prev => ({ ...prev, dateOfBirth: value }));
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
      case 'country':
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
                country: selectedCountry || { id: null, name: '', code: '' }
              }
            }
          }
        }));
        fetchStates(value);
        break;
      case 'state':
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
              state: selectedState || { id: null, name: '', country: prev.address.city.state.country }
            }
          }
        }));
        fetchCities(value);
        break;
      case 'city':
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
            city: selectedCity || { id: null, name: '', state: prev.address.city.state }
          }
        }));
        break;
      default:
        // Handle other inputs
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
    }
  };

  // Add client handler
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

        await response.json();
        fetchInitialData();
        setIsModalOpen(false);
        showNotification('success', 'Client added successfully');
        resetForm();
      } catch (error) {
        showNotification('error', error.message);
      }
    }
  };

  // Edit client handler
  const handleEditClient = async () => {
    if (validateForm() && currentClient) {
      try {
        const apiData = transformFormDataToApi(formData);
        const response = await fetch(`http://localhost:8080/api/clients/${currentClient.id}`, {
          method: 'PUT',
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

  // Delete client handler
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

  // View client handler
  const handleViewClient = (client) => {
    setCurrentClient(client);
    setFormMode('view');
    setFormData(client);
    setIsModalOpen(true);
  };
  
  // Initialize edit mode
  const handleEditInitiate = (client) => {
    setCurrentClient(client);
    setFormMode('edit');
    setFormData(client);
    
    if (client.address?.city?.state?.country?.id) {
      fetchStates(client.address.city.state.country.id);
      if (client.address?.city?.state?.id) {
        fetchCities(client.address.city.state.id);
      }
    }
    
    setIsModalOpen(true);
  };

  // Add new client button click handler
  const handleAddNewClick = () => {
    setFormMode('add');
    setCurrentClient(null);
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="clients-page-container"
    >
      <NotificationPopup notification={notification} />

      <div className="clients-page-header">
        <ClientSearch searchTerm={searchTerm} onSearch={handleSearch} />
        <button 
          className="clients-page-add-button"
          onClick={handleAddNewClick}
        >
          <PlusCircle size={20} /> Add Client
        </button>
      </div>

      <ClientTable 
        filteredClients={filteredClients}
        isLoading={isLoading}
        onView={handleViewClient}
        onEdit={handleEditInitiate}
        onDelete={handleDeleteClient}
      />

      <ClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formMode={formMode}
        formData={formData}
        formErrors={formErrors}
        countries={countries}
        states={states}
        cities={cities}
        onInputChange={handleInputChange}
        onAddClient={handleAddClient}
        onEditClient={handleEditClient}
      />
    </motion.div>
  );
};

export default Client;