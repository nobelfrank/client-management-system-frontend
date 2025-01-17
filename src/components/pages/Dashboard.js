import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../assets/Styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [clientCount, setClientCount] = useState(0);
  const [agentCount, setAgentCount] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ['April 1', 'May 1', 'June 1', 'July 1', 'Aug 1'],
    datasets: [
      {
        label: 'Active Users',
        data: [10, 12, 14, 11, 15],
        backgroundColor: '#3B82F6', 
      },
      {
        label: 'New Users',
        data: [5, 7, 8, 6, 9],
        backgroundColor: '#10B981', 
      },
    ],
  });

  const fetchClientCount = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/clients/count');
      if (!response.ok) {
        throw new Error('Failed to fetch client count');
      }
      const result = await response.json();
      // Update to access the count from the data property
      setClientCount(result.data);
    } catch (error) {
      console.error('Error fetching client count:', error);
      setClientCount(0);
    }
  };

  const fetchAgentCount = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/agents/count');
      if (!response.ok) {
        throw new Error('Failed to fetch agent count');
      }
      const data = await response.json();
      // Assuming the API returns an object with a count property
      // Adjust this based on your actual API response structure
      setAgentCount(typeof data === 'object' ? data.count || 0 : data);
    } catch (error) {
      console.error('Error fetching agent count:', error);
      setAgentCount(0);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.classList.add('fade-in');
      });
    }, 500);

    fetchClientCount();
    fetchAgentCount();

    return () => clearTimeout(timer);
  }, []);

  const handleAgentDetails = (e) => {
    e.preventDefault();
    navigate('/agents');
  };

  const handleClientDetails = (e) => {
    e.preventDefault();
    navigate('/clients');
  };

  const handleStartNewProject = (e) => {
    e.preventDefault();
    navigate('/mapping');
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to Client Management System. Have a look at any recent changes to your projects.</p>

      {/* Statistics Section */}
      <div className="statistics">
        <div className="card card-blue">
          <div className="card-header">Agents</div>
          <div className="card-content">
            <h2>{agentCount}</h2>
            <a href="#" onClick={handleAgentDetails}>View details</a>
          </div>
        </div>
        <div className="card card-green">
          <div className="card-header">Clients</div>
          <div className="card-content">
            <h2>{clientCount}</h2>
            <a href="#" onClick={handleClientDetails}>View details</a>
          </div>
        </div>
        <div className="card card-yellow">
          <div className="card-header">Start New Project</div>
          <div className="card-content">
            <p>Quickly assign a client to an agent.</p>
            <a href="#" onClick={handleStartNewProject}>Start now</a>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h2>Active Users for the Last Month</h2>
          <button>30 Days</button>
        </div>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 20,
              },
            },
          }}
          height={150}
        />
        <div className="chart-summary">
          <p>Avg this week</p>
          <h2>{Math.round(chartData.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.datasets[0].data.length)} users</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;