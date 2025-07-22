import { notFound } from "next/navigation";
import { getEventById } from "@/lib/action/event.action";
import { IEvent } from "@/database/event.model";
import SeatMap from "@/components/events";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  const result = await getEventById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const event = result.data as IEvent;

  if (!event.seatingMap) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <p className="text-lg">
            Seating map is not available for this event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-600 mb-2">{event.description}</p>
          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()} at {event.venue}
          </p>
        </div>

        <SeatMap mapData={event.seatingMap} />
      </div>
    </div>
  );
}
