const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    let crashError = null;

    page.on('console', msg => {
        if(msg.type() === 'error') {
            const text = msg.text();
            if(text.includes('TypeError') || text.includes('ReferenceError') || text.includes('Error:')) {
                console.log('REACT_ERROR:', text);
            }
        }
    });

    page.on('pageerror', error => {
        console.log('PAGE_ERROR:', error.message);
    });

    await page.goto('http://localhost:5173/login/student');
    await new Promise(r => setTimeout(r, 1000));
    
    // Fill login
    await page.type('#email', 'siddharthkumar1234@gmail.com');
    await page.type('#password', 'password123'); // Assuming standard mock
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for network/navigation
    await new Promise(r => setTimeout(r, 3000));
    
    console.log("DUMPING HTML:");
    // See if the UI has empty root
    const rootHtml = await page.$eval('#root', el => el.innerHTML);
    if (!rootHtml) console.log("ROOT IS EMPTY (White Screen of Death)");
    else console.log("ROOT is populated.");
    
    await browser.close();
})();
