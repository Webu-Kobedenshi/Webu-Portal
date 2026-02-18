import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/graphql (POST) health", () => {
    return request(app.getHttpServer())
      .post("/graphql")
      .send({ query: "{ health }" })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.health).toBe("ok");
      });
  });
});
