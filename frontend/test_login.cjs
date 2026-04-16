const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if(msg.type() === 'error') {
            console.log('BROWSER_ERROR:', msg.text());
        }
    });

    page.on('pageerror', error => {
        console.log('PAGE_ERROR:', error.message);
    });

    await page.goto('http://localhost:5173/login/student');
    
    // Fill login
    await page.type('#email', 'aditya111311@gmail.com');
    await page.type('#password', 'password123'); // Adjust if known
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for network/navigation
    await new Promise(r => setTimeout(r, 4000));
    
    await browser.close();
})();
