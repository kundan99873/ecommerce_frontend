export interface AddAddressBody {
    first_name: string;
    last_name: string;
    phone_number: string;
    phone_code: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    pin_code: string;
    landmark?: string;
}

export interface Address {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    phone_code: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    pin_code: string;
    landmark?: string;
    is_default: boolean;
}

export interface GetUserAddressesResponse {
    success: boolean;
    message: string;
    data: Address[];
}