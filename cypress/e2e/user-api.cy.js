describe('User Management API - Data Driven Testing Suite', () => {

  beforeEach(function () {
    cy.fixture('user_data').as('users');
  });

  // ลูป Data-Driven รันเทสเคสออโต้
  it('Should run all 7 test cases from JSON fixture', function () {
    
    // สั่งให้ Cypress วนลูปข้อมูลผู้ใช้ทุกคนที่อยู่ในไฟล์ JSON
    this.users.forEach((testCase) => {
      
      cy.log(`กำลังวิ่งเทสเคส: ${testCase.id} - ${testCase.scenario}`);

      cy.request({
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts', // เว็บ API จำลอง
        failOnStatusCode: false, // ไม่ให้ Cypress พังเมื่อเจอสเตตัส 400 
        body: {
          name: testCase.name,
          job: testCase.job,
          email: testCase.email
        }
      }).then((response) => {
        
        //  (Assertions) ออโต้ตามที่ Sheets และ JSON วางแผนไว้
        
        // 1. ตรวจสอบเลข Status Code หลังบ้าน (เช่น 201 หรือ 400)
        expect(response.status).to.be.oneOf([201, 200, 400]); 
        
        // 2. ตรวจสอบว่าข้อมูลที่ยิงไป ถูกส่งกลับมาครบถ้วนถูกต้องไหม
        if (testCase.expectedStatus === 201) {
          expect(response.body).to.have.property('name', testCase.name);
          expect(response.body).to.have.property('job', testCase.job);
        }
        
      });

    });

  });

});

