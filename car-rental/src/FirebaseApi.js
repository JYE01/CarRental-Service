const PROJECT_ID = "carrental-2cc3b";
const COLLECTION = "Cars";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

const getFieldValue = (fieldObj) => {
    if (!fieldObj) return null;
    const valueType = Object.keys(fieldObj)[0];
    return fieldObj[valueType];
};

export const getCars = async () => {
    try {
        const response = await fetch(BASE_URL);
        const json = await response.json();
        if (!json.documents) return [];
    
        return json.documents.map((doc) => {
            const id = doc.name.split("/").pop();
            const fields = doc.fields;
            const car = {
                id,
                carType: getFieldValue(fields.carType),
                brand: getFieldValue(fields.brand),
                carModel: getFieldValue(fields.carModel),
                yearOfManufacture: getFieldValue(fields.yearOfManufacture),
                mileage: getFieldValue(fields.mileage),
                fuelType: getFieldValue(fields.fuelType),
                available: getFieldValue(fields.available),
                pricePerDay: Number(getFieldValue(fields.pricePerDay)),
                description: getFieldValue(fields.description),
                vin: getFieldValue(fields.vin),
                pickup: getFieldValue(fields.pickup),
                pickupCity: getFieldValue(fields.pickupCity),
                transmission: getFieldValue(fields.transmission),
            };
            return car;
        });
    } catch (error) {
        console.error("Error fetching cars:", error);
        return [];
    }
};