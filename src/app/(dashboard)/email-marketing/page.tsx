import { PageHeader } from "@/components/page-header";

export default function EmailMarketingPage() {
  return (
    <div className="h-full bg-gray-100">
      <PageHeader title="Email Marketing" />
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Email Campaigns</h2>
          <p className="text-gray-600">No email campaigns created yet.</p>
        </div>
      </div>
    </div>
  );
}