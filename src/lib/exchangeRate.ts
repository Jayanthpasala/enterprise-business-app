const API_KEY = '15462bbda90bc7978eaccae6';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export interface ExchangeRateResult {
    conversion_rate: number;
    base_code: string;
    target_code: string;
}

export async function fetchExchangeRate(baseCurrency: string, targetCurrency: string): Promise<number | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
        const response = await fetch(`${BASE_URL}/pair/${baseCurrency}/${targetCurrency}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        if (data.result === 'success') {
            return data.conversion_rate;
        } else {
            console.error('Exchange rate fetch failed:', data['error-type']);
            return null;
        }
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error('Exchange rate fetch timed out');
        } else {
            console.error('Error fetching exchange rate:', error);
        }
        return null;
    }
}
