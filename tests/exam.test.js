// const request = require('supertest');
// const app = require('../server');
// const mongoose = require('mongoose');
// const dbConnection = require('../config/DB_connection');

// describe('Exam Routes', () => {
//   let examToken;
//   let adminToken;
//   let examId;
//   let studentCode;

//   beforeAll(async () => {
//     // Connect to test database
//     await dbConnection();
    
//     // Login as admin to get token
//     const adminResponse = await request(app)
//       .post('/api/admin/login')
//       .send({
//         userName: '01011638721',
//         password: 'MrMahmoud14@##@Ezo'
//       });
    
//     adminToken = adminResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

//     // Create a test student
//     const studentResponse = await request(app)
//       .post('/api/user/add-student')
//       .set('Cookie', [`accessToken=${adminToken}`])
//       .send({
//         name: 'Test Student',
//         studentMobile: '01075435876',
//         parentMobile: '01075435877',
//         grade: 'G4'
//       });

//     // Get the student code from the list
//     const listResponse = await request(app)
//       .get('/api/user/all-Students')
//       .set('Cookie', [`accessToken=${adminToken}`]);

//     const student = listResponse.body.data.find(s => s.studentMobile === '01075435876');
//     studentCode = student.studentCode;

//     // Create a test exam
//     const examResponse = await request(app)
//       .post('/api/exam/add-exam')
//       .set('Cookie', [`accessToken=${adminToken}`])
//       .send({
//         title: 'Test Exam',
//         description: 'Test Description',
//         grade: 'G4',
//         date: new Date(Date.now() + 3600000).toISOString().split('T')[0], // 1 hour from now
//         time: new Date(Date.now() + 3600000).toISOString().split('T')[1].substring(0, 5), // 1 hour from now
//         duration: '30M',
//         questions: [
//           {
//             question_title: 'Test Question',
//             subQuestions: [
//               {
//                 questionText: 'Test Question 1',
//                 options: ['A', 'B', 'C', 'D'],
//                 correctAnswer: 'A'
//               }
//             ]
//           }
//         ]
//       });

//     examId = examResponse.body.data;
//   }, 30000);

//   afterAll(async () => {
//     // Close database connection
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
//   }, 30000);

//   describe('POST /api/exam/login-to-exam', () => {
//     it('should login to exam successfully', async () => {
//       // Get exam code
//       const examResponse = await request(app)
//         .get('/api/exam/get-all-exam')
//         .set('Cookie', [`accessToken=${adminToken}`]);

//       const exam = examResponse.body.data.find(e => e._id === examId);
//       expect(exam).toBeTruthy();
//       const examCode = exam.examCode;

//       const response = await request(app)
//         .post('/api/exam/login-to-exam')
//         .send({
//           examCode: examCode,
//           studentCode: studentCode
//         });

//       expect(response.status).toBe(200);
//       expect(response.body.data).toHaveProperty('message', 'Login successfully');
//       expect(response.body.data).toHaveProperty('examCode');
//       expect(response.body.data).toHaveProperty('studentCode');
      
//       const cookies = response.headers['set-cookie'];
//       expect(cookies).toBeTruthy();
//       examToken = cookies[0].split(';')[0].split('=')[1];
//     }, 10000);
//   });

//   describe('GET /api/exam/take-exam', () => {
//     it('should get exam questions when authenticated', async () => {
//       expect(examToken).toBeTruthy();
      
//       const response = await request(app)
//         .get('/api/exam/take-exam')
//         .set('Cookie', [`exam=${examToken}`]);

//       expect(response.status).toBe(200);
//       expect(response.body.data).toHaveProperty('remainingTime');
//       expect(response.body.data).toHaveProperty('exam');
//       expect(response.body.data.exam).toHaveProperty('questions');
//       expect(response.body.data.exam.questions[0]).toHaveProperty('question_title');
//       expect(response.body.data.exam.questions[0]).toHaveProperty('subQuestions');
//     }, 10000);
//   });

//   describe('POST /api/exam/submit-exam', () => {
//     it('should submit exam answers successfully', async () => {
//       expect(examToken).toBeTruthy();
      
//       const response = await request(app)
//         .post('/api/exam/submit-exam')
//         .set('Cookie', [`exam=${examToken}`])
//         .send({
//           answers: [
//             { questionId: '1', answer: 'A' }
//           ]
//         });

//       expect(response.status).toBe(200);
//       expect(response.body.data).toHaveProperty('studentCode');
//       expect(response.body.data).toHaveProperty('exams');
//       expect(response.body.data.exams[0]).toHaveProperty('examCode');
//       expect(response.body.data.exams[0]).toHaveProperty('score');
//     }, 10000);
//   });

//   describe('Admin Exam Management', () => {
//     describe('POST /api/exam/add-exam', () => {
//       it('should add new exam successfully', async () => {
//         expect(adminToken).toBeTruthy();
        
//         const response = await request(app)
//           .post('/api/exam/add-exam')
//           .set('Cookie', [`accessToken=${adminToken}`])
//           .send({
//             title: 'Test Exam 2',
//             description: 'Test Description 2',
//             grade: 'G4',
//             date: new Date(Date.now() + 3600000).toISOString().split('T')[0], // 1 hour from now
//             time: new Date(Date.now() + 3600000).toISOString().split('T')[1].substring(0, 5), // 1 hour from now
//             duration: '30M',
//             questions: [
//               {
//                 question_title: 'Test Question',
//                 subQuestions: [
//                   {
//                     questionText: 'Test Question 1',
//                     options: ['A', 'B', 'C', 'D'],
//                     correctAnswer: 'A'
//                   }
//                 ]
//               }
//             ]
//           });

//         expect(response.status).toBe(201);
//         expect(response.body.data).toBeTruthy();
//       }, 10000);
//     });

//     describe('GET /api/exam/get-all-exam', () => {
//       it('should get all exams', async () => {
//         expect(adminToken).toBeTruthy();
        
//         const response = await request(app)
//           .get('/api/exam/get-all-exam')
//           .set('Cookie', [`accessToken=${adminToken}`]);

//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body.data)).toBe(true);
//         if (response.body.data.length > 0) {
//           expect(response.body.data[0]).toHaveProperty('_id');
//           expect(response.body.data[0]).toHaveProperty('examCode');
//           expect(response.body.data[0]).toHaveProperty('title');
//           expect(response.body.data[0]).toHaveProperty('grade');
//           expect(response.body.data[0]).toHaveProperty('date');
//           expect(response.body.data[0]).toHaveProperty('time');
//           expect(response.body.data[0]).toHaveProperty('duration');
//           expect(response.body.data[0]).toHaveProperty('totalQuestions');
//         }
//       }, 10000);
//     });
//   });
// }); 