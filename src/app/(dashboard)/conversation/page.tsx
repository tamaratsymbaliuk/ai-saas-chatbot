import { PageHeader } from "@/components/page-header";

export default function ConversationsPage() {
  return (
    <div className="h-full bg-gray-100">
      <PageHeader title="Conversations" />
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Conversations</h2>
          <p className="text-gray-600">No conversations yet.</p>
        </div>
      </div>
    </div>
  );
}