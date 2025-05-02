import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClientModal = ({ 
  isOpen, 
  onClose, 
  formMode, 
  formData, 
  formErrors, 
  handleInputChange, 
  handleAddClient, 
  handleEditClient,
  countries,
  states,
  cities
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="clients-page-details-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
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
                onClick={onClose}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
  );
};

export default ClientModal;