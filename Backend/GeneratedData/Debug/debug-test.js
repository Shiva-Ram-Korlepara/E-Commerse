import axios from 'axios';

const instance = axios.create({ 
  baseURL: 'http://localhost:3000/api', 
  timeout: 20000 
});

async function testAdmin() {
  const admin = { userName: "Monty", email: "Haylie.VonRueden93@gmail.com", password: "password" };
  
  try {
    console.log('Making request...');
    const signupRes = await instance.post("/admin/signup", admin).catch(e => {
      console.log('Caught error:');
      console.log('e.response:', e.response ? {
        status: e.response.status,
        data: e.response.data
      } : 'no response');
      console.log('e.message:', e.message);
      return e.response || e;
    });
    
    console.log('After catch:');
    console.log('signupRes:', signupRes ? {
      status: signupRes.status,
      data: signupRes.data
    } : 'no signupRes');
    
    if (signupRes && signupRes.status >= 200 && signupRes.status < 300) {
      console.log("Admin created:", signupRes.data.admin?.email || admin.email);
    } else {
      console.log("Admin signup returned status", signupRes?.status);
    }
  } catch (err) {
    console.error("Admin signup error:", err?.response?.data || err.message);
  }
}

testAdmin();
