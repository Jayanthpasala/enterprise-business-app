const GEMINI_API_KEY = 'AIzaSyDQXxHbxV5nKtYSXgwyJNchwwefMwQ8HBM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface SalesData {
    date: string;
    totalAmount: number;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    paymentMethod: string;
    notes?: string;
}

export async function extractSalesDataFromImage(imageFile: File): Promise<SalesData | null> {
    try {
        // Convert image to base64
        const base64Image = await fileToBase64(imageFile);

        const prompt = `Analyze this sales receipt/invoice image and extract the following information in JSON format:
{
  "date": "YYYY-MM-DD format",
  "totalAmount": number (total amount paid),
  "items": [
    {
      "name": "item name",
      "quantity": number,
      "price": number (unit price)
    }
  ],
  "paymentMethod": "Cash/Card/UPI/Other",
  "notes": "any additional notes"
}

Extract all visible items. If information is missing, use reasonable defaults or null. Return ONLY the JSON object, no additional text.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: imageFile.type,
                                data: base64Image
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            throw new Error('No response from Gemini API');
        }

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = textResponse.match(/```json\n?([\s\S]*?)\n?```/) || textResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : textResponse;

        const salesData: SalesData = JSON.parse(jsonString.trim());
        return salesData;
    } catch (error) {
        console.error('Error extracting sales data:', error);
        return null;
    }
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
