
async function runTest() {
  console.log("Starting full RAG test...");
  
  // 1. Authenticate
  const csrfRes = await fetch("http://localhost:3000/api/auth/csrf");
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  const initialCookies = csrfRes.headers.get('set-cookie');
  
  const loginRes = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": initialCookies || ''
    },
    body: new URLSearchParams({
      email: 'prajit@mentora.edu',
      password: 'password',
      csrfToken: csrfToken,
      json: 'true'
    }),
    redirect: 'manual'
  });
  
  const setCookieHeader = loginRes.headers.get('set-cookie');
  const cookies = (initialCookies ? initialCookies.split(',').map(c => c.split(';')[0]).join('; ') + '; ' : '') + 
                 (setCookieHeader ? setCookieHeader.split(',').map(c => c.split(';')[0]).join('; ') : '');

  console.log("Session authenticated.");

  // Test 1: In-Context Question
  const inContextQuery = "What type of file is this?";
  console.log(`\nTesting In-Context Query: "${inContextQuery}"`);
  
  const res1 = await fetch("http://localhost:3000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Cookie": cookies },
    body: JSON.stringify({ query: inContextQuery })
  });

  const result1 = await res1.json();
  console.dir(result1, { depth: null, colors: true });

  // Test 2: Out-of-Context Question
  const outOfContextQuery = "What is the capital of France?";
  console.log(`\nTesting Out-of-Context Query: "${outOfContextQuery}"`);
  
  const res2 = await fetch("http://localhost:3000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Cookie": cookies },
    body: JSON.stringify({ query: outOfContextQuery })
  });

  const result2 = await res2.json();
  console.dir(result2, { depth: null, colors: true });
}

runTest();
