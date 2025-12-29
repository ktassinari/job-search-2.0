import { useState, useEffect } from 'react';
import { getApplications, updateApplication } from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import { format } from 'date-fns';

const STATUSES = [
  { id: 'preparing', label: 'Preparing', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'submitted', label: 'Submitted', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'phone_screen', label: 'Phone Screen', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { id: 'interview', label: 'Interview', color: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'offer', label: 'Offer', color: 'bg-green-100 dark:bg-green-900/30' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-100 dark:bg-red-900/30' }
];

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const response = await getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(applicationId, newStatus) {
    try {
      await updateApplication(applicationId, { status: newStatus });
      await loadApplications();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  }

  function handleDragStart(e, application) {
    setDraggedCard(application);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  async function handleDrop(e, newStatus) {
    e.preventDefault();
    if (draggedCard && draggedCard.status !== newStatus) {
      await handleStatusChange(draggedCard.id, newStatus);
    }
    setDraggedCard(null);
  }

  if (loading) {
    return <Loading message="Loading applications..." />;
  }

  const applicationsByStatus = STATUSES.reduce((acc, status) => {
    acc[status.id] = applications.filter(app => app.status === status.id);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Application Pipeline
          </h1>
          <p className="text-lg text-dark-text-secondary">
            Track your job applications through the interview process
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATUSES.map((status) => (
          <div
            key={status.id}
            className="flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <div className={`${status.color} rounded-lg p-3 mb-3`}>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {status.label}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {applicationsByStatus[status.id]?.length || 0} application{applicationsByStatus[status.id]?.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-3 flex-1">
              {applicationsByStatus[status.id]?.map((app) => (
                <Card
                  key={app.id}
                  className="p-4 cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, app)}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {app.title}
                  </h4>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mb-2">
                    {app.company}
                  </p>
                  {app.date_applied && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Applied {format(new Date(app.date_applied), 'MMM d')}
                    </p>
                  )}
                  {app.follow_up_date && !app.follow_up_done && (
                    <Badge variant="yellow" className="mt-2 text-xs">
                      Follow-up due
                    </Badge>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

        {applications.length === 0 && (
          <Card className="p-12 text-center mt-6">
            <p className="text-dark-text-secondary">
              No applications yet. Apply to some jobs to track them here!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
