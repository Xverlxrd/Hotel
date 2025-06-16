import { RoomType, RoomCategory } from "generated/prisma";

export type RoomCreateInput = {
    number: string;
    type: RoomType;
    category: RoomCategory;
    hasChildBed?: boolean;
    isAvailable?: boolean;
    pricePerNight?: number;
};

export type RoomUpdateInput = Partial<RoomCreateInput>;