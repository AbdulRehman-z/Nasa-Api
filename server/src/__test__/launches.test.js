import { app } from "../app.js";
import request from "supertest";
import { mongoConnect, mongodisconnect } from "../services/mongoose.services";

describe("Launches API", function () {
  beforeAll(async () => await mongoConnect());
  afterAll(async () => await mongodisconnect());

  describe("Get/Launches", () => {
    test("This should ruturn Get/Launches", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-type", /json/)
        .expect(200);
    });
  });

  describe("Post/launches", () => {
    const completeLaunchData = {
      rocket: "JF-17 Thunder",
      mission: "Destroy Isreal",
      target: "Isreal",
      launchDate: "January 01, 2023",
    };

    const LaunchDataWithoutDate = {
      rocket: "JF-17 Thunder",
      mission: "Destroy Isreal",
      target: "Isreal",
    };

    const launchDataWithInvalidDate = {
      rocket: "JF-17 Thunder",
      mission: "Destroy Isreal",
      target: "Isreal",
      launchDate: "ZOOT",
    };

    test("This should ruturn Post/launches", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(completeLaunchData.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(LaunchDataWithoutDate);
    });

    test("This should catch missing property ", async () => {
      const response = await request(app)
        .post("/launches")
        .send(LaunchDataWithoutDate)
        .expect("Content-type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Please provide valid inputs.",
      });
    });

    test("This should catch invalid launch date", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid date format",
      });
    });
  });
});
