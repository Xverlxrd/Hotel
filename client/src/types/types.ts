export interface IRoom {
    id: number,
    hasChildBed: boolean,
    category: string,
    isAvailable: boolean,
    number: number,
    type: string,
    pricePerNight: number,
}

export interface IBoking {
    id: number,
    clientId: number,
    room: IRoom,
    roomId: number,
    startDate: string,
    endDate: string,
    totalPrice: number,
    status: string
}

export interface IClient {
    id: number,
    lastName: string,
    firstName: string,
    middleName: string,
    passport: string,
    phone: string,
    email: string,
    Booking: IBoking[] | []
}