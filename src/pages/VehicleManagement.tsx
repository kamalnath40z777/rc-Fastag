import React, { useState } from 'react';
import VehicleDashboard from '@/components/VehicleDashboard';
import VehicleForm from '@/components/VehicleForm';
import { Vehicle } from '@/types/Vehicle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type ViewMode = 'dashboard' | 'add' | 'edit';

const VehicleManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();

  const handleAddVehicle = () => {
    setEditingVehicle(undefined);
    setViewMode('add');
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setViewMode('edit');
  };

  const handleSaveVehicle = (vehicle: Vehicle) => {
    setViewMode('dashboard');
    setEditingVehicle(undefined);
  };

  const handleCancel = () => {
    setViewMode('dashboard');
    setEditingVehicle(undefined);
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-hero)] animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        {viewMode !== 'dashboard' && (
          <div className="mb-6">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        )}

        {viewMode === 'dashboard' && (
          <VehicleDashboard
            onAddVehicle={handleAddVehicle}
            onEditVehicle={handleEditVehicle}
          />
        )}

        {(viewMode === 'add' || viewMode === 'edit') && (
          <VehicleForm
            vehicle={editingVehicle}
            onSave={handleSaveVehicle}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default VehicleManagement;