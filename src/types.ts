export interface Outlet {
    id: string;
    name: string;
    location: string;
    country: string;
    currency: string;
}

export interface ExchangeRateResponse {
    result: string;
    base_code: string;
    target_code: string;
    conversion_rate: number;
}
