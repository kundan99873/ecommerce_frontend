// Geoapify API keys for load distribution
const API_KEYS = [
  "98a1b99b6cc641f18d376393b2b4ee57", // PRAVIN_GEOAPI_KEY
  "8bd43ed2994e4c8793e94436f38dce72", // BNGRAPHIC_GEOAPI_KEY
  "10c9ddcd411747ba8fa3a98956a00b91", // ANALYTICS_GEOAPI_KEY
  "b0df0c4354524d36969ee4220ec56eb4", // MOBILETECH_GEOAPI_KEY
  "11ec9f1af25d4cbd8a8db5b137078900", // CHATGPT_GEOAPI_KEY
  "c658218e4efc4fb6a40924f67236d74b", // KUNDAN_GEOAPI_KEY
];

export interface LocationData {
  country: string;
  country_code: string;
  state: string;
  state_code?: string;
  city: string;
  postcode: string;
  district?: string;
  suburb?: string;
  county?: string;
  lon: number;
  lat: number;
  formatted: string;
  address_line1?: string;
  address_line2?: string;
}

const getRandomApiKey = (): string => {
  const randomIndex = Math.floor(Math.random() * API_KEYS.length);
  return API_KEYS[randomIndex];
};

const getSavedLocation = (): LocationData | null => {
  try {
    const saved = localStorage.getItem("bn_user_location");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const findBestLocationMatch = (
  locations: LocationData[],
  savedLocation: LocationData | null,
): LocationData => {
  if (!savedLocation || locations.length === 0) {
    return (
      locations[0] || {
        country: "",
        country_code: "",
        state: "",
        city: "",
        postcode: "",
        lon: 0,
        lat: 0,
        formatted: "",
      }
    );
  }

  // First priority: Exact county match
  if (savedLocation.county) {
    const countyMatch = locations.find(
      (loc) =>
        loc.county?.toLowerCase() === savedLocation.county?.toLowerCase(),
    );
    if (countyMatch) {
      return countyMatch;
    }
  }

  // Second priority: Exact city match
  const cityMatch = locations.find(
    (loc) => loc.city?.toLowerCase() === savedLocation.city?.toLowerCase(),
  );
  if (cityMatch) {
    return cityMatch;
  }

  // Third priority: Match by country and state
  const stateCountryMatch = locations.find(
    (loc) =>
      loc.country_code?.toLowerCase() ===
        savedLocation.country_code?.toLowerCase() &&
      loc.state?.toLowerCase() === savedLocation.state?.toLowerCase(),
  );
  if (stateCountryMatch) {
    return stateCountryMatch;
  }

  // Fourth priority: Match by country only
  const countryMatch = locations.find(
    (loc) =>
      loc.country_code?.toLowerCase() ===
      savedLocation.country_code?.toLowerCase(),
  );
  if (countryMatch) {
    return countryMatch;
  }

  // Default: Return first result
  return locations[0];
};

export const fetchLocationByPincode = async (
  pincode: string,
): Promise<LocationData | null> => {
  const locations = await fetchLocationsByPincode(pincode);
  return locations.length > 0 ? locations[0] : null;
};

export const fetchLocationsByPincode = async (
  pincode: string,
  userCountryCode?: string,
): Promise<LocationData[]> => {
  try {
    const apiKey = getRandomApiKey();
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${pincode}&limit=10&format=json&apiKey=${apiKey}`,
    );

    if (!response.ok) {
      return await fetchLocationsByPincodeFallback(pincode, userCountryCode);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const locations = data.results.map((result: any) => ({
        country: result.country || "",
        country_code: result.country_code || "",
        state: result.state || "",
        state_code: result.state_code || result.iso3166_2?.split("-")[1] || "",
        city: result.city || "",
        postcode: result.postcode || pincode,
        district: result.district || "",
        suburb: result.suburb || "",
        county: result.county || "",
        lon: result.lon || 0,
        lat: result.lat || 0,
        formatted: result.formatted || "",
        address_line1: result.address_line1 || "",
        address_line2: result.address_line2 || "",
      }));

      if (userCountryCode) {
        const userCountry = userCountryCode.toLowerCase();
        return locations.sort((a: LocationData, b: LocationData) => {
          const aMatch = a.country_code.toLowerCase() === userCountry;
          const bMatch = b.country_code.toLowerCase() === userCountry;
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
          return 0;
        });
      }
      return locations;
    }

    return await fetchLocationsByPincodeFallback(pincode, userCountryCode);
  } catch (error) {
    return await fetchLocationsByPincodeFallback(pincode, userCountryCode);
  }
};

const fetchLocationsByPincodeFallback = async (
  pincode: string,
  userCountryCode?: string,
): Promise<LocationData[]> => {
  try {
    console.log({ userCountryCode });
    if (/^\d{6}$/.test(pincode)) {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await response.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        return data[0].PostOffice.map((po: any) => ({
          country: "India",
          country_code: "in",
          state: po.State || "",
          city: po.District || po.Region || "",
          postcode: pincode,
          district: po.District || "",
          suburb: po.Region || "",
          county: "",
          lon: 0,
          lat: 0,
          formatted: `${po.Region}, ${po.State}, India`,
          address_line1: po.Region || "",
          address_line2: po.State || "",
        }));
      }
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&format=json&limit=10`,
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return data.map((result: any) => ({
        country: result.address?.country || "",
        country_code: result.address?.country_code?.toUpperCase() || "",
        state: result.address?.state || "",
        city: result.address?.city || result.name || "",
        postcode: pincode,
        district: result.address?.district || "",
        suburb: result.address?.suburb || "",
        county: result.address?.county || "",
        lon: Number.parseFloat(result.lon),
        lat: Number.parseFloat(result.lat),
        formatted: result.display_name || "",
        address_line1: result.address?.road || "",
        address_line2: result.address?.city || "",
      }));
    }

    return [];
  } catch (error) {
    return [];
  }
};

export const getCurrentLocation = (): Promise<{
  lat: number;
  lon: number;
} | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        resolve(null);
      },
    );
  });
};

