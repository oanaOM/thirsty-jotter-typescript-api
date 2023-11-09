import { http, HttpResponse } from "msw";
import { plants } from "../../src/models/plants";

export const getPlants = [
  http.get("http://localhost:7000/api/plants", () => {
    return HttpResponse.json(plants);
  }),
];
