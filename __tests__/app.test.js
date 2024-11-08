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
        expect(topics.length).toBe(4);
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

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200 - should return an article by artilce_id with comment_count, which is the total count of all the comments with this article_id.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const articleObj = body.article;
        expect(articleObj[0].article_id).toBe(1);
        expect(articleObj[0].comment_count).toBe("11");
      });
  });
});

describe("GET /api/articles", () => {
  test("200 - returns a sorted array of objects containing all available articles ", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
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
          expect(typeof article.comments_count).toBe("number");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.votes).toBe("number");
          expect(article.body).toBeUndefined();
        });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200 - gets all articles defaults to sorted by created_at date, decending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles[0]).toHaveProperty("title");
      });
  });
  test("200 - gets all articles sorted by votes, ascending order", () => {
    return (
      request(app)
        .get("/api/articles?sort_by=votes&order=ASC")
        //.query({ sort_by: "votes", order: "ASC" })
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toHaveLength(13);
          expect(articles).toBeSortedBy("votes", { acsending: true });
          expect(articles[0]).toHaveProperty("votes");
        })
    );
  });
  test("400 - Invalid input if query values are not greenlisted", () => {
    return request(app)
      .get("/api/articles?sort_by=Bad&order=Request")
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200 - gets all articles sorted by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("topic");
      });
  });
  test('200 - returns all articles if "topic" is ommited from the query', () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
      });
  });
});

describe("POST /api/articles", () => {
  test("201 - Posts article and returns an object containing all relevant article data", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "A testarticle",
        topic: "testarticles",
        author: "Benjamin",
        body: "This is my testarticle",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty(
          "author",
          "title",
          "body",
          "topic",
          "article_img_url",
          "article_id",
          "votes",
          "comment_count",
          "created_at"
        );
      });
  });
  test("201 - Posts article and returns an object containing all relevant article data (article_img_url defaults when not included)", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "A testarticle",
        topic: "testarticles",
        author: "Benjamin",
        body: "This is my testarticle",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
      });
  });
  test("201 - ignores unexpected attributes when posting an article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "A testarticle",
        topic: "testarticles",
        author: "Benjamin",
        body: "This is my testarticle",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        extraAttribute: "plz ignore me",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).not.toHaveProperty("extraAttribute");
      });
  });
  test("400 - invalid request when not passed valid topic", () => {
    return request(app)
      .post("/api/articles/unexpectedInput/comments")
      .send({
        topic: "invalidtopic",
        author: "Benjamin",
        body: "This is my testarticle",
        extraAttribute: "plz ignore me",
      })
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
  test("400 - invalid request when not passed valid author", () => {
    return request(app)
      .post("/api/articles/unexpectedInput/comments")
      .send({
        topic: "testarticles",
        author: "invalidauthor",
        body: "This is my testarticle",
        extraAttribute: "plz ignore me",
      })
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
  test("400 - when not passed all required attributes", () => {
    return request(app)
      .post("/api/articles/unexpectedInput/comments")
      .send({
        topic: "testarticles",
        author: "Benjamin",
        body: "This is my testarticle",
        extraAttribute: "plz ignore me",
      })
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
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

describe("DELETE /api/comments/:comment_id", () => {
  test("204 - comment was succesfully deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        const response = body;
        expect(response).toMatchObject({});
      });
  });
  test("400 - returns invalid request if the client request does not match the expected request conditions", () => {
    return request(app)
      .delete("/api/comments/unexpectedInput")
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
  test("404 - returns comment not found if the comment associated with the given id does not exist", () => {
    return request(app)
      .delete("/api/comments/404")
      .expect(404)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200 - returns all related user data ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body;
        expect(users[0].username).toContain("butter_bridge");
        expect(users[0].name).toContain("jonny");
        expect(users[0].avatar_url).toContain(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
        expect(users[0]).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
        expect(users.length).toBe(5);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200 - returns an object with the associated username, avatar_URL, and name", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(typeof user.name).toBe("string");
        expect(user).toMatchObject({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("404 - Username can not be found if the username doesnt exist in the database", () => {
    return request(app)
      .get("/api/users/notrealusername")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User does not exist");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200 - Succesful patch the comment vote count was updated by 1", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(17);
        expect(comment.author).toBe("butter_bridge");
      });
  });
  test("200 - Succesful patch the comment vote count was updated by -1", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(15);
        expect(comment).toHaveProperty(
          "comment_id",
          "body",
          "article_id",
          "author",
          "votes",
          "created_at"
        );
      });
  });
  test("400 - bad request, the body is empty", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
  test("400 - bad request, the body does not contain appropriate data", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "invalidField" })
      .expect(400)
      .then(({ body }) => {
        const errMsg = body.msg;
        expect(errMsg).toBe("Invalid request");
      });
  });
});
