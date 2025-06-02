const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const dbConnection = require("../config/DB_connection");

describe("User Routes", () => {
  let adminToken;
  let studentId;

  beforeAll(async () => {
    // Connect to test database
    await dbConnection();

    // Login to get token
    const response = await request(app).post("/api/admin/login").send({
      userName: "01011638721",
      password: "MrMahmoud14@##@Ezo",
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("tokenExpiry");
    expect(response.body.data.role).toBe("super_admin");
    expect(response.body.data.superAdmin).toBe(true);
    adminToken = response.headers["set-cookie"][0].split(";")[0].split("=")[1];
    console.log(adminToken);
  }, 30000);

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }, 30000);

  describe("GET /api/user/all-Students", () => {
    it("should get all students when authenticated", async () => {
      const response = await request(app)
        .get("/api/user/all-Students")
        .set("Cookie", [`accessToken=${adminToken}`]);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty("name");
        expect(response.body.data[0]).toHaveProperty("studentCode");
        expect(response.body.data[0]).toHaveProperty("grade");
        expect(response.body.data[0]).toHaveProperty("studentMobile");
        expect(response.body.data[0]).toHaveProperty("parentMobile");
      }
    }, 10000);
  });

  describe("POST /api/user/add-student", () => {
    it("should add new student successfully", async () => {
      const response = await request(app)
        .post("/api/user/add-student")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({
          name: "Test Student",
          studentMobile: "01075435868",
          parentMobile: "01075435869",
          grade: "G4",
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toBe("Student created successfully");

      // Get the student ID from the list
      const listResponse = await request(app)
        .get("/api/user/all-Students")
        .set("Cookie", [`accessToken=${adminToken}`]);

      const student = listResponse.body.data.find(
        (s) => s.studentMobile === "01075435868"
      );
      studentId = student._id;
    }, 10000);
  });

  describe("PUT /api/user/update-student/:studentId", () => {
    it("should update student successfully", async () => {
      // First create a student to update
      const createResponse = await request(app)
        .post("/api/user/add-student")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({
          name: "Test Student",
          studentMobile: "01075435870",
          parentMobile: "01075435871",
          grade: "G5",
        });

      // Get the student ID from the list
      const listResponse = await request(app)
        .get("/api/user/all-Students")
        .set("Cookie", [`accessToken=${adminToken}`]);

      const student = listResponse.body.data.find(
        (s) => s.studentMobile === "01075435870"
      );
      const studentId = student._id;

      const response = await request(app)
        .put(`/api/user/update-student/${studentId}`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({
          name: "Updated Student Name",
          grade: "G6",
          studentMobile: "01075435872",
          parentMobile: "01075435873",
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBe("Student updated successfully");
    }, 10000);
  });

  describe("DELETE /api/user/delete-student/:studentId", () => {
    it("should delete student successfully", async () => {
      // First create a student to delete
      const createResponse = await request(app)
        .post("/api/user/add-student")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({
          name: "Test Student",
          studentMobile: "01075435874",
          parentMobile: "01075435875",
          grade: "G7",
        });

      // Get the student ID from the list
      const listResponse = await request(app)
        .get("/api/user/all-Students")
        .set("Cookie", [`accessToken=${adminToken}`]);

      const student = listResponse.body.data.find(
        (s) => s.studentMobile === "01075435874"
      );
      const studentId = student._id;

      const response = await request(app)
        .delete(`/api/user/delete-student/${studentId}`)
        .set("Cookie", [`accessToken=${adminToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe("Student deleted successfully");
    }, 10000);
  });
});
