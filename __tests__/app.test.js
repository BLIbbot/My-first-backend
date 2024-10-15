const request = require("supertest");
const { app } = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const APIList = require("../endpoints.json");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  db.end();
});

describe("GET/api/topics", () => {
  test("200 - returns all related topicData ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET/api", () => {
  test("200 - returns a list of all available API's with a  brief description of thir purpose & the functionality of the endpoint, acceptable queries, the format of the request body, and an example response.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const allAPIS = body.APIList;
        expect(allAPIS).toStrictEqual(APIList);
      });
  });
});
