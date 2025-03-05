import { PageHeader } from "@/components/page-header";

export default function AppointmentsPage() {
  return (
    <div className="h-full bg-gray-100">
      <PageHeader title="Appointments" />
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
          <p className="text-gray-600">No appointments scheduled.</p>
        </div>
      </div>
    </div>
  );
}