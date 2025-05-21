const PROJECT_ID = "carrental-2cc3b";
const COLLECTION = "Cars";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;
const ORDERS_COLLECTION = "Orders";
const ORDERS_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${ORDERS_COLLECTION}`;

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

      const bookingsField = fields.bookings?.arrayValue?.values || [];
      const bookings = bookingsField.map((booking) => {
        const bookingMap = booking.mapValue.fields;
        return {
          start: bookingMap.start?.stringValue,
          end: bookingMap.end?.stringValue,
        };
      });

      return {
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
        bookings: bookings,
      };
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
};

export const addOrderToFirestore = async (order) => {
  const payload = {
    fields: {
      customerName: { stringValue: order.customerName },
      email: { stringValue: order.email },
      licenseNum: { stringValue: order.licenseNum },
      phoneNumber: { stringValue: order.phoneNumber },
      pickup: { stringValue: order.pickup },
      pickupCity: { stringValue: order.pickupCity },
      pickupDateTime: { stringValue: order.pickupDateTime },
      returnDateTime: { stringValue: order.returnDateTime },
      totalPrice: { doubleValue: order.totalPrice.toString() },
      vin: { stringValue: order.vin },
    },
  };

  const response = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to add order');
  }

  return await response.json();
};

export const updateCarBookings = async (vin, newBooking) => {
  try {
    const cars = await getCars();
    const car = cars.find(c => c.vin === vin);

    if (!car) throw new Error('Car with given VIN not found');

    const documentId = car.id;
    const docUrl = `${BASE_URL}/${documentId}?updateMask.fieldPaths=bookings`;

    const existingBookings = car.bookings.map(b => ({
      mapValue: {
        fields: {
          start: { stringValue: b.start },
          end: { stringValue: b.end }
        }
      }
    }));

    const updatedBookings = [
      ...existingBookings,
      {
        mapValue: {
          fields: {
            start: { stringValue: newBooking.start },
            end: { stringValue: newBooking.end }
          }
        }
      }
    ];

    const payload = {
      fields: {
        bookings: {
          arrayValue: {
            values: updatedBookings
          }
        }
      }
    };

    const response = await fetch(docUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to update bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating bookings:', error);
    throw error;
  }
};
