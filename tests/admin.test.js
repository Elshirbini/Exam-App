const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const dbConnection = require("../config/DB_connection");
const adminDB = require("../models/admin.model");

describe("Admin Routes", () => {
  let adminToken;

  beforeAll(async () => {
    // Connect to test database
    await dbConnection();
    const userName = "01011638721";
    const password = "MrMahmoud14@##@Ezo";
    const role = "super_admin";
    let existingUser = await adminDB.findOne({ userName });
    if (existingUser) {
      return console.log({ message: "superAdmin is already existing" });
    }
    await adminDB.create({ userName, password, role });
    console.log({ message: "superAdmin is created" });
  }, 30000);

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }, 30000);

  describe("POST /api/admin/login", () => {
    it("should login admin successfully", async () => {
      const response = await request(app).post("/api/admin/login").send({
        userName: "01011638721",
        password: "MrMahmoud14@##@Ezo",
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("tokenExpiry");
      expect(response.body.data.role).toBe("super_admin");
      expect(response.body.data.superAdmin).toBe(true);
      adminToken = response.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];
    }, 10000);

    it("should fail with invalid credentials", async () => {
      const response = await request(app).post("/api/admin/login").send({
        userName: "wronguser",
        password: "wrongpass",
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("هذا المسئول غير موجود");
    }, 10000);
  });

  describe("POST /api/admin/add-admin", () => {
    it("should add new admin successfully", async () => {
      const response = await request(app)
        .post("/api/admin/add-admin")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({
          userName: "newadmin123",
          password: "password123",
          role: "user",
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBe("Admin newadmin123 Added successfully");
    }, 10000);
  });

  describe("GET /api/admin/all-admin", () => {
    it("should get all admins", async () => {
      const response = await request(app)
        .get("/api/admin/all-admin")
        .set("Cookie", [`accessToken=${adminToken}`]);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty("userName");
      expect(response.body.data[0]).toHaveProperty("role");
    }, 10000);
  });
});
