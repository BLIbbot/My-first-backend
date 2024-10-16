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

describe("GET /api/articles/:article_id", () => {
  test("200 - returns an object containing the correct information based on the article_id provided by the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const articleObj = body.article;
        expect(articleObj[0].article_id).toBe(1);
        expect(articleObj[0].title).toBe("Living in the shadow of a great man");
        expect(articleObj[0].topic).toBe("mitch");
        expect(articleObj[0].author).toBe("butter_bridge");
        expect(articleObj[0].body).toBe("I find this existence challenging");
        expect(articleObj[0].created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(articleObj[0].votes).toBe(100);
        expect(articleObj[0].article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("404 - returns article not found if the article associated with the given id does not exist", () => {
    return request(app)
      .get("/api/articles/404")
      .expect(404)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("article not found");
      });
  });
  test("400 - returns invalid request if the client request does not match the expected request conditions", () => {
    return request(app)
      .get("/api/articles/unexpectedInput")
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
});
