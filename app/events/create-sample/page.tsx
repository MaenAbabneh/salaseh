import { createSampleEvent } from "@/lib/action/sample-data.action";
import { redirect } from "next/navigation";

interface SearchParams {
  error?: string;
}

interface CreateSamplePageProps {
  searchParams: SearchParams;
}

export default async function CreateSamplePage({
  searchParams,
}: CreateSamplePageProps) {
  async function createSample() {
    "use server";

    try {
      const result = await createSampleEvent();

      if (result.eventId) {
        redirect(`/events/${result.eventId}`);
      } else {
        redirect("/events/create-sample?error=creation_failed");
      }
    } catch (error) {
      console.error("Error creating sample event:", error);
      redirect("/events/create-sample?error=unexpected_error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Sample Event</h1>
        <p className="text-gray-600 mb-6">
          This will create a sample comedy show with a seating map for testing.
        </p>

        {searchParams.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {searchParams.error === "creation_failed" &&
              "Failed to create the event. Please try again."}
            {searchParams.error === "unexpected_error" &&
              "An unexpected error occurred. Please try again."}
          </div>
        )}

        <form action={createSample}>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Create Sample Event
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          This will generate a 9-row theater with different price tiers and some
          pre-booked seats for demonstration.
        </p>
      </div>
    </div>
  );
}