export const reverseGeocode = async (
  lat: number,
  lon: number,
): Promise<LocationData | null> => {
  try {
    const apiKey = getRandomApiKey();
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`,
    );

    if (!response.ok) {
      return await reverseGeocodeFallback(lat, lon);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        country: result.country || "",
        country_code: result.country_code || "",
        state: result.state || "",
        state_code: result.state_code || result.iso3166_2?.split("-")[1] || "",
        city: result.city || "",
        postcode: result.postcode || "",
        district: result.district || "",
        suburb: result.suburb || "",
        county: result.county || "",
        lon: result.lon || lon,
        lat: result.lat || lat,
        formatted: result.formatted || "",
        address_line1: result.address_line1 || "",
        address_line2: result.address_line2 || "",
      };
    }

    return await reverseGeocodeFallback(lat, lon);
  } catch (error) {
    return await reverseGeocodeFallback(lat, lon);
  }
};

const reverseGeocodeFallback = async (
  lat: number,
  lon: number,
): Promise<LocationData | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    );
    const data = await response.json();

    if (data.address) {
      return {
        country: data.address.country || "",
        country_code: data.address.country_code?.toUpperCase() || "",
        state: data.address.state || "",
        city:
          data.address.city || data.address.town || data.address.village || "",
        postcode: data.address.postcode || "",
        district: data.address.district || "",
        suburb: data.address.suburb || "",
        county: data.address.county || "",
        lon,
        lat,
        formatted: data.display_name || "",
        address_line1: data.address.road || "",
        address_line2: "",
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const saveLocationData = (location: LocationData) => {
  localStorage.setItem("bn_user_location", JSON.stringify(location));
};

export const getStoredLocationData = (): LocationData | null => {
  const stored = localStorage.getItem("bn_user_location");
  return stored ? JSON.parse(stored) : null;
};

const GCC_COUNTRIES = ["ae", "sa", "kw", "qa", "bh", "om"];
const SEA_COUNTRIES = [
  "sg",
  "my",
  "th",
  "id",
  "ph",
  "vn",
  "bn",
  "kh",
  "la",
  "mm",
  "tl",
];

export const getMinimumOrderValue = (countryCode: string): number => {
  const code = countryCode.toLowerCase();
  if (code === "in") {
    return 0;
  }
  if (GCC_COUNTRIES.includes(code) || SEA_COUNTRIES.includes(code)) {
    return 3000;
  }
  return 5000;
};

export const meetsMinimumOrder = (
  total: number,
  countryCode: string,
): boolean => {
  const minimum = getMinimumOrderValue(countryCode);
  return total >= minimum;
};

export const lookupPincodeWithGrok = async (
  pincode: string,
): Promise<LocationData | null> => {
  if (!pincode || pincode.length < 3) return null;

  try {
    const savedLocation = getSavedLocation();

    // Use Geoapify API with fallbacks for pincode lookup
    const locations = await fetchLocationsByPincode(pincode);

    if (locations && locations.length > 0) {
      if (locations.length > 1) {
        return findBestLocationMatch(locations, savedLocation);
      }
      // If only one result, use it directly
      return locations[0];
    }

    return null;
  } catch (error) {
    console.error("lookupPincodeWithGrok: error during lookup:", error);
    return null;
  }
};
