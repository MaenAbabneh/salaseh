"use server";

import action from "../handler/action";
import handleError from "../handler/error";
import Event, { ISeatingMap } from "@/database/event.model";
import { ActionResponse, ErrorResponse } from "@/types/globle";
import { NotFoundError } from "../http-error";

interface SaveSeatingMapParams {
  eventId: string;
  mapData: ISeatingMap;
}

export async function saveSeatingMap(
  params: SaveSeatingMapParams
): Promise<ActionResponse> {
  const validatedResult = await action({ params });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { eventId, mapData } = validatedResult.params!;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: { seatingMap: mapData } },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      throw new NotFoundError("Event");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedEvent)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getEventById(eventId: string): Promise<ActionResponse> {
  const validatedResult = await action({ params: { eventId } });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  try {
    const event = await Event.findById(eventId).lean();

    if (!event) {
      throw new NotFoundError("Event");
    }

    // Serialize the result to ensure it's JSON compatible
    const serializedEvent = JSON.parse(JSON.stringify(event));

    return {
      success: true,
      data: serializedEvent,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// Helper function to create a new event (for testing purposes)
export async function createEvent(params: {
  title: string;
  description: string;
  date: Date;
  venue: string;
  totalSeats: number;
}): Promise<ActionResponse> {
  const validatedResult = await action({ params });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  try {
    const newEvent = await Event.create({
      ...validatedResult.params!,
      availableSeats: validatedResult.params!.totalSeats,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newEvent)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
