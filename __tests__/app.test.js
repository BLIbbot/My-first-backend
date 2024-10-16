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

describe("GET /api/articles", () => {
  test("200 - returns a sorted array of objects containing all available articles ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comments_count).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.votes).toBe("number");
          expect(article.body).toBeUndefined();
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200 - should return all of the comments with the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const response = body.comments;
        expect(response.length).toBe(11);
        expect(response).toBeSortedBy("created_at", { descending: true });
        response.forEach((comment) => {
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.comment_id).toBe("number");
        });
      });
  });
  test("404 - returns article not found if the article associated with the given id does not exist", () => {
    return request(app)
      .get("/api/articles/404/comments")
      .expect(404)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("page not found");
      });
  });
  test("400 - returns invalid request if the client request does not match the expected request conditions", () => {
    return request(app)
      .get("/api/articles/unexpectedInput/comments")
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201 - adds a comment to an article", () => {
    return request(app)
      .post("/api/articles/6/comments")
      .send({
        body: "The owls are not what they seem.",
        author: "icellusedkars",
      })
      .expect(201)
      .then(({ body }) => {
        const newComment = body.postedComment;
        expect(typeof newComment.comment_id).toBe("number");
        expect(typeof newComment.body).toBe("string");
        expect(typeof newComment.author).toBe("string");
        expect(typeof newComment.created_at).toBe("string");
        expect(typeof newComment.article_id).toBe("number");
        expect(typeof newComment.votes).toBe("number");
      });
  });
  test("201 - ignores extra attributes when adding a comment to an article", () => {
    return request(app)
      .post("/api/articles/6/comments")
      .send({
        body: "The owls are not what they seem.",
        author: "icellusedkars",
        extraAttribute: "plz ignore me",
      })
      .expect(201)
      .then(({ body }) => {
        const newComment = body.postedComment;
        expect(typeof newComment.comment_id).toBe("number");
        expect(typeof newComment.body).toBe("string");
        expect(typeof newComment.author).toBe("string");
        expect(typeof newComment.created_at).toBe("string");
        expect(typeof newComment.article_id).toBe("number");
        expect(typeof newComment.votes).toBe("number");
      });
  });
  test("400 - when not passed all required attributes", () => {
    return request(app)
      .post("/api/articles/unexpectedInput/comments")
      .send({
        author: "icellusedkars",
        extraAttribute: "plz ignore me",
      })
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
  test("404 - when passed an invalid id", () => {
    return request(app)
      .post("/api/articles/404/comments")
      .expect(404)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("User does not exist");
      });
  });
  test("404 - when the author/username attribute doesnt exist", () => {
    return request(app)
      .post("/api/articles/6/comments")
      .send({
        body: "The owls are not what they seem.",
      })
      .expect(404)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("User does not exist");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200 - successful patch the article was updated", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const voteCount = body;
        console.log(body);
        expect(voteCount.votes).toBe(101);
      });
  });
  test("400 - bad request, the body is empty", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
  test("400 - bad request, the body does not contain appropriate data", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "invalidField" })
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
});
