export interface Query {
    from: string;
    to: string;
    amount: number;
}

export interface Info {
    timestamp: number;
    rate: number;
}

export interface CurrencyConversionresponse {
    success: boolean;
    query: Query;
    info: Info;
    date: string;
    result: number;
}

export interface CurrencyConversionEvent {
    from: string;
    amount: string;
    to: string;

}

export interface CurrencyConversionData {
    from: string;
    amount: string;
    to: string;
    convertedCurrency: string;
    rate: string;
}





