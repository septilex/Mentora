import fs from 'fs';

async function testUploadFlow() {
  console.log("Starting full authentication and upload test...");
  const baseUrl = "http://localhost:3000";

  // 1. Get CSRF Token
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  const initialCookies = csrfRes.headers.get('set-cookie');
  console.log("CSRF Token:", csrfToken);

  // 2. Perform Login
  const loginData = new URLSearchParams();
  loginData.append("email", "prajit@mentora.edu");
  loginData.append("password", "password");
  loginData.append("csrfToken", csrfToken);
  loginData.append("json", "true");

  const loginRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": initialCookies || ""
    },
    body: loginData,
    redirect: "manual"
  });

  const setCookieHeader = loginRes.headers.get("set-cookie");
  console.log("Login Status:", loginRes.status);
  
  if (!setCookieHeader || !setCookieHeader.includes("authjs.session-token")) {
    console.error("Session cookie was not created!");
    const text = await loginRes.text();
    console.error("Login Response:", text);
    return;
  }
  
  console.log("Session cookie successfully created.");

  // Extract the specific cookies needed
  const cookies = (initialCookies ? initialCookies.split(',').map(c => c.split(';')[0]).join('; ') + '; ' : '') + 
                 setCookieHeader.split(',').map(c => c.split(';')[0]).join('; ');

  // 3. Download a real PDF for testing
  console.log("Downloading sample PDF...");
  const pdfRes = await fetch("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
  const pdfBuffer = await pdfRes.arrayBuffer();
  fs.writeFileSync('dummy.pdf', Buffer.from(pdfBuffer));
  
  const formData = new FormData();
  const blob = new Blob([fs.readFileSync('dummy.pdf')], { type: 'application/pdf' });
  formData.append('file', blob, 'dummy.pdf');

  // 4. Test Upload Route
  console.log("Testing upload route with authenticated session...");
  const uploadRes = await fetch(`${baseUrl}/api/upload`, {
    method: "POST",
    headers: {
      "Cookie": cookies
    },
    body: formData
  });

  console.log("Upload Status:", uploadRes.status);
  const result = await uploadRes.json();
  console.log("Upload Result:", result);

  if (uploadRes.status === 401) {
    console.error("Upload failed: Unauthorized (401)");
  } else if (result.success) {
    console.log("Upload worked end-to-end!");
  }
  
  // Cleanup
  fs.unlinkSync('dummy.pdf');
}

testUploadFlow().catch(console.error);
